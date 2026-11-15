# 🚀 Sapru Restaurant Management Platform — Production Deployment Guide

This guide covers production deployment, architecture, container orchestration, SSL/TLS configuration, environment hardening, and operations for the **Sapru Restaurant SaaS Platform**.

---

## 🏗️ Architecture & Services Overview

The platform is designed around a multi-tenant, cloud-native architecture comprising four isolated services:

| Service | Container Name | Internal Port | Host / Gateway Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Nginx Gateway** | `resto_saas_gateway` | 80 / 443 | `80` (HTTP), `443` (HTTPS) | Reverse proxy with WebSocket upgrade & Gzip compression |
| **Frontend (Next.js 16)** | `resto_saas_frontend` | 3000 | None (proxied) / `3000` | SSR React 19 UI (Turbopack, Standalone container) |
| **Backend (Spring Boot 3)** | `resto_saas_backend` | 8080 | None (proxied) / `8080` | Java 21 REST API, WebSocket/STOMP, Multi-tenant engine |
| **Database (PostgreSQL 16)**| `resto_saas_postgres` | 5432 | Internal only | PostgreSQL 16 with Flyway versioned migrations |

---

## 🛡️ Production Pre-Deployment Checklist

Before deploying to a public server or cloud instance:

1. **Rotate Passwords & Secrets**:
   - Generate a strong PostgreSQL password.
   - Generate a 256-bit (64-character hex) JWT secret key:
     ```bash
     openssl rand -hex 32
     ```
   - Set these values in `.env` (never commit `.env` to version control).
2. **Database Migrations**:
   - `spring.flyway.enabled: true` and `spring.jpa.hibernate.ddl-auto: validate` are pre-configured in `application-prod.yml` to safely apply migrations (`V1`, `V2`, `V3`) automatically on first startup.
3. **Database Port Isolation**:
   - PostgreSQL port `5432` is bound only to the internal Docker bridge network (`resto_network`) and is not exposed to the public internet.

---

## 🚀 Standard Docker Compose Deployment

### Step 1: Clone Repository & Enter Directory
```bash
git clone https://github.com/VinaySiddha/NewFolder.git sapru-platform
cd sapru-platform
```

### Step 2: Configure Environment Variables
Copy `.env.example` and populate your production secrets:
```bash
cp .env.example .env
nano .env
```

Example production configuration:
```env
# Database Credentials
POSTGRES_DB=restaurant_saas_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YourStrongDatabasePassword123!

# JWT Security (Must be 64-char hex)
APP_JWT_SECRET=c2e8a104f64798319f07153a54b6c31048b26e2a7e58a2d7139d67b2d415f3e9
APP_JWT_EXPIRATION_MS=86400000

# Payment Provider Webhook Signing Secret
BILLING_WEBHOOK_SECRET=whsec_your_razorpay_or_stripe_webhook_secret

# Server Environment
NODE_ENV=production
SPRING_PROFILES_ACTIVE=prod
NEXT_PUBLIC_API_URL=/api/v1
```

### Step 3: Launch Containers
Run the automated deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

Or deploy manually via Docker Compose:
```bash
docker compose down --remove-orphans || true
docker compose build --parallel
docker compose up -d
```

### Step 4: Verify Service Health
Check running container statuses and logs:
```bash
docker compose ps
docker compose logs -f backend
```

---

## 🔒 Enabling SSL/HTTPS with Let's Encrypt (Nginx)

For production web traffic, configure SSL termination via Certbot.

1. **Install Certbot on Host**:
   ```bash
   sudo apt-get update && sudo apt-get install -y certbot
   ```
2. **Obtain SSL Certificate (Standalone mode or Webroot)**:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   ```
3. **Mount Certificates in `docker-compose.yml`**:
   Add the following volume mounts under the `nginx` service:
   ```yaml
   volumes:
     - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
     - /etc/letsencrypt:/etc/letsencrypt:ro
   ```
4. **Update `nginx/nginx.conf` with HTTPS Server Block**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;

       # ... (proxy pass rules for /api/v1/ws, /api/v1/, and /)
   }
   ```

---

## 📊 Live Endpoints & Routes

| Section | Route | Description |
| :--- | :--- | :--- |
| **Landing & Marketing** | `/` | Responsive landing page, features, pricing overview |
| **Authentication & Onboarding** | `/login` | High-security login, Remember Me, new tenant signup |
| **Pricing & Plans** | `/pricing` | Tiered pricing matrix (Starter, Growth, Multi-Outlet) |
| **24/7 Support Portal** | `/support` | Help desk, ticket creation, FAQs, contact details |
| **Admin Dashboard** | `/dashboard` | Revenue telemetry, active orders, floorplan occupancy |
| **Kitchen Display (KDS)** | `/kds` | Real-time Kanban board with audio chime order alerts |
| **Floorplan & Tables** | `/tables` | Section manager, table occupancy, QR generator |
| **Menu Management** | `/menu` | Categorized catalog, price adjustments, veg/non-veg toggles |
| **Inventory & Stock** | `/inventory` | Raw material stock levels, reorder thresholds |
| **Staff & Roles** | `/staff` | Team member directory, branch assignment, RBAC |
| **Subscription & Invoicing** | `/billing` | Active trial status, plan upgrades, Razorpay/Stripe invoices |
| **Contactless QR Ordering** | `/menu/[tableId]` | Mobile guest self-ordering drawer |
| **OpenAPI / Swagger UI** | `/api/v1/swagger-ui.html` | Interactive REST documentation and schema testing |
| **OpenAPI JSON Spec** | `/api/v1/v3/api-docs` | Raw OpenAPI 3.0 specification |

---

## 🛠️ Operational Commands & Maintenance

- **Restart All Services**:
  ```bash
  docker compose restart
  ```
- **View Live Backend Logs**:
  ```bash
  docker compose logs -f backend
  ```
- **Backup PostgreSQL Database**:
  ```bash
  docker compose exec -t postgres pg_dump -U postgres restaurant_saas_db > backup_$(date +%Y%m%d_%H%M%S).sql
  ```
- **Restore PostgreSQL Database**:
  ```bash
  cat backup.sql | docker compose exec -T postgres psql -U postgres -d restaurant_saas_db
  ```
