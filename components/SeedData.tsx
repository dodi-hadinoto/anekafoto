'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const seed = async () => {
    setLoading(true);
    setStatus('idle');

    try {
      // 2. Ensure Categories Exist
      const categoriesToCreate = [
        { name: 'Regular', discount_percent: 0 },
        { name: 'Silver', discount_percent: 5 },
        { name: 'Gold', discount_percent: 10 },
        { name: 'Wholesale', discount_percent: 15 },
      ];

      const { data: existingCats } = await supabase.from('anekafoto_customer_categories').select('*');
      let currentCategories = existingCats || [];

      if (currentCategories.length === 0) {
        const { data: newCats, error: errCat } = await supabase
          .from('anekafoto_customer_categories')
          .insert(categoriesToCreate)
          .select();
        if (errCat) throw errCat;
        currentCategories = newCats || [];
      }

      const regularId = currentCategories.find(c => c.name === 'Regular')?.id;
      const silverId = currentCategories.find(c => c.name === 'Silver')?.id;

      // 3. Create Sample Real Customers (Optional Templates)
      const customers = [
        { full_name: 'Customer Budi', whatsapp: '628123456789', email: 'budi@mail.com', category_id: regularId },
        { full_name: 'Customer Anita', whatsapp: '628998877665', email: 'anita@mail.com', category_id: silverId },
      ];

      const { data: createdCustomers, error: cError } = await supabase
        .from('anekafoto_customers')
        .insert(customers)
        .select();

      if (cError) throw cError;

      // 4. Create Initial Inquiry Template if Products Exist
      const { data: realProducts } = await supabase.from('anekafoto_products').select('id, price').limit(1);

      if (createdCustomers && realProducts && realProducts.length > 0) {
        const leads = [{
          customer_id: createdCustomers[0].id,
          product_id: realProducts[0].id,
          status: 'inquiry',
          estimated_value: realProducts[0].price || 0,
          source: 'System Initial'
        }];

        await supabase.from('anekafoto_leads').insert(leads);
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Seeding failed:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 bg-[#00ff88]/20 border border-[#00ff88]/30 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 text-[#00ff88] text-xs font-mono"
          >
            <CheckCircle size={14} />
            DATABASE POPULATED
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={seed}
        disabled={loading}
        className="nothing-glass p-4 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all border border-white/5 active:scale-95 group"
      >
        <div className={`p-2 rounded-xl bg-white/5 group-hover:bg-[#ff0031]/20 transition-colors ${loading ? 'animate-pulse' : ''}`}>
          {loading ? <Loader2 className="animate-spin text-white/50" size={18} /> : <Database className="group-hover:text-[#ff0031] transition-colors" size={18} />}
        </div>
        <div className="text-left">
          <p className="nothing-dot-matrix text-[10px] text-white/40 uppercase leading-none mb-1">Utility</p>
          <p className="text-xs font-bold tracking-tight">Generate Demo Data</p>
        </div>
      </button>
    </div>
  );
};
