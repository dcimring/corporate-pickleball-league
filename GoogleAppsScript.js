// Corporate Pickleball League — results ingestion (Google Apps Script)
//
// Watches Gmail for the weekly results CSV and posts it, unchanged, to the
// league's Convex backend. All parsing, validation, and storage happen on the
// server; this script only handles email plumbing and notifications.
//
// CONFIGURATION — Project Settings > Script Properties:
//   CONVEX_INGEST_URL       https://<deployment>.convex.site/ingest  (note: .convex.site, not .convex.cloud)
//   CONVEX_INGEST_SECRET    Shared secret; must match the INGEST_SECRET env var on the Convex deployment
//   SEASON                  Season label stored with each import, e.g. "Summer 2026"
//   TARGET_SENDERS          Comma-separated list of email addresses allowed to send results
//   TARGET_SUBJECT          Exact subject line to match, e.g. "Corporate League Results"
//   NOTIFICATION_RECIPIENT  (optional) Where to send the "Leaderboard Updated" summary; defaults to the sender
//   DISCORD_WEBHOOK_URL     (optional) Webhook for status notifications

const CONFIG = {
  PROCESSED_LABEL: 'Processed_Pickleball_Results'
};

// Entry point for the time-based trigger.
function processMatchResults() {
  const props = PropertiesService.getScriptProperties();
  const targetSenders = props.getProperty('TARGET_SENDERS');
  const targetSubject = props.getProperty('TARGET_SUBJECT');

  if (!targetSenders || !targetSubject) {
    log("Error: TARGET_SENDERS or TARGET_SUBJECT not set in Script Properties.");
    return;
  }

  // Gmail search syntax for OR is {sender1 sender2}. The search is only a
  // pre-filter: `from:` matches tokens anywhere in the From header, so every
  // message is re-checked below against the exact allowlist before its
  // attachment is trusted.
  const allowedSenders = targetSenders.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
  const sendersList = allowedSenders.join(' ');
  const searchQuery = `from:{${sendersList}} subject:"${targetSubject}" is:unread`;
  log(`Searching for emails: ${searchQuery}`);

  const threads = GmailApp.search(searchQuery);
  if (threads.length === 0) {
    log("No new emails found.");
    return;
  }
  log(`Found ${threads.length} unread threads.`);

  // Collect every CSV attachment from unread messages, then mark them read.
  const emailsToProcess = [];
  for (const thread of threads) {
    for (const message of thread.getMessages()) {
      if (!message.isUnread()) continue;
      const senderAddress = extractEmailAddress(message.getFrom()).toLowerCase();
      if (!allowedSenders.includes(senderAddress)) {
        // Lookalike or spoofed sender that slipped through the Gmail search.
        log(`Ignoring message from unauthorised sender "${message.getFrom()}" (subject: "${message.getSubject()}").`);
        sendDiscordNotification(false, "Ignored Email", `Results-style email from unauthorised sender: ${message.getFrom()}`, { "Email Subject": message.getSubject() });
        message.markRead();
        continue;
      }
      for (const attachment of message.getAttachments()) {
        if (attachment.getContentType() === 'text/csv' || attachment.getName().endsWith('.csv')) {
          emailsToProcess.push({
            date: message.getDate(),
            subject: message.getSubject(),
            attachment: attachment,
            messageId: message.getId(),
            from: message.getFrom()
          });
        }
      }
      message.markRead();
    }
    addLabel(thread);
  }

  if (emailsToProcess.length === 0) {
    log("No CSV attachments found in the unread emails.");
    return;
  }

  // Only the newest sheet matters: each one is the complete season.
  emailsToProcess.sort((a, b) => b.date.getTime() - a.date.getTime());
  const newest = emailsToProcess[0];
  log(`Processing newest email: "${newest.subject}" from ${formatDate(newest.date)}`);

  const result = postIngest(newest, { dryRun: false });
  if (!result) return; // postIngest already reported the failure

  const stats = buildStats(newest, result);

  if (result.skippedReason) {
    const msg = result.skippedReason === 'fewer_rows'
      ? `WARNING: New data has fewer played matches (${result.newCount}) than the current import (${result.previousCount}). Skipping update.`
      : "WARNING: New CSV has 0 played matches. Skipping.";
    log(msg);
    sendDiscordNotification(false, "Ingestion Skipped", msg, stats);
    return;
  }

  log("Ingestion complete.");
  const recipient = props.getProperty('NOTIFICATION_RECIPIENT') || extractEmailAddress(newest.from);
  sendUpdateEmail(recipient, newest, result.newMatches, result.modifiedMatches);
  sendDiscordNotification(true, "Ingestion Successful", "Match data has been updated.", stats);
}

