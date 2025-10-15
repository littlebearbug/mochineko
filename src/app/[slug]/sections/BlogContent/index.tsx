import { ElementContent } from 'hast';
import { isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import remarkAttributes from '@/plugins/remark-attributes';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import Link from 'next/link';
import Section from '@/components/common/Section';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('nginx', json);

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

        let lang = 'text';

        if (match) {
          if (match[1].toLocaleLowerCase() === 'javascript') {
            lang = 'javascript';
          } else {
            lang = match[1].toLocaleLowerCase();
          }
        }

        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            customStyle={{ borderRadius: 4 }}
            language={lang}
            PreTag="pre"
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
        <span className={`code ${className}`} {...rest}>
          {children}
        </span>
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
    <Section className="flex justify-center">
      <div className="max-lg:max-w-[700px] max-w-[1240px] w-full flex justify-center items-start gap-25">
        <article className="col-span-9 max-w-[860px] w-full blog max-lg:col-span-12">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkAttributes, remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        </article>
        <div className="col-span-3 w-[280px] max-h-[498px] overflow-auto scrollbar-hide touch-pan-y p-6 max-lg:hidden sticky top-[80px] ">
          <h2 className="text-[24px] font-bold mb-4">目录</h2>
          <ul>
            {headings.map((heading, index) => (
              <li
                key={index}
                className={`${heading.depth === 3 ? 'ml-3' : ''} ${heading.depth === 2 ? 'font-bold' : ''} mb-1.5 w-full`}
              >
                <Link
                  className="text-left cursor-pointer text-[15px] hover:text-blue-500 transition-colors line-clamp-1"
                  href={`#${heading.id}`}
                  title={heading.text}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default BlogContent;
