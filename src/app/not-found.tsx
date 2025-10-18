import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="py-20 px-25 max-lg:px-4 max-lg:py-8 h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-[1240px] max-lg:max-w-[700px] flex max-lg:flex-col items-center gap-10 justify-between max-lg:justify-center max-lg:gap-6">
        <div className="flex flex-col items-start gap-4 flex-1 max-lg:text-center max-lg:items-center">
          <h1 className="text-6xl font-bold text-[#333] max-lg:text-3xl">
            404
          </h1>
          <h2 className="text-3xl max-lg:text-2xl">页面没找着</h2>
          <p>页面可能不存在或者已经被删掉了！推荐您点击下方按钮回到首页</p>
          <Link
            href="/"
            className="bg-[#333] mt-8 text-white px-8 py-3 rounded-md hover:bg-[#444] transition-colors duration-300 max-lg:mt-4"
          >
            回到首页
          </Link>
        </div>
        <div className="w-[526px] max-lg:w-full">
          <Image
            src="https://pub.bearbug.dpdns.org/1760779861373-404dark.webp"
            alt="404"
            width="0"
            height="0"
            sizes="100%"
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default NotFound;
