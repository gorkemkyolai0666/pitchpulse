'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { formatCurrency, getRoomTypeLabel } from '@/lib/utils';

interface StudioRoom {
  id: string;
  name: string;
  roomType: string;
  hourlyRate: number;
  capacity: number;
  description?: string;
}

const emptyForm = {
  name: '',
  roomType: 'live',
  hourlyRate: '1500',
  capacity: '4',
  description: '',
};

export default function StudioRoomsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<StudioRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadRooms = () => {
    setLoading(true);
    api.getStudioRooms()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadRooms(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createStudioRoom({
        name: form.name,
        roomType: form.roomType,
        hourlyRate: parseFloat(form.hourlyRate) || 1500,
        capacity: parseInt(form.capacity, 10) || 4,
        description: form.description || undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadRooms();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = rooms.filter((r) =>
    `${r.name} ${getRoomTypeLabel(r.roomType)}`.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <BottomNavLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Stüdyo Odaları</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{rooms.length} kayıtlı oda</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          {showForm ? 'İptal' : 'Yeni Oda'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Stüdyo Odası</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Oda adı *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} className="input-field">
              <option value="live">Canlı Kayıt</option>
              <option value="vocal">Vokal Kabini</option>
              <option value="mix">Mix Odası</option>
              <option value="mastering">Mastering</option>
              <option value="podcast">Podcast</option>
            </select>
            <input type="number" placeholder="Saatlik ücret (₺)" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} className="input-field" />
            <input type="number" placeholder="Kapasite (kişi)" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input-field" />
            <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field md:col-span-2 min-h-[80px]" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Oda ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Oda ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen oda bulunamadı' : 'Henüz stüdyo odası bulunmuyor'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((room) => (
            <div key={room.id} className="glow-card">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{room.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {getRoomTypeLabel(room.roomType)}
                  </p>
                </div>
                <span className="badge-gold text-xs shrink-0">{formatCurrency(room.hourlyRate)}/saat</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Kapasite</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{room.capacity} kişi</span>
                </div>
                <div>
                  <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Saatlik</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(room.hourlyRate)}</span>
                </div>
              </div>
              {room.description && (
                <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  {room.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </BottomNavLayout>
  );
}
