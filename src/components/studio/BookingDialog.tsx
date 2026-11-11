'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Clock, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { api, ApiError } from '@/lib/api';
import { TIME_SLOTS } from '@/lib/constants';
import {
  addDaysISO,
  calculateBookingTotals,
  formatCurrency,
  formatTime,
  getErrorMessage,
  timeToMinutes,
  todayISO,
} from '@/lib/utils';
import type { Studio } from '@/lib/types';

export function BookingDialog({
  studio,
  open,
  onOpenChange,
}: {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setStartTime('10:00');
      setEndTime('13:00');
      setNote('');
      setError('');
    }
  }, [open]);

  const endOptions = useMemo(
    () => TIME_SLOTS.filter((slot) => timeToMinutes(slot) > timeToMinutes(startTime)),
    [startTime],
  );

  const totals = useMemo(
    () => calculateBookingTotals(studio.hourlyRate, startTime, endTime),
    [studio.hourlyRate, startTime, endTime],
  );

  const handleStartChange = (value: string) => {
    setStartTime(value);
    if (timeToMinutes(endTime) <= timeToMinutes(value)) {
      const next = TIME_SLOTS.find((slot) => timeToMinutes(slot) >= timeToMinutes(value) + 60);
      setEndTime(next ?? TIME_SLOTS[TIME_SLOTS.length - 1]);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (totals.hours < 1) {
      setError('Choose a window of at least one hour.');
      return;
    }

    setSubmitting(true);
    try {
      await api.bookings.create({
        studioId: studio.id,
        date,
        startTime,
        endTime,
        note: note.trim() || undefined,
      });
      toast.success('Request sent to the host.', {
        description: `${studio.title} · ${date} · ${formatTime(startTime)}–${formatTime(endTime)}. You will see the confirmation in My bookings.`,
      });
      onOpenChange(false);
      router.push('/my-bookings');
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? err.message
          : getErrorMessage(err, 'Could not send your request.');
      setError(message);
      toast.error('Request not sent', { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent">
          <CalendarDays className="h-3.5 w-3.5" />
          Request a session
        </div>
        <DialogTitle className="mt-3">{studio.title}</DialogTitle>
        <DialogDescription>
          Choose your hours and send a request. The host reviews it before the slot is confirmed —
          you are not charged yet.
        </DialogDescription>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Session date" htmlFor="booking-date" required>
            <Input
              id="booking-date"
              type="date"
              value={date}
              min={todayISO()}
              max={addDaysISO(180)}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" htmlFor="booking-start" required>
              <Select
                id="booking-start"
                value={startTime}
                onChange={(event) => handleStartChange(event.target.value)}
              >
                {TIME_SLOTS.slice(0, -1).map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTime(slot)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Finish" htmlFor="booking-end" required>
              <Select
                id="booking-end"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              >
                {endOptions.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTime(slot)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field
            label="What are you making?"
            htmlFor="booking-note"
            hint="Optional. Helps the host prepare the room. Max 500 characters."
          >
            <Textarea
              id="booking-note"
              value={note}
              maxLength={500}
              placeholder="A two-person portrait session, arriving 15 minutes early to set up."
              onChange={(event) => setNote(event.target.value)}
              className="min-h-[5.5rem]"
            />
          </Field>

          <div className="rounded-2xl border border-line bg-canvas p-4 text-sm">
            <div className="flex items-center justify-between text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatCurrency(studio.hourlyRate)} × {totals.hours.toFixed(totals.hours % 1 ? 1 : 0)}h
              </span>
              <span className="text-ink">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-muted">
              <span>Service fee (5%)</span>
              <span className="text-ink">{formatCurrency(totals.serviceFee)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-ink">
              <span className="font-semibold">Due after confirmation</span>
              <span className="font-display text-xl">{formatCurrency(totals.total)}</span>
            </div>
            {studio.securityDeposit > 0 && (
              <p className="mt-2 flex items-start gap-1.5 text-[0.72rem] leading-relaxed text-muted">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                A refundable {formatCurrency(studio.securityDeposit)} security deposit is noted on
                the booking, separate from the total above.
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-300"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="min-w-[10.5rem]">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Sending request…' : 'Send request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
