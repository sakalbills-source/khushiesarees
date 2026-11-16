import Image from 'next/image';
import Link from 'next/link';
import { CatalogProduct } from '@/lib/catalog';
import { formatAUD } from '@/lib/format';

export default function ProductCard({
  product,
  available,
  priority = false,
  sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw',
}: {
  product: CatalogProduct;
  available: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const img = product.gallery[0];
  return (
    <Link href={`/sarees/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-warm">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {!available && (
          <span className="absolute left-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 text-[11px] uppercase tracking-label text-cream">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <p className="eyebrow">{product.fabric}</p>
        <h3 className="font-serif text-xl leading-snug text-ink group-hover:text-kumkum">{product.title}</h3>
        <p className="text-[15px] text-ink">
          {formatAUD(product.priceAud)} <span className="text-xs text-ink-mute">AUD</span>
        </p>
      </div>
    </Link>
  );
}
