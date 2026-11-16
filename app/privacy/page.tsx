import type { Metadata } from 'next';
import { InfoPage, Placeholder } from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy Policy">
      <Placeholder>
        <p>The privacy policy has not been written or approved yet. It will be added here before the shop goes live.</p>
        <p className="mt-2">For the owner: it should cover what personal information is collected at checkout (name, email, phone, delivery address), that card payments are handled by Stripe, how the information is used and stored, who it is shared with (for example the delivery carrier), and how customers can access or correct it.</p>
      </Placeholder>
    </InfoPage>
  );
}
