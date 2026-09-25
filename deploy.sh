#!/bin/bash
set -e

echo "=========================================================="
echo "  🚀 RestoSaaS Enterprise Platform - Deployment Script"
echo "=========================================================="

# 1. Environment file setup (fail fast: never auto-create with placeholder secrets)
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found."
  echo "   Copy .env.example to .env and fill in real secrets:"
  echo "     cp .env.example .env"
  echo "     openssl rand -base64 48   # use output as APP_JWT_SECRET"
  exit 1
fi

# 2. Validate required secrets are present and strong enough
set -a; source .env; set +a
if [ -z "${APP_JWT_SECRET:-}" ] || [ "${#APP_JWT_SECRET}" -lt 32 ] || [[ "$APP_JWT_SECRET" == __* ]]; then
  echo "❌ Error: APP_JWT_SECRET is missing, a placeholder, or shorter than 32 characters in .env."
  exit 1
fi
if [ -z "${POSTGRES_PASSWORD:-}" ] || [[ "$POSTGRES_PASSWORD" == __* ]]; then
  echo "❌ Error: POSTGRES_PASSWORD is missing or left as placeholder in .env."
  exit 1
fi

# 3. Check Docker availability
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first."
    exit 1
fi

echo "📦 Building and starting containers (PostgreSQL, Backend, Frontend, Nginx)..."
docker compose down --remove-orphans || true
docker compose build --parallel
docker compose up -d

echo "⏳ Waiting for services to become healthy..."
sleep 10

echo "=========================================================="
echo "  ✅ Deployment Complete & Online!"
echo "=========================================================="
echo "  🌐 Gateway & Frontend URL : http://localhost"
echo "  ⚙️ Backend REST API       : http://localhost/api/v1 (via gateway)"
echo ""
echo "  ℹ️  No demo accounts are seeded in production."
echo "     Onboard a tenant via POST /api/v1/auth/register-restaurant."
echo "=========================================================="
