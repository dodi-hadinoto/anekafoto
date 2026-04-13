import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Box, CheckCircle2, XCircle, Package } from 'lucide-react';
import { QuoteActions } from './QuoteActions';

async function getQuotation(id: string) {
  const { data } = await supabase
    .from('anekafoto_quotations')
    .select(`
      *,
      customer:anekafoto_customers(*),
      items:anekafoto_quotation_items(
        *,
        product:anekafoto_products(*)
      )
    `)
    .eq('id', id)
    .single();
  
  return data;
}

export default async function PublicQuotePage({ params }: { params: { id: string } }) {
  const quote = await getQuotation(params.id);

  if (!quote) {
    notFound();
  }

  const isExpired = new Date(quote.valid_until) < new Date();
  const isActive = quote.status === 'sent' || quote.status === 'draft';

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 font-sans selection:bg-[#ff0031] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <div className="nothing-dot-matrix text-[#ff0031] text-xs tracking-[0.5em] uppercase">Anekafoto Official Penawaran</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none group">
              QUOTE <span className="text-white/20 group-hover:text-white transition-colors">#{quote.id.substring(0, 8)}</span>
            </h1>
            <div className="flex items-center gap-4 text-white/40 font-mono text-xs">
              <span>VALID UNTIL: {new Date(quote.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {isExpired && <span className="bg-[#ff0031] text-white px-2 py-0.5 rounded-full text-[10px]">EXPIRED</span>}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <p className="nothing-dot-matrix text-[10px] text-white/30 uppercase">Prepared for</p>
            <p className="text-2xl font-bold">{quote.customer?.full_name}</p>
            <p className="text-xs font-mono text-white/40">{quote.customer?.whatsapp}</p>
          </div>
        </header>

        {/* Content Table */}
        <div className="nothing-glass border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] nothing-dot-matrix text-[10px] text-white/30 uppercase">
                <th className="px-8 py-6">Product Description</th>
                <th className="px-8 py-6 text-center">Qty</th>
                <th className="px-8 py-6 text-right">Price</th>
                <th className="px-8 py-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-sm">
              {quote.items?.map((item: any) => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <Package size={20} className="text-white/20 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#ff0031] transition-colors">{item.product?.name}</p>
                        <p className="text-[10px] text-white/30 mt-1 uppercase tracking-tighter">{item.product?.brand || 'Premium'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center text-white/60">{item.quantity}</td>
                  <td className="px-8 py-8 text-right text-white/60">Rp {item.unit_price.toLocaleString()}</td>
                  <td className="px-8 py-8 text-right font-bold">Rp {(item.unit_price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white/[0.02] border-t-2 border-white/10">
                <td colSpan={3} className="px-8 py-10 nothing-dot-matrix text-sm text-right text-white/40">Total Amount</td>
                <td className="px-8 py-10 text-right text-3xl font-bold text-[#00ff88]">
                  Rp {quote.total_amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer & Actions */}
        <footer className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-12">
          <div className="space-y-6">
            <div className="nothing-glass p-8 space-y-4">
              <h3 className="nothing-dot-matrix text-[10px] text-white/40 uppercase">Notes & Terms</h3>
              <p className="text-sm leading-relaxed text-white/60 italic">
                "{quote.notes || 'Hanya berlaku untuk pembelian hari ini. Harga sudah termasuk pajak.'}"
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/20 font-mono italic">
              <CheckCircle2 size={12} />
              <span>Digital Signature Verified — Anekafoto CRM v4.0.1</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {isActive && !isExpired ? (
              <QuoteActions quoteId={quote.id} whatsapp="628123456789" />
            ) : (
              <div className="nothing-glass p-12 text-center rounded-[2.5rem] border-[#ff0031]/30">
                <XCircle size={48} className="mx-auto mb-4 text-[#ff0031] opacity-50" />
                <p className="nothing-dot-matrix text-[10px] text-white/40 uppercase">This quote is no longer active</p>
                <p className="text-xl font-bold mt-2">Expired or Closed</p>
              </div>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
}

function ExternalLink({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
