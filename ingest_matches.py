import os
import sys
import csv
import argparse
import io
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from app/.env if it exists, or local .env
load_dotenv('app/.env')
load_dotenv('.env')

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
# Prefer Service Role Key for scripts, falling back to Anon key if necessary
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase configuration.")
    print("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY in your .env file.")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def log(message):
    timestamp = datetime.now().strftime("%d %b %Y %H:%M:%S")
    print(f"{timestamp} - {message}")

def get_match_count():
    try:
        # head=True is effectively count='exact' in recent libs, or select count
        res = supabase.table("matches").select("id", count="exact").execute()
        return res.count
    except Exception as e:
        log(f"Error getting match count: {e}")
        return 0

def fetch_lookups():
    # Fetch Divisions
    div_res = supabase.table("divisions").select("id,name").execute()
    divisions = div_res.data

    # Fetch Teams
    team_res = supabase.table("teams").select("id,name,division_id").execute()
    teams = team_res.data

    return divisions, teams

def parse_date(date_str):
    try:
        # Expected format: 13-Jan-26
        return datetime.strptime(date_str.strip(), "%d-%b-%y").strftime("%Y-%m-%d")
    except ValueError:
        try:
            # Try 4 digit year just in case: 13-Jan-2026
            return datetime.strptime(date_str.strip(), "%d-%b-%Y").strftime("%Y-%m-%d")
        except ValueError:
             log(f"Warning: Could not parse date '{date_str}'. Using today's date.")
             return datetime.now().strftime("%Y-%m-%d")

def get_division_id(name_raw, divisions):
    name = name_raw.strip().lower()
    # Try exact match (case-insensitive)
    for d in divisions:
        if d['name'].lower() == name:
            return d['id']
    
    # Try prepending "Division " (case-insensitive)
    alt_name = f"division {name}"
    for d in divisions:
        if d['name'].lower() == alt_name:
            return d['id']
            
    return None

def get_team_id(name_raw, division_id, teams):
    name = name_raw.strip().lower()
    for t in teams:
        if t['name'].lower() == name and t['division_id'] == division_id:
            return t['id']
    return None

def process_csv_content(csv_file_obj):
    divisions, teams = fetch_lookups()
    matches_to_insert = []
    errors = []
    
    # Using csv.reader to handle standard CSV parsing
    reader = csv.reader(csv_file_obj)
    
    for row_num, row in enumerate(reader, 1):
        if not row: continue
        
        # Basic validation
        if len(row) < 9:
            msg = f"Row {row_num}: Not enough columns {row}"
            log(msg)
            errors.append(msg)
            continue

        # Parse columns
        div_name = row[0]
        team1_name = row[1]
        team2_name = row[3] # Skip 'v' at index 2
        date_raw = row[4]
        
        # Skip if match results are missing (indicates upcoming match)
        if not row[5].strip() or not row[6].strip():
            # log(f"Skipping row {row_num}: Match has no results yet (upcoming).") # Verbose logging
            continue

        try:
            t1_wins = int(row[5])
            t2_wins = int(row[6])
            t1_points = int(row[7])
            t2_points = int(row[8])
        except (ValueError, IndexError):
            msg = f"Row {row_num}: Invalid or missing score data."
            log(msg)
            errors.append(msg)
            continue

        # Lookup IDs
        div_id = get_division_id(div_name, divisions)
        if not div_id:
            msg = f"Row {row_num}: Division '{div_name}' not found."
            log(msg)
            errors.append(msg)
            continue

        t1_id = get_team_id(team1_name, div_id, teams)
        t2_id = get_team_id(team2_name, div_id, teams)

        if not t1_id:
            msg = f"Row {row_num}: Team '{team1_name}' not found in '{div_name}'."
            log(msg)
            errors.append(msg)
            continue
        if not t2_id:
            msg = f"Row {row_num}: Team '{team2_name}' not found in '{div_name}'."
            log(msg)
            errors.append(msg)
            continue

        formatted_date = parse_date(date_raw)

        matches_to_insert.append({
            "division_id": div_id,
            "team1_id": t1_id,
            "team2_id": t2_id,
            "date": formatted_date,
            "team1_wins": t1_wins,
            "team2_wins": t2_wins,
            "team1_points_for": t1_points,
            "team2_points_for": t2_points
        })

    return matches_to_insert, errors

def update_database(matches_to_insert, force=False):
    if matches_to_insert:
        # Safety Check: Prevent shrinking the database unless forced
        current_count = get_match_count()
        new_count = len(matches_to_insert)
        
        if not force and new_count < current_count:
            log(f"ABORT: New data has fewer valid rows ({new_count}) than current DB ({current_count}). Ingestion cancelled to prevent data loss. (Use --force to override)")
            return False

        log("Clearing existing matches...")
        try:
            # Delete all rows by filtering for IDs not equal to the Nil UUID
            supabase.table("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
            log("Matches table cleared.")

            log(f"Attempting to insert {len(matches_to_insert)} matches...")
            supabase.table("matches").insert(matches_to_insert).execute()
            log("Success! Matches inserted.")
            return True
        except Exception as e:
            log(f"Error updating data: {e}")
            return False
    else:
        log("No valid matches found to insert.")
        return False

def process_csv_file(file_path, force=False):
    log(f"Reading CSV file: {file_path}")
    with open(file_path, mode='r', encoding='utf-8-sig') as csvfile:
        matches, errors = process_csv_content(csvfile)
        
        if errors:
            print("\n--- Validation Warnings ---")
            for err in errors:
                print(err)
            print("---------------------------\n")
            
        update_database(matches, force=force)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest pickleball match results from CSV to Supabase.")
    parser.add_argument("file", help="Path to the CSV file")
    parser.add_argument("--force", action="store_true", help="Force update even if new row count is lower than current")
    args = parser.parse_args()
    
    process_csv_file(args.file, force=args.force)
