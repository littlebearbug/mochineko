import type { ComponentProps } from 'react';

type SectionProps = ComponentProps<'section'>;

const Section = ({ children, className, ...rest }: SectionProps) => {
  return (
    <section
      {...rest}
      className={`px-25 py-20 max-lg:px-5 max-lg:py-12 ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
