import type { Metadata } from 'next';
import { InfoPage, Placeholder, ACL_NOTE } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Returns & Refunds', alternates: { canonical: '/returns' } };

export default function ReturnsPage() {
  return (
    <InfoPage eyebrow="Help" title="Returns & Refunds">
      <h2>Your rights under Australian Consumer Law</h2>
      <p>{ACL_NOTE}</p>
      <p>
        Under the Australian Consumer Law, products come with guarantees that they are of acceptable quality and match
        their description. If a product fails to meet a consumer guarantee, you are entitled to a remedy, such as a
        repair, replacement or refund.
      </p>
      <h2>Change-of-mind returns and exchanges</h2>
      <Placeholder>
        Whether change-of-mind returns or exchanges are offered, the time frame, the condition items must be in, who pays
        return postage, the return address and how refunds are made have not been approved yet. This section will be
        completed once the owner confirms the wording.
      </Placeholder>
      <h2>How to contact us about a return</h2>
      <p>Please get in touch through our Contact page with your order reference.</p>
    </InfoPage>
  );
}
