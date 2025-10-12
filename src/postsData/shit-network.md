---
# categories可选值:0, 1, 2, 3, 4, 5; 分别对应:博客, 游戏, 技术, 音乐, 生活, 杂谈
title: 突然ping不通Github了/(ㄒoㄒ)/~~
description: 记录一次因 DNS 污染导致 GitHub 访问被指向 127.0.0.1 的排查与解决过程。本文将带你了解问题根源，并提供一份即插即用的 hosts 配置，帮你快速绕过DNS问题，恢复对 GitHub 的正常访问。
date: '2025-10-12'
categories: [0, 5]
draft: false
---

## 问题发现

本来想在家继续完善项目，但是发现使用 `git pull` 失效了，找了了半天原因，发现是DNS污染导致访问 `github.com` 指向了 `127.0.0.1`，导致无法访问。

访问 https://itdog.cn/ 查询各个厂商的DNS解析记录，发现浙江杭州移动、浙江金华移动、山西太原联通三个地方的 `github.com` 的解析记录都指向了 `127.0.0.1`。

![DNS污染](https://pub.bearbug.dpdns.org/1760278288566-Snipaste_2025-10-12_22-11-00.png)

## 解决办法：

通过在`hosts`文件中手动指定IP地址，你可以绕过有问题的DNS解析，强制你的电脑直接连接到正确的服务器。

### 操作步骤

#### 第 1 步：找到并打开 `hosts` 文件（需要管理员权限）

- 路径: `C:\Windows\System32\drivers\etc\hosts`
- 用**管理员权限**的文本编辑器（如记事本，右键点击 -> 以管理员身份运行）打开。

#### 第 2 步：将IP地址和域名添加到 `hosts` 文件

将以下内容**复制并粘贴**到你打开的 `hosts` 文件的**末尾**。

```
# GitHub Start
20.205.243.166   github.com
# GitHub End
```

#### 第 3 步：保存文件并刷新DNS缓存

- 保存你对 `hosts` 文件的修改。
- 然后打开终端（或CMD）执行刷新DNS缓存的命令： `ipconfig /flushdns`
