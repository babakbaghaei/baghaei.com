import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'تقسیم ارث (سهم‌الارث)',
  description:
    'محاسبهٔ سهم‌الارث وراث طبقهٔ اول (همسر، فرزندان، پدر و مادر) بر پایهٔ فقه امامی و قانون مدنی.',
  alternates: { canonical: '/tools/taghsim-ers' },
};

export default function Page() {
  return <Client />;
}
