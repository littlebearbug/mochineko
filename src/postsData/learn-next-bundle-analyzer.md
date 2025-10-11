---
# categories可选值:0, 1, 2; 分别对应:博客, 游戏, 技术
title: 学习如何查看Next.js项目的打包体积
date: '2025-10-11'
categories: [0, 1]
tags: [Next.js, Webpack, Bundle Analyzer]
description: 学习如何查看Next.js项目的打包体积
draft: false
---

我们来详细讲解一下如何查看和解析 `@next/bundle-analyzer` 的分析结果。这是一个非常实用的工具，可以帮助我们直观地了解 Next.js 应用打包后的产物构成，从而进行针对性的性能优化。

整个过程分为两个主要部分：

1.  **如何生成和查看报告**
2.  **如何解析报告并进行优化**

---

## 第一部分：如何生成和查看报告

### 步骤 1: 安装依赖

首先，确保你已经安装了该插件。

```bash
npm install @next/bundle-analyzer --save-dev
# 或者
yarn add @next/bundle-analyzer --dev
# 或者
pnpm add @next/bundle-analyzer --save-dev
```

### 步骤 2: 配置 `next.config.js`

你需要修改项目根目录下的 `next.config.js` 文件，来引入并启用这个插件。

一个典型的配置如下：

```javascript
// next.config.js

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // 关键配置：通过环境变量来控制是否启用
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你其他的 Next.js 配置
  reactStrictMode: true,
}

module.exports = withBundleAnalyzer(nextConfig)
```

**关键点解释**：
`enabled: process.env.ANALYZE === 'true'` 这行代码非常重要。它意味着只有当你设置了环境变量 `ANALYZE` 为 `true` 时，这个插件才会被激活。这样做的好处是，你只在需要分析打包体积时才生成报告，而不会在日常开发或常规构建中增加额外的构建时间。

### 步骤 3: 修改 `package.json` 中的 `scripts`

为了方便地设置环境变量并运行构建，我们可以在 `package.json` 文件中添加一条新的命令。

```json
// package.json

"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "analyze": "ANALYZE=true next build" // 添加这条命令
}
```

**注意**：在 Windows 系统中，设置环境变量的方式不同，你可能需要使用 `cross-env` 这个库来确保跨平台兼容性。

1.  安装 `cross-env`: `npm install cross-env --save-dev`
2.  修改 `scripts`: `"analyze": "cross-env ANALYZE=true next build"`

### 步骤 4: 运行分析

现在，在你的项目根目录下运行刚刚添加的命令：

```bash
npm run analyze
# 或者
yarn analyze
# 或者
pnpm analyze
```

当构建过程完成后，你会看到终端输出类似下面的信息，并且浏览器会自动打开报告页面。

```
Creating an optimized production build...
...
Bundle analyzer report generated in:
- .next/analyze/client.html
- .next/analyze/server.html
```

### 步骤 5: 查看报告文件

即使浏览器没有自动打开，你也可以在项目根目录下的 `.next/analyze/` 文件夹中找到生成的 HTML 文件：

*   `client.html`: **客户端打包文件分析报告**。这是你需要重点关注的，因为它直接影响用户的加载速度。
*   `server.html`: 服务端打包文件分析报告。通常体积较大，但对用户加载速度影响不大，主要影响服务器启动时间和内存占用。
*   `edge.html`: 如果你使用了 Edge Runtime (例如在中间件中)，这里会生成对应的报告。

直接用浏览器打开这些 HTML 文件即可查看可视化的分析结果。

---

## 第二部分：如何解析报告并进行优化

打开 `client.html` 后，你会看到一个彩色的、由许多方块组成的矩形图。这个图叫做**树状图（Treemap）**，它的核心思想是：**方块的面积越大，代表该模块的体积越大**。

### 1. 理解界面核心元素



*   **主视图 (Treemap)**:
    *   每个大颜色的块代表一个 chunk (代码块)。
    *   在每个 chunk 内部，更小的块代表组成这个 chunk 的各个模块（比如来自 `node_modules` 的库，或者你自己的组件）。
    *   你可以通过鼠标滚轮进行缩放，点击某个方块可以放大查看其内部构成。

*   **侧边栏/控制栏**:
    *   **Search modules**: 可以快速搜索某个特定的库或文件，看看它是否被打包进来，以及它的大小。
    *   **显示模式 (Sizes to show)**: 这是最关键的分析工具！
        *   `Stat`: 模块在磁盘上的原始大小。参考价值有限。
        *   `Parsed`: **模块被 JavaScript 引擎解析后的大小**。这个尺寸更能反映它在浏览器中占用的内存成本。**通常我们关注这个值**。
        *   `Gzip`: **模块经过 Gzip 压缩后的大小**。这个尺寸最能代表用户实际需要从网络下载的数据量，直接关系到加载速度。**这是进行网络性能优化时最重要的参考指标**。

