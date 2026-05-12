import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Elevens Touch — Nigerian Luxury Fashion',
  description: 'Discover premium Nigerian luxury fashion. Crafted for the bold, worn by the distinguished.',
  keywords: 'Nigerian fashion, luxury clothing, African fashion, Elevens Touch',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased bg-white" style={{ fontFamily: "'Playfair Display', serif" }}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
