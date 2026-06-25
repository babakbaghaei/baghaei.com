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
  Languages,
  CalendarDays,
  CalendarRange,
  Timer,
  Flame,
  Droplets,
  GraduationCap,
  Braces,
  Binary,
  Fuel,
  Gem,
  Stamp,
  ReceiptText,
  Receipt,
  CarFront,
  Coins,
  Handshake,
  Calculator,
  FileSpreadsheet,
  BookHeart,
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
  /** متن قفل اختصاصی برای ابزارهای «به‌زودی» (مثلاً «در انتظار تأیید بانک مرکزی»). */
  lockNote?: string;
  /** در صفحهٔ اصلی به‌عنوان منتخب نمایش داده شود. */
  featured?: boolean;
}

/* ───────────── دسته‌بندی‌های کلان ─────────────
 * هفت دستهٔ بزرگ به‌جای دسته‌های ریز و پراکنده. هر ابزار دقیقاً در یک دسته قرار
 * می‌گیرد و ترتیب نمایش از کلیدهای CATEGORY_META تبعیت می‌کند (نه ترتیب آرایه).
 */
export const CAT_LEGAL = 'حقوقی و قضایی';
export const CAT_FINANCE = 'مالی و کسب‌وکار';
export const CAT_REALESTATE = 'املاک';
export const CAT_UTILITY = 'محاسبه و ابزار';
export const CAT_TEXT = 'متن و نوشتار';
export const CAT_HEALTH = 'سلامت و زندگی';
export const CAT_FUN = 'سرگرمی';

