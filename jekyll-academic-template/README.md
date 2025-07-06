# Jekyll Academic Template

一个现代化的Jekyll学术网站模板，具有深色模式支持、响应式设计和丰富的功能。

## 特性

✨ **现代设计**
- 响应式布局，支持所有设备
- 深色/浅色主题切换
- 流畅的动画和过渡效果
- 专业的学术风格

🎨 **主题系统**
- 完整的深色模式支持
- 多种颜色主题选择
- CSS变量系统，易于自定义
- 平滑的主题切换动画

📱 **功能丰富**
- 图片画廊与灯箱查看
- 博客系统
- 期刊文章管理
- 研究项目展示
- 出版物列表
- 联系信息

🚀 **性能优化**
- 懒加载图片
- 优化的CSS和JavaScript
- SEO友好
- 快速加载

## 快速开始

### 1. Fork 这个仓库
点击右上角的 "Fork" 按钮

### 2. 克隆到本地
```bash
git clone https://github.com/YOUR_USERNAME/jekyll-academic-template.git
cd jekyll-academic-template
```

### 3. 安装依赖
```bash
bundle install
```

### 4. 本地运行
```bash
bundle exec jekyll serve
```

### 5. 访问网站
打开浏览器，访问 `http://localhost:4000`

## 配置

### 基本配置
编辑 `_config.yml` 文件：

```yaml
# 网站基本信息
title: "Your Name"
subtitle: "Academic Homepage"
description: "Your academic description"
url: "https://yourusername.github.io"
baseurl: ""

# 个人信息
author:
  name: "Your Name"
  email: "your.email@university.edu"
  affiliation: "Your University"
  position: "Your Position"

# 社交媒体
social:
  github: yourusername
  linkedin: yourprofile
  twitter: yourusername
  orcid: 0000-0000-0000-0000
```

### 数据文件
在 `_data/` 目录下编辑以下文件：

- `research.yml` - 研究项目
- `publications.yml` - 出版物
- `gallery.yml` - 图片画廊
- `journals.yml` - 期刊文章
- `navigation.yml` - 导航菜单

### 页面内容
编辑以下文件来自定义页面内容：

- `index.html` - 主页
- `about.html` - 关于页面
- `research.html` - 研究页面
- `publications.html` - 出版物页面
- `blog.html` - 博客页面
- `contact.html` - 联系页面

## 自定义主题

### 颜色主题
编辑 `assets/theme-system-complete.css` 中的CSS变量：

```css
:root {
  --primary-blue: #2563eb;
  --secondary-blue: #1e40af;
  /* 添加你的颜色 */
}
```

### 添加新页面
1. 在根目录创建新的 `.html` 文件
2. 添加 front matter:
```yaml
---
layout: page
title: "Page Title"
permalink: /your-page.html
---
```

### 自定义样式
在 `assets/` 目录下创建新的CSS文件，并在 `_includes/global-features-head.html` 中引用。

## 目录结构

```
jekyll-academic-template/
├── _includes/          # Jekyll包含文件
├── _layouts/           # 页面布局
├── _data/             # 数据文件 (YAML)
├── assets/            # CSS, JS, 图片
├── _config.yml        # Jekyll配置
├── index.html         # 主页
├── about.html         # 关于页面
├── research.html      # 研究页面
├── publications.html  # 出版物页面
├── blog.html          # 博客页面
├── gallery.html       # 画廊页面
├── contact.html       # 联系页面
└── README.md         # 说明文档
```

## 部署

### GitHub Pages
1. 在 GitHub 仓库设置中启用 GitHub Pages
2. 选择 `main` 分支作为源
3. 你的网站将在 `https://yourusername.github.io/jekyll-academic-template` 可用

### 自定义域名
1. 在仓库根目录创建 `CNAME` 文件
2. 添加你的域名，如 `www.yourname.com`
3. 在你的域名提供商处设置CNAME记录

## 贡献

欢迎提交 Issues 和 Pull Requests！

### 开发流程
1. Fork 仓库
2. 创建特性分支: `git checkout -b feature-name`
3. 提交更改: `git commit -am 'Add some feature'`
4. 推送到分支: `git push origin feature-name`
5. 提交 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 鸣谢

- [Jekyll](https://jekyllrb.com/) - 静态网站生成器
- [Font Awesome](https://fontawesome.com/) - 图标库
- [Inter Font](https://fonts.google.com/specimen/Inter) - 主要字体

## 支持

如果这个模板对你有帮助，请给它一个 ⭐️

如有问题，请提交 [Issue](https://github.com/yourusername/jekyll-academic-template/issues)

---

**示例网站**: [查看演示](https://yourusername.github.io/jekyll-academic-template)
