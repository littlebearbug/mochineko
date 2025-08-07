import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小熊虫的博客",
  description: "小熊虫的博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
