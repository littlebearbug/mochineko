import BlogCards from '@/components/blog/BlogCards';
import { CATEGORIES } from '@/constants';
import Section from '@/components/common/Section';
import { getPostsMetaData } from '@/utils/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const paths = CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
  return paths;
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const Category = async ({ params }: Props) => {
  const { slug } = await params;

  const currentCategory = CATEGORIES.find((category) => category.slug === slug);

  if (currentCategory) {
    const posts = getPostsMetaData({ category: currentCategory.id });

    if (posts.length === 0) {
      return (
        <Section className="flex flex-col items-center justify-center py-20 min-h-[calc(100vh-400px)] max-lg:min-h-[calc(100vh-250px)]">
          <div className="flex flex-col items-center gap-4 text-gray-400 dark:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-50"
            >
              <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
            </svg>
            <p className="text-lg font-medium">暂时没有此分类的文章</p>
          </div>
        </Section>
      );
    }

    return (
      <>
        <BlogCards posts={posts} />
      </>
    );
  }
  return notFound();
};

export default Category;
