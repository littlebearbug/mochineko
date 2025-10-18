import Link from 'next/link';
import { Fragment } from 'react';

interface BreadCrumbsProps {
  items: {
    title: string;
    href?: string;
  }[];
}

const BreadCrumbs = (props: BreadCrumbsProps) => {
  const { items } = props;
  return (
    <nav className="text-gray-500 text-sm">
      {items.map((item, index) => {
        if (index === items.length - 1) {
          return item.href ? (
            <Link href={item.href} key={index} className="hover:text-blue-300">
              {item.title}
            </Link>
          ) : (
            <span key={index} className="text-gray-400">
              {item.title}
            </span>
          );
        }
        return (
          <Fragment key={index}>
            {item.href ? (
              <Link href={item.href || ''} className="hover:text-blue-300">
                {item.title}
              </Link>
            ) : (
              <span className="text-gray-400">{item.title}</span>
            )}
            <span className="mx-2">/</span>
          </Fragment>
        );
      })}
    </nav>
  );
};

export default BreadCrumbs;
