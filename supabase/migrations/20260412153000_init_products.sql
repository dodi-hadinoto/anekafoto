-- Drop existing tables to support prefix transition
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.anekafoto_products CASCADE;

-- Create the products table with company prefix
CREATE TABLE public.anekafoto_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT,
    price NUMERIC(15, 2),
    specifications JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    url TEXT UNIQUE,
    images TEXT[] DEFAULT '{}',
    scraped_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.anekafoto_products ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the products
CREATE POLICY "Allow public read access" ON public.anekafoto_products
    FOR SELECT USING (true);

-- Create secondary indexes for performance
CREATE INDEX IF NOT EXISTS idx_anekafoto_products_price ON public.anekafoto_products (price);
CREATE INDEX IF NOT EXISTS idx_anekafoto_products_brand ON public.anekafoto_products (brand);
