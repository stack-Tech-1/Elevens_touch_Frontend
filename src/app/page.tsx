'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types';

const categories = [
  { name: 'Dresses', image: '/images/second.jpg', href: '/shop?category=dress' },
  { name: 'Sets', image: '/images/third.jpg', href: '/shop?category=set' },
  { name: 'Accessories', image: '/images/fourth.jpg', href: '/shop?category=accessory' },
  { name: 'Outerwear', image: '/images/fifth.jpg', href: '/shop?category=outerwear' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection />

      {/* Marquee strip */}
      <div className="bg-mauve py-3 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-display text-white text-xs tracking-[0.2em] uppercase flex items-center gap-4">
              Nigerian Luxury <Sparkles size={12} /> Free Delivery Over ₦50,000 <Sparkles size={12} /> New Arrivals Weekly
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-3">Explore</p>
          <h2 className="font-display text-burgundy text-3xl lg:text-4xl tracking-wide">Shop by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={cat.href} className="group block relative rounded-2xl overflow-hidden aspect-[3/4] bg-blush">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-white text-base tracking-wide">{cat.name}</h3>
                  <span className="font-body text-white/60 text-xs flex items-center gap-1 mt-1 group-hover:text-mauve transition-colors">
                    Shop now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-3">Handpicked</p>
            <h2 className="font-display text-burgundy text-3xl lg:text-4xl tracking-wide">Featured Pieces</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 font-body text-burgundy text-sm hover:text-mauve transition-colors group"
          >
            View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>

        <div className="text-center mt-12 sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 border border-burgundy text-burgundy rounded-full font-body text-sm hover:bg-burgundy hover:text-white transition-colors">
            View All Products
          </Link>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 bg-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-4">Our Story</p>
              <h2 className="font-display text-white text-3xl lg:text-4xl tracking-wide leading-tight mb-6">
                Born from the<br />Heart of Nigeria
              </h2>
              <p className="font-body text-white/70 text-base leading-relaxed mb-8">
                Elevens Touch was built on a simple belief: Nigerians deserve access to the finest fashion, beautifully curated and delivered to your door.
                Every piece we carry is handpicked for quality, style, and authenticity.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white rounded-full font-body text-sm tracking-wide hover:bg-white/10 transition-colors group"
              >
                Read Our Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
            >
              <Image
                src="/images/founder.jpeg"
                alt="Elevens Touch founder"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-blush">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-3">Stay Connected</p>
            <h2 className="font-display text-burgundy text-3xl tracking-wide mb-4">Join the Circle</h2>
            <p className="font-body text-burgundy/60 text-base mb-8">
              Be the first to discover new collections, exclusive offers, and style inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-full border border-blush-dark bg-white font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve text-sm"
              />
              <button className="px-8 py-4 bg-burgundy text-white rounded-full font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
