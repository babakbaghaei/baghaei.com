import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر معدل',
  description: 'محاسبهٔ معدل وزنی بر اساس نمرات و واحد/ضریب هر درس.',
  alternates: { canonical: '/tools/moadel' },
};

export default function Page() {
  return <Client />;
}
