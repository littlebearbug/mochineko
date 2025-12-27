import Link from 'next/link';
import { navLinks } from '../Navbar/data';
import { GithubIcon, EmailIcon, HeartIcon } from './icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const simpleLinks = navLinks.filter((link) => !link.items);
  const categoryLink = navLinks.find((link) => link.items);

  return (
    <footer className="w-full bg-black px-6 py-10 md:py-12 text-white border-t border-gray-800">
      <div className="max-w-[980px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-10">
          <div className="col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white hover:text-gray-300 transition-colors"
            >
              MochiNeko
            </Link>
            <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-sm">
              这是我的个人博客，记录学习与生活的点滴。
            </p>
          </div>

          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="font-bold text-base text-white uppercase tracking-wider">
              导航
            </h3>
            <ul className="flex flex-col gap-2.5">
              {simpleLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path || '#'}
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-block font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {categoryLink && categoryLink.items && (
            <div className="col-span-1 flex flex-col gap-4">
              <h3 className="font-bold text-base text-white uppercase tracking-wider">
                {categoryLink.label}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {categoryLink.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.path || '#'}
                      className="text-gray-400 hover:text-white transition-colors text-sm inline-block font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <h3 className="font-bold text-base text-white uppercase tracking-wider">
              联系我
            </h3>
            <div className="flex gap-4">
              <a
                href="mailto:mochinekoiiiiii@gmail.com"
                aria-label="Email"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 bg-gray-900 p-2 rounded-full font-medium"
              >
                <EmailIcon className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mochinek0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 bg-gray-900 p-2 rounded-full font-medium"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white font-medium">
            © {currentYear} MochiNeko. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white font-medium">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">
              <HeartIcon />
            </span>
            <span>by MochiNeko</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
