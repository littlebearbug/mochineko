import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4 text-center">
      <p className="text-sm">
        MochiNeko 的 ❤️{' '}
        <Link href="/" className="hover:text-blue-500">
          博客
        </Link>
      </p>
      <p className="text-sm">© 2025 - MochiNeko</p>
      <p className="text-sm">目前还是非常随意的一个Footer</p>
    </footer>
  );
};

export default Footer;
