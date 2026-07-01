'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layout as LayoutIcon,
  AppWindow,
  Server,
  Check,
  Minus,
  ArrowUpLeft,
  Sparkles,
  Search,
  PenTool,
  Code2,
  Rocket,
  ShieldCheck,
  Clock,
  Award,
  GitBranch,
  HelpCircle,
  UtensilsCrossed,
  Stethoscope,
  Building2,
  ShoppingBag,
  Scale,
  Dumbbell,
} from 'lucide-react';
import { Section, Heading } from '@/components/ui/Layout';
import { Card } from '@/components/ui/Card';
import { toPersianDigits } from '@/lib/utils/format';

/* ──────────────────────────────────────────────────────────────────
   Accent colors are "r, g, b" strings used inside rgb()/rgba().
   ────────────────────────────────────────────────────────────────── */
type Tier = {
  id: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  accent: string; // "r, g, b"
  priceFrom: string; // already Persian
  unit: string;
  idealFor: string;
  includes: string[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    id: 'website',
    title: 'وب‌سایت و لندینگ',
    tagline: 'حضور آنلاینی که اعتماد می‌سازد',
    icon: LayoutIcon,
    accent: '120, 170, 255',
    priceFrom: `از ${toPersianDigits(45)} میلیون تومان`,
    unit: 'برای یک پروژهٔ کامل',
    idealFor: 'کسب‌وکارها، برندهای شخصی و استارتاپ‌هایی که به یک ویترین آنلاین حرفه‌ای و سریع نیاز دارند.',
    includes: [
      'طراحی اختصاصی و واکنش‌گرا (موبایل تا دسکتاپ)',
      'سرعت بالا و امتیاز سبز Core Web Vitals',
      'سئوی فنی و آمادهٔ نمایه‌سازی در گوگل',
      'فرم تماس، اتصال به تحلیل‌گر و راه‌اندازی',
    ],
  },
  {
    id: 'webapp',
    title: 'وب‌اپلیکیشن و داشبورد',
    tagline: 'محصولی که کاربر هر روز با آن کار می‌کند',
    icon: AppWindow,
    accent: '170, 130, 255',
    priceFrom: `از ${toPersianDigits(120)} میلیون تومان`,
    unit: 'بسته به دامنهٔ محصول',
    idealFor: 'پلتفرم‌های SaaS، پنل‌های مدیریتی و محصولاتی که منطق پیچیده و کاربر واقعی دارند.',
    includes: [
      'معماری کامپوننت‌محور با React و Next.js',
      'پنل مدیریت، احراز هویت و سطوح دسترسی',
      'اتصال به API و مدیریت وضعیت پیچیده',
      'تست، مستندسازی و کد قابل‌نگهداری',
    ],
    featured: true,
  },
  {
    id: 'backend',
    title: 'بک‌اند و زیرساخت',
    tagline: 'موتوری که زیر بار سنگین نمی‌شکند',
    icon: Server,
    accent: '110, 220, 190',
    priceFrom: `از ${toPersianDigits(90)} میلیون تومان`,
    unit: 'بر اساس مقیاس سرویس',
    idealFor: 'سرویس‌های پرترافیک، APIها و سیستم‌هایی که پایداری و امنیت برایشان حیاتی است.',
    includes: [
      'API مقیاس‌پذیر با NestJS و PostgreSQL',
      'صف، کش، و پردازش غیرهم‌زمان (Redis/BullMQ)',
      'استقرار با Docker و خط لولهٔ CI/CD',
      'پایش، لاگ‌گیری و رصد عملکرد (Observability)',
    ],
  },
];

/* ── Industry (صنف) packages ───────────────────────────────────────
   Ready-made starting points tuned to a trade's real needs. Prices are
   honest "starts from" anchors aligned with the tiers above; the exact
   quote follows the discovery call. ──────────────────────────────── */
type Industry = {
  id: string;
  name: string;
  icon: React.ElementType;
  accent: string; // "r, g, b"
  from: string; // Persian, already formatted
  blurb: string;
  needs: string[];
};

