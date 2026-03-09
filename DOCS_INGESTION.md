# Ingestion Service Documentation (Google Apps Script)

The `GoogleAppsScript.js` script automates the ingestion of pickleball match results from Gmail into the Supabase database. It is designed to run on a time-based trigger in the Google Apps Script environment.

## Overview

The service monitors a Gmail account for specific emails containing match results in CSV format, parses the data, validates it against existing database records, and updates the Supabase `matches` table.

## Workflow

1.  **Email Discovery**: Searches for unread emails from authorized senders (`TARGET_SENDERS`) with a specific subject line (`TARGET_SUBJECT`).
2.  **Attachment Handling**: Identifies CSV attachments, marks the email as read, and applies a `Processed_Pickleball_Results` label.
3.  **Lookup Synchronisation**: Fetches current Divisions and Teams from Supabase to map names to IDs.
4.  **Parsing & Validation**:
    *   Parses the CSV data.
    *   **Auto-creates Teams**: If a team in the CSV doesn't exist in the database, the script automatically creates it in the correct division.
    *   **Score Validation**: Checks if the total games played match the expected count (8 for CPL, 6 for others).
5.  **Data Safety Check**: Compares the number of matches in the new CSV against the current database count. If the new file has fewer matches, the update is aborted to prevent accidental data loss.
6.  **Database Update**:
    *   Clears the existing `matches` table.
    *   Inserts the full set of matches from the CSV.
7.  **Notifications**:
    *   **Email**: Sends a summary of "New" and "Modified" matches to the sender.
    *   **Discord**: Sends a status report (Success/Failure) with statistics to a Discord channel via webhook.

## Configuration (Script Properties)

The following properties must be set in the GAS Project Settings:

| Property | Description |
| :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for bypass RLS and performing deletes/inserts. |
| `TARGET_SENDERS` | Comma-separated list of authorized email addresses. |
| `TARGET_SUBJECT` | The exact subject line to look for (e.g., "Corporate League Results"). |
| `DISCORD_WEBHOOK_URL` | URL for Discord notifications. |

## Data Mapping Logic

*   **Divisions**: Case-insensitive matching. "CPL" is automatically mapped to "Cayman Premier League".
*   **Dates**: Expects `DD-Mon-YY` format (e.g., `13-Jan-26`) and converts to ISO `YYYY-MM-DD`.
*   **Match Identity**: Matches are uniquely identified by a combination of normalized date and sorted Team IDs.
