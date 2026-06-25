import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مبدل تاریخ شمسی، میلادی و قمری',
  description:
    'تبدیل دقیق تاریخ بین تقویم‌های شمسی (جلالی)، میلادی و قمری (هجری قمری).',
  alternates: { canonical: '/tools/tabdil-tarikh' },
};

export default function Page() {
  return <Client />;
}
