import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'وزن ایده‌آل',
  description:
    'برآورد محدودهٔ وزن سالم بر پایهٔ قد (شاخص تودهٔ بدنی) و فرمول‌های مرجع.',
  alternates: { canonical: '/tools/vazn-ideal' },
};

export default function Page() {
  return <Client />;
}
