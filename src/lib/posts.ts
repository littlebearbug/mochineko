import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/postsData");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author?: string; // 可选字段
  description?: string; // 可选字段
  tags?: string[]; // 标签是字符串数组
  coverImage?: string; // 可选字段
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function getSortedPostsData(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as {
        title: string;
        date: string;
        author?: string;
        description?: string;
        tags?: string[];
        coverImage?: string;
      }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      slug: fileName.replace(/\.md$/, ""),
    };
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  // 我们现在返回原始的 markdown 内容，而不是 HTML
  const content = matterResult.content;

  return {
    slug,
    content, // <--- 注意：这里从 contentHtml 变成了 content
    ...(matterResult.data as {
      title: string;
      date: string;
      author?: string;
      description?: string;
      tags?: string[];
      coverImage?: string;
    }),
  };
}
