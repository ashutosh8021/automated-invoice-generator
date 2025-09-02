#!/bin/bash

# Build script for Netlify deployment
# This script replaces placeholder values with environment variables

echo "🔧 Setting up environment for deployment..."

# Create production environment file from example if it doesn't exist
if [ ! -f "src/environments/environment.prod.ts" ]; then
    echo "📄 Creating environment.prod.ts from example..."
    cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
fi

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ ERROR: Environment variables SUPABASE_URL and SUPABASE_ANON_KEY must be set in Netlify!"
    echo "   Go to Site Settings > Environment Variables and add them."
    exit 1
fi

echo "🔧 Replacing environment variables..."

# Replace placeholders in production environment file
sed -i "s|YOUR_SUPABASE_URL|$SUPABASE_URL|g" src/environments/environment.prod.ts
sed -i "s|YOUR_SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" src/environments/environment.prod.ts

echo "✅ Environment variables set"
echo "🏗️ Building Angular application..."

# Build the application
npm run build

echo "✅ Build complete!"
