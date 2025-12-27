import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import BackgroundGrid from "@/components/effects/BackgroundGrid";
import CookieConsent from "@/components/layout/CookieConsent";
import { RootMobileMenu } from "@/components/layout/RootMobileMenu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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

export const viewport: Viewport = {
 themeColor: [
  { media: '(prefers-color-scheme: light)', color: 'white' },
  { media: '(prefers-color-scheme: dark)', color: 'black' },
 ],
 width: 'device-width',
 initialScale: 1,
 maximumScale: 1,
 minimumScale: 1,
 userScalable: false,
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="fa" dir="rtl" suppressHydrationWarning className={`${iransans.variable} ${yekanbakh.variable}`}>
   <body className="antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
    <ThemeProvider
     attribute="class"
     defaultTheme="dark"
     enableSystem
     disableTransitionOnChange
    >
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
           "telephone": "+98-912-000-0000",
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
     
     <div className="noise-bg opacity-[0.03] pointer-events-none" />
     <BackgroundGrid />
     {children}
     <CookieConsent />
     <RootMobileMenu />
    </ThemeProvider>
   </body>
  </html>
 );
}