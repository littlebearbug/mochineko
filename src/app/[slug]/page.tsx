import { Metadata } from 'next';
import { getAllPostSlugs, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';

import BlogContent from './sections/BlogContent';
import BlogHero from './sections/BlogHero';
import ProgressTip from './sections/ProgressTip';

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  if (paths.length === 0) {
    return [{ slug: 'no-posts-yet' }];
  }
  return paths;
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const postData = await getPostData(slug);
    return {
      title: postData.title,
      description: postData.description,
      authors: [{ name: postData.author }],
      keywords: postData.keywords,
      openGraph: {
        title: postData.title,
        description: postData.description || '',
      },
    };
  } catch {
    return {
      title: '文章不存在',
    };
  }
}

export default async function Post({ params }: Props) {
  const { slug } = await params;

  if (slug === 'no-posts-yet') {
    return <h1>暂无文章</h1>;
  }

  try {
    const postData = await getPostData(slug);

    return (
      <>
        <ProgressTip />
        <BlogHero
          title={postData.title}
          description={postData.description || ''}
        />
        <BlogContent content={postData.content} />
      </>
    );
  } catch {
    notFound();
  }
}
