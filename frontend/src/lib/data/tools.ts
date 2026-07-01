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
  Receipt,
  CarFront,
  Coins,
  Handshake,
  Calculator,
  FileSpreadsheet,
  BookHeart,
  HandCoins,
  Gavel,
  Banknote,
  TicketPercent,
  TrendingUp,
  FileSignature,
  Repeat,
  WholeWord,
  LetterText,
  SpellCheck,
  Pilcrow,
  PersonStanding,
  Disc3,
  CircleDollarSign,
  Feather,
  Star,
  Rabbit,
  Hand,
  Sparkles,
  Grid3x3,
  Brain,
  Compass,
  Heart,
  Briefcase,
  Puzzle,
  Smile,
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
  /** در صفحهٔ ابزارها در دستهٔ «پرطرفدار» (بالای همه) نمایش داده شود. */
  popular?: boolean;
  /**
   * ابزار از فهرست‌ها پنهان است (هنوز فعال نشده / در انتظار فعال‌سازی از پنل
   * ادمین). مسیر مستقیم همچنان قابل دسترس است اما در صفحهٔ ابزارها، جستجو و
   * منوی ناوبری نمایش داده نمی‌شود.
   */
  hidden?: boolean;
}

/* ───────────── دسته‌بندی‌های کلان ─────────────
 * هشت دستهٔ بزرگ به‌جای دسته‌های ریز و پراکنده. هر ابزار دقیقاً در یک دسته قرار
 * می‌گیرد و ترتیب نمایش از کلیدهای CATEGORY_META تبعیت می‌کند (نه ترتیب آرایه).
 */
export const CAT_LEGAL = 'حقوقی و قضایی';
export const CAT_FINANCE = 'مالی و کسب‌وکار';
export const CAT_REALESTATE = 'املاک';
export const CAT_UTILITY = 'محاسبه و ابزار';
export const CAT_TEXT = 'متن و نوشتار';
export const CAT_HEALTH = 'سلامت و زندگی';
export const CAT_FUN = 'سرگرمی';
export const CAT_ASTRO = 'فال و طالع‌بینی';
export const CAT_PERSONALITY = 'شخصیت‌شناسی';

