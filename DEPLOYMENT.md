# 🚀 RestoSaaS Enterprise Platform — Production Deployment Guide

This guide covers all recommended production deployment strategies for the **RestoSaaS Multi-Tenant Restaurant Platform**.

---

## 🏗️ Architecture & Ports Overview

| Service | Port (Container) | Port (Host / External) | Description |
| :--- | :--- | :--- | :--- |
| **Nginx Gateway** | 80 | `80` (HTTP) / `443` (HTTPS) | Unified reverse proxy with WebSocket support |
| **Frontend (Next.js 15)** | 3000 | `3000` | Server-side rendered React 19 UI & App Router |
| **Backend (Spring Boot 3)** | 8080 | `8080` (Internal/API) | Java 21 REST API & STOMP Message Broker |
| **Database (PostgreSQL 16)** | 5432 | `5432` | PostgreSQL with multi-tenant row isolation |

---

## Option 1: 1-Click Single Server / VPS Deployment (Recommended)

Deploy on any Linux VM (AWS EC2, DigitalOcean Droplet, Hetzner, Linode, Ubuntu/Debian/Fedora).

### Step 1: Clone and Configure Environment
```bash
git clone <your-repo-url> resto-saas
cd resto-saas

# Copy environment template
cp .env.example .env
```

Edit `.env` to configure your production credentials:
```env
POSTGRES_DB=restaurant_saas_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YourStrongDatabasePassword123!
APP_JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### Step 2: Run Deployment Script
```bash
./deploy.sh
```

Or manually with Docker Compose:
```bash
docker compose up -d --build
```

### Step 3: Access Live Services
* 🌐 **Main Web App**: `http://<your-server-ip>`
* 🛒 **POS Terminal**: `http://<your-server-ip>/terminal`
* 🍳 **Kitchen Display (KDS)**: `http://<your-server-ip>/kds`
* 📱 **QR Menu Scan**: `http://<your-server-ip>/menu/5da85f64-5717-4562-b3fc-2c963f66afb5`
* 📚 **Swagger API Documentation**: `http://<your-server-ip>/api/v1/swagger-ui.html`

---

## Option 2: Cloud PaaS Deployment (Render / Railway)

### 1. PostgreSQL Database
1. Create a Managed PostgreSQL 16 database on **Railway** or **Render**.
2. Note the `DATABASE_URL` or individual host, port, user, and password.

### 2. Backend (Spring Boot 3)
1. In Railway or Render, create a new **Web Service** pointing to `/backend`.
2. Select **Dockerfile** as the build method (uses `/backend/Dockerfile`).
3. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<db_host>:<db_port>/<db_name>`
   - `SPRING_DATASOURCE_USERNAME`: `<db_user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db_password>`
   - `APP_JWT_SECRET`: `<your_64_char_secret>`
4. Port: `8080`

### 3. Frontend (Next.js 15)
1. Deploy `/frontend` to **Vercel** or **Railway/Render**.
2. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://<your-backend-service-domain>/api/v1`
   - `BACKEND_INTERNAL_URL`: `https://<your-backend-service-domain>/api/v1/:path*`
3. Build Command: `npm run build`
4. Output Directory: Standalone

---

## 🔒 Enabling Free SSL / HTTPS with Let's Encrypt & Certbot

If deploying on a custom domain (e.g. `app.yourdomain.com`):

1. Point your domain's DNS `A` record to your server's public IP.
2. Install Certbot on the host:
   ```bash
   sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d app.yourdomain.com
   ```
3. Auto-renewal is automatically scheduled via cron.

---

## 🔑 Pre-Seeded Default Accounts

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Restaurant Owner** | `owner@royalbistro.com` | `Admin@123` | Full Dashboard & Settings |
| **POS Cashier** | `cashier@royalbistro.com` | `Admin@123` | POS Terminal & Billing |
| **Kitchen Chef** | `chef@royalbistro.com` | `Admin@123` | Kitchen Display System (KDS) |
| **Platform Admin** | `admin@restaurantsaas.io` | `Admin@123` | SaaS Superadmin |
