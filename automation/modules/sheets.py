import os
import gspread
from config import Config, logger

TRACKING_HEADERS = [
    "Keyword", "Blog Topic", "Information", "Meta Title",
    "Meta Description", "Slug", "Status", "Published URL", "Date"
]

class GoogleSheetsManager:
    def __init__(self):
        self.scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive.file"
        ]
        self.tracking_ws = None
        try:
            self.client = gspread.service_account(
                filename=Config.GOOGLE_CREDENTIALS_FILE,
                scopes=self.scopes
            )
            self.sheet = self.client.open_by_key(Config.GOOGLE_SHEET_ID)
            logger.info("Successfully connected to Google Sheets via service account.")
            self._init_tracking_sheet()
        except Exception as e:
            logger.error(f"Failed to connect to Google Sheets: {e}")
            self.client = None

    def _init_tracking_sheet(self):
        try:
            try:
                self.tracking_ws = self.sheet.worksheet("Audit Log")
            except gspread.exceptions.WorksheetNotFound:
                self.tracking_ws = self.sheet.add_worksheet(title="Audit Log", rows=100, cols=20)
                
            if self.tracking_ws.row_values(1) != TRACKING_HEADERS:
                self.tracking_ws.update([TRACKING_HEADERS], "A1")
        except Exception as e:
            logger.error(f"Failed to initialize tracking sheet: {e}")
            self.tracking_ws = None

    def log_result(self, keyword, topic, information, meta_title, meta_description, slug, status, url):
        if not self.tracking_ws:
            return
        try:
            import datetime
            self.tracking_ws.append_row([
                keyword, topic, information, meta_title, meta_description,
                slug, status, url, datetime.datetime.utcnow().isoformat()
            ])
        except Exception as e:
            logger.warning(f"Could not log result to tracking sheet: {e}")

    TOPIC_COL = 1
    STATUS_COL = 14

    def get_pending_topics(self, limit=15):
        if not self.client:
            logger.warning("No Google Sheets client, skipping fetch.")
            return []

        try:
            worksheet = self.sheet.worksheet("Data")
            rows = worksheet.get_all_values()
            pending = []
            for idx, row in enumerate(rows, start=1):
                topic = row[self.TOPIC_COL - 1].strip() if len(row) >= self.TOPIC_COL else ""
                status = row[self.STATUS_COL - 1].strip().lower() if len(row) >= self.STATUS_COL else ""

                if status != "published" and status != "drafted, pending review" and topic:
                    pending.append({
                        "row": idx,
                        "topic": topic,
                        "status": status
                    })
                    if len(pending) >= limit:
                        break

            logger.info(f"Fetched {len(pending)} pending topics.")
            return pending
        except Exception as e:
            logger.error(f"Error fetching topics from sheet: {e}")
            return []

    def update_status(self, row_index, status):
        if not self.client:
            return

        try:
            worksheet = self.sheet.worksheet("Data")
            worksheet.update_cell(row_index, self.STATUS_COL, status)
            logger.info(f"Updated row {row_index} status to '{status}'.")
        except Exception as e:
            logger.error(f"Error updating sheet: {e}")

sheets_manager = GoogleSheetsManager()
