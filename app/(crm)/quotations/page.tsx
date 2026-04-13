'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Filter, FileText, Send, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import CreateQuotationModal from './CreateQuotationModal';

export default function QuotationsListPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  async function fetchQuotations() {
    const { data } = await supabase
      .from('anekafoto_quotations')
      .select(`
        *,
        customer:anekafoto_customers(full_name),
        lead:anekafoto_leads(status)
      `)
      .order('created_at', { ascending: false });
    
    setQuotations(data || []);
    setLoading(false);
  }

  const statusIcons: Record<string, any> = {
    draft: Clock,
    sent: Send,
    approved: CheckCircle2,
    rejected: XCircle,
    negotiating: FileText,
  };

  const statusColors: Record<string, string> = {
    draft: 'text-gray-500',
    sent: 'text-blue-400',
    approved: 'text-[#00ff88]',
    rejected: 'text-[#ff0031]',
    negotiating: 'text-orange-400',
  };

  return (
    <div className="flex flex-col text-white font-sans pt-4">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="nothing-dot-matrix text-xs tracking-[0.4em] text-[#ff0031] mb-2">S A L E S</h1>
          <h2 className="text-4xl font-bold tracking-tight">Quotations</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="nothing-glass px-4 py-2 flex items-center gap-3 hidden md:flex rounded-full">
            <Search size={16} className="text-white/30" />
            <input 
              type="text" 
              placeholder="Search quotes..." 
              className="bg-transparent border-none outline-none text-xs nothing-dot-matrix w-48 focus:w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="nothing-button flex items-center gap-2 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            New Quote
          </button>
        </div>
      </header>

      <section className="nothing-glass border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="nothing-dot-matrix text-[10px] text-white/50 tracking-widest">Active Quotations</h3>
          <div className="flex gap-2">
             <button className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
               <Filter size={14} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] nothing-dot-matrix text-white/30 tracking-widest">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
                <th className="px-6 py-4 font-medium text-right">Valid Until</th>
                <th className="px-6 py-4 font-medium text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-white/20 nothing-dot-matrix text-[10px]">
                    LOADING DATA...
                  </td>
                </tr>
              ) : (
                quotations?.map((quote) => {
                  const Icon = statusIcons[quote.status] || FileText;
                  return (
                    <tr key={quote.id} className="hover:bg-white/[0.02] group transition-all">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white group-hover:text-[#ff0031] transition-colors">{quote.customer?.full_name}</p>
                        <p className="text-[9px] text-white/20 mt-1 uppercase tracking-tighter">ID: {quote.id.substring(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${statusColors[quote.status]}`}>
                          <Icon size={12} />
                          <span className="uppercase tracking-[0.2em] text-[9px]">{quote.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-white/80">
                        Rp {quote.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-white/30 text-[10px]">
                        {new Date(quote.valid_until).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              const text = encodeURIComponent(`Halo ${quote.customer?.full_name}, berikut adalah penawaran dari Anekafoto: ${window.location.origin}/quote/${quote.id}`);
                              window.open(`https://wa.me/${quote.customer?.whatsapp}?text=${text}`, '_blank');
                            }}
                            className="p-1.5 px-3 bg-[#00ff88] text-black rounded-full hover:bg-[#00ff88]/80 transition-colors uppercase text-[8px] font-bold tracking-[0.2em] flex items-center gap-2"
                          >
                            <Send size={10} />
                            Send WA
                          </button>
                          <a 
                            href={`/quote/${quote.id}`} 
                            target="_blank"
                            className="p-1.5 px-3 border border-white/10 rounded-full hover:bg-white/10 transition-colors uppercase text-[8px] tracking-[0.2em] flex items-center gap-2"
                          >
                            <ExternalLink size={10} />
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {(!loading && (!quotations || quotations.length === 0)) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/20 nothing-dot-matrix text-[10px]">
                    NO QUOTATIONS FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <CreateQuotationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
