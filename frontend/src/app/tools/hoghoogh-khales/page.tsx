import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'حقوق خالص (خالص دریافتی)',
  description:
    'محاسبهٔ خالص دریافتی از حقوق ناخالص با کسر سهم بیمه و مالیات حقوق پلکانی.',
  alternates: { canonical: '/tools/hoghoogh-khales' },
};

export default function Page() {
  return <Client />;
}
