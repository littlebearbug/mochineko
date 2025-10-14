import { SubCategory } from '@/constants/type';

const CategoryCard = ({ subCategory }: { subCategory: SubCategory }) => {
  return (
    <div className="">
      <h2>{subCategory.name}</h2>
      <p>{subCategory.description}</p>
    </div>
  );
};

export default CategoryCard;
