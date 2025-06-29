# =============================================================================
# 📄 scripts/setup.sh - 快速设置脚本
# =============================================================================
#!/bin/bash

echo "🎓 Academic Jekyll Website Setup"
echo "================================="

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "❌ Ruby is not installed. Please install Ruby first."
    exit 1
fi

# Check if Bundle is installed
if ! command -v bundle &> /dev/null; then
    echo "📦 Installing Bundler..."
    gem install bundler
fi

# Install dependencies
echo "📚 Installing Jekyll and dependencies..."
bundle install

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p assets/{img,papers,slides,teaching}
mkdir -p _posts
mkdir -p _drafts

# Set permissions
chmod +x scripts/*.sh

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Academic Jekyll website"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit _config.yml with your information"
echo "2. Add your profile photo to assets/img/profile.jpg"
echo "3. Update data files in _data/ folder"
echo "4. Run 'bundle exec jekyll serve' to start development server"
echo ""
echo "🚀 Happy building!"
