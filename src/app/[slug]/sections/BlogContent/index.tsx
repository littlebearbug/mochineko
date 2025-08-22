import { ElementContent } from 'hast';
import { isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import remarkAttributes from '@/plugins/remark-attributes';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx';
import Link from 'next/link';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('nginx', nginx);

const BlogContent = ({ content }: { content: string }) => {
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  const stripMarkdown = (text: string): string =>
    text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

  const getText = (node: any): string => {
    if (node.type === 'text') return node.value || '';
    if (node.children) {
      return node.children.map(getText).join('');
    }
    return '';
  };

  const extractHeadings = (md: string) => {
    const headings: { depth: number; text: string; id: string }[] = [];
    const lines = md.split('\n');
    let inCodeBlock = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const depth = trimmed.startsWith('###') ? 3 : 2;
        let rawText = trimmed.replace(/^#{2,3} /, '').trim();
        let id = '';
        const attrMatch = rawText.match(/\{(.+)\}$/);
        if (attrMatch) {
          rawText = rawText.replace(/\{(.+)\}$/, '').trim();
          const idMatch = attrMatch[1].match(/id="([^"]+)"/);
          if (idMatch) id = idMatch[1];
        }
        const plainText = stripMarkdown(rawText);

        if (!id) {
          id = slugify(plainText);
        }

        headings.push({ depth, text: plainText, id: id });
      }
    }
    return headings;
  };

  const headings = extractHeadings(content);

  const components: Components = {
    img: (props) => {
      const { node: _node, src, alt, title, width, height } = props;

      if (typeof src !== 'string') {
        return null;
      }
      const numWidth = width ? parseInt(String(width), 10) : 700;
      const numHeight = height ? parseInt(String(height), 10) : 400;
      return (
        <span className="flex flex-col gap-2 py-4">
          <Image
            src={src || ''}
            alt={alt || ''}
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

        const match = /language-(\w+)/.exec(className || '');

        return (
          <SyntaxHighlighter
            style={a11yDark}
            language={match ? match[1] : 'text'}
            PreTag="div"
            {...rest}
          >
            {String(_children).replace(/\n$/, '')}
          </SyntaxHighlighter>
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

    h2: (props) => {
      const { node, ...rest } = props;
      if (!rest.id) {
        const text = getText(node);
        rest.id = slugify(text);
      }
      return <h2 {...rest} />;
    },

    h3: (props) => {
      const { node, ...rest } = props;
      if (!rest.id) {
        const text = getText(node);
        rest.id = slugify(text);
      }
      return <h3 {...rest} />;
    },
  };
  return (
    <section className="py-16 max-lg:px-5 max-lg:py-12 flex justify-center">
      <div className="max-lg:max-w-[700px] w-full flex justify-center items-start gap-4">
        <div className="col-span-3 rounded-2xl p-6 border border-gray-200 shadow-sm max-lg:hidden sticky top-[80px] dark:border-gray-700 dark:shadow-none dark:bg-gray-800">
          <h2 className="text-[24px] font-bold mb-4">Table of Contents</h2>
          <ul>
            {headings.map((heading, index) => (
              <li
                key={index}
                className={`${heading.depth === 3 ? 'ml-6' : ''} mb-3`}
              >
                <Link
                  className="text-left cursor-pointer text-[15px] hover:bg-gray-100 rounded px-2 py-1 transition-colors dark:hover:bg-gray-700"
                  href={`#${heading.id}`}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <article className="col-span-9 max-w-[760px] w-full blog max-lg:col-span-12">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkAttributes, remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
};

export default BlogContent;
