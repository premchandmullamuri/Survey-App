const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export type Credentials = { email: string; password: string };

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token: string | null) {
  if (!token) localStorage.removeItem('token');
  else localStorage.setItem('token', token);
}

async function http(path: string, init?: RequestInit) {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) headers['Authorization'] = 'Bearer ' + t;
  const res = await fetch(BASE + path, { ...init, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || res.statusText);
  }
  return res.json();
}

export const api = {
  register: (c: Credentials) => http('/api/auth/register', { method: 'POST', body: JSON.stringify(c) }),
  login: (c: Credentials) => http('/api/auth/login', { method: 'POST', body: JSON.stringify(c) }),
  me: () => http('/api/auth/me'),
  listSurveys: () => http('/api/surveys'),
  getSurvey: (id: number) => http('/api/surveys/' + id),
  submit: (payload: any) => http('/api/responses', { method: 'POST', body: JSON.stringify(payload) }),
  myResponses: (surveyId?: number) => http('/api/responses/me' + (surveyId ? `?surveyId=${surveyId}` : ''))
}