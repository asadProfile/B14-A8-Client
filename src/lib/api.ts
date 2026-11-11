import type {
  Booking,
  BookingInput,
  LoginInput,
  Pagination,
  RegisterInput,
  Review,
  ReviewInput,
  ReviewSummary,
  Studio,
  StudioFilters,
  StudioPayload,
  User,
} from './types';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];

  constructor(message: string, status: number, details?: { field: string; message: string }[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, ...init } = options;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(headers as Record<string, string> | undefined),
      },
      body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError(
      'Could not reach the StudioSpace service. Check your connection and try again.',
      0,
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || `The request failed (${response.status}). Please try again.`,
      response.status,
      data?.details,
    );
  }

  return data as T;
}

const queryString = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : '';
};

export const api = {
  auth: {
    register: (input: RegisterInput) =>
      request<{ success: boolean; message: string; user: User }>('/auth/register', {
        method: 'POST',
        body: input,
      }),
    login: (input: LoginInput) =>
      request<{ success: boolean; message: string; user: User }>('/auth/login', {
        method: 'POST',
        body: input,
      }),
    logout: () =>
      request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
    me: () =>
      request<{ success: boolean; user: User | null }>('/auth/me', {
        cache: 'no-store',
      }),
  },

  studios: {
    list: (filters: StudioFilters = {}) =>
      request<{ success: boolean; studios: Studio[]; pagination: Pagination }>(
        `/studios${queryString(filters as Record<string, string | number | undefined>)}`,
        { cache: 'no-store' },
      ),
    featured: () =>
      request<{ success: boolean; studios: Studio[] }>('/studios/featured', {
        cache: 'no-store',
      }),
    detail: (id: string) =>
      request<{ success: boolean; studio: Studio; related: Studio[] }>(`/studios/${id}`, {
        cache: 'no-store',
      }),
    mine: () =>
      request<{ success: boolean; studios: Studio[] }>('/studios/mine', { cache: 'no-store' }),
    create: (payload: StudioPayload) =>
      request<{ success: boolean; message: string; studio: Studio }>('/studios', {
        method: 'POST',
        body: payload,
      }),
    update: (id: string, payload: Partial<StudioPayload>) =>
      request<{ success: boolean; message: string; studio: Studio }>(`/studios/${id}`, {
        method: 'PATCH',
        body: payload,
      }),
    remove: (id: string) =>
      request<{ success: boolean; message: string }>(`/studios/${id}`, { method: 'DELETE' }),
  },

  reviews: {
    list: (studioId: string) =>
      request<{
        success: boolean;
        reviews: Review[];
        myReview: Review | null;
        summary: ReviewSummary;
      }>(`/studios/${studioId}/reviews`, { cache: 'no-store' }),
    create: (studioId: string, input: ReviewInput) =>
      request<{ success: boolean; message: string; review: Review; summary: ReviewSummary }>(
        `/studios/${studioId}/reviews`,
        { method: 'POST', body: input },
      ),
    remove: (studioId: string, reviewId: string) =>
      request<{ success: boolean; message: string; summary: ReviewSummary }>(
        `/studios/${studioId}/reviews/${reviewId}`,
        { method: 'DELETE' },
      ),
  },

  bookings: {
    create: (input: BookingInput) =>
      request<{ success: boolean; message: string; booking: Booking }>('/bookings', {
        method: 'POST',
        body: input,
      }),
    mine: () =>
      request<{ success: boolean; bookings: Booking[] }>('/bookings/mine', { cache: 'no-store' }),
    host: () =>
      request<{ success: boolean; bookings: Booking[] }>('/bookings/host', { cache: 'no-store' }),
    cancel: (id: string) =>
      request<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/cancel`, {
        method: 'PATCH',
      }),
    confirm: (id: string) =>
      request<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/confirm`, {
        method: 'PATCH',
      }),
    complete: (id: string) =>
      request<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/complete`, {
        method: 'PATCH',
      }),
  },

  wishlist: {
    list: () =>
      request<{ success: boolean; studios: Studio[]; studioIds: string[] }>('/wishlist', {
        cache: 'no-store',
      }),
    toggle: (studioId: string) =>
      request<{ success: boolean; saved: boolean; message: string }>(`/wishlist/${studioId}`, {
        method: 'POST',
      }),
    remove: (studioId: string) =>
      request<{ success: boolean; saved: boolean; message: string }>(`/wishlist/${studioId}`, {
        method: 'DELETE',
      }),
  },

  upload: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return request<{ success: boolean; url: string; provider: string; message: string }>(
      '/upload',
      { method: 'POST', body: form },
    );
  },
};

export type { Pagination, Studio, Booking, Review, User };
