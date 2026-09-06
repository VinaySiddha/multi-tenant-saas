#!/bin/bash
set -e

echo "=========================================================="
echo "  🚀 RestoSaaS Enterprise Platform - Deployment Script"
echo "=========================================================="

# 1. Environment file setup
if [ ! -f .env ]; then
  echo "📄 Creating .env from .env.example..."
  cp .env.example .env
fi

# 2. Check Docker availability
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
echo "  📊 Direct Next.js App    : http://localhost:3000"
echo "  ⚙️ Backend REST API      : http://localhost:8080/api/v1"
echo "  📚 Swagger API Docs      : http://localhost:8080/api/v1/swagger-ui.html"
echo ""
echo "  🔑 Demo Credentials:"
echo "     - Email    : owner@royalbistro.com"
echo "     - Password : Admin@123"
echo "=========================================================="
