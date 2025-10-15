import { getPostsMetaData, PostMeta } from '@/lib/posts';
import HomeHero from './sections/HomeHero';
import BlogCards from './sections/BlogCards';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  description: 'Mochineko的个人博客',
};

export default function BlogIndex() {
  const allPostsData: PostMeta[] = getPostsMetaData();
  return (
    <>
      <HomeHero />
      <BlogCards posts={allPostsData} />
    </>
  );
}
