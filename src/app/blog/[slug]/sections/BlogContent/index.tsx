import { ElementContent } from "hast";
import { isValidElement } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import remarkAttributes from "@/plugins/remark-attributes";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./styles.css";

const BlogContent = ({ content }: { content: string }) => {
  const components: Components = {
    img: (props) => {
      const { node: _node, src, alt, title, width, height } = props;

      if (typeof src !== "string") {
        return null;
      }
      const numWidth = width ? parseInt(String(width), 10) : 700;
      const numHeight = height ? parseInt(String(height), 10) : 400;
      return (
        <span className="flex flex-col gap-2 py-4">
          <Image
            src={src || ""}
            alt={alt || ""}
            width={numWidth}
            height={numHeight}
            title={title}
          />
          <span className="text-sm text-gray-500 px-2">{title}</span>
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
          <div className="mb-4">
            <SyntaxHighlighter
              style={a11yDark}
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
    <section className="py-20 px-25 max-lg:px-5 max-lg:py-12 flex justify-center">
      <div className="max-w-[980px] w-full max-lg:max-w-[700px] flex max-lg:flex-col gap-5 justify-center items-start">
        <div className="flex-[1] rounded-2xl p-6 border-1 border-gray-300 max-lg:hidden"></div>
        <article className="max-w-[760px] w-full blog">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm, remarkAttributes]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
};

export default BlogContent;
