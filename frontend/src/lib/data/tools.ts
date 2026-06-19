import {
  PenTool,
  Keyboard,
  Dices,
  Scale,
  HeartHandshake,
  HeartPulse,
  Receipt,
  Users,
  CalendarClock,
  Briefcase,
  HardHat,
  Landmark,
  ArrowRightLeft,
  Handshake,
  Building2,
  KeyRound,
  Wallet,
  PiggyBank,
  Percent,
  Wrench,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';

export type ToolStatus = 'new' | 'beta' | 'soon';

export interface Tool {
  /** اسلاگ مسیر: /tools/<slug> */
  slug: string;
  title: string;
  desc: string;
  /** نام دستهٔ نمایشی (برای فیلتر) */
  category: string;
  icon: LucideIcon;
  /** رنگ لهجه به‌صورت «r, g, b» تا در rgba استفاده شود. */
  accent: string;
  status?: ToolStatus;
  /** در صفحهٔ اصلی به‌عنوان منتخب نمایش داده شود. */
  featured?: boolean;
}

export const TOOLS: Tool[] = [
  {
    slug: 'khesarat-takhir',
    title: 'خسارت تأخیر تأدیه',
    desc: 'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
    category: 'حقوقی',
    icon: Scale,
    accent: '245, 158, 11',
    status: 'new',
    featured: true,
  },
  {
    slug: 'mahriyeh',
    title: 'مهریه به نرخ روز',
    desc: 'به‌روزرسانی مهریهٔ وجه نقد بر اساس شاخص بانک مرکزی (تبصرهٔ مادهٔ ۱۰۸۲ ق.م) و محاسبهٔ مهریهٔ سکه.',
    category: 'حقوقی',
    icon: HeartHandshake,
    accent: '236, 72, 153',
    status: 'new',
    featured: true,
  },
  {
    slug: 'diyeh',
    title: 'ماشین‌حساب دیه',
    desc: 'محاسبهٔ دیهٔ کامل و دیهٔ اعضا و جراحات بر اساس نرخ رسمی قوهٔ قضاییه و مادهٔ ۵۴۹ قانون مجازات اسلامی.',
    category: 'حقوقی',
    icon: HeartPulse,
    accent: '190, 18, 60',
    status: 'new',
  },
  {
    slug: 'taghsim-ers',
    title: 'تقسیم ارث (سهم‌الارث)',
    desc: 'محاسبهٔ سهم‌الارث وراث طبقهٔ اول (همسر، فرزندان، پدر و مادر) بر پایهٔ فقه امامی و قانون مدنی.',
    category: 'حقوقی',
    icon: Users,
    accent: '5, 150, 105',
    status: 'new',
    featured: true,
  },
  {
    slug: 'maliyat-ers',
    title: 'مالیات بر ارث',
    desc: 'محاسبهٔ مالیات بر ارث بر حسب نوع دارایی و طبقهٔ وراث، طبق مادهٔ ۱۷ قانون مالیات‌های مستقیم.',
    category: 'حقوقی',
    icon: Landmark,
    accent: '79, 70, 229',
    status: 'new',
  },
  {
    slug: 'hazineh-dadrasi',
    title: 'هزینهٔ دادرسی و تمبر',
    desc: 'محاسبهٔ هزینهٔ دادرسی دعاوی مالی در مراحل بدوی، تجدیدنظر و فرجام بر اساس تعرفهٔ خدمات قضایی.',
    category: 'حقوقی',
    icon: Receipt,
    accent: '14, 116, 144',
    status: 'new',
  },
  {
    slug: 'hagholvekaleh',
    title: 'حق‌الوکالهٔ وکیل',
    desc: 'برآورد حق‌الوکالهٔ وکیل دادگستری در دعاوی مالی، بر اساس آیین‌نامهٔ تعرفهٔ حق‌الوکاله مصوب ۱۳۹۸.',
    category: 'حقوقی',
    icon: Briefcase,
    accent: '180, 83, 9',
    status: 'new',
  },
  {
    slug: 'mohlat-ghanuni',
    title: 'مهلت‌های قانونی و مبدل تاریخ',
    desc: 'محاسبهٔ آخرین مهلت اعتراض و تجدیدنظر بر مبنای تاریخ ابلاغ، و تبدیل تاریخ شمسی، میلادی و قمری.',
    category: 'حقوقی',
    icon: CalendarClock,
    accent: '124, 58, 237',
    status: 'new',
  },
  {
    slug: 'payan-kar',
    title: 'حقوق پایان کار',
    desc: 'محاسبهٔ سنوات، عیدی و پاداش و حق مرخصی استفاده‌نشده در پایان کار طبق قانون کار.',
    category: 'حقوقی',
    icon: HardHat,
    accent: '13, 148, 136',
    status: 'new',
  },
  {
    slug: 'rahn-ejareh',
    title: 'تبدیل رهن و اجاره',
    desc: 'تبدیل ودیعه (رهن) به اجارهٔ ماهانه و برعکس با نرخ تبدیل دلخواه، بر پایهٔ عرف بازار مسکن.',
    category: 'املاک',
    icon: ArrowRightLeft,
    accent: '2, 132, 199',
    status: 'new',
    featured: true,
  },
  {
    slug: 'komision-melk',
    title: 'کمیسیون مشاور املاک',
    desc: 'محاسبهٔ حق‌الزحمهٔ بنگاه در خرید و فروش و رهن و اجاره طبق تعرفهٔ اتحادیه، با احتساب مالیات.',
    category: 'املاک',
    icon: Handshake,
    accent: '234, 88, 12',
    status: 'new',
  },
  {
    slug: 'maliyat-naghl-melk',
    title: 'مالیات نقل و انتقال ملک',
    desc: 'محاسبهٔ مالیات نقل و انتقال قطعی املاک و حق واگذاری محل (سرقفلی) طبق مواد ۵۹ و ۶۴ ق.م.م.',
    category: 'املاک',
    icon: Building2,
    accent: '15, 118, 110',
    status: 'new',
  },
  {
    slug: 'ajrat-mesl',
    title: 'اجرت‌المثل ایام تصرف',
    desc: 'برآورد اجرت‌المثل تصرف غیرمجاز ملک و خسارت تأخیر در تخلیه بر مبنای ارزش اجارهٔ ماهانه.',
    category: 'املاک',
    icon: KeyRound,
    accent: '146, 64, 14',
    status: 'new',
  },
  {
    slug: 'cheque-nevis',
    title: 'دستیار چک‌نویس',
    desc: 'تبدیل هوشمند مبلغ عددی به حروف فارسی برای نوشتن بی‌خطای چک‌های صیادی.',
    category: 'مالی',
    icon: PenTool,
    accent: '99, 102, 241',
    featured: true,
  },
  {
    slug: 'aghsat-vam',
    title: 'محاسبه‌گر اقساط وام',
    desc: 'محاسبهٔ قسط ماهانه، سود کل و جدول بازپرداخت وام بانکی بر پایهٔ فرمول اقساط مساوی.',
    category: 'مالی',
    icon: Wallet,
    accent: '217, 119, 6',
    status: 'new',
    featured: true,
  },
  {
    slug: 'sood-sepordeh',
    title: 'سود سپرده و سرمایه‌گذاری',
    desc: 'برآورد سود ساده و مرکب سپردهٔ بانکی و رشد سرمایه در طول زمان با نرخ و دورهٔ دلخواه.',
    category: 'مالی',
    icon: PiggyBank,
    accent: '5, 150, 105',
    status: 'new',
  },
  {
    slug: 'type-jangi',
    title: 'سرعت‌سنج تایپ',
    desc: 'سنجش سرعت و دقت تایپ فارسی با چالش‌های هیجان‌انگیز و رقابتی.',
    category: 'سرگرمی',
    icon: Keyboard,
    accent: '239, 68, 68',
    featured: true,
  },
  {
    slug: 'spin-win',
    title: 'چرخونه تصمیم',
    desc: 'ابزاری مدرن برای قرعه‌کشی، انتخاب تصادفی و حل تردیدهای روزمره.',
    category: 'کمکی',
    icon: Dices,
    accent: '139, 92, 246',
    featured: false,
  },
  {
    slug: 'mohasebe-darsad',
    title: 'محاسبه‌گر درصد',
    desc: 'محاسبهٔ سریع انواع درصد: درصدی از یک عدد، تغییر درصدی و نسبت دو عدد به هم.',
    category: 'کمکی',
    icon: Percent,
    accent: '139, 92, 246',
    status: 'new',
    featured: true,
  },
];

/**
 * متادیتای هر دستهٔ ابزار: رنگ ثابت و آیکن نماینده.
 * رنگ به‌صورت «r, g, b» تا در rgb()/rgba() استفاده شود؛ آیکن کارت‌ها و سرتیترهای
 * دسته‌بندی از همین رنگ تبعیت می‌کنند تا ظاهر یکدست بماند.
 */
export interface CategoryMeta {
  color: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  حقوقی: { color: '99, 102, 241', icon: Scale }, // indigo
  املاک: { color: '13, 148, 136', icon: Building2 }, // teal
  مالی: { color: '217, 119, 6', icon: Wallet }, // amber
  سرگرمی: { color: '244, 63, 94', icon: Gamepad2 }, // rose
  کمکی: { color: '139, 92, 246', icon: Wrench }, // violet
};

const FALLBACK_META: CategoryMeta = { color: '120, 120, 130', icon: Wrench };

/** متادیتای دسته (رنگ و آیکن) را با مقدار پیش‌فرض امن برمی‌گرداند. */
export const getCategoryMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category] ?? FALLBACK_META;

/** دسته‌های یکتا، به ترتیب ظهور. */
export const TOOL_CATEGORIES = Array.from(new Set(TOOLS.map((t) => t.category)));

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
