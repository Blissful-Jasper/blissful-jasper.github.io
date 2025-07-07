---
layout: post
title: "欢迎使用Simple Jekyll Blog"
date: 2025-07-07 10:00:00 +0800
categories: [博客, Jekyll]
tags: [Jekyll, 博客, GitHub Pages, 入门]
mathjax: true
---

欢迎使用Simple Jekyll Blog模板！这是一个功能完整但保持简洁的Jekyll博客模板。

## 🎯 主要特性

这个模板包含了现代博客所需的所有基本功能：

- **响应式设计**：在桌面、平板和手机上都有良好的显示效果
- **数学公式支持**：使用MathJax渲染LaTeX公式
- **代码高亮**：支持多种编程语言的语法高亮
- **SEO优化**：内置搜索引擎优化功能
- **性能优化**：图片懒加载、资源预加载等

## 📝 Markdown示例

### 文本格式

你可以使用**粗体**、*斜体*、~~删除线~~等格式。

> 这是一个引用块。可以用来突出显示重要信息。

### 列表

无序列表：
- 第一项
- 第二项
  - 子项目
  - 另一个子项目

有序列表：
1. 第一步
2. 第二步
3. 第三步

### 代码

行内代码：`console.log('Hello World')`

代码块：

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('Jekyll'));
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
```

## 🧮 数学公式

行内公式：质能方程 $E = mc^2$ 是物理学中的重要公式。

块级公式：

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

复杂公式：

$$
\begin{align}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} & = \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} & = 0
\end{align}
$$

## 📊 表格

| 特性 | 支持 | 说明 |
|------|------|------|
| 响应式设计 | ✅ | 自适应各种屏幕尺寸 |
| 数学公式 | ✅ | MathJax支持 |
| 代码高亮 | ✅ | Rouge语法高亮器 |
| 图片懒加载 | ✅ | 提升页面加载速度 |
| SEO优化 | ✅ | 搜索引擎友好 |

## 🔗 链接和图片

[Jekyll官方网站](https://jekyllrb.com/)

![Jekyll Logo](https://jekyllrb.com/img/logo-2x.png)

## 📝 如何开始写作

1. 在`_posts`目录下创建新的Markdown文件
2. 文件名格式：`YYYY-MM-DD-title.md`
3. 添加Front Matter（文章元数据）
4. 使用Markdown语法编写内容
5. 运行`bundle exec jekyll serve`预览

## 🎨 自定义主题

你可以通过修改以下文件来自定义主题：

- `_sass/_variables.scss`：颜色和字体变量
- `assets/css/main.scss`：主样式文件
- `_layouts/`：页面布局
- `_includes/`：可重用组件

## 🚀 部署到GitHub Pages

1. Fork这个仓库
2. 修改`_config.yml`中的配置
3. 推送到GitHub
4. 在仓库设置中启用GitHub Pages

开始你的博客之旅吧！✨
