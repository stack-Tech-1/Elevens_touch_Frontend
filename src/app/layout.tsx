import type { Metadata } from 'next';
import { Cinzel_Decorative, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const cinzelDecorative = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elevens Touch — Nigerian Luxury Fashion',
  description: 'Discover premium Nigerian luxury fashion. Curated for the bold, worn by the distinguished.',
  keywords: 'Nigerian fashion, luxury clothing, African fashion, Elevens Touch',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${cinzelDecorative.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-full flex flex-col antialiased bg-white">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
