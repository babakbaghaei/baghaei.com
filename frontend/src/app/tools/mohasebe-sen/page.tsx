import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر سن',
  description:
    'محاسبهٔ سن دقیق به سال، ماه و روز، روز هفتهٔ تولد و شمارش معکوس تا تولد بعدی.',
  alternates: { canonical: '/tools/mohasebe-sen' },
};

export default function Page() {
  return <Client />;
}
