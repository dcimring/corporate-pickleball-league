import os
import imaplib
import email
import pandas as pd
from email.header import decode_header
from email.utils import parsedate_to_datetime
from dotenv import load_dotenv
import io

# Load environment variables
load_dotenv('app/.env')
load_dotenv('.env')

# Configuration
GMAIL_USER = os.getenv('GMAIL_USER')
GMAIL_PASS = os.getenv('GMAIL_APP_PASSWORD')
TARGET_SENDER = os.getenv('TARGET_SENDER')
TARGET_SUBJECT = os.getenv('TARGET_SUBJECT')
TARGET_FILENAME = os.getenv('TARGET_FILENAME') # e.g. "Daily Schedule.csv"

if not all([GMAIL_USER, GMAIL_PASS, TARGET_SENDER, TARGET_FILENAME, TARGET_SUBJECT]):
    print("Error: Missing required environment variables.")
    print("Please set GMAIL_USER, GMAIL_APP_PASSWORD, TARGET_SENDER, TARGET_SUBJECT, and TARGET_FILENAME in .env")
    exit(1)

def connect_to_gmail():
    try:
        # Connect to Gmail via IMAP
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(GMAIL_USER, GMAIL_PASS)
        return mail
    except Exception as e:
        print(f"Connection failed: {e}")
        return None

def process_single_email(msg, date_display):
    subject_header = decode_header(msg["Subject"])[0]
    subject = subject_header[0]
    encoding = subject_header[1]
    
    if isinstance(subject, bytes):
        subject = subject.decode(encoding if encoding else "utf-8")
    
    print(f"Processing Newest Email: {subject} ({date_display})")

    # Walk through the email parts to find attachments
    found_csv = False
    for part in msg.walk():
        if part.get_content_maintype() == "multipart":
            continue
        if part.get("Content-Disposition") is None:
            continue

        filename = part.get_filename()
        if filename:
            # Decode filename if needed
            h = decode_header(filename)[0]
            if isinstance(h[0], bytes):
                filename = h[0].decode(h[1] if h[1] else "utf-8")

            # Check if filename matches target (exact or contains)
            if TARGET_FILENAME.lower() in filename.lower():
                print(f"  Found matching attachment: {filename} (from {date_display})")
                found_csv = True
                
                # Get the content
                content = part.get_payload(decode=True)
                
                try:
                    # Load into Pandas
                    df = pd.read_csv(io.BytesIO(content))
                    print("\n--- Data Preview ---")
                    print(df.head())
                    print("--------------------\n")
                    
                except Exception as e:
                    print(f"  Error reading CSV: {e}")
            else:
                print(f"  Skipping attachment: {filename}")
    
    if not found_csv:
        print("  No matching CSV attachment found in this email.")

def process_emails():
    mail = connect_to_gmail()
    if not mail: return

    mail.select("inbox")

    print(f"Searching for UNREAD emails from {TARGET_SENDER} with subject '{TARGET_SUBJECT}'...")
    
    # Search for UNREAD emails from specific sender with specific subject
    status, messages = mail.search(None, f'(UNSEEN FROM "{TARGET_SENDER}" SUBJECT "{TARGET_SUBJECT}")')
    
    if status != "OK" or not messages[0]:
        print("No unread messages found.")
        return

    email_ids = messages[0].split()
    print(f"Found {len(email_ids)} unread emails. Marking all as read and processing newest.")
    
    fetched_emails = []

    for e_id in email_ids:
        # Fetch the email body
        res, msg_data = mail.fetch(e_id, "(RFC822)")
        
        # Mark as read immediately using raw string for backslash
        mail.store(e_id, '+FLAGS', r'\Seen')
        
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                date_header = msg.get("Date")
                dt = None
                try:
                    if date_header:
                        dt = parsedate_to_datetime(date_header)
                except:
                    pass
                
                fetched_emails.append({
                    'msg': msg,
                    'date': dt,
                    'date_str': date_header
                })

    # Sort by date descending (newest first)
    # Handle None dates by putting them last
    fetched_emails.sort(key=lambda x: x['date'].timestamp() if x['date'] else 0, reverse=True)

    if fetched_emails:
        newest = fetched_emails[0]
        
        # Format date for display
        try:
            if newest['date']:
                date_display = newest['date'].astimezone().strftime("%Y-%m-%d %H:%M:%S")
            else:
                date_display = "Unknown Date"
        except:
            date_display = newest['date_str']

        process_single_email(newest['msg'], date_display)
        
        if len(fetched_emails) > 1:
            print(f"Skipped {len(fetched_emails) - 1} older emails (marked as read).")

    mail.close()
    mail.logout()

if __name__ == "__main__":
    process_emails()
