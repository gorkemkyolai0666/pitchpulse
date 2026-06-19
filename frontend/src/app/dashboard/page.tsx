'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { BottomNavLayout } from '@/components/bottom-nav-layout';
import { formatDateTime, getStatusBadgeClass, getStatusLabel, getSessionTypeLabel } from '@/lib/utils';

interface Client {
  id: string;
  artistName: string;
  contactName: string;
  phone: string;
  notes?: string;
}

interface Session {
  id: string;
  date: string;
  type: string;
  status: string;
  client?: Client;
}

interface DashboardStats {
  totalClients: number;
  todaySessions: number;
  weekSessions: number;
  pendingDeliveries: number;
  readyDeliveries: number;
  needsRepairEquipment: number;
  recentClients?: Client[];
  upcomingSessions?: Session[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.dashboardStats()
        .then(setStats)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

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
          Merhaba, {user.firstName}
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Stüdyonuzun güncel durumu</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 rounded w-20 mb-3" style={{ background: 'var(--border-color)' }} />
              <div className="h-8 rounded w-12" style={{ background: 'var(--border-color)' }} />
            </div>
          ))}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Toplam Sanatçı</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalClients}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bugün Seans</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stats.todaySessions}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Haftalık Seans</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stats.weekSessions}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bekleyen Teslimat</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>{stats.pendingDeliveries}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>İncelemede</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--success)' }}>{stats.readyDeliveries}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Onarım Gerekli</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--danger)' }}>{stats.needsRepairEquipment}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Yaklaşan Seanslar</h2>
                <Link href="/sessions" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Tümü</Link>
              </div>
              {!stats.upcomingSessions?.length ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Yaklaşan seans bulunmuyor</p>
              ) : (
                <div className="space-y-3">
                  {stats.upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {session.client?.artistName || '—'}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {session.client?.contactName && `${session.client.contactName} · `}
                          {getSessionTypeLabel(session.type)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{formatDateTime(session.date)}</div>
                        <span className={getStatusBadgeClass(session.status)}>{getStatusLabel(session.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Son Sanatçılar</h2>
                <Link href="/clients" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Tümü</Link>
              </div>
              {!stats.recentClients?.length ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Henüz sanatçı kaydı bulunmuyor</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {client.artistName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {client.contactName && `${client.contactName} · `}{client.phone}
                        </div>
                      </div>
                      <div className="text-xs text-right max-w-[120px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {client.notes || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </BottomNavLayout>
  );
}
