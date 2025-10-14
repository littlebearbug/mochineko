import BlogCard from '@/components/blog/BlogCard';
import Section from '@/components/common/Section';
import { PostMeta } from '@/lib/posts';

const BlogCards = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <Section className="flex justify-center">
      <div className="flex w-full max-w-[980px] max-lg:max-w-[700px] gap-6 flex-wrap">
        {posts.map((post) => {
          return <BlogCard key={post.slug} post={post} />;
        })}
      </div>
    </Section>
  );
};

export default BlogCards;
