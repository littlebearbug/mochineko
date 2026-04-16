import type { NextConfig } from 'next';

// const isProd = process.env.NODE_ENV === 'production'; // 如果使用自定义域名，可以注释掉

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    // Note: 'unoptimized' is usually required for 'output: export' if you don't use a custom loader.
    // In this project, we use a custom loader (utils/imageLoader.ts) with 'wsrv.nl' 
    // to optimize external images on the fly without a Node.js server.
    loader: 'custom',
    loaderFile: './utils/imageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub.bearbug.dpdns.org',
      },
      {
        protocol: 'https',
        hostname: 'wsrv.nl',
      },
    ],
  },
  // basePath: isProd ? '/mochineko' : '', // 如果使用自定义域名，要注释掉
  // assetPrefix: isProd ? '/mochineko/' : '', // 如果使用自定义域名，要注释掉
  trailingSlash: true,
};

export default nextConfig;
