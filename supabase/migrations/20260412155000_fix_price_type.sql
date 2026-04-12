-- Fix price column to be more flexible
ALTER TABLE public.anekafoto_products 
    ALTER COLUMN price TYPE NUMERIC;
