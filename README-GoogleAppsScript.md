# Google Apps Script for Match Results

This script automatically ingests match results from emails sent by `jerry@pickleball.ky` into your Supabase database.

## Setup Instructions

1.  **Open Google Apps Script:**
    *   Go to [script.google.com](https://script.google.com/).
    *   Click **"New Project"**.

2.  **Paste Code:**
    *   Copy the content of `GoogleAppsScript.js` from this repository.
    *   Paste it into the editor (replace any existing code in `Code.gs`).
    *   Save the project (e.g., name it "Pickleball Ingest").

3.  **Set Script Properties (Secrets):**
    *   Click on the **Project Settings** (gear icon) in the left sidebar.
    *   Scroll down to **Script Properties**.
    *   Click **"Add script property"**.
    *   Add two properties:
        *   `SUPABASE_URL`: Your Supabase URL (e.g., `https://xyz.supabase.co`).
        *   `SUPABASE_KEY`: Your **service_role** key (found in Supabase Dashboard > Project Settings > API).

4.  **Test the Script:**
    *   Go back to the **Editor**.
    *   Select `processMatchResults` from the function dropdown at the top.
    *   Click **"Run"**.
    *   You will be asked to grant permissions (Gmail, UrlFetchApp). Allow them.
    *   Check the "Execution log" at the bottom to see if it found emails or uploaded matches.

5.  **Set up a Trigger (Automation):**
    *   Click on **Triggers** (alarm clock icon) in the left sidebar.
    *   Click **"Add Trigger"**.
    *   **Choose which function to run:** `processMatchResults`.
    *   **Select event source:** `Time-driven`.
    *   **Select type of time based trigger:** `Hour timer` (or as frequent as you like).
    *   **Select hour interval:** `Every hour`.
    *   Click **Save**.

## How it Works

1.  It searches for **unread** emails from `jerry@pickleball.ky` with the subject `Corporate League Results`.
2.  It parses any attached `.csv` files.
3.  It fetches the current list of Divisions and Teams from Supabase to match names to IDs.
4.  It uploads the new matches to the `matches` table in Supabase.
5.  It marks the email as **read** and adds a label `Processed_Pickleball_Results` so it doesn't process it again.
