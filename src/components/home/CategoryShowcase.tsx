import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CATEGORY_CARDS } from '@/lib/constants';

export function CategoryShowcase() {
  return (
    <section className="border-y border-line bg-surface/60" aria-labelledby="categories-heading">
      <div className="container py-16 sm:py-20">
        <SectionHeading
          index="02"
          eyebrow="Find your room"
          title={
            <span id="categories-heading">
              Every kind of <em className="italic text-accent">making.</em>
            </span>
          }
          description="Daylight studios for stills, quiet rooms for voices, wide stages for motion — start with the shape of the work."
          actionLabel="Browse everything"
          actionHref="/studios"
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_CARDS.map((category, index) => (
            <Link
              key={category.name}
              href={`/studios?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-[1.25rem] border border-line bg-canvas"
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907]/92 via-[#0b0907]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="font-display text-[0.68rem] italic text-white/50">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 font-display text-[1.15rem] leading-tight text-white">
                  {category.label}
                </h3>
                <p className="mt-1.5 hidden text-[0.68rem] leading-relaxed text-white/55 sm:block">
                  {category.tagline}
                </p>
                <span className="mt-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-white transition group-hover:border-white group-hover:bg-white group-hover:text-[#14110e]">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
