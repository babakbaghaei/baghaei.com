import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import AnalyticsGate from "@/components/providers/AnalyticsGate";
import BackgroundGrid from "@/components/effects/BackgroundGrid";
import CookieConsent from "@/components/layout/CookieConsent";
import { RootMobileMenu } from "@/components/layout/RootMobileMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import MotionProvider from "@/components/providers/MotionProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { CommandMenu } from "@/components/ui/CommandMenu";
import PageTransition from "@/components/effects/PageTransition";
import CustomCursor from "@/components/effects/CustomCursor";
import Preloader from "@/components/effects/Preloader";
import ChatWidget from "@/components/layout/ChatWidget";

const iransans = localFont({
 src: [
  { path: "../../public/fonts/IRANSans/IRANSans_UltraLight.ttf", weight: "200", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Light.ttf", weight: "300", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans.ttf", weight: "400", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Medium.ttf", weight: "500", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Bold.ttf", weight: "700", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Black.ttf", weight: "900", style: "normal" },
 ],
 variable: "--font-iransans",
});

const yekanbakh = localFont({
 src: [
  { path: "../../public/fonts/YekanBakh/YekanBakh-Thin.ttf", weight: "100", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Light.ttf", weight: "300", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Regular.ttf", weight: "400", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Medium.ttf", weight: "500", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Bold.ttf", weight: "700", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Heavy.ttf", weight: "800", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Fat.ttf", weight: "900", style: "normal" },
 ],
 variable: "--font-yekanbakh",
});

import GlobalUniverse from "@/components/effects/GlobalUniverseLazy";

export const metadata: Metadata = {
 title: {
  default: "گروه فناوری بقایی | معماری نرم‌افزار و هوش مصنوعی",
  template: "%s | گروه فناوری بقایی"
 },
 description: "پیشرو در معماری سیستم‌های سازمانی مقیاس‌پذیر و مهندسی نرم‌افزار دقیق. ارائه راهکارهای نوین در هوش مصنوعی، امنیت سایبری و زیرساخت‌های ابری.",
 applicationName: "Baghaei Tech Group",
 manifest: "/manifest.json",
 authors: [{ name: "Babak Baghaei", url: "https://baghaei.com" }],
 generator: "Next.js",
 keywords: ["گروه فناوری بقایی", "بابک بقایی", "مهندسی نرم‌افزار", "معماری سیستم", "هوش مصنوعی", "امنیت سایبری", "طراحی وب", "توسعه دهنده ارشد", "ایران", "تکنولوژی لوکس"],
 referrer: "origin-when-cross-origin",
 metadataBase: new URL('https://baghaei.com'),
 alternates: {
  canonical: '/',
  // hreflang structure. 'en-US': '/en' should be added once English pages exist.
  languages: {
   'fa-IR': '/',
   'x-default': '/',
  },
  types: {
   'application/rss+xml': '/feed.xml',
  },
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

export const viewport: Viewport = {
 themeColor: [
  { media: '(prefers-color-scheme: light)', color: 'white' },
  { media: '(prefers-color-scheme: dark)', color: 'black' },
 ],
 width: 'device-width',
 initialScale: 1,
 // Do not block zoom: maximumScale/userScalable:false break pinch-to-zoom and
 // fail WCAG 1.4.4 (Resize Text). Users must be able to magnify the page.
 // color-scheme is driven per theme in globals.css (:root = light, .dark = dark)
 // so native controls/scrollbars match the active theme, not a hardcoded one.
};

export default async function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 const locale = await getLocale();
 const messages = await getMessages();
 return (
  <html lang={locale} dir="rtl" suppressHydrationWarning className={`${iransans.variable} ${yekanbakh.variable} bg-background`}>
   <body className="antialiased text-foreground selection:bg-primary selection:text-primary-foreground font-sans bg-transparent">
    <a
     href="#main-content"
     className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[10001] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-xs focus:font-bold focus:text-black"
    >
     رفتن به محتوای اصلی
    </a>
    <NextIntlClientProvider locale={locale} messages={messages}>
    <ThemeProvider
     attribute="class"
     defaultTheme="dark"
     enableSystem
     disableTransitionOnChange
    >
     <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
      {`
       {
        "@context": "https://schema.org",
        "@graph": [
         {
          "@type": "Organization",
          "name": "گروه فناوری بقایی",
          "url": "https://baghaei.com",
          "logo": "https://baghaei.com/logo.svg",
          "sameAs": [
           "https://linkedin.com/in/babakbaghaei",
           "https://github.com/baghaei"
          ],
          "contactPoint": {
           "@type": "ContactPoint",
           "telephone": "+989115790013",
           "contactType": "sales",
           "areaServed": "IR",
           "availableLanguage": ["Persian", "English"]
          }
         },
         {
          "@type": "Person",
          "name": "بابک بقایی",
          "url": "https://baghaei.com",
          "image": "https://baghaei.com/og-image.png",
          "jobTitle": "Lead Software Architect",
          "worksFor": {
           "@type": "Organization",
           "name": "گروه فناوری بقایی"
          },
          "sameAs": [
           "https://linkedin.com/in/babakbaghaei",
           "https://github.com/baghaei"
          ]
         }
        ]
       }
      `}
     </Script>

     <MotionProvider>
      <Preloader />
      <div className="fixed inset-0 z-[-2] pointer-events-none print:hidden">
        <GlobalUniverse renderBackground />
      </div>
      <div className="noise-bg opacity-[0.03] pointer-events-none" />
      <BackgroundGrid />
      <CustomCursor />
      <div id="main-content">
        <PageTransition>
          {children}
        </PageTransition>
      </div>
      <ChatWidget />
      <CommandMenu />
      <CookieConsent />
      <RootMobileMenu />
     </MotionProvider>
    </ThemeProvider>
    <AnalyticsGate gaId="G-YSHJT31R0K" />
    </NextIntlClientProvider>
   </body>
  </html>
 );
}
