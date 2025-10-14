import { SUB_CATEGORY_MAP } from '@/constants';
import { PostMeta } from '@/lib/posts';
import Link from 'next/link';

const categoryColor = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
];

const BlogCard = ({ post }: { post: PostMeta }) => {
  return (
    <Link
      href={`/${post.slug}`}
      className="flex flex-col w-full md:w-[48%] lg:w-[31%] border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {post.title}
      </h2>

      <p
        className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-4"
        title={post.description}
      >
        {post.description}
      </p>

      {post.categories && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {post.categories.map((category) => {
            const categoryInfo = SUB_CATEGORY_MAP[category];
            if (!categoryInfo) {
              return null;
            }
            const colorClass = categoryColor[categoryInfo.parent - 1];
            return (
              <span
                key={category}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}
              >
                {categoryInfo.name}
              </span>
            );
          })}
        </div>
      )}
    </Link>
  );
};

export default BlogCard;
