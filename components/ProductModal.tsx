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
  const [activeImage, setActiveImage] = React.useState(0);

  // Reset active image when modal opens for a new product
  React.useEffect(() => {
    if (isOpen) setActiveImage(0);
  }, [isOpen, product?.id]);

  if (!product) return null;

  const specs = product.specifications || {};
  
  // Safely parse pipe-separated strings into arrays
  const parseList = (text: any) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    if (typeof text === 'string') return text.split('|').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const keyFeatures = parseList(specs['Key Features']);
  const inTheBox = parseList(specs['What’s In The Box'] || specs['In the Box']);
  
  // Tech specs are whatever is left, or the nested 'Specifications' object
  let techSpecs = specs['Configurations'] || specs['Specifications'];
  if (!techSpecs || typeof techSpecs !== 'object') {
    techSpecs = { ...specs };
    delete techSpecs['Key Features'];
    delete techSpecs['What’s In The Box'];
    delete techSpecs['In the Box'];
  }

  const images = (product.images && product.images.length > 0) ? product.images : [];

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
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            {/* Header - Editorial Style */}
            <div className="flex justify-between items-start p-10 pb-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-nothing-red animate-pulse" />
                    <p className="nothing-dot-matrix text-[10px] text-nothing-red uppercase tracking-[0.5em]">{product.brand}</p>
                 </div>
                 <h2 className="text-4xl font-bold tracking-tighter max-w-2xl leading-none">{product.name}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-4 nothing-glass hover:bg-white/10 transition-all rounded-full group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-10 pt-0">
                
                {/* Left Section (Lg: 7 columns) - Visual Gallery */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="relative aspect-[4/3] rounded-[2.5rem] border border-white/5 bg-white/[0.02] overflow-hidden flex items-center justify-center group cursor-zoom-in">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        src={images[activeImage] || 'https://via.placeholder.com/800x600?text=No+Image'} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105" 
                      />
                    </AnimatePresence>
                    
                    {/* Floating Pricing Badge */}
                    <div className="absolute bottom-8 left-8 nothing-glass px-8 py-5 rounded-[2rem] border-white/10 flex flex-col">
                       <span className="nothing-dot-matrix text-[8px] text-white/30 tracking-widest uppercase mb-1">Mkt Price</span>
                       <span className="text-2xl font-bold tracking-tighter">Rp {product.price?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
                      {images.map((img, i) => (
                        <button 
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`relative w-24 h-24 shrink-0 rounded-2xl border transition-all duration-300 overflow-hidden ${
                            activeImage === i ? 'border-nothing-red ring-4 ring-nothing-red/10 scale-95' : 'border-white/5 opacity-40 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt={`view-${i}`} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* High Contrast Features (Editorial style) */}
                  {keyFeatures.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {keyFeatures.slice(0, 4).map((f, i) => (
                         <div key={i} className="nothing-glass p-6 border-white/5 flex flex-col justify-between h-40">
                            <span className="nothing-dot-matrix text-[8px] text-white/20">FEAT. 0{i+1}</span>
                            <p className="text-sm font-medium leading-tight text-white/80">{f}</p>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                {/* Right Section (Lg: 5 columns) - Specs & Details */}
                <div className="lg:col-span-5 space-y-12">
                  <div className="nothing-glass p-1 p-8 rounded-[2.5rem] bg-white/[0.03] space-y-8">
                    
                    {/* In The Box Section */}
                    {inTheBox.length > 0 && (
                      <section>
                        <h3 className="nothing-dot-matrix text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4">Inside the Box</h3>
                        <div className="flex flex-wrap gap-2">
                           {inTheBox.map((item, idx) => (
                             <span key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
                                {item}
                             </span>
                           ))}
                        </div>
                      </section>
                    )}

                    {/* Sales Action Card */}
                    <section className="pt-4">
                       <button className="w-full nothing-button py-6 flex flex-col items-center group overflow-hidden relative">
                          <span className="nothing-dot-matrix text-[10px] tracking-widest relative z-10 opacity-70 mb-1">PROCEED TO DEAL</span>
                          <span className="text-xl font-bold tracking-tight relative z-10 transition-transform group-hover:scale-110">GENERATE QUOTATION</span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                       </button>
                    </section>
                  </div>

                  {/* Technical Depth Section */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                       <h3 className="nothing-dot-matrix text-[10px] text-white/30 uppercase tracking-[0.3em]">Full Specifications</h3>
                       <span className="text-[10px] font-mono text-white/10">{Object.keys(techSpecs).length} PARAMETERS FOUND</span>
                    </div>
                    <div className="space-y-4">
                       {Object.entries(techSpecs).map(([key, value]) => (
                         <div key={key} className="flex flex-col group py-2 border-b border-white/[0.02]">
                            <span className="nothing-dot-matrix text-[8px] text-white/20 uppercase mb-1 group-hover:text-nothing-red transition-colors">{key}</span>
                            <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{String(value)}</p>
                         </div>
                       ))}
                    </div>
                  </section>
                </div>

              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="px-10 py-5 border-t border-white/5 bg-black flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]" />
                  <span className="nothing-dot-matrix text-[8px] text-white/30 uppercase tracking-[0.2em]">Data Synchronized with Global Inventory</span>
               </div>
               <p className="nothing-dot-matrix text-[8px] text-white/10 uppercase tracking-[0.5em]">SYSTEM_REF: {product.id.substring(0, 12)}</p>
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
