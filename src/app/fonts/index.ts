import localFont from 'next/font/local';

export const inter_variable = localFont({
  src: [
    {
      path: 'resources/TieZhiHei-KeBianTi-2.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-inter-variable',
  display: 'swap',
});
