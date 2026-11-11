import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/Toaster';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'StudioSpace — Space to make. Time to create.',
    template: '%s · StudioSpace',
  },
  description:
    'Discover and book photography studios, sound stages, podcast rooms, music suites and art workshops by the hour. Peer-to-peer creative spaces, transparent pricing and instant booking requests.',
  keywords: [
    'studio rental',
    'photography studio',
    'sound stage',
    'podcast room',
    'music studio',
    'creative workspace',
  ],
  openGraph: {
    title: 'StudioSpace — Space to make. Time to create.',
    description:
      'A peer-to-peer marketplace for creative studios, stages and rooms, booked by the hour.',
    type: 'website',
    url: siteUrl,
    siteName: 'StudioSpace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudioSpace — Space to make. Time to create.',
    description:
      'A peer-to-peer marketplace for creative studios, stages and rooms, booked by the hour.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0e0c' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const themeScript = `(function(){try{var stored=localStorage.getItem('studiosspace-theme');var dark=stored?stored==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var root=document.documentElement;root.classList.toggle('dark',dark);root.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${display.variable} ${sans.variable} grain font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            <a
              href="#main-content"
              className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition focus:translate-y-0"
            >
              Skip to content
            </a>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
