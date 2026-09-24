#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: ./dev.sh <public-url-root> <api-url>"
  echo "Example: ./dev.sh ufd-26-freedom-wall http://localhost:8000"
  exit 1
fi

PUBLIC_ROOT="$1"
API_URL="$2"

echo "Starting dev server with:"
echo "  PUBLIC_URL_ROOT = $PUBLIC_ROOT"
echo "  VITE_API_URL    = $API_URL"
echo ""

PUBLIC_URL_ROOT="$PUBLIC_ROOT" VITE_API_URL="$API_URL" npm run dev
