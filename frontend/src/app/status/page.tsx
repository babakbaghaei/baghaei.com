import type { Metadata } from 'next';
import StatusClient from './StatusClient';

export const metadata: Metadata = {
 title: 'وضعیت استقرار',
 description: 'پیشرفت زنده‌ی استقرار و سلامت سرویس‌های گروه فناوری بقایی.',
 alternates: { canonical: '/status' },
 robots: { index: false, follow: false },
};

// Deploy progress page. Served at /status and via status.baghaei.com (proxy.ts
// rewrites the subdomain here). Polls /deploy-status.json — a small file the
// deploy script rewrites at each stage (fetch → pull → migrate → up → done) —
// and renders a live progress bar, current stage and ETA.
export default function StatusPage() {
 return <StatusClient />;
}
