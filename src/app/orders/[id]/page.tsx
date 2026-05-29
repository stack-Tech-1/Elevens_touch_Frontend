'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, MapPin, Phone, Mail, CreditCard, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getOrder } from '@/lib/api';
import type { Order } from '@/types';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gold/15 text-gold',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-mauve/15 text-mauve',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) { router.push('/'); return; }
    getOrder(id, token)
      .then(setOrder)
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));
  }, [id, user, token, router]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-blush/40 rounded-2xl h-32" />)}
        </div>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled = order.status === 'cancelled';
  const currentStep = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-blush/50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/orders" className="inline-flex items-center gap-2 font-body text-burgundy/50 text-sm hover:text-burgundy transition-colors mb-4">
            <ArrowLeft size={15} /> Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-burgundy text-3xl tracking-wide">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            {isCancelled ? (
              <span className="px-3 py-1 rounded-full text-xs font-body font-semibold bg-red-50 text-red-500">Cancelled</span>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
            )}
          </div>
          <p className="font-body text-burgundy/50 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Status timeline */}
        {!isCancelled && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-blush rounded-2xl p-6">
            <h2 className="font-display text-burgundy text-sm tracking-wider uppercase mb-6">Order Progress</h2>
            <div className="flex items-start gap-0">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      i < currentStep ? 'bg-burgundy text-white' :
                      i === currentStep ? 'bg-mauve text-white' :
                      'bg-blush text-burgundy/30'
                    }`}>
                      {i < currentStep ? <Check size={15} /> : <Package size={14} />}
                    </div>
                    <span className={`font-body text-xs capitalize text-center ${i <= currentStep ? 'text-burgundy font-medium' : 'text-burgundy/40'}`}>
                      {step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-px mt-4 ${i < currentStep ? 'bg-burgundy' : 'bg-blush'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-blush rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-blush bg-blush/30">
            <h2 className="font-display text-burgundy text-sm tracking-wider uppercase">
              Items ({order.items.length})
            </h2>
          </div>
          <ul className="divide-y divide-blush">
            {order.items.map((item, i) => {
              const product = item.product as { _id?: string; name?: string; images?: string[] } | string;
              const name = typeof product === 'object' ? product.name : 'Product';
              const img = typeof product === 'object' ? product.images?.[0] : undefined;
              return (
                <li key={i} className="flex gap-4 px-6 py-5">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-blush shrink-0">
                    <Image
                      src={img || '/images/placeholder.jpg'}
                      alt={name || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-burgundy text-sm leading-snug">{name}</p>
                    <p className="font-body text-burgundy/50 text-xs mt-1">
                      {[item.size, item.color].filter(Boolean).join(' · ')}
                    </p>
                    <p className="font-body text-burgundy/60 text-xs mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-body text-burgundy font-semibold text-sm shrink-0">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping address */}
          {order.shippingAddress && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-blush rounded-2xl p-6">
              <h2 className="font-display text-burgundy text-sm tracking-wider uppercase mb-4">Shipping Address</h2>
              <div className="space-y-2.5">
                <div className="flex gap-2.5">
                  <MapPin size={15} className="text-mauve mt-0.5 shrink-0" />
                  <div className="font-body text-burgundy/70 text-sm leading-relaxed">
                    <p className="font-semibold text-burgundy">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <Phone size={15} className="text-mauve shrink-0" />
                  <p className="font-body text-burgundy/70 text-sm">{order.shippingAddress.phone}</p>
                </div>
                <div className="flex gap-2.5 items-center">
                  <Mail size={15} className="text-mauve shrink-0" />
                  <p className="font-body text-burgundy/70 text-sm">{order.shippingAddress.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment summary */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white border border-blush rounded-2xl p-6">
            <h2 className="font-display text-burgundy text-sm tracking-wider uppercase mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between font-body text-sm">
                <span className="text-burgundy/60">Subtotal</span>
                <span className="text-burgundy">₦{order.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-burgundy/60">Shipping</span>
                <span className="text-burgundy">
                  {order.totalAmount - order.items.reduce((s, i) => s + i.price * i.quantity, 0) === 0
                    ? 'Free'
                    : `₦${(order.totalAmount - order.items.reduce((s, i) => s + i.price * i.quantity, 0)).toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-blush pt-3 flex justify-between font-body">
                <span className="text-burgundy font-semibold">Total</span>
                <span className="text-burgundy text-lg font-semibold">₦{order.totalAmount.toLocaleString()}</span>
              </div>
              {order.paymentRef && (
                <div className="flex gap-2 items-start pt-2">
                  <CreditCard size={14} className="text-mauve mt-0.5 shrink-0" />
                  <p className="font-body text-burgundy/40 text-xs break-all">Ref: {order.paymentRef}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-8 py-3 border border-burgundy/20 text-burgundy rounded-full font-body text-sm hover:bg-blush transition-colors"
          >
            <ArrowLeft size={15} /> Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
