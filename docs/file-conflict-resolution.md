---
title: "文件冲突解决报告"
date: 2025-07-04
layout: default
---

# 文件冲突解决报告

## 问题描述
Jekyll 构建时出现了文件冲突错误：
```
Conflict: The following destination is shared by multiple files.
The written file may end up with unexpected contents.
O:/blissful-jasper.github.io-main/blissful-jasper.github.io/_site/journals.html
 - journals-new.html
 - journals.html
```

## 问题原因
存在两个文件都设置了相同的 `permalink: /journals.html`：
1. `journals.html` - 主要的期刊页面
2. `journals-new.html` - 重复的期刊页面

## 解决方案
1. **识别冲突源**：发现 `journals-new.html` 是重复文件
2. **修改 permalink**：将 `journals-new.html` 的 permalink 改为 `/journals-backup.html`
3. **清理构建**：运行 `jekyll clean` 清理缓存
4. **重新构建**：运行 `jekyll build` 重新构建网站

## 额外修复
遇到文件系统错误：`No such file or directory @ utime_failed`
- **添加前置数据**：为文档文件添加 Jekyll front matter
- **排除处理**：在 `_config.yml` 中排除问题文档文件
- **重新构建**：确保所有问题都得到解决

## 验证结果
✅ **冲突解决**：不再有文件路径冲突错误
✅ **Jekyll 构建成功**：网站可以正常构建
✅ **页面正常访问**：所有页面都可以正常访问
✅ **功能完整**：Gallery 和 Journals 功能都正常工作

## 当前状态
- `journals.html` - 主要期刊页面，可通过 `/journals.html` 访问
- `journals-new.html` - 备份文件，可通过 `/journals-backup.html` 访问（如果需要）
- 所有页面都在主导航栏中正确显示
- Jekyll 服务器正常运行

## 建议
建议在确认主页面工作正常后，删除或移动 `journals-new.html` 备份文件，以避免未来的混淆。

---
日期：2025年7月4日
状态：✅ 已解决
