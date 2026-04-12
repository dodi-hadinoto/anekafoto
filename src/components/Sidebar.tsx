import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, PieChart } from 'lucide-react';

interface SidebarProps {
  activePage: 'dashboard' | 'customers' | 'leads' | 'inventory';
}

export const Sidebar = ({ activePage }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', href: '/dashboard' },
    { icon: Users, label: 'Customers', id: 'customers', href: '/customers' },
    { icon: PieChart, label: 'Leads', id: 'leads', href: '/leads' },
    { icon: ShoppingBag, label: 'Inventory', id: 'inventory', href: '/inventory' },
  ];

  return (
    <aside className="w-20 lg:w-64 border-r border-white/10 flex flex-col items-center py-8 px-4 nothing-glass m-4 rounded-3xl mr-0 shrink-0">
      <div className="mb-12">
        <div className="w-10 h-10 rounded-full bg-nothing-red flex items-center justify-center font-bold text-xl nothing-dot-matrix">A</div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-8">
        {menuItems.map((item) => (
          <a key={item.id} href={item.href} className="flex items-center gap-4 cursor-pointer group no-underline text-white">
            <div className={`p-3 rounded-2xl transition-all ${activePage === item.id ? 'bg-nothing-red text-white' : 'hover:bg-white/10 text-white/50 group-hover:text-white'}`}>
              <item.icon size={20} />
            </div>
            <span className={`hidden lg:block nothing-dot-matrix text-[10px] ${activePage === item.id ? 'text-white' : 'text-white/30 group-hover:text-white'}`}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
};
