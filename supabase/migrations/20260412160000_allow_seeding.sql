-- Allow service role and authenticated users to insert/update data for seeding
CREATE POLICY "Allow service role full access" ON public.anekafoto_products
    FOR ALL
    USING (true)
    WITH CHECK (true);