export const TOOLS: Tool[] = [
  {
    slug: 'khesarat-takhir',
    title: 'خسارت تأخیر تأدیه',
    desc: 'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
    category: CAT_LEGAL,
    icon: Scale,
    accent: '245, 158, 11',
    status: 'beta',
  },
  {
    slug: 'diyeh',
    title: 'ماشین‌حساب دیه',
    desc: 'محاسبهٔ دیهٔ کامل و دیهٔ اعضا و جراحات بر اساس نرخ رسمی قوهٔ قضاییه و مادهٔ ۵۴۹ قانون مجازات اسلامی.',
    category: CAT_LEGAL,
    icon: HeartPulse,
    accent: '190, 18, 60',
    status: 'new',
  },
  {
    slug: 'taghsim-ers',
    title: 'تقسیم ارث (سهم‌الارث)',
    desc: 'محاسبهٔ سهم‌الارث وراث طبقهٔ اول (همسر، فرزندان، پدر و مادر) بر پایهٔ فقه امامی و قانون مدنی.',
    category: CAT_LEGAL,
    icon: Users,
    accent: '5, 150, 105',
    status: 'new',
    featured: true,
  },
  {
    slug: 'maliyat-ers',
    title: 'مالیات بر ارث',
    desc: 'محاسبهٔ مالیات بر ارث بر حسب نوع دارایی و طبقهٔ وراث، طبق مادهٔ ۱۷ قانون مالیات‌های مستقیم.',
    category: CAT_LEGAL,
    icon: Landmark,
    accent: '79, 70, 229',
    status: 'new',
  },
  {
    slug: 'mohlat-ghanuni',
    title: 'مهلت‌های قانونی و مبدل تاریخ',
    desc: 'محاسبهٔ آخرین مهلت اعتراض و تجدیدنظر بر مبنای تاریخ ابلاغ، و تبدیل تاریخ شمسی، میلادی و قمری.',
    category: CAT_LEGAL,
    icon: CalendarClock,
    accent: '124, 58, 237',
    status: 'new',
  },
  {
    slug: 'mahriyeh',
    title: 'مهریه به نرخ روز',
    desc: 'محاسبهٔ ارزش روز مهریه بر اساس تعداد سکه و قیمت روز، یا مبلغ وجه نقد تعدیل‌شده با شاخص.',
    category: CAT_LEGAL,
    icon: Gem,
    accent: '190, 18, 60',
    status: 'beta',
    featured: true,
  },
  {
    slug: 'hazineh-dadrasi',
    title: 'هزینهٔ دادرسی و تمبر دادخواست',
    desc: 'برآورد هزینهٔ دادرسی دعاوی مالی بر اساس بهای خواسته و مرحلهٔ رسیدگی.',
    category: CAT_LEGAL,
    icon: Stamp,
    accent: '79, 70, 229',
    status: 'new',
  },
  {
    slug: 'khesarat-cheque',
    title: 'خسارت تأخیر چک برگشتی',
    desc: 'برآورد خسارت تأخیر تأدیه مبلغ چک برگشتی بر مبنای نرخ شاخص و تعداد روز تأخیر.',
    category: CAT_LEGAL,
    icon: ReceiptText,
    accent: '245, 158, 11',
    status: 'new',
  },

  {
    slug: 'aghsat-vam',
    title: 'محاسبه‌گر اقساط وام',
    desc: 'محاسبهٔ قسط ماهانه، سود کل و جدول بازپرداخت وام بانکی بر پایهٔ فرمول اقساط مساوی.',
    category: CAT_FINANCE,
    icon: Wallet,
    accent: '217, 119, 6',
    status: 'new',
    featured: true,
  },
  {
    slug: 'sood-sepordeh',
    title: 'سود سپرده و سرمایه‌گذاری',
    desc: 'برآورد سود ساده و مرکب سپردهٔ بانکی و رشد سرمایه در طول زمان با نرخ و دورهٔ دلخواه.',
    category: CAT_FINANCE,
    icon: PiggyBank,
    accent: '5, 150, 105',
    status: 'new',
  },
  {
    slug: 'eidi-sanavat',
    title: 'عیدی و سنوات',
    desc: 'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
    category: CAT_FINANCE,
    icon: Gift,
    accent: '217, 119, 6',
    status: 'beta',
  },
  {
    slug: 'hoghoogh-khales',
    title: 'حقوق خالص (خالص دریافتی)',
    desc: 'محاسبهٔ خالص دریافتی از حقوق ناخالص با کسر سهم بیمه و مالیات حقوق پلکانی.',
    category: CAT_FINANCE,
    icon: Wallet,
    accent: '5, 150, 105',
    status: 'new',
    featured: true,
  },
  {
    slug: 'maliyat-arzesh-afzoodeh',
    title: 'مالیات بر ارزش‌افزوده',
    desc: 'افزودن یا تفکیک مالیات بر ارزش‌افزوده از مبلغ، با نرخ قابل تنظیم.',
    category: CAT_FINANCE,
    icon: Receipt,
    accent: '217, 119, 6',
    status: 'new',
  },
  {
    slug: 'leasing-khodro',
    title: 'محاسبه‌گر اقساط لیزینگ',
    desc: 'محاسبهٔ قسط ماهانه و سود کل خرید اقساطی/لیزینگ بر پایهٔ مبلغ، پیش‌پرداخت و نرخ سود.',
    category: CAT_FINANCE,
    icon: CarFront,
    accent: '217, 119, 6',
    status: 'new',
  },
  {
    slug: 'arzesh-tala',
    title: 'ارزش طلا و آب‌شده',
    desc: 'محاسبهٔ ارزش طلا بر اساس وزن، عیار و قیمت روز هر گرم طلای خام.',
    category: CAT_FINANCE,
    icon: Coins,
    accent: '234, 179, 8',
    status: 'new',
  },
  {
    slug: 'mohasebe-takhfif',
    title: 'محاسبه‌گر تخفیف',
    desc: 'محاسبهٔ مبلغ پس از تخفیف، میزان صرفه‌جویی و قیمت نهایی به‌همراه مالیات بر ارزش‌افزوده.',
    category: CAT_FINANCE,
    icon: Percent,
    accent: '217, 119, 6',
    status: 'new',
  },
  {
    slug: 'gheymat-tamam-shode',
    title: 'قیمت تمام‌شده و سود',
    desc: 'محاسبهٔ قیمت فروش، حاشیهٔ سود و نقطهٔ سربه‌سر بر اساس بهای تمام‌شده و درصد سود.',
    category: CAT_FINANCE,
    icon: Calculator,
    accent: '217, 119, 6',
    status: 'new',
  },
  {
    slug: 'factor-saz',
    title: 'مولد فاکتور فروش',
    desc: 'ساخت فاکتور فروش با ردیف‌های کالا، جمع کل، تخفیف و مالیات بر ارزش‌افزوده، آمادهٔ چاپ.',
    category: CAT_FINANCE,
    icon: FileSpreadsheet,
    accent: '217, 119, 6',
    status: 'new',
  },
  {
    slug: 'khoms',
    title: 'محاسبه‌گر خمس',
    desc: 'برآورد خمس سود سالانه (مازاد بر مئونه) بر پایهٔ نرخ یک‌پنجم.',
    category: CAT_FINANCE,
    icon: BookHeart,
    accent: '5, 150, 105',
    status: 'new',
  },

  {
    slug: 'rahn-ejareh',
    title: 'تبدیل رهن و اجاره',
    desc: 'تبدیل ودیعه (رهن) به اجارهٔ ماهانه و برعکس با نرخ تبدیل دلخواه، بر پایهٔ عرف بازار مسکن.',
    category: CAT_REALESTATE,
    icon: ArrowRightLeft,
    accent: '2, 132, 199',
    status: 'new',
    featured: true,
  },
  {
    slug: 'ajrat-mesl',
    title: 'اجرت‌المثل ایام تصرف',
    desc: 'برآورد اجرت‌المثل تصرف غیرمجاز ملک و خسارت تأخیر در تخلیه بر مبنای ارزش اجارهٔ ماهانه.',
    category: CAT_REALESTATE,
    icon: KeyRound,
    accent: '146, 64, 14',
    status: 'new',
  },
  {
    slug: 'komision-amlak',
    title: 'کمیسیون مشاور املاک',
    desc: 'محاسبهٔ حق‌الزحمهٔ بنگاه برای معاملات خرید/فروش و رهن و اجاره با نرخ قابل تنظیم.',
    category: CAT_REALESTATE,
    icon: Handshake,
    accent: '13, 148, 136',
    status: 'new',
  },
  {
    slug: 'maliyat-naghl-melk',
    title: 'مالیات نقل‌وانتقال ملک',
    desc: 'برآورد مالیات نقل‌وانتقال املاک بر اساس ارزش معاملاتی و نرخ قابل تنظیم.',
    category: CAT_REALESTATE,
    icon: Building2,
    accent: '13, 148, 136',
    status: 'new',
  },

  {
    slug: 'mohasebe-darsad',
    title: 'محاسبه‌گر درصد',
    desc: 'محاسبهٔ سریع انواع درصد: درصدی از یک عدد، تغییر درصدی و نسبت دو عدد به هم.',
    category: CAT_UTILITY,
    icon: Percent,
    accent: '139, 92, 246',
    status: 'new',
    featured: true,
  },
  {
    slug: 'tabdil-vahed',
    title: 'مبدل واحدها',
    desc: 'تبدیل سریع واحدهای طول، وزن، مساحت و دما با ضرایب استاندارد.',
    category: CAT_UTILITY,
    icon: ArrowRightLeft,
    accent: '139, 92, 246',
    status: 'new',
  },
  {
    slug: 'tabdil-tarikh',
    title: 'مبدل تاریخ شمسی، میلادی و قمری',
    desc: 'تبدیل دقیق تاریخ بین تقویم‌های شمسی (جلالی)، میلادی و قمری (هجری قمری).',
    category: CAT_UTILITY,
    icon: CalendarDays,
    accent: '124, 58, 237',
    status: 'new',
    featured: true,
  },
  {
    slug: 'faseleh-tarikh',
    title: 'فاصلهٔ بین دو تاریخ',
    desc: 'محاسبهٔ تعداد روز، هفته، ماه و سال بین دو تاریخ شمسی یا میلادی.',
    category: CAT_UTILITY,
    icon: CalendarRange,
    accent: '124, 58, 237',
    status: 'new',
  },
  {
    slug: 'shomaresh-makus',
    title: 'شمارش معکوس رویداد',
    desc: 'شمارش معکوس زندهٔ روز، ساعت، دقیقه و ثانیه تا یک تاریخ و زمان مشخص.',
    category: CAT_UTILITY,
    icon: Timer,
    accent: '124, 58, 237',
    status: 'new',
  },
  {
    slug: 'moadel',
    title: 'محاسبه‌گر معدل',
    desc: 'محاسبهٔ معدل وزنی بر اساس نمرات و واحد/ضریب هر درس.',
    category: CAT_UTILITY,
    icon: GraduationCap,
    accent: '37, 99, 235',
    status: 'new',
  },
  {
    slug: 'json-formatter',
    title: 'فرمت و اعتبارسنجی JSON',
    desc: 'مرتب‌سازی، فشرده‌سازی و بررسی صحت JSON با نمایش خطای دقیق.',
    category: CAT_UTILITY,
    icon: Braces,
    accent: '99, 102, 241',
    status: 'new',
  },
  {
    slug: 'base64',
    title: 'مبدل Base64',
    desc: 'رمزگذاری و رمزگشایی متن به/از Base64 با پشتیبانی کامل از یونیکد (فارسی).',
    category: CAT_UTILITY,
    icon: Binary,
    accent: '99, 102, 241',
    status: 'new',
  },
  {
    slug: 'masraf-sookht',
    title: 'محاسبهٔ مصرف سوخت خودرو',
    desc: 'محاسبهٔ مصرف سوخت (لیتر در ۱۰۰ کیلومتر) و هزینهٔ سفر بر اساس مسافت و قیمت سوخت.',
    category: CAT_UTILITY,
    icon: Fuel,
    accent: '146, 64, 14',
    status: 'new',
  },

  {
    slug: 'adad-be-horoof',
    title: 'مبدل عدد به حروف',
    desc: 'تبدیل مبلغ عددی به حروف فارسی برای نوشتن چک، قرارداد و اسناد مالی.',
    category: CAT_TEXT,
    icon: Type,
    accent: '99, 102, 241',
    status: 'new',
  },
  {
    slug: 'shomaresh-kalamat',
    title: 'شمارنده کلمات',
    desc: 'شمارش لحظه‌ای کلمات، کاراکترها، خطوط و تخمین زمان مطالعهٔ متن فارسی.',
    category: CAT_TEXT,
    icon: FileText,
    accent: '139, 92, 246',
    status: 'new',
  },
  {
    slug: 'nim-fasele',
    title: 'اصلاح نیم‌فاصله و متن فارسی',
    desc: 'نرمال‌سازی متن فارسی: اصلاح نیم‌فاصله، تبدیل ي/ك عربی به ی/ک، حذف فاصله‌های اضافی و یکدست‌سازی اعداد.',
    category: CAT_TEXT,
    icon: Type,
    accent: '139, 92, 246',
    status: 'new',
    featured: true,
  },
  {
    slug: 'pinglish-be-farsi',
    title: 'مبدل پینگلیش به فارسی',
    desc: 'تبدیل متن فینگلیش (فارسی با حروف لاتین) به خط فارسی بر پایهٔ نگاشت آوایی.',
    category: CAT_TEXT,
    icon: Languages,
    accent: '99, 102, 241',
    status: 'new',
  },
  {
    slug: 'lorem-farsi',
    title: 'مولد لورم ایپسوم فارسی',
    desc: 'تولید متن نمونهٔ فارسی (پاراگراف، جمله یا کلمه) برای طراحی و صفحه‌آرایی.',
    category: CAT_TEXT,
    icon: FileText,
    accent: '139, 92, 246',
    status: 'new',
  },

  {
    slug: 'mohasebe-sen',
    title: 'محاسبه‌گر سن',
    desc: 'محاسبهٔ سن دقیق به سال، ماه و روز، روز هفتهٔ تولد و شمارش معکوس تا تولد بعدی.',
    category: CAT_HEALTH,
    icon: Cake,
    accent: '244, 63, 94',
    status: 'new',
    featured: true,
  },
  {
    slug: 'bmi',
    title: 'محاسبه‌گر BMI',
    desc: 'سنجش شاخص تودهٔ بدنی بر پایهٔ قد و وزن و تعیین محدودهٔ وزن سالم.',
    category: CAT_HEALTH,
    icon: HeartPulse,
    accent: '16, 185, 129',
    status: 'new',
  },
  {
    slug: 'kalori-roozane',
    title: 'کالری روزانهٔ موردنیاز',
    desc: 'برآورد کالری پایه (BMR) و کل (TDEE) بر پایهٔ فرمول میفلین-سنت‌جئور و سطح فعالیت.',
    category: CAT_HEALTH,
    icon: Flame,
    accent: '16, 185, 129',
    status: 'new',
    featured: true,
  },
  {
    slug: 'ab-badan',
    title: 'آب موردنیاز بدن',
    desc: 'برآورد میزان آب روزانهٔ موردنیاز بدن بر اساس وزن و سطح فعالیت.',
    category: CAT_HEALTH,
    icon: Droplets,
    accent: '2, 132, 199',
    status: 'new',
  },
  {
    slug: 'vazn-ideal',
    title: 'وزن ایده‌آل',
    desc: 'برآورد محدودهٔ وزن سالم بر پایهٔ قد (شاخص تودهٔ بدنی) و فرمول‌های مرجع.',
    category: CAT_HEALTH,
    icon: Scale,
    accent: '5, 150, 105',
    status: 'new',
  },

  {
    slug: 'type-jangi',
    title: 'سرعت‌سنج تایپ',
    desc: 'سنجش سرعت و دقت تایپ فارسی با چالش‌های هیجان‌انگیز و رقابتی.',
    category: CAT_FUN,
    icon: Keyboard,
    accent: '239, 68, 68',
    featured: true,
  },
  {
    slug: 'spin-win',
    title: 'چرخونه تصمیم',
    desc: 'ابزاری مدرن برای قرعه‌کشی، انتخاب تصادفی و حل تردیدهای روزمره.',
    category: CAT_FUN,
    icon: Dices,
    accent: '139, 92, 246',
    featured: false,
  },
];