const INDUSTRIES: Industry[] = [
  {
    id: 'food',
    name: 'رستوران و کافه',
    icon: UtensilsCrossed,
    accent: '255, 150, 90',
    from: `از ${toPersianDigits(25)} میلیون`,
    blurb: 'منوی دیجیتال، رزرو میز و سفارش آنلاین با طراحی اشتهابرانگیز.',
    needs: ['منوی دیجیتال با QR', 'رزرو و سفارش آنلاین', 'گالری غذا و شبکه‌های اجتماعی'],
  },
  {
    id: 'clinic',
    name: 'پزشک و کلینیک',
    icon: Stethoscope,
    accent: '110, 200, 220',
    from: `از ${toPersianDigits(35)} میلیون`,
    blurb: 'نوبت‌دهی آنلاین و پروفایل تخصصی که بیمار را تا مطب همراهی می‌کند.',
    needs: ['نوبت‌دهی آنلاین', 'پروفایل و تخصص‌ها', 'سئوی نام پزشک در گوگل'],
  },
  {
    id: 'realestate',
    name: 'املاک و مشاور',
    icon: Building2,
    accent: '120, 170, 255',
    from: `از ${toPersianDigits(55)} میلیون`,
    blurb: 'بانک فایل ملک با جستجوی پیشرفته، پنل مشاور و اتصال به نقشه.',
    needs: ['ثبت و جستجوی فایل', 'پنل مشاورین', 'فیلتر قیمت و نقشهٔ ملک'],
  },
  {
    id: 'shop',
    name: 'فروشگاه و برند',
    icon: ShoppingBag,
    accent: '170, 130, 255',
    from: `از ${toPersianDigits(70)} میلیون`,
    blurb: 'فروشگاه اینترنتی سریع با درگاه پرداخت و مدیریت انبار.',
    needs: ['سبد خرید و درگاه پرداخت', 'مدیریت محصول و انبار', 'کد تخفیف و باشگاه مشتری'],
  },
  {
    id: 'legal',
    name: 'وکیل و خدمات حقوقی',
    icon: Scale,
    accent: '200, 180, 120',
    from: `از ${toPersianDigits(30)} میلیون`,
    blurb: 'وب‌سایت رسمی با رزرو وقت مشاوره و ابزارهای حقوقی کاربردی.',
    needs: ['رزرو وقت مشاوره', 'مقالات و سئوی تخصصی', 'ابزارهای محاسبهٔ حقوقی'],
  },
  {
    id: 'fitness',
    name: 'باشگاه و مجموعهٔ ورزشی',
    icon: Dumbbell,
    accent: '110, 220, 160',
    from: `از ${toPersianDigits(40)} میلیون`,
    blurb: 'ثبت‌نام و رزرو کلاس، معرفی مربیان و فروش اشتراک آنلاین.',
    needs: ['رزرو کلاس و سانس', 'پروفایل مربیان', 'فروش و تمدید اشتراک'],
  },
];

/* ── Comparison matrix ─────────────────────────────────────────── */
const COMPARE_COLS = ['وب‌سایت', 'وب‌اپ', 'بک‌اند'];
const COMPARE_ROWS: { label: string; cells: boolean[] }[] = [
  { label: 'طراحی رابط کاربری اختصاصی', cells: [true, true, false] },
  { label: 'سئوی فنی و سرعت', cells: [true, true, false] },
  { label: 'پنل مدیریت و احراز هویت', cells: [false, true, true] },
  { label: 'API و پایگاه‌دادهٔ مقیاس‌پذیر', cells: [false, true, true] },
  { label: 'استقرار، CI/CD و پایش', cells: [false, true, true] },
  { label: 'بازبینی معماری و کد', cells: [false, false, true] },
  { label: 'تحویل کامل سورس‌کد', cells: [true, true, true] },
  { label: 'پشتیبانی پس از تحویل', cells: [true, true, true] },
];

/* ── Market / competitor benchmark ─────────────────────────────────
   Honest positioning against the real alternatives a business weighs —
   a site-builder/template, a solo freelancer, and a full ad-agency —
   without naming or disparaging any specific company. Cell values:
   'yes' | 'partial' | 'no' | free text (rendered as-is). ──────────── */
