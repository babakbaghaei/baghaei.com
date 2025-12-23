import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";

const iransans = localFont({
  src: [
    {
      path: "../../public/fonts/IRANSans.woff2",
      weight: "normal",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSans.woff",
      weight: "normal",
      style: "normal",
    },
  ],
  variable: "--font-iransans",
});

const yekanbakh = localFont({
  src: [
    {
      path: "../../public/fonts/YekanBakh-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakh-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-yekanbakh",
});

export const metadata: Metadata = {
  title: "گروه فناوری بقایی | Baghaei Tech Group",
  description: "راهکارهای مهندسی دقیق و معماری سیستم‌های سازمانی در مقیاس بزرگ.",
  icons: {
    icon: [
      { url: "/assets/img/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/img/favicon.png", type: "image/png" }
    ],
    apple: "/assets/img/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`scroll-smooth ${iransans.variable} ${yekanbakh.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-zinc-100 selection:text-black">
        {children}
      </body>
    </html>
  );
}
