'use client';

import React from 'react';
import { X, ArrowRight, MessageCircle, Clock, Package, TrendingUp, ExternalLink } from 'lucide-react';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
  onGenerateQuote: (lead: any) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead, onGenerateQuote }) => {
  if (!isOpen || !lead) return null;

  const statusColors: Record<string, string> = {
    'inquiry': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
    'quotation': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
    'negotiation': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
    'closed_won': 'text-green-500 border-green-500/20 bg-green-500/10',
    'closed_lost': 'text-red-500 border-red-500/20 bg-red-500/10',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="nothing-glass w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-start bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${statusColors[lead.status]}`}>
                {lead.status.replace('_', ' ')}
              </span>
              <span className="nothing-dot-matrix text-[10px] text-white/30 tracking-widest uppercase">ID: {lead.id.substring(0, 8)}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{lead.anekafoto_customers?.full_name}</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors group">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Customer & Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase tracking-[0.2em]">Customer Profile</label>
              <div className="nothing-glass p-6 space-y-3 border-white/5">
                <div className="flex items-center gap-2">
                   <MessageCircle size={14} className="text-white/30" />
                   <p className="text-sm font-mono">{lead.anekafoto_customers?.whatsapp}</p>
                </div>
                <div className="flex items-center gap-2">
                   <TrendingUp size={14} className="text-white/30" />
                   <p className="text-[10px] uppercase font-bold text-nothing-red">High Intent Lead</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase tracking-[0.2em]">Product Interest</label>
              <div className="nothing-glass p-6 space-y-3 border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                     <Package size={16} className="text-white/40" />
                   </div>
                   <p className="text-sm font-bold truncate">{lead.anekafoto_products?.name || 'General Inquiry'}</p>
                </div>
                <p className="text-xl font-mono font-bold text-[#00ff88]">
                  Rp {lead.estimated_value?.toLocaleString() || lead.anekafoto_products?.price?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Message / Notes */}
          <div className="space-y-4">
            <label className="nothing-dot-matrix text-[10px] text-white/30 uppercase tracking-[0.2em]">Inquiry Notes</label>
            <div className="nothing-glass p-6 border-white/5 italic text-white/60 text-sm leading-relaxed">
              {lead.notes || "Customer is looking for the best price for this unit. Interested in quick shipping options."}
            </div>
          </div>

          {/* Timeline / Metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="nothing-dot-matrix text-[8px] text-white/20 uppercase tracking-widest">Received</span>
                  <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                    <Clock size={12} />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>
             </div>
             
             <button 
                onClick={() => window.open(`https://wa.me/${lead.anekafoto_customers?.whatsapp}`, '_blank')}
                className="flex items-center gap-2 text-[10px] nothing-dot-matrix text-white/30 hover:text-white transition-colors"
             >
               <ExternalLink size={12} />
               OPEN WHATSAPP CHAT
             </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 bg-white/[0.04] border-t border-white/10">
          <button 
            onClick={() => onGenerateQuote(lead)}
            className="w-full nothing-button py-6 flex items-center justify-center gap-4 group hover:shadow-[0_0_30px_rgba(255,0,49,0.3)] transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="nothing-dot-matrix text-[10px] tracking-widest mb-1 opacity-50 group-hover:opacity-100 transition-opacity">NEXT STAGE</span>
              <span className="text-xl font-bold tracking-tight uppercase">Generate Smart Quotation</span>
            </div>
            <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
