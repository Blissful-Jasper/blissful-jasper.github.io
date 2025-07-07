#!/bin/bash

# Jekyll Blog Template Setup Script
# 快速设置脚本

echo "🚀 Simple Jekyll Blog Template Setup"
echo "====================================="

# 检查Ruby是否安装
if ! command -v ruby &> /dev/null; then
    echo "❌ Ruby is not installed. Please install Ruby first."
    echo "Visit: https://www.ruby-lang.org/en/downloads/"
    exit 1
fi

# 检查Bundler是否安装
if ! command -v bundle &> /dev/null; then
    echo "📦 Installing Bundler..."
    gem install bundler
fi

# 安装依赖
echo "📦 Installing dependencies..."
bundle install

# 检查是否成功安装
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Edit _config.yml to customize your site"
    echo "2. Add your posts to _posts/ directory"
    echo "3. Run: bundle exec jekyll serve"
    echo "4. Open: http://localhost:4000"
    echo ""
    echo "📚 Documentation: See README.md for detailed instructions"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi
