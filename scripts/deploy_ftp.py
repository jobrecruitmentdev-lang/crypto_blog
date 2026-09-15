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

    # 2. Generate secure random deploy token & unique script name
    deploy_token = secrets.token_hex(16)
    deploy_filename = f"deploy_unzip_{deploy_token}.php"

    # 3. Create unique unpacker script
    unzip_script = f"""<?php
header('Content-Type: application/json');
if (function_exists('opcache_reset')) {{
    @opcache_reset();
}}
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

function rrmdir($dir) {{
    if (is_dir($dir)) {{
        $objects = scandir($dir);
        foreach ($objects as $object) {{
            if ($object !== "." && $object !== "..") {{
                if (is_dir($dir . "/" . $object) && !is_link($dir . "/" . $object)) {{
                    rrmdir($dir . "/" . $object);
                }} else {{
                    @unlink($dir . "/" . $object);
                }}
            }}
        }}
        @rmdir($dir);
    }}
}}
// Clean up removed routes
rrmdir(__DIR__ . '/career');
rrmdir(__DIR__ . '/admin');

$zip = new ZipArchive();
if ($zip->open($zipFile) === TRUE) {{
    $zip->extractTo(__DIR__ . '/');
    $numFiles = $zip->numFiles;
    $zip->close();
    @unlink($zipFile);
    @unlink(__FILE__);
    if (function_exists('opcache_reset')) {{
        @opcache_reset();
    }}
    echo json_encode(['success' => true, 'extracted' => $numFiles, 'message' => 'Deployment unpacked successfully']);
}} else {{
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to open zip archive']);
}}
"""
    with open(deploy_filename, 'w') as f:
        f.write(unzip_script)

    # 4. Connect to FTP with robust retry loop
    print(f"🔌 Connecting to FTP: {server} as {user}...")
    ftp = None
    connected = False

    for attempt in range(5):
        try:
            print(f"[*] FTP connection attempt {attempt+1}/5...")
            try:
                ftp = ftplib.FTP_TLS(timeout=60)
                ftp.connect(server, 21)
                ftp.login(user, password)
                ftp.prot_p()
                print("🔒 Connected securely via FTPS (TLS)")
                connected = True
                break
            except Exception as tls_err:
                print(f"Notice: FTPS TLS failed ({tls_err}), attempting standard FTP...")
                ftp = ftplib.FTP(timeout=60)
                ftp.connect(server, 21)
                ftp.login(user, password)
                print("Connected via standard FTP")
                connected = True
                break
        except Exception as err:
            print(f"[-] Attempt {attempt+1} failed: {err}. Waiting 5s...")
            time.sleep(5)

    if not connected or not ftp:
        print("❌ FTP connection failed after 5 attempts.")
        sys.exit(1)

    ftp.set_pasv(True)

    # Navigate to public_html directly
    cwd_success = False
    for target_dir in ['domains/cryptoairdropai.com/public_html', 'public_html']:
        try:
            ftp.cwd(target_dir)
            print(f"📁 Working Directory set to: {target_dir}")
            cwd_success = True
            break
        except Exception:
            pass
    if not cwd_success:
        print(f"📁 Current Directory: {ftp.pwd()}")

    # Clean up any leftover deploy scripts
    try:
        ftp.delete('deploy_unzip.php')
    except Exception:
        pass

    # 5. Upload build.zip and dynamic deploy script
    print("⬆️ Uploading build.zip ...")
    with open(zip_path, 'rb') as f:
        ftp.storbinary('STOR build.zip', f)
    print("✅ Uploaded build.zip")

    print(f"⬆️ Uploading {deploy_filename} ...")
    with open(deploy_filename, 'rb') as f:
        ftp.storbinary(f'STOR {deploy_filename}', f)
    print(f"✅ Uploaded {deploy_filename}")

    # Upload .htaccess
    htaccess_path = './web/public/.htaccess'
    if os.path.exists(htaccess_path):
        with open(htaccess_path, 'rb') as f:
            ftp.storbinary('STOR .htaccess', f)
        print("✅ Uploaded .htaccess")

    ftp.quit()

    # 6. Trigger Remote Unpack via HTTPS
    print("⚡ Triggering server-side instant extraction...")
    trigger_url = f"https://cryptoairdropai.com/{deploy_filename}?token={deploy_token}"
    extracted_success = False

    for attempt in range(4):
        try:
            req = urllib.request.Request(
                trigger_url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'}
            )
            with urllib.request.urlopen(req, timeout=45) as response:
                res_data = response.read().decode('utf-8')
                res_json = json.loads(res_data)
                if res_json.get('success'):
                    extracted = res_json.get('extracted', 0)
                    elapsed = time.time() - start_time
                    print(f"🎉 SUCCESS: Extracted {extracted} files on Hostinger in {elapsed:.2f} seconds!")
                    extracted_success = True
                    break
                else:
                    print(f"Extraction attempt {attempt+1} response: {res_data}")
        except Exception as e:
            print(f"Extraction attempt {attempt+1} note: {e}")
            time.sleep(3)

    # Cleanup local temp files
    if os.path.exists(zip_path):
        os.remove(zip_path)
    if os.path.exists(deploy_filename):
        os.remove(deploy_filename)

    if not extracted_success:
        print("❌ Server-side extraction failed! Build was not unpacked.")
        sys.exit(1)

    print(f"\n=======================================================")
    print(f"✨ Fast Deployment Completed in {time.time() - start_time:.2f}s!")
    print(f"=======================================================")

if __name__ == '__main__':
    deploy()
