import time
import io
import os
import requests
import ingest_matches
import gmail_ingest
from datetime import datetime
from dotenv import load_dotenv

# Load env to ensure DISCORD_WEBHOOK_URL is available
load_dotenv('app/.env')
load_dotenv('.env')

DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

def log(message):
    timestamp = datetime.now().strftime("%d %b %Y %H:%M:%S")
    print(f"{timestamp} - {message}")

def send_discord_notification(success, title, description, details=None):
    if not DISCORD_WEBHOOK_URL:
        log("No Discord Webhook URL configured. Skipping notification.")
        return

    # Colors: Green (Success) = 5763719 (#57F287), Red (Error) = 15548997 (#ED4245), Yellow (Warning) = 16776960
    color = 5763719 if success else 15548997
    
    fields = []
    if details:
        for key, value in details.items():
            fields.append({"name": key, "value": str(value), "inline": True})

    embed = {
        "title": title,
        "description": description,
        "color": color,
        "fields": fields,
        "footer": {
            "text": "Automated Ingestion Service"
        },
        "timestamp": datetime.now().isoformat()
    }

    try:
        requests.post(DISCORD_WEBHOOK_URL, json={"embeds": [embed]})
    except Exception as e:
        log(f"Failed to send Discord notification: {e}")

def check_and_process():
    log("Checking for emails...")
    
    try:
        match_data = gmail_ingest.check_for_new_matches()
        
        if not match_data:
            log("No new emails found.")
            return

        log(f"Found email: {match_data['subject']} from {match_data['date']}")
        
        # Get current DB count
        current_count = ingest_matches.get_match_count()
        log(f"Current DB row count: {current_count}")

        # Parse CSV to get new count
        csv_str = match_data['content'].decode('utf-8-sig')
        csv_file = io.StringIO(csv_str)
        
        matches_to_insert = ingest_matches.process_csv_content(csv_file)
        new_count = len(matches_to_insert)
        
        log(f"New CSV valid row count: {new_count}")

        stats = {
            "Email Subject": match_data['subject'],
            "Email Date": match_data['date'],
            "Current DB Rows": current_count,
            "New CSV Rows": new_count
        }

        # Validation: Ensure we don't shrink the dataset
        if new_count < current_count:
            msg = f"WARNING: New data has fewer rows ({new_count}) than DB ({current_count}). Skipping update."
            log(msg)
            send_discord_notification(False, "Ingestion Skipped", msg, stats)
            return

        if new_count == 0:
             msg = "WARNING: New CSV has 0 matches. Skipping."
             log(msg)
             send_discord_notification(False, "Ingestion Skipped", msg, stats)
             return

        log("Data valid. Starting ingestion...")
        
        success = ingest_matches.update_database(matches_to_insert)
        
        if success:
            log("Ingestion complete.")
            send_discord_notification(True, "Ingestion Successful", "Match data has been updated.", stats)
        else:
            log("Ingestion failed.")
            send_discord_notification(False, "Ingestion Failed", "Database update encountered an error.", stats)

    except Exception as e:
        log(f"Error in service loop: {e}")
        send_discord_notification(False, "Service Error", str(e))

def run_service():
    log("Starting ingestion service...")
    
    # Run immediately on start
    check_and_process()

    while True:
        log("Sleeping for 15 minutes...")
        time.sleep(900) # 15 minutes
        check_and_process()

if __name__ == "__main__":
    run_service()
