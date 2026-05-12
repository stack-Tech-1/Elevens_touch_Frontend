'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1000));
    console.log('Contact form:', data);
    setSent(true);
    reset();
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="bg-blush/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-mauve text-xs uppercase tracking-[0.3em] mb-2">Get in Touch</p>
          <h1 className="font-display text-burgundy text-4xl lg:text-5xl tracking-wide">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-burgundy text-2xl tracking-wide mb-4">We&apos;d love to hear from you</h2>
              <p className="font-body text-burgundy/60 leading-relaxed">
                Whether you have a question about a product, need help with your order, or just want to say hello —
                we&apos;re here for you.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { Icon: MapPin, label: 'Location', value: 'Lagos, Nigeria' },
                { Icon: Phone, label: 'Phone', value: '+234 XXX XXX XXXX' },
                { Icon: Mail, label: 'Email', value: 'hello@elevenstouch.com' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-burgundy flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-mauve" />
                  </div>
                  <div>
                    <p className="font-body text-burgundy/50 text-xs uppercase tracking-wide mb-1">{label}</p>
                    <p className="font-body text-burgundy font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blush/50 rounded-2xl p-6">
              <p className="font-body text-burgundy/70 text-sm leading-relaxed">
                <strong className="text-burgundy">Business hours:</strong><br />
                Monday – Friday: 9am – 6pm WAT<br />
                Saturday: 10am – 4pm WAT<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="font-display text-burgundy text-2xl tracking-wide mb-3">Message Sent!</h3>
                <p className="font-body text-burgundy/60 mb-6">We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="px-8 py-3 border border-burgundy/20 rounded-full font-body text-burgundy text-sm hover:bg-blush transition-colors"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Your Name</label>
                    <input
                      {...register('name')}
                      placeholder="Adaobi Okafor"
                      className="w-full px-4 py-3.5 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                    />
                    {errors.name && <p className="text-mauve text-xs mt-1 font-body">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="adaobi@email.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                    />
                    {errors.email && <p className="text-mauve text-xs mt-1 font-body">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Subject</label>
                  <input
                    {...register('subject')}
                    placeholder="Order enquiry / Product question / General"
                    className="w-full px-4 py-3.5 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                  />
                  {errors.subject && <p className="text-mauve text-xs mt-1 font-body">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block font-body text-burgundy/70 text-xs uppercase tracking-wide mb-1.5">Message</label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3.5 rounded-xl border border-blush-dark bg-blush/20 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm resize-none"
                  />
                  {errors.message && <p className="text-mauve text-xs mt-1 font-body">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-burgundy text-white rounded-2xl font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
