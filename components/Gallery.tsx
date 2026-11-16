'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryImage } from '@/lib/catalog';

/**
 * Product gallery in manifest order. Photos are never cropped (object-contain).
 * Tap/click the main photo to open a full-screen viewer that shows the original
 * file; click or tap again to zoom in and move the pointer/finger to pan.
 */
export default function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  // Mobile: keep thumbnails and swipe strip in sync.
  const onScroll = () => {
    const el = stripRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };
  const goTo = (i: number) => {
    setIndex(i);
    const el = stripRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Main image: swipeable on mobile, single frame on desktop */}
      <div
        ref={stripRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-sm bg-cream-warm [scrollbar-width:none] lg:overflow-hidden"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setViewer(true);
            }}
            className="relative aspect-[3/4] w-full shrink-0 snap-center cursor-zoom-in"
            aria-label={`Open larger view: ${img.alt} (photo ${i + 1} of ${images.length})`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain"
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-ink-mute lg:hidden">
        Photo {index + 1} of {images.length} · swipe for more, tap to zoom
      </p>

      {/* Thumbnails in manifest order */}
      <ul className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}: ${img.role}`}
              aria-current={i === index}
              className={`relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-cream-warm ring-offset-2 ring-offset-cream transition ${
                i === index ? 'ring-1 ring-kumkum' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Image src={img.src} alt="" fill sizes="120px" className="object-contain" />
            </button>
          </li>
        ))}
      </ul>

      {viewer &&
        createPortal(
          <Viewer images={images} start={index} onClose={(i) => { setViewer(false); goTo(i); }} />,
          document.body,
        )}
    </div>
  );
}

function Viewer({ images, start, onClose }: { images: GalleryImage[]; start: number; onClose: (i: number) => void }) {
  const [i, setI] = useState(start);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const closeRef = useRef<HTMLButtonElement>(null);
  const img = images[i];

  const prev = useCallback(() => { setZoom(false); setI((n) => (n - 1 + images.length) % images.length); }, [images.length]);
  const next = useCallback(() => { setZoom(false); setI((n) => (n + 1) % images.length); }, [images.length]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(i);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [i, next, prev, onClose]);

  const pan = (clientX: number, clientY: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;
    setOrigin(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`${img.alt}, enlarged`} className="fixed inset-0 z-50 flex flex-col bg-cream">
      <div className="flex items-center justify-between px-4 py-3 text-sm text-ink">
        <span>
          {i + 1} / {images.length} · {img.role}
        </span>
        <button ref={closeRef} type="button" onClick={() => onClose(i)} className="inline-flex h-11 items-center px-3 hover:text-kumkum">
          Close ✕
        </button>
      </div>
      <div
        className={`relative flex-1 overflow-hidden ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={(e) => { pan(e.clientX, e.clientY, e.currentTarget); setZoom((z) => !z); }}
        onMouseMove={(e) => zoom && pan(e.clientX, e.clientY, e.currentTarget)}
        onTouchMove={(e) => zoom && pan(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget)}
      >
        {/* Original file, unoptimised, so every thread and mirror is shown as photographed. */}
        <Image
          src={img.src}
          alt={img.alt}
          fill
          unoptimized
          sizes="100vw"
          className="object-contain transition-transform duration-200"
          style={{ transform: zoom ? 'scale(2.4)' : 'none', transformOrigin: origin }}
        />
      </div>
      <div className="flex items-center justify-center gap-4 py-3">
        <button type="button" onClick={prev} className="btn-secondary px-5 py-2" aria-label="Previous photo">← Prev</button>
        <span className="text-xs text-ink-mute">{zoom ? 'Tap to zoom out' : 'Tap photo to zoom'}</span>
        <button type="button" onClick={next} className="btn-secondary px-5 py-2" aria-label="Next photo">Next →</button>
      </div>
    </div>
  );
}
