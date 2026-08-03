#!/bin/bash
# run_blog.sh - Cron job script for CryptoDrop Blog Automation

cd "$(dirname "$0")"

# Assuming a python virtual environment is configured here:
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the main orchestrator script
python main.py >> logs/blog.log 2>&1
