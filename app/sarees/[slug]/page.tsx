import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Gallery from '@/components/Gallery';
import AddToCart from '@/components/AddToCart';
import StockStatus from '@/components/StockStatus';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';
import { CARE_PLACEHOLDER, PRODUCTS, getProductBySlug } from '@/lib/catalog';
import { getStockSafe } from '@/lib/inventory';
import { formatAUD } from '@/lib/format';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/structured-data';

export const revalidate = 30;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: 'Saree not found' };
  const img = p.gallery[0];
  return {
    title: p.title,
    description: p.shortDescription,
    alternates: { canonical: `/sarees/${p.slug}` },
    openGraph: {
      type: 'website',
      title: p.title,
      description: p.shortDescription,
      url: `/sarees/${p.slug}`,
      images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }],
    },
    twitter: { card: 'summary_large_image', title: p.title, description: p.shortDescription, images: [img.src] },
  };
}

export default async function SareePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();
  const stock = await getStockSafe();
  const available = stock[p.sku]?.available ?? 0;
  const others = PRODUCTS.filter((o) => o.sku !== p.sku).slice(0, 4);

  const details: [string, string][] = [
    ['Fabric', p.fabric],
    ['Colour', p.colour],
    ['Decorative details', p.work],
    ['Blouse', p.blouse],
    ['Petticoat', p.petticoat],
    ['Size & alteration', p.sizeAlteration],
    ['Finishing', 'Fall and hem completed'],
  ];

  return (
    <>
      <JsonLd data={productJsonLd(p, available > 0)} />
      <JsonLd data={breadcrumbJsonLd(p)} />

      <nav aria-label="Breadcrumb" className="container-px pt-6 text-xs text-ink-mute">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link href="/" className="hover:text-kumkum">Home</Link> /</li>
          <li><Link href="/sarees" className="hover:text-kumkum">Sarees</Link> /</li>
          <li aria-current="page" className="text-ink">{p.shortTitle}</li>
        </ol>
      </nav>

      <div className="container-px grid gap-10 pt-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gallery images={p.gallery} title={p.title} />
          {p.tiktokProductVideoUrl && (
            <a
              href={p.tiktokProductVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-5 w-full"
            >
              Watch This Saree on TikTok
            </a>
          )}
          {/* Reserved for an embedded product video later (same field). */}
        </div>

        <div>
          <p className="eyebrow">{p.fabric} saree</p>
          <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{p.title}</h1>
          <p className="mt-4 text-2xl text-ink">
            {formatAUD(p.priceAud)} <span className="text-sm text-ink-mute">AUD</span>
          </p>
          <p className="mt-1 text-sm">
            <StockStatus sku={p.sku} initialAvailable={available} />
          </p>

          <p className="mt-6 leading-relaxed text-ink-soft">{p.shortDescription}</p>

          <div className="mt-8">
            <AddToCart sku={p.sku} initialAvailable={available} price={formatAUD(p.priceAud)} />
          </div>
          <ul className="mt-5 grid gap-2 text-sm text-ink-soft">
            <li>Secure card payment by Stripe</li>
            <li>
              <Link href="/shipping" className="link-underline">Shipping</Link> and{' '}
              <Link href="/returns" className="link-underline">returns</Link> information
            </li>
          </ul>

          <section aria-labelledby="desc" className="mt-10 border-t border-zari/25 pt-8">
            <h2 id="desc" className="text-2xl">About this saree</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{p.description}</p>
            <ul className="mt-5 space-y-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-ink-soft">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-zari-light" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="details" className="mt-10 border-t border-zari/25 pt-8">
            <h2 id="details" className="text-2xl">Details</h2>
            <dl className="mt-4 divide-y divide-zari/15 text-sm">
              {details.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                  <dt className="text-ink-mute">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                <dt className="text-ink-mute">Included</dt>
                <dd className="text-ink">
                  <ul className="space-y-1">{p.included.map((i) => <li key={i}>{i}</li>)}</ul>
                </dd>
              </div>
              {p.notIncluded.length > 0 && (
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                  <dt className="text-ink-mute">Not included</dt>
                  <dd className="text-ink">{p.notIncluded.join(', ')}</dd>
                </div>
              )}
              <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                <dt className="text-ink-mute">Care</dt>
                <dd className="text-ink-soft italic">{CARE_PLACEHOLDER}</dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                <dt className="text-ink-mute">Availability</dt>
                <dd className="text-ink"><StockStatus sku={p.sku} initialAvailable={available} variant="detail" /></dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                <dt className="text-ink-mute">Shipping & returns</dt>
                <dd className="text-ink">
                  See <Link href="/shipping" className="link-underline">Shipping & Delivery</Link> and{' '}
                  <Link href="/returns" className="link-underline">Returns & Refunds</Link>.
                </dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                <dt className="text-ink-mute">Product code</dt>
                <dd className="text-ink">{p.sku}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <section aria-labelledby="more" className="container-px mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 id="more" className="text-3xl">More from the boutique</h2>
          <Link href="/sarees" className="link-underline text-sm text-kumkum">View all</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {others.map((o) => (
            <ProductCard key={o.sku} product={o} available={(stock[o.sku]?.available ?? 0) > 0} sizes="(min-width: 1024px) 22vw, 45vw" />
          ))}
        </div>
      </section>
      {/* room for the mobile buy bar */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}
