import Link from 'next/link';
import { getSortedPostsData, PostMeta } from '@/lib/posts';

export default function BlogIndex() {
  const allPostsData: PostMeta[] = getSortedPostsData();

  return (
    <section
      className="flex flex-col gap-4 w-full py-16 px-24 
    max-lg:py-8 max-lg:px-5"
    >
      <h2 className="flex justify-center text-4xl font-bold mb-4">Blog</h2>
      <ul className="flex flex-col gap-4">
        {allPostsData.map(({ slug, date, title }) => (
          <li
            key={slug}
            className="border border-gray-200 p-4 rounded-2xl w-fit"
          >
            <Link href={`/${slug}`}>{title}</Link>
            <br />
            <small>
              <time dateTime={date}>{date}</time>
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
