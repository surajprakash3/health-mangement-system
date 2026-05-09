#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-ssl.sh — Generate a self-signed SSL certificate for local development
#
# Usage:  bash nginx/generate-ssl.sh
# Output: nginx/ssl/cert.pem  +  nginx/ssl/key.pem
# ─────────────────────────────────────────────────────────────────────────────

set -e

SSL_DIR="$(dirname "$0")/ssl"

echo "📁  Creating ssl directory at: $SSL_DIR"
mkdir -p "$SSL_DIR"

echo "🔐  Generating self-signed certificate (valid 365 days)..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/key.pem" \
    -out    "$SSL_DIR/cert.pem" \
    -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=HealthMS/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo ""
echo "✅  Done! Files created:"
echo "    • $SSL_DIR/cert.pem"
echo "    • $SSL_DIR/key.pem"
echo ""
echo "⚠️   This is a SELF-SIGNED certificate — browsers will show a warning."
echo "    For production, replace these with Let's Encrypt certificates."
echo "    Mount them in docker-compose.yml under nginx volumes:"
echo "    - ./nginx/ssl:/etc/nginx/ssl:ro"
