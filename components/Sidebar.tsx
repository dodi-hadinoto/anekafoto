"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, BringToFront, Box, FileText } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "DASHBOARD", icon: LayoutGrid },
    { href: "/inventory", label: "INVENTORY", icon: Box },
    { href: "/customers", label: "CUSTOMERS", icon: Users },
    { href: "/leads", label: "LEADS", icon: BringToFront },
    { href: "/quotations", label: "QUOTATIONS", icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-[#ffffff1a] bg-black/50 backdrop-blur-md h-screen fixed left-0 top-0 flex flex-col pt-8">
      <div className="px-8 pb-12">
        <h1 className="text-xl font-bold tracking-[0.3em] nothing-dot-matrix text-white">ANEKAFOTO</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-[#ff0031] animate-pulse"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">System Active</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link key={link.href} href={link.href}>
              <div 
                className={`relative px-4 py-3 rounded-2xl transition-colors duration-300 flex items-center gap-4 ${
                  isActive ? "text-white" : "text-gray-500 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[#ffffff0d] rounded-2xl border border-[#ffffff1a]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <link.icon className={`w-4 h-4 z-10 ${isActive ? "text-[#ff0031]" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="z-10 text-xs font-bold tracking-[0.2em]">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-[#ffffff1a]">
        <div className="text-[10px] text-gray-600 font-mono">
          <p>ANEKAFOTO CRM</p>
          <p>OS v4.0.1</p>
        </div>
      </div>
    </aside>
  );
}
