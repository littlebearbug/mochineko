import type { Metadata } from 'next';
import './globals.css';
import Head from 'next/head';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    default: 'Mochineko的博客',
    template: '%s - Mochineko',
  },
  icons: {
    icon: '/favicon.ico',
  },
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
