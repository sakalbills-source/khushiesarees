import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage } from '@/components/InfoPage';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Answers about our sarees: what is included, blouse sizes, petticoats, prices and payment.',
  alternates: { canonical: '/faqs' },
};

const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: 'What comes with each saree?',
    a: 'It depends on the saree, and each listing states it under "Included". Every saree has its fall and hem already completed. Some come with an unstitched blouse piece; others come with a stitched blouse and a matching petticoat.',
  },
  {
    q: 'Which sarees include a stitched blouse, and in what size?',
    a: 'The Olive-Gold Embellished Saree comes with a stitched blouse in size 38, with no margin for alteration, plus an extra unstitched blouse piece. The Black Georgette Saree with Multicolour Floral Embroidery comes with a stitched blouse in size 40 that can be altered up to size 42. The other sarees come with an unstitched blouse piece.',
  },
  {
    q: 'Is a petticoat included?',
    a: 'A matching petticoat is included with the Olive-Gold Embellished Saree and the Black Georgette Saree with Multicolour Floral Embroidery. It is not included with the other sarees.',
  },
  {
    q: 'What currency are prices in?',
    a: 'All prices are in Australian dollars (AUD).',
  },
  {
    q: 'How do I pay?',
    a: 'By card, on Stripe’s secure checkout page. Your card details are entered with Stripe and are not stored by us.',
  },
  {
    q: 'How much is shipping and how long does delivery take?',
    a: 'Shipping rates and delivery times are being finalised.',
    link: { href: '/shipping', label: 'Shipping & Delivery' },
  },
  {
    q: 'Can I return or exchange a saree?',
    a: 'Your rights under the Australian Consumer Law always apply. Our change-of-mind policy is being finalised.',
    link: { href: '/returns', label: 'Returns & Refunds' },
  },
  {
    q: 'How should I care for my saree?',
    a: 'Care guidance is being confirmed for each fabric. Please contact us before washing or treating a saree.',
    link: { href: '/contact', label: 'Contact us' },
  },
];

export default function FaqsPage() {
  return (
    <InfoPage eyebrow="Help" title="Frequently asked questions">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <div className="divide-y divide-zari/20 border-y border-zari/20">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-2">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-ink">
              {f.q}
              <span aria-hidden="true" className="text-kumkum transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="pb-3 text-ink-soft">
              {f.a}{' '}
              {f.link && <Link href={f.link.href} className="link-underline text-kumkum">{f.link.label}</Link>}
            </p>
          </details>
        ))}
      </div>
    </InfoPage>
  );
}
