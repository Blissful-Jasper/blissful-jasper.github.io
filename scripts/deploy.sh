# =============================================================================
# 📄 scripts/deploy.sh - 部署脚本
# =============================================================================
#!/bin/bash

echo "🚀 Deploying Academic Website"
echo "============================="

# Build the site
echo "🔨 Building Jekyll site..."
bundle exec jekyll build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy based on argument
case "$1" in
    "github")
        echo "📤 Deploying to GitHub Pages..."
        git add .
        git commit -m "Update site content"
        git push origin main
        ;;
    "netlify")
        echo "📤 Deploying to Netlify..."
        # Netlify will automatically deploy from git
        git add .
        git commit -m "Update site content"
        git push origin main
        ;;
    "ftp")
        echo "📤 Deploying via FTP..."
        # Replace with your FTP details
        rsync -avz --delete _site/ user@yourserver.com:/path/to/website/
        ;;
    *)
        echo "Usage: $0 {github|netlify|ftp}"
        echo "Please specify deployment target"
        exit 1
        ;;
esac

echo "🎉 Deployment complete!"
