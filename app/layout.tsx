import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { CurrencyProvider } from '@/components/CurrencyProvider';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KSarees — Premium Indian Ethnic Wear',
  description:
    'Shop premium sarees, lehengas, salwar suits, kurtis and mens ethnic wear. Worldwide shipping to USA, UK, EU, NZ, Australia, Fiji & Caribbean.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CurrencyProvider>
          <CartProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
