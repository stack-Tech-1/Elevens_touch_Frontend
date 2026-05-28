'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

export default function HeroSection() {
  return (
    <section className="relative flex flex-col lg:flex-row min-h-screen">

      {/* Right: photo — shown first on mobile (top), second on desktop */}
      <div className="relative h-[55vh] lg:h-auto lg:w-1/2 order-1 lg:order-2 shrink-0">
        <Image
          src="/images/hero%205.jpg"
          alt="Elevens Touch — Nigerian Luxury Fashion"
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Left: content panel */}
      <div className="lg:w-1/2 bg-[#FDF6F0] flex items-center order-2 lg:order-1 py-16 lg:py-0 min-h-[45vh] lg:min-h-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full px-8 sm:px-12 lg:px-16 xl:px-20 max-w-lg mx-auto lg:mx-0 lg:ml-auto"
        >
          <motion.p
            variants={fadeUp}
            className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-4"
          >
            Nigerian Luxury Fashion
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-burgundy text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-wide mb-6"
          >
            Where Heritage
            <br />
            <span className="text-mauve italic">Meets Elegance</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-burgundy/60 text-lg leading-relaxed mb-10 max-w-md"
          >
            Discover our curated collection of luxury Nigerian fashion, sourced for the bold, worn by the distinguished.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-burgundy text-white rounded-full font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors group"
            >
              Shop Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border border-burgundy/30 text-burgundy rounded-full font-body text-sm tracking-wide hover:bg-blush transition-colors"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/4 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="font-body text-burgundy/30 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-burgundy/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
