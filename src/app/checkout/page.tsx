'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
});

type FormData = z.infer<typeof schema>;

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: user?.email || '' },
  });

  useEffect(() => {
    if (items.length === 0) router.push('/shop');
  }, [items, router]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const onSubmit = (data: FormData) => {
    if (!window.PaystackPop) { alert('Payment system loading, please try again.'); return; }

    setIsProcessing(true);
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
      email: data.email,
      amount: total * 100,
      currency: 'NGN',
      ref: `ET-${Date.now()}`,
      onClose: () => setIsProcessing(false),
      callback: async (response: { reference: string }) => {
        try {
          if (token) {
            await createOrder({
              items: items.map(i => ({
                product: i.product._id,
                quantity: i.quantity,
                price: i.product.salePrice ?? i.product.price,
                size: i.size,
                color: i.color,
              })),
              totalAmount: total,
              shippingAddress: data,
              paymentRef: response.reference,
            }, token);
          }
          clearCart();
          router.push('/orders');
        } catch {
          alert('Order saved failed — but payment was received. Please contact support.');
          setIsProcessing(false);
        }
      },
    });
    handler.openIframe();
  };

  if (items.length === 0) return null;

  const shippingFee = total >= 50000 ? 0 : 3000;

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-blush/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">Final Step</p>
          <h1 className="font-display text-burgundy text-4xl tracking-wide">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-burgundy text-xl tracking-wide mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'firstName', label: 'First Name', placeholder: 'Adaobi', col: 1 },
                    { name: 'lastName', label: 'Last Name', placeholder: 'Okafor', col: 1 },
                    { name: 'email', label: 'Email Address', placeholder: 'adaobi@email.com', col: 2 },
                    { name: 'phone', label: 'Phone Number', placeholder: '+234 XXX XXX XXXX', col: 2 },
                    { name: 'address', label: 'Street Address', placeholder: '123 Victoria Island', col: 2 },
                    { name: 'city', label: 'City', placeholder: 'Lagos', col: 1 },
                    { name: 'state', label: 'State', placeholder: 'Lagos State', col: 1 },
                  ].map(({ name, label, placeholder, col }) => (
                    <div key={name} className={col === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">
                        {label}
                      </label>
                      <input
                        {...register(name as keyof FormData)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                      />
                      {errors[name as keyof FormData] && (
                        <p className="text-mauve text-xs mt-1 font-body">{errors[name as keyof FormData]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="flex items-center gap-3 p-4 bg-blush/50 rounded-xl">
                <ShieldCheck size={20} className="text-mauve shrink-0" />
                <p className="font-body text-burgundy/70 text-sm">
                  Your payment is secured by Paystack. We never store your card details.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-burgundy text-white rounded-2xl font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {isProcessing && <Loader2 size={18} className="animate-spin" />}
                {isProcessing ? 'Processing…' : `Pay ₦${(total + shippingFee).toLocaleString()} via Paystack`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-blush/30 rounded-3xl p-6 sticky top-24">
              <h2 className="font-display text-burgundy text-xl tracking-wide mb-6">Order Summary</h2>

              <ul className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-blush shrink-0">
                      <Image
                        src={item.product.images?.[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-burgundy text-white text-[10px] rounded-full flex items-center justify-center font-body">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-burgundy text-sm font-medium line-clamp-2">{item.product.name}</p>
                      <p className="font-body text-burgundy/50 text-xs mt-1">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                      <p className="font-body text-burgundy text-sm font-semibold mt-1">
                        ₦{((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-blush-dark pt-4 space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-burgundy/60">Subtotal</span>
                  <span className="text-burgundy">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-burgundy/60">Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-600' : 'text-burgundy'}>
                    {shippingFee === 0 ? 'Free' : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="font-body text-burgundy/40 text-xs">Free shipping on orders over ₦50,000</p>
                )}
                <div className="border-t border-blush-dark pt-3 flex justify-between font-body">
                  <span className="text-burgundy font-semibold">Total</span>
                  <span className="text-burgundy text-xl font-semibold">₦{(total + shippingFee).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
