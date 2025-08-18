---
title: '测试自定义remark-attr插件'
date: '2025-08-02'
author: 'Bearbug'
description: '测试可能出现的各种情况。'
tags: ['react-markdown', 'remark-attr', 'next.js']
draft: false
---

## 这是一个 id 为 title 的标题 {id="title"}

改变 p 中 [特定文字]{style="color: blue"} 的样式，同时让 p 变成红色。{style="color: red"}

这是一段既有 **粉色粗体 {style="color: pink"}** 又有 _青色斜体 {style="color: cyan"}_ 的文字。

- 这是一个无序列表，底色为灰色
- 这一行为紫色 {style="color: purple"}
- 这一行为绿色 {style="color: green"}
  {style="background-color: grey"}

这是一张宽度为 200 的小熊虫的图片：
![一只可爱的小熊虫](https://pub.bearbug.dpdns.org/1754060052683-bearbug-confidence.png '自信'){width="200"}

> 这是一个引用，整体为蓝色
> 换行引用，这行为绿色 {style="color: green"}
> 这行是凑数的
> 这行为红色 {style="color: red"}
> {style="color: blue"}

```javaScript
// 这是一个测试代码块
console.log("Hello World!");
```

---

这是一个`行内`代码块：`console.log("Hello World!");`

[这是一个链接](https://vibe.us 'vibe.us')

## 语法教程
