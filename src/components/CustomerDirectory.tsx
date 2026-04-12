'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AddCustomerModal } from './AddCustomerModal';
import { Search, Plus, Filter, MoreHorizontal, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Customer {
  id: string;
  full_name: string;
  whatsapp: string;
  email: string;
  created_at: string;
  anekafoto_customer_categories?: {
    name: string;
  };
}

interface CustomerDirectoryProps {
  initialCustomers: Customer[];
}

export const CustomerDirectory = ({ initialCustomers }: CustomerDirectoryProps) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = async () => {
    const { data } = await supabase
      .from('anekafoto_customers')
      .select('*, anekafoto_customer_categories(name)')
      .order('created_at', { ascending: false });
    
    if (data) setCustomers(data);
  };

  const filteredCustomers = customers.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.whatsapp?.includes(searchQuery) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      <Sidebar activePage="customers" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="nothing-dot-matrix text-xs tracking-[0.4em] text-nothing-red mb-2">Database</h1>
            <h2 className="text-4xl font-bold tracking-tight">Customer Directory</h2>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="nothing-button flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </header>

        {/* Toolbar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 nothing-glass px-4 py-3 flex items-center gap-3">
            <Search size={16} className="text-white/30" />
            <input 
              type="text" 
              placeholder="Search by name, phone or email..." 
              className="bg-transparent border-none outline-none text-xs nothing-dot-matrix w-full focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="p-3 nothing-glass cursor-pointer hover:bg-white/10 transition-colors flex items-center gap-2">
            <Filter size={16} className="text-white/50" />
            <span className="text-[10px] nothing-dot-matrix uppercase">Filter</span>
          </div>
        </div>

        {/* Table */}
        <div className="nothing-glass border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 nothing-dot-matrix text-[10px] text-white/50 uppercase">Customer Name</th>
                <th className="p-4 nothing-dot-matrix text-[10px] text-white/50 uppercase">WhatsApp</th>
                <th className="p-4 nothing-dot-matrix text-[10px] text-white/50 uppercase">Category</th>
                <th className="p-4 nothing-dot-matrix text-[10px] text-white/50 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <p className="text-sm font-medium">{customer.full_name}</p>
                    <p className="text-[10px] text-white/30">{customer.email || 'No email'}</p>
                  </td>
                  <td className="p-4 text-xs nothing-dot-matrix font-mono">{customer.whatsapp || '-'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase nothing-dot-matrix text-white/60">
                      {customer.anekafoto_customer_categories?.name || 'Regular'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-xl transition-all">
                      <MoreHorizontal size={16} className="text-white/40" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center opacity-30">
                    <div className="flex flex-col items-center gap-3">
                      <Users size={32} />
                      <p className="nothing-dot-matrix text-[10px] uppercase">Record Not Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refreshData}
      />
    </div>
  );
};
