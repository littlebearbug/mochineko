import { Metadata } from "next";
import { getAllPostSlugs, getPostData } from "../../../lib/posts";
import { notFound } from "next/navigation";

import BlogContent from "./sections/BlogContent";

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
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
        description: postData.description || "",
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function Post({ params }: Props) {
  const { slug } = await params;

  try {
    const postData = await getPostData(slug);

    return (
      <>
        <h1>{postData.title}</h1>
        <div>
          <time dateTime={postData.date}>{postData.date}</time>
        </div>
        <BlogContent content={postData.content} />
      </>
    );
  } catch {
    notFound();
  }
}
