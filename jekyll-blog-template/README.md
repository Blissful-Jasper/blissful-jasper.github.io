# Modern Academic Jekyll Blog Template

一个现代化、响应式的学术博客 Jekyll 模板，专为研究人员、学者和技术写作者设计。

## ✨ 特性

### 🎨 现代化设计
- 响应式设计，完美适配桌面、平板和手机
- 现代扁平化界面，专业且美观
- 深浅色主题切换支持
- 优雅的排版和间距

### 📚 学术友好
- 支持 LaTeX 数学公式渲染 (MathJax)
- 代码高亮显示 (Rouge)
- 学术出版物展示页面
- 研究项目展示模块
- 画廊和图片展示功能

### 🚀 功能丰富
- 博客文章分类和标签
- 全站搜索功能
- RSS 订阅支持
- 社交媒体链接
- 地图集成 (OpenStreetMap)
- 期刊订阅管理

### 🔧 开发友好
- GitHub Actions 自动部署
- 本地一键启动脚本
- SEO 优化配置
- 灵活的数据文件配置
- 模块化组件设计

## 🚀 快速开始

### 方法一：Fork 部署（推荐）

1. **Fork 此仓库**
   ```
   点击右上角 Fork 按钮，或直接访问：
   https://github.com/your-username/jekyll-blog-template
   ```

2. **启用 GitHub Pages**
   - 进入仓库设置 (Settings)
   - 滚动到 Pages 部分
   - Source 选择 "GitHub Actions"
   - 等待自动部署完成

3. **自定义配置**
   - 编辑 `_config.yml` 修改站点基本信息
   - 更新 `_data/` 目录下的数据文件
   - 替换 `assets/images/` 中的头像和图片
   - 开始写作你的第一篇文章！

### 方法二：本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/jekyll-blog-template.git
   cd jekyll-blog-template
   ```

2. **安装依赖**
   ```bash
   # Windows 用户
   ./start-jekyll.bat
   
   # Linux/macOS 用户
   chmod +x start-jekyll.sh
   ./start-jekyll.sh
   
   # 或者手动安装
   bundle install
   bundle exec jekyll serve
   ```

3. **访问网站**
   ```
   打开浏览器访问：http://localhost:4000
   ```

## 📝 内容管理

### 写作博客文章

在 `_posts/` 目录创建新文件，文件名格式：`YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "你的文章标题"
date: 2024-01-15
categories: [研究, 技术]
tags: [机器学习, 气候科学]
author: "Your Name"
excerpt: "文章摘要..."
---

你的文章内容...

## 使用 LaTeX 公式

$$E = mc^2$$

## 代码高亮

```python
import numpy as np
print("Hello World!")
```
```

### 管理研究项目

编辑 `_data/research.yml`：

```yaml
- title: "研究项目名称"
  description: "项目简要描述"
  image: "/assets/images/research/project1.jpg"
  link: "/research/project1"
  status: "进行中"
  collaborators: ["合作者1", "合作者2"]
```

### 添加出版物

编辑 `_data/publications.yml`：

```yaml
- title: "论文标题"
  authors: "作者列表"
  journal: "期刊名称"
  year: 2024
  doi: "10.1000/example"
  pdf: "/assets/papers/paper1.pdf"
  type: "期刊论文"
```

## 🎨 自定义样式

### 修改主题色彩

编辑 `assets/css/main.scss`：

```scss
// 主色调
$primary-color: #2c3e50;
$secondary-color: #3498db;
$accent-color: #e74c3c;

// 背景色
$background-light: #ffffff;
$background-dark: #1a1a1a;
```

### 添加自定义组件

在 `_includes/` 目录创建新的 HTML 组件：

```html
<!-- _includes/custom-component.html -->
<div class="custom-component">
  <!-- 你的自定义内容 -->
</div>
```

然后在页面中使用：
```liquid
{% include custom-component.html %}
```

## ⚙️ 配置选项

### 基本配置 (`_config.yml`)

```yaml
# 站点信息
title: "你的博客名称"
description: "博客描述"
url: "https://yourusername.github.io"
baseurl: ""

# 作者信息
author:
  name: "Your Name"
  email: "your.email@example.com"
  bio: "个人简介"
  avatar: "/assets/images/avatar.jpg"

# 社交媒体
social:
  github: "yourusername"
  twitter: "yourusername"
  linkedin: "yourprofile"
  orcid: "0000-0000-0000-0000"

# 功能开关
enable_mathjax: true
enable_search: true
enable_comments: false
enable_analytics: false
```

### 高级配置

```yaml
# SEO 设置
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed

# 分页设置
paginate: 10
paginate_path: "/blog/page:num/"

# 代码高亮
highlighter: rouge
markdown: kramdown
```

## 🔌 插件和扩展

### 已集成插件

- **jekyll-seo-tag**: SEO 优化
- **jekyll-sitemap**: 站点地图生成
- **jekyll-feed**: RSS 订阅
- **jekyll-paginate**: 分页功能

### 推荐插件

```ruby
# 添加到 Gemfile
gem "jekyll-archives"     # 分类归档
gem "jekyll-redirect-from" # 重定向支持
gem "jekyll-compose"      # 写作工具
gem "jekyll-admin"        # 管理界面
```

## 📱 移动端优化

模板已针对移动设备进行优化：

- 响应式设计，自适应各种屏幕尺寸
- 触摸友好的界面元素
- 优化的图片加载
- 快速的页面加载速度

## 🔍 SEO 优化

### 自动生成
- XML 站点地图
- RSS 订阅源
- 结构化数据标记
- Open Graph 标签

### 手动优化建议
- 为每篇文章添加描述性的 `excerpt`
- 使用相关的 `tags` 和 `categories`
- 优化图片 alt 文本
- 添加内部链接

## 🚨 常见问题

### Q: GitHub Pages 部署失败怎么办？

**A**: 检查以下几点：
1. `_config.yml` 语法是否正确
2. `Gemfile` 中的 gem 版本是否兼容
3. 查看 Actions 标签页的错误日志
4. 确保仓库设置中已启用 Pages

### Q: 本地预览时数学公式不显示？

**A**: 确保在 `_config.yml` 中设置：
```yaml
enable_mathjax: true
```

### Q: 如何添加评论系统？

**A**: 可以集成 Disqus、Gitalk 或 utterances：

```html
<!-- _includes/comments.html -->
{% if site.enable_comments %}
<script src="https://utteranc.es/client.js"
        repo="your-username/your-repo"
        issue-term="pathname"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>
{% endif %}
```

### Q: 如何自定义域名？

**A**: 在仓库根目录创建 `CNAME` 文件：
```
yourdomain.com
```

### Q: 如何备份和迁移？

**A**: 
1. 导出所有文章：`git clone` 整个仓库
2. 备份图片：下载 `assets/images/` 目录
3. 保存配置：备份 `_config.yml` 和 `_data/` 目录

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Jekyll](https://jekyllrb.com/) - 静态站点生成器
- [GitHub Pages](https://pages.github.com/) - 免费托管服务
- [MathJax](https://www.mathjax.org/) - 数学公式渲染
- [Font Awesome](https://fontawesome.com/) - 图标库

## 📞 支持

如有问题，请：
- 查看 [Wiki](https://github.com/your-username/jekyll-blog-template/wiki)
- 提交 [Issue](https://github.com/your-username/jekyll-blog-template/issues)
- 发送邮件到：your.email@example.com

---

⭐ 如果这个模板对你有帮助，请给个 Star！
