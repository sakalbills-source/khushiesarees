import { ReactNode } from 'react';

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <article className="container-px max-w-3xl pt-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
      {intro && <div className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</div>}
      <div className="prose-ks mt-8">{children}</div>
    </article>
  );
}

/** A clearly marked placeholder for content the owner has not approved yet. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-sm border border-dashed border-kumkum/50 bg-kumkum-soft/50 px-5 py-4 text-sm leading-relaxed text-ink">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-label text-kumkum">Placeholder · awaiting owner approval</p>
      <div className="text-ink-soft">{children}</div>
    </div>
  );
}

export const ACL_NOTE =
  'Nothing in our policies excludes, restricts or modifies any rights you have under the Australian Consumer Law, including the consumer guarantees that cannot be excluded.';
