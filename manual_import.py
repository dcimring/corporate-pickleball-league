#!/usr/bin/env python3
import os
import csv
import sys
import argparse
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('app/.env')
load_dotenv('.env')

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase configuration.")
    print("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {msg}")

def parse_date(date_str):
    # Mimic GAS parseDate: converts "2-Jun-26" or "13-Jan-26" to "2026-06-02" or "2026-01-13"
    months = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
        'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    }
    date_str = date_str.strip()
    parts = date_str.split('-')
    if len(parts) != 3:
        try:
            # Fallback to standard YYYY-MM-DD
            datetime.strptime(date_str, "%Y-%m-%d")
            return date_str
        except ValueError:
            log(f"⚠️ Warning: Could not parse date format '{date_str}'. Defaulting to today.")
            return datetime.now().strftime("%Y-%m-%d")
            
    day = parts[0].zfill(2)
    month_str = parts[1].lower()
    year_short = parts[2]
    
    month = months.get(month_str, '01')
    year = f"20{year_short}" if len(year_short) == 2 else year_short
    return f"{year}-{month}-{day}"

def get_division_id(name_raw, divisions):
    name = name_raw.strip().lower()
    if name == "cpl":
        name = "cayman premier league"
        
    # Search exact match
    for d in divisions:
        if d['name'].lower() == name:
            return d['id']
            
    # Search "division X"
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

def create_team(name, division_id):
    try:
        url = f"{SUPABASE_URL}/rest/v1/teams"
        resp = requests.post(
            url,
            headers={**HEADERS, "Prefer": "return=representation"},
            json={"name": name, "division_id": division_id}
        )
        if resp.status_code == 201:
            team_data = resp.json()[0]
            log(f"➕ Auto-created new team: '{name}' in division ID '{division_id}'")
            return team_data
        else:
            log(f"❌ Failed to create team '{name}': {resp.status_code} - {resp.text}")
            return None
    except Exception as e:
        log(f"❌ Exception while creating team '{name}': {e}")
        return None

def fetch_lookups():
    try:
        div_resp = requests.get(f"{SUPABASE_URL}/rest/v1/divisions?select=id,name", headers=HEADERS)
        div_resp.raise_for_status()
        divisions = div_resp.json()

        team_resp = requests.get(f"{SUPABASE_URL}/rest/v1/teams?select=id,name,division_id", headers=HEADERS)
        team_resp.raise_for_status()
        teams = team_resp.json()

        return divisions, teams
    except Exception as e:
        log(f"❌ Error fetching lookup tables from Supabase: {e}")
        sys.exit(1)

def fetch_existing_matches():
    try:
        resp = requests.get(f"{SUPABASE_URL}/rest/v1/matches?select=*", headers=HEADERS)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        log(f"❌ Error fetching matches: {e}")
        return []

def update_database(matches_list):
    try:
        # Clear matches table
        log("Clearing all matches from database...")
        clear_url = f"{SUPABASE_URL}/rest/v1/matches?id=neq.00000000-0000-0000-0000-000000000000"
        del_resp = requests.delete(clear_url, headers=HEADERS)
        if del_resp.status_code not in (200, 204):
            log(f"❌ Failed to clear matches: {del_resp.status_code} - {del_resp.text}")
            return False

        # Insert matches
        log(f"Inserting {len(matches_list)} matches...")
        ins_resp = requests.post(f"{SUPABASE_URL}/rest/v1/matches", headers=HEADERS, json=matches_list)
        if ins_resp.status_code in (200, 201):
            log("🎉 Database successfully updated!")
            return True
        else:
            log(f"❌ Error inserting matches: {ins_resp.status_code} - {ins_resp.text}")
            return False
    except Exception as e:
        log(f"❌ Exception updating database: {e}")
        return False

