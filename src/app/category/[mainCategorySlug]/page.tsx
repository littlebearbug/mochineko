import { CATEGORIES } from '@/constants';
import { notFound } from 'next/navigation';
import CategoryCards from './sections/CategoryCards';

export async function generateStaticParams() {
  const paths = CATEGORIES.map((category) => ({
    mainCategorySlug: category.slug,
  }));
  return paths;
}

type Props = {
  params: Promise<{
    mainCategorySlug: string;
  }>;
};

const Category = async ({ params }: Props) => {
  const { mainCategorySlug } = await params;

  const currentCategory = CATEGORIES.find(
    (category) => category.slug === mainCategorySlug
  );

  if (currentCategory) {
    return (
      <>
        <CategoryCards subCategories={currentCategory.children} />
      </>
    );
  }
  return notFound();
};

export default Category;
