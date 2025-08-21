# 🚀 Free Deployment Guide - Automated Invoice Generator

## 📋 Prerequisites
- GitHub account
- Git installed on your computer

## 🔧 Step 1: Prepare Repository

1. **Initialize Git repository:**
```bash
cd "D:\automated invoice"
git init
git add .
git commit -m "Initial commit - Automated Invoice Generator"
```

2. **Create GitHub repository:**
   - Go to GitHub.com
   - Create new repository: `automated-invoice-generator`
   - Don't initialize with README (we already have code)

3. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/automated-invoice-generator.git
git branch -M main
git push -u origin main
```

## 🚂 Step 2: Deploy Backend on Railway

1. **Sign up for Railway:**
   - Go to https://railway.app
   - Sign up with GitHub account (Free tier: $5 credit monthly)

2. **Deploy Backend:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `automated-invoice-generator` repository
   - Select "backend" folder as root directory
   - Railway will auto-detect Spring Boot

3. **Add PostgreSQL Database:**
   - In your Railway project dashboard
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set DATABASE_URL environment variable

4. **Configure Environment Variables:**
   - Go to your backend service settings
   - Add environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   CORS_ORIGINS=https://your-app-name.netlify.app
   ```

5. **Get Backend URL:**
   - Railway will provide a URL like: `https://your-backend-app.railway.app`
   - Copy this URL

## 🌐 Step 3: Deploy Frontend on Netlify

1. **Sign up for Netlify:**
   - Go to https://netlify.com
   - Sign up with GitHub account (Free tier: 100GB bandwidth)

2. **Update Frontend Configuration:**
   - Update `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend-app.railway.app/api'
   };
   ```

3. **Update Netlify Configuration:**
   - Update `frontend/netlify.toml`:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-backend-app.railway.app/api/:splat"
     status = 200
   ```

4. **Deploy to Netlify:**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Set build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `dist/invoice-frontend`
   - Click "Deploy site"

5. **Update CORS Configuration:**
   - Once deployed, get your Netlify URL (e.g., `https://your-app.netlify.app`)
   - Update Railway backend environment variable:
   ```
   CORS_ORIGINS=https://your-app.netlify.app,http://localhost:4200
   ```

## 🔗 Step 4: Final Configuration

1. **Update Backend CORS:**
   - In Railway dashboard, restart your backend service
   - The new CORS settings will take effect

2. **Test Your Application:**
   - Visit your Netlify URL
   - Test all functionality:
     - Add clients
     - Create invoices
     - Verify calculations work
     - Test PDF download
     - Test email functionality

## 💰 Cost Breakdown (FREE!)

### Railway (Backend + Database):
- ✅ FREE: $5 monthly credit
- ✅ PostgreSQL database included
- ✅ Automatic deployments
- ✅ Custom domain support

### Netlify (Frontend):
- ✅ FREE: 100GB bandwidth
- ✅ CDN included
- ✅ Custom domain support
- ✅ Automatic deployments

## 🛠 Alternative Free Options

### Option 2: Vercel + Render
1. **Frontend**: Deploy to Vercel (vercel.com)
2. **Backend**: Deploy to Render (render.com)

### Option 3: GitHub Pages + Heroku
1. **Frontend**: Deploy to GitHub Pages
2. **Backend**: Deploy to Heroku (free tier)

## 🔐 Environment Variables Reference

### Railway Backend:
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=(auto-set by Railway)
CORS_ORIGINS=https://your-app.netlify.app
PORT=(auto-set by Railway)
```

### Optional Email Configuration:
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🚀 Automatic Deployments

Both platforms support automatic deployments:
- **Railway**: Redeploys backend on every Git push
- **Netlify**: Redeploys frontend on every Git push

## 📞 Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Netlify build logs for frontend errors
3. Verify environment variables are set correctly
4. Test CORS configuration

Your automated invoice generator will be live and accessible to anyone with the URL!

## 🎉 Your App URLs
- **Frontend**: https://your-app.netlify.app
- **Backend API**: https://your-backend-app.railway.app
- **Database**: Managed by Railway (PostgreSQL)

Total Cost: **$0/month** with free tiers!