def insert_new_records_only(new_records):
    try:
        log(f"Inserting {len(new_records)} new unique matches...")
        ins_resp = requests.post(f"{SUPABASE_URL}/rest/v1/matches", headers=HEADERS, json=new_records)
        if ins_resp.status_code in (200, 201):
            log("🎉 Successfully appended new records!")
            return True
        else:
            log(f"❌ Error appending matches: {ins_resp.status_code} - {ins_resp.text}")
            return False
    except Exception as e:
        log(f"❌ Exception inserting records: {e}")
        return False

def process_results(rows, divisions, teams, dry_run=False):
    parsed_matches = []
    errors = []
    created_teams = []
    
    # Track teams in local cache to handle repeat additions in same import session
    local_teams = list(teams)
    
    # Store division name lookup by ID for validation messages
    div_name_by_id = {d['id']: d['name'] for d in divisions}

    for idx, row in enumerate(rows, 1):
        if not row:
            continue
        
        # Skip header if it matches typical schema header
        if len(row) > 0 and row[0].strip().lower() == "division":
            continue

        if len(row) < 9:
            msg = f"Row {idx}: Too few columns (got {len(row)}, expected >= 9). Skipping."
            errors.append(msg)
            log(f"⚠️ {msg}")
            continue

        # Extract columns
        div_name = row[0].strip()
        team1_name = row[1].strip()
        team2_name = row[3].strip() # skip 'v' column at index 2
        date_raw = row[4].strip()

        # Incomplete results check
        if not row[5].strip() or not row[6].strip():
            continue

        try:
            t1_wins = int(row[5])
            t2_wins = int(row[6])
            t1_points = int(row[7])
            t2_points = int(row[8])
        except ValueError:
            msg = f"Row {idx}: Invalid numeric data (Wins: '{row[5]}'-'{row[6]}', Points: '{row[7]}'-'{row[8]}'). Skipping."
            errors.append(msg)
            log(f"⚠️ {msg}")
            continue

        # Map Division ID
        div_id = get_division_id(div_name, divisions)
        if not div_id:
            msg = f"Row {idx}: Division '{div_name}' not found. Skipping."
            errors.append(msg)
            log(f"⚠️ {msg}")
            continue

        # Map Team 1
        t1_id = get_team_id(team1_name, div_id, local_teams)
        if not t1_id:
            if dry_run:
                log(f"ℹ️ [Dry Run] Would auto-create team: '{team1_name}' in Division '{div_name}'")
                t1_id = "dry-run-placeholder-id-1"
                created_teams.append(f"{team1_name} ({div_name})")
            else:
                new_t = create_team(team1_name, div_id)
                if new_t:
                    t1_id = new_t['id']
                    local_teams.append(new_t)
                    created_teams.append(f"{team1_name} ({div_name})")
                else:
                    msg = f"Row {idx}: Failed to auto-create team '{team1_name}'. Skipping match."
                    errors.append(msg)
                    continue

        # Map Team 2
        t2_id = get_team_id(team2_name, div_id, local_teams)
        if not t2_id:
            if dry_run:
                log(f"ℹ️ [Dry Run] Would auto-create team: '{team2_name}' in Division '{div_name}'")
                t2_id = "dry-run-placeholder-id-2"
                created_teams.append(f"{team2_name} ({div_name})")
            else:
                new_t = create_team(team2_name, div_id)
                if new_t:
                    t2_id = new_t['id']
                    local_teams.append(new_t)
                    created_teams.append(f"{team2_name} ({div_name})")
                else:
                    msg = f"Row {idx}: Failed to auto-create team '{team2_name}'. Skipping match."
                    errors.append(msg)
                    continue

        # Parse Date
        parsed_date = parse_date(date_raw)

        # Validate Game Counts
        total_games = t1_wins + t2_wins
        actual_div_name = div_name_by_id.get(div_id, '').lower()
        is_cpl = "cayman premier league" in actual_div_name
        is_valid_games = (total_games in (8, 9)) if is_cpl else (total_games == 6)
        
        if not is_valid_games:
            expected_games = "8 or 9" if is_cpl else "6"
            msg = f"Row {idx}: Game count mismatch. {team1_name} vs {team2_name} has {total_games} games (expected {expected_games})."
            errors.append(msg)
            log(f"⚠️ {msg}")

        parsed_matches.append({
            "division_id": div_id,
            "team1_id": t1_id,
            "team2_id": t2_id,
            "date": parsed_date,
            "team1_wins": t1_wins,
            "team2_wins": t2_wins,
            "team1_points_for": t1_points,
            "team2_points_for": t2_points
        })

    return parsed_matches, errors, created_teams

