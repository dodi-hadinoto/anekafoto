'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createCustomer(formData: {
  full_name: string;
  whatsapp: string;
  email?: string;
  address?: string;
  category_id: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('anekafoto_customers')
    .insert([formData])
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/(crm)/customers', 'page');
  return { success: true, data };
}