### 2. 分析与定位问题的常见思路

**目标：找出那些“不应该那么大”或者“可以被优化”的模块。**

#### **情况一：发现某个第三方库体积过大**

这是最常见的情况。你在图中发现一个巨大的方块，鼠标悬停上去发现是 `lodash`、`moment.js`、`chart.js` 等知名库。

*   **问题分析**:
    1.  **全量引入**: 你可能写了 `import _ from 'lodash'` 或者 `import moment from 'moment'`，这会导致整个库被打包进来，即使你只用了其中一两个函数。
    2.  **库本身就很大**: 有些库功能强大，但体积也确实很大。

*   **优化建议**:
    1.  **按需加载 (Tree-shaking)**: 改变你的引入方式，只引入你需要的部分。
        *   **错误示例**: `import { get } from 'lodash';` (对于某些库，这样仍然可能引入全部)
        *   **正确示例**: `import get from 'lodash/get';` (直接指向具体文件，确保只打包需要的部分)
        *   *现代构建工具对 ES Module 的 tree-shaking 支持已经很好，但直接引入子路径是最保险的方式。*
    2.  **寻找轻量级替代品**:
        *   `moment.js` -> `date-fns`, `day.js`, `luxon` (体积小很多，且 API 设计更现代化)
        *   `lodash` -> 可以考虑使用原生 JavaScript 方法，或者使用 `lodash-es` 并确保 tree-shaking 生效。
        *   在选择库之前，可以使用 [BundlePhobia](https://bundlephobia.com/) 网站查询其打包体积，做出明智选择。

#### **情况二：发现重复的模块**

有时，你会看到同一个库在不同的 chunk 里出现了好几次。

*   **问题分析**:
    *   项目的不同依赖项可能依赖了同一个库的不同版本，导致这个库被打包了多次。
*   **优化建议**:
    *   检查你的 `package-lock.json` 或 `yarn.lock` 文件，看看是否有多个版本的同一个库。
    *   可以尝试使用 `npm dedupe` 或 `yarn` 的 resolutions 功能来统一依赖版本。
    *   Next.js 的打包优化通常能处理好大部分情况，但这个问题依然值得关注。

#### **情况三：自己的业务代码或静态资源体积过大**

大方块不一定都来自 `node_modules`，也可能来自你自己的代码。

*   **问题分析**:
    *   某个巨大的组件包含了过多的逻辑和 UI。
    *   你直接 `import` 了一个非常大的 JSON 文件或图片资源。
*   **优化建议**:
    1.  **代码拆分 (Code Splitting)**: 对于不是首屏必须的、体积较大的组件，使用动态加载。这是 Next.js 的一大优势。
        ```javascript
        import dynamic from 'next/dynamic'

        // 这个 HeavyComponent 只有在需要渲染时才会被下载和执行
        const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
          loading: () => <p>Loading...</p>, // 可选的加载中状态
          ssr: false // 如果组件只在客户端使用，可以关闭 SSR
        })

        function MyPage() {
          const [showHeavy, setShowHeavy] = useState(false)
          return (
            <div>
              <button onClick={() => setShowHeavy(true)}>Show Heavy Component</button>
              {showHeavy && <HeavyComponent />}
            </div>
          )
        }
        ```
    2.  **优化静态资源**:
        *   图片使用 `next/image` 进行优化。
        *   对于大的 JSON 数据，考虑是否可以从 API 获取，而不是直接打包到前端代码里。

## 总结

`@next/bundle-analyzer` 是一个诊断工具，它的使用流程可以概括为：

1.  **生成报告**：通过 `npm run analyze` 命令。
2.  **查看报告**：重点关注 `client.html` 和 `Gzip` 视图。
3.  **定位大块头**：找到图中面积最大的方块，看看它们是什么。
4.  **分析原因**：是全量引入？库本身太大？还是自己的代码问题？
5.  **采取行动**：
    *   改为按需引入。
    *   寻找轻量级替代库。
    *   使用 `next/dynamic` 进行代码拆分。
    *   优化静态资源。
6.  **重复过程**：优化后，再次运行分析，对比报告，验证优化效果。

这是一个持续迭代的过程，通过不断地分析和优化，你可以显著减小应用的打包体积，提升用户体验。祝你优化成功！