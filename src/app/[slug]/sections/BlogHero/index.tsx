import Section from '@/components/Section';
import Link from 'next/link';

const BlogHero = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Section className="flex flex-col gap-4  bg-black text-white">
      <p className="text-gray-300 text-sm">
        <Link href="/">博客</Link>
        <span className="mx-2">/</span>
        <span>{title}</span>
      </p>
      <div className="flex flex-col items-center justify-center text-center gap-4 blog">
        <h1 className="max-w-[980px] max-lg:max-w-[700px]">{title}</h1>
        <p className="max-w-[980px] max-lg:max-w-[700px] text-gray-300">
          {description}
        </p>
      </div>
    </Section>
  );
};

export default BlogHero;
