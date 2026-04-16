'use client';

export default function wsrvLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's already a relative path or a data URL, return as is
  if (src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }

  // Use wsrv.nl to resize and optimize the external image
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }&output=webp`;
}
