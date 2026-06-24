import type { Metadata } from 'next';
import ToolLockedScreen from '@/components/tools/ToolLockedScreen';

// NOTE: قفل موقت — این ابزار تا تأیید نرخ رسمی بانک مرکزی غیرفعال است. ماشین‌حساب
// در ./Client.tsx دست‌نخورده باقی مانده؛ برای فعال‌سازی دوباره کافی است به جای
// ToolLockedScreen دوباره <Client /> رندر شود و status ابزار از 'soon' خارج شود.
export const metadata: Metadata = {
  title: 'خسارت تأخیر تأدیه',
  description:
    'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
  alternates: { canonical: '/tools/khesarat-takhir' },
};

export default function Page() {
  return <ToolLockedScreen slug="khesarat-takhir" />;
}
