'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  SearchCode,
  Share2,
  Code2,
  ShieldCheck,
  Cloud,
  BrainCircuit,
  Sparkles,
  ArrowUpLeft,
  Target,
  Gem,
  Compass,
} from 'lucide-react';
import { Section, Heading } from '@/components/ui/Layout';
import { Card } from '@/components/ui/Card';

const EXPERTISE = [
  {
    title: 'تحلیل و مشاوره',
    desc: 'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.',
    icon: SearchCode,
  },
  {
    title: 'مهندسی معماری',
    desc: 'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.',
    icon: Share2,
  },
  {
    title: 'توسعهٔ محصول',
    desc: 'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.',
    icon: Code2,
  },
  {
    title: 'امنیت سایبری',
    desc: 'تست نفوذ و ایمن‌سازی زیرساخت‌های حیاتی در برابر تهدیدات پیشرفته.',
    icon: ShieldCheck,
  },
  {
    title: 'زیرساخت ابری',
    desc: 'مدیریت و خودکارسازی سرویس‌ها با تکنولوژی‌های Docker و Kubernetes.',
    icon: Cloud,
  },
  {
    title: 'هوش مصنوعی',
    desc: 'توسعه و ادغام مدل‌های یادگیری ماشین برای هوشمندسازی فرآیندهای کسب‌وکار.',
    icon: BrainCircuit,
  },
];

const VALUES = [
  {
    title: 'دقت مهندسی',
    desc: 'هر خط کد با وسواس نوشته می‌شود؛ کیفیت برای ما یک انتخاب نیست، یک اصل است.',
    icon: Target,
  },
  {
    title: 'پایداری بلندمدت',
    desc: 'سیستم‌هایی می‌سازیم که سال‌ها بدون شکست، زیر بار سنگین می‌مانند.',
    icon: Compass,
  },
  {
    title: 'ظرافت در طراحی',
    desc: 'تجربهٔ کاربری و زیبایی بصری را هم‌سطح عملکرد فنی جدی می‌گیریم.',
    icon: Gem,
  },
];

const STATS = [
  { value: '۱۰+', label: 'سال تجربه' },
  { value: '۵۰+', label: 'پروژهٔ موفق' },
  { value: '۹۹.۹٪', label: 'پایداری سرویس' },
  { value: '۲۴/۷', label: 'پشتیبانی' },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden" dir="rtl">
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-accent/5 blur-[150px] rounded-full" />
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative z-10 pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-primary text-xs font-black font-display bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            درباره ما
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-7xl font-black font-display tracking-tight leading-[1.1] max-w-4xl"
          >
            مهندسی، فراتر از
            <br />
            <span className="text-muted-foreground">مرز کدها.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            گروه فناوری بقایی تیمی از مهندسان نرم‌افزار است که با تمرکز بر معماری
            سیستم‌های سازمانی مقیاس‌پذیر، راهکارهایی پایدار و دقیق برای پیچیده‌ترین
            چالش‌های فنی طراحی می‌کند. ما باور داریم که نرم‌افزار خوب، نامرئی است؛
            بی‌صدا کار می‌کند و اعتماد می‌سازد.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center justify-center gap-2 py-12 border-border first:border-r-0 md:[&:not(:first-child)]:border-r"
            >
              <span className="text-3xl md:text-5xl font-black font-display text-foreground tabular-nums">
                {s.value}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground font-display">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Story / Mission ───────────────────────────────── */}
      <Section className="bg-transparent">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Heading subtitle="ما">داستان</Heading>
          </div>
          <div className="lg:col-span-7 space-y-6 text-muted-foreground text-base md:text-lg leading-loose">
            <p>
              ما کار خود را با یک باور ساده آغاز کردیم: کیفیت مهندسی نباید فدای سرعت
              شود. در دنیایی که محصولات با عجله ساخته و رها می‌شوند، ما مسیر متفاوتی
              را انتخاب کردیم؛ ساختن سیستم‌هایی که می‌مانند.
            </p>
            <p>
              از زیرساخت‌های فرودگاهی حساس تا بازارهای آنلاین پرترافیک و پلتفرم‌های
              امنیتی ملی، تجربهٔ ما در دل پروژه‌هایی شکل گرفته که در آن‌ها خطا
              پذیرفتنی نیست. این سخت‌گیری، امروز به امضای ما تبدیل شده است.
            </p>
            <p className="text-foreground font-medium">
              امروز، گروه فناوری بقایی پلی است میان ایده‌های بزرگ و اجرای بی‌نقص.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Expertise ─────────────────────────────────────── */}
      <Section className="border-t border-border bg-transparent">
        <Heading subtitle="ما">تخصص‌های</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERTISE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="h-[220px]"
              >
                <Card
                  roundedClass="rounded-[2rem]"
                  className="p-2"
                  contentClassName="p-7"
                  isHoverable
                  colorOnHoverOnly
                >
                  <div
                    className="flex h-full w-full flex-col text-right"
                    dir="rtl"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </div>
                    <div className="mt-auto" style={{ transform: 'translateZ(25px)' }}>
                      <h3 className="font-display text-lg font-black text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── Values ────────────────────────────────────────── */}
      <Section className="border-t border-border bg-transparent">
        <Heading subtitle="ما">ارزش‌های</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {VALUES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-start gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-foreground">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-black text-foreground">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <Section className="border-t border-border bg-transparent">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/40 p-10 md:p-16 text-center">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.25), transparent 70%)' }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-black font-display text-foreground leading-tight">
              ایده‌ای در سر دارید؟
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground text-base leading-relaxed">
              بیایید دربارهٔ آن گفتگو کنیم. تیم ما آمادهٔ تبدیل پیچیده‌ترین چالش‌های
              فنی شما به محصولی پایدار و دقیق است.
            </p>
            <Link
              href="/#contact"
              className="group mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-7 py-4 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
            >
              شروع گفتگو
              <ArrowUpLeft className="h-4 w-4 -translate-x-1 opacity-70 transition-transform group-hover:translate-x-0" />
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
