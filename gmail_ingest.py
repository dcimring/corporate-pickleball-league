import os
import imaplib
import email
import pandas as pd
from email.header import decode_header
from email.utils import parsedate_to_datetime
from datetime import datetime
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

def log(message):
    timestamp = datetime.now().strftime("%d %b %Y %H:%M:%S")
    print(f"{timestamp} - {message}")

def connect_to_gmail():
    try:
        # Connect to Gmail via IMAP
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(GMAIL_USER, GMAIL_PASS)
        return mail
    except Exception as e:
        log(f"Connection failed: {e}")
        return None

def extract_csv_from_email(msg):
    # Walk through the email parts to find attachments
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
                return part.get_payload(decode=True), filename
    
    return None, None

def check_for_new_matches():
    if not all([GMAIL_USER, GMAIL_PASS, TARGET_SENDER, TARGET_FILENAME, TARGET_SUBJECT]):
        log("Error: Missing required environment variables.")
        return None

    mail = connect_to_gmail()
    if not mail: return None

    try:
        mail.select("inbox")
        
        # Search for UNREAD emails from specific sender with specific subject
        status, messages = mail.search(None, f'(UNSEEN FROM "{TARGET_SENDER}" SUBJECT "{TARGET_SUBJECT}")')
        
        if status != "OK" or not messages[0]:
            return None

        email_ids = messages[0].split()
        log(f"Found {len(email_ids)} unread matching emails.")
        
        fetched_emails = []

        for e_id in email_ids:
            # Fetch the email body
            res, msg_data = mail.fetch(e_id, "(RFC822)")
            
            # Mark as read immediately
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
                        'date_str': date_header,
                        'subject': msg.get("Subject")
                    })

        # Sort by date descending (newest first)
        fetched_emails.sort(key=lambda x: x['date'].timestamp() if x['date'] else 0, reverse=True)

        if fetched_emails:
            newest = fetched_emails[0]
            csv_content, filename = extract_csv_from_email(newest['msg'])
            
            if csv_content:
                # Decode subject for logging
                subject_header = decode_header(newest['subject'])[0]
                subject = subject_header[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(subject_header[1] or "utf-8")
                
                return {
                    'content': csv_content,
                    'filename': filename,
                    'date': newest['date_str'],
                    'subject': subject
                }
            else:
                log("Newest matching email had no CSV attachment.")
                
        return None

    except Exception as e:
        log(f"Error checking gmail: {e}")
        return None
    finally:
        try:
            mail.close()
            mail.logout()
        except:
            pass

if __name__ == "__main__":
    result = check_for_new_matches()
    if result:
        log(f"Found match: {result['filename']} from {result['date']}")
        # For testing standalone, print head
        try:
            df = pd.read_csv(io.BytesIO(result['content']))
            print(df.head())
        except Exception as e:
            log(f"Error reading CSV: {e}")
    else:
        log("No new match results found.")
