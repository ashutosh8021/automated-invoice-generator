#!/bin/bash

# Build script for Netlify deployment
# This script replaces placeholder values with environment variables

echo "🔧 Replacing environment variables..."

# Replace placeholders in production environment file
sed -i "s|YOUR_SUPABASE_URL|$SUPABASE_URL|g" src/environments/environment.prod.ts
sed -i "s|YOUR_SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" src/environments/environment.prod.ts

echo "✅ Environment variables set"
echo "🏗️ Building Angular application..."

# Build the application
npm run build

echo "✅ Build complete!"
