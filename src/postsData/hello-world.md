---
title: "测试自定义remark-attr插件"
date: "2025-08-02"
author: "Bearbug"
description: "测试可能出现的各种情况。"
tags: ["react-markdown", "remark-attr", "next.js"]
draft: false
---

# 测试h1 {style="color: #18a7d9"}

测试p：{style="color: #4f46e5"}

改变p中[特定文字]{style="color: #f87171"}的样式

测试ul:

- ul1 {style="color: red"}
- ul2
- ul3 {style="color: #f87171"}

## 测试h2 {style="color: #9e7d0f"}

## 插入一张图片

这是一张小熊虫的图片：
![一只可爱的小熊虫](https://pub.bearbug.dpdns.org/1754060052683-bearbug-confidence.png "自信"){width="200"}

> 引用 {style="color: red"}
> 引用测试
> 测试引用 {style="color: red"}
> aa {style="color: #f87171"}

```javaScript
// 这是一个测试代码块
console.log("Hello World!");
```

------

```c++
// 这是一个测试代码块
#include <iostream>
using namespace std;
int main()
{
    cout << "Hello World!" << endl;
    return 0;
}
```

这是一个`行内`代码块：`console.log("Hello World!");`

[这是一个链接](https://vibe.us)
