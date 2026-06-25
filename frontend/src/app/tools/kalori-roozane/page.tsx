import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'کالری روزانهٔ موردنیاز',
  description:
    'برآورد کالری پایه (BMR) و کل (TDEE) بر پایهٔ فرمول میفلین-سنت‌جئور و سطح فعالیت.',
  alternates: { canonical: '/tools/kalori-roozane' },
};

export default function Page() {
  return <Client />;
}
