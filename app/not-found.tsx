import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-px py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl">This page could not be found</h1>
      <p className="mt-3 text-ink-soft">It may have moved, or the link may be incomplete.</p>
      <Link href="/sarees" className="btn-primary mt-8">Shop Sarees</Link>
    </div>
  );
}
