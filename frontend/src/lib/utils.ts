import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    completed: 'badge-success',
    delivered: 'badge-success',
    confirmed: 'badge-success',
    review: 'badge-gold',
    scheduled: 'badge-info',
    quoted: 'badge-info',
    in_progress: 'badge-warning',
    cancelled: 'badge-danger',
    no_show: 'badge-danger',
  };
  return map[status] || 'badge-info';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: 'Planlandı',
    confirmed: 'Onaylandı',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
    no_show: 'Gelmedi',
    quoted: 'Teklif',
    review: 'İncelemede',
    delivered: 'Teslim Edildi',
  };
  return labels[status] || status;
}

export function getSessionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    recording: 'Kayıt',
    mixing: 'Mix',
    mastering: 'Mastering',
    rehearsal: 'Prova',
    podcast: 'Podcast',
  };
  return labels[type] || type;
}

export function getRoomTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    live: 'Canlı Kayıt',
    vocal: 'Vokal Kabini',
    mix: 'Mix Odası',
    mastering: 'Mastering',
    podcast: 'Podcast',
  };
  return labels[type] || type;
}

export function getDeliveryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    mix: 'Mix',
    master: 'Master',
    stems: 'Stems',
    demo: 'Demo',
    podcast_edit: 'Podcast Düzenleme',
  };
  return labels[type] || type;
}

export function getEquipmentCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    microphone: 'Mikrofon',
    interface: 'Arayüz',
    monitor: 'Monitör',
    preamp: 'Preamp',
    instrument: 'Enstrüman',
    headphone: 'Kulaklık',
    other: 'Diğer',
  };
  return labels[category] || category;
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    excellent: 'Mükemmel',
    good: 'İyi',
    fair: 'Orta',
    needs_repair: 'Onarım Gerekli',
  };
  return labels[condition] || condition;
}

export function getDeliveryStatusLabel(status: string): string {
  return getStatusLabel(status);
}
