'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface StudioProfile {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email: string;
  taxNo: string;
}

const emptyProfile: StudioProfile = {
  id: '',
  name: '',
  address: '',
  city: '',
  district: '',
  phone: '',
  email: '',
  taxNo: '',
};

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<StudioProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .getStudio()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await api.updateStudio({
        name: profile.name,
        address: profile.address,
        city: profile.city,
        district: profile.district,
        phone: profile.phone,
        email: profile.email,
        taxNo: profile.taxNo,
      });
      setProfile(updated);
      setSuccess('Stüdyo profili başarıyla güncellendi.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kayıt sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <BottomNavLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Ayarlar
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
          Stüdyo profil bilgilerinizi yönetin
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
          {success}
        </div>
      )}

      {loading ? (
        <div className="card animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-lg" style={{ background: 'var(--border-color)' }} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSave} className="lg:col-span-2 card space-y-5">
            <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Stüdyo Profili
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Stüdyo Adı
              </label>
              <input
                className="input-field"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Şehir
                </label>
                <input
                  className="input-field"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  İlçe
                </label>
                <input
                  className="input-field"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Adres
              </label>
              <input
                className="input-field"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Telefon
                </label>
                <input
                  className="input-field"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  E-posta
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Vergi No
              </label>
              <input
                className="input-field"
                value={profile.taxNo}
                onChange={(e) => setProfile({ ...profile, taxNo: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary disabled:opacity-50" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </form>

          <div className="space-y-4">
            <div className="glow-card">
              <h3 className="font-display text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Hesap Bilgileri
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Ad Soyad</span>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>E-posta</span>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Rol</span>
                  <p className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{user.role}</p>
                </div>
              </div>
            </div>

            <div className="card text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>
                Demo hesap: <strong style={{ color: 'var(--text-primary)' }}>demo@modastudyo.com</strong>
              </p>
              <p className="mt-2">
                Stüdyo profiliniz fatura ve iletişim bilgilerinde kullanılır.
              </p>
            </div>
          </div>
        </div>
      )}
    </BottomNavLayout>
  );
}
