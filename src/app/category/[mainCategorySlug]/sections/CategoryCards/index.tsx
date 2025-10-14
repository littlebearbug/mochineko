import CategoryCard from '@/components/blog/CategoryCard';
import Section from '@/components/common/Section';
import { SubCategory } from '@/constants/type';
import Link from 'next/link';

type Props = {
  subCategories: readonly SubCategory[];
};

const CategoryCards = ({ subCategories }: Props) => {
  return (
    <Section className="flex justify-center">
      <div className="flex max-w-[1240px] w-full">
        {subCategories.map((subCategory) => (
          <Link href={subCategory.slug} key={subCategory.id}>
            <CategoryCard subCategory={subCategory} />
          </Link>
        ))}
      </div>
    </Section>
  );
};

export default CategoryCards;
