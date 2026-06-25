import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر تخفیف',
  description:
    'محاسبهٔ مبلغ پس از تخفیف، میزان صرفه‌جویی و قیمت نهایی به‌همراه مالیات بر ارزش‌افزوده.',
  alternates: { canonical: '/tools/mohasebe-takhfif' },
};

export default function Page() {
  return <Client />;
}
