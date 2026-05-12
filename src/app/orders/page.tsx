'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/lib/api';
import type { Order } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gold/15 text-gold',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-mauve/15 text-mauve',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};

export default function OrdersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) { router.push('/'); return; }
    getMyOrders(token)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-blush/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">Account</p>
          <h1 className="font-display text-burgundy text-4xl tracking-wide">My Orders</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-blush/40 rounded-2xl h-32" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-blush flex items-center justify-center mx-auto mb-6">
              <Package size={36} className="text-burgundy/40" />
            </div>
            <h2 className="font-display text-burgundy text-2xl tracking-wide mb-3">No orders yet</h2>
            <p className="font-body text-burgundy/50 mb-8">Start shopping to see your orders here</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-burgundy text-white rounded-full font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors"
            >
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-blush rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-body text-burgundy font-semibold text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold capitalize ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-burgundy/50">
                      <Clock size={13} />
                      <span className="font-body text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="font-body text-burgundy/60 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                      <span className="font-semibold text-burgundy">₦{order.totalAmount.toLocaleString()}</span>
                    </p>
                    {order.shippingAddress && (
                      <p className="font-body text-burgundy/40 text-xs">
                        Ships to {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, j) => {
                        const product = item.product as { images?: string[]; name?: string } | string;
                        const imgSrc = typeof product === 'object' && product.images?.[0]
                          ? product.images[0] : '/images/placeholder.jpg';
                        return (
                          <div key={j} className="w-10 h-12 rounded-lg overflow-hidden border-2 border-white bg-blush">
                            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <div className="w-10 h-12 rounded-lg border-2 border-white bg-blush flex items-center justify-center">
                          <span className="font-body text-burgundy/60 text-xs">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-burgundy/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
