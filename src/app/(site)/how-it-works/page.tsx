import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  Compass,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'How booking, host approval, overlap protection and invoices work on StudioSpace.',
};

const steps = [
  {
    icon: Compass,
    title: 'Find the room',
    body: 'Start with the shape of the work: a photo studio, sound stage, podcast room, music suite or workshop. Filter by budget and neighbourhood, then read the host’s description and the reviews from creators who booked before you.',
    detail: 'Every listing shows capacity, amenities, rate and deposit before you commit to anything.',
  },
  {
    icon: MessageSquareText,
    title: 'Request your hours',
    body: 'Choose a date, a start time and a finish time. The minimum session is one hour and a single request can run up to twelve. Add a note about what you are making so the host can prepare the room.',
    detail: 'A request is a request — nothing is confirmed or locked until the host says yes.',
  },
  {
    icon: CalendarCheck2,
    title: 'The host confirms',
    body: 'The host sees your request, your hours and your note in their dashboard. Confirming re-checks the calendar against every confirmed booking, so two crews can never hold the same slot.',
    detail: 'If the hours collide with a confirmed session, the confirmation is blocked and the host sees exactly which hours clash.',
  },
  {
    icon: Sparkles,
    title: 'Make, then review',
    body: 'Your booking appears in My bookings with the agreed totals. After the session, the host can mark it completed and you can leave a review from the same page. Confirmed and completed sessions come with a printable PDF invoice.',
    detail: 'Reviews are one per creator per studio and can be updated later. Hosts cannot review their own rooms.',
  },
];

const rules = [
  'Requests stay Pending until a host confirms them.',
  'A confirmed booking locks those hours — overlapping confirmations are rejected.',
  'Minimum session: one hour. Maximum single request: twelve hours.',
  'Pending requests can be cancelled by the guest at no cost.',
  'The 5% service fee is itemised before a request is sent.',
  'Security deposits are recorded on the booking and shown separately from the total.',
];

const faqs = [
  {
    question: 'Do I need an account to browse?',
    answer:
      'No. You can explore every listing, read reviews and compare rates as a guest. You need an account to save studios, send booking requests, leave reviews or list a space of your own.',
  },
  {
    question: 'Can two people book the same room at the same time?',
    answer:
      'No. When a host confirms a request, StudioSpace checks every confirmed booking for that room and date. If the hours overlap, the confirmation is rejected with the conflicting window. Creating a booking request runs the same check, so you never send a request that is already impossible.',
  },
  {
    question: 'When does money change hands?',
    answer:
      'StudioSpace itemises the hourly subtotal, the 5% service fee and any security deposit on the request. The agreed total is recorded on the booking, and confirmed sessions can generate a PDF invoice. This portfolio build does not process card payments — it focuses on availability, approval and records.',
  },
  {
    question: 'What happens if my plans change?',
    answer:
      'Cancel a pending request from My bookings whenever you like; the host stops seeing it immediately. Confirmed sessions cannot be cancelled in the app, so contact your host and hello@studiosspace.com as early as possible.',
  },
  {
    question: 'How does hosting work?',
    answer:
      'Create a listing with honest photos, a rate and the amenities actually included. You approve every request yourself — pending requests never hold the room. You can edit the details whenever you like, and removing a listing cancels its pending requests.',
  },
  {
    question: 'Who can leave a review?',
    answer:
      'Any signed-in creator can leave one review per studio, and can update it later. Hosts cannot review their own space. This keeps ratings tied to real accounts rather than anonymous noise.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-line bg-surface/50">
        <div className="container py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">The guide</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">Booking, plainly explained</span>
            </div>
            <h1 className="mt-4 font-display text-[2.7rem] leading-[0.97] tracking-[-0.035em] text-ink sm:text-[3.7rem]">
              A room, an hour, <em className="italic text-accent">a handshake.</em>
            </h1>
            <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-muted">
              StudioSpace is peer to peer: the person who replies to your request is the person who
              runs the space. Here is exactly how a session moves from an idea to a confirmed
              booking.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/studios" className={buttonVariants({ size: 'lg' })}>
                Explore studios
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/add-studio" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                List your space
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 sm:py-20" aria-labelledby="guide-steps">
        <SectionHeading
          index="01"
          eyebrow="The four steps"
          title={
            <span id="guide-steps">
              From impulse to <em className="italic text-accent">call time.</em>
            </span>
          }
          description="No agents, no phone tag and no hidden calendars. Just a clear request and a host who decides."
        />

        <ol className="mt-10 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="grid gap-5 rounded-[1.4rem] border border-line bg-surface p-6 sm:grid-cols-[auto_1fr] sm:p-7"
            >
              <div className="flex items-start gap-4 sm:w-52 sm:flex-col sm:gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-canvas text-accent">
                  <step.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-display text-sm italic text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 font-display text-xl tracking-[-0.02em] text-ink">
                    {step.title}
                  </h3>
                </div>
              </div>
              <div>
                <p className="text-[0.9rem] leading-[1.75] text-muted">{step.body}</p>
                <p className="mt-3 inline-flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-[0.75rem] leading-relaxed text-accent">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-surface/60">
        <div className="container grid gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">02</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">The rules</span>
            </div>
            <h2 className="mt-3 font-display text-[2rem] tracking-[-0.03em] text-ink">
              Clear terms, <em className="italic text-accent">no surprises.</em>
            </h2>
            <ul className="mt-6 space-y-3">
              {rules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-muted">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">03</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">Questions</span>
            </div>
            <h2 className="mt-3 font-display text-[2rem] tracking-[-0.03em] text-ink">
              The short answers.
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.9rem] font-semibold text-ink marker:content-none">
                    {faq.question}
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-accent/40 group-open:text-accent">
                      <span className="text-base leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl text-[0.84rem] leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#14110e] px-6 py-12 text-center text-white sm:rounded-[2.25rem] sm:px-10 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <ShieldCheck className="mx-auto h-6 w-6 text-[#f2a97e]" />
            <h2 className="mt-4 font-display text-[2rem] leading-tight tracking-[-0.03em] sm:text-[2.6rem]">
              Ready to put a date in the calendar?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.9rem] leading-relaxed text-white/60">
              Browse the directory as a guest, or create an account to send a request and keep the
              confirmation in one place.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Link href="/studios" className={buttonVariants({ variant: 'light', size: 'lg' })}>
                Find a studio
              </Link>
              <Link href="/register" className={buttonVariants({ variant: 'glass', size: 'lg' })}>
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
