import os
import sys
import csv
import argparse
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

def fetch_lookups():
    print("Fetching divisions and teams from Supabase...")
    
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
             print(f"Warning: Could not parse date '{date_str}'. Using today's date.")
             return datetime.now().strftime("%Y-%m-%d")

def get_division_id(name_raw, divisions):
    name = name_raw.strip()
    # Try exact match
    for d in divisions:
        if d['name'] == name:
            return d['id']
    
    # Try prepending "Division "
    alt_name = f"Division {name}"
    for d in divisions:
        if d['name'] == alt_name:
            return d['id']
            
    return None

def get_team_id(name_raw, division_id, teams):
    name = name_raw.strip()
    for t in teams:
        if t['name'] == name and t['division_id'] == division_id:
            return t['id']
    return None

def process_csv(file_path):
    divisions, teams = fetch_lookups()
    matches_to_insert = []
    
    print(f"Reading CSV file: {file_path}")
    
    with open(file_path, mode='r', encoding='utf-8-sig') as csvfile:
        # Using csv.reader to handle standard CSV parsing
        reader = csv.reader(csvfile)
        
        for row_num, row in enumerate(reader, 1):
            if not row: continue
            
            # Basic validation
            if len(row) < 9:
                print(f"Skipping row {row_num}: Not enough columns {row}")
                continue

            # Parse columns
            div_name = row[0]
            team1_name = row[1]
            team2_name = row[3] # Skip 'v' at index 2
            date_raw = row[4]
            try:
                t1_wins = int(row[5])
                t2_wins = int(row[6])
                t1_points = int(row[7])
                t2_points = int(row[8])
            except ValueError:
                print(f"Skipping row {row_num}: Invalid number format")
                continue

            # Lookup IDs
            div_id = get_division_id(div_name, divisions)
            if not div_id:
                print(f"Row {row_num}: Division '{div_name}' not found. Skipping.")
                continue

            t1_id = get_team_id(team1_name, div_id, teams)
            t2_id = get_team_id(team2_name, div_id, teams)

            if not t1_id:
                print(f"Row {row_num}: Team '{team1_name}' not found in division. Skipping.")
                continue
            if not t2_id:
                print(f"Row {row_num}: Team '{team2_name}' not found in division. Skipping.")
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

    if matches_to_insert:
        print("Clearing existing matches...")
        try:
            # Delete all rows by filtering for IDs not equal to the Nil UUID
            supabase.table("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
            print("Matches table cleared.")

            print(f"Attempting to insert {len(matches_to_insert)} matches...")
            data = supabase.table("matches").insert(matches_to_insert).execute()
            print("Success! Matches inserted.")
        except Exception as e:
            print(f"Error updating data: {e}")
    else:
        print("No valid matches found to insert.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest pickleball match results from CSV to Supabase.")
    parser.add_argument("file", help="Path to the CSV file")
    args = parser.parse_args()
    
    process_csv(args.file)