/**
 * متادیتای هر دستهٔ ابزار: رنگ ثابت و آیکن نماینده.
 * رنگ به‌صورت «r, g, b» تا در rgb()/rgba() استفاده شود؛ آیکن کارت‌ها و سرتیترهای
 * دسته‌بندی از همین رنگ تبعیت می‌کنند تا ظاهر یکدست بماند. ترتیب کلیدها همان
 * ترتیب نمایش دسته‌ها در صفحهٔ ابزارهاست.
 */
export interface CategoryMeta {
  color: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  [CAT_LEGAL]: { color: '99, 102, 241', icon: Scale }, // indigo
  [CAT_FINANCE]: { color: '217, 119, 6', icon: Wallet }, // amber
  [CAT_REALESTATE]: { color: '13, 148, 136', icon: Building2 }, // teal
  [CAT_UTILITY]: { color: '124, 58, 237', icon: Calculator }, // violet
  [CAT_TEXT]: { color: '139, 92, 246', icon: FileText }, // violet-light
  [CAT_HEALTH]: { color: '5, 150, 105', icon: HeartPulse }, // emerald
  [CAT_FUN]: { color: '244, 63, 94', icon: Gamepad2 }, // rose
};

const FALLBACK_META: CategoryMeta = { color: '120, 120, 130', icon: Wrench };

/** متادیتای دسته (رنگ و آیکن) را با مقدار پیش‌فرض امن برمی‌گرداند. */
export const getCategoryMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category] ?? FALLBACK_META;

/**
 * دسته‌های فعال، به ترتیب کلیدهای CATEGORY_META (نه ترتیب آرایهٔ ابزارها).
 * فقط دسته‌هایی که حداقل یک ابزار دارند نمایش داده می‌شوند.
 */
export const TOOL_CATEGORIES = Object.keys(CATEGORY_META).filter((c) =>
  TOOLS.some((t) => t.category === c),
);

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