export const TOOLS: Tool[] = [
  {
    slug: 'khesarat-takhir',
    title: 'خسارت تأخیر تأدیه',
    desc: 'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
    category: CAT_LEGAL,
    icon: HandCoins,
    accent: '245, 158, 11',
    status: 'beta',
    popular: true,
  },
  {
    slug: 'diyeh',
    title: 'ماشین‌حساب دیه',
    desc: 'محاسبهٔ دیهٔ کامل و دیهٔ اعضا و جراحات بر اساس نرخ رسمی قوهٔ قضاییه و مادهٔ ۵۴۹ قانون مجازات اسلامی.',
    category: CAT_LEGAL,
    icon: Gavel,
    accent: '190, 18, 60',
    status: 'beta',
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
    status: 'beta',
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
    desc: 'محاسبهٔ ارزش روز مهریه بر اساس تعداد و نوع سکه و قیمت روز، یا مبلغ وجه نقد تعدیل‌شده با شاخص بانک مرکزی.',
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
    status: 'beta',
    hidden: true, // R10 — فعلاً پنهان؛ فعال‌سازی از پنل ادمین
  },
  {
    slug: 'aghsat-vam',
    title: 'محاسبه‌گر اقساط وام',
    desc: 'محاسبهٔ قسط ماهانه، سود کل و جدول بازپرداخت وام بانکی بر پایهٔ فرمول اقساط مساوی.',
    category: CAT_FINANCE,
    icon: Banknote,
    accent: '217, 119, 6',
    status: 'new',
    featured: true,
    popular: true,
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
    status: 'beta',
    featured: true,
    popular: true,
  },
  {
    slug: 'maliyat-arzesh-afzoodeh',
    title: 'مالیات بر ارزش‌افزوده',
    desc: 'افزودن یا تفکیک مالیات بر ارزش‌افزوده از مبلغ، با نرخ قابل تنظیم.',
    category: CAT_FINANCE,
    icon: Receipt,
    accent: '217, 119, 6',
    status: 'beta',
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
    status: 'beta',
  },
  {
    slug: 'mohasebe-takhfif',
    title: 'محاسبه‌گر تخفیف',
    desc: 'محاسبهٔ مبلغ پس از تخفیف، میزان صرفه‌جویی و قیمت نهایی به‌همراه مالیات بر ارزش‌افزوده.',
    category: CAT_FINANCE,
    icon: TicketPercent,
    accent: '217, 119, 6',
    status: 'new',
  },
  {
    slug: 'gheymat-tamam-shode',
    title: 'قیمت تمام‌شده و سود',
    desc: 'محاسبهٔ قیمت فروش، حاشیهٔ سود و نقطهٔ سربه‌سر بر اساس بهای تمام‌شده و درصد سود.',
    category: CAT_FINANCE,
    icon: TrendingUp,
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
    icon: Repeat,
    accent: '2, 132, 199',
    status: 'beta',
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
    status: 'beta',
  },
  {
    slug: 'maliyat-naghl-melk',
    title: 'مالیات نقل‌وانتقال ملک',
    desc: 'برآورد مالیات نقل‌وانتقال املاک بر اساس ارزش معاملاتی و نرخ قابل تنظیم.',
    category: CAT_REALESTATE,
    icon: FileSignature,
    accent: '13, 148, 136',
    status: 'beta',
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
    popular: true,
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
    popular: true,
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
    icon: WholeWord,
    accent: '99, 102, 241',
    status: 'new',
  },
  {
    slug: 'shomaresh-kalamat',
    title: 'شمارنده کلمات',
    desc: 'شمارش لحظه‌ای کلمات، کاراکترها، خطوط و تخمین زمان مطالعهٔ متن فارسی.',
    category: CAT_TEXT,
    icon: LetterText,
    accent: '139, 92, 246',
    status: 'new',
  },
  {
    slug: 'nim-fasele',
    title: 'اصلاح نیم‌فاصله و متن فارسی',
    desc: 'نرمال‌سازی متن فارسی: اصلاح نیم‌فاصله، تبدیل ي/ك عربی به ی/ک، حذف فاصله‌های اضافی و یکدست‌سازی اعداد.',
    category: CAT_TEXT,
    icon: SpellCheck,
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
    icon: Pilcrow,
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
    popular: true,
  },
  {
    slug: 'bmi',
    title: 'محاسبه‌گر BMI',
    desc: 'سنجش شاخص تودهٔ بدنی بر پایهٔ قد و وزن و تعیین محدودهٔ وزن سالم.',
    category: CAT_HEALTH,
    icon: HeartPulse,
    accent: '16, 185, 129',
    status: 'new',
    popular: true,
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
    icon: PersonStanding,
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
    popular: true,
  },
  {
    slug: 'spin-win',
    title: 'چرخونه تصمیم',
    desc: 'ابزاری مدرن برای قرعه‌کشی، انتخاب تصادفی و حل تردیدهای روزمره.',
    category: CAT_FUN,
    icon: Disc3,
    accent: '139, 92, 246',
    featured: false,
  },
  {
    slug: 'sher-ya-khat',
    title: 'شیر یا خط',
    desc: 'پرتاب سکهٔ شیر یا خط برای تصمیم‌گیری سریع و منصفانه، با انیمیشن و شمارش نتایج.',
    category: CAT_FUN,
    icon: CircleDollarSign,
    accent: '234, 179, 8',
    status: 'new',
  },
  {
    slug: 'tas',
    title: 'تاس بینداز',
    desc: 'تاس بیندازید؛ از یک تا چند تاس هم‌زمان، با جمع خودکار و تاریخچهٔ پرتاب‌ها.',
    category: CAT_FUN,
    icon: Dices,
    accent: '139, 92, 246',
    status: 'new',
  },
  {
    slug: 'sang-kaghaz-gheychi',
    title: 'سنگ کاغذ قیچی',
    desc: 'بازی سنگ، کاغذ، قیچی در برابر رایانه؛ با امتیازشماری و نتیجهٔ آنی.',
    category: CAT_FUN,
    icon: Hand,
    accent: '244, 63, 94',
    status: 'new',
  },
  {
    slug: 'dooz',
    title: 'دوز (ایکس و او)',
    desc: 'بازی کلاسیک دوز در برابر رایانه با سه سطح سختی؛ ساده، متوسط و حرفه‌ای.',
    category: CAT_FUN,
    icon: Grid3x3,
    accent: '239, 68, 68',
    status: 'new',
  },

  {
    slug: 'fal-hafez',
    title: 'فال حافظ',
    desc: 'تفأل به دیوان حافظ شیرازی؛ یک غزل کامل به‌همراه تفسیر و معنی فال، با نیّت قلبی.',
    category: CAT_ASTRO,
    icon: Feather,
    accent: '217, 70, 239',
    status: 'new',
    featured: true,
    popular: true,
  },
  {
    slug: 'borj-tavalod',
    title: 'طالع‌بینی برج تولد',
    desc: 'برج فلکی (طالع) خود را از روی تاریخ تولد بیابید؛ به‌همراه عنصر، ویژگی‌های شخصیتی و سازگاری با برج‌های دیگر.',
    category: CAT_ASTRO,
    icon: Star,
    accent: '124, 58, 237',
    status: 'new',
  },
  {
    slug: 'hayvan-sal',
    title: 'حیوان سال تولد',
    desc: 'حیوان سال تولد شما در گاه‌شماری دوازده‌حیوانی (طالع چینی/ترکی) و ویژگی‌های منسوب به آن.',
    category: CAT_ASTRO,
    icon: Rabbit,
    accent: '236, 72, 153',
    status: 'new',
  },

  {
    slug: 'mbti',
    title: 'تست شخصیت MBTI',
    desc: 'آزمون تیپ‌نمای مایرز-بریگز؛ شخصیت شما را در یکی از ۱۶ تیپ بر پایهٔ چهار بُعد روان‌شناختی مشخص می‌کند.',
    category: CAT_PERSONALITY,
    icon: Puzzle,
    accent: '139, 92, 246',
    status: 'new',
    featured: true,
    popular: true,
  },
  {
    slug: 'big-five',
    title: 'پنج عامل بزرگ شخصیت',
    desc: 'سنجش پنج عامل اصلی شخصیت (مدل NEO): گشودگی، وظیفه‌شناسی، برون‌گرایی، توافق‌پذیری و روان‌رنجوری.',
    category: CAT_PERSONALITY,
    icon: Brain,
    accent: '99, 102, 241',
    status: 'new',
    featured: true,
  },
  {
    slug: 'enneagram',
    title: 'تست انیاگرام',
    desc: 'شناخت تیپ شخصیتی شما در میان نه تیپ انیاگرام، به‌همراه انگیزه‌ها، ترس‌ها و مسیر رشد هر تیپ.',
    category: CAT_PERSONALITY,
    icon: Compass,
    accent: '236, 72, 153',
    status: 'new',
  },
  {
    slug: 'disc',
    title: 'تست رفتاری DISC',
    desc: 'سنجش سبک رفتاری شما در چهار بُعد سلطه‌گری (D)، تأثیرگذاری (I)، ثبات (S) و وظیفه‌شناسی (C).',
    category: CAT_PERSONALITY,
    icon: Briefcase,
    accent: '14, 165, 233',
    status: 'new',
  },
  {
    slug: 'holland',
    title: 'رغبت‌سنج شغلی هالند',
    desc: 'کشف رغبت‌های شغلی شما در شش تیپ هالند (RIASEC) و معرفی مشاغل متناسب با شخصیت شما.',
    category: CAT_PERSONALITY,
    icon: GraduationCap,
    accent: '20, 184, 166',
    status: 'new',
  },
  {
    slug: 'zaban-eshgh',
    title: 'تست زبان عشق',
    desc: 'پنج زبان عشق شما را بشناسید: کلام تأییدآمیز، زمان باکیفیت، هدیه، خدمت و تماس فیزیکی.',
    category: CAT_PERSONALITY,
    icon: Heart,
    accent: '244, 63, 94',
    status: 'new',
    popular: true,
  },
  {
    slug: 'eq',
    title: 'تست هوش هیجانی (EQ)',
    desc: 'سنجش هوش هیجانی در پنج مؤلفه: خودآگاهی، خودتنظیمی، انگیزش، همدلی و مهارت‌های اجتماعی.',
    category: CAT_PERSONALITY,
    icon: Smile,
    accent: '249, 115, 22',
    status: 'new',
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
  [CAT_LEGAL]: { color: '176, 110, 64', icon: Scale }, // قهوه‌ای (caramel)
  [CAT_FINANCE]: { color: '16, 185, 129', icon: Wallet }, // سبز (emerald)
  [CAT_REALESTATE]: { color: '124, 78, 48', icon: Building2 }, // قهوه‌ای تیره (coffee)
  [CAT_UTILITY]: { color: '234, 130, 40', icon: Calculator }, // نارنجی (orange)
  [CAT_TEXT]: { color: '139, 92, 246', icon: FileText }, // بنفش (violet)
  [CAT_HEALTH]: { color: '34, 197, 94', icon: HeartPulse }, // سبز سلامت (green)
  [CAT_PERSONALITY]: { color: '129, 140, 248', icon: Brain }, // بنفش-آبی (indigo)
  [CAT_FUN]: { color: '249, 88, 12', icon: Gamepad2 }, // نارنجی تیز (sharp orange)
  [CAT_ASTRO]: { color: '217, 70, 239', icon: Sparkles }, // بنفش فانتزی (fuchsia)
};

const FALLBACK_META: CategoryMeta = { color: '120, 120, 130', icon: Wrench };

/** متادیتای دسته (رنگ و آیکن) را با مقدار پیش‌فرض امن برمی‌گرداند. */
export const getCategoryMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category] ?? FALLBACK_META;

