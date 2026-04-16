import type { NextConfig } from 'next';

// const isProd = process.env.NODE_ENV === 'production'; // 如果使用自定义域名，可以注释掉

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath: isProd ? '/mochineko' : '', // 如果使用自定义域名，要注释掉
  // assetPrefix: isProd ? '/mochineko/' : '', // 如果使用自定义域名，要注释掉
  trailingSlash: true,
};

export default nextConfig;