const MARKET_COLS = ['قالب آماده / سایت‌ساز', 'فریلنسر', 'آژانس تبلیغاتی', 'گروه فناوری بقائی'];
const MARKET_ROWS: { label: string; cells: string[] }[] = [
  { label: 'طراحی کاملاً اختصاصی (نه قالب)', cells: ['no', 'partial', 'yes', 'yes'] },
  { label: 'مهندس ارشد پشت پروژه', cells: ['no', 'partial', 'partial', 'yes'] },
  { label: 'سرعت و سئوی فنی واقعی', cells: ['no', 'partial', 'partial', 'yes'] },
  { label: 'مالکیت کامل سورس‌کد', cells: ['no', 'yes', 'partial', 'yes'] },
  { label: 'بک‌اند و مقیاس‌پذیری اختصاصی', cells: ['no', 'partial', 'no', 'yes'] },
  { label: 'ارتباط مستقیم و بدون واسطه', cells: ['no', 'yes', 'no', 'yes'] },
  { label: 'پشتیبانی و نگه‌داری بلندمدت', cells: ['partial', 'no', 'yes', 'yes'] },
  { label: 'محدودهٔ هزینه', cells: ['کم', 'کم تا متوسط', 'زیاد', 'متوسط و منصفانه'] },
];

/* ── Process timeline ──────────────────────────────────────────── */
const PROCESS = [
  {
    n: '۰۱',
    title: 'کشف',
    desc: 'گفتگوی عمیق دربارهٔ هدف، کاربر و محدودیت‌ها تا مسئله را دقیق بفهمیم.',
    icon: Search,
  },
  {
    n: '۰۲',
    title: 'طراحی',
    desc: 'معماری فنی و تجربهٔ کاربری پیش از کدنویسی روی کاغذ شکل می‌گیرد.',
    icon: PenTool,
  },
  {
    n: '۰۳',
    title: 'توسعه',
    desc: 'پیاده‌سازی تدریجی با تحویل‌های منظم تا همیشه در جریان پیشرفت باشید.',
    icon: Code2,
  },
  {
    n: '۰۴',
    title: 'تحویل و پشتیبانی',
    desc: 'استقرار نهایی، انتقال کامل دانش و همراهی برای پایداری بلندمدت.',
    icon: Rocket,
  },
];

/* ── Trust signals ─────────────────────────────────────────────── */
const TRUST = [
  { value: '۱۱', suffix: 'سال', label: 'تجربهٔ مهندسی', icon: Award },
  { value: '۵۰', suffix: '+', label: 'پروژهٔ واقعی', icon: GitBranch },
  { value: '۱۰۰', suffix: '٪', label: 'مالکیت کد با شما', icon: ShieldCheck },
  { value: '۲۴', suffix: '/۷', label: 'دسترسی در پروژه', icon: Clock },
];

/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: 'پرداخت چگونه انجام می‌شود؟',
    a: 'پرداخت مرحله‌ای است: بخشی در شروع کار به‌عنوان پیش‌پرداخت، و باقی در سررسید هر فاز تحویل. این مدل ریسک هر دو طرف را کم می‌کند و شما همیشه در ازای پرداخت، خروجی می‌بینید.',
  },
  {
    q: 'زمان تحویل پروژه چقدر است؟',
    a: 'یک لندینگ معمولاً در دو تا سه هفته آماده می‌شود؛ یک وب‌اپلیکیشن کامل بسته به دامنه، بین یک تا سه ماه. زمان‌بندی دقیق پس از مرحلهٔ کشف و به‌صورت شفاف اعلام می‌شود.',
  },
  {
    q: 'پس از تحویل، پشتیبانی دارید؟',
    a: 'بله. هر پروژه با یک دورهٔ پشتیبانی برای رفع اشکال تحویل می‌شود و امکان عقد قرارداد نگه‌داری و توسعهٔ مستمر نیز وجود دارد. شما هیچ‌وقت با محصول تنها نمی‌مانید.',
  },
  {
    q: 'مالکیت کد با چه کسی است؟',
    a: 'تمام سورس‌کد، دارایی‌ها و مخزن پروژه به‌طور کامل به شما تعلق می‌گیرد. هیچ قفل یا وابستگی پنهانی وجود ندارد و می‌توانید در آینده با هر تیمی ادامه دهید.',
  },
];