def make_match_key(m):
    sorted_teams = "-".join(sorted([m['team1_id'], m['team2_id']]))
    date_str = m['date'].split('T')[0]
    return f"{date_str}_{sorted_teams}"

def main():
    parser = argparse.ArgumentParser(description="Ingest pickleball match results into Supabase matching GAS rules.")
    parser.add_argument("--file", "-f", help="Path to a local CSV file to ingest")
    parser.add_argument("--results", "-r", nargs="+", help="One or more raw result rows (comma separated)")
    parser.add_argument("--mode", "-m", choices=["append", "replace"], default="append", 
                        help="Ingestion mode: 'append' to insert new unique matches (default), 'replace' to replace all matches")
    parser.add_argument("--force", action="store_true", help="Bypass row-count safety checks in replace mode")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate without pushing database updates")
    args = parser.parse_args()

    if not args.file and not args.results:
        log("❌ Error: Must specify --file or --results.")
        parser.print_help()
        sys.exit(1)

    # 1. Gather rows
    rows_to_parse = []
    if args.file:
        if not os.path.exists(args.file):
            log(f"❌ Error: File '{args.file}' not found.")
            sys.exit(1)
        with open(args.file, mode='r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            for row in reader:
                rows_to_parse.append(row)
    
    if args.results:
        for r_str in args.results:
            cols = [c.strip() for c in r_str.split(',')]
            rows_to_parse.append(cols)

    log(f"Processing {len(rows_to_parse)} candidate rows...")

    # 2. Fetch Lookup Data
    divisions, teams = fetch_lookups()

    # 3. Process matches
    parsed_matches, errors, created_teams = process_results(
        rows_to_parse, divisions, teams, dry_run=args.dry_run
    )

    if args.dry_run:
        log("--- DRY RUN COMPLETE ---")
        log(f"Successfully mapped: {len(parsed_matches)} matches")
        log(f"Auto-created teams: {len(created_teams)}")
        log(f"Validation errors/warnings: {len(errors)}")
        return

    # 4. Perform updates
    existing_matches = fetch_existing_matches()
    current_count = len(existing_matches)

    if args.mode == "replace":
        # Overwrite mode: Safety checks
        new_count = len(parsed_matches)
        log(f"Replace Mode: DB currently has {current_count} matches. Incoming: {new_count} matches.")
        
        if new_count < current_count and not args.force:
            log("❌ ABORT: Safety threshold triggered. Incoming row count is lower than current database records.")
            log("To override and overwrite anyway, run with the --force flag.")
            sys.exit(1)
            
        success = update_database(parsed_matches)
        if success:
            log("✅ Replaced matches in database.")
        else:
            log("❌ Ingestion failed.")
            sys.exit(1)

    else: # append mode
        # Extract keys of existing matches to prevent duplicates
        existing_keys = {make_match_key(m) for m in existing_matches}
        
        unique_new = []
        for nm in parsed_matches:
            # Handle placeholder IDs from auto-creation
            if nm['team1_id'].startswith("dry-run") or nm['team2_id'].startswith("dry-run"):
                continue
            key = make_match_key(nm)
            if key in existing_keys:
                log(f"⚠️ Skipping duplicate match already in DB: {key}")
            else:
                unique_new.append(nm)
                
        if not unique_new:
            log("ℹ️ No new unique matches to import.")
            return

        success = insert_new_records_only(unique_new)
        if success:
            log(f"✅ Appended {len(unique_new)} new matches.")
        else:
            log("❌ Ingestion failed.")
            sys.exit(1)

if __name__ == "__main__":
    main()
