# 项目清理工具使用指南

## 概述

本项目提供了一套完整的清理工具，帮助保持Jekyll项目目录干净整洁，提高开发效率和项目可维护性。

## 🧹 清理脚本

### 主要清理脚本

#### 1. `cleanup.sh` / `cleanup.ps1` - 完整清理
**功能**: 全面清理项目中的临时文件、日志和测试文件

**使用方法**:
```bash
# Linux/macOS
./cleanup.sh [选项]

# Windows PowerShell  
.\cleanup.ps1 [选项]
```

**选项**:
- `--dry-run` / `-DryRun`: 预览模式，显示将要删除的文件但不实际删除
- `--deep` / `-Deep`: 深度清理，包括构建缓存和依赖文件
- `--help` / `-Help`: 显示帮助信息

**示例**:
```bash
./cleanup.sh                 # 标准清理
./cleanup.sh --dry-run       # 预览清理内容
./cleanup.sh --deep          # 深度清理
```

#### 2. `scripts/quick-clean.sh` / `scripts/quick-clean.ps1` - 快速清理
**功能**: 仅清理最常见的临时文件，适合频繁使用

**使用方法**:
```bash
# Linux/macOS
./scripts/quick-clean.sh

# Windows PowerShell
.\scripts\quick-clean.ps1
```

## 🔄 自动化清理

### Git Hook 自动清理
设置Git pre-commit hook，在每次提交前自动清理临时文件：

```bash
# 安装Git Hook
./scripts/install-hooks.sh
```

安装后，每次运行 `git commit` 时都会自动清理临时文件。

#### 3. `scripts/auto-cleanup.sh` / `scripts/auto-cleanup.ps1` - 自动监控清理
**功能**: 监控文件变化，自动清理相关日志和临时文件

**使用方法**:
```bash
# Linux/macOS
./scripts/auto-cleanup.sh [选项]

# Windows PowerShell
.\scripts\auto-cleanup.ps1 [选项]

# Windows批处理
.\scripts\auto-cleanup.bat [选项]
```

**选项**:
- `--cleanup-now`: 立即执行一次清理
- `--watch`: 启动监控模式，持续监控文件变化
- `--daemon`: 作为后台服务运行
- `--dry-run`: 预览模式，显示将要清理的文件但不删除
- `--stop`: 停止后台服务
- `--status`: 显示后台服务状态

**示例**:
```bash
./scripts/auto-cleanup.sh --cleanup-now    # 立即清理一次
./scripts/auto-cleanup.sh --watch          # 启动监控模式
./scripts/auto-cleanup.sh --daemon         # 后台服务模式
```

#### 4. `scripts/smart-cleanup.sh` - 智能清理脚本
**功能**: 支持多种清理模式和配置文件的高级清理工具

**使用方法**:
```bash
./scripts/smart-cleanup.sh [选项] [清理模式]
```

**清理模式**:
- `standard`: 标准清理（默认）
- `build`: 构建清理
- `dev`: 开发清理  
- `deep`: 深度清理
- `custom`: 自定义清理

**高级选项**:
- `--config FILE`: 指定配置文件路径
- `--backup`: 清理前创建备份
- `--stats`: 显示清理统计信息
- `--debug`: 启用调试模式

**示例**:
```bash
./scripts/smart-cleanup.sh --cleanup-now build    # 构建清理
./scripts/smart-cleanup.sh --watch dev            # 监控开发清理
./scripts/smart-cleanup.sh --stats                # 显示统计
```

## 📂 清理内容详细

### 标准清理项目

#### 开发报告和日志
- `*_REPORT.md` - 开发报告文件
- `*_LOG*.md` - 日志文件
- `*_COMPLETE*.md` - 完成报告
- `*_FIX*.md` - 修复报告
- `*_SUMMARY*.md` - 总结文件
- `PROJECT_CLEANUP_*.md` - 清理报告
- `LIQUID_SYNTAX_*.md` - 语法错误报告
- `GALLERY_*_REPORT.md` - 画廊相关报告
- `WEBSITE_*_REPORT.md` - 网站相关报告

#### 测试和调试文件
- `*test*.html` - 测试HTML文件
- `*debug*.html` - 调试页面
- `*demo*.html` - 演示页面
- `*preview*.html` - 预览页面
- `*validate*.html` - 验证页面
- `gallery-test-*.html` - 画廊测试文件
- `static-image-*.html` - 静态图片测试

#### 临时文件
- `*.tmp` - 临时文件
- `*.bak` - 备份文件
- `*.swp`, `*.swo` - Vim交换文件
- `*~` - 编辑器临时文件
- `*.orig` - 合并冲突原始文件
- `*.rej` - 补丁拒绝文件
- `.DS_Store` - macOS系统文件
- `Thumbs.db` - Windows缩略图缓存

