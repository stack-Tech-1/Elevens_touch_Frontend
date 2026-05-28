'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '@/types';

interface WishlistContextValue {
  items: Product[];
  count: number;
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('elevens_wishlist');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elevens_wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (product: Product) => {
    setItems(prev =>
      prev.some(p => p._id === product._id)
        ? prev.filter(p => p._id !== product._id)
        : [...prev, product]
    );
  };

  const isWishlisted = (id: string) => items.some(p => p._id === id);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
