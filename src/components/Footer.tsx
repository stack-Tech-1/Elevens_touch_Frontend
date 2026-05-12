import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-burgundy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-xl tracking-widest text-white mb-4">ELEVENS TOUCH</h3>
            <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
              Nigerian luxury fashion — where heritage meets contemporary elegance.
              Crafted for the bold, worn by the distinguished.
            </p>
            <div className="flex gap-4">
              {[
                { label: 'IG', href: '#' },
                { label: 'FB', href: '#' },
                { label: 'X', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-mauve hover:bg-mauve/20 transition-all duration-300 font-body text-xs font-semibold"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-white tracking-wide mb-5 text-sm uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="font-body text-white/60 hover:text-mauve transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-body font-semibold text-white tracking-wide mb-5 text-sm uppercase">Customer</h4>
            <ul className="space-y-3">
              {[
                { href: '/orders', label: 'My Orders' },
                { href: '#', label: 'Size Guide' },
                { href: '#', label: 'Returns & Exchanges' },
                { href: '#', label: 'Shipping Policy' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="font-body text-white/60 hover:text-mauve transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-white tracking-wide mb-5 text-sm uppercase">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/60">
                <MapPin size={16} className="text-mauve mt-0.5 shrink-0" />
                <span className="font-body">Lagos, Nigeria</span>
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <Phone size={16} className="text-mauve shrink-0" />
                <a href="tel:+234" className="font-body hover:text-mauve transition-colors">+234 XXX XXX XXXX</a>
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <Mail size={16} className="text-mauve shrink-0" />
                <a href="mailto:hello@elevenstouch.com" className="font-body hover:text-mauve transition-colors">hello@elevenstouch.com</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="font-body text-white/60 text-sm mb-3">Subscribe for exclusive offers</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-mauve font-body"
                />
                <button className="bg-mauve hover:bg-mauve-dark text-white px-4 py-2 rounded-full text-sm font-body transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/40 text-xs">
            © 2026 Elevens Touch. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-white/40 hover:text-white/60 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="font-body text-white/40 hover:text-white/60 text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
