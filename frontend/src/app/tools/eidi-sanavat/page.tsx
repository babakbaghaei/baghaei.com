import type { Metadata } from 'next';
import ToolLockedScreen from '@/components/tools/ToolLockedScreen';

// NOTE: قفل موقت — این ابزار تا اعلام نهایی قانون کار/حداقل دستمزد غیرفعال است.
// ماشین‌حساب در ./Client.tsx دست‌نخورده باقی مانده؛ برای فعال‌سازی دوباره کافی است
// به جای ToolLockedScreen دوباره <Client /> رندر شود و status ابزار از 'soon' خارج شود.
export const metadata: Metadata = {
  title: 'عیدی و سنوات',
  description:
    'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
  alternates: { canonical: '/tools/eidi-sanavat' },
};

export default function Page() {
  return <ToolLockedScreen slug="eidi-sanavat" />;
}
