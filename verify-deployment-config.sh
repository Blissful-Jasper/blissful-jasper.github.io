#!/bin/bash
# GitHub Pages 部署验证脚本

echo "🔍 检查 GitHub Pages 部署配置..."

# 检查 Gemfile.lock 平台支持
echo ""
echo "📦 检查 Gemfile.lock 平台支持："
if grep -q "x86_64-linux" Gemfile.lock; then
    echo "✅ Linux 平台支持: 已添加"
else
    echo "❌ Linux 平台支持: 缺失"
fi

if grep -q "x86_64-darwin" Gemfile.lock; then
    echo "✅ macOS 平台支持: 已添加"
else
    echo "⚠️  macOS 平台支持: 缺失"
fi

if grep -q "x64-mingw-ucrt" Gemfile.lock; then
    echo "✅ Windows 平台支持: 已添加"
else
    echo "❌ Windows 平台支持: 缺失"
fi

# 检查 GitHub Actions 配置
echo ""
echo "🔧 检查 GitHub Actions 配置："
if [ -f ".github/workflows/pages.yml" ]; then
    echo "✅ GitHub Actions workflow: 存在"
    
    if grep -q "add-platform" .github/workflows/pages.yml; then
        echo "✅ 自动平台修复: 已配置"
    else
        echo "⚠️  自动平台修复: 未配置"
    fi
else
    echo "❌ GitHub Actions workflow: 缺失"
fi

# 检查基本配置文件
echo ""
echo "📋 检查基本配置文件："
if [ -f "Gemfile" ]; then
    echo "✅ Gemfile: 存在"
else
    echo "❌ Gemfile: 缺失"
fi

if [ -f "_config.yml" ]; then
    echo "✅ _config.yml: 存在"
else
    echo "❌ _config.yml: 缺失"
fi

# 检查关键依赖
echo ""
echo "📚 检查关键依赖："
if grep -q "github-pages" Gemfile; then
    echo "✅ github-pages gem: 已配置"
else
    echo "❌ github-pages gem: 缺失"
fi

if grep -q "webrick" Gemfile; then
    echo "✅ webrick gem: 已配置"
else
    echo "⚠️  webrick gem: 建议添加"
fi

echo ""
echo "🎯 总结："
echo "如果所有检查项都显示 ✅，您的配置应该可以在 GitHub Pages 上成功部署。"
echo "如果有 ❌ 项，请按照 GITHUB_PAGES_DEPLOYMENT_FIX.md 中的说明进行修复。"
echo ""
echo "🚀 推送代码到 GitHub 以测试部署！"
