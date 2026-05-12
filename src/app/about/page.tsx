import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Our Story — Elevens Touch',
  description: 'Learn about the story behind Elevens Touch, Nigerian luxury fashion.',
};

const values = [
  { title: 'Heritage', description: 'We celebrate centuries of Nigerian fashion tradition — Adire, Ankara, Aso-oke — and bring the best of that heritage directly to you.' },
  { title: 'Quality', description: 'We inspect every item before it reaches you. If it doesn\'t meet our standard of excellence, it doesn\'t make the cut.' },
  { title: 'Excellence', description: 'We refuse to compromise. Only the finest pieces, the most refined styles, and the purest expression of Nigerian luxury.' },
  { title: 'Identity', description: 'Every item we carry is a celebration of Nigerian identity — bold, beautiful, and unapologetically proud.' },
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
                Elevens Touch was founded with one mission: to bring the best of Nigerian and African fashion
                directly to you — carefully sourced, quality-checked, and ready to wear.
              </p>
              <p>
                We believe Nigerian fashion is world-class. We travel the market, handpick every item, and
                bring you only the pieces that meet our standard of style and quality.
              </p>
              <p>
                Every piece we carry is a statement — that African fashion belongs at the top, and you
                deserve to wear it.
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
          <h2 className="font-display text-burgundy text-3xl tracking-wide mb-6">Shop the Look</h2>
          <p className="font-body text-burgundy/60 mb-8 leading-relaxed">
            Every piece we carry was chosen with you in mind. Discover the collection and find something that tells your story.
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
