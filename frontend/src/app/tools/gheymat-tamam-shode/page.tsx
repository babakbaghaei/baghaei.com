import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'قیمت تمام‌شده و سود',
  description:
    'محاسبهٔ قیمت فروش، حاشیهٔ سود و نقطهٔ سربه‌سر بر اساس بهای تمام‌شده و درصد سود.',
  alternates: { canonical: '/tools/gheymat-tamam-shode' },
};

export default function Page() {
  return <Client />;
}
