'use client';

const getAuthHeader = (): Record<string, string> => {
 if (typeof window === 'undefined') return {};
 const token = localStorage.getItem('admin_token');
 return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api/v1';

export const api = {
 async get(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
   headers: { ...getAuthHeader() },
  });
  return res.json() as Promise<any>;
 },

 async post<T>(endpoint: string, data: T) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
   },
   body: JSON.stringify(data),
  });
  return res.json() as Promise<any>;
 },

 async put<T>(endpoint: string, data: T) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
   method: 'PUT',
   headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
   },
   body: JSON.stringify(data),
  });
  return res.json() as Promise<any>;
 },

 async delete(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
   method: 'DELETE',
   headers: { ...getAuthHeader() },
  });
  return res.json() as Promise<any>;
 },
};