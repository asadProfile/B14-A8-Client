'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 'photo',
    index: '01',
    category: 'Photo Studio',
    image:
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=2000&q=85',
    location: 'Bushwick, Brooklyn',
    title: (
      <>
        Make something
        <br />
        worth <em className="font-normal italic text-[#f2a97e]">the light.</em>
      </>
    ),
    description:
      'Daylight lofts, seamless cyc walls and rooms that already have the gear. Find the space; bring the idea.',
    rate: 'From $55 / hr',
    rating: '4.9 average rating',
    detail: '12 people · natural light',
  },
  {
    id: 'stage',
    index: '02',
    category: 'Sound Stage',
    image:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=2000&q=85',
    location: 'Greenpoint, Brooklyn',
    title: (
      <>
        Big rooms.
        <br />
        <em className="font-normal italic text-[#f2a97e]">Bigger ideas.</em>
      </>
    ),
    description:
      'Clear-span stages with drive-in freight access, serious power and the quiet a real production needs.',
    rate: 'From $140 / hr',
    rating: '4.9 average rating',
    detail: '40 people · green screen',
  },
  {
    id: 'podcast',
    index: '03',
    category: 'Podcast Room',
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=2000&q=85',
    location: 'SoHo, Manhattan',
    title: (
      <>
        Press record on
        <br />
        your next <em className="font-normal italic text-[#f2a97e]">chapter.</em>
      </>
    ),
    description:
      'Treated booths, broadcast-grade mics and a guest lounge that makes the conversation easy.',
    rate: 'From $55 / hr',
    rating: '4.8 average rating',
    detail: '4 people · treated room',
  },
];

export function HeroSlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Featured studio stories" className="container pt-5 sm:pt-7">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#14110e] text-white shadow-lift sm:rounded-[2.25rem]">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={900}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          pagination={{ el: '#hero-pagination', clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
          className="hero-swiper h-[36rem] sm:h-[39rem] lg:h-[42rem]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-[36rem] overflow-hidden sm:h-[39rem] lg:h-[42rem]">
                <img
                  src={slide.image}
                  alt={`${slide.category} in ${slide.location}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0907]/92 via-[#0b0907]/55 to-[#0b0907]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907]/85 via-transparent to-[#0b0907]/35" />

                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 sm:p-7">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                    Creative spaces, by the hour
                  </span>
                  <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.68rem] font-medium text-white/75 backdrop-blur-md sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    New York · booking now
                  </span>
                </div>

                <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-5 pt-28 sm:px-8 sm:pb-7 lg:px-12 lg:pb-8">
                  <div className="max-w-2xl animate-fade-up">
                    <div className="mb-4 flex items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white/60">
                      <span className="text-[#f2a97e]">{slide.index}</span>
                      <span className="h-px w-7 bg-white/25" />
                      {slide.category} · {slide.location}
                    </div>
                    <h1 className="display text-[2.75rem] leading-[0.94] text-[#fdf8ee] sm:text-[3.9rem] lg:text-[5rem]">
                      {slide.title}
                    </h1>
                    <p className="mt-5 max-w-lg text-[0.93rem] leading-relaxed text-white/65">
                      {slide.description}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-2.5">
                      <Link
                        href="/studios"
                        className={cn(buttonVariants({ variant: 'light', size: 'lg' }), 'group')}
                      >
                        Explore studios
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                      </Link>
                      <Link
                        href="/add-studio"
                        className={buttonVariants({ variant: 'glass', size: 'lg' })}
                      >
                        Host your space
                      </Link>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] font-medium text-white/55">
                      <span>{slide.rate}</span>
                      <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                      <span className="inline-flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-[#f2a97e] text-[#f2a97e]" />
                        {slide.rating}
                      </span>
                      <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                      <span>{slide.detail}</span>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-4">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xs italic text-white/55">
                        {String(active + 1).padStart(2, '0')}{' '}
                        <span className="text-white/25">/ 03</span>
                      </span>
                      <div id="hero-pagination" className="flex items-center gap-1.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Previous slide"
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-md transition hover:border-white/50 hover:bg-white/15 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next slide"
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-md transition hover:border-white/50 hover:bg-white/15 hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
