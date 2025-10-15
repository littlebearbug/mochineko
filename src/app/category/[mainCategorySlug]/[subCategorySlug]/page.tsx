import BlogCard from '@/components/blog/BlogCard';
import Section from '@/components/common/Section';
import { CATEGORIES } from '@/constants';
import { getPostsMetaData } from '@/lib/posts';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    mainCategorySlug: string;
    subCategorySlug: string;
  }>;
};

export async function generateStaticParams() {
  const paths = CATEGORIES.flatMap((mainCategory) =>
    mainCategory.children.map((subCategory) => ({
      mainCategorySlug: mainCategory.slug,
      subCategorySlug: subCategory.slug,
    }))
  );

  return paths;
}

const SubCategoryPage = async ({ params }: Props) => {
  const { mainCategorySlug, subCategorySlug } = await params;

  const mainCategory = CATEGORIES.find(
    (category) => category.slug === mainCategorySlug
  );
  const subCategory = mainCategory?.children.find(
    (sub) => sub.slug === subCategorySlug
  );

  if (!subCategory) {
    return notFound();
  }

  const posts = getPostsMetaData({ category: subCategory.id });

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

export default SubCategoryPage;
