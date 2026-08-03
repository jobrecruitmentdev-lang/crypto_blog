#!/bin/bash

# Safe Rsync Deployment Script for CryptoAirdropAI
# Replaces the old jobrecruitment script

COMMAND=$1
SSH_PORT="65002"
SSH_USER="u390470426"
SERVER_IP="217.21.74.188"
DOMAIN="cryptoairdropai.com"

if [ "$COMMAND" = "push" ]; then
    echo "Pushing Next.js frontend (static export) to server..."
    # Ensure it's built first
    cd web && npm run build && cd ..
    
    # Push the static 'out' directory to public_html
    wsl.exe rsync -avz -e "ssh -p $SSH_PORT" --exclude-from='.rsyncignore' web/out/ $SSH_USER@$SERVER_IP:domains/$DOMAIN/public_html/
    
    echo "Pushing custom backend API to server..."
    # Assuming backend code is in a folder called backend (adjust if needed)
    if [ -d "backend" ]; then
        wsl.exe rsync -avz -e "ssh -p $SSH_PORT" --exclude-from='.rsyncignore' backend/ $SSH_USER@$SERVER_IP:domains/$DOMAIN/public_html/api/
    fi

elif [ "$COMMAND" = "pull" ]; then
    echo "Pulling from server..."
    wsl.exe rsync -avz -e "ssh -p $SSH_PORT" --exclude-from='.rsyncignore' $SSH_USER@$SERVER_IP:domains/$DOMAIN/public_html/ .

elif [ "$COMMAND" = "list" ]; then
    echo "Listing server files..."
    wsl.exe rsync -avz -e "ssh -p $SSH_PORT" --list-only $SSH_USER@$SERVER_IP:domains/$DOMAIN/public_html/

else
    echo "Usage: ./deploy.sh [push|pull|list]"
    exit 1
fi
