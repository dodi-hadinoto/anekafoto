import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-6xl font-black mb-4 tracking-tighter italic">ANEKAFOTO</h1>
      <p className="opacity-50 nothing-dot-matrix text-xs tracking-[0.4em] uppercase mb-12">System Gateway : Active</p>
      
      <div className="flex gap-4">
        <Link href="/dashboard" className="nothing-button px-8">
          Enter Dashboard
        </Link>
        <Link href="/test-ping" className="px-8 py-3 border border-white/10 rounded-full text-xs nothing-dot-matrix hover:bg-white/5 transition-all">
          System Test
        </Link>
      </div>
      
      <div className="mt-24 opacity-20 text-[8px] nothing-dot-matrix flex gap-8">
        <span>STABLE_BUILD_ALPHA_1.0</span>
        <span>LATENCY: 12ms</span>
        <span>ENCRYPTION: AES-256</span>
      </div>
    </div>
  );
}
