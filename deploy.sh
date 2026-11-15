#!/bin/bash
set -e

echo "=========================================================="
echo "  🚀 Sapru Restaurant Management Platform - Deploy Script"
echo "=========================================================="

# 1. Environment file setup
if [ ! -f .env ]; then
  echo "📄 Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️ Warning: Please configure your real secrets in .env before exposing to production!"
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
sleep 8

echo "=========================================================="
echo "  ✅ Sapru Platform Deployment Complete & Online!"
echo "=========================================================="
echo "  🌐 Gateway Web Application : http://localhost"
echo "  🍳 Kitchen Display System  : http://localhost/kds"
echo "  💳 Subscriptions & Billing : http://localhost/billing"
echo "  🏷️ Pricing & Features      : http://localhost/pricing"
echo "  ⚙️ Backend REST API Root   : http://localhost/api/v1"
echo "  📚 OpenAPI / Swagger UI    : http://localhost/api/v1/swagger-ui.html"
echo "=========================================================="
