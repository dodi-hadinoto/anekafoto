-- Step to rename products to anekafoto_products
DROP TABLE IF EXISTS public.products CASCADE;

-- Create the prefixed table (Redundant if init_products was updated, but safe for sync)
CREATE TABLE IF NOT EXISTS public.anekafoto_products (
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

-- Ensure RLS and Policies are applied to the new name
ALTER TABLE public.anekafoto_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.anekafoto_products;
CREATE POLICY "Allow public read access" ON public.anekafoto_products FOR SELECT USING (true);
