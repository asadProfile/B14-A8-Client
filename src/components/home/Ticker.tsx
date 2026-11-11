const items = [
  'Photo studios',
  'Sound stages',
  'Podcast rooms',
  'Music suites',
  'Art workshops',
  'Event spaces',
  'Booked by the hour',
  'Brooklyn · Manhattan · Queens',
];

export function Ticker() {
  return (
    <div className="mt-8 overflow-hidden border-y border-line bg-surface/70 py-4 sm:mt-10">
      <div className="flex w-max animate-marquee items-center gap-9 hover:[animation-play-state:paused]">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-9" aria-hidden={group === 1}>
            {items.map((item) => (
              <span
                key={`${group}-${item}`}
                className="inline-flex items-center gap-9 whitespace-nowrap text-[0.68rem] font-bold uppercase tracking-[0.22em] text-muted"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
