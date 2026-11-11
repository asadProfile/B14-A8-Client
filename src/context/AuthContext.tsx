'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '@/lib/api';
import type { LoginInput, RegisterInput, User } from '@/lib/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  wishlist: string[];
  wishlistLoading: boolean;
  login: (input: LoginInput) => Promise<{ user: User; message: string }>;
  register: (input: RegisterInput) => Promise<{ user: User; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (studioId: string) => Promise<{ saved: boolean; requiresAuth?: boolean }>;
  isSaved: (studioId: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    setWishlistLoading(true);
    try {
      const data = await api.wishlist.list();
      setWishlist(data.studioIds ?? []);
    } catch {
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.auth.me();
      setUser(data.user);
      if (data.user) await refreshWishlist();
      else setWishlist([]);
    } catch {
      setUser(null);
    }
  }, [refreshWishlist]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.auth.me();
        if (!active) return;
        setUser(data.user);
        if (data.user) {
          const saved = await api.wishlist.list().catch(() => null);
          if (active && saved) setWishlist(saved.studioIds ?? []);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const data = await api.auth.login(input);
      setUser(data.user);
      await refreshWishlist();
      return { user: data.user, message: data.message };
    },
    [refreshWishlist],
  );

  const register = useCallback(async (input: RegisterInput) => {
    const data = await api.auth.register(input);
    return { user: data.user, message: data.message };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setWishlist([]);
    }
  }, []);

  const toggleWishlist = useCallback(
    async (studioId: string) => {
      if (!user) return { saved: false, requiresAuth: true };
      const result = await api.wishlist.toggle(studioId);
      setWishlist((current) =>
        result.saved
          ? Array.from(new Set([...current, studioId]))
          : current.filter((id) => id !== studioId),
      );
      return { saved: result.saved };
    },
    [user],
  );

  const isSaved = useCallback(
    (studioId: string) => wishlist.includes(studioId),
    [wishlist],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      wishlist,
      wishlistLoading,
      login,
      register,
      logout,
      refreshUser,
      refreshWishlist,
      toggleWishlist,
      isSaved,
    }),
    [
      user,
      loading,
      wishlist,
      wishlistLoading,
      login,
      register,
      logout,
      refreshUser,
      refreshWishlist,
      toggleWishlist,
      isSaved,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
