# Ingestion Service Documentation (Google Apps Script → Convex)

`GoogleAppsScript.js` runs on a time-based trigger in Google Apps Script. It watches Gmail for the weekly results CSV and posts the file, unchanged, to the league's Convex backend. All parsing, validation, and storage happen on the server (`app/convex/`), so the script is only email plumbing plus notifications.

## The data model in one paragraph

Every results email contains the **complete season**. The backend therefore keeps one document per received sheet in a single `imports` table (season, email metadata, every parsed row, warnings). The public query `league.get` reads the most recent import and computes divisions, teams, standings, match lists, and upcoming fixtures from it on the fly. There are no division, team, or match tables to maintain: a division exists because rows mention it, a team exists because it appears in a row. Every email is a version, and rolling back is deleting one document.

## Workflow

1. **Email discovery** — unread emails from `TARGET_SENDERS` with subject `TARGET_SUBJECT`.
2. **Attachment handling** — collects CSV attachments, marks the messages read, applies the `Processed_Pickleball_Results` label.
3. **Newest wins** — only the most recent email is processed (each sheet is the full season).
4. **POST to Convex** — `{ csv, season, receivedAt, source: { subject, from, messageId, fileName } }` to `CONVEX_INGEST_URL` with `Authorization: Bearer <CONVEX_INGEST_SECRET>`.
5. **Server side** (`convex/ingest.ts`, one transaction):
   - parses the CSV (`convex/lib/csv.ts`): `division, team1, "v", team2, D-Mon-YY, t1Wins, t2Wins, t1Points, t2Points`;
   - rows with blank wins are **fixtures** (kept, shown as upcoming); rows with wins but blank points are recorded as **0-0 with a warning**; rows with unparseable numbers or dates are **errors** and skipped;
   - warns when total games ≠ 6 (≠ 8 or 9 for CPL) but still ingests the row;
   - **safety gates**: no played rows → skipped (`zero_rows`); fewer played rows than the previous import **of the same season** → skipped (`fewer_rows`) unless `force: true`;
   - diffs against the previous import of the same season (`convex/lib/diff.ts`) by division + date + the two team names (order-insensitive, repeat pairings numbered);
   - stores the new import unless `dryRun: true`.
6. **Notifications** — the script emails a "Leaderboard Updated" summary of new/modified matches to `NOTIFICATION_RECIPIENT` (or the sender) and posts a status embed to Discord with counts, new teams, and validation notes.

## Configuration (Script Properties)

| Property | Description |
| :--- | :--- |
| `CONVEX_INGEST_URL` | `https://<deployment>.convex.site/ingest` — note **`.convex.site`**, not `.convex.cloud`. |
| `CONVEX_INGEST_SECRET` | Must equal the `INGEST_SECRET` environment variable on that Convex deployment (`npx convex env set INGEST_SECRET … --prod`). |
| `SEASON` | Label stored with each import, e.g. `Summer 2026`. Shown in the site header. **Change it before the first sheet of a new season**: the safety gate and diff only compare sheets within the same season, so a Fall sheet posted as "Summer" is refused with `fewer_rows`. |
| `TARGET_SENDERS` | Comma-separated list of authorised sender addresses. |
| `TARGET_SUBJECT` | Exact subject line to match. |
| `NOTIFICATION_RECIPIENT` | Optional; defaults to the sender. |
| `DISCORD_WEBHOOK_URL` | Optional. |

Run `testIngestDryRun()` from the Apps Script editor after changing the URL or secret: it re-posts the most recently processed sheet with `dryRun: true` and logs the response.

## Ingest endpoint contract

`POST /ingest` — JSON body:

```json
{ "csv": "<raw file>", "season": "Summer 2026", "receivedAt": 1757500000000,
  "source": { "subject": "...", "from": "...", "messageId": "...", "fileName": "Export-5.csv" },
  "dryRun": false, "force": false }
```

Responses: `401` bad/missing bearer token, `400` malformed body, `500` if the secret is not configured, otherwise `200` with:

```json
{ "ok": true, "dryRun": false, "skippedReason": null, "importId": "...",
  "previousCount": 235, "newCount": 239, "rowCount": 244,
  "newTeams": [{ "division": "Division B4", "team": "..." }],
  "warnings": ["Row 133: points missing for ..."], "errors": [],
  "newMatches": { "Division A": [{ "date": "2026-06-24", "team1": "...", "team2": "...", "team1Wins": 4, "team2Wins": 2, "team1Points": 57, "team2Points": 42 }] },
  "modifiedMatches": {} }
```

`skippedReason` is `"fewer_rows"` or `"zero_rows"` when the safety gates fire (`ok: false`).

## Manual operations

From `app/` with `INGEST_URL` and `INGEST_SECRET` set in your shell:

```bash
# Dry run a sheet against production
jq -Rs '{csv: ., season: "Summer 2026", source: {subject: "manual"}, dryRun: true}' ~/Downloads/Export-5.csv \
  | curl -sS -X POST "$INGEST_URL" -H "Authorization: Bearer $INGEST_SECRET" -H 'content-type: application/json' -d @-

# Undo the most recent import (the previous one becomes live immediately)
npx convex run ingest:rollback --prod

# Backup (zip of every import)
npm run backup
```

Division display names come from `convex/lib/divisions.ts` (`CPL` → `Cayman Premier League`, anything else → `Division <code>`).