/* ──────────────────────────────────────────────────────────────── */

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const Icon = tier.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07 }}
      className="h-full"
    >
      <Card
        roundedClass="rounded-[2rem]"
        className="p-2"
        contentClassName="p-8"
        isHoverable
        colorOnHoverOnly
        glowColor={`rgba(${tier.accent}, 0.16)`}
      >
        <div
          className="flex h-full w-full flex-col text-right"
          dir="rtl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {tier.featured && (
            <div
              className="absolute top-0 left-8 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-black font-display"
              style={{
                transform: 'translateZ(60px) translateY(-50%)',
                background: `rgba(${tier.accent}, 0.18)`,
                color: `rgb(${tier.accent})`,
                border: `1px solid rgba(${tier.accent}, 0.35)`,
              }}
            >
              <Sparkles className="h-3 w-3" />
              محبوب‌ترین
            </div>
          )}

          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              transform: 'translateZ(45px)',
              background: `rgba(${tier.accent}, 0.12)`,
              color: `rgb(${tier.accent})`,
            }}
          >
            <Icon className="h-6 w-6" strokeWidth={1.6} />
          </div>

          <div className="mt-6" style={{ transform: 'translateZ(30px)' }}>
            <h3 className="font-display text-xl font-black text-foreground">
              {tier.title}
            </h3>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
              {tier.tagline}
            </p>
          </div>

          {/* price signal */}
          <div className="mt-6" style={{ transform: 'translateZ(35px)' }}>
            <div
              className="font-display text-lg font-black"
              style={{ color: `rgb(${tier.accent})` }}
            >
              {tier.priceFrom}
            </div>
            <div className="mt-0.5 font-sans text-xs text-muted-foreground">
              {tier.unit}
            </div>
          </div>

          {/* includes */}
          <ul className="mt-6 space-y-2.5" style={{ transform: 'translateZ(20px)' }}>
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `rgba(${tier.accent}, 0.16)`,
                    color: `rgb(${tier.accent})`,
                  }}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span className="font-sans text-[0.82rem] leading-relaxed text-muted-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* ideal for */}
          <div
            className="mt-6 rounded-2xl border border-border bg-background/40 p-3.5"
            style={{ transform: 'translateZ(15px)' }}
          >
            <span className="font-display text-[0.7rem] font-black text-foreground">
              مناسب برای:
            </span>
            <p className="mt-1 font-sans text-[0.78rem] leading-relaxed text-muted-foreground">
              {tier.idealFor}
            </p>
          </div>

          <Link
            href="/#contact"
            className="group/btn mt-7 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black font-display transition-transform hover:scale-[1.02]"
            style={{
              transform: 'translateZ(25px)',
              background: `rgba(${tier.accent}, 0.14)`,
              color: `rgb(${tier.accent})`,
              border: `1px solid rgba(${tier.accent}, 0.3)`,
            }}
          >
            دریافت مشاوره
            <ArrowUpLeft className="h-4 w-4 opacity-70 transition-transform group-hover/btn:-translate-x-1" />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