#### 测试和备份目录
- `_test-pages/` - 测试页面目录
- `_backup/` - 备份目录
- `backup/` - 另一个备份目录
- `test/`, `tests/` - 测试目录
- `logs/`, `_logs/` - 日志目录

### 深度清理项目 (使用 --deep)

#### Jekyll构建文件
- `_site/` - Jekyll构建输出
- `.sass-cache/` - Sass缓存
- `.jekyll-cache/` - Jekyll缓存
- `.jekyll-metadata` - Jekyll元数据
- `.bundle/` - Bundler缓存
- `vendor/` - Vendor依赖

#### Node.js文件 (如果使用)
- `node_modules/` - Node.js依赖
- `npm-debug.log*` - npm调试日志
- `yarn-debug.log*` - Yarn调试日志
- `yarn-error.log*` - Yarn错误日志

## ⚙️ 配置

### .gitignore 自动更新
清理脚本会自动更新 `.gitignore` 文件，确保清理的文件类型被正确忽略：

```ignore
# 自动清理的文件类型
*_REPORT.md
*_LOG*.md
*_COMPLETE*.md
*_FIX*.md
*test*.html
*debug*.html
*demo*.html
_test-pages/
_backup/
backup/
*.tmp
*.bak
*~
```

### 自定义清理规则
可以通过修改脚本中的 `patterns` 数组来自定义清理规则：

```bash
# 在 cleanup.sh 中添加自定义模式
patterns=(
    "*_REPORT.md"
    "custom_pattern*.html"
    # 添加您的自定义模式
)
```

## 🚀 最佳实践

### 日常开发流程
1. **开发前**: 运行 `./scripts/quick-clean.sh` 确保环境干净
2. **开发中**: 定期运行快速清理
3. **提交前**: 运行 `./cleanup.sh` 完整清理
4. **重大更改后**: 运行 `./cleanup.sh --deep` 深度清理

### 团队协作
1. **设置Git Hook**: 确保所有团队成员都安装了自动清理hook
2. **定期清理**: 建议每周运行一次深度清理
3. **代码审查**: 检查是否有临时文件被意外提交

### 持续集成
在CI/CD流程中加入清理步骤：

```yaml
# GitHub Actions 示例
- name: Clean project
  run: ./cleanup.sh
```

## 🔍 故障排除

### 常见问题

**Q: 脚本权限不足**
```bash
# Linux/macOS
chmod +x cleanup.sh
chmod +x scripts/*.sh

# Windows (管理员PowerShell)
Set-ExecutionPolicy RemoteSigned
```

**Q: 误删重要文件**
使用 `--dry-run` 选项预览清理内容：
```bash
./cleanup.sh --dry-run
```

**Q: Git Hook 不工作**
重新安装hook：
```bash
./scripts/install-hooks.sh
```

**Q: 清理后网站无法构建**
运行深度清理后重新安装依赖：
```bash
./cleanup.sh --deep
bundle install
```

## 📊 性能提升

使用清理工具的预期效果：

- **文件数量减少**: 30-70%
- **构建速度提升**: 10-30%
- **Git操作加速**: 15-25%
- **IDE响应提升**: 5-15%

## 🎯 进阶用法

### 自定义清理脚本
创建项目特定的清理规则：

```bash
# 创建 custom-clean.sh
#!/bin/bash
# 清理特定的项目文件
rm -f my_specific_temp_files_*
./cleanup.sh
echo "✅ 自定义清理完成"
```

### 定时清理
使用cron job定时清理：

```bash
# 添加到crontab - 每天清理一次
0 2 * * * cd /path/to/project && ./cleanup.sh > /dev/null 2>&1
```

---

## 总结

清理工具套件提供了：

- 🧹 **全面清理**: 删除所有类型的临时文件
- ⚡ **快速清理**: 日常使用的轻量清理
- 🔄 **自动化**: Git hook自动清理
- 🛡️ **安全性**: 预览模式防止误删
- 📈 **性能**: 显著提升项目响应速度

通过合理使用这些工具，可以保持Jekyll项目始终处于最佳状态！

## 🤖 自动清理系统

### 配置文件系统
智能清理脚本支持配置文件 `auto-cleanup.config`，允许你自定义清理行为：

```bash
# 基本配置
WATCH_INTERVAL=5                    # 监控间隔（秒）
CLEANUP_DELAY=30                    # 清理延迟（秒）
VERBOSE_LOGGING=true                # 详细日志
LOG_MAX_SIZE=10                     # 日志文件最大大小（MB）

# 通知配置
ENABLE_NOTIFICATIONS=true           # 启用通知
NOTIFICATION_MODE=both              # 通知方式: console/file/both

# 备份配置
CREATE_BACKUP_BEFORE_CLEANUP=false # 清理前备份
BACKUP_DIRECTORY=.cleanup-backup    # 备份目录
BACKUP_RETENTION_DAYS=7             # 备份保留天数

# 性能配置
MAX_FILES_PER_CLEANUP=1000          # 单次清理最大文件数
CLEANUP_TIMEOUT=300                 # 清理超时时间（秒）
CLEANUP_THREADS=4                   # 清理线程数
```

