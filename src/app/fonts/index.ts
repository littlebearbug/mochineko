import localFont from 'next/font/local';

export const alimama = localFont({
  src: [
    {
      path: 'resources/AlimamaFangYuanTiVF-Processed.woff2',
      weight: '200 700',
      style: 'normal',
    },
  ],
  variable: '--font-alimama',
  display: 'swap',
});
