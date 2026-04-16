import React from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, Search, ShoppingBag } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import LeadChart from '@/components/LeadChart';

export default async function DashboardPage() {
  // 1. Fetch real metrics
  const { count: totalLeads } = await supabase.from('anekafoto_leads').select('*', { count: 'exact', head: true });
  const { count: inquiryCount } = await supabase.from('anekafoto_leads').select('*', { count: 'exact', head: true }).eq('status', 'inquiry');
  const { count: quoteCount } = await supabase.from('anekafoto_leads').select('*', { count: 'exact', head: true }).eq('status', 'quotation');
  const { count: wonCount } = await supabase.from('anekafoto_leads').select('*', { count: 'exact', head: true }).eq('status', 'closed_won');

  // 2. Fetch Latest 4 Products for Sidebar
  const { data: products } = await supabase
    .from('anekafoto_products')
    .select('*')
    .order('price', { ascending: false })
    .limit(4);

  // 3. Analytics Logic: Fetch last 14 days of leads
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  
  const { data: leadHistory } = await supabase
    .from('anekafoto_leads')
    .select('created_at')
    .gte('created_at', fourteenDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  // Process data for Chart: Group by Date
  const dateCounts: Record<string, number> = {};
  
  // Initialize last 14 days with 0
  for (let i = 0; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    dateCounts[dateStr] = 0;
  }

  // Aggregate real data
  leadHistory?.forEach((lead) => {
    const dateStr = new Date(lead.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    if (dateCounts[dateStr] !== undefined) {
      dateCounts[dateStr]++;
    }
  });

  // Convert to chart format and reverse to show chronological order
  const chartData = Object.keys(dateCounts)
    .map(date => ({ date, leads: dateCounts[date] }))
    .reverse();

  return (
    <div className="flex flex-col text-white font-sans overflow-x-hidden pt-4">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="nothing-dot-matrix text-xs tracking-[0.4em] text-[#ff0031] mb-2">O V E R V I E W</h1>
          <h2 className="text-4xl font-bold tracking-tight">System Terminal</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="nothing-glass px-4 py-2 flex items-center gap-3 hidden md:flex rounded-full">
            <Search size={16} className="text-white/30" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-transparent border-none outline-none text-xs nothing-dot-matrix w-48 focus:w-64 transition-all"
            />
          </div>
          <div className="p-3 nothing-glass cursor-pointer rounded-full hover:bg-white/10 transition-colors">
            <Bell size={18} />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Leads" value={(totalLeads || 0).toLocaleString()} trend="+12%" isPositive={true} delay={0.1} />
        <MetricCard title="Inquiry Status" value={(inquiryCount || 0).toLocaleString()} trend="+5%" isPositive={true} delay={0.2} />
        <MetricCard title="Quotation Sent" value={(quoteCount || 0).toLocaleString()} trend="-2%" isPositive={false} delay={0.3} />
        <MetricCard title="Closed Won" value={(wonCount || 0).toLocaleString()} trend="+22%" isPositive={true} delay={0.4} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2">
          {/* Real Analytics Chart */}
          <LeadChart data={chartData} />
        </div>
        
        <div className="mt-6 nothing-glass p-6">
          <h3 className="nothing-dot-matrix text-[10px] text-white/50 mb-6">High Value Inventory</h3>
          <div className="space-y-6">
            {products?.map((product, i) => (
              <div key={product.id} className="flex gap-4 items-center group cursor-pointer" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[#ff0031] transition-all">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                  ) : (
                    <ShoppingBag size={18} className="text-white/20" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[12px] font-bold truncate group-hover:text-[#ff0031] transition-colors capitalize">{product.name.toLowerCase()}</p>
                  <p className="text-[10px] text-white/30 nothing-dot-matrix mt-1">Rp {typeof product.price === 'number' ? product.price.toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            ))}
            {(!products || products.length === 0) && (
              <p className="text-xs text-white/30 nothing-dot-matrix">NO DATA AVAILABLE</p>
            )}
          </div>
          <button className="nothing-button w-full mt-10">
            View Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
