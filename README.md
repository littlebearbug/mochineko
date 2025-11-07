# MochiNeko Blog 🐱

一个现代化、快速、美观的博客模板，基于 Next.js 构建，并已预先配置好通过 GitHub Actions 自动部署到 GitHub Pages。

[![GitHub Pages Deploy](https://github.com/littlebearbug/mochineko/actions/workflows/deploy.yml/badge.svg)](https://github.com/littlebearbug/mochineko/actions/workflows/deploy.yml)

### ✨ [Live Demo](https://littlebearbug.github.io/mochineko/)

---

## 🚀 特性

- **⚡️ 极速性能**: 基于 Next.js 的静态站点生成 (SSG)，提供极致的加载速度和用户体验。
- **✍️ Markdown 驱动**: 在 `posts_data` 目录中用简单的 Markdown 文件撰写文章。
- **📱 响应式设计**: 完美适配桌面、平板和移动设备。
- **🤖 SEO 友好**: 优化的元数据和结构，有助于搜索引擎收录。
- **自动化部署**: 集成 GitHub Actions，只需 `git push` 即可自动完成构建和部署。
- **📦 高效包管理**: 使用 `pnpm` 进行快速、高效的依赖管理。

## 🛠️ 技术栈

- [Next.js](https://nextjs.org/) – React 框架
- [React](https://reactjs.org/) – UI 库
- [TypeScript](https://www.typescriptlang.org/) – 类型化 JavaScript
- [pnpm](https://pnpm.io/) – 快速、节省磁盘空间的包管理器

## 📦 本地开发

想要在本地运行和调试这个项目吗？请遵循以下步骤。

**1. 前置要求**

确保你的电脑上已经安装了 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本) 和 [pnpm](https://pnpm.io/installation)。

**2. 克隆并安装依赖**

```bash
# 克隆仓库到本地
git clone https://github.com/littlebearbug/mochineko.git

# 进入项目目录
cd mochineko

# 安装项目依赖 (推荐使用 pnpm)
pnpm install
```

**3. 运行开发服务器**

```bash
# 启动本地开发环境
pnpm run dev
```

现在，打开你的浏览器并访问 `http://localhost:3000`，你就能看到你的博客网站了！

## ✍️ 如何创建新文章

我们提供了一个便捷的命令行脚本来帮助你创建新的文章。

```bash
# 运行此命令来创建一篇新文章
# 将 "your-slug" 替换为你文章的 URL 友好型短链接
pnpm run new:post "your-awesome-post-slug"
```

这个命令会自动在 `posts_data` 目录下创建一个新的 Markdown 文件，并包含预设的 front-matter（例如标题、日期等），你只需要专注于写作即可。

## 🌐 部署到 GitHub Pages

本仓库已经配置好了 GitHub Actions，可以实现自动化部署。

**首次部署步骤:**

1.  将你的代码推送到 GitHub 仓库的 `main` 分支。
2.  进入你的 GitHub 仓库页面，点击 **Settings** -> **Pages**。
3.  在 **Build and deployment** 下，将 **Source** 从 "Deploy from a branch" 修改为 **"GitHub Actions"**。

![GitHub Pages Settings](https://pub.bearbug.dpdns.org/1760193566295-Snipaste_2025-10-11_22-39-08.png)
_(这是一个示例图片，请确保你的设置与此类似)_

完成以上设置后，每当你向 `main` 分支推送新的提交时，GitHub Actions 都会自动开始构建和部署你的网站。你可以在仓库的 **Actions** 选项卡中查看部署进度。

## 🔗 使用自定义域名

如果你想为你的博客绑定一个自定义域名，请按照以下步骤操作，详情参考[Github 文档](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site)：

1.  **GitHub 端配置**:
    - 在仓库的 **Settings -> Pages** 页面，找到 **Custom domain** 字段。
    - 输入你的域名（例如 `blog.yourdomain.com`）并点击 **Save**。
    - GitHub 会提示你进行 DNS 配置。

2.  **DNS 服务商配置**:
    - 登录你的域名注册商（如 GoDaddy, Namecheap, 阿里云等）。
    - 添加一条 `CNAME` 记录，将你的子域名（如 `blog`）指向 `<你的GitHub用户名>.github.io`。

3.  **项目配置 (重要!)**:
    - 打开 `next.config.ts` 文件。
    - 如果你的部署不是在根域名下（例如，你没有使用自定义域名而是 `username.github.io/repo-name`），你可能需要配置 `basePath` 和 `assetPrefix`。
    - **如果你使用了自定义域名**，通常不需要修改 `next.config.ts`，但请确保没有错误的 `basePath` 配置。
