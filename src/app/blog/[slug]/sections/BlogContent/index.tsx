import { ElementContent } from "hast";
import { isValidElement } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const BlogContent = ({ content }: { content: string }) => {
  const components: Components = {
    img: (props) => {
      const { node: _node, src, alt, width, height, ...rest } = props;

      if (typeof src !== "string") {
        return null;
      }
      const numWidth = width ? parseInt(String(width), 10) : 700;
      const numHeight = height ? parseInt(String(height), 10) : 400;
      return (
        <span className="flex">
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
          <div className="mb-4">
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
    <section className="py-20 px-25 max-lg:px-5 max-lg:py-12 flex-center">
      <div className="max-w-[980px] w-full max-lg:max-w-[700px] flex gap-5 justify-center items-start">
        <div className="w-50 bg-amber-50 rounded-2xl p-6"></div>
        <article className="max-w-[760px] w-full prose prose-a:no-underline prose-a:text-blue-500 prose-a:hover:text-blue-600">
          <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
};

export default BlogContent;
