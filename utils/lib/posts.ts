import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts_data');

export interface PostMeta {
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  keywords?: string[];
  author?: string;
  categories?: number[];
  tags?: string[];
  date: Date;
  cover?: string;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

interface GetPostsMetaDataOptions {
  sortby?: 'date' | 'title';
  status?: 'published' | 'draft' | 'all';
  category?: number | null;
}

export function getPostsMetaData({
  sortby = 'date',
  status = 'published',
  category = null,
}: GetPostsMetaDataOptions = {}): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsMetaData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    const meta = matterResult.data as Record<string, any>;

    // Fix date if it is a string (due to quotes in YAML)
    if (typeof meta.date === 'string') {
      meta.date = new Date(meta.date);
    }

    // Ensure categories are numbers
    if (Array.isArray(meta.categories)) {
      meta.categories = meta.categories.map((c: any) => Number(c));
    }

    return {
      slug,
      ...meta,
    } as PostMeta;
  });

  const sortedPosts = allPostsMetaData.sort((a, b) => {
    if (sortby === 'title') {
      return a.title.localeCompare(b.title);
    }
    return b.date.getTime() - a.date.getTime();
  });

  const filteredPosts = sortedPosts.filter((post) => {
    const statusMatch =
      status === 'all' ||
      (status === 'published' && !post.draft) ||
      (status === 'draft' && !!post.draft);

    if (!statusMatch) {
      return false;
    }

    const categoryMatch =
      !category || (post.categories && post.categories.includes(category));

    return categoryMatch;
  });

  return filteredPosts;
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  const postsWithFrontMatter = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      fileName,
      draft:
        (typeof (matterResult.data as Post).draft === 'undefined'
          ? true
          : (matterResult.data as Post).draft) || false,
    };
  });

  const publishedPosts = postsWithFrontMatter.filter((post) => !post.draft);

  return publishedPosts.map((post) => {
    return {
      slug: post.fileName.replace(/\.md$/, ''),
    };
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const content = matterResult.content;

  const meta = matterResult.data as Record<string, any>;

  if (typeof meta.date === 'string') {
    meta.date = new Date(meta.date);
  }
  if (Array.isArray(meta.categories)) {
    meta.categories = meta.categories.map((c: any) => Number(c));
  }

  return {
    slug,
    content,
    ...meta,
  } as Post;
}
