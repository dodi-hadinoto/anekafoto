import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { InventoryGrid } from '@/components/InventoryGrid';
import { supabase } from '@/lib/supabase';
import { Bell } from 'lucide-react';

export default async function InventoryPage() {
  // Fetch all products from Supabase
  const { data: products, error } = await supabase
    .from('anekafoto_products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Error fetching products:', error);
  } else {
    console.log(`✅ Fetched ${products?.length || 0} products from database.`);
  }

  return (
    <div className="flex min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      <Sidebar activePage="inventory" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="nothing-dot-matrix text-xs tracking-[0.4em] text-nothing-red mb-2">Inventory System</h1>
            <h2 className="text-4xl font-bold tracking-tight">Product Intelligence</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:block text-right">
              <p className="nothing-dot-matrix text-[8px] text-white/30 uppercase tracking-widest">Database Sync</p>
              <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
            <div className="p-3 nothing-glass cursor-pointer hover:bg-white/10 transition-colors">
              <Bell size={18} />
            </div>
          </div>
        </header>

        {/* Dynamic Grid with Search & Filters */}
        <InventoryGrid initialProducts={products || []} />
      </main>
    </div>
  );
}
