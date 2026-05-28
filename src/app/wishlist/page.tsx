'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-blush/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">Saved Items</p>
          <h1 className="font-display text-burgundy text-4xl tracking-wide">My Wishlist</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-blush flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-burgundy/40" />
            </div>
            <h2 className="font-display text-burgundy text-2xl tracking-wide mb-3">No saved items yet</h2>
            <p className="font-body text-burgundy/50 mb-8">
              Tap the heart on any product to save it here for later
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-burgundy text-white rounded-full font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors"
            >
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
