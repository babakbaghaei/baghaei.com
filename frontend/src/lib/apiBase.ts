// Single source of truth for backend URLs. Tolerates env values that mistakenly
// include a trailing slash or an `/api/v1` suffix, so callers never double-prefix.
export function normalizeApiOrigin(raw?: string | null): string {
  const fallback = 'http://127.0.0.1:8000';
  let v = (raw && raw.trim()) || fallback;
  v = v.replace(/\/+$/, ''); // drop trailing slashes
  v = v.replace(/\/api\/v1$/i, ''); // drop an accidental /api/v1 suffix
  return v;
}

export function apiV1Url(path: string, raw?: string | null): string {
  const origin = normalizeApiOrigin(raw);
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin}/api/v1${p}`;
}
