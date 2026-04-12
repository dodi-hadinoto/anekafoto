-- Migration: Customer & Lead Management
-- Created: 2026-04-12

-- 1. Create Customer Categories
CREATE TABLE IF NOT EXISTS public.anekafoto_customer_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Customers
CREATE TABLE IF NOT EXISTS public.anekafoto_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp TEXT UNIQUE,
    email TEXT,
    address TEXT,
    category_id UUID REFERENCES public.anekafoto_customer_categories(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Leads (Sales Pipeline)
CREATE TABLE IF NOT EXISTS public.anekafoto_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.anekafoto_customers(id),
    product_id UUID REFERENCES public.anekafoto_products(id),
    status TEXT DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'quotation', 'negotiation', 'closed_won', 'closed_lost')),
    source TEXT DEFAULT 'whatsapp',
    estimated_value NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Interactions (History)
CREATE TABLE IF NOT EXISTS public.anekafoto_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.anekafoto_customers(id),
    type TEXT NOT NULL CHECK (type IN ('whatsapp', 'call', 'meeting', 'note')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Default Categories Seed
INSERT INTO public.anekafoto_customer_categories (name, description, discount_percentage)
VALUES 
    ('Regular', 'Standard customer', 0),
    ('Silver', 'Loyal customer with minor discount', 5),
    ('Gold', 'Highly active customer', 10),
    ('Reseller', 'B2B partner with special pricing', 15)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.anekafoto_customer_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anekafoto_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anekafoto_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anekafoto_interactions ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Public Read for Product-Related, Service Role for others)
CREATE POLICY "Allow public read on categories" ON public.anekafoto_customer_categories FOR SELECT USING (true);
