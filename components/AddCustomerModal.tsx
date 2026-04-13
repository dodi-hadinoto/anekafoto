'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Tag, Save, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { createCustomer } from '@/app/(crm)/customers/actions';

interface Category {
  id: string;
  name: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCustomerModal = ({ isOpen, onClose, onSuccess }: AddCustomerModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    address: '',
    category_id: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('anekafoto_customer_categories').select('id, name');
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert('Pilih kategori customer terlebih dahulu');
      return;
    }
    
    setLoading(true);
    const result = await createCustomer(formData);
    setLoading(false);

    if (result.success) {
      setFormData({ full_name: '', whatsapp: '', email: '', address: '', category_id: '', notes: '' });
      onSuccess();
      onClose();
    } else {
      console.error('Error adding customer:', result.error);
      alert('Gagal menambah pelanggan: ' + result.error);
    }
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
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User size={20} className="text-nothing-red" />
                Register New Customer
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase block">Full Name</label>
                  <div className="nothing-glass flex items-center gap-3 px-4 py-2 hover:border-white/20 transition-all border border-transparent">
                    <User size={16} className="text-white/20" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Dodi Hadinoto"
                      className="bg-transparent border-none outline-none text-sm w-full py-1"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>

                {/* WhatsApp & Email Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase block">WhatsApp</label>
                    <div className="nothing-glass flex items-center gap-3 px-4 py-2 hover:border-white/20 transition-all border border-transparent">
                      <Phone size={16} className="text-white/20" />
                      <input 
                        required
                        type="text" 
                        placeholder="628123..."
                        className="bg-transparent border-none outline-none text-sm w-full py-1"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase block">Email</label>
                    <div className="nothing-glass flex items-center gap-3 px-4 py-2 hover:border-white/20 transition-all border border-transparent">
                      <Mail size={16} className="text-white/20" />
                      <input 
                        type="email" 
                        placeholder="dodi@mail.com"
                        className="bg-transparent border-none outline-none text-sm w-full py-1"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-2 relative">
                  <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase block">Customer Category</label>
                  <div 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="nothing-glass flex items-center justify-between px-4 py-2 hover:border-white/20 transition-all border border-transparent cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-white/20" />
                      <span className={`text-sm ${formData.category_id ? 'text-white' : 'text-white/30 font-mono'}`}>
                        {formData.category_id ? (categories.find(c => c.id === formData.category_id)?.name || 'Select Category') : 'Select Category'}
                      </span>
                    </div>
                    <motion.span animate={{ rotate: isCategoryOpen ? 180 : 0 }}>
                       <Plus size={14} className="text-white/30" />
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-60 left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                      >
                        {categories.map(cat => (
                          <div 
                            key={cat.id}
                            onClick={() => {
                              setFormData({...formData, category_id: cat.id});
                              setIsCategoryOpen(false);
                            }}
                            className="px-4 py-3 text-xs font-mono hover:bg-[#ff0031]/10 cursor-pointer border-b border-white/5 last:border-0 hover:text-white transition-colors"
                          >
                            {cat.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase block">Address</label>
                  <div className="nothing-glass flex items-center gap-3 px-4 py-2 hover:border-white/20 transition-all border border-transparent">
                    <MapPin size={16} className="text-white/20 mt-1 self-start" />
                    <textarea 
                      rows={2}
                      placeholder="Complete delivery address..."
                      className="bg-transparent border-none outline-none text-sm w-full py-1 resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-2xl text-[10px] nothing-dot-matrix uppercase hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={loading}
                  className="flex-3 bg-nothing-red px-10 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-nothing-red/80 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  <span className="text-[10px] nothing-dot-matrix uppercase font-bold">Register Customer</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
