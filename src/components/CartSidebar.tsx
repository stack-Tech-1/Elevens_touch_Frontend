'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { items, count, total, removeItem, updateQuantity, isOpen, closeCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-white p-0">
        <SheetHeader className="px-6 py-5 border-b border-blush">
          <SheetTitle className="font-display text-burgundy tracking-wider text-base">
            YOUR BAG ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center">
              <ShoppingBag size={32} className="text-burgundy/40" />
            </div>
            <p className="font-display text-burgundy text-sm tracking-wide">YOUR BAG IS EMPTY</p>
            <p className="font-body text-burgundy/50 text-sm">Discover our luxury collection</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-2 px-8 py-3 bg-burgundy text-white rounded-full font-body text-sm hover:bg-burgundy-hover transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="divide-y divide-blush">
                {items.map((item, i) => (
                  <li key={`${item.product._id}-${item.size}-${item.color}-${i}`} className="flex gap-4 px-6 py-5">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-blush shrink-0">
                      <Image
                        src={item.product.images?.[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-burgundy text-sm leading-snug line-clamp-2">
                        {item.product.name}
                      </p>
                      <div className="flex gap-3 mt-1">
                        {item.size && <span className="font-body text-burgundy/50 text-xs">Size: {item.size}</span>}
                        {item.color && <span className="font-body text-burgundy/50 text-xs">Color: {item.color}</span>}
                      </div>
                      <p className="font-body font-semibold text-burgundy text-sm mt-2">
                        ₦{((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-blush rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                            className="text-burgundy hover:text-mauve transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-body text-burgundy text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                            className="text-burgundy hover:text-mauve transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product._id, item.size, item.color)}
                          className="text-burgundy/30 hover:text-mauve transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-blush px-6 py-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-body text-burgundy/60 text-sm">Subtotal</span>
                <span className="font-body font-semibold text-burgundy">₦{total.toLocaleString()}</span>
              </div>
              <p className="font-body text-burgundy/40 text-xs">Shipping calculated at checkout</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center py-4 bg-burgundy text-white rounded-full font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors"
              >
                Checkout → ₦{total.toLocaleString()}
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center py-3 border border-burgundy/20 text-burgundy rounded-full font-body text-sm hover:bg-blush transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
