import fs from 'fs';
import path from 'path';

const slug = process.argv[2];

if (!slug) {
  console.error('错误: 请提供一个 post slug 作为参数。');
  console.log('用法: pnpm create-post <post-slug>');
  process.exit(1);
}

const postsDir = path.join(process.cwd(), 'src', 'postsData');
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
# 技术世界中有细分: 101(前端基础)、102(框架与库)、103(工程化与工具)、104(性能优化)、105(UI/UX 与设计)、106(编程拾遗)
# 游戏频道中有细分: 201(游戏评测)、202(游戏杂谈)、203(攻略心得)、204(硬件外设)
# 音乐随想中有细分: 301(专辑/单曲乐评)、302(歌单分享)、303(音乐故事)、304(器材与软件)
# 生活碎笔中有细分: 401(日常感悟)、402(观影读书)、403(旅行足迹)、404(灵光一闪)
# categories可选 [101, 102, 103, 104, 105, 106, 201, 202, 203, 204, 301, 302, 303, 304, 401, 402, 403, 404]
title: Undefined
description: Undefined
date: ${formattedDate}
categories: []
author: MochiNeko
draft: true
---
`;

fs.mkdirSync(postsDir, { recursive: true });

fs.writeFileSync(filePath, fileContent, 'utf8');

console.log(`✅ 文章创建成功!`);
console.log(`   路径: ${path.relative(process.cwd(), filePath)}`);
