'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Heading {
  depth: number;
  text: string;
  id: string;
}

interface TocProps {
  headings: Heading[];
}

const TableOfContents = ({ headings }: TocProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      let currentId = null;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          if (element.getBoundingClientRect().top < 100) {
            currentId = heading.id;
          }
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  return (
    <div className="col-span-3 w-[280px] max-h-[498px] overflow-auto scrollbar-hide touch-pan-y p-6 max-lg:hidden sticky top-[80px]">
      <h2 className="text-[24px] font-bold mb-4">目录</h2>
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${heading.depth === 3 ? 'ml-3' : ''} ${
              heading.depth === 2 ? 'font-bold' : ''
            } mb-1.5 w-full`}
          >
            <Link
              className={`text-left cursor-pointer text-[15px] hover:text-blue-500 transition-colors line-clamp-1 ${
                heading.id === activeId
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-600'
              }`}
              href={`#${heading.id}`}
              title={heading.text}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
