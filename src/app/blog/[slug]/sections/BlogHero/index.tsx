const BlogHero = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <section
      className="flex flex-col items-center justify-center text-center gap-4 blog py-16 px-24 
    max-lg:py-8 max-lg:px-5 bg-black text-white"
    >
      <h1 className="max-w-[980px] max-lg:max-w-[700px]">{title}</h1>
      <p className="max-w-[980px] max-lg:max-w-[700px] text-gray-300">
        {description}
      </p>
    </section>
  );
};

export default BlogHero;
