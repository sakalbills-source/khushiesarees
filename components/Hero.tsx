import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center text-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-charcoal/60" />
      <div className="relative container-px max-w-3xl">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">
          New Festive Collection 2026
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-5 leading-tight">
          Timeless Elegance,<br />Draped in Tradition
        </h1>
        <p className="text-gray-200 max-w-xl mx-auto mb-8">
          Discover handpicked sarees, lehengas, suits and more — crafted for
          every celebration and shipped across the globe.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products" className="btn-gold">
            Shop Collection
          </Link>
          <Link
            href="/products?category=lehenga"
            className="btn-outline border-white text-white hover:bg-white hover:text-charcoal"
          >
            Bridal Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
