import Link from 'next/link';
import { PleatK } from './Logo';
import Social from './Social';

const SHOP = [
  { href: '/sarees', label: 'Shop All Sarees' },
  { href: '/about', label: 'About' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];
const HELP = [
  { href: '/shipping', label: 'Shipping & Delivery' },
  { href: '/returns', label: 'Returns & Refunds' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-kumkum-deep text-cream">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-cream p-1.5"><PleatK className="h-8 w-8" /></span>
            <span className="font-serif text-2xl">Khushie Sarees</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/80">
            A saree boutique in Brisbane, Australia.
          </p>
          <div className="mt-6">
            <Social tone="dark" />
          </div>
        </div>
        <FooterList title="Shop" items={SHOP} />
        <FooterList title="Help" items={HELP} />
      </div>
      <div className="border-t border-cream/15">
        <p className="container-px py-5 text-xs text-cream/70">
          © {new Date().getFullYear()} Khushie Sarees · Prices in Australian dollars (AUD) · Secure payment by Stripe
        </p>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-sans text-[11px] font-medium uppercase tracking-label text-zari-light">{title}</h2>
      <ul className="mt-4 space-y-1">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="inline-block py-1.5 text-sm text-cream/90 hover:text-cream hover:underline underline-offset-4">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
