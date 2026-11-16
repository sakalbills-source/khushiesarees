import type { Metadata } from 'next';
import { InfoPage, Placeholder, ACL_NOTE } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Terms', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terms">
      <Placeholder>
        <p>The terms of sale have not been written or approved yet. They will be added here before the shop goes live.</p>
        <p className="mt-2">For the owner: confirm payment methods, GST treatment, order acceptance, pricing errors, shipping and returns terms, and the business details to show.</p>
      </Placeholder>
      <p>{ACL_NOTE}</p>
    </InfoPage>
  );
}
