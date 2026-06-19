'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { getEquipmentCategoryLabel, getConditionLabel } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  condition: string;
  studioRoom?: { name: string };
}

const emptyForm = {
  name: '',
  category: 'microphone',
  brand: '',
  model: '',
  serialNumber: '',
  condition: 'good',
  notes: '',
};

export default function EquipmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadItems = () => {
    setLoading(true);
    api.getEquipments()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadItems(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createEquipment({
        name: form.name,
        category: form.category,
        brand: form.brand || undefined,
        model: form.model || undefined,
        serialNumber: form.serialNumber || undefined,
        condition: form.condition,
        notes: form.notes || undefined,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadItems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ekipmanı silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteEquipment(id);
      loadItems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = items.filter((item) =>
    `${item.name} ${item.brand} ${item.model} ${item.serialNumber}`.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Ekipman</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{items.length} kayıtlı ekipman</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          {showForm ? 'İptal' : 'Yeni Ekipman'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Ekipman</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Ekipman adı *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              <option value="microphone">Mikrofon</option>
              <option value="interface">Arayüz</option>
              <option value="monitor">Monitör</option>
              <option value="preamp">Preamp</option>
              <option value="instrument">Enstrüman</option>
              <option value="headphone">Kulaklık</option>
              <option value="other">Diğer</option>
            </select>
            <input type="text" placeholder="Marka" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
            <input type="text" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="input-field" />
            <input type="text" placeholder="Seri numarası" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} className="input-field" />
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="input-field">
              <option value="excellent">Mükemmel</option>
              <option value="good">İyi</option>
              <option value="fair">Orta</option>
              <option value="needs_repair">Onarım Gerekli</option>
            </select>
            <textarea placeholder="Notlar" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field md:col-span-2 min-h-[60px]" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Ekipman ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Ekipman ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen ekipman bulunamadı' : 'Henüz ekipman bulunmuyor'}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Ekipman</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Kategori</th>
                <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Seri No</th>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Durum</th>
                <th className="text-right p-4 font-medium" style={{ color: 'var(--text-muted)' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="p-4">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {item.brand} {item.model}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>
                    {getEquipmentCategoryLabel(item.category)}
                  </td>
                  <td className="p-4 hidden md:table-cell font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {item.serialNumber || '—'}
                  </td>
                  <td className="p-4">
                    <span className={item.condition === 'needs_repair' ? 'badge-danger' : 'badge-success'}>
                      {getConditionLabel(item.condition)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-xs" style={{ color: 'var(--danger)' }}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BottomNavLayout>
  );
}
