import Link from 'next/link';
import { getSortedPostsData, PostMeta } from '../../lib/posts'; // 调整路径

export default function BlogIndex() {
  const allPostsData: PostMeta[] = getSortedPostsData();

  return (
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ slug, date, title }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>{title}</Link>
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
