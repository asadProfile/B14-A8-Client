'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Field, Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function ImageUploader({
  id,
  label = 'Cover image',
  value,
  onChange,
  error,
  hint,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (!ALLOWED.includes(file.type)) {
      toast.error('That file type is not supported.', {
        description: 'Use a JPG, PNG, WebP, GIF or AVIF image.',
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is too large.', {
        description: 'Keep image uploads under 5 MB, or paste a hosted URL instead.',
      });
      return;
    }

    setUploading(true);
    try {
      const data = await api.upload(file);
      onChange(data.url);
      toast.success('Image uploaded.', { description: 'Check the preview before saving.' });
    } catch (err) {
      toast.error('Upload failed', { description: getErrorMessage(err) });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Field
      label={label}
      htmlFor={id}
      required
      error={error}
      hint={hint ?? 'Paste a hosted image URL or upload a file up to 5 MB.'}
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-canvas">
        <div className="relative aspect-[16/9]">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="Remove cover image"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted transition hover:bg-elevated/60"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              ) : (
                <ImagePlus className="h-6 w-6 text-accent" strokeWidth={1.5} />
              )}
              <span className="text-xs font-semibold">
                {uploading ? 'Uploading…' : 'Upload a cover image'}
              </span>
              <span className="text-[0.68rem]">JPG, PNG, WebP · max 5 MB</span>
            </button>
          )}
          {uploading && value && (
            <span className="absolute inset-0 grid place-items-center bg-black/45 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-line bg-surface p-3 sm:flex-row">
          <Input
            id={id}
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://images.example.com/your-space.jpg"
            aria-invalid={Boolean(error)}
            className="h-10 text-[0.8rem]"
          />
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Uploading' : 'Upload'}
          </Button>
        </div>
      </div>
    </Field>
  );
}
