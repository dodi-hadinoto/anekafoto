'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Filter, ArrowRight, Clock, PieChart } from 'lucide-react';
import { AddLeadModal } from '@/components/AddLeadModal';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data } = await supabase
      .from('anekafoto_leads')
      .select('*, anekafoto_customers(full_name, whatsapp), anekafoto_products(name, price)')
      .order('created_at', { ascending: false });
    
    setLeads(data || []);
    setLoading(false);
  }

  const statusColors: Record<string, string> = {
    'inquiry': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'quotation': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'negotiation': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'closed_won': 'bg-green-500/10 text-green-500 border-green-500/20',
    'closed_lost': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const pipeline = [
    { label: 'Inquiry', count: leads.filter(l => l.status === 'inquiry').length },
    { label: 'Quotation', count: leads.filter(l => l.status === 'quotation').length },
    { label: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length },
    { label: 'Won', count: leads.filter(l => l.status === 'closed_won').length },
    { label: 'Lost', count: leads.filter(l => l.status === 'closed_lost').length },
  ];

  return (
    <div className="flex min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      <Sidebar activePage="leads" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="nothing-dot-matrix text-xs tracking-[0.4em] text-nothing-red mb-2">CRM Funnel</h1>
            <h2 className="text-4xl font-bold tracking-tight">Active Leads</h2>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="nothing-button flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Inquiry</span>
          </button>
        </header>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {pipeline.map((step, i) => (
            <div key={i} className="nothing-glass p-4 text-center border-b-2 border-transparent hover:border-nothing-red transition-all cursor-pointer group">
              <p className="nothing-dot-matrix text-[8px] text-white/30 uppercase mb-1 group-hover:text-nothing-red transition-colors">{step.label}</p>
              <p className="text-xl font-bold">{step.count}</p>
            </div>
          ))}
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="nothing-glass p-20 text-center opacity-20">
               <p className="nothing-dot-matrix text-[10px] uppercase tracking-widest animate-pulse">Syncing pipeline data...</p>
            </div>
          ) : leads && leads.length > 0 ? (
            leads.map((lead) => (
              <div key={lead.id} className="nothing-glass p-6 flex items-center gap-6 group hover:bg-white/[0.02] transition-all">
                <div className={`w-2 h-12 rounded-full ${statusColors[lead.status] || 'bg-white/10'}`}></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold">{lead.anekafoto_customers?.full_name || 'Unknown Customer'}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${statusColors[lead.status]}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] nothing-dot-matrix text-white/50 uppercase">
                    <span className="flex items-center gap-1"><ArrowRight size={10} /> {lead.anekafoto_products?.name || 'General Inquiry'}</span>
                    <span className="flex items-center gap-1 text-nothing-red font-bold">Rp {lead.estimated_value?.toLocaleString() || lead.anekafoto_products?.price?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-8">
                  <div className="hidden lg:block">
                    <p className="text-[10px] text-white/30 nothing-dot-matrix uppercase mb-1">Created At</p>
                    <div className="flex items-center gap-2 justify-end">
                      <Clock size={12} className="text-white/30" />
                      <p className="text-xs">{new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="nothing-button-outline opacity-0 group-hover:opacity-100 py-2">Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="nothing-glass p-20 text-center flex flex-col items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <PieChart size={24} className="text-white/20" />
              </div>
              <div>
                <p className="text-lg font-medium text-white/50">Your pipeline is quiet</p>
                <p className="text-xs nothing-dot-matrix text-white/20 mt-2 uppercase">No active inquiries at the moment</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="nothing-button-outline mt-4"
              >
                Record First Sale
              </button>
            </div>
          )}
        </div>
      </main>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
      />
    </div>
  );
}
