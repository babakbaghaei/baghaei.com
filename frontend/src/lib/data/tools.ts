import {
  Keyboard,
  Dices,
  Cake,
  Scale,
  HeartPulse,
  Users,
  CalendarClock,
  Landmark,
  ArrowRightLeft,
  Building2,
  KeyRound,
  Wallet,
  PiggyBank,
  Percent,
  Wrench,
  Gamepad2,
  Type,
  FileText,
  Gift,
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
    slug: 'mohlat-ghanuni',
    title: 'مهلت‌های قانونی و مبدل تاریخ',
    desc: 'محاسبهٔ آخرین مهلت اعتراض و تجدیدنظر بر مبنای تاریخ ابلاغ، و تبدیل تاریخ شمسی، میلادی و قمری.',
    category: 'حقوقی',
    icon: CalendarClock,
    accent: '124, 58, 237',
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
    slug: 'ajrat-mesl',
    title: 'اجرت‌المثل ایام تصرف',
    desc: 'برآورد اجرت‌المثل تصرف غیرمجاز ملک و خسارت تأخیر در تخلیه بر مبنای ارزش اجارهٔ ماهانه.',
    category: 'املاک',
    icon: KeyRound,
    accent: '146, 64, 14',
    status: 'new',
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
    slug: 'eidi-sanavat',
    title: 'عیدی و سنوات',
    desc: 'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
    category: 'مالی',
    icon: Gift,
    accent: '217, 119, 6',
    status: 'new',
    featured: true,
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
    slug: 'mohasebe-sen',
    title: 'محاسبه‌گر سن',
    desc: 'محاسبهٔ سن دقیق به سال، ماه و روز، روز هفتهٔ تولد و شمارش معکوس تا تولد بعدی.',
    category: 'سرگرمی',
    icon: Cake,
    accent: '244, 63, 94',
    status: 'new',
    featured: true,
  },
  {
    slug: 'bmi',
    title: 'محاسبه‌گر BMI',
    desc: 'سنجش شاخص تودهٔ بدنی بر پایهٔ قد و وزن و تعیین محدودهٔ وزن سالم.',
    category: 'سرگرمی',
    icon: HeartPulse,
    accent: '16, 185, 129',
    status: 'new',
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
  {
    slug: 'adad-be-horoof',
    title: 'مبدل عدد به حروف',
    desc: 'تبدیل مبلغ عددی به حروف فارسی برای نوشتن چک، قرارداد و اسناد مالی.',
    category: 'کمکی',
    icon: Type,
    accent: '99, 102, 241',
    status: 'new',
  },
  {
    slug: 'shomaresh-kalamat',
    title: 'شمارنده کلمات',
    desc: 'شمارش لحظه‌ای کلمات، کاراکترها، خطوط و تخمین زمان مطالعهٔ متن فارسی.',
    category: 'کمکی',
    icon: FileText,
    accent: '139, 92, 246',
    status: 'new',
  },
  {
    slug: 'tabdil-vahed',
    title: 'مبدل واحدها',
    desc: 'تبدیل سریع واحدهای طول، وزن، مساحت و دما با ضرایب استاندارد.',
    category: 'کمکی',
    icon: ArrowRightLeft,
    accent: '139, 92, 246',
    status: 'new',
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
