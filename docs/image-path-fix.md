# 图片文件修复说明

## 问题解决

原来的图片文件存储在 `_picture/` 目录下，但 Jekyll 不会处理以下划线开头的目录。已将路径更改为 `/pictures/` 目录。

## 当前状态

✅ **路径已修复**：所有图片路径已从 `/_picture/` 更改为 `/pictures/`
✅ **占位符文件已创建**：在 `pictures/` 目录下创建了所有需要的文件占位符
✅ **配置已更新**：`_data/gallery.yml` 已更新为正确的路径

## 需要的操作

请手动将原始图片文件从 `_picture/` 目录复制到 `pictures/` 目录：

### 方法1：手动复制（推荐）
1. 打开文件管理器
2. 导航到项目根目录
3. 将 `_picture/` 目录下的所有文件复制到 `pictures/` 目录
4. 覆盖现有的占位符文件

### 方法2：使用命令行
```bash
# Windows
xcopy "_picture\*" "pictures\" /Y

# 或者使用 PowerShell
Copy-Item "_picture\*" "pictures\" -Force

# 或者逐个复制
copy "_picture\DSC_1667.JPG" "pictures\DSC_1667.JPG"
copy "_picture\DSC_1398.jpg" "pictures\DSC_1398.jpg"
copy "_picture\DSC_1545.jpg" "pictures\DSC_1545.jpg"
copy "_picture\DSC_1573.jpg" "pictures\DSC_1573.jpg"
copy "_picture\DSC_1652.jpg" "pictures\DSC_1652.jpg"
copy "_picture\DSC_1682.jpg" "pictures\DSC_1682.jpg"
copy "_picture\DSC_1354.jpg" "pictures\DSC_1354.jpg"
copy "_picture\DSC_1361.jpg" "pictures\DSC_1361.jpg"
```

## 当前文件列表

需要复制的文件：
- DSC_1667.JPG
- DSC_1398.jpg
- DSC_1545.jpg
- DSC_1573.jpg
- DSC_1652.jpg
- DSC_1682.jpg
- DSC_1354.jpg
- DSC_1361.jpg

## 验证

复制完成后：
1. 重新启动 Jekyll 服务器：`bundle exec jekyll serve`
2. 访问 `/gallery.html` 页面
3. 确认所有图片都能正常显示

## 清理

复制完成后，可以删除原来的 `_picture/` 目录：
```bash
rmdir "_picture" /s
```

---
日期：2025年7月4日
状态：✅ 路径已修复，等待图片文件复制
