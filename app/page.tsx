import Link from 'next/link';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import Testimonials from '@/components/Testimonials';
import ProductGrid from '@/components/ProductGrid';
import { getFeaturedByCategory } from '@/lib/products';
import { Category } from '@/lib/types';

const sections: { category: Category; title: string; subtitle: string }[] = [
  { category: 'saree', title: 'Sarees', subtitle: 'Silk, Banarasi, Georgette & more' },
  { category: 'lehenga', title: 'Lehengas', subtitle: 'Bridal & festive showstoppers' },
  { category: 'suit', title: 'Salwar Suits', subtitle: 'Anarkali, palazzo & sharara sets' },
  { category: 'kurti', title: 'Kurtis', subtitle: 'Everyday elegance, reimagined' },
];

export const revalidate = 60;

export default async function HomePage() {
  const sectionData = await Promise.all(
    sections.map(async (s) => ({
      ...s,
      products: await getFeaturedByCategory(s.category, 8),
    })),
  );

  return (
    <>
      <Hero />

      {/* Category quick links */}
      <section className="container-px py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((s) => (
            <Link
              key={s.category}
              href={`/products?category=${s.category}`}
              className="bg-gray-50 hover:bg-gold/10 border border-gray-100 rounded-sm p-6 text-center transition-colors"
            >
              <span className="font-serif text-xl text-charcoal">{s.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {sectionData.map((s) => (
        <section key={s.category} className="container-px py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-serif text-3xl text-charcoal">{s.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{s.subtitle}</p>
            </div>
            <Link
              href={`/products?category=${s.category}`}
              className="text-gold-dark text-sm font-medium hover:underline whitespace-nowrap"
            >
              View all →
            </Link>
          </div>
          <ProductGrid products={s.products} />
        </section>
      ))}

      <Testimonials />
      <Newsletter />
    </>
  );
}
