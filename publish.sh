#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: ./publish.sh <public-url-root> <api-url>"
  echo "Example: ./publish.sh ufd-26-freedom-wall https://your-backend.koyeb.app"
  exit 1
fi

PUBLIC_ROOT="$1"
API_URL="$2"

echo "Building with:"
echo "  PUBLIC_URL_ROOT = $PUBLIC_ROOT"
echo "  VITE_API_URL    = $API_URL"
echo ""

PUBLIC_URL_ROOT="$PUBLIC_ROOT" VITE_API_URL="$API_URL" npm run build

OUT_DIR="${PUBLIC_ROOT#/}"
OUT_DIR="${OUT_DIR%/}"

cp "$OUT_DIR/index.html" "$OUT_DIR/404.html"

echo ""
echo "Done. Output in ./$OUT_DIR/"
