'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/assets';

export function ShotGrid({ images }: { images: string[] }) {
  const resolvedImages = images.map(asset);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSrc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveSrc(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeSrc]);

  if (resolvedImages.length === 0) return null;

  return (
    <div className="not-prose mt-4 grid gap-3 sm:grid-cols-1">
      {resolvedImages.map((src) => (
        <button
          key={src}
          type="button"
          onClick={() => setActiveSrc(src)}
          className="overflow-hidden rounded-xl border border-fd-border bg-fd-card text-left shadow-sm transition hover:bg-fd-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        >
          <img src={src} alt="" className="block h-auto w-full" loading="lazy" />
        </button>
      ))}

      {activeSrc ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2"
          onClick={() => setActiveSrc(null)}
        >
          <div className="relative max-h-[80vh] max-w-[80vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeSrc}
              alt=""
              className="block max-h-[80vh] max-w-[80vw] rounded-xl object-contain shadow-2xl"
              loading="eager"
              onClick={() => setActiveSrc(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
