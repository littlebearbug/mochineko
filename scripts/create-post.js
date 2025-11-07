import fs from 'fs';
import path from 'path';

const slug = process.argv[2];

if (!slug) {
  console.error('错误: 请提供一个 post slug 作为参数。');
  console.log('用法: pnpm (run) new:post <post-slug>');
  process.exit(1);
}

const postsDir = path.join(process.cwd(), 'posts_data');
const filePath = path.join(postsDir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`错误: 文件 "${filePath}" 已存在。`);
  process.exit(1);
}

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const fileContent = `---
# 博客分为四个大类: 1(技术世界)、2(游戏频道)、3(音乐随想)、4(生活碎笔)
title: Undefined
description: Undefined
date: ${formattedDate}
categories: []
tags: []
author: MochiNeko
draft: true
cover: https://pub.bearbug.dpdns.org/1760765176012-thumbnail.webp
---
`;

fs.mkdirSync(postsDir, { recursive: true });

fs.writeFileSync(filePath, fileContent, 'utf8');

console.log(`✅ 文章创建成功!`);
console.log(`   路径: ${path.relative(process.cwd(), filePath)}`);
