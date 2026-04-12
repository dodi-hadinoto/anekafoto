import React from 'react';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    images: string[];
  };
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="nothing-glass p-4 group hover:border-nothing-red transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="aspect-square w-full bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative mb-6">
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
          />
        ) : (
          <ShoppingBag size={48} className="text-white/10" />
        )}
        
        {/* Brand Badge */}
        <div className="absolute top-4 left-4">
          <span className="nothing-dot-matrix text-[8px] bg-black/60 px-3 py-1 rounded-full border border-white/10 tracking-widest uppercase">
            {product.brand || 'Original'}
          </span>
        </div>
      </div>

      {/* Info Area */}
      <div className="flex-1">
        <h3 className="text-sm font-bold tracking-tight mb-2 truncate group-hover:text-nothing-red transition-colors capitalize">
          {product.name.toLowerCase()}
        </h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="nothing-dot-matrix text-[8px] text-white/30 uppercase mb-1">Asset Value</p>
            <p className="text-lg font-bold">
               <span className="text-xs text-white/40 mr-1 font-normal">Rp</span>
               {product.price?.toLocaleString()}
            </p>
          </div>
          
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-nothing-red group-hover:border-nothing-red transition-all">
            <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Dots Grid Overlay (Subtle) */}
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
         <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-nothing-red"></div>
            ))}
         </div>
         <span className="nothing-dot-matrix text-[7px] uppercase tracking-[0.2em]">Verified Asset</span>
      </div>
    </div>
  );
};
