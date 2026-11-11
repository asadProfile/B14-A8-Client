export type User = {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  provider: 'credentials' | 'google';
  createdAt: string;
};

export type StudioCategory =
  | 'Photo Studio'
  | 'Sound Stage'
  | 'Podcast Room'
  | 'Music Suite'
  | 'Art Workshop'
  | 'Event Space';

export type Studio = {
  id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  imageURL: string;
  images: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhoto: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type StudioSnapshot = {
  title: string;
  imageURL: string;
  category: StudioCategory;
  location: string;
};

export type Booking = {
  id: string;
  studioId: string;
  studioSnapshot: StudioSnapshot;
  userEmail: string;
  userName: string;
  ownerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  subtotal: number;
  serviceFee: number;
  securityDeposit: number;
  total: number;
  note: string;
  status: BookingStatus;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  studioId: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSummary = {
  rating: number;
  reviewCount: number;
  distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
};

export type StudioFilters = {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'top-rated' | 'newest' | 'price-asc' | 'price-desc';
  page?: number;
  limit?: number;
};

export type ApiErrorPayload = {
  message: string;
  details?: { field: string; message: string }[];
};
