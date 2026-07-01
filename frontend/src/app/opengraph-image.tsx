import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Branded Open Graph card generated at request time (node runtime). Next
// auto-injects the og:image / twitter:image meta from this file, so no static
// /og-image.png is needed. The display font is embedded so the Persian
// wordmark renders correctly instead of falling back to tofu boxes.
export const alt = 'گروه فناوری بقائی - معماری نرم‌افزار و هوش مصنوعی';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const yekanBold = readFileSync(
  join(process.cwd(), 'public/fonts/YekanBakh/YekanBakh-Bold.ttf'),
);
const yekanRegular = readFileSync(
  join(process.cwd(), 'public/fonts/YekanBakh/YekanBakh-Regular.ttf'),
);

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(1200px 600px at 50% -10%, #15151c 0%, #000000 60%)',
          color: '#ffffff',
          fontFamily: 'Yekan',
          direction: 'rtl',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: '-2px',
            lineHeight: 1.1,
          }}
        >
          گروه فناوری بقائی
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 40,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.62)',
          }}
        >
          معماری نرم‌افزار · هوش مصنوعی · امنیت سایبری
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 56,
            fontSize: 24,
            letterSpacing: '14px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 700,
          }}
        >
          BAGHAEI TECH GROUP
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Yekan', data: yekanBold, weight: 700, style: 'normal' },
        { name: 'Yekan', data: yekanRegular, weight: 400, style: 'normal' },
      ],
    },
  );
}
