import os
import sys
import ftplib
import zipfile
import secrets
import urllib.request
import urllib.parse
import json
import time

def deploy():
    start_time = time.time()
    server = os.environ.get('FTP_SERVER')
    user = os.environ.get('FTP_USERNAME')
    password = os.environ.get('FTP_PASSWORD')

    if not server or not user or not password:
        print("Error: Missing FTP credentials in environment.")
        sys.exit(1)

    print(f"🚀 Starting High-Speed Fast Deployment...")
    out_dir = './web/out'
    if not os.path.exists(out_dir):
        print(f"Error: {out_dir} directory not found. Please run npm run build first.")
        sys.exit(1)

    # 1. Create build.zip
    zip_path = 'build.zip'
    print("📦 Creating build.zip archive from ./web/out ...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(out_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, out_dir)
                zipf.write(file_path, arcname)

    zip_size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"📦 build.zip created successfully ({zip_size_mb:.2f} MB)")

    # 2. Generate secure random deploy token
    deploy_token = secrets.token_hex(16)

    # 3. Create deploy_unzip.php script
    unzip_script = f"""<?php
header('Content-Type: application/json');
$token = '{deploy_token}';
if (!isset($_GET['token']) || $_GET['token'] !== $token) {{
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}}

$zipFile = __DIR__ . '/build.zip';
if (!file_exists($zipFile)) {{
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'build.zip not found']);
    exit;
}}

$zip = new ZipArchive();
if ($zip->open($zipFile) === TRUE) {{
    $zip->extractTo(__DIR__ . '/');
    $numFiles = $zip->numFiles;
    $zip->close();
    @unlink($zipFile);
    @unlink(__FILE__);
    echo json_encode(['success' => true, 'extracted' => $numFiles, 'message' => 'Deployment unpacked successfully']);
}} else {{
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to open zip archive']);
}}
"""
    with open('deploy_unzip.php', 'w') as f:
        f.write(unzip_script)

    # 4. Connect to FTP
    print(f"🔌 Connecting to FTP: {server} as {user}...")
    ftp = None
    try:
        ftp = ftplib.FTP_TLS(timeout=30)
        ftp.connect(server, 21)
        ftp.login(user, password)
        ftp.prot_p()
        print("🔒 Connected securely via FTPS (TLS)")
    except Exception as e:
        print(f"Notice: FTPS TLS fallback ({e}), attempting standard FTP...")
        try:
            ftp = ftplib.FTP(timeout=30)
            ftp.connect(server, 21)
            ftp.login(user, password)
            print("Connected via standard FTP")
        except Exception as err:
            print(f"FTP connection failed: {err}")
            sys.exit(1)

    ftp.set_pasv(True)

    # Navigate to public_html
    root_files = ftp.nlst()
    if 'domains' in root_files:
        try:
            ftp.cwd('domains/cryptoairdropai.com/public_html')
            print("📁 Directory: domains/cryptoairdropai.com/public_html")
        except Exception:
            pass
    elif 'public_html' in root_files:
        try:
            ftp.cwd('public_html')
            print("📁 Directory: public_html")
        except Exception:
            pass

    # 5. Upload build.zip and deploy_unzip.php
    print("⬆️ Uploading build.zip ...")
    with open(zip_path, 'rb') as f:
        ftp.storbinary('STOR build.zip', f)
    print("✅ Uploaded build.zip")

    print("⬆️ Uploading deploy_unzip.php ...")
    with open('deploy_unzip.php', 'rb') as f:
        ftp.storbinary('STOR deploy_unzip.php', f)
    print("✅ Uploaded deploy_unzip.php")

    # Upload .htaccess
    htaccess_path = './web/public/.htaccess'
    if os.path.exists(htaccess_path):
        with open(htaccess_path, 'rb') as f:
            ftp.storbinary('STOR .htaccess', f)
        print("✅ Uploaded .htaccess")

    ftp.quit()

    # 6. Trigger Remote Unpack via HTTPS
    print("⚡ Triggering server-side instant extraction...")
    trigger_url = f"https://cryptoairdropai.com/deploy_unzip.php?token={deploy_token}"
    
    try:
        req = urllib.request.Request(
            trigger_url,
            headers={'User-Agent': 'CryptoAirdropAI-Deployer/1.0'}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = response.read().decode('utf-8')
            res_json = json.loads(res_data)
            if res_json.get('success'):
                extracted = res_json.get('extracted', 0)
                elapsed = time.time() - start_time
                print(f"🎉 SUCCESS: Extracted {extracted} files on Hostinger in {elapsed:.2f} seconds!")
            else:
                print(f"Extraction response: {res_data}")
    except Exception as e:
        print(f"Extraction trigger note: {e}")

    # Cleanup local temp files
    if os.path.exists(zip_path):
        os.remove(zip_path)
    if os.path.exists('deploy_unzip.php'):
        os.remove('deploy_unzip.php')

    print(f"\n=======================================================")
    print(f"✨ Fast Deployment Completed in {time.time() - start_time:.2f}s!")
    print(f"=======================================================")

if __name__ == '__main__':
    deploy()
