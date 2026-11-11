'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_IMAGES = 6;

export function GalleryUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (images.length >= MAX_IMAGES) {
      toast.error(`You can add up to ${MAX_IMAGES} gallery photos.`);
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      toast.error('That file type is not supported.', {
        description: 'Use a JPG, PNG, WebP, GIF or AVIF image.',
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is too large.', { description: 'Keep each upload under 5 MB.' });
      return;
    }

    setUploading(true);
    try {
      const data = await api.upload(file);
      onChange([...images, data.url].slice(0, MAX_IMAGES));
      toast.success('Gallery photo added.');
    } catch (err) {
      toast.error('Upload failed', { description: getErrorMessage(err) });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="field-label mb-0">
          Gallery photos <span className="font-normal normal-case tracking-normal text-muted">(optional)</span>
        </label>
        <span className="text-[0.68rem] text-muted">
          {images.length}/{MAX_IMAGES}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">
        Show the room from a few angles. The cover image always appears first.
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-canvas"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`Gallery photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
              aria-label={`Remove gallery photo ${index + 1}`}
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-white/25 bg-black/55 text-white opacity-100 backdrop-blur-md transition hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-canvas text-muted transition hover:border-accent/40 hover:text-accent disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            ) : (
              <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
            )}
            <span className="text-[0.62rem] font-semibold">
              {uploading ? 'Uploading…' : 'Add photo'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ALLOWED.join(',')}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
