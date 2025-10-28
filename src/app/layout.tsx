import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { inter_variable } from './fonts';

export const metadata: Metadata = {
  title: {
    default: 'Mochineko的博客',
    template: '%s - Mochineko',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      data-scroll-behavior="smooth"
      className={`${inter_variable.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
