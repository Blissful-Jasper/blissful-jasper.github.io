---
layout: post
title: "Create a Jekyll Site"
date: 2025-06-29
categories: [技术, Jekyll]
tags: [Jekyll, GitHub Pages, 建站, 博客]
---

# 如何创建一个新的 Jekyll 网站

Jekyll 是一个静态网站生成器，特别适合用于创建博客和学术网站。本文将介绍如何从零开始创建一个 Jekyll 网站。

## 安装 Jekyll

首先，你需要安装 Ruby 和 Jekyll：

```bash
# 安装 Ruby (使用 RVM 或 rbenv)
# 然后安装 Jekyll 和 bundler
gem install jekyll bundler
```

## 创建新网站

使用以下命令创建一个新的 Jekyll 网站：

```bash
jekyll new my-awesome-site
cd my-awesome-site
```

## 目录结构

Jekyll 网站的基本目录结构如下：

```
my-awesome-site/
├── _config.yml
├── _data/
├── _includes/
├── _layouts/
├── _posts/
├── _sass/
├── assets/
├── index.html
└── Gemfile
```

## 配置网站

编辑 `_config.yml` 文件来配置你的网站：

```yaml
title: Your Site Title
description: A brief description of your site
baseurl: "" # 如果不是根目录，填写子目录
url: "https://your-username.github.io"
```

## 创建你的第一篇文章

在 `_posts` 目录中创建一个新文件，文件名格式为 `YYYY-MM-DD-title.md`：

```markdown
---
layout: post
title: "我的第一篇文章"
date: 2025-06-29
categories: [blog]
tags: [welcome]
---

# 欢迎来到我的博客

这是我的第一篇文章！
```

## 本地预览

使用以下命令在本地预览你的网站：

```bash
bundle exec jekyll serve
```

然后在浏览器中访问 `http://localhost:4000`。

## 部署到 GitHub Pages

1. 创建一个新的 GitHub 仓库
2. 将你的 Jekyll 网站推送到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 main 分支作为源

## 总结

Jekyll 是一个强大而灵活的静态网站生成器，非常适合创建博客和学术网站。通过合理的配置和主题选择，你可以快速创建一个专业的网站。

记住要定期更新你的内容，并利用 Jekyll 的各种功能来优化你的网站！
