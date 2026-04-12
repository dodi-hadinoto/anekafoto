'use client';

import React from 'react';
import { X, ShoppingBag, CheckCircle, Package, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  specifications?: any;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  if (!product) return null;

  const specs = product.specifications || {};
  const keyFeatures = specs['Key Features'] || [];
  const inTheBox = specs['In the Box'] || [];
  const techSpecs = specs['Specifications'] || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-nothing-red flex items-center justify-center">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
                   <p className="nothing-dot-matrix text-[10px] text-nothing-red uppercase tracking-widest">{product.brand}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 nothing-glass hover:bg-white/10 transition-colors rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                
                {/* Left: Visuals & Price */}
                <div className="space-y-8">
                  <div className="aspect-square rounded-[2rem] border border-white/5 bg-white/[0.03] overflow-hidden flex items-center justify-center relative">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-8" />
                    ) : (
                      <ShoppingBag size={80} className="text-white/5" />
                    )}
                  </div>

                  <div className="nothing-glass p-8 flex justify-between items-center">
                    <div>
                      <p className="nothing-dot-matrix text-[10px] text-white/30 uppercase mb-2">Market Price (IDR)</p>
                      <p className="text-3xl font-bold tracking-tighter">Rp {product.price?.toLocaleString()}</p>
                    </div>
                    <button className="nothing-button px-10">Send Quote</button>
                  </div>
                </div>

                {/* Right: Specs & Features */}
                <div className="space-y-8">
                  {/* Key Features */}
                  {keyFeatures.length > 0 && (
                    <section>
                      <h3 className="flex items-center gap-2 mb-4">
                        <StarIcon className="text-nothing-red fill-nothing-red" size={16} />
                        <span className="nothing-dot-matrix text-[10px] uppercase tracking-[0.2em] font-bold">Key Features</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {keyFeatures.map((feature: string, i: number) => (
                          <div key={i} className="flex gap-3 items-start p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                            <CheckCircle size={16} className="text-nothing-red mt-0.5 shrink-0" />
                            <p className="text-sm text-white/70 leading-relaxed">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* What's In The Box */}
                  {inTheBox.length > 0 && (
                    <section>
                      <h3 className="flex items-center gap-2 mb-4">
                        <Package size={16} className="text-white/50" />
                        <span className="nothing-dot-matrix text-[10px] uppercase tracking-[0.2em] font-bold">In the Box</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {inTheBox.map((item: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50">
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Tech Specs Summary */}
                  <section>
                    <h3 className="flex items-center gap-2 mb-4">
                      <Info size={16} className="text-white/50" />
                      <span className="nothing-dot-matrix text-[10px] uppercase tracking-[0.2em] font-bold">Technical Info</span>
                    </h3>
                    <div className="nothing-glass rounded-3xl overflow-hidden divide-y divide-white/5">
                      {Object.entries(techSpecs).slice(0, 6).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between p-4 px-6 text-sm">
                          <span className="text-white/30 truncate mr-4">{key}</span>
                          <span className="text-white/80 font-medium text-right line-clamp-2">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

              </div>
            </div>

            {/* Footer Footer */}
            <div className="p-6 border-t border-white/5 text-center">
               <p className="nothing-dot-matrix text-[8px] text-white/20 uppercase tracking-[0.4em]">Anekafoto Intelligence Product System v1.0</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const StarIcon = ({ ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
