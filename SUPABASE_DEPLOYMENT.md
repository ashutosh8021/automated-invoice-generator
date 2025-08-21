# Netlify + Supabase Deployment Guide

This guide walks you through deploying the automated invoice generator using Netlify for the frontend and Supabase for the backend database.

## Prerequisites

- GitHub account
- Netlify account (free tier available)
- Supabase account (free tier available)

## 1. Supabase Setup

### Step 1: Create Supabase Project
1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `automated-invoice-generator`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

### Step 2: Database Schema Setup
1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL to create your tables:

```sql
-- Create clients table
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(payment_status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Enable all operations for all users" ON clients FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON invoices FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON invoice_items FOR ALL USING (true);
```

### Step 3: Get Supabase Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL (supabaseUrl)
   - anon public key (supabaseAnonKey)

## 2. Environment Configuration

### Step 1: Update Environment Files
1. Open `frontend/src/environments/environment.ts`
2. Replace the placeholder values with your Supabase credentials:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  apiUrl: 'YOUR_SUPABASE_URL/rest/v1'
};
```

3. Update `frontend/src/environments/environment.prod.ts` with the same values but set `production: true`

## 3. Netlify Deployment

### Step 1: Prepare for Deployment
1. Ensure your project is in a Git repository
2. Push your changes to GitHub:

```bash
git add .
git commit -m "Convert to Supabase backend"
git push origin main
```

### Step 2: Create Netlify Site
1. Go to [Netlify](https://netlify.com) and login
2. Click "New site from Git"
3. Choose GitHub and authorize
4. Select your repository
5. Configure build settings:
   - Build command: `cd frontend && npm ci && npm run build`
   - Publish directory: `frontend/dist/automated-invoice-generator`
   - Base directory: (leave empty)

### Step 3: Environment Variables
1. In Netlify dashboard, go to Site settings > Environment variables
2. Add the following variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at a random Netlify URL

## 4. Custom Domain (Optional)

1. In Netlify dashboard, go to Domain settings
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## 5. Testing the Deployment

1. Visit your Netlify site URL
2. Test creating a client
3. Test creating an invoice
4. Verify data persistence by refreshing the page

## 6. Monitoring and Maintenance

### Supabase Monitoring
- Monitor database usage in Supabase dashboard
- Check API usage and limits
- Monitor storage usage

### Netlify Monitoring
- Check build logs for any issues
- Monitor bandwidth usage
- Set up form notifications if needed

## 7. Limitations and Future Enhancements

### Current Limitations
- PDF generation not implemented (requires Supabase Edge Functions)
- Email sending not implemented (requires Supabase Edge Functions)
- No user authentication (all data is public)

### Future Enhancements
1. **PDF Generation**: Implement using Supabase Edge Functions with a PDF library
2. **Email Service**: Use Supabase Edge Functions with email providers like SendGrid
3. **Authentication**: Add Supabase Auth for user management
4. **File Storage**: Use Supabase Storage for invoice attachments

## 8. Cost Considerations

### Free Tier Limits
- **Supabase**: 500MB database, 2GB bandwidth, 50MB file storage
- **Netlify**: 100GB bandwidth, 300 build minutes, 1 concurrent build

### Scaling
Both services offer paid plans when you exceed free tier limits.

## Troubleshooting

### Common Issues
1. **Build Fails**: Check Node.js version compatibility
2. **Environment Variables**: Ensure all Supabase credentials are correctly set
3. **CORS Issues**: Verify Supabase URL configuration
4. **Database Connection**: Check Supabase project status

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
