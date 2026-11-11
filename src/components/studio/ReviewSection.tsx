'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, MessageSquareQuote, PenLine, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/Avatar';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Field, Textarea } from '@/components/ui/Form';
import { RatingInput, StarRating } from '@/components/ui/StarRating';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatTimestamp, getErrorMessage } from '@/lib/utils';
import type { Review, ReviewSummary, Studio } from '@/lib/types';

const EMPTY_SUMMARY: ReviewSummary = {
  rating: 0,
  reviewCount: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export function ReviewSection({ studio }: { studio: Studio }) {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const isOwner = Boolean(user && user.email === studio.ownerEmail);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.reviews.list(studio.id);
      setReviews(data.reviews);
      setMyReview(data.myReview);
      setSummary(data.summary);
      if (data.myReview) {
        setRating(data.myReview.rating);
        setComment(data.myReview.comment);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [studio.id]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!rating) {
      setFormError('Choose a star rating before publishing.');
      return;
    }
    if (comment.trim().length < 3) {
      setFormError('Add a short note so the next creator knows what to expect.');
      return;
    }

    setSubmitting(true);
    try {
      await api.reviews.create(studio.id, { rating, comment: comment.trim() });
      toast.success(myReview ? 'Your review was updated.' : 'Review published', {
        description: 'Thanks for keeping StudioSpace honest for the next creator.',
      });
      setReloadKey((key) => key + 1);
    } catch (err) {
      const message = getErrorMessage(err, 'Could not publish your review.');
      setFormError(message);
      toast.error('Review not published', { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  const distributionRows = useMemo(
    () =>
      ([5, 4, 3, 2, 1] as const).map((star) => ({
        star,
        count: summary.distribution[String(star) as '1' | '2' | '3' | '4' | '5'] ?? 0,
        percent:
          summary.reviewCount > 0
            ? Math.round(
                ((summary.distribution[String(star) as '1' | '2' | '3' | '4' | '5'] ?? 0) /
                  summary.reviewCount) *
                  100,
              )
            : 0,
      })),
    [summary],
  );

  return (
    <section id="reviews" className="scroll-mt-24 border-t border-line pt-10">
      <div className="flex items-center gap-3">
        <span className="eyebrow">The verdict</span>
        <span className="h-px w-8 bg-line" />
      </div>
      <h2 className="mt-3 font-display text-[1.9rem] tracking-[-0.025em] text-ink">
        What creators <em className="italic text-accent">say.</em>
      </h2>

      {loading ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <Skeleton className="h-16 w-32" />
            {[0, 1, 2, 3, 4].map((row) => (
              <Skeleton key={row} className="h-2.5 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            {[0, 1, 2].map((row) => (
              <Skeleton key={row} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-line bg-canvas p-5 text-sm text-muted">
          {error}{' '}
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-line bg-canvas p-6">
              <div className="flex items-end gap-3">
                <span className="font-display text-6xl leading-none text-ink">
                  {summary.reviewCount > 0 ? summary.rating.toFixed(1) : '—'}
                </span>
                <div className="pb-1">
                  <StarRating rating={summary.rating} showValue={false} />
                  <p className="mt-1 text-xs text-muted">
                    {summary.reviewCount} {summary.reviewCount === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {distributionRows.map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-[0.72rem] text-muted">
                    <span className="inline-flex w-7 shrink-0 items-center gap-0.5">
                      {row.star}
                      <Star className="h-2.5 w-2.5 fill-star text-star" />
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
                      <span
                        className="block h-full rounded-full bg-star transition-all duration-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </span>
                    <span className="w-5 shrink-0 text-right tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-line pt-4 text-[0.72rem] leading-relaxed text-muted">
                Reviews can only be written by signed-in members. Hosts cannot review their own
                space.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6">
              {!authLoading && !user && (
                <div className="flex h-full min-h-[12rem] flex-col items-start justify-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-canvas text-accent">
                    <MessageSquareQuote className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-ink">Booked this room before?</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Sign in to leave a review. Honest notes help the next crew choose the right
                    space.
                  </p>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`${pathname}#reviews`)}`}
                    className={buttonVariants({ variant: 'primary', size: 'sm', className: 'mt-4' })}
                  >
                    Sign in to review
                  </Link>
                </div>
              )}

              {!authLoading && user && isOwner && (
                <div className="flex h-full min-h-[12rem] flex-col items-start justify-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-canvas text-accent">
                    <PenLine className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-ink">This is your listing.</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Reviews come from the creators who book your space. Host feedback stays out of
                    the rating, by design.
                  </p>
                </div>
              )}

              {!authLoading && user && !isOwner && (
                <form onSubmit={submitReview}>
                  <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
                    <PenLine className="h-3.5 w-3.5" />
                    {myReview ? 'Update your review' : 'Leave a review'}
                  </div>
                  <h3 className="mt-3 font-display text-xl text-ink">
                    {myReview ? 'Change your notes?' : 'How was the room?'}
                  </h3>
                  <div className="mt-4">
                    <RatingInput value={rating} onChange={setRating} />
                  </div>
                  <Field label="Your experience" htmlFor="review-comment" required className="mt-4">
                    <Textarea
                      id="review-comment"
                      value={comment}
                      maxLength={1000}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Natural light all afternoon, the cyc wall was freshly painted, and Maya left coffee out for the crew."
                      className="min-h-[6rem]"
                    />
                  </Field>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-[0.68rem] text-muted">{comment.length}/1000</p>
                    <Button type="submit" size="sm" disabled={submitting}>
                      {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {submitting
                        ? 'Publishing…'
                        : myReview
                          ? 'Update review'
                          : 'Publish review'}
                    </Button>
                  </div>
                  {formError && (
                    <p role="alert" className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {formError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-surface/60 px-5 py-10 text-center text-sm text-muted">
                No reviews yet. Be the first to book this space and report back.
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={review.userPhoto} name={review.userName} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <div>
                          <p className="text-sm font-semibold text-ink">{review.userName}</p>
                          <p className="text-[0.68rem] text-muted">
                            {formatTimestamp(review.createdAt)}
                            {myReview?.id === review.id && (
                              <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-accent">
                                Yours
                              </span>
                            )}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size="sm" showValue={false} />
                      </div>
                      <p className="mt-3 whitespace-pre-line text-[0.86rem] leading-relaxed text-muted">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
