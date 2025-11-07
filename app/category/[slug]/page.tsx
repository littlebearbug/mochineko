import BlogCards from '@/components/blog/BlogCards';
import { CATEGORIES } from '@/constants';
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
    return (
      <>
        <BlogCards posts={posts} />
      </>
    );
  }
  return notFound();
};

export default Category;
