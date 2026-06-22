import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر درصد',
  description:
    'محاسبهٔ سریع انواع درصد: درصدی از یک عدد، تغییر درصدی و نسبت دو عدد به هم.',
  alternates: { canonical: '/tools/mohasebe-darsad' },
};

export default function Page() {
  return <Client />;
}
