'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createQuotation(formData: {
  customer_id: string;
  lead_id?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
  notes?: string;
  valid_until: string;
}) {
  try {
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // 1. Create Quotation
    const { data: quotation, error: qError } = await supabase
      .from('anekafoto_quotations')
      .insert({
        customer_id: formData.customer_id,
        lead_id: formData.lead_id || null,
        total_amount: totalAmount,
        notes: formData.notes,
        valid_until: formData.valid_until,
        status: 'draft'
      })
      .select()
      .single();

    if (qError) throw qError;

    // 2. Create Items
    const quotationItems = formData.items.map(item => ({
      quotation_id: quotation.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    const { error: iError } = await supabase
      .from('anekafoto_quotation_items')
      .insert(quotationItems);

    if (iError) throw iError;

    // 3. Update Lead Status if it exists
    if (formData.lead_id) {
      await supabase
        .from('anekafoto_leads')
        .update({ status: 'quotation' })
        .eq('id', formData.lead_id);
    }

    revalidatePath('/quotations');
    return { success: true, data: quotation };
  } catch (error) {
    console.error('Error creating quotation:', error);
    return { success: false, error: 'Failed to create quotation.' };
  }
}
