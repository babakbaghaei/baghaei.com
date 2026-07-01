import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import AnalyticsGate from "@/components/providers/AnalyticsGate";
import BackgroundGrid from "@/components/ui/effects/BackgroundGrid";
import CookieConsent from "@/components/layout/CookieConsent";
import { RootMobileMenu } from "@/components/layout/RootMobileMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import MotionProvider from "@/components/providers/MotionProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import PageTransition from "@/components/effects/PageTransition";
import ProgressBar from "@/components/effects/ProgressBar";
import CustomCursor from "@/components/effects/CustomCursor";
import Preloader from "@/components/effects/Preloader";
import ChatWidget from "@/components/layout/ChatWidget";
import StickyCTA from "@/components/layout/StickyCTA";
import ExitIntentModal from "@/components/layout/ExitIntentModal";

const CommandMenu = dynamic(() =>
 import("@/components/ui/CommandMenu").then((mod) => mod.CommandMenu)
);

const iransans = localFont({
 src: [
  { path: "../../public/fonts/IRANSans/IRANSans.ttf", weight: "400", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Medium.ttf", weight: "500", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Bold.ttf", weight: "700", style: "normal" },
  { path: "../../public/fonts/IRANSans/IRANSans_Black.ttf", weight: "900", style: "normal" },
 ],
 variable: "--font-iransans",
 display: "swap",
});

const yekanbakh = localFont({
 src: [
  { path: "../../public/fonts/YekanBakh/YekanBakh-Regular.ttf", weight: "400", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Medium.ttf", weight: "500", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Bold.ttf", weight: "700", style: "normal" },
  { path: "../../public/fonts/YekanBakh/YekanBakh-Fat.ttf", weight: "900", style: "normal" },
 ],
 variable: "--font-yekanbakh",
 display: "swap",
});

import GlobalUniverse from "@/components/effects/GlobalUniverseLazy";

export const metadata: Metadata = {
 title: {
  default: "گروه فناوری بقائی | معماری نرم‌افزار و هوش مصنوعی",
  template: "%s | گروه فناوری بقائی"
 },
 description: "پیشرو در معماری سیستم‌های سازمانی مقیاس‌پذیر و مهندسی نرم‌افزار دقیق. ارائه راهکارهای نوین در هوش مصنوعی، امنیت سایبری و زیرساخت‌های ابری.",
 applicationName: "Baghaei Tech Group",
 manifest: "/manifest.json",
 authors: [{ name: "Babak Baghaei", url: "https://baghaei.com" }],
 generator: "Next.js",
 keywords: ["گروه فناوری بقائی", "بابک بقائی", "مهندسی نرم‌افزار", "معماری سیستم", "هوش مصنوعی", "امنیت سایبری", "طراحی وب", "توسعه دهنده ارشد", "ایران", "تکنولوژی لوکس"],
 referrer: "origin-when-cross-origin",
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://baghaei.com'),
 alternates: {
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
  title: "گروه فناوری بقائی | مهندسی فراتر از مرز کدها",
  description: "طراحی و توسعه زیرساخت‌های نرم‌افزاری مدرن با تمرکز بر پایداری، امنیت و مقیاس‌پذیری در مقیاس جهانی.",
  siteName: "گروه فناوری بقائی",
  // og:image is provided automatically by src/app/opengraph-image.tsx.
 },
 twitter: {
  card: "summary_large_image",
  title: "گروه فناوری بقائی | مهندسی دقیق",
  description: "معماری آینده با قدرت هوش مصنوعی و مهندسی دقیق نرم‌افزار.",
  creator: "@babakbaghaei",
  // twitter:image is provided automatically by src/app/twitter-image.tsx.
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
  <html lang={locale || 'fa'} dir="rtl" suppressHydrationWarning className={`${iransans.variable} ${yekanbakh.variable} bg-background`}>
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
     disableTransitionOnChange
    >
     <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
       __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
         {
          "@type": "Organization",
          "name": "گروه فناوری بقائی",
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
          "name": "بابک بقائی",
          "url": "https://baghaei.com",
          "image": "https://baghaei.com/logo.svg",
          "jobTitle": "Lead Software Architect",
          "worksFor": {
           "@type": "Organization",
           "name": "گروه فناوری بقائی"
          },
          "sameAs": [
           "https://linkedin.com/in/babakbaghaei",
           "https://github.com/baghaei"
          ]
         },
         {
          "@type": "WebSite",
          "@id": "https://baghaei.com/#website",
          "url": "https://baghaei.com",
          "name": "گروه فناوری بقائی",
          "inLanguage": "fa-IR"
         }
        ]
       })
      }}
     />

     <MotionProvider>
      <Preloader />
      {/* NProgress route progress. useSearchParams requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <ProgressBar />
      </Suspense>
      <div className="fixed inset-0 z-[-2] pointer-events-none print:hidden">
        <GlobalUniverse renderBackground />
      </div>
      <div className="noise-bg opacity-[0.03] pointer-events-none" />
      <BackgroundGrid variant="dots" />
      <CustomCursor />
      {/* Lenis drives native window scroll, so the fixed GlobalUniverse
          background (Framer useScroll) and scrollIntoView anchors still work. */}
      <SmoothScrollProvider>
        <div id="main-content" tabIndex={-1}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </SmoothScrollProvider>
      <ChatWidget />
      <StickyCTA />
      <ExitIntentModal />
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
