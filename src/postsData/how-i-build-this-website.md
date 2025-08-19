---
title: 我是如何搭建该博客的?
date: '2025-08-19'
author: 'Bearbug'
description: '搭建静态博客网站的过程'
tags: ['next.js', 'cloud services', 'blog']
draft: false
---

## 前言

最近在搭建自己的博客，使用了浪浪云的 **0.1元** 服务器，搭配上浪浪云 **0.1元/月** 的CDN，以及一个 **1元/年** 的域名，总共花费不超过 **2元** ，搭建了一个静态博客网站。

## 搭建过程

### 1. 选择静态博客框架

静态博客框架有很多，比如 **Hexo**、**Hugo**、**Jekyll**、**VuePress**、**Next.js** 等，我选择了 **Next.js**，因为 Next.js 是我比较熟悉的一个框架，在使用的同时，又能更一步加深我对 Next.js 的理解。

### 2. 选择云服务

我选择了浪浪云的 **0.1元** 服务器，搭配上浪浪云 **0.1元/月** 的CDN，以及一个 **1元/年** 的域名，总共花费不超过 **2元** ，搭建了一个静态博客网站。

### 3. 部署静态博客

我使用了 **github action** 来部署我的静态博客，配置`deploy.yml`文件，可以很轻松的实现自动部署静态网站，非常方便。以下是我的`deploy.yml`文件：

```yaml
name: Deploy Static Blog to Server

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.3

        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT }}

          # 要在服务器上执行的脚本
          script: |
            # 加上 set -e，确保任何命令失败时脚本都会立即退出
            set -e

            # 1. 进入你的项目源码目录 (请替换成你服务器上的实际路径)
            cd /srv/my-blog-source

            # 2. 从 GitHub 拉取最新的代码
            echo "Pulling latest code from GitHub..."
            git pull origin main

            # 3. 安装 pnpm 依赖
            echo "Installing dependencies..."
            pnpm install

            # 4. 执行构建命令
            echo "Building the static site..."
            pnpm run build

            # 5. 清理旧的网站文件 (非常重要，防止留下已删除的旧文件)
            echo "Cleaning up old files in /var/www/my-blog..."
            rm -rf /var/www/my-blog/*

            # 6. 拷贝构建产物到网站根目录
            # 注意 `out/.` 的用法，它会拷贝 out 目录下的所有内容，而不是 out 目录本身
            echo "Copying new build files to web root..."
            cp -r out/. /var/www/my-blog/

            # 只有在以上所有步骤都成功后，才会执行到这里
            echo "Deployment successful!"
```

由于服务器上通过 `rsync` 同步文件是出了一点问题（我也还不知道问题出在那里），所以我选择了使用 `git` 来同步文件。

在服务器上，我使用了 **docker** 来运行 **nginx**，配置了 **nginx** 的 `conf.d` 文件，将静态博客的文件指向 `/var/www/my-blog`，这样就可以通过域名访问我的静态博客了。

``` yaml
version: '3.8'

services:
  blog:
    image: nginx:alpine
    container_name: my-blog-nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - /var/www/my-blog:/usr/share/nginx/html:ro
      - ./nginx/my-blog.conf:/etc/nginx/conf.d/default.conf:ro
```

``` nginx
server {
    listen 80;
    server_name your.domain.com; # 确保这里是你的域名

    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### 4. 配置域名

在 **阿里云** 上购买了一个 **1元/年** 的域名，然后在 **阿里云** 上配置了域名解析，将域名指向浪浪云提供的CDN。

## 总结

搭建静态博客网站的过程并不复杂，只需要选择合适的静态博客框架、云服务、部署方式，以及配置域名，就可以轻松搭建一个属于自己的静态博客网站。