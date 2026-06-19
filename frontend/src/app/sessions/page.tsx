'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { formatDateTime, getStatusBadgeClass, getStatusLabel, getSessionTypeLabel } from '@/lib/utils';

interface Client {
  id: string;
  artistName: string;
  contactName?: string;
}

interface Session {
  id: string;
  date: string;
  type: string;
  status: string;
  duration?: number;
  notes?: string;
  engineerName?: string;
  client?: Client;
}

const emptyForm = {
  date: '',
  type: 'recording',
  clientId: '',
  duration: '45',
  notes: '',
  engineerName: '',
};

export default function SessionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getSessions(), api.getClients()])
      .then(([sessionList, clientList]) => {
        setSessions(sessionList);
        setClients(clientList);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createSession({
        clientId: form.clientId,
        date: new Date(form.date).toISOString(),
        type: form.type,
        duration: parseInt(form.duration, 10) || 45,
        notes: form.notes || undefined,
        engineerName: form.engineerName || undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu session seansını silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteSession(id);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setError('');
    try {
      await api.updateSession(id, { status });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Session Seansları</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{sessions.length} seans</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          {showForm ? 'İptal' : 'Yeni Seans'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Session Seansı</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Müşteri *</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="input-field" required>
                <option value="">Seçin</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.artistName}{c.contactName ? ` (${c.contactName})` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Tür</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="recording">Kalite Kontrolü</option>
                <option value="recording">Kayıt</option>
                <option value="mixing">Eğitim</option>
                <option value="podcast">Toptan Ziyaret</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Tarih & Saat *</label>
              <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Süre (dk)</label>
              <input type="number" min="15" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Mühendis</label>
              <input type="text" value={form.engineerName} onChange={(e) => setForm({ ...form, engineerName: e.target.value })} className="input-field" placeholder="Opsiyonel" />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Not</label>
              <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : sessions.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Henüz session seansı bulunmuyor
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {session.client?.artistName || '—'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {getSessionTypeLabel(session.type)} — {formatDateTime(session.date)}
                  {session.duration ? ` · ${session.duration} dk` : ''}
                </div>
                {session.engineerName && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Mühendis: {session.engineerName}</div>
                )}
                {session.notes && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{session.notes}</div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={getStatusBadgeClass(session.status)}>{getStatusLabel(session.status)}</span>
                {session.status === 'scheduled' && (
                  <button onClick={() => handleStatusUpdate(session.id, 'confirmed')} className="btn-primary text-xs px-3 py-1">Onayla</button>
                )}
                {session.status === 'confirmed' && (
                  <button onClick={() => handleStatusUpdate(session.id, 'in_progress')} className="btn-primary text-xs px-3 py-1">Başlat</button>
                )}
                {session.status === 'in_progress' && (
                  <button onClick={() => handleStatusUpdate(session.id, 'completed')} className="btn-primary text-xs px-3 py-1">Tamamla</button>
                )}
                <button onClick={() => handleDelete(session.id)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--danger)' }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </BottomNavLayout>
  );
}
