import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Our Story — Elevens Touch',
  description: 'Learn about the story behind Elevens Touch, Nigerian luxury fashion brand.',
};

const values = [
  { title: 'Heritage', description: 'We draw from centuries of Nigerian textile tradition — Adire, Ankara, Aso-oke — weaving history into every piece.' },
  { title: 'Craftsmanship', description: 'Each garment is carefully constructed with attention to detail that honours both the artisan and the wearer.' },
  { title: 'Excellence', description: 'We refuse to compromise on quality. Only the finest fabrics, the most refined silhouettes, the purest expression of luxury.' },
  { title: 'Identity', description: 'Our clothes are a celebration of Nigerian identity — bold, beautiful, and unapologetically proud.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/seventh.jpg" alt="Elevens Touch" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy/80 to-burgundy/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-4">Our Story</p>
            <h1 className="font-display text-white text-4xl lg:text-6xl tracking-wide leading-tight max-w-lg">
              Born from the<br />Heart of Nigeria
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-4">The Beginning</p>
            <h2 className="font-display text-burgundy text-3xl tracking-wide mb-6">A Vision for Nigerian Luxury</h2>
            <div className="space-y-4 font-body text-burgundy/70 text-base leading-relaxed">
              <p>
                Elevens Touch was founded with a singular vision: to create a Nigerian luxury fashion house that could stand alongside
                the world&apos;s greatest names — not by imitation, but by celebrating everything that makes Nigerian fashion extraordinary.
              </p>
              <p>
                We believe that Nigerian fashion is not a subset of world fashion — it IS world fashion. The richness of our textiles,
                the boldness of our patterns, the elegance of our silhouettes: these are gifts to the world.
              </p>
              <p>
                Every piece we create is a declaration. That Nigerian craftsmanship is world-class. That African elegance is timeless.
                That luxury has always lived here.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <Image src="/images/founder.jpg" alt="Founder" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-mauve text-white rounded-2xl p-6 shadow-xl">
              <p className="font-display text-2xl">2020</p>
              <p className="font-body text-white/80 text-sm">Founded in Lagos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-3">What We Stand For</p>
            <h2 className="font-display text-white text-3xl lg:text-4xl tracking-wide">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-mauve/20 flex items-center justify-center mb-4">
                  <span className="font-display text-mauve text-sm">{i + 1}</span>
                </div>
                <h3 className="font-display text-white text-lg tracking-wide mb-3">{v.title}</h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blush text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-4">Ready to Experience It?</p>
          <h2 className="font-display text-burgundy text-3xl tracking-wide mb-6">Wear the Story</h2>
          <p className="font-body text-burgundy/60 mb-8 leading-relaxed">
            Every garment carries the weight of tradition and the lightness of joy. Discover the collection that tells your story.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-4 bg-burgundy text-white rounded-full font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors group"
          >
            Shop the Collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
