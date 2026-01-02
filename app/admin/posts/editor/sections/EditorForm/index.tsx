'use client';

import { useForm } from 'react-hook-form';
import { savePost } from '@/utils/lib/github-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/constants';

type FormData = {
  title: string;
  slug: string;
  date: string;
  description: string;
  author: string;
  categories: number[];
  tags: string; // Comma separated for input
  cover: string;
  draft: boolean;
  content: string;
  sha?: string;
};

export default function PostEditorForm({
  initialData,
}: {
  initialData?: Partial<FormData>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      description: initialData?.description || '',
      author: initialData?.author || 'MochiNeko',
      categories: initialData?.categories || [1],
      tags: initialData?.tags || '',
      cover: initialData?.cover || '',
      draft: initialData?.draft || false,
      content: initialData?.content || '',
      sha: initialData?.sha || undefined,
    },
  });

  const onSubmit = async (data: FormData, action: 'save' | 'publish') => {
    const token = localStorage.getItem('github_pat');
    const owner = localStorage.getItem('github_owner');
    const repo = localStorage.getItem('github_repo');

    if (!token || !owner || !repo) {
      alert('Missing credentials, please relogin.');
      return;
    }

    setLoading(true);
    try {
      // Format tags from string to array if needed
      const tagsArray =
        typeof data.tags === 'string'
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : data.tags;

      const frontmatter = {
        title: data.title,
        date: data.date,
        author: data.author,
        description: data.description,
        tags: tagsArray,
        categories: Array.isArray(data.categories)
          ? data.categories.map(Number)
          : [Number(data.categories)],
        cover: data.cover,
        draft: data.draft,
      };

      await savePost(
        token,
        owner,
        repo,
        data.slug,
        frontmatter,
        data.content,
        action,
        data.sha
      );
      alert(`${action === 'save' ? 'Saved' : 'Published'} successfully!`);
      if (action === 'publish') {
        router.push('/admin');
      }
    } catch (error) {
      console.error(error);
      alert(
        'Error saving post: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Slug (Filename)
          </label>
          <input
            {...register('slug', { required: true })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            placeholder="my-new-post"
            disabled={!!initialData?.slug}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            {...register('title', { required: true })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Date
          </label>
          <input
            type="date"
            {...register('date')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Category
          </label>
          <select
            {...register('categories.0')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={2}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tags (comma separated)
          </label>
          <input
            {...register('tags')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Cover Image URL
          </label>
          <input
            {...register('cover')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('draft')}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Draft
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Markdown Content
        </label>
        <textarea
          {...register('content')}
          rows={15}
          className="block w-full font-mono rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-4 p-4 sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <button
          onClick={handleSubmit((data) => onSubmit(data, 'save'))}
          disabled={loading}
          className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Draft (Branch)'}
        </button>
        <button
          onClick={handleSubmit((data) => onSubmit(data, 'publish'))}
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish (Main)'}
        </button>
      </div>
    </div>
  );
}
