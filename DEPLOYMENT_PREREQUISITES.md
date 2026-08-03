# Hostinger Deployment Prerequisites

Before the automated GitHub Actions pipeline can deploy your application to Hostinger, you must manually complete the following prerequisites.

## 1. GitHub Repository Secrets
To allow GitHub Actions to build your site and push it to Hostinger, add the following secrets to your GitHub Repository:
1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
2. Add the following secrets:
   - `FTP_SERVER`: Your Hostinger FTP Host (e.g., `ftp.yourdomain.com` or the IP address).
   - `FTP_USERNAME`: Your Hostinger FTP Username.
   - `FTP_PASSWORD`: Your Hostinger FTP Password.
   - `NEXT_PUBLIC_STRAPI_API_URL`: The URL where your Strapi backend will live (e.g., `https://api.yourdomain.com`).

*(Note: You can create a new FTP account in Hostinger hPanel under **Websites > Manage > Files > FTP Accounts**, pointing to `public_html`)*.

---

## 2. Hostinger Strapi Backend Setup (Node.js Web App)
Since Strapi requires a running Node.js process and a MySQL database, you must configure this in your Hostinger hPanel.

### Step A: Create MySQL Database
1. In hPanel, go to **Databases > MySQL Databases**.
2. Create a new database and save the **Database Name**, **Username**, and **Password**.

### Step B: Create Node.js Web App
1. In hPanel, go to **Advanced > Node.js Web App**.
2. Create a new app:
   - **Domain**: Create a subdomain (e.g., `api.yourdomain.com`) to host the CMS.
   - **Application directory**: `/cms` (This points to the Strapi folder).
3. Connect the app to your GitHub repository (`jobrecruitmentdev-lang/crypto_blog`) and select the `main` branch.

### Step C: Strapi Environment Variables
In the Node.js Web App settings in Hostinger, add the following exact Environment Variables:
- `DATABASE_CLIENT` = `mysql`
- `DATABASE_HOST` = `localhost` *(or the MySQL host provided by Hostinger)*
- `DATABASE_NAME` = *(your newly created db name)*
- `DATABASE_USERNAME` = *(your newly created db user)*
- `DATABASE_PASSWORD` = *(your newly created db password)*
- `APP_KEYS` = *(Generate a secure random string, e.g., `key1,key2`)*
- `API_TOKEN_SALT` = *(Generate a secure random string)*
- `ADMIN_JWT_SECRET` = *(Generate a secure random string)*
- `TRANSFER_TOKEN_SALT` = *(Generate a secure random string)*
- `JWT_SECRET` = *(Generate a secure random string)*

### Step D: Start the Backend
Save the environment variables and **Start** the app in hPanel. Strapi will automatically connect to MySQL, initialize the tables, and run our custom seed script to populate initial data!

---

## 3. Final Step: Trigger the Deployment!
Once the GitHub Secrets and the Strapi Backend are configured:
- Every time you push to the `main` branch on GitHub, the `deploy-hostinger.yml` workflow will automatically run.
- GitHub will build your Next.js site as a lightning-fast Static Export and push the raw HTML/CSS/JS files directly into your Hostinger `public_html` directory via FTP.
- Your frontend will be live and communicating perfectly with your Strapi backend!
