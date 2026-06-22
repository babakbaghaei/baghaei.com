import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر BMI',
  description: 'سنجش شاخص تودهٔ بدنی بر پایهٔ قد و وزن و تعیین محدودهٔ وزن سالم.',
  alternates: { canonical: '/tools/bmi' },
};

export default function Page() {
  return <Client />;
}
