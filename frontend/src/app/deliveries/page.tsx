'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { formatCurrency, formatDate, getStatusBadgeClass, getDeliveryStatusLabel, getDeliveryTypeLabel } from '@/lib/utils';

interface Client {
  id: string;
  artistName: string;
  contactName?: string;
}

interface Delivery {
  id: string;
  title: string;
  type: string;
  status: string;
  totalPrice: number;
  paidAmount: number;
  dueDate: string;
  deliveredDate?: string;
  client?: Client;
}

export default function DeliveriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadDeliveries = () => {
    setLoading(true);
    api.getDeliveries()
      .then(setDeliveries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadDeliveries(); }, [user]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setError('');
    try {
      const payload: Record<string, string> = { status };
      if (status === 'delivered') payload.deliveredDate = new Date().toISOString();
      await api.updateDelivery(id, payload);
      loadDeliveries();
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
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Teslimatlar</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{deliveries.length} teslimat kaydı</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : deliveries.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Henüz teslimat kaydı bulunmuyor
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="glow-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {delivery.title || 'İsimsiz Teslimat'}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {delivery.client?.artistName || '—'}
                    {delivery.client?.contactName && ` · ${delivery.client.contactName}`}
                  </div>
                  <div className="text-sm mt-1 flex flex-wrap gap-2 items-center" style={{ color: 'var(--text-muted)' }}>
                    <span className="badge-info">{getDeliveryTypeLabel(delivery.type)}</span>
                    <span>Termin: {formatDate(delivery.dueDate)}</span>
                    {delivery.deliveredDate && <span>· Teslim: {formatDate(delivery.deliveredDate)}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{formatCurrency(delivery.totalPrice)}</span>
                  <span className={getStatusBadgeClass(delivery.status)}>{getDeliveryStatusLabel(delivery.status)}</span>
                  {delivery.status === 'quoted' && (
                    <button onClick={() => handleStatusUpdate(delivery.id, 'in_progress')} className="btn-primary text-xs px-3 py-1">İşleme Al</button>
                  )}
                  {delivery.status === 'in_progress' && (
                    <button onClick={() => handleStatusUpdate(delivery.id, 'review')} className="btn-primary text-xs px-3 py-1">İncelemeye Al</button>
                  )}
                  {delivery.status === 'review' && (
                    <button onClick={() => handleStatusUpdate(delivery.id, 'delivered')} className="btn-primary text-xs px-3 py-1">Teslim Et</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BottomNavLayout>
  );
}
