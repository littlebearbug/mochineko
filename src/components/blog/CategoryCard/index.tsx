import { SubCategory } from '@/constants/type';
import Link from 'next/link';

const CategoryCard = ({ subCategory }: { subCategory: SubCategory }) => {
  return (
    <Link
      href={subCategory.slug}
      className="flex flex-col w-full md:w-[48%] lg:w-[31%] border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {subCategory.name}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-4">
        {subCategory.description}
      </p>
    </Link>
  );
};

export default CategoryCard;
