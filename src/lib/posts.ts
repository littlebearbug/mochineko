import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/postsData');

interface Post {
  title: string;
  description?: string;
  excerpt?: string;
  keywords?: string[];
  author?: string;
  categories?: string[];
  tags?: string[];
  date: string;
  draft?: boolean;
}

export interface PostMeta extends Post {
  slug: string;
}

export function getSortedPostsData(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as Post),
    };
  });

  const publishedPosts = allPostsData.filter((post) => !post.draft);

  return publishedPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
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
    ...(matterResult.data as Post),
  };
}
