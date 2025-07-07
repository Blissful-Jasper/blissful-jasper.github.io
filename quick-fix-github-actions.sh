#!/bin/bash
# GitHub Actions 快速修复脚本 - zeitwerk 兼容性

echo "🔧 修复 GitHub Actions 部署问题..."

# 1. 备份现有 Gemfile.lock
if [ -f "Gemfile.lock" ]; then
    cp Gemfile.lock Gemfile.lock.backup
    echo "✅ 已备份 Gemfile.lock"
fi

# 2. 临时添加 zeitwerk 版本约束到 Gemfile（仅 Ruby < 3.2 需要）
echo ""
echo "📝 检查是否需要添加 zeitwerk 版本约束..."
if ! grep -q 'zeitwerk.*~.*2.6' Gemfile; then
    echo ""                             >> Gemfile
    echo "# Temporary fix for GitHub Actions Ruby 3.1 compatibility" >> Gemfile
    echo 'gem "zeitwerk", "~> 2.6.0"'   >> Gemfile
    echo "✅ 已添加 zeitwerk 版本约束"
else
    echo "⚠️  zeitwerk 版本约束已存在"
fi

# 3. 添加平台支持
echo ""
echo "🌍 添加多平台支持..."
bundle lock --add-platform x86_64-linux    2>/dev/null || true
bundle lock --add-platform x86_64-darwin   2>/dev/null || true
echo "✅ 已添加平台支持"

# 4. 更新依赖
echo ""
echo "📦 更新依赖..."
bundle update --conservative 2>/dev/null || {
    echo "⚠️  bundle update 失败，尝试重新安装..."
    rm -f Gemfile.lock
    bundle install
}

# 5. 验证安装
echo ""
echo "🔍 验证安装..."
bundle exec jekyll --version > /dev/null 2>&1 && {
    echo "✅ Jekyll 安装成功"
} || {
    echo "❌ Jekyll 安装失败"
    exit 1
}

echo ""
echo "🎉 修复完成！"
echo ""
echo "下一步："
echo "1. 提交并推送代码到 GitHub"
echo "2. 在 Actions 页面观察部署状态"
echo "3. 如仍失败，可手动触发备用 workflow"
echo ""
echo "如果本地测试："
echo "bundle exec jekyll serve"
