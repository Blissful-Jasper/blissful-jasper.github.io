# Jekyll 项目 - npm 脚本说明

## 📋 问题解决

原始错误已解决：
- ✅ `npm error JSON.parse Unexpected token "#"` - 移除了非法注释
- ✅ `npm ci` 同步错误 - 简化了依赖结构，使用 npx 运行工具

## 🚀 可用命令

### 开发命令
```bash
npm run dev        # 启动开发服务器 (Jekyll + LiveReload)
npm run build:dev  # 构建开发版本 (包含草稿)
npm run clean      # 清理构建文件
npm run build      # 标准构建
```

### 文件压缩 (使用 npx，无需预安装)
```bash
npm run minify:html # 压缩 HTML 文件
npm run minify:css  # 压缩 CSS 文件
npm run minify:js   # 压缩 JavaScript 文件
npm run minify:win  # Windows PowerShell 批量压缩
```

### 部署
```bash
npm run deploy     # 构建并部署到 GitHub Pages
npm run test       # 运行构建测试
```

## 🔧 技术说明

### 简化的依赖策略
- **最小依赖**: 只在 package.json 中包含必要的 `gh-pages`
- **按需工具**: 使用 `npx` 运行压缩工具，避免复杂的依赖树
- **错误容忍**: 压缩步骤可选，不会中断构建流程

### 平台兼容性
- **Linux/macOS**: 使用 npx 命令
- **Windows**: 使用 PowerShell 脚本
- **CI/CD**: GitHub Actions 自动处理

## 📁 核心文件

- `package.json` - 简化的 Node.js 配置 (只包含必要依赖)
- `package-lock.json` - 最小化锁文件
- `minify-site.ps1` - Windows 压缩脚本
- `.github/workflows/build-and-deploy.yml` - CI/CD 工作流

## 🎯 优势

1. **简单**: 避免复杂的依赖管理
2. **可靠**: 使用 npx 确保工具可用性
3. **灵活**: 压缩步骤可选，不影响核心功能
4. **兼容**: 支持多平台和 CI/CD 环境
