'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench, SearchX, Bug, Mail, ArrowUpLeft, Flame } from 'lucide-react';
import { ToolCard } from '@/components/ui/ToolCard';
import { TOOLS, TOOL_CATEGORIES, POPULAR_TOOLS, getCategoryMeta, type Tool } from '@/lib/data/tools';
import { toPersianDigits } from '@/lib/utils/format';

const REPORT_EMAIL = 'baabakbaghaaei@gmail.com';

// دستهٔ ویژهٔ «پرطرفدار» که بالای همهٔ دسته‌ها می‌نشیند (نه یک دستهٔ واقعی در رجیستری).
const POPULAR_TAB = 'پرطرفدار';
const POPULAR_ACCENT = '245, 158, 11'; // amber — «داغ/پرطرفدار»

export default function ToolsIndex() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string>('همه');

  const matchesQuery = (t: Tool, q: string) =>
    !q || t.title.includes(q) || t.desc.includes(q) || t.category.includes(q);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (active === POPULAR_TAB) {
      return POPULAR_TOOLS.filter((t) => matchesQuery(t, q));
    }
    return TOOLS.filter((t) => {
      const matchCat = active === 'همه' || t.category === active;
      return matchCat && matchesQuery(t, q);
    });
  }, [query, active]);

  // فهرست پرطرفدارها برای نمایش در بالای نمای «همه» (با اعمال جستجو).
  const popularInAll = useMemo(() => {
    const q = query.trim();
    return POPULAR_TOOLS.filter((t) => matchesQuery(t, q));
  }, [query]);

  // در نمای «همه» ابزارها بر اساس دسته گروه‌بندی می‌شوند؛ در نمای یک دسته، شبکهٔ ساده.
  const grouped = useMemo(() => {
    if (active !== 'همه') return null;
    return TOOL_CATEGORIES.map((cat) => ({
      cat,
      tools: filtered.filter((t) => t.category === cat),
    })).filter((g) => g.tools.length > 0);
  }, [active, filtered]);

  const tabs = ['همه', POPULAR_TAB, ...TOOL_CATEGORIES];

  return (
    <main className="relative overflow-x-hidden pt-24 pb-32" dir="rtl">
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-primary/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-accent/5 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Hero */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-primary text-xs font-black font-display bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-6"
          >
            <Wrench aria-hidden="true" className="w-3.5 h-3.5" />
            جعبه ابزار
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-black font-display tracking-tight leading-[1.1] mb-5"
          >
            ابزارهای کاربردی،
            <br />
            <span className="text-muted-foreground">سریع و رایگان.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base leading-relaxed"
          >
            مجموعه‌ای رو به رشد از ابزارهای کوچک اما دقیق برای کارهای روزمرهٔ حقوقی، مالی و
            شخصی. همه چیز آفلاین در مرورگر شما اجرا می‌شود.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 mb-12">
          {/* search */}
          <div className="relative w-full lg:max-w-sm">
            <Search aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              name="tool-search"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              placeholder="جستجوی ابزار…"
              aria-label="جستجوی ابزار"
              className="w-full bg-card border border-border rounded-2xl py-3.5 pr-11 pl-4 text-sm font-sans focus:border-foreground/40 outline-none focus-visible:border-foreground/40 transition-colors placeholder:text-muted-foreground/50"
            />
          </div>

          {/* category chips — a single horizontally-scrollable strip on mobile
              (edge-to-edge, no wrap so the row stays one-handed swipeable), then
              a normal wrapping cluster from lg up. */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap snap-x">
            {tabs.map((tab) => {
              const isActive = active === tab;
              const color =
                tab === 'همه'
                  ? null
                  : tab === POPULAR_TAB
                  ? POPULAR_ACCENT
                  : getCategoryMeta(tab).color;
              return (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`inline-flex shrink-0 snap-start items-center gap-2 px-4 py-2 rounded-xl text-xs font-black font-display transition-all border min-h-11 ${
                    isActive
                      ? color
                        ? 'text-white border-transparent'
                        : 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
                  }`}
                  style={
                    color && isActive
                      ? { backgroundColor: `rgb(${color})` }
                      : undefined
                  }
                >
                  {color && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: isActive ? '#fff' : `rgb(${color})` }}
                      aria-hidden
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          <span className="lg:mr-auto text-xs text-muted-foreground/70 font-display">
            {toPersianDigits(filtered.length)} ابزار
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
            <div aria-hidden="true" className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <SearchX className="w-7 h-7" />
            </div>
            <p className="text-muted-foreground font-display">ابزاری با این مشخصات پیدا نشد.</p>
            <button
              onClick={() => {
                setQuery('');
                setActive('همه');
              }}
              className="text-sm text-primary font-black font-display hover:underline"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : grouped ? (
          <div className="space-y-14">
            {/* پرطرفدار — بالای همهٔ دسته‌ها */}
            {popularInAll.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                    style={{
                      background: `rgba(${POPULAR_ACCENT}, 0.12)`,
                      color: `rgb(${POPULAR_ACCENT})`,
                    }}
                  >
                    <Flame className="h-[18px] w-[18px]" strokeWidth={1.9} />
                  </div>
                  <h2 className="font-display text-lg font-black text-foreground">پرطرفدار</h2>
                  <span className="text-xs text-muted-foreground/70 font-display">
                    {toPersianDigits(popularInAll.length)} ابزار
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
                <ToolGrid tools={popularInAll} mixed />
              </section>
            )}
            {grouped.map((group) => {
              const meta = getCategoryMeta(group.cat);
              const CatIcon = meta.icon;
              return (
                <section key={group.cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                      style={{
                        background: `rgba(${meta.color}, 0.1)`,
                        color: `rgb(${meta.color})`,
                      }}
                    >
                      <CatIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </div>
                    <h2 className="font-display text-lg font-black text-foreground">
                      {group.cat}
                    </h2>
                    <span className="text-xs text-muted-foreground/70 font-display">
                      {toPersianDigits(group.tools.length)} ابزار
                    </span>
                    <div className="flex-1 h-px bg-border/60" />
                  </div>
                  <ToolGrid tools={group.tools} />
                </section>
              );
            })}
          </div>
        ) : (
          <ToolGrid tools={filtered} mixed={active === POPULAR_TAB} />
        )}

        {/* Report a problem */}
        <section className="mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 md:p-10">
            <div
              className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.12), transparent 70%)' }}
              aria-hidden
            />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
              <div className="flex items-start gap-4">
                <div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 bg-rose-500/10 text-rose-500">
                  <Bug className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-black text-foreground">گزارش مشکل</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    اگر در یکی از ابزارها به خطای محاسباتی، نتیجهٔ نادرست یا اشکال فنی برخوردید،
                    لطفاً به ما اطلاع دهید. دقت این ابزارها برای ما اهمیت زیادی دارد و گزارش شما
                    به بهبود آن‌ها کمک می‌کند.
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${REPORT_EMAIL}?subject=${encodeURIComponent('گزارش مشکل در جعبه ابزار')}`}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3.5 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                گزارش مشکل
                <ArrowUpLeft aria-hidden="true" className="h-4 w-4 -translate-x-1 opacity-70 transition-transform group-hover:translate-x-0" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/** شبکهٔ کارت ابزارها — کارت‌ها مربعی (مثل صفحهٔ اصلی) با انیمیشن ورود ملایم. */
function ToolGrid({ tools, mixed }: { tools: Tool[]; mixed?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {tools.map((tool, i) => (
        <motion.div
          key={tool.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.3, ease: 'easeOut' }}
          className="aspect-square"
        >
          <ToolCard tool={tool} accent={mixed ? tool.accent : undefined} showCategory={mixed} />
        </motion.div>
      ))}
    </div>
  );
}
