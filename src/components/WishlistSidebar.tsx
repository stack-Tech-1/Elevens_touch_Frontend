'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Heart, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistSidebar() {
  const { items, count, toggle, isOpen, closeWishlist } = useWishlist();
  const { addItem } = useCart();

  const moveToBag = (product: (typeof items)[0]) => {
    addItem(product, product.sizes?.[0] || '', product.colors?.[0] || '');
    toggle(product);
  };

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && closeWishlist()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-white p-0">
        <SheetHeader className="px-6 py-5 border-b border-blush">
          <SheetTitle className="font-display text-burgundy tracking-wider text-base">
            YOUR WISHLIST ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center">
              <Heart size={32} className="text-burgundy/40" />
            </div>
            <p className="font-display text-burgundy text-sm tracking-wide">YOUR WISHLIST IS EMPTY</p>
            <p className="font-body text-burgundy/50 text-sm">Discover our luxury collection</p>
            <Link
              href="/shop"
              onClick={closeWishlist}
              className="mt-2 px-8 py-3 bg-burgundy text-white rounded-full font-body text-sm hover:bg-burgundy-hover transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="divide-y divide-blush">
                {items.map(item => (
                  <li key={item._id} className="flex gap-4 px-6 py-5">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-blush shrink-0">
                      <Image
                        src={item.images?.[0] || '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-burgundy text-sm leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <p className="font-body font-semibold text-burgundy text-sm mt-2">
                        ₦{(item.salePrice ?? item.price).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => moveToBag(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-white rounded-full font-body text-xs hover:bg-burgundy-hover transition-colors"
                        >
                          <ShoppingBag size={12} /> Move to Bag
                        </button>
                        <button
                          onClick={() => toggle(item)}
                          className="p-1.5 text-burgundy/30 hover:text-mauve transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-blush px-6 py-6">
              <button
                onClick={closeWishlist}
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
