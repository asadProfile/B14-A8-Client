import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, Lock, Quote, ShieldCheck, Wallet } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const promises = [
  {
    icon: Lock,
    title: 'No double bookings',
    body: 'Every confirmed slot locks the calendar and is re-checked at approval, so two crews never land in the same room.',
  },
  {
    icon: ShieldCheck,
    title: 'Hosts stay in control',
    body: 'You approve who uses your space. Pending requests never block the room until you say yes.',
  },
  {
    icon: Wallet,
    title: 'Clear money, always',
    body: 'Hourly rate, security deposit and the 5% service fee are itemised before anyone commits.',
  },
  {
    icon: BadgeCheck,
    title: 'Reviews that mean something',
    body: 'Feedback comes from signed-in creators with a booking history — no anonymous noise.',
  },
];

export function HostPromise() {
  return (
    <section className="container pb-4" aria-labelledby="host-promise-heading">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#14110e] text-white sm:rounded-[2.25rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        />
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[20rem] overflow-hidden lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
              alt="A host arranging a light-filled studio before a booking"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14110e] via-[#14110e]/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#14110e]/10 lg:to-[#14110e]" />

            <figure className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-[#14110e]/75 p-5 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:max-w-sm">
              <Quote className="h-4 w-4 text-[#f2a97e]" />
              <blockquote className="mt-2.5 font-display text-[1.05rem] leading-snug text-white/90">
                “The room books itself now. I approve the requests I want, and the calendar does
                the rest.”
              </blockquote>
              <figcaption className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/45">
                Maya Chen · Host in Greenpoint
              </figcaption>
            </figure>
          </div>

          <div className="relative p-6 sm:p-9 lg:p-11">
            <div className="flex items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white/50">
              <span className="font-display text-sm italic text-[#f2a97e]">04</span>
              <span className="h-px w-8 bg-white/20" />
              For hosts & creators
            </div>
            <h2
              id="host-promise-heading"
              className="mt-5 max-w-lg font-display text-[2.1rem] leading-[1.03] tracking-[-0.03em] sm:text-[2.7rem]"
            >
              A fairer room <em className="italic text-[#f2a97e]">to make in.</em>
            </h2>
            <p className="mt-4 max-w-lg text-[0.9rem] leading-relaxed text-white/60">
              StudioSpace is peer to peer, which means the person answering your request is the
              person who owns the space. We built the rules to protect both sides of that handshake.
            </p>

            <div className="mt-8 grid gap-x-7 gap-y-6 sm:grid-cols-2">
              {promises.map((promise) => (
                <div key={promise.title}>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-[#f2a97e]">
                    <promise.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-white">{promise.title}</h3>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed text-white/50">
                    {promise.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-6">
              <Link
                href="/add-studio"
                className={cn(buttonVariants({ variant: 'light', size: 'md' }), 'group')}
              >
                List your space
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link href="/how-it-works" className={buttonVariants({ variant: 'glass', size: 'md' })}>
                How it works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
