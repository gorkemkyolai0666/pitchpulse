import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'PitchPulse — Kayıt Stüdyosu Yönetimi',
  description:
    'Sanatçı yönetimi, stüdyo odası rezervasyonu, ekipman envanteri ve mix/master teslimat takibi için kayıt stüdyosu SaaS platformu.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
