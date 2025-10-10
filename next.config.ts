import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/mochineko' : '',
  assetPrefix: isProd ? '/mochineko/' : '',
  trailingSlash: true,
};

export default nextConfig;
