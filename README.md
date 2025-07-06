# Academic Personal Website - Xianpu Ji

[![Jekyll](https://img.shields.io/badge/Jekyll-v3.9-red.svg)](https://jekyllrb.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-green.svg)](https://blissful-jasper.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个基于Jekyll的学术个人网站，展示海洋科学研究成果、学术博客和摄影作品。

## 🌐 在线访问

**网站地址**: [https://blissful-jasper.github.io](https://blissful-jasper.github.io)

## 👨‍🎓 关于作者

**季先朴** - 河海大学海洋科学系博士研究生

**研究方向**:
- 热带大气动力学机制
- 对流耦合赤道波 (CCEWs)
- 热带降水时空变率
- 深度学习在气象预报中的应用

## 🚀 网站功能

### 核心版块
- **🏠 首页** - 个人简介与研究概览
- **🔬 研究方向** - 详细的研究领域介绍
- **📄 学术成果** - 发表论文与研究成果
- **📝 学术博客** - 研究心得与技术分享
- **📸 摄影作品** - 科研路上的精彩瞬间
- **📚 期刊订阅** - 关注的学术期刊
- **🔗 实用链接** - 精选的学术资源
- **🗺️ 研究地图** - 研究区域可视化
- **📧 联系方式** - 学术交流与合作

### 技术特性
- 📱 响应式设计，支持移动端
- 🎨 现代化UI界面
- 🔍 全站搜索功能
- 📊 MathJax数学公式支持
- 🌙 暗黑模式支持
- 📈 SEO优化
- 🚀 快速加载

## 🛠️ 技术栈

- **静态站点生成器**: Jekyll 3.9
- **主题**: Minima (定制化)
- **样式**: SCSS + CSS3
- **脚本**: JavaScript ES6+
- **部署**: GitHub Pages
- **版本控制**: Git
- **CI/CD**: GitHub Actions

## 📦 安装与运行

### 环境要求
- Ruby 3.0+
- Bundler 2.0+
- Git

### 本地开发
```bash
# 1. 克隆仓库
git clone https://github.com/blissful-jasper/blissful-jasper.github.io.git
cd blissful-jasper.github.io

# 2. 安装依赖
bundle install

# 3. 启动本地服务器
bundle exec jekyll serve

# 4. 访问网站
# 打开浏览器访问 http://localhost:4000
```

### 开发模式
```bash
# 使用开发配置启动
bundle exec jekyll serve --config _config.yml,_config_dev.yml

# 实时重载 + 增量构建
bundle exec jekyll serve --livereload --incremental
```

## 📁 项目结构

```
📦 blissful-jasper.github.io
├── 📁 _data/           # 数据文件 (YAML)
│   ├── navigation.yml  # 导航菜单
│   ├── gallery.yml     # 图片库数据
│   ├── research.yml    # 研究项目
│   └── ...
├── 📁 _includes/       # 可重用组件
│   ├── header.html
│   ├── footer.html
│   └── ...
├── 📁 _layouts/        # 页面布局
│   ├── default.html
│   ├── page.html
│   └── post.html
├── 📁 _posts/          # 博客文章
├── 📁 _sass/           # SCSS样式文件
├── 📁 assets/          # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
├── 📁 pictures/        # 图片库照片
├── 📁 maps/           # 研究地图
├── 📁 links/          # 链接截图
├── 📄 _config.yml     # Jekyll配置
├── 📄 Gemfile         # Ruby依赖
├── 📄 index.html      # 网站首页
└── 📄 README.md       # 项目说明
```

## 🎨 定制化

### 修改个人信息
编辑 `_config.yml` 文件中的基本信息：
```yaml
title: "Your Name"
email: your.email@university.edu
description: "Your research description"
author:
  name: "Your Name"
  title: "Your Title"
  affiliation: "Your University"
```

### 添加博客文章
在 `_posts/` 目录下创建Markdown文件：
```markdown
---
layout: post
title: "文章标题"
date: 2025-01-01
categories: research
tags: [tag1, tag2]
---

文章内容...
```

### 更新研究项目
编辑 `_data/research.yml` 文件：
```yaml
- title: "Research Project"
  description: "Project description"
  status: "ongoing"
  image: "/assets/images/project.jpg"
```

## 🚢 部署

### GitHub Pages (推荐)
1. Fork 本仓库
2. 修改仓库名为 `your-username.github.io`
3. 在仓库设置中启用 GitHub Pages
4. 选择 "GitHub Actions" 作为构建源
5. 推送代码自动部署

### 手动部署
```bash
# 构建静态文件
bundle exec jekyll build

# 将 _site/ 目录内容部署到服务器
```

## 🔧 配置选项

### 页面版块控制
在 `_config.yml` 中可以启用/禁用各个版块：
```yaml
page_sections:
  about:
    enabled: true
  research:
    enabled: true
  # ... 其他版块
```

### SEO优化
- 自动生成sitemap.xml
- 支持Open Graph标签
- 结构化数据支持
- 自动生成RSS订阅

## 📝 内容管理

### 图片库管理
编辑 `_data/gallery.yml` 添加新照片：
```yaml
- image: "/pictures/photo.jpg"
  title: "照片标题"
  description: "照片描述"
  location: "拍摄地点"
  date: "2025-01-01"
  tags: ["nature", "research"]
```

### 期刊管理
编辑 `_data/journals.yml` 管理期刊订阅：
```yaml
- name: "Journal Name"
  publisher: "Publisher"
  impact_factor: "5.2"
  access: "subscription"
  rss: "https://journal.com/rss"
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/new-feature`)
3. 提交更改 (`git commit -am 'Add new feature'`)
4. 推送到分支 (`git push origin feature/new-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 📞 联系方式

- **邮箱**: xianpuji@hhu.edu.cn
- **机构**: 河海大学海洋科学系
- **位置**: 南京, 中国

---

## 更新日志

### v2.0.0 (2025-01-06)
- ✨ 完全重构项目架构
- 🎨 全新UI设计
- 📱 响应式布局优化
- 🚀 性能优化
- 🔧 GitHub Pages部署修复

### v1.0.0 (2024-12-31)
- 🎉 初始版本发布
- 📝 基础功能实现

---

*最后更新: 2025年1月6日*
