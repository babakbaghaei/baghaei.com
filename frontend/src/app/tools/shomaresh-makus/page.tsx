import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'شمارش معکوس رویداد',
  description:
    'شمارش معکوس زندهٔ روز، ساعت، دقیقه و ثانیه تا یک تاریخ و زمان مشخص.',
  alternates: { canonical: '/tools/shomaresh-makus' },
};

export default function Page() {
  return <Client />;
}
