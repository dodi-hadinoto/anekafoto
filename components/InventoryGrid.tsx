'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { Search, Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
}

interface InventoryGridProps {
  initialProducts: Product[];
}

export const InventoryGrid = ({ initialProducts }: InventoryGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Extract unique brands for filtering
  const brands = useMemo(() => {
    const b = Array.from(new Set(initialProducts.map(p => p.brand))).filter(Boolean).sort();
    return b;
  }, [initialProducts]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      return matchesSearch && matchesBrand;
    });
  }, [initialProducts, searchQuery, selectedBrand]);

  return (
    <div className="flex flex-col gap-8">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 nothing-glass px-6 py-4 flex items-center gap-4 w-full">
          <Search size={20} className="text-white/20" />
          <input 
            type="text" 
            placeholder="Search products or brands..." 
            className="bg-transparent border-none outline-none text-sm nothing-dot-matrix w-full focus:ring-0 placeholder:text-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X 
              size={18} 
              className="text-white/30 cursor-pointer hover:text-white" 
              onClick={() => setSearchQuery('')} 
            />
          )}
        </div>

        {/* Brand Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto md:max-w-md no-scrollbar">
          <button 
            onClick={() => setSelectedBrand(null)}
            className={`px-4 py-2 rounded-full text-[10px] nothing-dot-matrix uppercase border transition-all shrink-0 ${!selectedBrand ? 'bg-nothing-red border-nothing-red text-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
          >
            All
          </button>
          {brands.map(brand => (
            <button 
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-full text-[10px] nothing-dot-matrix uppercase border transition-all shrink-0 ${selectedBrand === brand ? 'bg-nothing-red border-nothing-red text-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Status */}
      <div className="flex justify-between items-center px-2">
        <p className="nothing-dot-matrix text-[10px] text-white/30 uppercase tracking-[0.2em]">
          Found {filteredProducts.length} Results
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => handleOpenProduct(product)}
          />
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-20 flex flex-col items-center gap-6">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                <Search size={24} />
             </div>
             <p className="nothing-dot-matrix text-xs tracking-widest uppercase">No items match your query</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
