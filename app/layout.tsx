import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SHOW_DRAFT_BANNER, SITE_NAME, SITE_URL } from '@/lib/site';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Jost({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_AU',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/images/sarees/ivory-indigo-modal-silk-ajrakh-saree-real-mirror-work/01_front_drape.jpeg',
        width: 1086,
        height: 1448,
        alt: 'Ivory & Indigo Modal Silk Ajrakh Saree, front drape',
      },
    ],
  },
  icons: { icon: '/brand/pleat-k.svg', apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#FAF6EE' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2">
          Skip to content
        </a>
        {SHOW_DRAFT_BANNER && (
          <div className="bg-ink text-cream text-center text-xs px-4 py-2">
            Preview: prices, stock, product details and policies are drafts awaiting owner approval. Payments are in Stripe test mode.
          </div>
        )}
        <CartProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
