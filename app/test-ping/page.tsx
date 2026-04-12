import React from 'react';

export default function TestPing() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl font-bold mb-4 tracking-tighter">ANEKAFOTO CRM</h1>
      <p className="opacity-50 nothing-dot-matrix text-xs tracking-[0.4em] uppercase">Deployment Test: Active</p>
      <div className="mt-12 p-8 border border-white/10 rounded-3xl bg-white/5">
         <p className="text-sm">Status: <span className="text-green-500 font-bold">READY</span></p>
         <p className="text-[10px] opacity-30 mt-2">Routing Verification Page</p>
      </div>
    </div>
  );
}