export default function PricingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="relative overflow-x-hidden" dir="rtl">
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-accent/5 blur-[150px] rounded-full" />
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative z-10 pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-primary text-xs font-black font-display bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            راه‌کارها و قیمت‌گذاری
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-7xl font-black font-display tracking-tight leading-[1.1] max-w-4xl"
          >
            یک مهندس ارشد،
            <br />
            <span className="text-muted-foreground">پشت هر خط کد.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            اینجا با یک آژانس بزرگ طرف نیستید؛ با یک مهندس نرم‌افزار که یازده سال است
            سیستم‌های واقعی می‌سازد. هر پروژه مستقیم و بدون واسطه پیش می‌رود. در ادامه،
            بسته‌ها و محدودهٔ قیمت را شفاف می‌بینید تا با خیال راحت تصمیم بگیرید.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-7 py-4 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
            >
              شروع گفتگوی پروژه
              <ArrowUpLeft className="h-4 w-4 opacity-70 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/30 px-7 py-4 text-sm font-black font-display text-foreground transition-colors hover:bg-card/60"
            >
              دیدن نمونه‌کارها
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Tiers ──────────────────────────────────────────── */}
      <Section className="bg-transparent !py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>
        <p className="mt-8 text-center font-sans text-xs text-muted-foreground">
          قیمت‌های بالا «شروع از» هستند و برآورد نهایی پس از مرحلهٔ کشف و بر اساس
          دامنهٔ دقیق پروژه اعلام می‌شود.
        </p>
      </Section>

      {/* ── Industry packages (صنف) ────────────────────────── */}
      <Section className="border-t border-border bg-transparent !py-24">
        <Heading subtitle="صنف شما">بسته‌های</Heading>
        <p className="-mt-10 mb-12 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
          هر صنف نیاز خودش را دارد. این بسته‌ها نقطهٔ شروعِ آماده و متناسب با کارِ
          شماست؛ همه روی همان زیرساخت مهندسی‌شده ساخته می‌شوند و رقم نهایی پس از
          گفتگو دقیق می‌شود.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                className="h-full"
              >
                <Card
                  roundedClass="rounded-[2rem]"
                  className="p-2"
                  contentClassName="p-7"
                  isHoverable
                  colorOnHoverOnly
                  glowColor={`rgba(${ind.accent}, 0.16)`}
                >
                  <div
                    className="flex h-full w-full flex-col text-right"
                    dir="rtl"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{
                          transform: 'translateZ(45px)',
                          background: `rgba(${ind.accent}, 0.12)`,
                          color: `rgb(${ind.accent})`,
                        }}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.6} />
                      </div>
                      <span
                        className="font-display text-sm font-black"
                        style={{ color: `rgb(${ind.accent})` }}
                      >
                        {ind.from}
                      </span>
                    </div>
                    <h3
                      className="mt-5 font-display text-lg font-black text-foreground"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      {ind.name}
                    </h3>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
                      {ind.blurb}
                    </p>
                    <ul className="mt-5 space-y-2.5" style={{ transform: 'translateZ(20px)' }}>
                      {ind.needs.map((n) => (
                        <li key={n} className="flex items-start gap-2.5">
                          <span
                            className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                            style={{
                              background: `rgba(${ind.accent}, 0.16)`,
                              color: `rgb(${ind.accent})`,
                            }}
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                          <span className="font-sans text-[0.82rem] leading-relaxed text-muted-foreground">
                            {n}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/#contact"
                      className="group/btn mt-auto pt-6 inline-flex items-center gap-2 text-sm font-black font-display transition-transform"
                      style={{ color: `rgb(${ind.accent})` }}
                    >
                      استعلام بستهٔ این صنف
                      <ArrowUpLeft className="h-4 w-4 opacity-70 transition-transform group-hover/btn:-translate-x-1" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── Comparison ─────────────────────────────────────── */}
      <Section className="border-t border-border bg-transparent !py-24">
        <Heading subtitle="بسته‌ها">مقایسهٔ</Heading>
        <div className="overflow-x-auto rounded-[2rem] border border-border bg-card/20">
          <table className="w-full min-w-[640px] border-collapse text-right">
            <thead>
              <tr className="border-b border-border">
                <th className="p-5 font-display text-sm font-black text-foreground">
                  امکانات
                </th>
                {COMPARE_COLS.map((c) => (
                  <th
                    key={c}
                    className="p-5 text-center font-display text-sm font-black text-foreground"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border/60 last:border-0 transition-colors hover:bg-card/30"
                >
                  <td className="p-5 font-sans text-sm text-muted-foreground">
                    {row.label}
                  </td>
                  {row.cells.map((cell, idx) => (
                    <td key={idx} className="p-5 text-center">
                      {cell ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground/40">
                          <Minus className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Market / competitor benchmark ──────────────────── */}
      <Section className="border-t border-border bg-transparent !py-24">
        <Heading subtitle="گزینه‌های بازار">مقایسه با</Heading>
        <p className="-mt-10 mb-10 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
          پیش از تصمیم، طبیعی است چند گزینه را کنار هم بگذارید. این مقایسهٔ
          صادقانه نشان می‌دهد هر مسیر چه می‌دهد و چه نمی‌دهد — بدون بزرگ‌نمایی.
        </p>
        <div className="overflow-x-auto rounded-[2rem] border border-border bg-card/20">
          <table className="w-full min-w-[720px] border-collapse text-right">
            <thead>
              <tr className="border-b border-border">
                <th className="p-5 font-display text-sm font-black text-foreground">معیار</th>
                {MARKET_COLS.map((c, idx) => (
                  <th
                    key={c}
                    className={`p-5 text-center font-display text-sm font-black ${
                      idx === MARKET_COLS.length - 1 ? 'bg-primary/5 text-primary' : 'text-foreground'
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARKET_ROWS.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border/60 last:border-0 transition-colors hover:bg-card/30"
                >
                  <td className="p-5 font-sans text-sm text-muted-foreground">{row.label}</td>
                  {row.cells.map((cell, idx) => {
                    const highlight = idx === row.cells.length - 1;
                    return (
                      <td key={idx} className={`p-5 text-center ${highlight ? 'bg-primary/5' : ''}`}>
                        {cell === 'yes' ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        ) : cell === 'no' ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground/40">
                            <Minus className="h-3.5 w-3.5" />
                          </span>
                        ) : cell === 'partial' ? (
                          <span className="inline-flex h-6 items-center justify-center rounded-full bg-amber-400/15 px-2.5 text-[0.7rem] font-black text-amber-500">
                            محدود
                          </span>
                        ) : (
                          <span
                            className={`font-display text-[0.8rem] font-black ${
                              highlight ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {cell}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center font-sans text-xs text-muted-foreground">
          این مقایسه کلی و صادقانه است؛ استثنا همیشه هست، اما تمرکز ما کیفیت
          مهندسی و ارزش بلندمدت برای شماست.
        </p>
      </Section>

      {/* ── Process ────────────────────────────────────────── */}
      <Section className="border-t border-border bg-transparent !py-24">
        <Heading subtitle="کار">مسیر</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="h-full"
              >
                <Card
                  roundedClass="rounded-[2rem]"
                  className="p-2"
                  contentClassName="p-7"
                  isHoverable
                  colorOnHoverOnly
                >
                  <div className="flex h-full w-full flex-col" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/[0.06] text-foreground"
                        style={{ transform: 'translateZ(45px)' }}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.6} />
                      </div>
                      <span className="font-display text-3xl font-black text-foreground/10 tabular-nums">
                        {step.n}
                      </span>
                    </div>
                    <h3
                      className="mt-5 font-display text-lg font-black text-foreground"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── Trust signals ──────────────────────────────────── */}
      <section className="relative z-10 border-t border-border bg-transparent !py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
          {TRUST.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="h-full"
              >
                <Card
                  roundedClass="rounded-[2rem]"
                  className="p-2"
                  contentClassName="p-8"
                  isHoverable
                  colorOnHoverOnly
                >
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/[0.06] text-foreground"
                      style={{ transform: 'translateZ(45px)' }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span
                      className="text-3xl md:text-5xl font-black font-display text-foreground tabular-nums"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      {s.value}
                      <span className="text-xl md:text-2xl text-muted-foreground">
                        {s.suffix}
                      </span>
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground font-display">
                      {s.label}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <Section className="bg-transparent !py-24">
        <Heading subtitle="متداول">پرسش‌های</Heading>
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-[1.5rem] border border-border bg-card/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 p-6 text-right transition-colors hover:bg-card/40"
                >
                  <span className="flex items-center gap-3 font-display text-base font-black text-foreground">
                    <HelpCircle
                      className="h-5 w-5 flex-shrink-0 text-primary/70"
                      strokeWidth={1.6}
                    />
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-2xl font-light text-muted-foreground"
                  >
                    +
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 pr-14 font-sans text-sm leading-loose text-muted-foreground">
                    {item.a}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <Section className="border-t border-border bg-transparent !py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/40 p-10 md:p-16 text-center">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--primary)/0.25), transparent 70%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-black font-display text-foreground leading-tight">
              پروژه‌ای در ذهن دارید؟
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground text-base leading-relaxed">
              یک پیام بفرستید و دامنهٔ کار را با هم روشن کنیم. برآورد اولیه و نقشهٔ
              راه را بدون هیچ تعهدی دریافت می‌کنید.
            </p>
            <Link
              href="/#contact"
              className="group mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-7 py-4 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
            >
              دریافت برآورد رایگان
              <ArrowUpLeft className="h-4 w-4 opacity-70 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
