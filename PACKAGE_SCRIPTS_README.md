# Jekyll 项目 - npm 脚本说明

## 📋 问题解决

原始错误 `npm error JSON.parse Unexpected token "#"` 已解决：
- ✅ 移除了 `package.json` 中的非法注释
- ✅ 确保 JSON 格式完全符合标准

## 🚀 可用命令

### 开发命令
```bash
npm run dev        # 启动开发服务器 (Jekyll + LiveReload)
npm run build:dev  # 构建开发版本 (包含草稿)
npm run clean      # 清理构建文件
```

### 生产构建
```bash
npm run build      # 标准构建
npm run build:prod # 生产环境构建 (Linux/macOS)
npm run build:prod:win # 生产环境构建 (Windows)
```

### 文件压缩
```bash
npm run minify     # 压缩所有文件 (Linux/macOS)
npm run minify:win # 压缩所有文件 (Windows)
npm run minify:html # 仅压缩 HTML
npm run minify:css  # 仅压缩 CSS
npm run minify:js   # 仅压缩 JavaScript
```

### 部署和测试
```bash
npm run deploy     # 构建并部署到 GitHub Pages
npm run test       # 运行 HTML 校验
npm run serve:prod # 本地预览生产版本
```

## 🔧 平台兼容性

- **Linux/macOS**: 使用标准的 `find` 命令
- **Windows**: 使用 PowerShell 脚本 `minify-site.ps1`

## 📁 相关文件

- `package.json` - Node.js 依赖和脚本定义
- `package-lock.json` - 依赖锁定文件
- `minify-site.ps1` - Windows 压缩脚本
- `minify-site.sh` - Linux/Unix 压缩脚本
- `.github/workflows/build-and-deploy.yml` - GitHub Actions 工作流
