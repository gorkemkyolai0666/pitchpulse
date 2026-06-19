'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ background: 'rgba(244, 243, 255, 0.85)', borderColor: 'var(--border-color)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))', color: 'white' }}
            >
              P
            </div>
            <div>
              <span className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                PitchPulse
              </span>
              <p className="text-[10px] tracking-widest uppercase leading-none" style={{ color: 'var(--text-muted)' }}>
                Kayıt Stüdyosu
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm hidden sm:inline-flex px-4 py-2 rounded-lg font-medium border transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              Giriş Yap
            </Link>
            <Link href="/register" className="btn-primary text-sm">Kayıt Ol</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at 70% 20%, rgba(168, 85, 247, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            }}
          />
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
            <div className="max-w-2xl">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-6 font-medium"
                style={{ color: 'var(--accent)' }}
              >
                Kayıt Stüdyosu Yönetim SaaS
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8" style={{ color: 'var(--text-primary)' }}>
                Her seans,<br />
                <span style={{ color: 'var(--accent)' }}>mükemmel bir mix</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--text-muted)' }}>
                Sanatçı yönetiminden stüdyo odası rezervasyonuna, ekipman envanterinden mix/master teslimatına — kayıt stüdyonuzun tüm ritmini tek platformda yönetin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary px-8 py-3 text-base">Stüdyonu Aç</Link>
                <Link
                  href="/login"
                  className="px-8 py-3 text-base rounded-lg font-medium border transition-colors"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Demo Hesap
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  num: '01',
                  title: 'Stüdyo Odaları',
                  desc: 'Live room, vokal kabini ve mix suite odalarınızı saatlik ücret ve kapasite bilgisiyle yönetin.',
                },
                {
                  num: '02',
                  title: 'Ekipman Envanteri',
                  desc: 'Mikrofon, arayüz, monitör ve preamp envanterinizi seri numarası ve durum bilgisiyle takip edin.',
                },
                {
                  num: '03',
                  title: 'Seans & Teslimat',
                  desc: 'Kayıt seanslarını planlayın, mix/master teslimatlarını takip edin, sanatçılarınızı tek panelden yönetin.',
                },
              ].map((item) => (
                <article key={item.num}>
                  <span
                    className="font-display text-4xl font-bold block mb-4"
                    style={{ color: 'var(--border-color)' }}
                  >
                    {item.num}
                  </span>
                  <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div
            className="rounded-2xl p-10 md:p-16 text-center glow-card"
            style={{ background: 'linear-gradient(135deg, var(--void) 0%, var(--void-light) 100%)' }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--surface)' }}>
              Kayıt stüdyonuzu dijitalleştirmeye hazır mısınız?
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-nav-muted)' }}>
              Ücretsiz kayıt olun ve stüdyonuzu dakikalar içinde yönetmeye başlayın.
            </p>
            <Link href="/register" className="btn-primary inline-block px-10 py-3">
              Hemen Başlayın
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
        PitchPulse &copy; 2026 — Kayıt stüdyosu yönetim platformu
      </footer>
    </div>
  );
}
