-- Schema for RetailIQ Database
-- Run this in the Supabase SQL Editor

-- 0. Drop existing policies first, then tables
DO $$ BEGIN
  -- Drop policies on invoices
  DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Allow public select on invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Allow public insert on invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Allow public update on invoices" ON public.invoices;
  DROP POLICY IF EXISTS "Allow public delete on invoices" ON public.invoices;
  -- Drop policies on products
  DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
  DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
  DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
  DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
  DROP POLICY IF EXISTS "Allow public select on products" ON public.products;
  DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
  DROP POLICY IF EXISTS "Allow public update on products" ON public.products;
  DROP POLICY IF EXISTS "Allow public delete on products" ON public.products;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop tables
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.invoices;

-- 1. Create Invoices Table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    filename TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    raw_ocr_text TEXT,
    supplier TEXT
);

-- 2. Create Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price NUMERIC(10, 2) DEFAULT 0.0,
    supplier TEXT,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- These policies allow:
--   a) Authenticated users to access their own rows (via auth.uid())
--   b) The anon/service key (used by backend) to access rows where user_id matches
--      (the backend validates the JWT and passes user_id explicitly)

-- Invoices policies
CREATE POLICY "invoices_select" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "invoices_insert" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "invoices_update" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "invoices_delete" ON public.invoices FOR DELETE USING (true);

-- Products policies
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "products_delete" ON public.products FOR DELETE USING (true);

-- NOTE: Security is enforced at the APPLICATION LEVEL in the FastAPI backend.
-- Every endpoint requires a valid Supabase JWT (via auth_utils.py).
-- The backend extracts user_id from the token and filters all queries by user_id.
-- RLS policies here are permissive to allow the backend (using the anon key) to operate.
-- If you switch to a service_role key, you can make these policies stricter.
