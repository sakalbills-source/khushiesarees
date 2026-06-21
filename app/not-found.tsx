import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-px py-24 text-center">
      <p className="text-gold text-sm tracking-widest uppercase mb-3">404</p>
      <h1 className="font-serif text-4xl mb-4">Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-gold">
        Back to Home
      </Link>
    </div>
  );
}
