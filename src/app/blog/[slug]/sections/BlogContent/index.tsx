'use client';

import { ElementContent } from 'hast';
import { isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import remarkAttributes from '@/plugins/remark-attributes';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
          <div className="mb-4">
            <SyntaxHighlighter
              style={a11yDark}
              language={match ? match[1] : 'text'}
              PreTag="div"
              {...rest}
            >
              {String(_children).replace(/\n$/, '')}
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
    <section className="py-20 max-lg:px-5 max-lg:py-12 flex justify-center">
      <div className="max-w-[980px] w-full max-lg:max-w-[700px] flex max-lg:flex-col gap-5 justify-center items-start">
        <div className="flex-[1] rounded-2xl p-6 border-1 border-gray-300 max-lg:hidden sticky top-[80px]">
          <h2 className="font-bold mb-4">Table of Contents</h2>
          <ul>
            {headings.map((heading, index) => (
              <li
                key={index}
                className={`${heading.depth === 3 ? 'ml-4' : ''} mb-2`}
              >
                <button
                  onClick={() => {
                    const element = document.getElementById(heading.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-left cursor-pointer"
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <article className="max-w-[760px] w-full blog">
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
