import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مهلت‌های قانونی و مبدل تاریخ',
  description:
    'محاسبهٔ آخرین مهلت اعتراض و تجدیدنظر بر مبنای تاریخ ابلاغ، و تبدیل تاریخ شمسی، میلادی و قمری.',
  alternates: { canonical: '/tools/mohlat-ghanuni' },
};

export default function Page() {
  return <Client />;
}
