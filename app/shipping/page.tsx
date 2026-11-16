import type { Metadata } from 'next';
import { InfoPage, Placeholder } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Shipping & Delivery', alternates: { canonical: '/shipping' } };

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="Help" title="Shipping & Delivery">
      <Placeholder>
        <p>Shipping rates, shipping zones, delivery estimates and whether international shipping is offered have not been approved yet. This page will be completed once the owner confirms them.</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Australian shipping rates: to be confirmed</li>
          <li>Shipping zones: to be confirmed</li>
          <li>Delivery estimates: to be confirmed</li>
          <li>International shipping: to be confirmed</li>
          <li>Dispatch location and tracking: to be confirmed</li>
        </ul>
      </Placeholder>
      <p>If you have a question about delivery before you order, please contact us.</p>
    </InfoPage>
  );
}
