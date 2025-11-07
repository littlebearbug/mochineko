---
# 博客分为四个大类: 1(技术世界)、2(游戏频道)、3(音乐随想)、4(生活碎笔)
title: 测试自定义remark-attr插件
date: 2025-08-02
author: 'MochiNeko'
description: 我实现了一个自定义的remark插件，用于给markdown元素添加属性，现在来测试可能出现的各种情况。
tags: ['react-markdown', 'remark-attr']
categories: [1]
cover: https://pub.bearbug.dpdns.org/1760765176012-thumbnail.webp
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

如果想给标题、段落、图片、粗体、斜体添加属性，可以在对应元素后添加 `{attr="value"}`，
其中 `attr` 是属性名，`value` 是属性值。例如：

```markdown
# 这是一个 id 为 title 的标题 {id="title"}

红色的段落 {style="color: red"}

![图片](url 'title'){width="200"}

**粗体文字** {style="color: red"}

_斜体文字_ {style="color: red"}
```

如果想添加给段落中某些特定的文章添加属性，可以使用 `[特定文字]{attr="value"}`，
例如：

```markdown
改变 p 中 [特定文字]{style="color: blue"} 的样式
```

对于列表或者引用，如果想给整个列表或者引用添加属性，则可以在列表或者引用的最后一行添加`{attr="value"}`
，如果想给特定某一行添加属性，则直接在对应行的后面添加`{attr="value"}`即可，例如：

```markdown
- 这是一个无序列表，底色为灰色
- 这一行为紫色 {style="color: purple"}
- 这一行为绿色 {style="color: green"}
  {style="background-color: grey"}

> 这是一个引用，整体为蓝色
> 换行引用，这行为绿色 {style="color: green"}
> 这行是凑数的
> 这行为红色 {style="color: red"}
> {style="color: blue"}
```
