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
      {/* Background image */}
      <Image
        src="/images/first.jpg"
        alt="Elevens Touch hero"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-burgundy/80 via-burgundy/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-burgundy/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.p
            variants={fadeUp}
            className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-4"
          >
            Nigerian Luxury Fashion
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-wide mb-6"
          >
            Where Heritage
            <br />
            <span className="text-mauve">Meets Elegance</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-white/70 text-lg leading-relaxed mb-10 max-w-md"
          >
            Discover our curated collection of luxury Nigerian fashion — crafted for the bold, worn by the distinguished.
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
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white rounded-full font-body text-sm tracking-wide hover:bg-white/10 backdrop-blur-sm transition-colors"
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
