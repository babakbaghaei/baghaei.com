'use client';

import React, { useMemo, useState } from 'react';
import { FileText, AlignLeft, Clock, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Row,
  Headline,
  Notice,
  ShareButton,
  useShareResult,
  PrintButton,
  faNum,
  fmtNum,
} from '@/components/tools/shell';

const ACCENT = '139, 92, 246'; // violet
const WPM = 200; // متوسط سرعت مطالعهٔ فارسی (کلمه در دقیقه)

export default function ShomareshKalamat() {
  const [text, setText] = useState('');
  const { share, copied } = useShareResult();

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const lines = text ? text.split(/\n/).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length : 0;
    const minutes = words / WPM;
    return { words, chars, charsNoSpace, lines, paragraphs, minutes };
  }, [text]);

  const readTime =
    stats.minutes < 1 && stats.words > 0
      ? 'کمتر از ۱ دقیقه'
      : `${faNum(String(Math.ceil(stats.minutes)))} دقیقه`;

  const onShare = () => {
    share({
      title: 'شمارنده کلمات',
      text: `این متن ${faNum(String(stats.words))} کلمه و ${faNum(String(stats.chars))} کاراکتر دارد.`,
    });
  };

  return (
    <ToolShell
      title="شمارنده کلمات و کاراکتر"
      subtitle="شمارش لحظه‌ای کلمات، کاراکترها، خطوط و تخمین زمان مطالعهٔ متن فارسی"
      icon={FileText}
      accent={ACCENT}
      info={[
        {
          icon: <AlignLeft className="w-4 h-4" />,
          title: 'شمارش لحظه‌ای',
          body: 'هم‌زمان با تایپ یا چسباندن متن، تعداد کلمات، کاراکترها (با و بدون فاصله)، خطوط و پاراگراف‌ها به‌روزرسانی می‌شود.',
        },
        {
          icon: <Clock className="w-4 h-4" />,
          title: 'زمان مطالعه',
          body: `تخمین زمان مطالعه بر اساس سرعت متوسط ${faNum(String(WPM))} کلمه در دقیقه محاسبه می‌شود.`,
        },
      ]}
      disclaimer="شمارش کلمات با جداسازی بر اساس فاصله انجام می‌شود و ممکن است با ابزارهای دیگر کمی تفاوت داشته باشد."
    >
      <TwoPane>
        <Panel className="space-y-4">
          <label htmlFor="wc-text" className="text-sm font-bold font-display text-foreground">متن خود را وارد کنید</label>
          <textarea
            id="wc-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="rtl"
            rows={12}
            placeholder="متن را اینجا بنویسید یا بچسبانید…"
            className="w-full bg-background border-2 border-border rounded-2xl p-4 font-sans text-base leading-relaxed text-right focus:border-primary outline-none transition-all resize-y min-h-[260px] text-foreground placeholder:text-muted-foreground/50"
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <div className="space-y-7">
            <Headline accent={ACCENT} label="تعداد کلمات" value={faNum(fmtNum(stats.words, 0))} />
            <div className="space-y-2.5">
              <Row label="کاراکتر (با فاصله)" value={faNum(fmtNum(stats.chars, 0))} />
              <Row label="کاراکتر (بدون فاصله)" value={faNum(fmtNum(stats.charsNoSpace, 0))} />
              <Row label="تعداد خطوط" value={faNum(fmtNum(stats.lines, 0))} />
              <Row label="تعداد پاراگراف" value={faNum(fmtNum(stats.paragraphs, 0))} />
              <div className="h-px bg-border/60 my-1" />
              <Row label="زمان تقریبی مطالعه" value={readTime} strong />
            </div>
            <Notice accent={ACCENT}>برای متن چندپاراگرافی، پاراگراف‌ها را با یک خط خالی از هم جدا کنید.</Notice>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              <PrintButton accent={ACCENT} />
            </div>
          </div>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
