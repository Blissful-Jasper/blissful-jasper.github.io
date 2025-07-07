# =============================================================================
# 🔧 minify-site.ps1 - Windows PowerShell 版本的网站压缩脚本
# =============================================================================

Write-Host "🚀 开始压缩网站文件..." -ForegroundColor Green

# 压缩 HTML 文件
Write-Host "📄 压缩 HTML 文件..." -ForegroundColor Yellow
Get-ChildItem -Path "./_site" -Filter "*.html" -Recurse | ForEach-Object {
    & npx html-minifier $_.FullName --remove-comments --collapse-whitespace --output $_.FullName
}

# 压缩 CSS 文件
Write-Host "🎨 压缩 CSS 文件..." -ForegroundColor Yellow
Get-ChildItem -Path "./_site" -Filter "*.css" -Recurse | ForEach-Object {
    & npx cleancss $_.FullName -o $_.FullName
}

# 压缩 JS 文件
Write-Host "⚡ 压缩 JavaScript 文件..." -ForegroundColor Yellow
Get-ChildItem -Path "./_site" -Filter "*.js" -Recurse | ForEach-Object {
    & npx uglifyjs $_.FullName -c -m -o $_.FullName
}

Write-Host "✅ 网站文件压缩完成！" -ForegroundColor Green
