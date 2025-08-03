import { Metadata } from "next";
import { getAllPostSlugs, getPostData } from "../../../lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import styles from "./post.module.css";
import { ReactNode } from "react";

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
      openGraph: {
        title: postData.title,
        description: postData.description || "",
        images: postData.coverImage ? [postData.coverImage] : [],
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

    const components: Components = {
      h1: ({ ...props }) => <h1 className={styles.articleH1} {...props} />,
      h2: ({ ...props }) => <h2 className={styles.articleH2} {...props} />,
      p: ({ ...props }) => <p className={styles.articleP} {...props} />,

      img: (props) => {
        const { src, alt, width, height, ...rest } = props;
        if (typeof src !== "string") {
          return null;
        }
        const numWidth = width ? parseInt(String(width), 10) : 700;
        const numHeight = height ? parseInt(String(height), 10) : 400;
        return (
          <span className={styles.imageWrapper}>
            <Image
              src={src || ""}
              alt={alt || ""}
              width={numWidth}
              height={numHeight}
              {...rest}
            />
          </span>
        );
      },

      code(props) {
        const { children, className, inline, ...rest } = props as {
          children?: ReactNode;
          className?: string;
          inline?: boolean;
        };
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
          <div className={styles.codeBlock}>
            <SyntaxHighlighter
              style={atomDark}
              language={match[1]}
              PreTag="div"
              {...rest}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className={className} {...rest}>
            {children}
          </code>
        );
      },
    };

    return (
      <article className={styles.article}>
        <h1>{postData.title}</h1>
        <div>
          <time dateTime={postData.date}>{postData.date}</time>
        </div>

        <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
          {postData.content}
        </ReactMarkdown>
      </article>
    );
  } catch {
    notFound();
  }
}
