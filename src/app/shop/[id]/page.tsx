'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Heart, Minus, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProduct } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(p => {
        setProduct(p);
        setSelectedSize(p.sizes?.[0] || '');
        setSelectedColor(p.colors?.[0] || '');
      })
      .catch(() => router.push('/shop'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length && !selectedSize) { setError('Please select a size'); return; }
    if (product.colors?.length && !selectedColor) { setError('Please select a color'); return; }
    setError('');
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-5xl mx-auto px-4 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-blush rounded-3xl" />
            <div className="space-y-4 pt-8">
              <div className="h-4 bg-blush rounded w-1/4" />
              <div className="h-8 bg-blush rounded w-3/4" />
              <div className="h-6 bg-blush rounded w-1/4" />
              <div className="h-24 bg-blush rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : ['/images/placeholder.jpg'];
  const displayPrice = product.salePrice ?? product.price;

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-body text-burgundy/50 mb-8">
          <Link href="/" className="hover:text-burgundy transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-burgundy transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-burgundy line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-blush"
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && (
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-body font-semibold uppercase tracking-wide ${
                  product.badge === 'new' ? 'bg-burgundy text-white' :
                  product.badge === 'sale' ? 'bg-mauve text-white' :
                  'bg-gold text-white'
                }`}>
                  {product.badge}
                </div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 transition-all ${
                      selectedImage === i ? 'ring-2 ring-burgundy' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">{product.category}</p>
                <h1 className="font-display text-burgundy text-3xl lg:text-4xl tracking-wide leading-tight">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-body text-burgundy text-3xl font-semibold">₦{displayPrice.toLocaleString()}</span>
                {product.salePrice && (
                  <span className="font-body text-burgundy/40 text-xl line-through">₦{product.price.toLocaleString()}</span>
                )}
                {product.salePrice && (
                  <span className="px-3 py-1 bg-mauve/10 text-mauve rounded-full text-sm font-body">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% off
                  </span>
                )}
              </div>

              <p className="font-body text-burgundy/70 text-base leading-relaxed">{product.description}</p>

              {/* Size selector */}
              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-body text-burgundy font-semibold text-sm uppercase tracking-wide">Size</h3>
                    <button className="font-body text-mauve text-xs underline underline-offset-2">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 rounded-xl font-body text-sm border-2 transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-burgundy bg-burgundy text-white'
                            : 'border-burgundy/20 text-burgundy hover:border-mauve'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {product.colors?.length > 0 && (
                <div>
                  <h3 className="font-body text-burgundy font-semibold text-sm uppercase tracking-wide mb-3">
                    Color: <span className="text-mauve">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl font-body text-sm border-2 transition-all ${
                          selectedColor === color
                            ? 'border-burgundy bg-blush'
                            : 'border-burgundy/20 hover:border-mauve'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-body text-burgundy font-semibold text-sm uppercase tracking-wide mb-3">Quantity</h3>
                <div className="flex items-center gap-4 w-fit border-2 border-burgundy/20 rounded-xl px-4 py-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-burgundy hover:text-mauve transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="font-body text-burgundy text-lg w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-burgundy hover:text-mauve transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {error && <p className="font-body text-mauve text-sm">{error}</p>}

              {/* CTA buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-body text-sm tracking-wide transition-all duration-300 ${
                    added
                      ? 'bg-green-600 text-white'
                      : 'bg-burgundy text-white hover:bg-burgundy-hover'
                  }`}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  {added ? 'Added to Bag!' : 'Add to Bag'}
                </button>
                <button
                  onClick={() => setWished(w => !w)}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    wished ? 'border-mauve bg-mauve/10' : 'border-burgundy/20 hover:border-mauve'
                  }`}
                >
                  <Heart size={20} className={wished ? 'fill-mauve text-mauve' : 'text-burgundy/50'} />
                </button>
              </div>

              {/* Details */}
              <div className="border-t border-blush pt-6 space-y-3">
                <div className="flex gap-3 font-body text-sm">
                  <span className="text-burgundy/50 w-24 shrink-0">Category</span>
                  <span className="text-burgundy capitalize">{product.category}</span>
                </div>
                {product.stock !== undefined && (
                  <div className="flex gap-3 font-body text-sm">
                    <span className="text-burgundy/50 w-24 shrink-0">Availability</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-mauve'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
