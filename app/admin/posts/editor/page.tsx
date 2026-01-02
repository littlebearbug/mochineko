'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import PostEditorForm from './sections/EditorForm';
import { getFileContent } from '@/utils/lib/github-client';
import matter from 'gray-matter';

// Suspense needed for useSearchParams in Next.js client components
function EditorContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState('');
  const [source, setSource] = useState<'draft' | 'main' | 'new'>('new');

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setInitialData({});
        setSource('new');
        return;
      }

      const token = localStorage.getItem('github_pat');
      const owner = localStorage.getItem('github_owner');
      const repo = localStorage.getItem('github_repo');

      if (!token || !owner || !repo) {
        setError('Missing credentials');
        setLoading(false);
        return;
      }

      // Try fetching from draft branch first
      const draftBranch = `content/${slug}`;
      const draftFile = await getFileContent(
        token,
        owner,
        repo,
        `posts_data/${slug}.md`,
        draftBranch
      );

      if (draftFile) {
        setSource('draft');
        const { data, content } = matter(draftFile.content);
        setInitialData({
          ...data,
          slug,
          content,
          sha: draftFile.sha,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
        });
      } else {
        // If no draft, fetch from main
        const mainFile = await getFileContent(
          token,
          owner,
          repo,
          `posts_data/${slug}.md`,
          'main'
        );
        if (mainFile) {
          setSource('main');
          const { data, content } = matter(mainFile.content);
          setInitialData({
            ...data,
            slug,
            content,
            sha: mainFile.sha,
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags,
          });
        } else {
          setError('File not found in potential branch or main.');
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) return <div>Loading editor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {slug ? `Edit Post (${slug})` : 'New Post'}
        </h1>
        {source === 'draft' && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            Editing Draft
          </span>
        )}
        {source === 'main' && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Editing Published Version
          </span>
        )}
      </div>

      <PostEditorForm initialData={initialData || {}} />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
