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
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">

      {/* Full-bleed photo — object-right keeps model on right on all screen sizes */}
      <Image
        src="/images/hero%205.jpg"
        alt="Elevens Touch — Nigerian Luxury Fashion"
        fill
        priority
        className="object-cover object-right"
        sizes="100vw"
      />

      {/* Light left-side overlay — only darkens where the text sits, invisible over the model */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />

      {/* Content — pinned to the left, width capped so text never overlaps the model */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-xs sm:max-w-sm lg:max-w-lg"
        >
          <motion.p
            variants={fadeUp}
            className="font-body text-white/70 text-xs uppercase tracking-[0.3em] mb-4"
          >
            Nigerian Luxury Fashion
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-wide mb-6"
          >
            Where Heritage
            <br />
            <span className="text-white/90 italic">Meets Elegance</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-white/70 text-base sm:text-lg leading-relaxed mb-10"
          >
            Discover our curated collection of luxury Nigerian fashion, sourced for the bold, worn by the distinguished.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-mauve text-white rounded-full font-body text-sm tracking-wide hover:bg-mauve-dark transition-colors group"
            >
              Shop Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white rounded-full font-body text-sm tracking-wide hover:bg-white/10 backdrop-blur-sm transition-colors"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-body text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
