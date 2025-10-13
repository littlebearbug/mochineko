import Section from '@/components/common/Section';
import Image from 'next/image';

const HomeHero = () => {
  return (
    <Section className="bg-[#f5f5f5]">
      <div className="max-w-[1240px] mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-[46px] font-[700] leading-[1.2] tracking-[-0.02em] py-6 max-lg:text-[37px]">
            博客
          </h1>
          <p className="text-[18px] leading-[1.5] font-[400] tracking-[0] py-4 max-lg:text-[16px]">
            其实是Mochineko的知识库
          </p>
        </div>
        <Image
          width={160}
          height={160}
          alt="mochineko"
          src="https://pub.bearbug.dpdns.org/1760153901408-neko.webp"
          priority={true}
        />
      </div>
    </Section>
  );
};

export default HomeHero;
