import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navigation/Navbar';

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
    <html lang="zh">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
