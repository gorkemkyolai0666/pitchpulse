const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4039/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pitchpulse_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('pitchpulse_token');
    localStorage.removeItem('pitchpulse_user');
    window.location.href = '/login';
    throw new Error('Oturum süresi doldu');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => fetchAPI('/health'),

  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; studioName: string; city?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  me: () => fetchAPI('/auth/me'),

  getStudio: () => fetchAPI('/studio'),
  updateStudio: (data: Record<string, unknown>) =>
    fetchAPI('/studio', { method: 'PATCH', body: JSON.stringify(data) }),

  dashboardStats: () => fetchAPI('/dashboard/stats'),

  getClients: () => fetchAPI('/clients'),
  getClient: (id: string) => fetchAPI(`/clients/${id}`),
  createClient: (data: Record<string, unknown>) => fetchAPI('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: Record<string, unknown>) => fetchAPI(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteClient: (id: string) => fetchAPI(`/clients/${id}`, { method: 'DELETE' }),

  getStudioRooms: () => fetchAPI('/studio-rooms'),
  createStudioRoom: (data: Record<string, unknown>) => fetchAPI('/studio-rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateStudioRoom: (id: string, data: Record<string, unknown>) => fetchAPI(`/studio-rooms/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getEquipments: () => fetchAPI('/equipment'),
  createEquipment: (data: Record<string, unknown>) => fetchAPI('/equipment', { method: 'POST', body: JSON.stringify(data) }),
  updateEquipment: (id: string, data: Record<string, unknown>) => fetchAPI(`/equipment/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEquipment: (id: string) => fetchAPI(`/equipment/${id}`, { method: 'DELETE' }),

  getDeliveries: () => fetchAPI('/deliveries'),
  createDelivery: (data: Record<string, unknown>) => fetchAPI('/deliveries', { method: 'POST', body: JSON.stringify(data) }),
  updateDelivery: (id: string, data: Record<string, unknown>) => fetchAPI(`/deliveries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getSessions: () => fetchAPI('/sessions'),
  createSession: (data: Record<string, unknown>) => fetchAPI('/sessions', { method: 'POST', body: JSON.stringify(data) }),
  updateSession: (id: string, data: Record<string, unknown>) => fetchAPI(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteSession: (id: string) => fetchAPI(`/sessions/${id}`, { method: 'DELETE' }),
};
