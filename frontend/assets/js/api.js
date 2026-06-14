/**
 * api.js — Fetch wrapper مركزي للـ Frontend.
 * يتولى: Base URL، إضافة Authorization header، معالجة الأخطاء.
 */

const API_BASE = 'http://localhost:5000/api';

// ── Token Management ──────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('accessToken');
const setToken = (token) => localStorage.setItem('accessToken', token);
const getRefreshToken = () => localStorage.getItem('refreshToken');
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// ── Core Request Function ─────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // إزالة Content-Type للـ FormData (يضبطها المتصفح تلقائياً)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  // محاولة تجديد الـ token إذا انتهت صلاحيته
  if (res.status === 401) {
    const data = await res.json();
    if (data.expired) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return request(endpoint, options); // إعادة المحاولة
      }
      clearTokens();
      window.location.href = '/admin/';
      return;
    }
  }

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'حدث خطأ غير متوقع');
  }
  return json;
}

async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setToken(data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ── HTTP Method Helpers ────────────────────────────────────────────────────
const api = {
  get: (url) => request(url, { method: 'GET' }),

  post: (url, body) => request(url, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  put: (url, body) => request(url, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  patch: (url, body) => request(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }),

  delete: (url) => request(url, { method: 'DELETE' }),

  // Auth helpers
  setToken,
  getToken,
  setRefreshToken: (t) => localStorage.setItem('refreshToken', t),
  clearTokens,
  isLoggedIn: () => !!getToken(),
};

// ─── API Modules ──────────────────────────────────────────────────────────
api.auth = {
  login:   (email, password) => api.post('/auth/login', { email, password }),
  logout:  ()                => api.post('/auth/logout'),
  me:      ()                => api.get('/auth/me'),
  refresh: (refreshToken)    => api.post('/auth/refresh', { refreshToken }),
};

api.announcements = {
  getAll:  (params = {}) => api.get(`/announcements?${new URLSearchParams(params)}`),
  getAdmin:()            => api.get('/announcements/admin'),
  create:  (form)        => api.post('/announcements', form),
  update:  (id, form)    => api.put(`/announcements/${id}`, form),
  delete:  (id)          => api.delete(`/announcements/${id}`),
};

api.students = {
  register:     (data) => api.post('/students/register', data),
  getAll:       (params = {}) => api.get(`/students?${new URLSearchParams(params)}`),
  updateStatus: (id, status, notes) => api.patch(`/students/${id}/status`, { status, notes }),
};

api.reviews = {
  getApproved: () => api.get('/reviews'),
  create:      (data) => api.post('/reviews', data),
  getAll:      () => api.get('/reviews/admin'),
  approve:     (id) => api.patch(`/reviews/${id}/approve`, {}),
  delete:      (id) => api.delete(`/reviews/${id}`),
};

api.fees = {
  getAll:  () => api.get('/fees'),
  upload:  (form) => api.post('/fees/upload', form),
  delete:  (filename) => api.delete(`/fees/${filename}`),
};

api.social = {
  getAll: () => api.get('/social'),
  create: (data) => api.post('/social', data),
  delete: (id) => api.delete(`/social/${id}`),
  sync:   () => api.post('/social/sync', {}),
};

api.settings = {
  getPublic: () => api.get('/settings/public'),
  update:    (key, value) => api.put(`/settings/${key}`, { value }),
};
