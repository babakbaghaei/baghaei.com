import { redirect } from 'next/navigation';

// R11 — ابزار «خسارت تأخیر چک برگشتی» حذف شده است. مسیر قدیمی برای حفظ سئو و
// لینک‌های قبلی به جعبه‌ابزار هدایت می‌شود.
export default function RemovedTool() {
  redirect('/tools');
}
