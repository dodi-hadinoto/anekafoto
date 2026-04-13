'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function approveQuotation(id: string) {
  try {
    // 1. Update Quotation
    const { data: quote, error: qError } = await supabase
      .from('anekafoto_quotations')
      .update({ status: 'approved' })
      .eq('id', id)
      .select('lead_id')
      .single();

    if (qError) throw qError;

    // 2. Update Lead if exists
    if (quote.lead_id) {
      await supabase
        .from('anekafoto_leads')
        .update({ status: 'closed_won' })
        .eq('id', quote.lead_id);
    }

    revalidatePath(`/quote/${id}`);
    revalidatePath('/leads');
    revalidatePath('/quotations');
    
    return { success: true };
  } catch (error) {
    console.error('Error approving quotation:', error);
    return { success: false, error: 'Failed to approve deal.' };
  }
}
