'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, User, Package, DollarSign, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { createLead } from '@/app/(crm)/leads/actions';

interface Customer {
  id: string;
  full_name: string;
  whatsapp: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddLeadModal = ({ isOpen, onClose, onSuccess }: AddLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  async function fetchData() {
    try {
      const { data: c } = await supabase.from('anekafoto_customers').select('id, full_name, whatsapp').limit(20);
      const { data: p } = await supabase.from('anekafoto_products').select('id, name, price').limit(20);
      setCustomers(c || []);
      setProducts(p || []);
    } catch (err) {
      console.error('Error fetching data for modal:', err);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert('Pilih customer terlebih dahulu');
      return;
    }
    
    setLoading(true);
    try {
      const result = await createLead({
        customer_id: selectedCustomer.id,
        product_id: selectedProduct?.id || null,
        estimated_value: estimatedValue || selectedProduct?.price || 0,
        notes: notes,
        source: 'Direct CRM'
      });

      if (result.success) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        alert('Gagal membuat inquiry: ' + result.error);
      }
    } catch (err) {
      console.error('handleCreate error:', err);
      alert('Terjadi kesalahan sistem saat membuat inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setEstimatedValue(0);
    setNotes('');
    setSearchCustomer('');
    setSearchProduct('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
                <Package size={20} className="text-nothing-red" />
                Record New Inquiry
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Step 1: Customer Selection */}
              <div className="space-y-4">
                <label className="nothing-dot-matrix text-[10px] text-white/30 block uppercase tracking-widest">01 / Select Customer</label>
                {!selectedCustomer ? (
                  <div className="nothing-glass flex items-center gap-3 px-4 py-3 border border-white/5">
                    <Search size={16} className="text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Search customer name or phone..."
                      className="bg-transparent border-none outline-none text-sm w-full py-1 font-mono"
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-2xl border border-nothing-red/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-nothing-red/20 flex items-center justify-center text-nothing-red font-bold">
                        {selectedCustomer.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{selectedCustomer.full_name}</p>
                        <p className="text-[10px] text-white/40 font-mono tracking-tighter">{selectedCustomer.whatsapp}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="nothing-dot-matrix text-[10px] text-nothing-red hover:underline"
                    >
                      CHANGE
                    </button>
                  </div>
                )}
                
                {!selectedCustomer && searchCustomer && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {customers.filter(c => c.full_name.toLowerCase().includes(searchCustomer.toLowerCase())).map(c => (
                      <button 
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCustomer(c)}
                        className="w-full text-left p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all font-mono text-xs"
                      >
                        {c.full_name} <span className="text-white/20 ml-2">— {c.whatsapp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Product & Value */}
              <div className="space-y-4">
                <label className="nothing-dot-matrix text-[10px] text-white/30 block uppercase tracking-widest">02 / Interest & Estimated Value</label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/20 uppercase font-mono">Product Interested</label>
                    <div className="nothing-glass flex items-center gap-3 px-4 py-2 border border-white/5 relative">
                      <Package size={14} className="text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Search product..."
                        className="bg-transparent border-none outline-none text-xs w-full py-1 font-mono"
                        value={selectedProduct ? selectedProduct.name : searchProduct}
                        onChange={(e) => {
                          setSearchProduct(e.target.value);
                          if (selectedProduct) setSelectedProduct(null);
                        }}
                      />
                      {selectedProduct && <Check size={14} className="text-green-500" />}
                    </div>
                    {searchProduct && !selectedProduct && (
                      <div className="absolute z-10 w-full max-w-[240px] mt-1 bg-[#0A0A0A] border border-white/10 rounded-xl max-h-40 overflow-y-auto shadow-2xl">
                        {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).map(p => (
                          <button 
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p);
                              setSearchProduct('');
                            }}
                            className="w-full text-left p-2 hover:bg-white/5 text-[10px] font-mono border-b border-white/5 last:border-0"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/20 uppercase font-mono">Est. Value (Rp)</label>
                    <div className="nothing-glass flex items-center gap-3 px-4 py-2 border border-white/5">
                      <DollarSign size={14} className="text-white/20" />
                      <input 
                        type="number" 
                        placeholder="Price"
                        className="bg-transparent border-none outline-none text-xs w-full py-1 font-mono"
                        value={estimatedValue || selectedProduct?.price || ''}
                        onChange={(e) => setEstimatedValue(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Notes */}
              <div className="space-y-2">
                <label className="nothing-dot-matrix text-[10px] text-white/30 block uppercase tracking-widest">03 / Conversation Notes</label>
                <textarea 
                  rows={3}
                  placeholder="What are they looking for? Specific requirements..."
                  className="nothing-glass w-full bg-transparent p-4 border border-white/5 outline-none focus:border-white/20 text-xs font-mono"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-2xl text-[10px] nothing-dot-matrix uppercase hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={!selectedCustomer || loading}
                  className="flex-3 bg-nothing-red px-10 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-nothing-red/80 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                  <span className="text-[10px] nothing-dot-matrix uppercase font-bold">Create Inquiry</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
