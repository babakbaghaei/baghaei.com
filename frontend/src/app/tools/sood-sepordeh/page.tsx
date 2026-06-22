import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'سود سپرده و سرمایه‌گذاری',
  description:
    'برآورد سود ساده و مرکب سپردهٔ بانکی و رشد سرمایه در طول زمان با نرخ و دورهٔ دلخواه.',
  alternates: { canonical: '/tools/sood-sepordeh' },
};

export default function Page() {
  return <Client />;
}
