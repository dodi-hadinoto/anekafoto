'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: {
  customer_id: string;
  product_id?: string;
  source?: string;
  estimated_value: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('anekafoto_leads')
    .insert([
      {
        customer_id: formData.customer_id,
        product_id: formData.product_id,
        source: formData.source || 'Direct',
        status: 'inquiry',
        estimated_value: formData.estimated_value,
        notes: formData.notes
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/(crm)/leads', 'page');
  return { success: true, data };
}
