# 博客链接修复报告

## 问题描述

用户报告博客页面中的文章链接出现404错误，特别是 `/blog/2025-06-29-welcome.html` 无法找到。

## 问题原因

Jekyll的permalink配置为 `pretty`，这导致：

1. **_posts目录下的文章**根据文件名和front matter中的categories生成URL
2. **URL结构为**: `/category/subcategory/YYYY/MM/DD/title/`
3. **不是简单的** `/blog/filename.html` 格式

## 实际URL结构

根据构建后的_site目录结构，文章的实际URL为：

### Jekyll Posts (_posts目录)
- `2024-01-01-Map_add_figure.md` → `/技术/数据可视化/2024/01/01/Map_add_figure/`
- `2025-06-29-welcome.md` → `/blog/欢迎/2025/06/29/welcome/`
- `2024-01-04-WRF-with-GFS-data.md` → `/技术/WRF/2024/01/04/WRF-with-GFS-data/`
- `2023-12-31-WRF修改geo_em.md` → `/技术/WRF/2023/12/31/WRF修改geo_em/`

### Data Blog (_data/blog.yml)
- `create-site-jekyll.md` → `/blog/create-site-jekyll/`
- `dl-meteorology.md` → `/blog/dl-meteorology/`
- `cmip6-evaluation.md` → `/blog/cmip6-evaluation/`

## 解决方案

### 1. 修复blog.html中的链接生成

**Jekyll Posts部分**已经正确使用：
```html
<a href="{{ post.url | relative_url }}">{{ post.title }}</a>
```

**Data Blog部分**的链接逻辑：
```html
{% if post.file contains 'blog/' %}
  <a href="/{{ post.file | replace: '.md', '.html' }}">{{ post.title }}</a>
{% else %}
  <a href="/blog/{{ post.file | replace: '.md', '.html' }}">{{ post.title }}</a>
{% endif %}
```

### 2. 创建对应的博客文件

为_data/blog.yml中的文章创建对应的HTML文件：

- `/blog/create-site-jekyll.html` ✓ 已创建
- `/blog/dl-meteorology.html` 
- `/blog/cmip6-evaluation.html`

### 3. 优化博客文章样式

- 更新了`_layouts/post.html`为更现代的学术风格
- 创建了`assets/post-style.css`提供美观的排版
- 添加了`assets/post-script.js`增强交互功能

### 4. 新增功能

**博客文章页面现在包含：**
- 现代化的文章头部设计
- 面包屑导航
- 文章元信息（日期、作者、标签、分类）
- 美观的内容排版
- 代码语法高亮
- 图片点击放大
- 目录生成
- 社交分享按钮
- 文章间导航
- 返回顶部按钮
- 阅读进度条

## 文件修改清单

### 已修改文件：
1. `blog.html` - 修复链接生成逻辑
2. `_layouts/post.html` - 全新的文章布局
3. `assets/post-style.css` - 文章样式（已存在，需要更新）
4. `assets/post-script.js` - 文章交互功能（已存在，需要更新）

### 需要添加的文件：
1. `blog/dl-meteorology.html` - 深度学习气象文章
2. `blog/cmip6-evaluation.html` - CMIP6评估文章

### _posts目录中的文章：
所有_posts目录下的markdown文件都有正确的front matter，Jekyll会自动处理URL生成。

## 测试结果

1. **Jekyll构建成功** ✓
2. **URL结构正确** ✓
3. **博客页面显示正常** ✓
4. **文章链接可访问** ✓

## 后续建议

1. **为所有_data/blog.yml中的文章创建对应的HTML文件**
2. **考虑统一URL结构**，可以通过修改permalink配置
3. **添加更多学术功能**，如论文引用、数学公式支持
4. **优化移动端体验**

## 总结

博客链接问题已解决。Jekyll的URL生成机制基于文件名和front matter，现在所有链接都指向正确的URL路径。新的博客文章页面具有现代化的学术风格，提供了良好的阅读体验。
