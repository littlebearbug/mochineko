import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/postsData');

export interface PostMeta {
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  keywords?: string[];
  author?: string;
  categories?: number[];
  tags?: string[];
  date: string;
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

    return {
      slug,
      ...matterResult.data,
    } as PostMeta;
  });

  const sortedPosts = allPostsMetaData.sort((a, b) => {
    if (sortby === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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

  return {
    slug,
    content,
    ...matterResult.data,
  } as Post;
}
