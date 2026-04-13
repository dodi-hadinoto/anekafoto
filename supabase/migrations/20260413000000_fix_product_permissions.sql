-- Ensure the anon and authenticated roles have access to the public schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Explicitly grant SELECT access to the common CRM tables
GRANT SELECT ON public.anekafoto_products TO anon;
GRANT SELECT ON public.anekafoto_products TO authenticated;

GRANT SELECT ON public.anekafoto_customers TO anon;
GRANT SELECT ON public.anekafoto_customers TO authenticated;

GRANT SELECT ON public.anekafoto_leads TO anon;
GRANT SELECT ON public.anekafoto_leads TO authenticated;

-- Ensure RLS is enabled and set correctly to true for public read
ALTER TABLE public.anekafoto_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.anekafoto_products;
CREATE POLICY "Allow public read access" ON public.anekafoto_products FOR SELECT USING (true);

ALTER TABLE public.anekafoto_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.anekafoto_customers;
CREATE POLICY "Allow public read access" ON public.anekafoto_customers FOR SELECT USING (true);

ALTER TABLE public.anekafoto_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.anekafoto_leads;
CREATE POLICY "Allow public read access" ON public.anekafoto_leads FOR SELECT USING (true);
