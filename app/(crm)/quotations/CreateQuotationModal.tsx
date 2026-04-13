'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Trash2, Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createQuotation } from './actions';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Customer {
  id: string;
  full_name: string;
  whatsapp: string;
}

export default function CreateQuotationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  
  // Selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<{ product: Product; quantity: number; price: number }>>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  async function fetchData() {
    const { data: c } = await supabase.from('anekafoto_customers').select('*').limit(20);
    const { data: p } = await supabase.from('anekafoto_products').select('*').limit(20);
    setCustomers(c || []);
    setProducts(p || []);
  }

  const handleCreate = async () => {
    if (!selectedCustomer || selectedItems.length === 0) return;
    
    setLoading(true);
    const result = await createQuotation({
      customer_id: selectedCustomer.id,
      items: selectedItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      notes,
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (result.success) {
      onClose();
      window.location.reload();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="nothing-glass w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="nothing-dot-matrix text-[10px] text-[#ff0031] mb-1">NEW DOCUMENT</h3>
            <h2 className="text-xl font-bold uppercase tracking-tight">Create Quotation</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Step 1: Customer Selection */}
          <section className="space-y-4">
            <label className="nothing-dot-matrix text-[10px] text-white/30 block">01 / SELECT CUSTOMER</label>
            {!selectedCustomer ? (
              <div className="nothing-glass p-1 flex items-center gap-3 rounded-xl border-white/5">
                <Search size={16} className="ml-3 text-white/20" />
                <input 
                  autoFocus
                  placeholder="Search customer name..."
                  className="bg-transparent border-none outline-none py-3 flex-1 text-sm font-mono"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-[#00ff88]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{selectedCustomer.full_name}</p>
                    <p className="text-[10px] font-mono text-white/40">{selectedCustomer.whatsapp}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-[10px] nothing-dot-matrix text-[#ff0031] hover:underline"
                >
                  CHANGE
                </button>
              </div>
            )}
            
            {!selectedCustomer && searchCustomer && (
              <div className="space-y-1">
                {customers.filter(c => c.full_name.toLowerCase().includes(searchCustomer.toLowerCase())).map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="w-full text-left p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all font-mono text-xs"
                  >
                    {c.full_name} <span className="text-white/20 ml-2">— {c.whatsapp}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Step 2: Product Addition */}
          <section className="space-y-4">
            <label className="nothing-dot-matrix text-[10px] text-white/30 block">02 / ADD PRODUCTS</label>
            <div className="nothing-glass p-1 flex items-center gap-3 rounded-xl border-white/5">
              <Plus size={16} className="ml-3 text-white/20" />
              <input 
                placeholder="Search products..."
                className="bg-transparent border-none outline-none py-3 flex-1 text-sm font-mono"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </div>

            {searchProduct && (
              <div className="bg-black/40 border border-white/5 rounded-xl max-h-48 overflow-y-auto">
                {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).map(p => (
                  <button 
                    key={p.id}
                    onClick={() => {
                      setSelectedItems([...selectedItems, { product: p, quantity: 1, price: p.price }]);
                      setSearchProduct('');
                    }}
                    className="w-full text-left p-3 hover:bg-[#ff0031]/10 flex justify-between items-center group font-mono text-xs border-b border-white/5 last:border-0"
                  >
                    <span>{p.name}</span>
                    <span className="text-white/40 group-hover:text-white transition-colors">Rp {p.price?.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="space-y-2">
                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-none">{item.product.name}</p>
                      <p className="text-[10px] font-mono text-white/20 mt-1">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...selectedItems];
                        newItems[idx].quantity = parseInt(e.target.value) || 1;
                        setSelectedItems(newItems);
                      }}
                      className="w-12 bg-black/40 border-none outline-none text-center rounded-lg py-1 font-mono text-xs"
                    />
                    <button 
                      onClick={() => setSelectedItems(selectedItems.filter((_, i) => i !== idx))}
                      className="p-2 text-white/20 hover:text-[#ff0031] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Step 3: Notes */}
          <section className="space-y-4">
            <label className="nothing-dot-matrix text-[10px] text-white/30 block">03 / ADDITIONAL NOTES</label>
            <textarea 
              placeholder="Terms, guarantee, etc..."
              rows={3}
              className="nothing-glass w-full bg-transparent p-4 rounded-xl border border-white/5 outline-none focus:border-white/20 text-xs font-mono"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div>
            <p className="nothing-dot-matrix text-[10px] text-white/20 uppercase tracking-widest">Total Value</p>
            <p className="text-xl font-mono font-bold">
              Rp {selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}
            </p>
          </div>
          <button 
            disabled={!selectedCustomer || selectedItems.length === 0 || loading}
            onClick={handleCreate}
            className={`nothing-button px-8 flex items-center gap-2 ${(!selectedCustomer || selectedItems.length === 0) ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'GENERATE QUOTATION'}
          </button>
        </div>
      </div>
    </div>
  );
}
