/**
 * چارچوب مشترک تست‌های شخصیت‌شناسی (R7).
 *
 * هر تست یک شیء PersonalityTest است که داده‌اش کاملاً از منطق نمایش جداست؛ یک
 * «رانر» عمومی (PersonalityRunner) هر تست را از روی همین قرارداد رندر می‌کند.
 * سه حالت نمره‌دهی پشتیبانی می‌شود:
 *   - 'axes'    : تست‌های دوقطبی مثل MBTI (مقایسهٔ دو قطب در هر محور → کد تیپ).
 *   - 'top1'    : یک تیپ غالب از میان چند تیپ (مثل انیاگرام، DISC).
 *   - 'profile' : نیم‌رخ کامل همهٔ ابعاد به‌صورت درصدی (مثل پنج‌عامل، EQ، زبان عشق).
 */

/** نگاشت کلید بُعد → امتیاز. */
export type ScoreMap = Record<string, number>;

export type ScoringMode = 'likert' | 'choice';
export type ResultType = 'axes' | 'top1' | 'profile';

/** یک بُعد/مؤلفهٔ سنجش (مثل برون‌گرایی، یا قطب E در MBTI). */
export interface PDimension {
  key: string;
  /** برچسب فارسی کامل بُعد. */
  label: string;
  /** توضیح کوتاه بُعد. */
  desc?: string;
}

/** محور دوقطبی (فقط برای تست‌های axes مثل MBTI). */
export interface PAxis {
  /** کلید بُعد قطب چپ (مثلاً 'E'). */
  left: string;
  /** کلید بُعد قطب راست (مثلاً 'I'). */
  right: string;
  leftLabel: string;
  rightLabel: string;
}

/** یک گزینهٔ پاسخ در تست‌های choice (هر گزینه امتیاز خودش را دارد). */
export interface PChoice {
  label: string;
  scores: ScoreMap;
}

export interface PQuestion {
  id: number;
  text: string;
  /**
   * حالت likert: کلید بُعدی که این سؤال روی آن بار می‌گذارد. موافقت با سؤال،
   * امتیاز این بُعد را افزایش می‌دهد (مگر reverse=true که معکوس می‌شود).
   */
  dimension?: string;
  /** likert: سؤال معکوس‌نمره (موافقت، امتیاز را کم می‌کند). */
  reverse?: boolean;
  /** حالت choice: گزینه‌های اختصاصی این سؤال با امتیاز هر کدام. */
  options?: PChoice[];
}

/**
 * یک نتیجهٔ ممکن. برای 'axes' کلید = کد کامل تیپ (مثل 'INTJ')؛ برای 'top1' کلید
 * = کلید تیپ غالب؛ برای 'profile' کلید = کلید بُعد (توضیح حالت «بالا» آن بُعد).
 */
export interface PResult {
  key: string;
  title: string;
  summary: string;
  /** نقاط قوت. */
  strengths?: string[];
  /** زمینه‌های رشد / نکات. */
  growth?: string[];
  /** سازگاری، مشاغل پیشنهادی یا توضیح تکمیلی. */
  match?: string;
  /** توضیح حالت «پایین» این بُعد (فقط profile). */
  lowSummary?: string;
}

export interface PersonalityTest {
  slug: string;
  title: string;
  subtitle: string;
  /** پاراگراف معرفی پیش از شروع آزمون. */
  intro: string;
  /** رنگ لهجه «r, g, b». باید با accent همان ابزار در رجیستری یکی باشد. */
  accent: string;
  scoring: ScoringMode;
  /** مقیاس لیکرت (معمولاً ۵ گزینه از کاملاً مخالف تا کاملاً موافق). */
  likertScale?: { label: string; value: number }[];
  dimensions: PDimension[];
  axes?: PAxis[];
  resultType: ResultType;
  questions: PQuestion[];
  results: PResult[];
  /** زمان تقریبی (دقیقه). */
  durationMin?: number;
  /** برای profile: آیا یک «کد» از حروف ابعاد برتر ساخته و نمایش داده شود (هالند). */
  showTopCode?: boolean;
  /** تعداد حروف کد برتر (پیش‌فرض ۳). */
  topCodeLen?: number;
}

/** مقیاس لیکرت ۵تایی استاندارد فارسی — برای تست‌های likert قابل استفادهٔ مشترک. */
export const LIKERT5: { label: string; value: number }[] = [
  { label: 'کاملاً مخالفم', value: 1 },
  { label: 'مخالفم', value: 2 },
  { label: 'نظری ندارم', value: 3 },
  { label: 'موافقم', value: 4 },
  { label: 'کاملاً موافقم', value: 5 },
];
