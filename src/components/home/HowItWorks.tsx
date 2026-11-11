import Link from 'next/link';
import { CalendarCheck2, Compass, MessageSquareText, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buttonVariants } from '@/components/ui/Button';

const steps = [
  {
    icon: Compass,
    title: 'Find your room',
    body: 'Filter by category, price band and neighborhood. Every listing shows capacity, amenities and honest reviews up front.',
  },
  {
    icon: MessageSquareText,
    title: 'Ask for your hours',
    body: 'Pick a date and a start–finish window. The request goes straight to the host — no phone calls, no guesswork.',
  },
  {
    icon: CalendarCheck2,
    title: 'Get it confirmed',
    body: 'Your host approves the slot. Confirmed hours are locked, so nobody else can book over your session.',
  },
  {
    icon: Sparkles,
    title: 'Show up and make',
    body: 'The address, host contact and a printable invoice live in My bookings. Bring the idea; the room is ready.',
  },
];

export function HowItWorks() {
  return (
    <section className="container py-16 sm:py-20" aria-labelledby="how-it-works-heading">
      <SectionHeading
        index="03"
        eyebrow="How booking works"
        title={
          <span id="how-it-works-heading">
            Four steps from idea <em className="italic text-accent">to making.</em>
          </span>
        }
        description="No agents, no hidden calendars. A direct line between the person with the room and the person with the plan."
      />

      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="group relative overflow-hidden rounded-[1.4rem] border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-canvas text-accent transition group-hover:border-accent/40 group-hover:bg-accent/10">
                <step.icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="font-display text-4xl italic leading-none text-ink/10">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-6 font-display text-[1.3rem] tracking-[-0.02em] text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-full border border-line bg-canvas px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">New here?</span> Walk through the whole flow,
          including how cancellations work.
        </p>
        <Link
          href="/how-it-works"
          className={buttonVariants({ variant: 'outline', size: 'sm', className: 'shrink-0' })}
        >
          Read the full guide
        </Link>
      </div>
    </section>
  );
}
