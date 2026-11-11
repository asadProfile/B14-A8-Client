'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'group relative grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-accent/50 hover:text-accent',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute h-[1.1rem] w-[1.1rem] transition-all duration-300',
          mounted && isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
        strokeWidth={1.8}
      />
      <Moon
        className={cn(
          'absolute h-[1.1rem] w-[1.1rem] transition-all duration-300',
          mounted && isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
        strokeWidth={1.8}
      />
      <span className="sr-only">Toggle colour theme</span>
    </button>
  );
}
