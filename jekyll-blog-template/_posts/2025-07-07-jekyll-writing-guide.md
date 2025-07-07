---
layout: post
title: "Jekyll博客写作指南"
date: 2025-07-07 11:00:00 +0800
categories: [教程, Jekyll]
tags: [Jekyll, Markdown, 写作, 教程]
---

这篇文章将帮助你快速上手Jekyll博客的写作。

## 📝 文章结构

每篇文章都以Front Matter开始：

```yaml
---
layout: post
title: "文章标题"
date: 2025-07-07 10:00:00 +0800
categories: [分类1, 分类2]
tags: [标签1, 标签2, 标签3]
mathjax: true  # 如果需要数学公式
---
```

## 📁 文件组织

### 文章命名

文件名必须遵循格式：`YYYY-MM-DD-title.md`

例如：
- `2025-07-07-jekyll-tutorial.md`
- `2025-07-08-my-first-post.md`

### 目录结构

```
_posts/
├── 2025-07-07-welcome.md
├── 2025-07-08-tutorial.md
└── 2025-07-09-advanced-tips.md
```

## 🏷️ 标签和分类

### 分类 (Categories)

用于文章的主要分组：

```yaml
categories: [技术, 前端开发]
```

### 标签 (Tags)

用于更细粒度的标记：

```yaml
tags: [JavaScript, React, 教程, 入门]
```

## 🖼️ 图片处理

### 本地图片

将图片放在`assets/images/`目录下：

```markdown
![图片描述](/assets/images/my-image.jpg)
```

### 图片懒加载

模板已内置懒加载功能，无需额外配置。

### 响应式图片

```html
<img src="/assets/images/example.jpg" 
     alt="示例图片" 
     class="responsive-image">
```

## 📋 常用Markdown语法

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 强调

```markdown
**粗体文本**
*斜体文本*
~~删除线~~
==高亮文本==
```

### 列表

```markdown
- 无序列表项1
- 无序列表项2
  - 嵌套项

1. 有序列表项1
2. 有序列表项2
```

### 引用

```markdown
> 这是一个引用块
> 
> 可以包含多行内容
```

### 代码

行内代码：`` `代码` ``

代码块：
````markdown
```language
代码内容
```
````

## 🔗 链接处理

### 内部链接

```markdown
[关于页面](/about/)
[欢迎文章](/jekyll-blog-template/2025/07/07/welcome-to-simple-jekyll-blog.html)
```

### 外部链接

```markdown
[Google](https://www.google.com)
```

## 📊 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
```

## 💡 写作技巧

### 1. 使用清晰的标题结构

保持标题层次清晰，便于读者理解文章结构。

### 2. 添加目录

对于长文章，考虑手动添加目录：

```markdown
## 目录
- [第一部分](#section1)
- [第二部分](#section2)
- [第三部分](#section3)
```

### 3. 使用摘要

在Front Matter中添加excerpt：

```yaml
excerpt: "这是文章的简短摘要，会显示在文章列表中。"
```

### 4. 优化SEO

- 使用描述性的标题
- 合理使用标签和分类
- 添加meta描述

## 🎯 发布流程

1. **写作**：在`_posts`目录创建新文件
2. **预览**：运行`bundle exec jekyll serve`
3. **检查**：确认格式和链接正确
4. **提交**：推送到Git仓库
5. **发布**：GitHub Pages自动构建

## 📝 模板示例

创建新文章时可以使用这个模板：

```markdown
---
layout: post
title: "文章标题"
date: YYYY-MM-DD HH:MM:SS +0800
categories: [分类]
tags: [标签1, 标签2]
excerpt: "文章摘要"
---

文章内容开始...

## 第一个小节

内容...

## 第二个小节

内容...

## 总结

总结内容...
```

快乐写作！🎉
