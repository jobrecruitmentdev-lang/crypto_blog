import os
import psycopg2
import sys

DB_CONFIG = {
    'host': os.getenv('SUPABASE_DB_HOST', 'aws-0-ap-northeast-1.pooler.supabase.com'),
    'port': int(os.getenv('SUPABASE_DB_PORT', 6543)),
    'user': os.getenv('SUPABASE_DB_USER', 'postgres.oebuqronflnytkdyckxi'),
    'password': os.getenv('SUPABASE_DB_PASS', '9^VGH+Wff&#qtGy'),
    'dbname': os.getenv('SUPABASE_DB_NAME', 'postgres'),
    'sslmode': 'require'
}

def run_migration(migration_file):
    print(f"[*] Connecting to Supabase PostgreSQL at {DB_CONFIG['host']}:{DB_CONFIG['port']}...")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cur = conn.cursor()
        
        print(f"[*] Reading migration: {migration_file}")
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql = f.read()
            
        print("[*] Executing migration statements...")
        cur.execute(sql)
        cur.close()
        conn.close()
        print("[+] Migration 003 executed successfully!")
        return True
    except Exception as e:
        print(f"[-] Migration failed: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    migration_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations", "003_production_architecture.sql")
    success = run_migration(migration_path)
    if not success:
        sys.exit(1)
