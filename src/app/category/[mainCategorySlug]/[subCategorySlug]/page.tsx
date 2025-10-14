import { CATEGORIES } from '@/constants';
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

  return (
    <div>
      <h1>主分类: {mainCategory?.name}</h1>
      <h2>子分类: {subCategory.name}</h2>
      <p>Slug: {subCategory.slug}</p>
    </div>
  );
};

export default SubCategoryPage;
