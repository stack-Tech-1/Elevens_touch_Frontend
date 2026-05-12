'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('elevens_cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elevens_cart', JSON.stringify(items));
  }, [items]);

  const key = (productId: string, size: string, color: string) =>
    `${productId}-${size}-${color}`;

  const addItem = (product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const k = key(product._id, size, color);
      const existing = prev.find(i => key(i.product._id, i.size, i.color) === k);
      if (existing) {
        return prev.map(i =>
          key(i.product._id, i.size, i.color) === k
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, size, color, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(i => key(i.product._id, i.size, i.color) !== key(productId, size, color)));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) { removeItem(productId, size, color); return; }
    setItems(prev =>
      prev.map(i =>
        key(i.product._id, i.size, i.color) === key(productId, size, color)
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, count, total,
      addItem, removeItem, updateQuantity, clearCart,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
