import React from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, Search, ShoppingBag } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

// Temporary mock for Lead Chart until recharts component is fully built
function LeadChartMock() {
  return (
    <div className="mt-6 nothing-glass p-6 h-[400px] flex flex-col justify-between">
      <div>
        <h3 className="nothing-dot-matrix text-[10px] text-white/50 mb-2">Lead Growth Trend</h3>
        <p className="text-2xl tracking-tight">System Analysis</p>
      </div>
      <div className="flex-1 flex items-center justify-center border border-white/5 border-dashed mt-4 rounded-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <p className="nothing-dot-matrix text-[10px] text-white/30 z-10">[ CHART RENDERING PENDING ]</p>
        <svg className="absolute w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
           <path d="M0,80 Q25,50 50,60 T100,20 L100,100 L0,100 Z" fill="rgba(225,29,72,0.1)" stroke="#FF0031" strokeWidth="0.5"/>
        </svg>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { data: products } = await supabase
    .from('anekafoto_products')
    .select('*')
    .order('price', { ascending: false })
    .limit(4);

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
        <MetricCard title="Total Leads" value="1,284" trend="+12%" isPositive={true} delay={0.1} />
        <MetricCard title="Inquiry Status" value="452" trend="+5%" isPositive={true} delay={0.2} />
        <MetricCard title="Quotation Sent" value="89" trend="-2%" isPositive={false} delay={0.3} />
        <MetricCard title="Closed Won" value="23" trend="+22%" isPositive={true} delay={0.4} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2">
          <LeadChartMock />
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
