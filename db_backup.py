import os
import sys
import subprocess
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('app/.env')
load_dotenv('.env')

DB_URL = os.getenv("SUPABASE_DB_URL")

def check_tools():
    """Check if pg_dump and psql are available."""
    try:
        subprocess.run(["pg_dump", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        subprocess.run(["psql", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("Error: PostgreSQL tools (pg_dump, psql) are not found in your PATH.")
        print("Please install them (e.g., 'brew install libpq' on macOS) and add them to PATH.")
        # Attempt to hint about PATH for brew libpq
        if os.path.exists("/opt/homebrew/opt/libpq/bin"):
             print("Tip: Add libpq to your PATH: export PATH=\"/opt/homebrew/opt/libpq/bin:$PATH\"")
        sys.exit(1)

def backup():
    if not DB_URL or "[YOUR-PASSWORD]" in DB_URL:
        print("Error: Invalid SUPABASE_DB_URL in .env. Please update it with your actual password.")
        sys.exit(1)

    os.makedirs("backups", exist_ok=True)
    filename = f"backups/backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
    
    print(f"Creating backup: {filename} ...")
    
    # We use shell=True to handle the complex quoting of the connection string URL
    # WARNING: Using shell=True with untrusted input is risky, but DB_URL comes from .env
    command = f'pg_dump "{DB_URL}" -f "{filename}"'
    
    try:
        subprocess.run(command, shell=True, check=True)
        print("✅ Backup successful!")
        print(f"File saved to: {filename}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Backup failed: {e}")

def restore(filename):
    if not DB_URL or "[YOUR-PASSWORD]" in DB_URL:
        print("Error: Invalid SUPABASE_DB_URL in .env. Please update it with your actual password.")
        sys.exit(1)

    if not os.path.exists(filename):
        print(f"Error: File '{filename}' not found.")
        sys.exit(1)
        
    print(f"⚠️  WARNING: This will overwrite the database at {DB_URL}")
    print(f"Restoring from file: {filename}")
    confirm = input("Are you sure you want to proceed? (type 'yes' to confirm): ")
    if confirm.lower() != "yes":
        print("Restore cancelled.")
        return

    print("Restoring database...")
    
    # psql -d URL -f filename
    command = f'psql "{DB_URL}" -f "{filename}"'
    
    try:
        subprocess.run(command, shell=True, check=True)
        print("✅ Restore successful!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Restore failed: {e}")

if __name__ == "__main__":
    check_tools()
    
    parser = argparse.ArgumentParser(description="Supabase Backup/Restore Tool")
    subparsers = parser.add_subparsers(dest="action", required=True)
    
    # Backup command
    subparsers.add_parser("backup", help="Create a new database backup")
    
    # Restore command
    restore_parser = subparsers.add_parser("restore", help="Restore from a backup file")
    restore_parser.add_argument("file", help="Path to the .sql backup file")
    
    args = parser.parse_args()
    
    if args.action == "backup":
        backup()
    elif args.action == "restore":
        restore(args.file)
