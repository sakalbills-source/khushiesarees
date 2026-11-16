import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import Social from '@/components/Social';
import JsonLd from '@/components/JsonLd';
import { PRODUCTS } from '@/lib/catalog';
import { getStockSafe } from '@/lib/inventory';
import { formatAUD } from '@/lib/format';
import { organizationJsonLd } from '@/lib/structured-data';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/lib/site';

export const revalidate = 30;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: '/' },
};

// Only claims the pack supports: real approved photos, fall & hem done on all
// five, inclusions listed per saree, AUD prices, Stripe card checkout, Brisbane.
const REASONS = [
  {
    title: 'Real photographs',
    body: 'Every saree is photographed for real, from the full drape to close-up details, so you can see the borders, motifs and finish.',
  },
  {
    title: 'Ready to wear',
    body: 'Each saree comes with its fall and hem already completed.',
  },
  {
    title: 'Clear inclusions',
    body: 'Every listing states exactly what is included: blouse piece or stitched blouse, sizing and petticoat.',
  },
  {
    title: 'Simple, secure checkout',
    body: 'Prices are in Australian dollars and card payments are processed securely by Stripe.',
  },
];

export default async function HomePage() {
  const stock = await getStockSafe();
  const isAvail = (sku: string) => (stock[sku]?.available ?? 0) > 0;
  const hero = PRODUCTS[0];
  const heroSecond = PRODUCTS[4];
  const [feature, ...rest] = PRODUCTS;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="bg-cream-warm">
        <div className="container-px grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">A saree boutique in Brisbane</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.05] sm:text-6xl">
              Sarees for the moments <em className="text-kumkum">you celebrate</em>
            </h1>
            <div className="rule-gold mt-6" />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Ajrakh with real mirror work, embroidered georgette, soft art silk and shimmering Fendi fabric,
              each one photographed in detail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sarees" className="btn-primary">Shop Sarees</Link>
              <Link href="/about" className="btn-secondary">Our story</Link>
            </div>
          </div>
          <div className="order-1 grid grid-cols-[1.35fr_1fr] items-end gap-3 sm:gap-4 lg:order-2">
            <Link href={`/sarees/${hero.slug}`} className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-cream">
              <Image src={hero.gallery[0].src} alt={hero.gallery[0].alt} fill priority sizes="(min-width:1024px) 32vw, 58vw" className="object-contain" />
            </Link>
            <Link href={`/sarees/${heroSecond.slug}`} className="relative mb-8 block aspect-[3/4] overflow-hidden rounded-sm bg-cream">
              <Image src={heroSecond.gallery[0].src} alt={heroSecond.gallery[0].alt} fill priority sizes="(min-width:1024px) 22vw, 40vw" className="object-contain" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-px py-16 text-center sm:py-20">
        <p className="eyebrow">Welcome to Khushie Sarees</p>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-2xl leading-snug text-ink sm:text-3xl">
          A small, carefully chosen collection of sarees for festive gatherings, weddings and family celebrations,
          with every detail described and every inclusion listed.
        </p>
      </section>

      {/* Featured sarees */}
      <section aria-labelledby="featured" className="container-px">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 id="featured" className="mt-2 text-3xl sm:text-4xl">Featured sarees</h2>
          </div>
          <Link href="/sarees" className="link-underline hidden text-sm text-kumkum sm:inline">Shop all sarees</Link>
        </div>

        <div className="mt-10 grid gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-[1.25fr_2fr]">
          {/* Lead feature */}
          <div>
            <ProductCard product={feature} available={isAvail(feature.sku)} sizes="(min-width:1024px) 38vw, 90vw" />
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{feature.shortDescription}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8">
            {rest.map((p) => (
              <ProductCard key={p.sku} product={p} available={isAvail(p.sku)} sizes="(min-width:1024px) 26vw, 45vw" />
            ))}
          </div>
        </div>
        <div className="mt-12 text-center sm:hidden">
          <Link href="/sarees" className="btn-secondary">Shop all sarees</Link>
        </div>
      </section>

      {/* Reasons to shop */}
      <section aria-labelledby="why" className="mt-24 bg-cream-warm">
        <div className="container-px py-16 sm:py-20">
          <p className="eyebrow text-center">Why shop with us</p>
          <h2 id="why" className="mt-2 text-center text-3xl sm:text-4xl">Thoughtful from the first look</h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((r) => (
              <li key={r.title} className="text-center">
                <span aria-hidden="true" className="mx-auto block h-2 w-2 rotate-45 bg-zari-light" />
                <h3 className="mt-4 text-2xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Price strip: a quiet, honest summary */}
      <section className="container-px py-16 text-center">
        <p className="text-ink-soft">
          Sarees from {formatAUD(Math.min(...PRODUCTS.map((p) => p.priceAud)))} AUD.{' '}
          <Link href="/sarees" className="link-underline text-kumkum">Browse the collection</Link>
        </p>
      </section>

      {/* Social */}
      <section aria-labelledby="follow" className="container-px">
        <div className="rounded-sm border border-zari/25 px-6 py-12 text-center">
          <p className="eyebrow">Follow along</p>
          <h2 id="follow" className="mt-2 text-3xl">See our sarees in motion</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            Drapes, details and new arrivals on Instagram and TikTok.
          </p>
          <div className="mt-6 flex justify-center">
            <Social />
          </div>
        </div>
      </section>
    </>
  );
}
