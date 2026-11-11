'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Check,
  CircleDollarSign,
  ImageIcon,
  Info,
  LayoutList,
  Loader2,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { ImageUploader } from '@/components/studio/ImageUploader';
import { GalleryUploader } from '@/components/studio/GalleryUploader';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/api';
import { AMENITY_OPTIONS, STUDIO_CATEGORIES } from '@/lib/constants';
import { cn, formatCurrency, getErrorMessage } from '@/lib/utils';
import type { Studio, StudioCategory, StudioPayload } from '@/lib/types';

type FormState = {
  title: string;
  category: StudioCategory;
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  location: string;
  imageURL: string;
  images: string[];
  amenities: string[];
  overview: string;
};

const emptyState: FormState = {
  title: '',
  category: 'Photo Studio',
  hourlyRate: '',
  securityDeposit: '0',
  capacity: '',
  location: '',
  imageURL: '',
  images: [],
  amenities: [],
  overview: '',
};

function toFormState(studio?: Studio): FormState {
  if (!studio) return emptyState;
  return {
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: String(studio.securityDeposit ?? 0),
    capacity: String(studio.capacity),
    location: studio.location,
    imageURL: studio.imageURL,
    images: studio.images ?? [],
    amenities: studio.amenities ?? [],
    overview: studio.overview,
  };
}

