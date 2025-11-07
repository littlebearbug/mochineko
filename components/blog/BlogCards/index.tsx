import BlogCard from '@/components/blog/BlogCard';
import Section from '@/components/common/Section';
import { PostMeta } from '@/utils/lib/posts';

const BlogCards = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <Section className="flex justify-center">
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 w-full max-w-[980px] max-lg:max-w-[700px]">
        {posts.map((post) => {
          return <BlogCard key={post.slug} post={post} />;
        })}
      </div>
    </Section>
  );
};

export default BlogCards;
