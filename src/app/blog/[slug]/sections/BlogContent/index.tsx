import { ElementContent } from "hast";
import { isValidElement } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import Image from "next/image";
import styles from "./style.module.css";
import remarkGfm from "remark-gfm";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const BlogContent = ({ content }: { content: string }) => {
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
              style={atomOneDark}
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
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default BlogContent;
