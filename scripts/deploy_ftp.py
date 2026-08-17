import os
import sys
import ftplib

def deploy():
    server = os.environ.get('FTP_SERVER')
    user = os.environ.get('FTP_USERNAME')
    password = os.environ.get('FTP_PASSWORD')

    if not server or not user or not password:
        print("Error: Missing FTP credentials in environment.")
        sys.exit(1)

    print(f"Connecting to FTP server: {server} as {user}...")

    ftp = None
    try:
        ftp = ftplib.FTP_TLS(timeout=30)
        ftp.connect(server, 21)
        ftp.login(user, password)
        ftp.prot_p()
        print("Connected securely via FTPS (TLS)")
    except Exception as e:
        print(f"FTPS TLS connection notice: {e}. Attempting standard FTP...")
        try:
            ftp = ftplib.FTP(timeout=30)
            ftp.connect(server, 21)
            ftp.login(user, password)
            print("Connected via standard FTP")
        except Exception as err:
            print(f"FTP connection failed: {err}")
            sys.exit(1)

    ftp.set_pasv(True)

    # Check directory structure
    root_files = ftp.nlst()
    print("Initial FTP root files:", root_files)

    if 'domains' in root_files:
        try:
            ftp.cwd('domains/cryptoairdropai.com/public_html')
            print("Switched to domains/cryptoairdropai.com/public_html")
        except Exception as e:
            print(f"Could not cwd to domains/cryptoairdropai.com/public_html: {e}")
    elif 'public_html' in root_files:
        try:
            ftp.cwd('public_html')
            print("Switched to public_html")
        except Exception as e:
            print(f"Could not cwd to public_html: {e}")

    print("Target remote working directory:", ftp.pwd())

    def upload_directory(local_dir, remote_path=""):
        for item in os.listdir(local_dir):
            if item.startswith('.git') or item.startswith('.env') or item in ['api', 'config.php']:
                continue
            local_item = os.path.join(local_dir, item)
            if os.path.isdir(local_item):
                try:
                    ftp.mkd(item)
                except Exception:
                    pass
                ftp.cwd(item)
                upload_directory(local_item, os.path.join(remote_path, item))
                ftp.cwd('..')
            else:
                with open(local_item, 'rb') as f:
                    ftp.storbinary(f'STOR {item}', f)
                print(f"Uploaded: {os.path.join(remote_path, item)}")

    print("\n--- Starting file upload from ./web/out ---")
    upload_directory('./web/out')

    # Upload .htaccess
    htaccess_path = './web/public/.htaccess'
    if os.path.exists(htaccess_path):
        with open(htaccess_path, 'rb') as f:
            ftp.storbinary('STOR .htaccess', f)
        print("Uploaded: .htaccess")

    ftp.quit()
    print("\n--- Deployment completed 100% successfully! ---")

if __name__ == '__main__':
    deploy()
