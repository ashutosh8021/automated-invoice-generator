#!/bin/bash

# Build script for Netlify deployment
set -e  # Exit on any error

echo "🔧 Setting up environment for deployment..."

# Create production environment file from example if it doesn't exist
if [ ! -f "src/environments/environment.prod.ts" ]; then
    echo "📄 Creating environment.prod.ts from example..."
    cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
fi

# Create development environment file from example if it doesn't exist
if [ ! -f "src/environments/environment.ts" ]; then
    echo "📄 Creating environment.ts from example..."
    cp src/environments/environment.example.ts src/environments/environment.ts
fi

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ ERROR: Environment variables SUPABASE_URL and SUPABASE_ANON_KEY must be set in Netlify!"
    echo "   Go to Site Settings > Environment Variables and add them."
    exit 1
fi

echo "🔧 Replacing environment variables..."

# Replace placeholders in both environment files
sed -i "s|YOUR_SUPABASE_URL|$SUPABASE_URL|g" src/environments/environment.prod.ts
sed -i "s|YOUR_SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" src/environments/environment.prod.ts

sed -i "s|YOUR_SUPABASE_URL|$SUPABASE_URL|g" src/environments/environment.ts
sed -i "s|YOUR_SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" src/environments/environment.ts

# Replace company information if provided (optional)
if [ ! -z "$COMPANY_NAME" ]; then
    sed -i "s|Your Company Name|$COMPANY_NAME|g" src/environments/environment.prod.ts
    sed -i "s|Your Company Name|$COMPANY_NAME|g" src/environments/environment.ts
fi

if [ ! -z "$COMPANY_ADDRESS" ]; then
    sed -i "s|Your Company Address|$COMPANY_ADDRESS|g" src/environments/environment.prod.ts
    sed -i "s|Your Company Address|$COMPANY_ADDRESS|g" src/environments/environment.ts
fi

if [ ! -z "$COMPANY_PHONE" ]; then
    sed -i "s|Your Phone Number|$COMPANY_PHONE|g" src/environments/environment.prod.ts
    sed -i "s|Your Phone Number|$COMPANY_PHONE|g" src/environments/environment.ts
fi

if [ ! -z "$COMPANY_EMAIL" ]; then
    sed -i "s|your-email@company.com|$COMPANY_EMAIL|g" src/environments/environment.prod.ts
    sed -i "s|your-email@company.com|$COMPANY_EMAIL|g" src/environments/environment.ts
fi

if [ ! -z "$COMPANY_WEBSITE" ]; then
    sed -i "s|www.yourcompany.com|$COMPANY_WEBSITE|g" src/environments/environment.prod.ts
    sed -i "s|www.yourcompany.com|$COMPANY_WEBSITE|g" src/environments/environment.ts
fi

echo "✅ Environment variables set"
echo "🏗️ Building Angular application for production..."

# Build the application for production (ignore budget warnings)
npm run build -- --configuration=production || {
    echo "❌ Build failed with production config, trying default build..."
    npm run build || {
        echo "❌ Both builds failed!"
        exit 1
    }
}

# Verify build output exists
if [ ! -d "dist/invoice-frontend" ]; then
    echo "❌ Build output directory not found!"
    ls -la dist/ || echo "dist directory doesn't exist"
    exit 1
fi

echo "✅ Build complete! Output directory verified."
ls -la dist/invoice-frontend/
