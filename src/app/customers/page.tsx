import React from 'react';
import { CustomerDirectory } from '@/components/CustomerDirectory';
import { supabase } from '@/lib/supabase';

export default async function CustomersPage() {
  // Initial server-side fetch for speed
  const { data: initialCustomers } = await supabase
    .from('anekafoto_customers')
    .select('*, anekafoto_customer_categories(name)')
    .order('created_at', { ascending: false });

  return (
    <CustomerDirectory initialCustomers={initialCustomers || []} />
  );
}
