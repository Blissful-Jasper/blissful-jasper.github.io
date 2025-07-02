# 页面板块显示控制说明

## 功能说明

现在您可以通过简单修改 `_config.yml` 文件来控制主页上各个板块的显示与隐藏，通过设置 `true`/`false` 值来控制相应的HTML文件是否加载到主页上。

## 使用方法

在 `_config.yml` 文件中找到 `page_sections` 配置区域：

```yaml
# 页面板块显示控制
# 设置为 false 即可隐藏对应的板块
page_sections:
  about: true        # 关于我板块
  research: true     # 研究兴趣板块
  publications: false # 发表论文板块（当前已隐藏）
  journals: true     # 学术前沿板块
  blog: true         # 博客板块
  links: true        # 链接板块
  maps: true         # 地图板块
  contact: true      # 联系方式板块
```

## 控制原理

系统通过Jekyll的条件语句来实现：
- `true`: 加载对应的HTML include文件和CSS样式
- `false`: 不加载对应的HTML include文件和CSS样式

## 隐藏板块的方法

### 设置为 false（推荐）
```yaml
page_sections:
  about: true
  research: true
  publications: false  # 设置为 false 隐藏 publications 板块
  journals: true
  contact: true
```

### 注释掉整行（备选）
```yaml
page_sections:
  about: true
  research: true
  # publications: true  # 注释掉这行也会隐藏 publications 板块
  journals: true
  contact: true
```

## 实现细节

当您设置某个板块为 `false` 时：

1. **HTML不会加载**：
```html
{% if site.page_sections.publications %}
<div class="section-wrapper">
  {% include publications-section.html %}
</div>
{% endif %}
```

2. **相关CSS也不会加载**：
```html
{% if site.page_sections.publications %}
<link rel="stylesheet" href="assets/publications-styles.css">
{% endif %}
```

## 板块说明

- `about`: 关于我 - 个人信息、研究兴趣、社交链接等
- `research`: 研究兴趣 - 详细的研究方向描述
- `publications`: 发表论文 - 学术论文列表
- `journals`: 学术前沿 - 相关期刊和最新动态
- `blog`: 博客 - 个人博客文章
- `links`: 链接 - 相关学术链接和资源
- `maps`: 地图 - 研究区域地图展示
- `contact`: 联系方式 - 详细联系信息

## 使用示例

### 只显示核心板块
```yaml
page_sections:
  about: true
  research: true
  publications: false
  journals: false
  blog: false
  links: false
  maps: false
  contact: true
```

### 学术研究重点展示
```yaml
page_sections:
  about: true
  research: true
  publications: true
  journals: true
  blog: false
  links: false
  maps: true
  contact: true
```

## 注意事项

1. **修改后需要重启Jekyll服务器**才能生效
2. **YAML语法要求**：使用小写的 `true`/`false`，不是 `True`/`False`
3. **建议保留的板块**：`about` 和 `contact` 包含重要的个人信息
4. **性能优化**：隐藏的板块不会加载对应的CSS文件，提高页面加载速度
