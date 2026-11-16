/** The pleat-K mark from the Khushie Sarees logo kit (light version). */
export function PleatK({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(72,72) scale(1.5)">
        <rect x="0" y="0" width="13" height="240" rx="6.5" fill="#A6132B" />
        <rect x="24" y="10" width="13" height="220" rx="6.5" fill="#A6132B" opacity="0.72" />
        <rect x="48" y="20" width="13" height="200" rx="6.5" fill="#A6132B" opacity="0.45" />
        <path d="M 236,-2 C 160,18 96,78 62,118" fill="none" stroke="#A6132B" strokeWidth="30" strokeLinecap="round" />
        <path d="M 62,122 C 96,162 160,222 236,242" fill="none" stroke="#A6132B" strokeWidth="30" strokeLinecap="round" />
        <path d="M 240,14 C 168,34 110,88 78,120 C 110,152 168,206 240,226" fill="none" stroke="#9A7B1E" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="62" cy="120" r="7" fill="#9A7B1E" />
      </g>
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <PleatK className="h-9 w-9 sm:h-10 sm:w-10" />
      <span className="font-serif text-[1.35rem] sm:text-2xl leading-none text-kumkum tracking-wide">
        Khushie Sarees
      </span>
    </span>
  );
}
