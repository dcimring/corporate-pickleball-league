import time
import io
import ingest_matches
import gmail_ingest
from datetime import datetime

def log(message):
    timestamp = datetime.now().strftime("%d %b %Y %H:%M:%S")
    print(f"{timestamp} - {message}")

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
        # match_data['content'] is bytes, decode to string for csv processing
        csv_str = match_data['content'].decode('utf-8-sig')
        csv_file = io.StringIO(csv_str)
        
        # Calculate potential inserts
        matches_to_insert = ingest_matches.process_csv_content(csv_file)
        new_count = len(matches_to_insert)
        
        log(f"New CSV valid row count: {new_count}")

        # Validation: Ensure we don't shrink the dataset (unless manual intervention)
        if new_count < current_count:
            log(f"WARNING: New data has fewer rows ({new_count}) than DB ({current_count}). Skipping update to prevent potential data loss.")
            return

        if new_count == 0:
             log("WARNING: New CSV has 0 matches. Skipping.")
             return

        log("Data valid. Starting ingestion...")
        
        success = ingest_matches.update_database(matches_to_insert)
        
        if success:
            log("Ingestion complete.")
        else:
            log("Ingestion failed.")

    except Exception as e:
        log(f"Error in service loop: {e}")

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
