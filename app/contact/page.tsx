import type { Metadata } from 'next';
import { InfoPage, Placeholder } from '@/components/InfoPage';
import Social from '@/components/Social';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Get in touch" title="Contact us" intro={<p>Questions about a saree, sizing or an order? We would love to help.</p>}>
      <h2>Email</h2>
      {CONTACT_EMAIL ? (
        <p><a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-kumkum">{CONTACT_EMAIL}</a></p>
      ) : (
        <Placeholder>The boutique&apos;s contact email will be added here.</Placeholder>
      )}
      <h2>Social</h2>
      <div className="not-prose"><Social /></div>
      <h2>Location</h2>
      <p>Brisbane, Queensland, Australia.</p>
      <Placeholder>Business details (ABN display choice, business hours, return address if needed) are awaiting owner confirmation.</Placeholder>
    </InfoPage>
  );
}
