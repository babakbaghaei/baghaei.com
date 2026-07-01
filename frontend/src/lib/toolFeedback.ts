'use client';

// کلاینتِ «دیدگاه/امتیاز/گزارش ابزار» (R23). بک‌اند پاسخ‌ها را در پاکتِ
// { data, meta } می‌پیچد (TransformInterceptor)، پس این‌جا فقط data را برمی‌گردانیم.
import { api } from './api';

export interface ToolReview {
  id: number;
  toolSlug: string;
  name: string | null;
  rating: number;
  body: string | null;
  createdAt: string;
}

export interface ReviewSummary {
  toolSlug: string;
  count: number;
  average: number;
  reviews: ToolReview[];
}

export async function fetchToolReviews(slug: string): Promise<ReviewSummary> {
  const res = await api.get<{ data: ReviewSummary }>(
    `/tool-feedback/reviews/${encodeURIComponent(slug)}`,
  );
  return res.data;
}

export async function submitToolReview(payload: {
  toolSlug: string;
  name?: string;
  rating: number;
  body?: string;
  company?: string; // honeypot — real users leave empty
}): Promise<ToolReview> {
  const res = await api.post<{ data: ToolReview }>(
    '/tool-feedback/reviews',
    payload,
  );
  return res.data;
}

export async function submitToolReport(payload: {
  toolSlug: string;
  issue: string;
  contact?: string;
  company?: string; // honeypot
}): Promise<{ ok: boolean; id?: number }> {
  const res = await api.post<{ data: { ok: boolean; id?: number } }>(
    '/tool-feedback/reports',
    payload,
  );
  return res.data;
}
