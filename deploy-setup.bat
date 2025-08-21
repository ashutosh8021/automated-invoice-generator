@echo off
echo 🚀 Automated Invoice Generator - Deployment Setup
echo ==================================================

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Prepare for deployment - Production ready"

echo.
echo ✅ Repository is ready for deployment!
echo.
echo 🔗 Next steps:
echo 1. Create GitHub repository: https://github.com/new
echo 2. Add remote origin:
echo    git remote add origin https://github.com/YOUR_USERNAME/automated-invoice-generator.git
echo 3. Push to GitHub:
echo    git push -u origin main
echo.
echo 4. Deploy backend on Railway: https://railway.app
echo 5. Deploy frontend on Netlify: https://netlify.com
echo.
echo 📖 Full deployment guide: See DEPLOYMENT.md

pause
