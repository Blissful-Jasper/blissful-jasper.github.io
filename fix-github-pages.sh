#!/bin/bash
# GitHub Pages 跨平台部署修复脚本

echo "🔧 GitHub Pages 跨平台部署修复"
echo "================================"

# 检查Ruby版本
echo "📋 检查Ruby版本..."
ruby --version

# 检查Bundler版本
echo "📋 检查Bundler版本..."
bundle --version

# 清理现有依赖
echo "🧹 清理现有依赖..."
rm -rf .bundle vendor Gemfile.lock
bundle clean --force 2>/dev/null

# 配置Bundler
echo "⚙️ 配置Bundler..."
bundle config set --local deployment false
bundle config set --local path vendor/bundle

# 安装依赖
echo "📦 安装依赖..."
bundle install --jobs 4 --retry 3

# 检查平台支持
echo "🔍 检查平台支持..."
bundle platform

# 构建网站
echo "🏗️ 构建Jekyll网站..."
bundle exec jekyll build

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "🚀 启动本地服务器..."
    bundle exec jekyll serve --host 0.0.0.0 --port 4000
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
