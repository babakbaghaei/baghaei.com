import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'حیوان سال تولد',
  description: 'حیوان سال تولد شما در گاه‌شماری دوازده‌حیوانی (طالع چینی/ترکی) و ویژگی‌های منسوب به آن.',
  alternates: { canonical: '/tools/hayvan-sal' },
};

export default function Page() {
  return <Client />;
}
