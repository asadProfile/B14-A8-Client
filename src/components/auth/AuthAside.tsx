import Link from 'next/link';
import { ArrowUpRight, Quote } from 'lucide-react';

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden rounded-[1.75rem] bg-[#14110e] text-white lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85"
        alt="A warm creative studio with a long table and natural light"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907]/95 via-[#0b0907]/45 to-[#0b0907]/25" />
      <div className="relative flex h-full min-h-[36rem] flex-col justify-between p-8 xl:p-10">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
            Peer-to-peer studios
          </span>
          <span className="inline-flex items-center gap-2 text-[0.68rem] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            14 rooms live in NYC
          </span>
        </div>

        <div className="max-w-md">
          <Quote className="h-6 w-6 text-[#f2a97e]" />
          <blockquote className="mt-4 font-display text-[1.8rem] leading-[1.15] text-[#fdf8ee] xl:text-[2.15rem]">
            “We shot the whole lookbook in one afternoon. The room did half the work.”
          </blockquote>
          <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/45">
            Priya Nair · Photographer, Brooklyn
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[0.72rem] text-white/55">
            <span>By the hour</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>Reviewed by creators</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>Host-approved</span>
          </div>
        </div>

        <Link
          href="/studios"
          className="group inline-flex w-fit items-center gap-2 text-xs font-semibold text-white/70 transition hover:text-white"
        >
          Browse the rooms
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/25 transition group-hover:rotate-45">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </aside>
  );
}
