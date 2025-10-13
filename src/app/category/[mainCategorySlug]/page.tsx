import { CATEGORIES } from '@/constants';
import { notFound } from 'next/navigation';

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
  console.log(mainCategorySlug);

  if (CATEGORIES.find((category) => category.slug === mainCategorySlug)) {
    return <div className="pt-[100px]">Welcome to {mainCategorySlug}</div>;
  }
  return notFound();
};

export default Category;