/**
 * دسته‌های فعال، به ترتیب کلیدهای CATEGORY_META (نه ترتیب آرایهٔ ابزارها).
 * فقط دسته‌هایی که حداقل یک ابزار دارند نمایش داده می‌شوند.
 */
/** ابزارهای قابل‌نمایش (پنهان‌نشده) — مبنای فهرست‌ها، جستجو و منوی ناوبری. */
export const VISIBLE_TOOLS = TOOLS.filter((t) => !t.hidden);

export const TOOL_CATEGORIES = Object.keys(CATEGORY_META).filter((c) =>
  VISIBLE_TOOLS.some((t) => t.category === c),
);

/** ابزارهای پرطرفدار (برای دستهٔ «پرطرفدار» در بالای صفحهٔ ابزارها). */
export const POPULAR_TOOLS = VISIBLE_TOOLS.filter((t) => t.popular && t.status !== 'soon');

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);

/**
 * کلیدواژه‌های جستجوی هر ابزار (R22). برای پیداکردن آسان ابزار از نوار جستجوی
 * سایت و نیز متادیتای سئو (R24). مترادف‌ها، نام عامیانه و اصطلاحات رایج هر ابزار
 * را پوشش می‌دهد. کلید = اسلاگ ابزار.
 */
export const TOOL_KEYWORDS: Record<string, string[]> = {
  'khesarat-takhir': ['خسارت تاخیر تادیه', 'ماده ۵۲۲', 'کاهش ارزش پول', 'تورم', 'شاخص بانک مرکزی', 'دیرکرد', 'بدهی', 'محکوم به'],
  diyeh: ['دیه', 'دیه کامل', 'ارش', 'ماه حرام', 'قوه قضاییه', 'تصادف', 'جراحت', 'قتل', 'بلدیه'],
  'taghsim-ers': ['تقسیم ارث', 'سهم الارث', 'ماترک', 'وراث', 'میراث', 'ارثیه', 'فرض و رد', 'تعصیب'],
  'maliyat-ers': ['مالیات بر ارث', 'ماده ۱۷', 'گواهی ارث', 'انحصار وراثت', 'مالیات میراث'],
  'mohlat-ghanuni': ['مهلت قانونی', 'تجدیدنظر', 'واخواهی', 'فرجام', 'اعتراض', 'ابلاغ', 'مبدل تاریخ', 'تبدیل تاریخ'],
  mahriyeh: ['مهریه', 'مهریه به نرخ روز', 'سکه', 'سکه بهار آزادی', 'تعدیل مهریه', 'طلاق', 'وجه نقد', 'عندالمطالبه'],
  'hazineh-dadrasi': ['هزینه دادرسی', 'تمبر دادخواست', 'بهای خواسته', 'تعرفه خدمات قضایی', 'ابطال تمبر'],
  'aghsat-vam': ['قسط وام', 'اقساط', 'بازپرداخت وام', 'سود وام', 'فرمول قسط', 'جدول اقساط', 'تسهیلات'],
  'sood-sepordeh': ['سود سپرده', 'سود بانکی', 'سرمایه گذاری', 'سود مرکب', 'سود ساده', 'بهره'],
  'eidi-sanavat': ['عیدی', 'سنوات', 'پایان سال', 'حق سنوات', 'پاداش', 'قانون کار', 'مزایای پایان کار', 'عیدی پایان سال'],
  'hoghoogh-khales': ['حقوق خالص', 'خالص دریافتی', 'بیمه', 'مالیات حقوق', 'فیش حقوقی', 'کسورات', 'حق اولاد', 'حقوق پایه'],
  'maliyat-arzesh-afzoodeh': ['مالیات بر ارزش افزوده', 'ارزش افزوده', 'vat', 'مالیات فاکتور', 'نه درصد', 'ده درصد'],
  'leasing-khodro': ['لیزینگ', 'لیزینگ خودرو', 'خرید اقساطی', 'قسط ماشین', 'پیش پرداخت', 'تسهیلات خودرو'],
  'arzesh-tala': ['ارزش طلا', 'آب شده', 'طلای خام', 'عیار طلا', 'قیمت طلا', 'گرم طلا', 'مظنه', 'طلا فروشی'],
  'mohasebe-takhfif': ['تخفیف', 'محاسبه تخفیف', 'درصد تخفیف', 'قیمت نهایی', 'حراج', 'صرفه جویی'],
  'gheymat-tamam-shode': ['قیمت تمام شده', 'حاشیه سود', 'نقطه سر به سر', 'قیمت فروش', 'سود ناخالص', 'مارجین'],
  'factor-saz': ['فاکتور فروش', 'صورتحساب', 'پیش فاکتور', 'فاکتور رسمی', 'مولد فاکتور', 'چاپ فاکتور'],
  khoms: ['خمس', 'خمس درآمد', 'مئونه', 'یک پنجم', 'سر سال خمسی', 'سهم امام', 'سهم سادات'],
  'rahn-ejareh': ['تبدیل رهن به اجاره', 'رهن و اجاره', 'ودیعه', 'پیش پرداخت اجاره', 'نرخ تبدیل', 'رهن کامل'],
  'ajrat-mesl': ['اجرت المثل', 'ایام تصرف', 'تصرف عدوانی', 'تخلیه', 'اجاره بها', 'خسارت تخلیه'],
  'komision-amlak': ['کمیسیون املاک', 'حق الزحمه بنگاه', 'مشاور املاک', 'کمیسیون معامله', 'حق کمیسیون', 'بنگاه'],
  'maliyat-naghl-melk': ['مالیات نقل و انتقال', 'ماده ۵۹', 'ارزش معاملاتی', 'سرقفلی', 'حق واگذاری', 'فروش ملک', 'سند'],
  'mohasebe-darsad': ['درصد', 'محاسبه درصد', 'درصدی از عدد', 'تغییر درصدی', 'نسبت', 'درصد گیری'],
  'tabdil-vahed': ['تبدیل واحد', 'مبدل واحد', 'طول', 'وزن', 'مساحت', 'دما', 'متر', 'کیلوگرم', 'سانتی گراد'],
  'tabdil-tarikh': ['تبدیل تاریخ', 'شمسی به میلادی', 'میلادی به شمسی', 'قمری', 'هجری', 'مبدل تاریخ', 'جلالی'],
  'faseleh-tarikh': ['فاصله تاریخ', 'اختلاف دو تاریخ', 'تعداد روز', 'محاسبه روز', 'فاصله زمانی'],
  'shomaresh-makus': ['شمارش معکوس', 'کانت دان', 'تایمر رویداد', 'روز شمار', 'باقی مانده تا'],
  moadel: ['معدل', 'معدل گیری', 'معدل وزنی', 'نمره', 'واحد درسی', 'معدل ترم'],
  'json-formatter': ['json', 'فرمت json', 'اعتبارسنجی json', 'مرتب سازی json', 'json زیبا'],
  base64: ['base64', 'بیس ۶۴', 'رمزگذاری', 'رمزگشایی', 'انکد', 'دیکد'],
  'masraf-sookht': ['مصرف سوخت', 'لیتر در صد کیلومتر', 'هزینه سفر', 'بنزین', 'گازوئیل', 'مصرف خودرو'],
  'adad-be-horoof': ['عدد به حروف', 'تبدیل عدد به حروف', 'مبلغ به حروف', 'حروف چک', 'ریال به حروف'],
  'shomaresh-kalamat': ['شمارش کلمات', 'تعداد کلمه', 'تعداد کاراکتر', 'شمارنده', 'زمان مطالعه'],
  'nim-fasele': ['نیم فاصله', 'اصلاح متن فارسی', 'ویرایش فارسی', 'ی و ک عربی', 'نرمال سازی متن'],
  'pinglish-be-farsi': ['پینگلیش', 'فینگلیش', 'فارگلیسی', 'تبدیل پینگلیش', 'لاتین به فارسی'],
  'lorem-farsi': ['لورم ایپسوم', 'متن نمونه', 'متن ساختگی', 'متن فارسی', 'پر کننده متن'],
  'mohasebe-sen': ['محاسبه سن', 'سن دقیق', 'تاریخ تولد', 'چند سالمه', 'سن من', 'روز تولد'],
  bmi: ['bmi', 'شاخص توده بدنی', 'وزن ایده آل', 'چاقی', 'لاغری', 'توده بدن'],
  'kalori-roozane': ['کالری روزانه', 'bmr', 'tdee', 'متابولیسم', 'کالری مورد نیاز', 'رژیم'],
  'ab-badan': ['آب بدن', 'آب روزانه', 'میزان آب', 'هیدراتاسیون', 'نوشیدن آب'],
  'vazn-ideal': ['وزن ایده آل', 'وزن مناسب', 'وزن سالم', 'وزن استاندارد قد'],
  'type-jangi': ['سرعت تایپ', 'تست تایپ', 'تایپ فارسی', 'wpm', 'مهارت تایپ'],
  'spin-win': ['چرخونه', 'گردونه شانس', 'قرعه کشی', 'انتخاب تصادفی', 'چرخ گردون'],
  'sher-ya-khat': ['شیر یا خط', 'پرتاب سکه', 'شانس', 'تصمیم گیری', 'سکه'],
  tas: ['تاس', 'انداختن تاس', 'تاس آنلاین', 'بازی تاس', 'شانس'],
  'sang-kaghaz-gheychi': ['سنگ کاغذ قیچی', 'بازی با کامپیوتر', 'rock paper scissors'],
  dooz: ['دوز', 'ایکس و او', 'tic tac toe', 'بازی دوز', 'دوز آنلاین', 'ایکس او'],
  'fal-hafez': ['فال حافظ', 'تفال', 'دیوان حافظ', 'غزل حافظ', 'فال', 'لسان الغیب'],
  'borj-tavalod': ['برج تولد', 'طالع بینی', 'ماه تولد', 'برج فلکی', 'صورت فلکی', 'زودیاک'],
  'hayvan-sal': ['حیوان سال', 'طالع چینی', 'سال تولد', 'گاوشماری دوازده حیوانی', 'نماد سال'],
  mbti: ['mbti', 'تست شخصیت', 'مایرز بریگز', 'شانزده تیپ', 'تیپ شخصیتی', 'intj', 'enfp', 'شخصیت شناسی'],
  'big-five': ['پنج عامل بزرگ', 'big five', 'neo', 'مدل پنج عاملی', 'برون گرایی', 'روان رنجوری', 'شخصیت شناسی'],
  enneagram: ['انیاگرام', 'enneagram', 'نه تیپ', 'تیپ شخصیتی', 'بال', 'شخصیت شناسی'],
  disc: ['disc', 'دیسک', 'سبک رفتاری', 'تست رفتاری', 'شخصیت شناسی شغلی'],
  holland: ['هالند', 'holland', 'riasec', 'رغبت سنج', 'تست شغلی', 'مشاوره شغلی', 'انتخاب رشته'],
  'zaban-eshgh': ['زبان عشق', 'پنج زبان عشق', 'love language', 'رابطه', 'عشق', 'زوج'],
  eq: ['هوش هیجانی', 'eq', 'هوش عاطفی', 'خودآگاهی', 'همدلی', 'تست هوش'],
};

/** کلیدواژه‌های یک ابزار (خالی اگر تعریف نشده باشد). */
export const getToolKeywords = (slug: string): string[] => TOOL_KEYWORDS[slug] ?? [];
