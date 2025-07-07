#!/bin/bash
# Ruby版本兼容性修复脚本

echo "🔧 修复Ruby版本兼容性问题..."

# 检查当前Ruby版本
echo "📋 当前Ruby版本："
ruby --version

echo ""
echo "🎯 解决zeitwerk版本兼容性问题..."

# 方案1：更新Gemfile.lock以支持Ruby 3.2+
echo "📦 更新依赖锁定文件..."

# 删除旧的Gemfile.lock（如果存在版本冲突）
if [ -f "Gemfile.lock" ]; then
    echo "⚠️  备份现有Gemfile.lock..."
    cp Gemfile.lock Gemfile.lock.backup
fi

# 重新生成Gemfile.lock
echo "🔄 重新生成Gemfile.lock..."
bundle install

# 添加平台支持
echo "🌍 添加多平台支持..."
bundle lock --add-platform x86_64-linux
bundle lock --add-platform x86_64-darwin
bundle lock --add-platform arm64-darwin

echo ""
echo "✅ 修复完成！"
echo ""
echo "📊 验证修复结果："

# 检查zeitwerk版本
if grep -q "zeitwerk" Gemfile.lock; then
    echo "🔍 zeitwerk版本："
    grep "zeitwerk" Gemfile.lock
fi

# 检查平台支持
echo "🌍 支持的平台："
grep -A 5 "PLATFORMS" Gemfile.lock

echo ""
echo "🚀 现在可以推送到GitHub进行部署测试！"

# 提供GitHub Actions状态检查建议
echo ""
echo "💡 部署建议："
echo "1. 推送代码到GitHub"
echo "2. 查看Actions页面的构建日志"
echo "3. 如果仍有问题，检查Ruby版本是否为3.2+"
