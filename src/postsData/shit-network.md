---
# 博客分为四个大类: 1(技术世界)、2(游戏频道)、3(音乐随想)、4(生活碎笔)
title: 突然ping不通Github了/(ㄒoㄒ)/~~
description: 记录一次因 DNS 污染导致 GitHub 访问被指向 127.0.0.1 的排查与解决过程。本文将带你了解问题根源，并提供一份即插即用的 hosts 配置，帮你快速绕过DNS问题，恢复对 GitHub 的正常访问。
date: 2025-10-12
author: 'MochiNeko'
categories: [1]
tags: [DNS污染]
cover: https://pub.bearbug.dpdns.org/1760773758458-DNSPoisoning.webp
draft: false
---

## 问题发现

本来想在家继续完善项目，但是发现使用 `git pull` 失效了，找了半天原因，发现是DNS污染使得访问 `github.com` 的ip指向了 `127.0.0.1`，自然就无法访问了。

访问 https://itdog.cn/ 查询各个厂商的DNS解析记录，发现浙江杭州移动、浙江金华移动、山西太原联通三个地方的 `github.com` 的解析记录都指向了 `127.0.0.1`。

![DNS污染](https://pub.bearbug.dpdns.org/1760278288566-Snipaste_2025-10-12_22-11-00.png)

## 解决办法：

通过在`hosts`文件中手动指定IP地址，你可以绕过有问题的DNS解析，强制你的电脑直接连接到正确的服务器。

### 方法一：修改 hosts 文件

#### 第 1 步：找到并打开 `hosts` 文件（需要管理员权限）

- 路径: `C:\Windows\System32\drivers\etc\hosts`
- 用**管理员权限**的文本编辑器（如记事本，右键点击 -> 以管理员身份运行）打开。

#### 第 2 步：将IP地址和域名添加到 `hosts` 文件

将以下内容**复制并粘贴**到你打开的 `hosts` 文件的**末尾**。

```plain
# GitHub Start
20.205.243.166   github.com
# GitHub End
```

#### 第 3 步：保存文件并刷新DNS缓存

- 保存你对 `hosts` 文件的修改。
- 然后打开终端（或CMD）执行刷新DNS缓存的命令： `ipconfig /flushdns`

### 方法二：修改路由器 DNS

如果你有路由器权限，可以尝试修改路由器的DNS设置，将DNS服务器地址改为其他可靠的DNS服务器，拿我的中兴 AX3000 路由器为例，进入路由器管理界面，找到网络 -> 局域网 -> IPv4，将DNS服务器地址改为 `114.114.114.114`（国内移动、电信和联通通用的DNS） 或 `8.8.8.8`（GOOGLE提供的DNS）， 如果启用了IPv6的话，需要换到IPv6，然后找到 `DHCPv6`，将DNS 下发方式改成手动，再添加DNS服务器地址 `2001:4860:4860::8888`（GOOGLE提供的IPv6 DNS） 或 `2606:4700:4700::1111`（Cloudflare提供的IPv6 DNS） 或 `2400:3200::1`（阿里云提供的IPv6 DNS）。
