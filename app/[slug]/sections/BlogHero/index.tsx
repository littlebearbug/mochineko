import Section from '@/components/common/Section';
import BreadCrumbs from '@/components/navigation/BreadCrumbs';
import { CATEGORIES } from '@/constants';
import { PostMeta } from '@/utils/lib/posts';
import Image from 'next/image';

const BlogHero = (props: PostMeta) => {
  const { title, description, cover, author, date, categories } = props;
  const category = CATEGORIES[categories![0] - 1];
  return (
    <Section className="pt-8 pb-8 max-lg:pt-4 max-lg:pb-4">
      <div className="max-w-[1240px] mx-auto w-full max-lg:max-[700px]">
        <BreadCrumbs
          items={[
            { title: '首页', href: '/' },
            { title: category.name, href: `/category/${category.slug}` },
          ]}
        />

        <h1 className="text-[40px] font-bold my-4 max-lg:text-[32px]">
          {title}
        </h1>
        <p className="text-[16px] font-medium my-4">{description}</p>
        <div className="flex gap-6 my-4 items-end">
          <p className="text-[14px] font-[600] text-gray-400">@{author}</p>
          <p className="text-[12px] font-[500] text-gray-400">
            {date.toISOString().split('T')[0]}
          </p>
        </div>
        <div className="aspect-video rounded-2xl overflow-hidden">
          <Image
            src={cover!}
            alt="cover"
            width="0"
            height="0"
            sizes="100%"
            priority={true}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </Section>
  );
};

export default BlogHero;
