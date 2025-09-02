-- =====================================================
-- FRESH SUPABASE DATABASE SCHEMA FOR INVOICE GENERATOR
-- =====================================================
-- Copy and paste this ENTIRE script into your Supabase SQL Editor
-- and click "RUN" to set up your database properly

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE INVOICES TABLE
-- =====================================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE,
  
  -- Customer Information (embedded directly in invoice)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_address TEXT,
  customer_city VARCHAR(100),
  customer_state VARCHAR(100),
  customer_postal_code VARCHAR(20),
  customer_country VARCHAR(100) DEFAULT 'USA',
  
  -- Invoice Details
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Financial Information
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Status and Notes
  payment_status VARCHAR(20) DEFAULT 'PENDING' 
    CHECK (payment_status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
  notes TEXT,
  terms TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INVOICE ITEMS TABLE
-- =====================================================
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  -- Item Details
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for customer lookup and autocomplete
CREATE INDEX idx_invoices_customer_name ON public.invoices(customer_name);
CREATE INDEX idx_invoices_customer_phone ON public.invoices(customer_phone);
CREATE INDEX idx_invoices_customer_name_phone ON public.invoices(customer_name, customer_phone);

-- Indexes for filtering and sorting
CREATE INDEX idx_invoices_payment_status ON public.invoices(payment_status);
CREATE INDEX idx_invoices_invoice_date ON public.invoices(invoice_date);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at);

-- Indexes for invoice items
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);

-- Index for invoice number lookup
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);

-- =====================================================
-- 4. CREATE FUNCTIONS FOR AUTO-GENERATION
-- =====================================================

-- Function to generate invoice numbers automatically
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || LPAD(EXTRACT(YEAR FROM NEW.invoice_date)::TEXT, 4, '0') || 
                         '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for invoice numbering
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Create trigger to auto-generate invoice numbers
CREATE TRIGGER trigger_generate_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER trigger_update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all operations for now)
-- Note: In production, you should create more restrictive policies based on user authentication

CREATE POLICY "Allow all operations on invoices" 
  ON public.invoices FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on invoice_items" 
  ON public.invoice_items FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);

-- =====================================================
-- 6. INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample invoices with proper field names
INSERT INTO public.invoices (
  customer_name, customer_email, customer_phone,
  customer_address, customer_city, customer_state, customer_postal_code, customer_country,
  invoice_date, due_date, subtotal, tax_rate, tax_amount, total, payment_status, notes, terms
) VALUES 
  (
    'John Doe', 'john.doe@example.com', '+1-555-0123', 
    '123 Main Street, Apt 4B', 'New York', 'NY', '10001', 'USA',
    '2024-01-15', '2024-02-14', 1000.00, 8.25, 82.50, 1082.50, 'PENDING', 
    'Website development project - Phase 1', 'Payment due within 30 days. Late fees may apply.'
  ),
  (
    'Jane Smith', 'jane.smith@techcorp.com', '+1-555-0124',
    '456 Oak Avenue, Suite 200', 'Los Angeles', 'CA', '90210', 'USA', 
    '2024-01-20', '2024-02-19', 750.00, 8.25, 61.88, 811.88, 'PAID', 
    'Mobile app UI/UX design', 'Thank you for your business!'
  ),
  (
    'Bob Johnson', 'bob@startup.io', '+1-555-0125',
    '789 Pine Street', 'Chicago', 'IL', '60601', 'USA',
    '2024-01-25', '2024-02-24', 1500.00, 8.25, 123.75, 1623.75, 'OVERDUE', 
    'Database optimization and server setup', 'Payment overdue. Please contact us immediately.'
  ),
  (
    'Alice Chen', 'alice.chen@designstudio.com', '+1-555-0126',
    '321 Elm Drive', 'Seattle', 'WA', '98101', 'USA',
    '2024-02-01', '2024-03-02', 2000.00, 8.25, 165.00, 2165.00, 'PENDING',
    'E-commerce platform development', 'Payment terms: Net 30'
  ),
  (
    'Mike Wilson', 'mike.wilson@consulting.com', '+1-555-0127',
    '654 Maple Court', 'Austin', 'TX', '73301', 'USA',
    '2024-02-05', '2024-03-07', 850.00, 8.25, 70.13, 920.13, 'PAID',
    'Data analytics consultation', 'Pleasure working with you!'
  );

-- Insert sample invoice items for the invoices
INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, total)
SELECT 
  i.id,
  'Sample Item ' || uuid_generate_v4()::text,
  1,
  i.subtotal,
  i.subtotal
FROM public.invoices i;

-- Add some invoices with multiple items
DO $$
DECLARE
  v_invoice_id UUID;
BEGIN
  -- Get the first invoice ID
  SELECT id INTO v_invoice_id FROM public.invoices LIMIT 1;
  
  -- Clear existing items for this invoice
  DELETE FROM public.invoice_items WHERE invoice_items.invoice_id = v_invoice_id;
  
  -- Add multiple items
  INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, total) VALUES
    (v_invoice_id, 'Frontend Development', 40, 15.00, 600.00),
    (v_invoice_id, 'Backend API Development', 25, 16.00, 400.00);
END $$;

-- =====================================================
-- 7. CREATE VIEWS FOR EASY QUERYING (OPTIONAL)
-- =====================================================

-- View for invoice summary with item count
CREATE VIEW invoice_summary AS
SELECT 
  i.*,
  COUNT(ii.id) as item_count,
  CASE 
    WHEN i.payment_status = 'PAID' THEN 'Completed'
    WHEN i.payment_status = 'OVERDUE' THEN 'Requires Attention'
    ELSE 'Active'
  END as status_group
FROM public.invoices i
LEFT JOIN public.invoice_items ii ON i.id = ii.invoice_id
GROUP BY i.id;

-- =====================================================
-- 8. FINAL VERIFICATION QUERIES
-- =====================================================

-- These queries will show you the data that was created
-- You can run them separately to verify everything worked

-- Check invoices table
-- SELECT * FROM public.invoices ORDER BY created_at DESC;

-- Check invoice items table  
-- SELECT * FROM public.invoice_items ORDER BY invoice_id;

-- Check invoice summary view
-- SELECT * FROM invoice_summary ORDER BY created_at DESC;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready with:
-- ✓ Proper table structure with all required fields
-- ✓ Indexes for fast customer autocomplete lookups
-- ✓ Auto-generated invoice numbers
-- ✓ Sample data for testing
-- ✓ Row Level Security enabled
-- ✓ Proper relationships between tables
-- =====================================================
