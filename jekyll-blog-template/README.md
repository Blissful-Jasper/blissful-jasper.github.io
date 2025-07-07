# Simple Jekyll Blog Template

一个基于Jekyll的简洁博客模板，适合学术研究者和技术博客使用。

## ✨ 特性

- 📱 响应式设计，支持移动端
- 🎨 简洁现代的界面设计
- 📝 支持Markdown写作
- 🔍 内置搜索功能
- 📊 支持MathJax数学公式
- 🏷️ 标签分类系统
- 📄 分页支持
- 🚀 性能优化（懒加载、缓存等）
- 📈 SEO友好

## 🚀 快速开始

### 1. Fork 或下载模板

```bash
git clone https://github.com/your-username/simple-jekyll-blog.git
cd simple-jekyll-blog
```

### 2. 安装依赖

确保你已安装Ruby和Bundler：

```bash
# 安装Bundler（如果还没有）
gem install bundler

# 安装依赖
bundle install
```

### 3. 配置网站

编辑 `_config.yml` 文件，修改以下信息：

```yaml
title: "你的博客名称"
email: your-email@example.com
description: "你的博客描述"
url: "https://your-username.github.io"

author:
  name: "你的名字"
  title: "你的职位"
  email: "your-email@example.com"
```

### 4. 本地预览

```bash
bundle exec jekyll serve
```

然后在浏览器中访问 `http://localhost:4000`

### 5. 部署到GitHub Pages

1. 在GitHub上创建一个新仓库，命名为 `your-username.github.io`
2. 将代码推送到仓库：

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-username.github.io.git
git push -u origin main
```

3. 在仓库设置中启用GitHub Pages，选择 `main` 分支作为源

## 📝 写作指南

### 创建新文章

在 `_posts` 目录下创建新文件，文件名格式为：`YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "文章标题"
date: 2025-07-07 10:00:00 +0800
categories: [技术, Jekyll]
tags: [Jekyll, 博客, GitHub Pages]
mathjax: true  # 如果需要数学公式支持
---

这里是文章内容...

## 数学公式示例

行内公式：$E = mc^2$

块级公式：
$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$
```

### 添加页面

在根目录创建 `.md` 文件：

```markdown
---
layout: page
title: "关于"
permalink: /about/
---

这里是页面内容...
```

## 🎨 自定义

### 修改样式

- 主要样式文件：`assets/css/main.scss`
- 颜色变量：`_sass/_variables.scss`
- 组件样式：`_sass/components/`

### 添加功能

- 布局文件：`_layouts/`
- 组件文件：`_includes/`
- 数据文件：`_data/`

## 📁 目录结构

```
simple-jekyll-blog/
├── _config.yml          # 网站配置
├── _data/              # 数据文件
├── _includes/          # 页面组件
├── _layouts/           # 页面布局
├── _posts/             # 博客文章
├── _sass/              # SCSS样式文件
├── assets/             # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
├── Gemfile             # Ruby依赖
├── index.html          # 首页
└── README.md          # 说明文档
```

## ⚙️ 配置选项

### 基本配置

```yaml
# 网站基本信息
title: "博客标题"
description: "博客描述"
url: "https://your-domain.com"

# 作者信息
author:
  name: "作者名称"
  email: "email@example.com"

# 分页设置
paginate: 5
paginate_path: "/page:num/"

# MathJax支持
mathjax:
  enable: true
```

### 功能开关

```yaml
# 页面功能控制
features:
  search: true          # 搜索功能
  comments: false       # 评论系统
  analytics: false      # 网站分析
  dark_mode: true       # 暗色模式
```

## 🔧 性能优化

模板已内置多项性能优化：

- 图片懒加载
- CSS/JS压缩
- Service Worker缓存
- 字体预加载
- 关键CSS内联

## 📱 响应式设计

支持以下设备：

- 桌面端 (1200px+)
- 平板端 (768px - 1199px)
- 手机端 (< 768px)

## 🎯 SEO优化

- 自动生成sitemap.xml
- 结构化数据标记
- Open Graph标签
- Twitter Cards
- 自动meta描述

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请：

1. 查看[Jekyll官方文档](https://jekyllrb.com/docs/)
2. 提交[Issue](https://github.com/your-username/simple-jekyll-blog/issues)
3. 发送邮件至：your-email@example.com

---

**开始你的博客之旅吧！** 🚀
