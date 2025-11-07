import { PostMeta } from '@/utils/lib/posts';
import Image from 'next/image';
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
      className="group p-4 flex flex-col gap-4 flex-1 border-1 rounded-xl border-gray-200"
    >
      <div className="aspect-video w-full rounded-xl overflow-hidden">
        <Image
          src={post.cover!}
          alt="thumbnail"
          width={1240}
          height={827}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="flex flex-col gap-5 p-2">
        <div className="flex flex-col gap-4">
          {post.tags && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {post.tags.map((tag) => {
                const categoryId = post.categories ? post.categories[0] - 1 : 0;
                const colorClass = categoryColor[categoryId];
                return (
                  <span
                    key={tag}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          <h2
            className="font-bold line-clamp-1 group-hover:text-blue-500"
            title={post.title}
          >
            {post.title}
          </h2>
          <p
            className="font-[500] text-[14px] line-clamp-2 group-hover:text-blue-500"
            title={post.description}
          >
            {post.description}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-[14px] font-[600] text-gray-400">{post.author}</p>
          <p className="text-[12px] font-[600] text-gray-400">
            {post.date.toISOString().split('T')[0]}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
