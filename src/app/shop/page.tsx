'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types';

const CATEGORIES = ['All', 'Dress', 'Set', 'Accessory', 'Outerwear', 'Top', 'Skirt'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name A–Z' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(500000);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...products];

    if (category !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    }
    result = result.filter(p => (p.salePrice ?? p.price) <= priceMax);

    if (sort === 'price-asc') result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    else if (sort === 'price-desc') result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    else if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    else result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    setFiltered(result);
  }, [products, category, selectedSizes, priceMax, sort]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const toggleSize = (s: string) =>
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearFilters = () => {
    setCategory('All');
    setSelectedSizes([]);
    setPriceMax(500000);
    setSort('newest');
  };

  const activeFiltersCount = (category !== 'All' ? 1 : 0) + selectedSizes.length;

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <div className="bg-blush/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">Discover</p>
          <h1 className="font-display text-burgundy text-4xl lg:text-5xl tracking-wide">Our Collection</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 border border-burgundy/20 rounded-full font-body text-burgundy text-sm hover:bg-blush transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-mauve text-white text-[10px] rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-burgundy/50 hover:text-burgundy text-sm font-body">
                <X size={13} /> Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-body text-burgundy/50 text-sm">{filtered.length} pieces</span>
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2.5 border border-burgundy/20 rounded-full font-body text-burgundy text-sm bg-white focus:outline-none focus:border-mauve cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full font-body text-sm transition-all duration-200 ${
                category === cat
                  ? 'bg-burgundy text-white'
                  : 'border border-burgundy/20 text-burgundy hover:border-mauve hover:text-mauve'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-blush/40 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Sizes */}
                <div>
                  <h4 className="font-body text-burgundy font-semibold text-sm mb-3 uppercase tracking-wide">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`px-4 py-1.5 rounded-full font-body text-sm border transition-all ${
                          selectedSizes.includes(s)
                            ? 'bg-burgundy text-white border-burgundy'
                            : 'border-burgundy/20 text-burgundy hover:border-mauve'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="font-body text-burgundy font-semibold text-sm mb-3 uppercase tracking-wide">
                    Max Price: ₦{priceMax.toLocaleString()}
                  </h4>
                  <input
                    type="range"
                    min={5000}
                    max={500000}
                    step={5000}
                    value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full accent-burgundy"
                  />
                  <div className="flex justify-between font-body text-burgundy/50 text-xs mt-1">
                    <span>₦5,000</span>
                    <span>₦500,000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-burgundy text-xl tracking-wide mb-3">No pieces found</p>
            <p className="font-body text-burgundy/50 mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-8 py-3 bg-burgundy text-white rounded-full font-body text-sm hover:bg-burgundy-hover transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
