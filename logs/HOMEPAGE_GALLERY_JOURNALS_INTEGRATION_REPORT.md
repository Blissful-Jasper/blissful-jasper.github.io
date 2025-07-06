# Homepage Gallery & Journals Integration Report

## 项目概述
为 Jekyll 博客系统添加 Gallery（摄影作品集）和 Journals（期刊订阅）两个独立页面作为主页板块，实现与现有 blog.html、contact.html、links.html 等页面同等的展示效果。

## 已完成的工作

### 1. 创建主页预览组件
- **文件**: `_includes/gallery-section-preview.html`
  - 实现 Gallery 板块的主页预览
  - 支持展示前 6 张特色照片
  - 包含悬停效果和详细信息显示

- **文件**: `_includes/journals-section-preview.html`
  - 实现 Journals 板块的主页预览
  - 显示期刊统计信息
  - 展示前 4 个期刊的详细卡片

### 2. 配置文件更新
- **文件**: `_config.yml`
  - 启用 Gallery 和 Journals 板块 (`enabled: true`)
  - 配置板块标题、副标题和图标
  - 确保主页配置的一致性

### 3. 主页集成
- **文件**: `index.html`
  - 添加 Gallery 和 Journals 板块到主页
  - 引入专用样式文件
  - 保持与其他板块的一致性

### 4. 样式设计
- **文件**: `assets/homepage-gallery-journals.css`
  - Gallery 预览网格布局
  - Journals 统计卡片和预览卡片
  - 响应式设计适配移动端
  - 悬停效果和动画

### 5. 数据结构优化
- **文件**: `_data/journal_subscriptions.yml`
  - 为主要期刊添加 `featured` 和 `category` 字段
  - 确保数据结构支持主页预览需求

## 功能特性

### Gallery 板块
- ✅ 响应式网格布局
- ✅ 图片悬停效果
- ✅ 照片信息覆盖层
- ✅ 移动端适配
- ✅ 链接到完整 Gallery 页面

### Journals 板块
- ✅ 期刊统计信息展示
- ✅ 分类期刊数量统计
- ✅ 精选期刊卡片预览
- ✅ 影响因子和出版商信息
- ✅ 链接到完整 Journals 页面

## 技术实现

### 数据流
```
_data/gallery.yml → _includes/gallery-section-preview.html → index.html
_data/journal_subscriptions.yml → _includes/journals-section-preview.html → index.html
```

### 样式架构
```
assets/homepage-layout.css (基础样式)
assets/homepage-gallery-journals.css (专用样式)
```

### 响应式设计
- 桌面端：多列网格布局
- 平板端：调整网格列数和间距
- 移动端：单列布局，优化触摸体验

## 文件结构
```
├── _includes/
│   ├── gallery-section-preview.html     (新增)
│   └── journals-section-preview.html    (新增)
├── assets/
│   └── homepage-gallery-journals.css    (新增)
├── _config.yml                           (更新)
├── index.html                           (更新)
└── _data/
    └── journal_subscriptions.yml        (更新)
```

## 配置说明

### 在 _config.yml 中控制显示
```yaml
page_sections:
  gallery:
    enabled: true          # 启用/禁用 Gallery 板块
    title: "摄影作品集"    # 板块标题
    subtitle: "记录科研路上的美好瞬间"  # 副标题
    icon: "fas fa-camera"  # 图标
  journals:
    enabled: true          # 启用/禁用 Journals 板块
    title: "期刊订阅"      # 板块标题
    subtitle: "地球科学与大气科学领域的顶级期刊"  # 副标题
    icon: "fas fa-journal-whills"  # 图标
```

### 通过 YML 文件调试显示
- **Gallery**: 修改 `_data/gallery.yml` 中的照片信息
- **Journals**: 修改 `_data/journal_subscriptions.yml` 中的期刊信息

## 维护建议

1. **定期更新数据**: 
   - 在 `_data/gallery.yml` 中添加新的摄影作品
   - 在 `_data/journal_subscriptions.yml` 中更新期刊信息

2. **调整显示数量**: 
   - Gallery 预览显示前 6 张照片
   - Journals 预览显示前 4 个期刊
   - 可在对应的 include 文件中调整 `limit` 参数

3. **样式自定义**: 
   - 修改 `assets/homepage-gallery-journals.css` 调整样式
   - 保持与整体设计风格的一致性

## 下一步计划
- [ ] 添加更多照片到 Gallery 数据文件
- [ ] 完善 Journals 数据的期刊信息
- [ ] 考虑添加搜索和过滤功能
- [ ] 优化图片加载性能

---
**创建时间**: 2025-07-03
**状态**: 已完成
**维护者**: GitHub Copilot
