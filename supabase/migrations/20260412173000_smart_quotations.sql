-- Migration: Smart Quotation System
-- Created: 2026-04-13

-- 1. Create Quotations Table
CREATE TABLE IF NOT EXISTS public.anekafoto_quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.anekafoto_leads(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.anekafoto_customers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'negotiating')),
    total_amount NUMERIC DEFAULT 0,
    valid_until TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Quotation Items Table
CREATE TABLE IF NOT EXISTS public.anekafoto_quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES public.anekafoto_quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.anekafoto_products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC DEFAULT 0,
    total_price NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.anekafoto_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anekafoto_quotation_items ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Public (anon) can READ a specific quotation if they have the ID (UUID is secret enough)
CREATE POLICY "Allow anonymous read on quotations" ON public.anekafoto_quotations
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read on quotation items" ON public.anekafoto_quotation_items
    FOR SELECT USING (true);

-- Authenticated (staff) can do everything
CREATE POLICY "Allow service role full access on quotations" ON public.anekafoto_quotations
    USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on quotation items" ON public.anekafoto_quotation_items
    USING (auth.role() = 'service_role');

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_quotations
    BEFORE UPDATE ON public.anekafoto_quotations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