// Manual helper: re-sends the most recently processed sheet with dryRun=true
// and logs the server's response. Run it from the editor after changing the
// URL or secret to confirm the connection without touching the data.
function testIngestDryRun() {
  const props = PropertiesService.getScriptProperties();
  const label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!label) {
    log("No processed emails found (label missing).");
    return;
  }
  const threads = label.getThreads(0, 5);
  let newest = null;
  for (const thread of threads) {
    for (const message of thread.getMessages()) {
      for (const attachment of message.getAttachments()) {
        if (attachment.getContentType() === 'text/csv' || attachment.getName().endsWith('.csv')) {
          const candidate = { date: message.getDate(), subject: message.getSubject(), attachment, messageId: message.getId(), from: message.getFrom() };
          if (!newest || candidate.date.getTime() > newest.date.getTime()) newest = candidate;
        }
      }
    }
  }
  if (!newest) {
    log("No CSV attachment found in the recently processed emails.");
    return;
  }
  log(`Dry run with "${newest.subject}" (${formatDate(newest.date)})`);
  log(`Posting to ${props.getProperty('CONVEX_INGEST_URL')} as season "${props.getProperty('SEASON')}"`);
  const result = postIngest(newest, { dryRun: true });
  if (!result) return;
  // The full response is too large for the Apps Script log; summarise it.
  // previousCount is the number of played matches in the import the server
  // compared against. 0 means it found no earlier import for this SEASON.
  const summary = {
    ok: result.ok,
    skippedReason: result.skippedReason || null,
    previousCount: result.previousCount,
    newCount: result.newCount,
    rowCount: result.rowCount,
    newMatches: countGroupedMatches(result.newMatches),
    modifiedMatches: countGroupedMatches(result.modifiedMatches),
    newTeams: (result.newTeams || []).length,
    errors: result.errors || [],
    warnings: (result.warnings || []).length
  };
  log(JSON.stringify(summary, null, 2));
  if (summary.previousCount === 0 && summary.newCount > 0) {
    log('WARNING: no previous import found for this SEASON. Check that the SEASON script property exactly matches the season label already stored on the deployment.');
  }
}

// --- Convex ---

