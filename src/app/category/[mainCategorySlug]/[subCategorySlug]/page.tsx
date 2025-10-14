// /category/[mainCategorySlug]/[subCategorySlug]/page.tsx
import { CATEGORIES } from '@/constants';
import { notFound } from 'next/navigation';

// 1. 定义清晰的 Props 类型
type Props = {
  params: {
    mainCategorySlug: string;
    subCategorySlug: string;
  };
};

// 2. generateStaticParams 生成所有可能的路径组合
export async function generateStaticParams() {
  console.log('Generating static params for sub-categories...');

  // 使用 flatMap 来遍历所有主分类及其子分类，创建一个扁平化的路径数组
  const paths = CATEGORIES.flatMap((mainCategory) =>
    mainCategory.children.map((subCategory) => ({
      mainCategorySlug: mainCategory.slug,
      subCategorySlug: subCategory.slug,
    }))
  );

  /*
    假设 CATEGORIES 结构如下:
    [
      { slug: 'frontend', children: [{ slug: 'react' }, { slug: 'vue' }] },
      { slug: 'backend', children: [{ slug: 'nodejs' }, { slug: 'go' }] }
    ]

    上面的代码会生成如下的 paths 数组:
    [
      { mainCategorySlug: 'frontend', subCategorySlug: 'react' },
      { mainCategorySlug: 'frontend', subCategorySlug: 'vue' },
      { mainCategorySlug: 'backend', subCategorySlug: 'nodejs' },
      { mainCategorySlug: 'backend', subCategorySlug: 'go' }
    ]
  */

  return paths;
}

// 3. 页面组件直接从 params 中解构参数，无需 await
const SubCategoryPage = ({ params }: Props) => {
  const { mainCategorySlug, subCategorySlug } = params;

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
