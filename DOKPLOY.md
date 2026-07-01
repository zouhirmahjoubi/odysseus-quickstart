# Deploying to Dokploy 🚀

This guide provides step-by-step instructions for deploying this monorepo application to your self-hosted **Dokploy** instance.

## 📋 Prerequisites
- A running **Dokploy** instance.
- Your project repository pushed to GitHub.

---

## 🛠️ Step 1: Create a Compose Service
1. Log into your **Dokploy** dashboard.
2. Select your project (or create a new one).
3. Click **Create Service** and choose **Compose**.
4. Give it a name (e.g. `odysseus-app`).

---

## 🔗 Step 2: Connect Git Provider
1. Go to the **Git** tab of your new Compose service.
2. Select **GitHub** (or enter your repository URL).
3. Specify the repository path (e.g., `username/odysseus-quickstart`).
4. Set the branch to **`main`**.
5. Save the configuration.

---

## 🔒 Step 3: Configure Environment Variables
Better Auth and PocketBase require specific production settings. Go to the **Environment** tab and add the following variables:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `FRONTEND_URL` | `https://odysseus.yourdomain.com` | Your public web application URL. |
| `CORS_ORIGIN` | `https://odysseus.yourdomain.com` | Allowed CORS origin (should match web URL). |
| `BETTER_AUTH_URL` | `https://odysseus.yourdomain.com/hcgi/api` | API path where Better Auth endpoints are mounted. |
| `PB_SUPERUSER_EMAIL` | `admin@odysseusai.com` | PocketBase administrator email. |
| `PB_SUPERUSER_PASSWORD` | `ChooseSecureAdminPass123!` | PocketBase administrator password. |
| `PB_ENCRYPTION_KEY` | `your-32-character-encryption-key-here` | Encryption key for PocketBase data storage. |
| `ENCRYPTION_KEY` | `your-32-character-encryption-key-here` | Encryption key for API runtime. |
| `JWT_SECRET` | `your-jwt-secret-key` | Secret key for custom JWT session token encoding. |

*Additional variables such as `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and SMTP credentials can also be added here as needed.*

---

## 🌐 Step 4: Expose Domain Routing
Dokploy uses Traefik for reverse-proxying.
1. In your Dokploy Compose service, navigate to the **Domains** tab.
2. Click **Add Domain**.
3. Select the `web` service and target port **`80`**.
4. Enter your public domain (e.g. `odysseus.yourdomain.com`).
5. Click save. Dokploy will automatically configure SSL certificates and route traffic to the Nginx server on the `web` container.

---

## 🗄️ Step 5: Initialize the Better Auth Database (First-time Deployment)
Once your stack is built and running in Dokploy:
1. In the Dokploy service dashboard, click on the **Containers** or **Logs** section to ensure all three services (`web`, `api`, `pocketbase`) are running.
2. Navigate to the **api** container console/terminal inside Dokploy.
3. Run the following command to migrate your SQLite database and create the Better Auth tables:
   ```bash
   npx @better-auth/cli migrate --config ./src/lib/auth.js
   ```
4. Press **`y`** to confirm and complete the database migration.

---

## 🔄 Updating / Redeploying
- Any push to your GitHub `main` branch will automatically trigger a redeploy if **Auto Deploy** is enabled.
- Database files for both **PocketBase** (`api_data`) and **Better Auth** (`pocketbase_data`) are mounted using Docker volumes, ensuring no user accounts or configuration data are lost during container rebuilds.
