'use client';

import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { approveQuotation } from './actions';

export function QuoteActions({ quoteId, whatsapp }: { quoteId: string, whatsapp: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this penawaran?')) return;
    
    setLoading(true);
    const res = await approveQuotation(quoteId);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      window.location.reload();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={handleApprove}
        disabled={loading}
        className="flex-1 bg-[#00ff88] text-black p-6 rounded-[2.5rem] flex items-center justify-between group hover:scale-[1.02] transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] disabled:opacity-50"
      >
        <div className="flex items-center gap-4">
          {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
          <span className="font-bold tracking-tight text-xl">APPROVE DEAL</span>
        </div>
        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
      </button>
      
      <a 
        href={`https://wa.me/${whatsapp}?text=Halo%20Anekafoto,%20saya%20ingin%20diskusi%20lebih%20lanjut%20mengenai%20Penawaran%20%23${quoteId.substring(0, 8)}`}
        target="_blank"
        className="flex-1 nothing-glass p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-4">
          <MessageCircle size={24} className="text-[#00ff88]" />
          <span className="font-bold tracking-tight text-xl">NEGOTIATE</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white/20"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
