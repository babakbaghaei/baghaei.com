/*
 * seed-reviews.ts — بذرکاری دیدگاه‌های واقع‌نمای ابزارها (ToolReview).
 *
 * توزیع (طبق درخواست):
 *   • ابزارهای پرکاربرد (popular): ۳ تا ۵ دیدگاه.
 *   • حدود یک‌سومِ ابزارهای معمولی: دقیقاً ۱ دیدگاه.
 *   • امتیازها بین ۳ تا ۵ ستاره؛ لحن انسانی، طول متغیر (کوتاه/متوسط).
 *
 * ایمن و idempotent: برای هر ابزار فقط زمانی درج می‌کند که هیچ دیدگاهی نداشته
 * باشد؛ پس اجرای دوباره چیزی را تکراری نمی‌کند و دیدگاه‌های واقعی کاربران را
 * دست‌نخورده می‌گذارد.
 *
 * اجرا (داخل کانتینر بک‌اند، از روی خروجی کامپایل‌شده):
 *   node dist/src/scripts/seed-reviews.js
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedReview {
  name: string | null; // null → در نمایش «کاربر» می‌شود (ناشناس)
  rating: number; // ۳ تا ۵
  body: string;
  daysAgo: number; // چند روز پیش ثبت شده (برای تاریخ طبیعی)
}

// کلید = اسلاگ ابزار. متن‌ها عمداً محاوره‌ای و کوتاه/متوسط‌اند تا طبیعی به‌نظر برسند.
const REVIEWS: Record<string, SeedReview[]> = {
  // ───────── پرکاربردها (۳ تا ۵ دیدگاه) ─────────
  'khesarat-takhir': [
    {
      name: 'رضا کریمی',
      rating: 5,
      body: 'برای پرونده‌ی چکم دقیقاً همینو لازم داشتم. عدد نهایی با چیزی که وکیلم حساب کرده بود مو نمی‌زد. دمتون گرم.',
      daysAgo: 96,
    },
    {
      name: null,
      rating: 4,
      body: 'خیلی کمک کرد، فقط کاش نتیجه رو می‌شد مستقیم پی‌دی‌اف گرفت.',
      daysAgo: 71,
    },
    {
      name: 'سمیرا',
      rating: 5,
      body: 'ساده و دقیق. خودش شاخص بانک مرکزی رو اعمال می‌کنه که عالیه 👌',
      daysAgo: 52,
    },
    {
      name: 'مهندس علوی',
      rating: 5,
      body: 'بهترین ماشین‌حساب خسارت تأخیری که تا حالا دیدم. بابت به‌روز بودن شاخص‌ها ممنون.',
      daysAgo: 28,
    },
    {
      name: 'حمید',
      rating: 3,
      body: 'خوبه ولی برای مبالغ خیلی بزرگ یه‌کم گرد می‌کنه. در کل راضی‌ام.',
      daysAgo: 11,
    },
  ],
  'aghsat-vam': [
    {
      name: 'سعید',
      rating: 5,
      body: 'جدول اقساط کامل رو داد، دقیقاً مثل چیزی که بانک بهم داد. عالی بود.',
      daysAgo: 88,
    },
    {
      name: 'نگار محمدی',
      rating: 4,
      body: 'برای مقایسه‌ی وام‌های مختلف حرف نداره. سریع و بی‌دردسر.',
      daysAgo: 63,
    },
    {
      name: null,
      rating: 5,
      body: 'قسط ماهانه و کل سود رو یه‌جا نشون می‌ده، خیلی راحت تصمیم گرفتم.',
      daysAgo: 40,
    },
    {
      name: 'آرش',
      rating: 4,
      body: 'کاربردی بود. کاش امکان نرخ سود پله‌ای هم داشت.',
      daysAgo: 19,
    },
    {
      name: 'زهرا',
      rating: 5,
      body: 'واقعاً وقتم رو سر خرید اقساطی نجات داد 🙏',
      daysAgo: 6,
    },
  ],
  'hoghoogh-khales': [
    {
      name: 'محمد رضایی',
      rating: 5,
      body: 'بیمه و مالیات پلکانی رو درست حساب می‌کنه. فیش حقوقیم رو باهاش چک کردم، درست بود.',
      daysAgo: 84,
    },
    {
      name: null,
      rating: 4,
      body: 'خوب بود، فقط حق اولاد رو باید دستی وارد کرد.',
      daysAgo: 47,
    },
    {
      name: 'الهام',
      rating: 5,
      body: 'برای ما کارمندا خیلی به‌درد‌بخوره. دقیق و شفاف.',
      daysAgo: 25,
    },
    {
      name: 'کیانوش',
      rating: 3,
      body: 'کلیت خوبه ولی کاش اضافه‌کاری رو هم لحاظ می‌کرد.',
      daysAgo: 9,
    },
  ],
  'mohasebe-darsad': [
    {
      name: null,
      rating: 5,
      body: 'سریع‌ترین راه برای حساب کردن درصد تخفیف موقع خرید 😄',
      daysAgo: 58,
    },
    {
      name: 'مینا',
      rating: 4,
      body: 'ساده و کاربردی. تقریباً هر روز ازش استفاده می‌کنم.',
      daysAgo: 30,
    },
    {
      name: 'پویا',
      rating: 5,
      body: 'سه حالت مختلف درصد رو داره که خیلی کمکم کرد.',
      daysAgo: 8,
    },
  ],
  'tabdil-tarikh': [
    {
      name: 'فرهاد',
      rating: 5,
      body: 'دقیق‌ترین مبدل تاریخی که پیدا کردم، مخصوصاً بخش قمری‌ش.',
      daysAgo: 90,
    },
    {
      name: null,
      rating: 4,
      body: 'برای پیدا کردن تاریخ تولد میلادیم استفاده کردم، درست بود.',
      daysAgo: 55,
    },
    {
      name: 'لیلا احمدی',
      rating: 5,
      body: 'خیلی تمیز و بدون تبلیغات. مرسی.',
      daysAgo: 33,
    },
    {
      name: 'حسین',
      rating: 4,
      body: 'خوبه، فقط روی موبایل تقویمش یه‌کم کوچیک بود.',
      daysAgo: 12,
    },
  ],
  'mohasebe-sen': [
    {
      name: null,
      rating: 5,
      body: 'سن دقیقم به روز رو نشون داد، حتی روز هفته‌ی تولدم رو 🎂',
      daysAgo: 77,
    },
    {
      name: 'سارا',
      rating: 5,
      body: 'برای پر کردن فرم‌هایی که سن دقیق می‌خواستن عالی بود.',
      daysAgo: 44,
    },
    {
      name: 'مهدی',
      rating: 4,
      body: 'قشنگ و سریع. شمارش معکوس تا تولد بعدی باحال بود.',
      daysAgo: 21,
    },
    {
      name: null,
      rating: 3,
      body: 'خوبه ولی کاش سن رو به ماه شمسی هم می‌داد.',
      daysAgo: 7,
    },
  ],
  bmi: [
    {
      name: 'زهرا موسوی',
      rating: 5,
      body: 'محدوده‌ی وزن سالمم رو گفت، انگیزه گرفتم برای رژیم 💪',
      daysAgo: 80,
    },
    {
      name: null,
      rating: 4,
      body: 'ساده و سریع. جواب همونیه که دکترم گفته بود.',
      daysAgo: 49,
    },
    {
      name: 'امیر',
      rating: 5,
      body: 'طبقه‌بندی رنگیش خیلی گویا بود.',
      daysAgo: 23,
    },
    {
      name: null,
      rating: 4,
      body: 'خوب بود؛ برای ورزشکارا شاید دقیق نباشه که خب طبیعیه.',
      daysAgo: 10,
    },
  ],
  'type-jangi': [
    {
      name: 'آرمین',
      rating: 5,
      body: 'معتاد این بازی شدم! سرعت تایپم واقعاً بالا رفت 🔥',
      daysAgo: 85,
    },
    {
      name: null,
      rating: 5,
      body: 'برای تمرین تایپ ده‌انگشتی محشره.',
      daysAgo: 61,
    },
    {
      name: 'نیلوفر',
      rating: 4,
      body: 'چالش‌هاش هیجان‌انگیزه، فقط کاش متن‌های بیشتری داشت.',
      daysAgo: 38,
    },
    {
      name: 'کاوه',
      rating: 5,
      body: 'هم سرگرم‌کننده هم مفید. رکوردم شد ۸۵ کلمه در دقیقه 😎',
      daysAgo: 17,
    },
    {
      name: null,
      rating: 4,
      body: 'خوش‌ساخته. رقابت با خودم لذت‌بخش بود.',
      daysAgo: 5,
    },
  ],
  'fal-hafez': [
    {
      name: null,
      rating: 5,
      body: 'هر روز صبح با نیت یه فال می‌گیرم، حس خوبی می‌ده ❤️',
      daysAgo: 92,
    },
    {
      name: 'مریم',
      rating: 5,
      body: 'تفسیرش کامل و قشنگه، نه مثل بعضی سایتا سرسری.',
      daysAgo: 67,
    },
    {
      name: 'بابک',
      rating: 4,
      body: 'غزل کامل با معنی، عالیه. فقط صوت هم داشت کامل می‌شد.',
      daysAgo: 41,
    },
    {
      name: null,
      rating: 5,
      body: 'با نیت قلبی گرفتم و واقعاً به دلم نشست. لسان‌الغیب 🌹',
      daysAgo: 20,
    },
    {
      name: 'شیرین',
      rating: 5,
      body: 'طراحیش خیلی حال‌وهوای دیوان حافظ رو داره.',
      daysAgo: 4,
    },
  ],
  mbti: [
    {
      name: 'پریسا',
      rating: 5,
      body: 'نتیجه‌ش دقیقاً شخصیتمو توصیف کرد؛ INFJ درومدم و کاملاً درست بود.',
      daysAgo: 79,
    },
    {
      name: null,
      rating: 4,
      body: 'سوالاش خوب بود ولی یه‌کم طولانی. در کل نتیجه ارزششو داشت.',
      daysAgo: 53,
    },
    {
      name: 'احسان',
      rating: 5,
      body: 'توضیح تیپ‌ها خیلی کامله. به دوستامم معرفی کردم.',
      daysAgo: 31,
    },
    {
      name: null,
      rating: 5,
      body: 'رایگان و بدون ثبت‌نام، برعکس خیلی سایتای دیگه 👏',
      daysAgo: 15,
    },
    {
      name: 'ندا',
      rating: 3,
      body: 'تست خوبیه، هرچند mbti به‌طور کلی خیلی علمی نیست؛ اینو در نظر بگیرید.',
      daysAgo: 3,
    },
  ],
  'zaban-eshgh': [
    {
      name: null,
      rating: 5,
      body: 'با همسرم هردو دادیم، خیلی به درک همدیگه کمک کرد ❤️',
      daysAgo: 74,
    },
    {
      name: 'مهسا',
      rating: 5,
      body: 'نتیجه‌م «کلام تأییدآمیز» شد و واقعاً همینطورم.',
      daysAgo: 45,
    },
    {
      name: 'یاسر',
      rating: 4,
      body: 'جالب بود، رابطه‌مون رو یه‌کم بهتر فهمیدیم.',
      daysAgo: 22,
    },
    { name: null, rating: 4, body: 'قشنگ و کاربردی برای زوج‌ها.', daysAgo: 8 },
  ],

  // ───────── ابزارهای معمولی (یک‌سوم، هرکدام ۱ دیدگاه) ─────────
  diyeh: [
    {
      name: 'علی',
      rating: 5,
      body: 'نرخ دیه‌ی امسال رو دقیق داشت، برای پرونده‌ی تصادف خیلی کمکم کرد.',
      daysAgo: 57,
    },
  ],
  mahriyeh: [
    {
      name: null,
      rating: 5,
      body: 'ارزش روز مهریه‌م رو بر اساس تعداد سکه حساب کرد، دقیق بود 🙏',
      daysAgo: 34,
    },
  ],
  'taghsim-ers': [
    {
      name: 'رضا',
      rating: 4,
      body: 'سهم‌الارث هرکدوم از وراث رو شفاف نشون داد. ممنون.',
      daysAgo: 62,
    },
  ],
  'sood-sepordeh': [
    {
      name: null,
      rating: 4,
      body: 'سود مرکب سپرده‌م رو راحت حساب کردم، کاربردی بود.',
      daysAgo: 29,
    },
  ],
  'eidi-sanavat': [
    {
      name: 'مریم',
      rating: 5,
      body: 'عیدی و سنوات آخر سالم رو باهاش چک کردم، با فیش هم‌خوانی داشت.',
      daysAgo: 48,
    },
  ],
  'arzesh-tala': [
    {
      name: null,
      rating: 5,
      body: 'ارزش طلای دست‌دومم رو بر اساس عیار و قیمت روز فهمیدم. عالی.',
      daysAgo: 18,
    },
  ],
  'rahn-ejareh': [
    {
      name: 'سعید',
      rating: 4,
      body: 'برای تبدیل رهن به اجاره موقع قرارداد خیلی به کارم اومد.',
      daysAgo: 51,
    },
  ],
  'komision-amlak': [
    {
      name: null,
      rating: 3,
      body: 'کمیسیون بنگاه رو حساب کردم؛ خوب بود فقط نرخ منطقه‌مون فرق داشت که دستی زدم.',
      daysAgo: 26,
    },
  ],
  'tabdil-vahed': [
    {
      name: 'نازنین',
      rating: 5,
      body: 'سریع واحدها رو تبدیل می‌کنه؛ برای آشپزی و کارای فنی جفتش خوبه.',
      daysAgo: 43,
    },
  ],
  'faseleh-tarikh': [
    {
      name: null,
      rating: 4,
      body: 'تعداد روز مونده تا یه مناسبت رو دقیق داد، مرسی.',
      daysAgo: 14,
    },
  ],
  'masraf-sookht': [
    {
      name: 'بهنام',
      rating: 4,
      body: 'مصرف بنزین ماشینم و هزینه‌ی سفر جاده‌ای رو حساب کردم، دقیق بود.',
      daysAgo: 36,
    },
  ],
  'kalori-roozane': [
    {
      name: null,
      rating: 5,
      body: 'کالری موردنیازم برای کاهش وزن رو داد، رژیمم رو باهاش تنظیم کردم 💪',
      daysAgo: 24,
    },
  ],
  'adad-be-horoof': [
    {
      name: 'فاطمه',
      rating: 5,
      body: 'برای نوشتن مبلغ چک به حروف حرف نداره؛ دیگه اشتباه نمی‌نویسم.',
      daysAgo: 39,
    },
  ],
  'borj-tavalod': [
    {
      name: null,
      rating: 4,
      body: 'برجم رو درست گفت با ویژگی‌های شخصیتی که خیلیاش درست بود 🙂',
      daysAgo: 16,
    },
  ],
  'big-five': [
    {
      name: 'آزاده',
      rating: 5,
      body: 'علمی‌تر از mbti بود و نتیجه‌ش خیلی دقیق. پیشنهاد می‌کنم.',
      daysAgo: 27,
    },
  ],
};

const DAY_MS = 86_400_000;

async function main() {
  console.log('Seeding tool reviews…');
  let insertedReviews = 0;
  let seededTools = 0;
  let skippedTools = 0;

  for (const [slug, list] of Object.entries(REVIEWS)) {
    const existing = await prisma.toolReview.count({
      where: { toolSlug: slug },
    });
    if (existing > 0) {
      skippedTools++;
      console.log(`  skip  ${slug} — already has ${existing} review(s)`);
      continue;
    }

    for (const r of list) {
      // زمان ثبت طبیعی: چند روز پیش + یک جابه‌جایی تصادفیِ درون‌روزی.
      const createdAt = new Date(
        Date.now() - r.daysAgo * DAY_MS - Math.floor(Math.random() * DAY_MS),
      );
      await prisma.toolReview.create({
        data: {
          toolSlug: slug,
          name: r.name,
          rating: Math.min(5, Math.max(3, r.rating)),
          body: r.body,
          approved: true,
          createdAt,
        },
      });
      insertedReviews++;
    }
    seededTools++;
    console.log(`  seed  ${slug} — ${list.length} review(s)`);
  }

  console.log(
    `Done. inserted=${insertedReviews} across ${seededTools} tool(s); skipped ${skippedTools} tool(s) that already had reviews.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
