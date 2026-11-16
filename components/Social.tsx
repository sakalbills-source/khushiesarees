import { INSTAGRAM_URL, TIKTOK_PROFILE_URL } from '@/lib/site';

/**
 * Instagram and TikTok links. The owner has not supplied the profile URLs yet,
 * so until NEXT_PUBLIC_INSTAGRAM_URL / NEXT_PUBLIC_TIKTOK_URL are set each one
 * shows as a clearly marked, non-clickable placeholder.
 */
export default function Social({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const base =
    tone === 'dark'
      ? 'border-cream/40 text-cream hover:bg-cream hover:text-kumkum-deep'
      : 'border-kumkum/60 text-kumkum hover:bg-kumkum hover:text-cream';
  const links = [
    { label: 'Instagram', url: INSTAGRAM_URL },
    { label: 'TikTok', url: TIKTOK_PROFILE_URL },
  ];
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((l) => (
        <li key={l.label}>
          {l.url ? (
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[44px] items-center rounded-sm border px-5 text-sm tracking-wide transition-colors ${base}`}
            >
              {l.label}
            </a>
          ) : (
            <span
              className={`inline-flex min-h-[44px] items-center rounded-sm border border-dashed px-5 text-sm opacity-70 ${
                tone === 'dark' ? 'border-cream/40 text-cream' : 'border-ink/30 text-ink-mute'
              }`}
              title="Placeholder: profile link to be added"
            >
              {l.label} · link to be added
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
