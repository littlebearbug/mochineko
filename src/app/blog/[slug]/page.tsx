import { Metadata } from "next";
import { getAllPostSlugs, getPostData } from "../../../lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import styles from "./post.module.css";
import { isValidElement } from "react";
import { Element, ElementContent } from "hast";

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

    const components: Components = {
      h1: ({ node: _node, ...props }) => {
        return <h1 className={styles.articleH1} {...props} />;
      },
      h2: ({ node: _node, ...props }) => {
        return <h2 className={styles.articleH2} {...props} />;
      },
      p: ({ node: _node, ...props }) => {
        return <p className={styles.articleP} {...props} />;
      },

      img: (props) => {
        const { node: _node, src, alt, width, height, ...rest } = props;

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

      pre: ({ children }) => {
        if (isValidElement(children)) {
          const {
            node: _node,
            className,
            children: _children,
            ...rest
          } = children.props as {
            node: Element;
            className: string;
            children: ElementContent[];
          };

          const match = /language-(\w+)/.exec(className || "");

          return (
            <div className={styles.codeBlock}>
              <SyntaxHighlighter
                style={atomDark}
                language={match ? match[1] : "text"}
                PreTag="div"
                {...rest}
              >
                {String(_children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          );
        }

        return <></>;
      },

      code: (props) => {
        const { children, className, node: _node, ...rest } = props;
        return (
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
