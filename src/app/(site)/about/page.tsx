import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Camera,
  Compass,
  HeartHandshake,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InstagramLogo, XLogo, YoutubeLogo } from '@/components/brand/SocialIcons';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About StudioSpace',
  description:
    'Why StudioSpace exists, how hosts and creators are protected, and the terms behind the platform.',
};

const principles = [
  {
    icon: Camera,
    title: 'The room is the product',
    body: 'No equipment marketplace, no twelve-step checkout. A clear listing, honest photos and the hours you actually need.',
  },
  {
    icon: HeartHandshake,
    title: 'Hosts keep the keys',
    body: 'Every request is a conversation the host chooses to accept. Pending requests never hold a room hostage.',
  },
  {
    icon: ShieldCheck,
    title: 'The calendar protects itself',
    body: 'Confirmed hours are locked and re-checked before approval, so two productions cannot collide in the same room.',
  },
];

const stats = [
  { value: '14', label: 'Seeded spaces' },
  { value: '6', label: 'Studio categories' },
  { value: '5%', label: 'Service fee, in the open' },
  { value: '1', label: 'Host approval per booking' },
];

const terms = [
  {
    title: 'Bookings & availability',
    body: 'A request is not a booking until a host confirms it. StudioSpace rejects any confirmation that overlaps an existing confirmed booking for the same room, date and hours. Session minimums and maximums are shown on each listing and enforced by the API.',
  },
  {
    title: 'Pricing & records',
    body: 'Listings display an hourly rate and any security deposit. A 5% service fee is calculated server-side and itemised before a request is sent. The agreed subtotal, fee, deposit and total are stored with the booking. Confirmed and completed bookings can generate a PDF invoice. This portfolio build does not process card payments.',
  },
  {
    title: 'Cancellations & changes',
    body: 'Guests may cancel a pending request from My bookings at any time at no cost. Confirmed sessions cannot be cancelled in the app; contact the host and hello@studiosspace.com so both parties can agree on next steps. Hosts can mark confirmed sessions complete after they happen.',
  },
  {
    title: 'Listings & reviews',
    body: 'Hosts must describe their space accurately and only mark amenities that are genuinely available. StudioSpace may remove misleading listings. Reviews are written by signed-in members, limited to one per creator per studio, editable later, and hosts cannot review their own space.',
  },
  {
    title: 'Privacy & cookies',
    body: 'Accounts store a name, email, optional photo URL and a hashed password (Google sign-in accounts do not use a password). Authentication uses an HTTPOnly, SameSite cookie that the browser cannot read from JavaScript. We do not sell personal data or use advertising trackers. Uploaded images are stored by the configured upload provider.',
  },
  {
    title: 'About this build',
    body: 'StudioSpace is a full-stack portfolio project built for a web development assignment. The spaces, hosts, reviews and bookings are seeded demonstration data. Do not use it to arrange real, paid productions without an independent agreement.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface/50">
        <div className="container grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">Our story</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">About StudioSpace</span>
            </div>
            <h1 className="mt-4 font-display text-[2.7rem] leading-[0.97] tracking-[-0.035em] text-ink sm:text-[3.7rem]">
              Space to make.
              <br />
              <em className="italic text-accent">Time to create.</em>
            </h1>
            <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-muted">
              Great work rarely starts with more equipment. It starts with the right room for an
              afternoon — a wall of daylight, a quiet booth, a stage with the power already
              installed. StudioSpace exists to make those rooms easier to find and fairer to share.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/studios" className={buttonVariants({ size: 'lg' })}>
                Explore the rooms
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/how-it-works" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                How booking works
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-ink p-6 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl"
            />
            <Sparkles className="h-5 w-5 text-[#f2a97e]" />
            <p className="mt-4 font-display text-[1.35rem] leading-snug text-white/90">
              “The best studio is the one you can actually get into this week, at a rate that does
              not require a producer.”
            </p>
            <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40">
              The StudioSpace brief
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-surface px-5 py-5">
              <dt className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-muted">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-3xl text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container py-10 sm:py-16" aria-labelledby="principles-heading">
        <SectionHeading
          index="01"
          eyebrow="What we believe"
          title={
            <span id="principles-heading">
              Three rules we built <em className="italic text-accent">the product around.</em>
            </span>
          }
          description="Peer to peer only works when both sides can trust the room, the calendar and the record."
        />
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {principles.map((principle, index) => (
            <article
              key={principle.title}
              className="rounded-[1.4rem] border border-line bg-surface p-6"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-canvas text-accent">
                  <principle.icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <span className="font-display text-4xl italic leading-none text-ink/10">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl tracking-[-0.02em] text-ink">
                {principle.title}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/60">
        <div className="container grid gap-10 py-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">02</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">Where we are</span>
            </div>
            <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.03em] text-ink">
              Born in Brooklyn, <em className="italic text-accent">built for everywhere.</em>
            </h2>
            <p className="mt-4 max-w-xl text-[0.92rem] leading-relaxed text-muted">
              The first listings came from photographers, podcasters and stage managers around
              Bushwick and Greenpoint — people who already had a room worth sharing and a calendar
              full of gaps. The model is deliberately local: neighbourhood-level discovery, hosts
              you can actually reach, and hours instead of week-long rentals.
            </p>
            <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-muted">
              The directory spans photo studios, sound stages, podcast rooms, music suites, art
              workshops and event spaces. Every category shares the same rules: honest listing,
              host approval, protected calendar.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.82rem] text-muted">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Brooklyn, New York
              </span>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-ink">
                <Mail className="h-4 w-4 text-accent" />
                {SITE.email}
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-surface p-6">
            <Compass className="h-5 w-5 text-accent" />
            <p className="mt-4 font-display text-xl leading-snug text-ink">
              Looking for a particular shape of room?
            </p>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
              Start with the work, not the listing. Filter by category and let the directory show
              you what is nearby.
            </p>
            <Link
              href="/studios"
              className={buttonVariants({ variant: 'primary', size: 'sm', className: 'mt-4' })}
            >
              Browse by category
            </Link>

            <div className="mt-6 flex items-center gap-2 border-t border-line pt-5">
              <a
                href={SITE.x}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="StudioSpace on X"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="StudioSpace on Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <InstagramLogo className="h-4 w-4" />
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="StudioSpace on YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <YoutubeLogo className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="terms" className="container scroll-mt-24 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">03</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">Terms & privacy</span>
            </div>
            <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.03em] text-ink">
              The fine print, <em className="italic text-accent">without the fog.</em>
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
              These notes describe how the StudioSpace demonstration behaves. They are written to be
              read in one sitting.
            </p>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {terms.map((term) => (
              <article key={term.title} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-display text-lg tracking-[-0.015em] text-ink">{term.title}</h3>
                <p className="mt-2 text-[0.84rem] leading-[1.75] text-muted">{term.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
