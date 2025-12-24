import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import CustomCursor from "@/components/effects/CustomCursor";
import Preloader from "@/components/effects/Preloader";
import SmoothScroll from "@/components/effects/SmoothScroll";
import CookieConsent from "@/components/layout/CookieConsent";

const iransans = localFont({
  src: [
    { path: "../../public/fonts/IRANSans.woff2", weight: "normal", style: "normal" },
    { path: "../../public/fonts/IRANSans.woff", weight: "normal", style: "normal" },
  ],
  variable: "--font-iransans",
});

const yekanbakh = localFont({
  src: [
    { path: "../../public/fonts/YekanBakh-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/YekanBakh-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-yekanbakh",
});

export const metadata: Metadata = {
  title: "گروه فناوری بقایی | Baghaei Tech Group",
  description: "پیشرو در معماری سیستم‌های سازمانی مقیاس‌پذیر و مهندسی نرم‌افزار دقیق. ارائه راهکارهای نوین در هوش مصنوعی، امنیت سایبری و زیرساخت‌های ابری.",
  applicationName: "Baghaei Tech Group",
  authors: [{ name: "Babak Baghaei", url: "https://baghaei.com" }],
  generator: "Next.js",
  keywords: ["مهندسی نرم‌افزار", "معماری سیستم", "Next.js", "React", "AI", "هوش مصنوعی", "امنیت سایبری", "طراحی وب", "توسعه دهنده", "ایران"],
  referrer: "origin-when-cross-origin",
  metadataBase: new URL('https://baghaei.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://baghaei.com",
    title: "گروه فناوری بقایی | معماری آینده",
    description: "طراحی و توسعه زیرساخت‌های نرم‌افزاری مدرن با تمرکز بر پایداری، امنیت و مقیاس‌پذیری.",
    siteName: "Baghaei Tech Group",
    images: [{
      url: "/og-image.png", // Ensure this exists or fallback to logo
      width: 1200,
      height: 630,
      alt: "Baghaei Tech Group Landing",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "گروه فناوری بقایی",
    description: "مهندسی دقیق برای آینده‌ای هوشمند.",
    creator: "@babakbaghaei",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`dark ${iransans.variable} ${yekanbakh.variable}`}>
      <body className="antialiased">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YSHJT31R0K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YSHJT31R0K');
          `}
        </Script>
        
        <div className="noise-bg" />
        <Preloader />
        <SmoothScroll>
          {children}
          <CookieConsent />
        </SmoothScroll>
      </body>
    </html>
  );
}