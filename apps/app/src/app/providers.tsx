'use client';
import { TooltipProvider } from 'ui';
import { ThemeProvider } from '../components/layouts/ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      storageKey='theme'
    >
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
