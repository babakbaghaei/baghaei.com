import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'تاس بینداز',
  description: 'تاس بیندازید؛ از یک تا چند تاس هم‌زمان، با جمع خودکار و تاریخچهٔ پرتاب‌ها.',
  alternates: { canonical: '/tools/tas' },
};

export default function Page() {
  return <Client />;
}
