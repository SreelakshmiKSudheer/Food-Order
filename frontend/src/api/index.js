// Frontend API helper for Food Order
// Provides a small wrapper around fetch to handle JSON, tokens, and common endpoints.

const BASE_PATH = import.meta.env.VITE_API_BASE || ''; // set VITE_API_BASE in .env if backend runs on different origin

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

async function apiRequest(path, { method = 'GET', body, headers = {}, requireAuth = true } = {}) {
  const url = `${BASE_PATH}${path}`;
  const opts = { method, headers: { ...headers } };

  // Attach JSON body
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  // Attach auth header when token exists
  if (requireAuth) {
    const token = getToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    // not JSON
    data = text;
  }

  if (!res.ok) {
    const error = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    const e = new Error(error);
    e.status = res.status;
    e.data = data;
    throw e;
  }

  return data;
}

// Auth helpers
export async function login(email, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    requireAuth: false
  });

  if (data.token) setToken(data.token);
  return data;
}

export function logout() {
  setToken(null);
  localStorage.removeItem('user');
}

export async function registerByRole(role, payload) {
  // payload should include name, email, password, college, etc.
  return apiRequest(`/api/auth/register/${role}`, {
    method: 'POST',
    body: payload,
    requireAuth: false
  });
}

// Buyer helpers
export async function getItemByName(name) {
  return apiRequest(`/api/buyer/items/search?name=${encodeURIComponent(name)}`, {
    method: 'GET'
  });
}

// Export generic request for other modules
export { apiRequest, getToken, setToken };
