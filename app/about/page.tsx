import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Placeholder } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Khushie Sarees is a saree boutique based in Brisbane, Australia.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <InfoPage eyebrow="About us" title="About Khushie Sarees" intro={<p>Khushie Sarees is a saree boutique based in Brisbane, Australia.</p>}>
      <p>
        Every saree in our collection is listed with its fabric, colours, decorative work and exactly what comes with
        it, and photographed from the full drape to the smallest details, so you can choose with confidence.
      </p>
      <Placeholder>The boutique&apos;s own story (how it began and what guides its choice of sarees) will be added here once the owner has written and approved it.</Placeholder>
      <p>
        <Link href="/sarees" className="link-underline text-kumkum">Browse the collection</Link>
      </p>
    </InfoPage>
  );
}
