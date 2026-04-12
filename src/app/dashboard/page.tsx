import React from 'react';
import { StatCard } from '@/components/StatCard';
import { LeadChart } from '@/components/LeadChart';
import { supabase } from '@/lib/supabase';
import { Bell, Search, ShoppingBag } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

export default async function DashboardPage() {
  // Fetch products for "Popular Products" highlight
  const { data: products } = await supabase
    .from('anekafoto_products')
    .select('*')
    .order('price', { ascending: false })
    .limit(4);

  return (
    <div className="flex min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      <Sidebar activePage="dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="nothing-dot-matrix text-xs tracking-[0.4em] text-nothing-red mb-2">Overview</h1>
            <h2 className="text-4xl font-bold tracking-tight">System Terminal</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="nothing-glass px-4 py-2 flex items-center gap-3 hidden md:flex">
              <Search size={16} className="text-white/30" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none outline-none text-xs nothing-dot-matrix w-48 focus:w-64 transition-all"
              />
            </div>
            <div className="p-3 nothing-glass cursor-pointer hover:bg-white/10 transition-colors">
              <Bell size={18} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Leads" value="1,284" change="12%" isPositive={true} />
          <StatCard title="Inquiry Status" value="452" change="5%" isPositive={true} />
          <StatCard title="Quotation Sent" value="89" change="2%" isPositive={false} />
          <StatCard title="Closed Won" value="23" change="22%" isPositive={true} />
        </section>

        {/* Middle Section: Chart and High Value Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <LeadChart />
          </div>
          
          <div className="mt-6 nothing-glass p-6">
            <h3 className="nothing-dot-matrix text-[10px] text-white/50 mb-6">High Value Inventory</h3>
            <div className="space-y-6">
              {products?.map((product) => (
                <div key={product.id} className="flex gap-4 items-center group cursor-pointer">
                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-nothing-red transition-all">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <ShoppingBag size={18} className="text-white/20" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold truncate group-hover:text-nothing-red transition-colors capitalize">{product.name.toLowerCase()}</p>
                    <p className="text-[10px] text-white/30 nothing-dot-matrix">Rp {product.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="nothing-button w-full mt-10">
              View All Inventory
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
