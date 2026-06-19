/**
 * نرخ تورم سالانه — بانک مرکزی جمهوری اسلامی ایران
 *   منبع رسمی: https://cbi.ir/Inflation/Inflation_FA.aspx
 *
 * این ماژول مبنای محاسبه «خسارت تأخیر تأدیه» بر اساس ماده ۵۲۲ قانون آیین
 * دادرسی مدنی و رأی وحدت رویه شماره ۸۵۰ هیأت عمومی دیوان عالی کشور
 * (۱۴۰۳/۵/۳۱) است که ملاک را «متوسط شاخص سالانه» قرار داده است.
 *
 * داده‌های پایه، «نرخ تورم سالانه» رسمی بانک مرکزی هستند (درصد تغییر متوسط
 * شاخص هر سال نسبت به سال قبل). از زنجیرکردن این نرخ‌ها، شاخص سالانه
 * بازسازی می‌شود. چون فرمول ماده ۵۲۲ نسبت دو شاخص است، سال پایه در نتیجه
 * بی‌اثر است؛ برای آشنایی، پایه ۱۳۹۵=۱۰۰ نگه داشته شده است.
 *
 * هر مقدار CPI_INFLATION[y]، نرخ تورم سال y نسبت به سال y-۱ است.
 */

export const CPI_SOURCE = 'بانک مرکزی جمهوری اسلامی ایران';
export const CPI_SOURCE_URL = 'https://cbi.ir/Inflation/Inflation_FA.aspx';

/** سال پایهٔ نمادین برای زنجیرهٔ شاخص (در نسبت بی‌اثر است). */
export const CPI_BASE_YEAR = 1395;

/**
 * نرخ تورم سالانهٔ رسمی (درصد). کلید = سال، مقدار = نرخ تورم آن سال نسبت
 * به سال قبل. سال ۱۳۱۵ لنگرِ ابتدایی زنجیره است و نرخ ندارد.
 */
export const CPI_INFLATION: Record<number, number> = {
  1316: 21.2,
  1317: 8.8,
  1318: 8.0,
  1319: 13.8,
  1320: 49.5,
  1321: 96.2,
  1322: 110.5,
  1323: 2.7,
  1324: -14.4,
  1325: -11.5,
  1326: 6.6,
  1327: 11.1,
  1328: 2.3,
  1329: -17.2,
  1330: 8.3,
  1331: 7.2,
  1332: 9.2,
  1333: 15.9,
  1334: 1.7,
  1335: 8.8,
  1336: 4.4,
  1337: 1.0,
  1338: 13.0,
  1339: 7.9,
  1340: 1.6,
  1341: 0.9,
  1342: 1.0,
  1343: 4.5,
  1344: 0.3,
  1345: 0.8,
  1346: 0.8,
  1347: 1.5,
  1348: 3.6,
  1349: 1.5,
  1350: 5.5,
  1351: 6.3,
  1352: 11.2,
  1353: 15.5,
  1354: 9.9,
  1355: 16.6,
  1356: 25.1,
  1357: 10.0,
  1358: 11.4,
  1359: 23.5,
  1360: 22.8,
  1361: 19.2,
  1362: 14.8,
  1363: 10.4,
  1364: 6.9,
  1365: 23.7,
  1366: 27.7,
  1367: 28.9,
  1368: 17.4,
  1369: 9.0,
  1370: 20.7,
  1371: 24.4,
  1372: 22.9,
  1373: 35.2,
  1374: 49.4,
  1375: 23.2,
  1376: 17.3,
  1377: 18.1,
  1378: 20.1,
  1379: 12.6,
  1380: 11.4,
  1381: 15.8,
  1382: 15.6,
  1383: 15.2,
  1384: 10.4,
  1385: 11.9,
  1386: 18.4,
  1387: 25.4,
  1388: 10.8,
  1389: 12.4,
  1390: 21.5,
  1391: 30.5,
  1392: 34.7,
  1393: 15.6,
  1394: 11.9,
  1395: 9.0,
  1396: 9.6,
  1397: 31.2,
  1398: 41.2,
  1399: 47.1,
  1400: 46.2,
  1401: 53.1,
  1402: 47.4,
  1403: 35.8,
  1404: 48.3,
};

