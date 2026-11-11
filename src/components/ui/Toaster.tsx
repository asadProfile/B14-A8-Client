'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '@/context/ThemeProvider';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      closeButton
      richColors={false}
      duration={4200}
      toastOptions={{
        className: 'font-sans',
      }}
    />
  );
}
