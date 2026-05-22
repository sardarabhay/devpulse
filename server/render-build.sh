#!/usr/bin/env bash
set -e

echo "Installing dependencies..."
npm install --include=dev

echo "Building TypeScript..."
npm run build