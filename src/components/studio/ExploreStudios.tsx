'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  CloudOff,
  Loader2,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { StudioCard } from '@/components/studio/StudioCard';
import { StudioGridSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Select } from '@/components/ui/Form';
import { api } from '@/lib/api';
import { PRICE_BANDS, SORT_OPTIONS, STUDIO_CATEGORIES } from '@/lib/constants';
import { cn, getErrorMessage } from '@/lib/utils';
import type { Pagination, Studio } from '@/lib/types';

const PAGE_SIZE = 9;

const chipBase =
  'inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold transition';
const chipIdle = 'border-line bg-canvas text-muted hover:border-ink/25 hover:text-ink';
const chipActive = 'border-ink bg-ink text-canvas';

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function ExploreStudios() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const sort = searchParams.get('sort') as SortValue | null;
    return {
      q: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      price: searchParams.get('price') ?? '',
      sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort! : 'top-rated',
      page: Math.max(1, Number(searchParams.get('page')) || 1),
    };
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(filters.q);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const requestRef = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  const updateParams = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (searchInput === filters.q) return;
    const timer = window.setTimeout(() => {
      updateParams({ q: searchInput.trim() || undefined, page: undefined });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput, filters.q, updateParams]);

  useEffect(() => {
    const id = ++requestRef.current;
    let active = true;

    const [minPrice, maxPrice] = filters.price.split('-');

    setLoading(true);
    setError('');

    api.studios
      .list({
        q: filters.q || undefined,
        category: filters.category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: filters.sort,
        page: filters.page,
        limit: PAGE_SIZE,
      })
      .then((data) => {
        if (!active || id !== requestRef.current) return;
        setStudios(data.studios);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (!active || id !== requestRef.current) return;
        setError(getErrorMessage(err));
        setStudios([]);
      })
      .finally(() => {
        if (!active || id !== requestRef.current) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters, reloadKey]);

  const hasFilters =
    Boolean(filters.q || filters.category || filters.price) || filters.sort !== 'top-rated';

  const clearFilters = () => {
    setSearchInput('');
    router.replace(pathname, { scroll: false });
  };

  const goToPage = (page: number) => {
    updateParams({ page: page === 1 ? undefined : page });
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const pageWindow = useMemo(() => {
    if (!pagination) return [] as number[];
    const total = pagination.pages;
    const current = pagination.page;
    const start = Math.max(1, Math.min(current - 1, total - 2));
    const end = Math.min(total, start + 2);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  }, [pagination]);

  return (
    <>
      <section className="border-b border-line bg-surface/50">
        <div className="container py-12 sm:py-16">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="font-display text-sm italic text-accent">Directory</span>
                <span className="h-px w-8 bg-line" />
                <span className="eyebrow">Every room on StudioSpace</span>
              </div>
              <h1 className="mt-4 font-display text-[2.6rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.4rem]">
                Find the room that fits <em className="italic text-accent">the work.</em>
              </h1>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
                Filter by category, budget and neighborhood. Every space is listed by the person
                who runs it, and every review comes from a real booking.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Peer-to-peer hosting
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Confirmed-slot protection
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container pt-8 sm:pt-10" aria-label="Studio filters">
        <div className="rounded-[1.4rem] border border-line bg-surface p-4 shadow-soft sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <form
              className="relative flex-1"
              onSubmit={(event) => {
                event.preventDefault();
                updateParams({ q: searchInput.trim() || undefined, page: undefined });
              }}
            >
              <label htmlFor="studio-search" className="sr-only">
                Search studios by name, location or feature
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="studio-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Try “natural light”, “Bushwick” or “podcast”"
                className="field h-12 pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateParams({ q: undefined, page: undefined });
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-elevated hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="relative">
                <label htmlFor="studio-sort" className="sr-only">
                  Sort studios
                </label>
                <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <Select
                  id="studio-sort"
                  value={filters.sort}
                  onChange={(event) =>
                    updateParams({
                      sort: event.target.value === 'top-rated' ? undefined : event.target.value,
                      page: undefined,
                    })
                  }
                  className="h-12 w-full pl-9 text-[0.82rem] sm:w-[11.5rem]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="relative">
                <label htmlFor="studio-price" className="sr-only">
                  Filter by hourly price
                </label>
                <Select
                  id="studio-price"
                  value={filters.price}
                  onChange={(event) =>
                    updateParams({ price: event.target.value || undefined, page: undefined })
                  }
                  className="h-12 w-full text-[0.82rem] sm:w-[10.5rem]"
                >
                  {PRICE_BANDS.map((band) => (
                    <option key={band.label} value={band.value}>
                      {band.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-line pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => updateParams({ category: undefined, page: undefined })}
              aria-pressed={!filters.category}
              className={cn(chipBase, !filters.category ? chipActive : chipIdle)}
            >
              All studios
            </button>
            {STUDIO_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => updateParams({ category, page: undefined })}
                aria-pressed={filters.category === category}
                className={cn(chipBase, filters.category === category ? chipActive : chipIdle)}
              >
                {category}
              </button>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className={cn(chipBase, 'ml-auto border-transparent text-accent hover:bg-accent-soft')}
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container py-8 sm:py-10" ref={resultsRef} id="studio-results">
        <div className="mb-6 flex items-center justify-between gap-4 scroll-mt-24">
          <p className="text-sm text-muted" aria-live="polite">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Finding spaces…
              </span>
            ) : pagination ? (
              <>
                <span className="font-semibold text-ink">{pagination.total}</span>{' '}
                {pagination.total === 1 ? 'space' : 'spaces'}
                {filters.category && <> in {filters.category}</>}
                {filters.q && <> matching “{filters.q}”</>}
              </>
            ) : null}
          </p>
          {pagination && pagination.pages > 1 && (
            <p className="hidden text-xs text-muted sm:block">
              Page {pagination.page} of {pagination.pages}
            </p>
          )}
        </div>

        {loading && <StudioGridSkeleton count={PAGE_SIZE} />}

        {!loading && error && (
          <EmptyState
            icon={CloudOff}
            eyebrow="Connection"
            title="We could not load the directory."
            description={error}
            action={
              <Button onClick={() => setReloadKey((key) => key + 1)} variant="outline">
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && studios.length === 0 && (
          <EmptyState
            icon={SearchX}
            eyebrow="Nothing matched"
            title="No spaces fit that brief."
            description="Try a broader price band, a different neighborhood spelling, or clear the category filter. New rooms are added every week."
            action={
              <button type="button" onClick={clearFilters} className={buttonVariants({ variant: 'primary' })}>
                Clear all filters
              </button>
            }
          />
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {studios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}

        {!loading && !error && pagination && pagination.pages > 1 && (
          <nav
            aria-label="Studio results pages"
            className="mt-10 flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              aria-label="Previous page"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:border-ink/30 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageWindow.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-current={page === pagination.page ? 'page' : undefined}
                className={cn(
                  'grid h-9 min-w-9 place-items-center rounded-full border px-2 text-xs font-semibold transition',
                  page === pagination.page
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line text-muted hover:border-ink/30 hover:text-ink',
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              aria-label="Next page"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:border-ink/30 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
