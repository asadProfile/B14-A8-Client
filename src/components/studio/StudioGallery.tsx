'use client';

import { useState } from 'react';
import { Images } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/Dialog';

export function StudioGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="grid aspect-[16/9] place-items-center rounded-[1.5rem] border border-dashed border-line bg-surface text-muted">
        <Images className="h-8 w-8" />
      </div>
    );
  }

  const [main, ...rest] = images;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2 lg:h-[30rem] lg:grid-cols-3 lg:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative h-64 overflow-hidden rounded-[1.25rem] bg-canvas sm:col-span-2 sm:h-80 lg:col-span-2 lg:row-span-2 lg:h-full"
          aria-label={`Open all ${images.length} photos of ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={`${title}, main view`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition group-hover:bg-black/60">
            <Images className="h-3.5 w-3.5" />
            View all {images.length} photos
          </span>
        </button>

        {rest.slice(0, 2).map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setOpen(true)}
            className="group relative hidden overflow-hidden rounded-[1.25rem] bg-canvas lg:block"
            aria-label={`View photo ${index + 2} of ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${title}, view ${index + 2}`}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            {index === 1 && images.length > 3 && (
              <span className="absolute inset-0 grid place-items-center bg-black/45 font-display text-2xl italic text-white">
                +{images.length - 3}
              </span>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {images.length} photos shared by the host. Click outside or press Escape to close.
          </DialogDescription>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl bg-canvas">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${title}, photo ${index + 1}`}
                  className="h-56 w-full object-cover sm:h-64"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
