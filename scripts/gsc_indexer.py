import json
import requests
import sys
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

# Path to the JSON key you downloaded in Step 1
SERVICE_ACCOUNT_FILE = 'cosmic-mariner-503804-c4-981c45ff145b.json'

# The scope required for the Indexing API
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def get_authorized_session():
    """Authenticates the service account and returns an authorized HTTP session."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return AuthorizedSession(credentials)

def submit_url_for_indexing(url, action="URL_UPDATED"):
    """
    Submits a URL to the Google Indexing API.
    Action can be 'URL_UPDATED' or 'URL_DELETED'.
    """
    session = get_authorized_session()
    
    payload = {
        "url": url,
        "type": action
    }
    
    response = session.post(ENDPOINT, data=json.dumps(payload))
    
    if response.status_code == 200:
        print(f"Success: {url} submitted for indexing.")
    else:
        print(f"Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python gsc_indexer.py <url>")
        sys.exit(1)
        
    target_url = sys.argv[1]
    submit_url_for_indexing(target_url, "URL_UPDATED")
