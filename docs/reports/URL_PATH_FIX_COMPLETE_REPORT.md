# Jekyll博客URL路径修正完成报告

## 问题诊断

经过深入分析，发现Jekyll博客系统中文章404错误的根本原因是：

### 1. URL结构不匹配
- **实际生成的URL**：`/category/subcategory/YYYY/MM/DD/title/`
- **blog.html中的URL**：`/YYYY/MM/DD/title/`（缺少category和subcategory）

### 2. 配置影响
- `_config.yml`中的`permalink: pretty`导致Jekyll生成基于categories的URL结构
- 每篇文章的`categories: [主分类, 子分类]`直接影响最终URL路径

## 解决方案

### 1. 完善_data/blog.yml数据结构
为每篇文章添加了`subcategory`字段：

```yaml
- title: "MRG Waves and Tropical Precipitation"
  date: "2025-06-29"
  summary: "MRG 波与热带降水的关系。"
  file: "_posts/2025-06-29-MRG-waves.md"
  images: ["/assets/images/blog/MRG.png"]
  tags: ["MRG波", "热带气象", "降水", "大气动力学"]
  category: "科研"
  subcategory: "大气动力学"  # 新增字段
```

### 2. 修正blog.html中的URL生成逻辑
将URL生成从：
```liquid
{% assign post_url = '/' | append: year | append: '/' | append: month | append: '/' | append: day | append: '/' | append: filename | append: '/' %}
```

修改为：
```liquid
{% assign post_url = '/' | append: post.category | append: '/' | append: post.subcategory | append: '/' | append: year | append: '/' | append: month | append: '/' | append: day | append: '/' | append: filename | append: '/' %}
```

## 验证结果

### 1. 实际生成的URL路径
- `/科研/大气动力学/2025/06/29/MRG-waves/`
- `/技术/jekyll/2025/06/29/create-site-jekyll/`
- `/技术/wrf/2023/12/31/WRF修改geo_em/`
- `/科研/热带气象/2024/01/04/CCEWs/`

### 2. _site目录结构
```
_site/
├── 科研/
│   ├── 大气动力学/2025/06/29/MRG-waves/index.html
│   ├── 气候变化/2025/06/29/cmip6-evaluation/index.html
│   ├── 深度学习/2024/12/15/dl-meteorology/index.html
│   └── 热带气象/2024/01/04/CCEWs/index.html
├── 技术/
│   ├── jekyll/2025/06/29/create-site-jekyll/index.html
│   ├── wrf/2023/12/31/WRF修改geo_em/index.html
│   ├── wrf/2024/01/04/WRF-with-GFS-data/index.html
│   └── 绘图/2024/01/01/Map-add-figure/index.html
└── 杂谈/
    └── 杂谈/2025/06/29/welcome-to-my-blog/index.html
```

### 3. 功能验证
- ✅ 所有文章URL均可正确访问
- ✅ blog.html页面显示正常
- ✅ 文章链接跳转正确
- ✅ 404错误已彻底解决

## 技术要点总结

### 1. Jekyll URL生成规则
- 使用`permalink: pretty`时，URL结构为：`/category1/category2/YYYY/MM/DD/title/`
- categories数组的第一个元素为主分类，第二个元素为子分类
- 标题会自动转换为URL友好格式（中文保持原样）

### 2. 双重文章管理体系
- **Jekyll标准posts**：通过`site.posts`循环，使用`{{ post.url | relative_url }}`
- **数据驱动posts**：通过`site.data.blog`循环，需要手动构建URL

### 3. 中文URL支持
- Jekyll完全支持中文URL路径
- 浏览器能正确解析和访问中文URL
- 对SEO和用户体验无负面影响

## 后续维护建议

### 1. 新增文章时
- 确保`_posts/YYYY-MM-DD-title.md`文件命名规范
- 在front matter中正确设置categories：`categories: [主分类, 子分类]`
- 在`_data/blog.yml`中添加对应的metadata，包括subcategory字段

### 2. URL一致性
- 确保文章的categories与blog.yml中的category/subcategory完全一致
- 建议建立分类标准化文档，避免命名不一致

### 3. 测试流程
- 每次修改后运行`bundle exec jekyll build`
- 检查`_site`目录结构是否正确
- 在浏览器中测试所有文章链接

## 结论

通过修正URL生成逻辑，现在Jekyll博客系统的文章访问已经完全正常：

1. **问题根源**：URL结构不匹配导致的404错误
2. **解决方案**：完善数据结构，修正URL生成逻辑
3. **验证结果**：所有文章均可正常访问，404错误完全消除
4. **系统稳定**：支持LaTeX、代码高亮、图片显示等所有功能

Jekyll博客系统现已完全可用，支持灵活的内容管理和无缝的用户体验。

---

*报告生成时间：2025-07-03*  
*修正完成状态：✅ 完成*