/** نرخ تورم نقطه‌به‌نقطهٔ ماه‌های منتشرشدهٔ سال جاری. */
export const CPI_LATEST_MONTHLY = [
  { month: 'فروردین', year: 1405, rate: 50.6 },
  { month: 'اردیبهشت', year: 1405, rate: 53.9 },
] as const;

/**
 * سال جاری که هنوز متوسط سالانهٔ آن منتشر نشده است. شاخص آن به‌صورت
 * «تخمینی» از آخرین نرخ تورم نقطه‌به‌نقطهٔ منتشرشده بازسازی می‌شود و باید
 * در رابط کاربری به‌عنوان مقدار غیرقطعی نشان داده شود.
 */
export const CPI_PROVISIONAL_YEAR = CPI_LATEST_MONTHLY[CPI_LATEST_MONTHLY.length - 1].year;

/** مجموعهٔ سال‌های تخمینی (متوسط سالانه هنوز منتشر نشده). */
export const CPI_PROVISIONAL_YEARS: ReadonlySet<number> = new Set([CPI_PROVISIONAL_YEAR]);

/** آیا شاخص این سال تخمینی است؟ */
export const isProvisionalYear = (year: number) => CPI_PROVISIONAL_YEARS.has(year);

/**
 * شاخص سالانهٔ بازسازی‌شده از زنجیرهٔ نرخ‌های رسمی، با لنگر CPI_BASE_YEAR=۱۰۰.
 *   index[y] = index[y-1] × (۱ + نرخ[y]/۱۰۰)
 * سال جاری (تخمینی) از آخرین نرخ تورم نقطه‌به‌نقطه اضافه می‌شود.
 */
function buildAnnualIndex(): Record<number, number> {
  const years = Object.keys(CPI_INFLATION)
    .map(Number)
    .sort((a, b) => a - b);
  const minYear = years[0] - 1; // لنگر ابتدایی (۱۳۱۵)
  const idx: Record<number, number> = { [CPI_BASE_YEAR]: 100 };

  // رو به جلو از سال پایه
  for (let y = CPI_BASE_YEAR + 1; y <= years[years.length - 1]; y++) {
    idx[y] = idx[y - 1] * (1 + CPI_INFLATION[y] / 100);
  }
  // رو به عقب از سال پایه
  for (let y = CPI_BASE_YEAR - 1; y >= minYear; y--) {
    idx[y] = idx[y + 1] / (1 + CPI_INFLATION[y + 1] / 100);
  }

  // سال جاری (تخمینی): شاخص سال کامل قبل × (۱ + آخرین نرخ نقطه‌به‌نقطه)
  const latest = CPI_LATEST_MONTHLY[CPI_LATEST_MONTHLY.length - 1];
  if (idx[latest.year - 1] != null) {
    idx[latest.year] = idx[latest.year - 1] * (1 + latest.rate / 100);
  }
  return idx;
}

export const CPI_INDEX: Record<number, number> = buildAnnualIndex();

/** سال‌های دارای شاخص، صعودی (۱۳۱۵ تا سال جاری). */
export const CPI_YEARS = Object.keys(CPI_INDEX)
  .map(Number)
  .sort((a, b) => a - b);

export const CPI_MIN_YEAR = CPI_YEARS[0];
export const CPI_MAX_YEAR = CPI_YEARS[CPI_YEARS.length - 1];

/** آخرین سالی که متوسط تورم سالانهٔ آن به‌صورت قطعی منتشر شده است. */
export const CPI_LAST_COMPLETE_YEAR = Math.max(...Object.keys(CPI_INFLATION).map(Number));

/** آخرین سال قابل انتخاب (شامل سال جاری تخمینی). */
export const CPI_LAST_YEAR = CPI_MAX_YEAR;

/** شاخص سالانهٔ یک سال؛ اگر موجود نباشد null. */
export function getAnnualIndex(year: number): number | null {
  return CPI_INDEX[year] ?? null;
}
