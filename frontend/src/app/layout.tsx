import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "گروه فناوری بقایی | Baghaei Tech Group",
  description: "گروه فناوری بقایی - ارائه دهنده راهکارهای جامع نرم‌افزاری در مقیاس سازمانی، معماری سیستم و زیرساخت ابری.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <head>
        <link href="https://cdn.fontcdn.ir/v2/css/IRANSans" rel="stylesheet" type="text/css" />
        <link href="https://cdn.fontcdn.ir/v2/css/Yekan" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg" />
        <link rel="icon" type="image/png" href="/assets/img/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