function FormSection({
  index,
  title,
  description,
  icon: Icon,
  children,
}: {
  index: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-line bg-surface p-5 shadow-soft sm:p-7">
      <div className="flex items-start gap-3.5 border-b border-line pb-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-canvas text-accent">
          <Icon className="h-4 w-4" strokeWidth={1.6} />
        </span>
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted">
            Step {index}
          </p>
          <h2 className="mt-1 font-display text-xl tracking-[-0.02em] text-ink">{title}</h2>
          <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function StudioForm({ mode = 'create', studio }: { mode?: 'create' | 'edit'; studio?: Studio }) {
  const router = useRouter();
  const { user } = useAuth();
  const [values, setValues] = useState<FormState>(() => toFormState(studio));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const toggleAmenity = (amenity: string) => {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  const rateNumber = Number(values.hourlyRate);
  const depositNumber = Number(values.securityDeposit || 0);
  const capacityNumber = Number(values.capacity);

  const preview = useMemo(
    () => ({
      title: values.title.trim() || 'Your studio title',
      category: values.category,
      location: values.location.trim() || 'Neighbourhood, city',
      rate: Number.isFinite(rateNumber) && rateNumber > 0 ? rateNumber : null,
      capacity: Number.isFinite(capacityNumber) && capacityNumber > 0 ? capacityNumber : null,
    }),
    [values.title, values.category, values.location, rateNumber, capacityNumber],
  );

  const validate = () => {
    const next: Record<string, string> = {};

    if (values.title.trim().length < 4) next.title = 'Use at least 4 characters.';
    if (values.location.trim().length < 4) next.location = 'Add a neighbourhood or address.';
    if (!values.imageURL.trim()) next.imageURL = 'Add a cover image so your listing can be found.';
    else {
      try {
        const parsed = new URL(values.imageURL.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          next.imageURL = 'Use an http(s) image link.';
        }
      } catch {
        next.imageURL = 'Enter a complete image URL, including https://.';
      }
    }
    if (!Number.isFinite(rateNumber) || rateNumber < 1) {
      next.hourlyRate = 'Set an hourly rate of at least $1.';
    }
    if (!Number.isFinite(depositNumber) || depositNumber < 0) {
      next.securityDeposit = 'Enter 0 or a positive deposit.';
    }
    if (!Number.isFinite(capacityNumber) || capacityNumber < 1) {
      next.capacity = 'Capacity must be at least 1.';
    }
    if (values.overview.trim().length < 40) {
      next.overview = `Add at least 40 characters (${values.overview.trim().length}/40).`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    if (!validate()) {
      setFormError('Check the highlighted fields before publishing.');
      toast.error('A few details need attention.', {
        description: 'Fix the highlighted fields and try again.',
      });
      return;
    }

    const payload: StudioPayload = {
      title: values.title.trim(),
      category: values.category,
      hourlyRate: rateNumber,
      securityDeposit: depositNumber,
      capacity: capacityNumber,
      location: values.location.trim(),
      imageURL: values.imageURL.trim(),
      images: values.images,
      amenities: values.amenities,
      overview: values.overview.trim(),
    };

    setSubmitting(true);
    try {
      await (mode === 'edit' && studio
        ? api.studios.update(studio.id, payload)
        : api.studios.create(payload));
      toast.success(mode === 'edit' ? 'Listing updated.' : 'Your studio is live.', {
        description:
          mode === 'edit'
            ? 'The new details are already visible to creators.'
            : 'Creators can now discover and request your space.',
      });
      router.push('/my-listings');
      router.refresh();
    } catch (err) {
      const message = getErrorMessage(err, 'Could not save your listing.');
      setFormError(message);
      if (err instanceof ApiError && err.details) {
        setErrors(Object.fromEntries(err.details.map((issue) => [issue.field, issue.message])));
      }
      toast.error('Listing not saved', { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.55fr_0.85fr]">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormSection
          index="01"
          title="The basics"
          description="What the space is, where it is and how many people it holds."
          icon={LayoutList}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Listing title" htmlFor="studio-title" required error={errors.title}>
                <Input
                  id="studio-title"
                  value={values.title}
                  maxLength={120}
                  onChange={(event) => set('title', event.target.value)}
                  placeholder="Northlight Loft — daylight photo studio with cyc wall"
                  aria-invalid={Boolean(errors.title)}
                />
              </Field>
            </div>

            <Field label="Category" htmlFor="studio-category" required error={errors.category}>
              <Select
                id="studio-category"
                value={values.category}
                onChange={(event) => set('category', event.target.value as StudioCategory)}
              >
                {STUDIO_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Neighbourhood / city"
              htmlFor="studio-location"
              required
              error={errors.location}
            >
              <Input
                id="studio-location"
                value={values.location}
                maxLength={200}
                onChange={(event) => set('location', event.target.value)}
                placeholder="Bushwick, Brooklyn"
                aria-invalid={Boolean(errors.location)}
              />
            </Field>

            <Field
              label="Capacity"
              htmlFor="studio-capacity"
              required
              error={errors.capacity}
              hint="How many people can work in the room at once?"
            >
              <Input
                id="studio-capacity"
                type="number"
                min={1}
                max={1000}
                value={values.capacity}
                onChange={(event) => set('capacity', event.target.value)}
                placeholder="12"
                aria-invalid={Boolean(errors.capacity)}
              />
            </Field>

            <Field label="Category vibe" htmlFor="studio-vibe">
              <div className="flex h-11 items-center gap-2 rounded-xl border border-line bg-canvas px-4 text-xs text-muted">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                {values.category} · {values.amenities.length} amenities selected
              </div>
            </Field>
          </div>
        </FormSection>

        <FormSection
          index="02"
          title="Rate & deposit"
          description="Clear pricing builds trust. The 5% service fee is added for creators at checkout."
          icon={CircleDollarSign}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Hourly rate (USD)"
              htmlFor="studio-rate"
              required
              error={errors.hourlyRate}
              hint="Charged per booked hour, set by you."
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                  $
                </span>
                <Input
                  id="studio-rate"
                  type="number"
                  min={1}
                  max={100000}
                  step="0.01"
                  value={values.hourlyRate}
                  onChange={(event) => set('hourlyRate', event.target.value)}
                  placeholder="85"
                  className="pl-8"
                  aria-invalid={Boolean(errors.hourlyRate)}
                />
              </div>
            </Field>

            <Field
              label="Security deposit (USD)"
              htmlFor="studio-deposit"
              error={errors.securityDeposit}
              hint="Optional. Displayed on the listing and recorded with each booking."
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                  $
                </span>
                <Input
                  id="studio-deposit"
                  type="number"
                  min={0}
                  max={100000}
                  step="0.01"
                  value={values.securityDeposit}
                  onChange={(event) => set('securityDeposit', event.target.value)}
                  placeholder="0"
                  className="pl-8"
                  aria-invalid={Boolean(errors.securityDeposit)}
                />
              </div>
            </Field>
          </div>
        </FormSection>

        <FormSection
          index="03"
          title="How it looks"
          description="One strong cover image, then a few angles of the room in use."
          icon={ImageIcon}
        >
          <div className="space-y-6">
            <ImageUploader
              id="studio-image"
              value={values.imageURL}
              onChange={(url) => set('imageURL', url)}
              error={errors.imageURL}
            />
            <GalleryUploader images={values.images} onChange={(images) => set('images', images)} />
          </div>
        </FormSection>

        <FormSection
          index="04"
          title="What's in the room"
          description="Tick everything included in the booking. Creators search and compare on these."
          icon={Check}
        >
          <div className="flex flex-wrap gap-2" role="group" aria-label="Studio amenities">
            {AMENITY_OPTIONS.map((amenity) => {
              const selected = values.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-pressed={selected}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.76rem] font-medium transition',
                    selected
                      ? 'border-accent/40 bg-accent-soft text-accent'
                      : 'border-line bg-canvas text-muted hover:border-ink/25 hover:text-ink',
                  )}
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  {amenity}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted">
            {values.amenities.length === 0
              ? 'Select at least a few — listings with amenities get more requests.'
              : `${values.amenities.length} amenities selected.`}
          </p>
        </FormSection>

        <FormSection
          index="05"
          title="The story"
          description="Describe the light, the gear, the access and anything a crew should know."
          icon={Info}
        >
          <Field
            label="Space overview"
            htmlFor="studio-overview"
            required
            error={errors.overview}
            hint="Minimum 40 characters. Mention access, noise rules and included gear."
          >
            <Textarea
              id="studio-overview"
              value={values.overview}
              maxLength={5000}
              onChange={(event) => set('overview', event.target.value)}
              placeholder="A 1,400 sq ft daylight loft with a 20 ft seamless cyc wall, blackout curtains and a loading entrance. C-stands, sandbags and a garment rack are included…"
              className="min-h-[9rem]"
              aria-invalid={Boolean(errors.overview)}
            />
          </Field>
          <p className="mt-1.5 text-right text-[0.68rem] text-muted">
            {values.overview.length}/5000
          </p>

          {formError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-300"
            >
              {formError}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/my-listings"
              className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-muted transition hover:text-ink"
            >
              Cancel
            </Link>
            <Button type="submit" size="lg" disabled={submitting} className="min-w-[12rem]">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? 'Saving…'
                : mode === 'edit'
                  ? 'Save changes'
                  : 'Publish listing'}
            </Button>
          </div>
        </FormSection>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[1.4rem] border border-line bg-surface shadow-soft">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
              Live preview
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Draft
            </span>
          </div>
          <div className="relative aspect-[4/3] bg-canvas">
            {values.imageURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.imageURL}
                alt="Listing preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-6 w-6" />
                  <p className="mt-1.5 text-[0.68rem]">Cover image preview</p>
                </div>
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
              {preview.category}
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 text-[0.68rem] text-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {preview.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {preview.capacity ? `${preview.capacity} people` : 'Capacity'}
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg leading-snug text-ink">{preview.title}</h3>
            <p className="mt-2 text-sm text-muted">
              <span className="font-display text-lg text-ink">
                {preview.rate ? formatCurrency(preview.rate) : '$—'}
              </span>{' '}
              / hour
            </p>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <Avatar src={user?.photoURL} name={user?.name || 'StudioSpace host'} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.name || 'StudioSpace host'}
              </p>
              <p className="truncate text-[0.7rem] text-muted">{user?.email}</p>
            </div>
          </div>
          <p className="mt-3 border-t border-line pt-3 text-[0.72rem] leading-relaxed text-muted">
            This listing is tied to your account. Requests and booking confirmations come straight
            to your dashboard.
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-dashed border-line p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
            A listing that books
          </p>
          <ul className="mt-3 space-y-2.5">
            {[
              'Shoot the room in daylight — no filters.',
              'Name the gear that is actually included.',
              'Be honest about noise and access.',
              'Confirm requests within a day.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-[0.75rem] leading-relaxed text-muted">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
