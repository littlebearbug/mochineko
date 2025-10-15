import CategoryCard from '@/components/blog/CategoryCard';
import Section from '@/components/common/Section';
import { SubCategory } from '@/constants/type';

type Props = {
  subCategories: readonly SubCategory[];
};

const CategoryCards = ({ subCategories }: Props) => {
  return (
    <Section className="flex justify-center">
      <div className="flex max-w-[1240px] max-lg:max-w-[700px] w-full flex-wrap gap-6">
        {subCategories.map((subCategory) => (
          <CategoryCard key={subCategory.id} subCategory={subCategory} />
        ))}
      </div>
    </Section>
  );
};

export default CategoryCards;
