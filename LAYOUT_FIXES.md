# Layout Fix Summary

## 问题解决

### 1. Research Section 和 Publications Section 布局修正
- **问题**: 标题和内容是左右排列
- **解决方案**: 修改CSS使标题居中，内容在标题下方上下排列

#### 修改内容：
- 更新 `theme-minimal.css` 中的样式：
  - `.section-title` 改为 `text-align: center`
  - `.research-section` 添加 `text-align: center`
  - `.publications-section` 添加 `text-align: center` 
  - `.research-description` 在桌面端左对齐，移动端居中

### 2. 研究兴趣链接跳转修复
- **问题**: "阅读文章"按钮点击后无法正确跳转
- **解决方案**: 修复链接路径指向正确的markdown文件

#### 修改的链接：
- Kelvin波与热带降水 → `blog-post.html?file=blog/kelvin-waves.md`
- CMIP6模式评估与气候变化 → `blog-post.html?file=blog/cmip6-evaluation.md`
- 深度学习在气象中的应用 → `blog-post.html?file=blog/dl-meteorology.md`

## CSS 布局结构

### Research Section:
```
标题居中
↓
描述文字（桌面端左对齐，移动端居中）
↓
三列网格卡片布局
```

### Publications Section:
```
标题居中
↓
垂直论文列表（左对齐内容）
```

## 响应式优化
- 移动端下research description自动居中对齐
- 保持良好的阅读体验

## 文件修改列表
1. `_includes/research-section.html` - 修复链接路径
2. `assets/theme-minimal.css` - 布局样式调整
   - Section标题居中
   - Research和Publications section布局优化
   - 响应式样式完善