### 清理模式详解

#### 1. Standard 模式（标准清理）
清理常见的临时文件和日志：
- `*.log`, `*.tmp`, `*~`
- `.DS_Store`, `Thumbs.db`
- `*.swp`, `*.swo`
- `.jekyll-metadata`

#### 2. Build 模式（构建清理）
清理构建和缓存文件：
- `_site/*`
- `.sass-cache/*`
- `.jekyll-cache/*`
- `node_modules/.cache/*`
- `.bundle/cache/*`

#### 3. Dev 模式（开发清理）
清理开发工具产生的文件：
- `*.pid`
- `*.lock.tmp`
- `debug.log`, `error.log`
- `.vscode/settings.json.tmp`

#### 4. Deep 模式（深度清理）
组合所有模式的清理内容，进行全面清理。

#### 5. Custom 模式（自定义清理）
根据配置文件中的 `CUSTOM_PATTERNS` 进行清理。

### 自动监控功能

#### 智能触发机制
自动清理系统会监控以下文件类型的变化：
- **内容文件**: `.md`, `.html`
- **样式文件**: `.scss`, `.css`
- **脚本文件**: `.js`
- **配置文件**: `.yml`, `.yaml`

#### 触发目录
重点监控以下目录的变化：
- `_posts/` - 博客文章
- `_pages/` - 页面文件
- `_sass/` - 样式文件
- `assets/` - 资源文件
- `_data/` - 数据文件

### 统计和监控

#### 清理统计
智能清理脚本会记录详细的清理统计：
```bash
# 查看清理统计
./scripts/smart-cleanup.sh --stats
```

统计信息包括：
- 总清理次数
- 总清理文件数
- 按模式分类的统计
- 最近清理历史

#### 日志系统
- **详细日志**: 记录所有清理操作
- **日志轮转**: 自动管理日志文件大小
- **多级别日志**: ERROR、WARNING、INFO、DEBUG
- **时间戳**: 精确记录操作时间

### 后台服务模式

#### 启动后台服务
```bash
# Linux/macOS
./scripts/auto-cleanup.sh --daemon

# Windows
.\scripts\auto-cleanup.bat daemon
```

#### 管理后台服务
```bash
# 查看状态
./scripts/auto-cleanup.sh --status

# 停止服务
./scripts/auto-cleanup.sh --stop
```

### 高级配置选项

#### 排除规则
永不清理的文件和目录：
```bash
EXCLUDE_DIRECTORIES=(
    ".git" "_posts" "_pages" "_data" 
    "_includes" "_layouts" "assets"
)

EXCLUDE_FILES=(
    "_config.yml" "Gemfile" "README.md" 
    "LICENSE" ".gitignore"
)

WHITELIST_EXTENSIONS=(
    ".md" ".html" ".css" ".scss" ".js" 
    ".json" ".yml" ".yaml" ".png" ".jpg"
)
```

#### 性能优化
```bash
# 启用增量清理
ENABLE_INCREMENTAL_CLEANUP=true

# 并发清理线程数
CLEANUP_THREADS=4

# 清理操作超时
CLEANUP_TIMEOUT=300

# 单次最大文件数
MAX_FILES_PER_CLEANUP=1000
```

### 集成到开发工作流

#### 1. VS Code 任务集成
在 `.vscode/tasks.json` 中添加：
```json
{
    "label": "Auto Cleanup",
    "type": "shell",
    "command": "./scripts/auto-cleanup.sh",
    "args": ["--cleanup-now"],
    "group": "build"
}
```

#### 2. npm/yarn 脚本集成
在 `package.json` 中添加：
```json
{
    "scripts": {
        "clean": "scripts/auto-cleanup.sh --cleanup-now",
        "clean:watch": "scripts/auto-cleanup.sh --watch",
        "clean:deep": "scripts/smart-cleanup.sh --cleanup-now deep"
    }
}
```

#### 3. GitHub Actions 集成
```yaml
name: Auto Cleanup
on:
  push:
    branches: [ main ]
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run cleanup
        run: ./scripts/smart-cleanup.sh --cleanup-now build
```

### 定制化建议

#### 根据项目调整配置
1. **小型项目**: 使用标准清理，较短的监控间隔
2. **大型项目**: 使用深度清理，较长的清理延迟
3. **频繁更新**: 启用后台服务模式
4. **团队协作**: 统一配置文件并加入版本控制

#### 性能考虑
- 调整 `CLEANUP_THREADS` 根据系统性能
- 设置合理的 `MAX_FILES_PER_CLEANUP` 避免系统负载过高
- 使用 `ENABLE_INCREMENTAL_CLEANUP` 提高效率

---

*自动清理系统让你的Jekyll项目始终保持干净整洁，提高开发效率！*
