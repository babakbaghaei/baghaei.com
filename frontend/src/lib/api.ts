'use client';

const getAuthHeader = (): Record<string, string> => {
 if (typeof window === 'undefined') return {};
 try {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
 } catch {
  // localStorage can throw in private mode / when storage is disabled.
  return {};
 }
};

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api/v1';

// Default timeout so a slow/hung backend never freezes the UI indefinitely.
const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
 status: number;
 body: any;
 constructor(message: string, status: number, body: any) {
  super(message);
  this.name = 'ApiError';
  this.status = status;
  this.body = body;
 }
}

async function request<T = any>(
 endpoint: string,
 options: RequestInit = {},
): Promise<T> {
 const controller = new AbortController();
 const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

 try {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
   ...options,
   headers: { ...getAuthHeader(), ...(options.headers || {}) },
   signal: controller.signal,
  });

  // Parse JSON defensively — some responses (204, errors) may have no body.
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
   const message =
    (body && (body.message || body.error)) ||
    `Request failed with status ${res.status}`;
   throw new ApiError(
    Array.isArray(message) ? message.join(', ') : String(message),
    res.status,
    body,
   );
  }

  return body as T;
 } catch (err) {
  if (err instanceof DOMException && err.name === 'AbortError') {
   throw new ApiError('Request timed out', 408, null);
  }
  throw err;
 } finally {
  clearTimeout(timeout);
 }
}

export const api = {
 get<T = any>(endpoint: string) {
  return request<T>(endpoint, { method: 'GET' });
 },

 post<T = any, B = unknown>(endpoint: string, data: B) {
  return request<T>(endpoint, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data),
  });
 },

 put<T = any, B = unknown>(endpoint: string, data: B) {
  return request<T>(endpoint, {
   method: 'PUT',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(data),
  });
 },

 delete<T = any>(endpoint: string) {
  return request<T>(endpoint, { method: 'DELETE' });
 },
};
