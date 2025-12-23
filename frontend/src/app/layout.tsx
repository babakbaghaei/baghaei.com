import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import CustomCursor from "@/components/effects/CustomCursor";
import Preloader from "@/components/effects/Preloader";
import SmoothScroll from "@/components/effects/SmoothScroll";

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
  description: "راهکارهای مهندسی دقیق و معماری سیستم‌های سازمانی در مقیاس بزرگ.",
  metadataBase: new URL('https://baghaei.com'),
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`dark ${iransans.variable} ${yekanbakh.variable}`}>
      <body className="antialiased">
        <div className="noise-bg" />
        <Preloader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}