import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'PRD Generator & Agreement Builder',
  description: 'AI-assisted product requirement document (PRD) generation and agreement building',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
