'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFiles, getBranches } from '@/utils/lib/github-client';

type PostItem = {
  name: string; // filename with extension
  slug: string;
  path: string;
  sha?: string;
  status: 'published' | 'draft' | 'has_draft';
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('github_pat');
      const owner = localStorage.getItem('github_owner');
      const repo = localStorage.getItem('github_repo');

      if (token && owner && repo) {
        setLoading(true);
        try {
          // 1. Fetch Main Posts
          const filesData = await getFiles(token, owner, repo);
          const mdFiles = filesData.filter((f) => f.name.endsWith('.md'));

          // 2. Fetch Branches (Drafts)
          const branches = await getBranches(token, owner, repo);
          const draftBranches = branches.filter((b) =>
            b.name.startsWith('content/')
          );

          // 3. Merge Data
          const postMap = new Map<string, PostItem>();

          // Add published files
          mdFiles.forEach((f) => {
            const slug = f.name.replace('.md', '');
            postMap.set(slug, {
              name: f.name,
              slug: slug,
              path: f.path,
              sha: f.sha,
              status: 'published',
            });
          });

          // Check for drafts
          draftBranches.forEach((b) => {
            const slug = b.name.replace('content/', '');
            if (postMap.has(slug)) {
              // Post exists in main, but has a draft branch
              const existing = postMap.get(slug)!;
              postMap.set(slug, { ...existing, status: 'has_draft' });
            } else {
              // Post only exists as draft
              postMap.set(slug, {
                name: `${slug}.md`,
                slug: slug,
                path: `posts_data/${slug}.md`, // Presumed path
                status: 'draft',
              });
            }
          });

          setPosts(Array.from(postMap.values()));
        } catch (e) {
          console.error(e);
          setError('Failed to fetch data');
        }
        setLoading(false);
      } else {
        setError('Missing Credentials');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10">Loading posts...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Posts
        </h2>
        <Link
          href="/admin/posts/editor"
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Post Title / Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {posts.map((post) => (
              <tr key={post.slug}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.slug}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {post.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {post.status === 'published' && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Published
                    </span>
                  )}
                  {post.status === 'draft' && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Draft Only
                    </span>
                  )}
                  {post.status === 'has_draft' && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Unpublished Changes
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/posts/editor?slug=${post.slug}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
