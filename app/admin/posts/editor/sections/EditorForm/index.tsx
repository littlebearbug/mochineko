'use client';

import { useForm } from 'react-hook-form';
import { savePost } from '@/utils/lib/github-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/constants';
import { useToast } from '@/components/admin/Toast';
import Button from '@/components/common/Button';

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
  const { register, handleSubmit } = useForm<FormData>({
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
  const { showToast } = useToast();

  const onSubmit = async (data: FormData, action: 'save' | 'publish') => {
    const token = localStorage.getItem('github_pat');
    const owner = localStorage.getItem('github_owner');
    const repo = localStorage.getItem('github_repo');

    if (!token || !owner || !repo) {
      showToast('Missing credentials, please relogin.', 'info');
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
      showToast(
        `${action === 'save' ? 'Saved' : 'Published'} successfully!`,
        'success'
      );
      if (action === 'publish') {
        router.push('/admin');
      }
    } catch (error) {
      console.error(error);
      showToast(
        'Error saving post: ' +
          (error instanceof Error ? error.message : String(error)),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm sm:leading-6 transition-all duration-200';
  const labelClasses =
    'block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-1';

  return (
    <div className="mx-auto max-w-5xl">
      <div className="space-y-8 bg-white dark:bg-gray-900 rounded-xl p-1 md:p-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="col-span-1 md:col-span-2">
            <label className={labelClasses}>Title</label>
            <input
              {...register('title', { required: true })}
              className={`${inputClasses} text-lg font-medium`}
              placeholder="Enter post title..."
            />
          </div>

          <div>
            <label className={labelClasses}>Slug (Filename)</label>
            <input
              {...register('slug', { required: true })}
              className={inputClasses}
              placeholder="my-new-post"
              disabled={!!initialData?.slug}
            />
          </div>

          <div>
            <label className={labelClasses}>Author</label>
            <input
              {...register('author')}
              className={inputClasses}
              placeholder="Author Name"
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
          <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            Metadata
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClasses}>Date</label>
              <input
                type="date"
                {...register('date')}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Category</label>
              <select {...register('categories.0')} className={inputClasses}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className={labelClasses}>Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className={inputClasses}
                placeholder="Brief summary of the post..."
              />
            </div>

            <div>
              <label className={labelClasses}>Tags (comma separated)</label>
              <input
                {...register('tags')}
                className={inputClasses}
                placeholder="tech, life, coding"
              />
            </div>
            <div>
              <label className={labelClasses}>Cover Image URL</label>
              <input
                {...register('cover')}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClasses}>Markdown Content</label>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                {...register('draft')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Mark as Draft
              </span>
            </label>
          </div>
          <textarea
            {...register('content')}
            rows={20}
            className={`${inputClasses} font-mono text-sm leading-relaxed`}
            placeholder="# Write your story here..."
          />
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 mt-8 flex justify-end gap-4 border-t border-gray-100 bg-white/80 p-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 rounded-t-xl md:rounded-xl shadow-lg">
        <Button
          onClick={handleSubmit((data) => onSubmit(data, 'save'))}
          disabled={loading}
          variant="solid"
          className="w-full md:w-auto"
        >
          {loading ? 'Saving...' : 'Save Draft (Branch)'}
        </Button>
        <Button
          onClick={handleSubmit((data) => onSubmit(data, 'publish'))}
          disabled={loading}
          variant="outline"
          className="w-full md:w-auto bg-white dark:bg-gray-800"
        >
          {loading ? 'Publishing...' : 'Publish (Main)'}
        </Button>
      </div>
    </div>
  );
}
