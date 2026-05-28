'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { Product } from '@/types';

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-burgundy text-white',
  sale: 'bg-mauve text-white',
  bestseller: 'bg-gold text-white',
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wished = isWishlisted(product._id);
  const [added, setAdded] = useState(false);

  const image = product.images?.[0] || '/images/placeholder.jpg';
  const displayPrice = product.salePrice ?? product.price;
  const defaultSize = product.sizes?.[0] || '';
  const defaultColor = product.colors?.[0] || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, defaultSize, defaultColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/shop/${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-blush aspect-[3/4]">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); toggle(product); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
          >
            <Heart
              size={16}
              className={wished ? 'fill-mauve text-mauve' : 'text-burgundy/60'}
            />
          </button>

          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-white/95 backdrop-blur-sm p-4 flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-burgundy text-white hover:bg-burgundy-hover'
                }`}
              >
                <ShoppingBag size={15} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
              <Link
                href={`/shop/${product._id}`}
                className="px-4 py-2.5 rounded-xl border border-burgundy/20 text-burgundy hover:bg-blush font-body text-sm transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 px-1">
          <p className="font-body text-burgundy/50 text-xs uppercase tracking-widest mb-1">{product.category}</p>
          <h3 className="font-body font-medium text-burgundy text-base leading-snug line-clamp-2 group-hover:text-mauve transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body font-semibold text-burgundy text-base">
              ₦{displayPrice.toLocaleString()}
            </span>
            {product.salePrice && (
              <span className="font-body text-burgundy/40 text-sm line-through">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl bg-blush aspect-[3/4]" />
      <div className="mt-4 px-1 space-y-2">
        <div className="h-3 bg-blush rounded w-1/3" />
        <div className="h-4 bg-blush rounded w-3/4" />
        <div className="h-4 bg-blush rounded w-1/4" />
      </div>
    </div>
  );
}
