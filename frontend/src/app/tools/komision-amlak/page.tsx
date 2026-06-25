import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'کمیسیون مشاور املاک',
  description:
    'محاسبهٔ حق‌الزحمهٔ بنگاه برای معاملات خرید/فروش و رهن و اجاره با نرخ قابل تنظیم.',
  alternates: { canonical: '/tools/komision-amlak' },
};

export default function Page() {
  return <Client />;
}
