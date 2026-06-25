import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'فاصلهٔ بین دو تاریخ',
  description:
    'محاسبهٔ تعداد روز، هفته، ماه و سال بین دو تاریخ شمسی یا میلادی.',
  alternates: { canonical: '/tools/faseleh-tarikh' },
};

export default function Page() {
  return <Client />;
}
