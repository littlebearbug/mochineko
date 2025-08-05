import Image from "next/image";

const BlogHero = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <>
      <p>{title}</p>
      <p>{description}</p>
      <Image src={image} alt="Blog Hero" width={500} height={500} />
    </>
  );
};

export default BlogHero;