function postIngest(email, options) {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty('CONVEX_INGEST_URL');
  const secret = props.getProperty('CONVEX_INGEST_SECRET');
  const season = props.getProperty('SEASON');

  if (!url || !secret || !season) {
    const msg = "Missing Script Properties: CONVEX_INGEST_URL, CONVEX_INGEST_SECRET and SEASON are required.";
    log(msg);
    sendDiscordNotification(false, "Service Error", msg);
    return null;
  }

  const payload = {
    csv: email.attachment.getDataAsString(),
    season: season,
    receivedAt: email.date.getTime(),
    source: {
      subject: email.subject,
      from: email.from,
      messageId: email.messageId,
      fileName: email.attachment.getName()
    },
    dryRun: options.dryRun === true,
    force: options.force === true
  };

  let response;
  try {
    response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${secret}` },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (e) {
    const msg = `Could not reach the league backend: ${e}`;
    log(msg);
    sendDiscordNotification(false, "Service Error", msg);
    return null;
  }

  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status !== 200) {
    const msg = `Backend returned HTTP ${status}: ${body.slice(0, 500)}`;
    log(msg);
    sendDiscordNotification(false, "Service Error", msg, { "Email Subject": email.subject });
    return null;
  }

  try {
    return JSON.parse(body);
  } catch (e) {
    log(`Unreadable backend response: ${body.slice(0, 500)}`);
    sendDiscordNotification(false, "Service Error", "Backend returned an unreadable response.");
    return null;
  }
}

function buildStats(email, result) {
  const stats = {
    "Email Subject": email.subject,
    "Email Date": formatDate(email.date),
    "Previous Played": result.previousCount,
    "New Played": result.newCount,
    "Rows In Sheet": result.rowCount
  };
  if (result.newTeams && result.newTeams.length > 0) {
    const names = result.newTeams.map(t => `${t.team} (${t.division})`);
    let msg = names.slice(0, 5).join("\n");
    if (names.length > 5) msg += `\n...and ${names.length - 5} more.`;
    stats["New Teams"] = msg;
  }
  const problems = [].concat(result.errors || [], result.warnings || []);
  if (problems.length > 0) {
    let msg = problems.slice(0, 10).join("\n");
    if (problems.length > 10) msg += `\n...and ${problems.length - 10} more.`;
    stats["Validation Notes"] = msg;
  }
  return stats;
}

// --- Utilities ---

function log(message) {
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd MMM yyyy HH:mm:ss");
  console.log(`${timestamp} - ${message}`);
}

function formatDate(dateObj) {
  return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

// CSV-derived strings (team names, divisions, subjects) go into the HTML
// notification email; escape them so a crafted sheet cannot inject markup.
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractEmailAddress(fromField) {
  if (!fromField) return '';
  const match = fromField.match(/<([^>]+)>/);
  if (match && match[1]) return match[1];
  return fromField;
}

function addLabel(thread) {
  let label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!label) {
    label = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
  }
  thread.addLabel(label);
}

// --- Notifications ---

function sendUpdateEmail(recipient, newestEmail, newMatches, modifiedMatches) {
  if (!recipient) return;

  const processedDate = formatDate(newestEmail.date);
  const subject = `Leaderboard Updated — ${newestEmail.subject}`;
  const newCount = countGroupedMatches(newMatches);
  const modifiedCount = countGroupedMatches(modifiedMatches);

  const groupedHtml = (grouped) => {
    const divisions = Object.keys(grouped || {});
    if (divisions.length === 0) return '<p>None</p>';
    return divisions.map((division) => {
      const items = grouped[division] || [];
      return `
        <h4 style="margin: 16px 0 8px;">${escapeHtml(division)}</h4>
        ${renderMatchesTable(items)}
      `;
    }).join('');
  };

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #1f2937;">
      <h2 style="margin: 0 0 8px;">Leaderboard Updated</h2>
      <p style="margin: 0 0 16px;">Results email processed and website updated.</p>
      <p style="margin: 0 0 16px;"><strong>Processed Email Date:</strong> ${escapeHtml(processedDate)}</p>
      <h3 style="margin: 16px 0 6px;">New Matches (${newCount})</h3>
      ${groupedHtml(newMatches)}
      <h3 style="margin: 16px 0 6px;">Modified Matches (${modifiedCount})</h3>
      ${groupedHtml(modifiedMatches)}
    </div>
  `;

  GmailApp.sendEmail(recipient, subject, '', { htmlBody });
}

function countGroupedMatches(grouped) {
  let total = 0;
  for (const division in (grouped || {})) {
    total += grouped[division].length;
  }
  return total;
}

function renderMatchesTable(matches) {
  if (!matches || matches.length === 0) return '<p>None</p>';

  const headerCell = (label, align) => `
    <th style="padding: 10px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #374151; text-align: ${align || 'left'};">
      ${label}
    </th>
  `;

  const rows = matches.map((match) => {
    const team1IsWinner = getWinnerIsTeam1(match);
    const team2IsWinner = !team1IsWinner;

    return `
      <tr>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827;">${escapeHtml(formatShortDate(match.date))}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827; font-weight: ${team1IsWinner ? 700 : 400};">${escapeHtml(match.team1)}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827; text-align: center; font-weight: ${team1IsWinner ? 700 : 400};">${escapeHtml(match.team1Wins)}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827; text-align: center; font-weight: ${team1IsWinner ? 700 : 400};">${escapeHtml(match.team1Points)}</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #6b7280; text-align: center;">vs</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827; font-weight: ${team2IsWinner ? 700 : 400};">${escapeHtml(match.team2)}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827; text-align: center; font-weight: ${team2IsWinner ? 700 : 400};">${escapeHtml(match.team2Wins)}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #111827; text-align: center; font-weight: ${team2IsWinner ? 700 : 400};">${escapeHtml(match.team2Points)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div style="max-width: 720px; width: 100%; margin: 0 0 12px;">
    <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <thead style="background: #f3f4f6;">
        <tr>
          ${headerCell('Date')}
          ${headerCell('Team 1')}
          ${headerCell('Wins', 'center')}
          ${headerCell('PF', 'center')}
          ${headerCell('vs', 'center')}
          ${headerCell('Team 2')}
          ${headerCell('Wins', 'center')}
          ${headerCell('PF', 'center')}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    </div>
  `;
}

function getWinnerIsTeam1(match) {
  if (match.team1Wins !== match.team2Wins) {
    return match.team1Wins > match.team2Wins;
  }
  if (match.team1Points !== match.team2Points) {
    return match.team1Points > match.team2Points;
  }
  return true;
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  // Use UTC to prevent the date from shifting to the previous day
  // when the script's local timezone is behind UTC.
  return Utilities.formatDate(dateObj, "UTC", "MMM d");
}

function sendDiscordNotification(success, title, description, details) {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  if (!webhookUrl) return;

  // Colors: Green (5763719), Red (15548997)
  const color = success ? 5763719 : 15548997;

  const fields = [];
  if (details) {
    for (const key in details) {
      fields.push({ "name": key, "value": String(details[key]), "inline": true });
    }
  }

  const payload = {
    "embeds": [{
      "title": title,
      "description": description,
      "color": color,
      "fields": fields,
      "footer": { "text": "GAS Ingestion Service" },
      "timestamp": new Date().toISOString()
    }]
  };

  try {
    const response = UrlFetchApp.fetch(webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const statusCode = response.getResponseCode();
    if (statusCode >= 400) {
      const errorBody = response.getContentText();
      log(`Discord Error (${statusCode}): ${errorBody}`);
      if (statusCode === 429) {
        try {
          const data = JSON.parse(errorBody);
          log(`Wait ${data.retry_after}ms before trying again.`);
        } catch (e) {
          log("Could not parse Discord rate limit response.");
        }
      }
    }
  } catch (e) {
    log("Failed to send Discord notification: " + e);
  }
}
