import os
import sys
import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Reconfigure stdout for UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "web", "src", "data")
PROJECTS_FILE = os.path.join(DATA_DIR, "projects.json")
ARTICLES_FILE = os.path.join(DATA_DIR, "articles.json")

class AdminHandler(BaseHTTPRequestHandler):
    def _send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/health':
            self.send_response(200)
            self._send_cors()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "online", "version": "1.0.0"}).encode('utf-8'))
            return

        if parsed.path == '/api/data':
            try:
                projects = []
                articles = []
                if os.path.exists(PROJECTS_FILE):
                    with open(PROJECTS_FILE, 'r', encoding='utf-8') as f:
                        projects = json.load(f)
                if os.path.exists(ARTICLES_FILE):
                    with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
                        articles = json.load(f)

                self.send_response(200)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"projects": projects, "articles": articles}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(body) if body else {}
        except Exception:
            data = {}

        if parsed.path == '/api/save/projects':
            try:
                projects = data.get('projects', [])
                with open(PROJECTS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(projects, f, indent=2, ensure_ascii=False)
                self.send_response(200)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "count": len(projects)}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        if parsed.path == '/api/save/articles':
            try:
                articles = data.get('articles', [])
                with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(articles, f, indent=2, ensure_ascii=False)
                self.send_response(200)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "count": len(articles)}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        if parsed.path == '/api/run/scraper':
            try:
                cmd = [sys.executable, os.path.join(BASE_DIR, "automation", "modules", "project_scraper.py")]
                proc = subprocess.run(cmd, capture_output=True, text=True, cwd=BASE_DIR, timeout=120)
                self.send_response(200)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": proc.returncode == 0,
                    "stdout": proc.stdout,
                    "stderr": proc.stderr
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        if parsed.path == '/api/run/article':
            try:
                category = data.get('category', 'intelligence')
                topic = data.get('topic', '')
                cmd = [
                    sys.executable,
                    os.path.join(BASE_DIR, "automation", "modules", "article_generator.py"),
                    "--category", category
                ]
                if topic:
                    cmd.extend(["--topic", topic])

                proc = subprocess.run(cmd, capture_output=True, text=True, cwd=BASE_DIR, timeout=300)
                self.send_response(200)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": proc.returncode == 0,
                    "stdout": proc.stdout,
                    "stderr": proc.stderr
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, AdminHandler)
    print(f"[+] Admin Automation Server listening on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Server stopped.")

if __name__ == '__main__':
    run_server()
