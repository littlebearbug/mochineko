import { getPostsMetaData, PostMeta } from '@/utils/lib/posts';
import HomeHero from './sections/HomeHero';
import BlogCards from '../components/blog/BlogCards';
import BlogCard from '../components/blog/BlogCard';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  description: 'Mochineko的个人博客',
};

const ITEMS_PER_PAGE = 6;

export default function BlogIndex() {
  const allPostsData: PostMeta[] = getPostsMetaData();
  const initialPosts = allPostsData.slice(0, ITEMS_PER_PAGE);
  return (
    <>
      <HomeHero />
      <BlogCards posts={allPostsData}>
        {initialPosts.map((post, index) => (
          <BlogCard key={post.slug} post={post} priority={index === 0} />
        ))}
      </BlogCards>
    </>
  );
}
