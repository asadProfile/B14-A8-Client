type IconProps = { className?: string };

/** The current X brand mark (not the retired Twitter bird). */
export function XLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramLogo({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.6 7.2a2.8 2.8 0 0 0-1.97-1.98C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.47A2.8 2.8 0 0 0 2.4 7.2 29.4 29.4 0 0 0 1.93 12a29.4 29.4 0 0 0 .47 4.8 2.8 2.8 0 0 0 1.97 1.98c1.73.47 7.63.47 7.63.47s5.9 0 7.63-.47a2.8 2.8 0 0 0 1.97-1.98 29.4 29.4 0 0 0 .47-4.8 29.4 29.4 0 0 0-.47-4.8ZM10.1 15.3V8.7l5.2 3.3-5.2 3.3Z" />
    </svg>
  );
}
