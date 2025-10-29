import localFont from 'next/font/local';

export const inter_variable = localFont({
  src: [
    {
      path: 'resources/AlimamaFangYuanTiVF-Thin.woff2',
      weight: '200 700',
      style: 'normal',
    },
  ],
  variable: '--font-custom-variable',
  display: 'swap',
});
