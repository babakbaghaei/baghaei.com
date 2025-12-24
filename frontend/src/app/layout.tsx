import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import SmoothScroll from "@/components/effects/SmoothScroll";
import BackgroundGrid from "@/components/effects/BackgroundGrid";
import CookieConsent from "@/components/layout/CookieConsent";

// Optimized font loading
const iransans = localFont({
  src: [
    { path: "../../public/fonts/IRANSans.woff2", weight: "normal", style: "normal" },
  ],
  variable: "--font-iransans",
  display: 'swap',
  preload: true,
});

const yekanbakh = localFont({
  src: [
    { path: "../../public/fonts/YekanBakh-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/YekanBakh-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-yekanbakh",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "گروه فناوری بقایی | معماری نرم‌افزار و هوش مصنوعی",
    template: "%s | گروه فناوری بقایی"
  },
  description: "پیشرو در معماری سیستم‌های سازمانی مقیاس‌پذیر و مهندسی نرم‌افزار دقیق. ارائه راهکارهای نوین در هوش مصنوعی، امنیت سایبری و زیرساخت‌های ابری.",
  applicationName: "Baghaei Tech Group",
  authors: [{ name: "Babak Baghaei", url: "https://baghaei.com" }],
  generator: "Next.js",
  keywords: ["گروه فناوری بقایی", "بابک بقایی", "مهندسی نرم‌افزار", "معماری سیستم", "هوش مصنوعی", "امنیت سایبری", "طراحی وب", "توسعه دهنده ارشد", "ایران", "تکنولوژی لوکس"],
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
    title: "گروه فناوری بقایی | مهندسی فراتر از مرز کدها",
    description: "طراحی و توسعه زیرساخت‌های نرم‌افزاری مدرن با تمرکز بر پایداری، امنیت و مقیاس‌پذیری در مقیاس جهانی.",
    siteName: "گروه فناوری بقایی",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "گروه فناوری بقایی - Baghaei Tech Group",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "گروه فناوری بقایی | مهندسی دقیق",
    description: "معماری آینده با قدرت هوش مصنوعی و مهندسی دقیق نرم‌افزار.",
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
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`dark ${iransans.variable} ${yekanbakh.variable}`}>
      <body className="antialiased bg-black selection:bg-white selection:text-black">
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
        
        <div className="noise-bg opacity-[0.03] pointer-events-none" />
        <BackgroundGrid />
        <SmoothScroll>
          {children}
          <CookieConsent />
        </SmoothScroll>
      </body>
    </html>
  );
}