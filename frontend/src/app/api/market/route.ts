import { NextResponse } from 'next/server';

/**
 * نرخ لحظه‌ای بازار طلا و سکه (و دلار) برای ابزارهای «ارزش طلا» و «مهریه».
 *
 * منبع: فید عمومی و رایگان tgju (بدون کلید). مقادیر منبع به «ریال» است؛ این روت
 * آن‌ها را به «تومان» (÷۱۰) تبدیل و گرد می‌کند. روی سرور fetch می‌شود (بدون CORS)
 * و خروجی هر ۳۰ دقیقه کش می‌شود تا فشار به مبدأ کم بماند و پاسخ سریع باشد.
 *
 * پایداری: چند میزبان tgju به‌ترتیب امتحان می‌شوند؛ اگر یکی از کار افتاد یا از سمت
 * سرور مسدود بود، میزبان بعدی جایگزین می‌شود. تنها وقتی همه شکست بخورند خطا
 * برمی‌گردد و کلاینت به ورودی دستی برمی‌گردد.
 *
 * قرارداد پاسخ:
 *   { ok: true,  updatedAt: string, source, prices: { gram18, gram24, sekee, nim, rob, mesghal, dollar } }  // تومان
 *   { ok: false, error: string }                                                                            // کلاینت به ورودی دستی برمی‌گردد
 */

export const revalidate = 1800; // ۳۰ دقیقه

// میزبان‌های جایگزین tgju؛ به‌ترتیب امتحان می‌شوند تا نخستین پاسخ معتبر.
const SOURCE_URLS = [
  'https://call3.tgju.org/ajax.json',
  'https://call1.tgju.org/ajax.json',
  'https://call2.tgju.org/ajax.json',
];

// نگاشت کلید مبدأ → کلید خروجی.
const KEYS: Record<string, string> = {
  geram18: 'gram18',
  geram24: 'gram24',
  sekee: 'sekee',
  nim: 'nim',
  rob: 'rob',
  mesghal: 'mesghal',
  price_dollar_rl: 'dollar',
};

/** «۱۶۰,۸۵۲,۰۰۰» یا "160,852,000" ریال → عدد تومان. */
function rialStrToToman(p: unknown): number | null {
  if (typeof p !== 'string' && typeof p !== 'number') return null;
  const digits = String(p)
    .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
    .replace(/[^\d]/g, '');
  if (!digits) return null;
  const rial = Number(digits);
  if (!Number.isFinite(rial) || rial <= 0) return null;
  return Math.round(rial / 10);
}

interface Parsed {
  prices: Record<string, number>;
  updatedAt: string;
}

/** یک میزبان tgju را می‌گیرد و قیمت‌ها را استخراج می‌کند؛ در صورت شکست null. */
async function fetchFrom(url: string): Promise<Parsed | null> {
  const res = await fetch(url, {
    headers: {
      // tgju برخی درخواست‌های بدون UID مرورگری را رد می‌کند.
      'User-Agent': 'Mozilla/5.0 (compatible; baghaei-tools/1.0; +https://baghaei.com)',
      Accept: 'application/json,text/plain,*/*',
    },
    next: { revalidate },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const current = json?.current ?? {};

  const prices: Record<string, number> = {};
  let updatedAt = '';
  for (const [src, out] of Object.entries(KEYS)) {
    const node = current[src];
    const toman = rialStrToToman(node?.p);
    if (toman != null) {
      prices[out] = toman;
      if (!updatedAt && typeof node?.ts === 'string') updatedAt = node.ts;
    }
  }

  if (Object.keys(prices).length === 0) return null;
  return { prices, updatedAt };
}

export async function GET() {
  let lastError = 'source unavailable';
  for (const url of SOURCE_URLS) {
    try {
      const parsed = await fetchFrom(url);
      if (parsed) {
        return NextResponse.json({
          ok: true,
          source: 'tgju',
          updatedAt: parsed.updatedAt,
          prices: parsed.prices,
        });
      }
      lastError = 'no prices parsed';
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'fetch failed';
    }
  }

  return NextResponse.json({ ok: false, error: lastError }, { status: 502 });
}
