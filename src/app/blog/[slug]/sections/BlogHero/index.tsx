const BlogHero = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <section
      className="flex flex-col items-center justify-center text-center blog py-[64px] px-[100px] 
    max-lg:py-[32px] max-lg:px-[20px] bg-black text-white"
    >
      <h1 className="max-w-[980px] max-lg:max-w-[700px]">{title}</h1>
      <p className="max-w-[980px] max-lg:max-w-[700px]">{description}</p>
    </section>
  );
};

export default BlogHero;
