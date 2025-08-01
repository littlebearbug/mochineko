import { getAllPostSlugs, getPostData } from "../../../lib/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

interface PostProps {
  params: {
    slug: string;
  };
}

export default async function Post({ params }: PostProps) {
  const { slug } = params;

  try {
    const postData = await getPostData(slug);

    return (
      <article>
        <h1>{postData.title}</h1>
        <div>
          <time dateTime={postData.date}>{postData.date}</time>
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    );
  } catch (error) {
    notFound();
  }
}
