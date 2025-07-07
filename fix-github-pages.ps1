# GitHub Pages 跨平台部署修复脚本 (PowerShell)

Write-Host "🔧 GitHub Pages 跨平台部署修复" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 检查Ruby版本
Write-Host "📋 检查Ruby版本..." -ForegroundColor Yellow
ruby --version

# 检查Bundler版本  
Write-Host "📋 检查Bundler版本..." -ForegroundColor Yellow
bundle --version

# 清理现有依赖
Write-Host "🧹 清理现有依赖..." -ForegroundColor Yellow
if (Test-Path "Gemfile.lock") { Remove-Item "Gemfile.lock" -Force }
if (Test-Path ".bundle") { Remove-Item ".bundle" -Recurse -Force }
if (Test-Path "vendor") { Remove-Item "vendor" -Recurse -Force }

# 配置Bundler
Write-Host "⚙️ 配置Bundler..." -ForegroundColor Yellow
bundle config set --local deployment false
bundle config set --local path vendor/bundle

# 安装依赖
Write-Host "📦 安装依赖..." -ForegroundColor Yellow
bundle install --jobs 4 --retry 3

# 检查安装结果
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 依赖安装成功！" -ForegroundColor Green
    
    # 检查平台支持
    Write-Host "🔍 检查平台支持..." -ForegroundColor Yellow
    bundle platform
    
    # 构建网站
    Write-Host "🏗️ 构建Jekyll网站..." -ForegroundColor Yellow
    bundle exec jekyll build
    
    # 检查构建结果
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 构建成功！" -ForegroundColor Green
        Write-Host "🚀 启动本地服务器..." -ForegroundColor Cyan
        Write-Host "访问: http://localhost:4000" -ForegroundColor Cyan
        bundle exec jekyll serve --host 0.0.0.0 --port 4000
    } else {
        Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ 依赖安装失败，请检查错误信息" -ForegroundColor Red
    exit 1
}
