#!/bin/bash
# =============================================================================
# 🔧 minify-site.sh - Linux/Unix 版本的网站压缩脚本
# =============================================================================

echo "🚀 开始压缩网站文件..."

# 检查是否存在 _site 目录
if [ ! -d "./_site" ]; then
    echo "❌ 错误：找不到 _site 目录。请先运行 Jekyll 构建。"
    exit 1
fi

# 压缩 HTML 文件
echo "📄 压缩 HTML 文件..."
find ./_site -name "*.html" -type f -exec npx html-minifier-terser {} --remove-comments --collapse-whitespace --output {} \;

# 压缩 CSS 文件
echo "🎨 压缩 CSS 文件..."
find ./_site -name "*.css" -type f -exec npx cleancss {} -o {} \;

# 压缩 JS 文件
echo "⚡ 压缩 JavaScript 文件..."
find ./_site -name "*.js" -type f -exec npx uglifyjs {} -c -m -o {} \;

echo "✅ 网站文件压缩完成！"
