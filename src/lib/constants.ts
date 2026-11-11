import type { StudioCategory } from './types';

export const STUDIO_CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Sound Stage',
  'Podcast Room',
  'Music Suite',
  'Art Workshop',
  'Event Space',
];

export const AMENITY_OPTIONS = [
  'Natural light',
  'Blackout curtains',
  'Cyc wall',
  'Green screen',
  'Lighting kit',
  'Backdrops',
  'Pro audio',
  'Mixing console',
  'Microphones',
  'Instruments',
  'Seating lounge',
  'Makeup room',
  'Wi-Fi',
  'Parking',
  'Freight access',
  'Air conditioning',
  'Kitchenette',
  'Loading dock',
];

const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const CATEGORY_CARDS: {
  name: StudioCategory;
  label: string;
  tagline: string;
  image: string;
}[] = [
  {
    name: 'Photo Studio',
    label: 'Photo Studios',
    tagline: 'Cyc walls, daylight and gear-ready rooms',
    image: image('1554941829-202a0b2403b8'),
  },
  {
    name: 'Sound Stage',
    label: 'Sound Stages',
    tagline: 'Clear-span stages with drive-in access',
    image: image('1497366811353-6870744d04b2'),
  },
  {
    name: 'Podcast Room',
    label: 'Podcast Rooms',
    tagline: 'Treated booths with broadcast-grade mics',
    image: image('1589903308904-1010c2294adc'),
  },
  {
    name: 'Music Suite',
    label: 'Music Suites',
    tagline: 'Control rooms and backline included',
    image: image('1598488035139-bdbb2231ce04'),
  },
  {
    name: 'Art Workshop',
    label: 'Art Workshops',
    tagline: 'Mess-friendly tables, light and sinks',
    image: image('1460661419201-fd4cecdf8a8b'),
  },
  {
    name: 'Event Space',
    label: 'Event Spaces',
    tagline: 'Open rooms for launches and screenings',
    image: image('1519167758481-83f550bb49b3'),
  },
];

export const SORT_OPTIONS = [
  { value: 'top-rated', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const;

export const PRICE_BANDS = [
  { value: '', label: 'Any price' },
  { value: '0-60', label: 'Under $60 / hr' },
  { value: '60-100', label: '$60 – $100 / hr' },
  { value: '100-150', label: '$100 – $150 / hr' },
  { value: '150-10000', label: '$150+ / hr' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/studios', label: 'Explore Studios' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About Us' },
] as const;

export const TIME_SLOTS = Array.from({ length: 16 }, (_, index) => {
  const hour = index + 8; // 08:00 → 23:00
  return `${String(hour).padStart(2, '0')}:00`;
});

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

export const SITE = {
  name: 'StudioSpace',
  tagline: 'Space to make. Time to create.',
  email: 'hello@studiosspace.com',
  instagram: 'https://instagram.com',
  x: 'https://x.com',
  youtube: 'https://youtube.com',
};
