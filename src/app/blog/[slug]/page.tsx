import { Metadata } from "next";
import { getAllPostSlugs, getPostData } from "../../../lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import styles from "./post.module.css";
import { ReactNode } from "react"; // 引入 ReactNode 类型

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
  } catch (error) {
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
      h1: ({ node, ...props }) => (
        <h1 className={styles.articleH1} {...props} />
      ),
      h2: ({ node, ...props }) => (
        <h2 className={styles.articleH2} {...props} />
      ),
      p: ({ node, ...props }) => <p className={styles.articleP} {...props} />,

      img: (props) => {
        const { node, src, alt, width, height, ...rest } = props;
        if (typeof src !== "string") {
          return null; // 或者返回一个占位符
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

      // 实现代码语法高亮 (已修复类型)
      code(props) {
        // 从 props 中解构出 ref，以将其从 rest 中分离
        const { children, className, node, ref, ...rest } = props as {
          children?: ReactNode;
          className?: string;
          node?: any;
          ref?: any; // 将 ref 显式定义为 any 来处理
        };
        const inline = (props as any).inline;
        const match = /language-(\w+)/.exec(className || "");

        return !inline && match ? (
          <div className={styles.codeBlock}>
            <SyntaxHighlighter
              style={atomDark as any}
              language={match[1]}
              PreTag="div"
              // 这里的 rest 不再包含 ref，问题解决
              {...rest}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className={className} ref={ref as any} {...rest}>
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
