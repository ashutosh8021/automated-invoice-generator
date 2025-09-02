# 🔒 SECURITY NOTICE - Environment Setup

## ⚠️ Important Security Information

**The environment files containing Supabase credentials were accidentally pushed to this repository. If you're using this repository:**

### 🚨 Immediate Actions for Repository Owner:
1. **Rotate your Supabase keys immediately**:
   - Go to your Supabase dashboard
   - Navigate to Settings > API
   - Generate new anon/public key
   - Update your local environment files

2. **For production use, consider using environment variables instead of committed files**

### 🛠️ Environment Setup for New Users:

1. **Copy example files:**
   ```bash
   cp frontend/src/environments/environment.example.ts frontend/src/environments/environment.ts
   cp frontend/src/environments/environment.prod.example.ts frontend/src/environments/environment.prod.ts
   ```

2. **Update with your Supabase credentials:**
   - Replace `YOUR_SUPABASE_URL` with your Supabase project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your Supabase anon key

3. **The environment files are now git-ignored to prevent future credential exposure**

### 📝 Supabase Setup:
Use the `FRESH_SUPABASE_SCHEMA.sql` file to set up your database schema.

---
**Never commit real credentials to version control!**
