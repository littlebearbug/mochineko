import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen flex-center">
      <Link href="/blog">博客页面</Link>
    </div>
  );
}
