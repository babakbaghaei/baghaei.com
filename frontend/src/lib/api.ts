'use client';

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async get(endpoint: string) {
    const res = await fetch(`https://api.baghaei.com${endpoint}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`https://api.baghaei.com${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(`https://api.baghaei.com${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async delete(endpoint: string) {
    const res = await fetch(`https://api.baghaei.com${endpoint}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },
};
