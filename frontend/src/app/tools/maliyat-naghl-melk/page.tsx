import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مالیات نقل‌وانتقال ملک',
  description:
    'برآورد مالیات نقل‌وانتقال املاک بر اساس ارزش معاملاتی و نرخ قابل تنظیم.',
  alternates: { canonical: '/tools/maliyat-naghl-melk' },
};

export default function Page() {
  return <Client />;
}
