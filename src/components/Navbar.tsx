'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, User, LogOut, Settings, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgClass = scrolled || mobileOpen
    ? 'bg-burgundy shadow-lg'
    : 'bg-transparent';

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-display text-white text-xl lg:text-2xl tracking-widest group-hover:text-mauve transition-colors duration-300">
                ELEVENS TOUCH
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative text-white/80 hover:text-white font-body text-sm tracking-wide transition-colors duration-200 group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-mauve group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Desktop right icons */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-mauve flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-body text-sm">{user.name.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-blush overflow-hidden"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-burgundy hover:bg-blush transition-colors font-body text-sm" onClick={() => setUserMenuOpen(false)}>
                          <Package size={15} /> My Orders
                        </Link>
                        {user.isAdmin && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-burgundy hover:bg-blush transition-colors font-body text-sm" onClick={() => setUserMenuOpen(false)}>
                            <Settings size={15} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-burgundy hover:bg-blush transition-colors font-body text-sm border-t border-blush"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span className="font-body text-sm">Sign In</span>
                </button>
              )}

              <button
                onClick={openCart}
                className="relative text-white/80 hover:text-white transition-colors p-1"
              >
                <ShoppingBag size={22} />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-mauve text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Mobile buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <button onClick={openCart} className="relative text-white p-1">
                <ShoppingBag size={22} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-mauve text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              <button onClick={() => setMobileOpen(o => !o)} className="text-white p-1">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-burgundy border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-white/80 hover:text-white font-body text-lg tracking-wide transition-colors border-b border-white/10"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 space-y-3">
                  {user ? (
                    <>
                      <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-white/80 hover:text-white font-body">
                        <Package size={18} /> My Orders
                      </Link>
                      {user.isAdmin && (
                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2 text-white/80 hover:text-white font-body">
                          <Settings size={18} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-3 py-2 text-white/80 hover:text-white font-body">
                        <LogOut size={18} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                      className="w-full py-3 bg-mauve text-white rounded-full font-body tracking-wide"
                    >
                      Sign In / Register
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CartSidebar />
    </>
  );
}
