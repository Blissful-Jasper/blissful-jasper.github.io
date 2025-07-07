#!/bin/bash
# GitHub Pages 部署修复脚本
# 解决 Gemfile.lock 平台兼容性问题

echo "🔧 修复 GitHub Pages 部署平台兼容性问题..."

# 检查是否在正确的目录中
if [ ! -f "Gemfile" ]; then
    echo "❌ 错误：未找到 Gemfile 文件"
    echo "请确保在 Jekyll 项目根目录运行此脚本"
    exit 1
fi

echo "📦 添加多平台支持到 Gemfile.lock..."

# 添加 Linux 平台支持
bundle lock --add-platform x86_64-linux

# 添加 macOS 平台支持  
bundle lock --add-platform x86_64-darwin

# 如果存在其他平台，也添加支持
bundle lock --add-platform arm64-darwin  # Apple Silicon Mac

echo "✅ 平台兼容性修复完成！"

# 显示当前支持的平台
echo ""
echo "🔍 当前支持的平台："
grep -A 10 "PLATFORMS" Gemfile.lock

echo ""
echo "🚀 现在可以尝试重新部署到 GitHub Pages"
echo "💡 如果问题依然存在，请检查 .github/workflows/ 中的部署配置"
