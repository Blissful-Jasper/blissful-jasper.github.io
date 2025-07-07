# GitHub Pages 部署配置验证脚本 (PowerShell)

Write-Host "=== GitHub Pages 部署配置验证 ===" -ForegroundColor Cyan
Write-Host ""

# 检查工作流文件
Write-Host "1. 检查 GitHub Actions 工作流文件..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy-main.yml") {
    Write-Host "✅ 主部署工作流 (deploy-main.yml) 存在" -ForegroundColor Green
} else {
    Write-Host "❌ 主部署工作流 (deploy-main.yml) 不存在" -ForegroundColor Red
}

if (Test-Path ".github/workflows/pages.yml") {
    Write-Host "✅ Pages 工作流 (pages.yml) 存在" -ForegroundColor Green
} else {
    Write-Host "❌ Pages 工作流 (pages.yml) 不存在" -ForegroundColor Red
}

Write-Host ""

# 检查 Jekyll 配置
Write-Host "2. 检查 Jekyll 配置..." -ForegroundColor Yellow
if (Test-Path "_config.yml") {
    Write-Host "✅ Jekyll 配置文件存在" -ForegroundColor Green
    $configContent = Get-Content "_config.yml" -Raw
    if ($configContent -match "baseurl") {
        Write-Host "✅ baseurl 配置已设置" -ForegroundColor Green
    } else {
        Write-Host "警告: 建议检查 baseurl 配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Jekyll 配置文件不存在" -ForegroundColor Red
}

Write-Host ""

# 检查 Gemfile
Write-Host "3. 检查 Gemfile..." -ForegroundColor Yellow
if (Test-Path "Gemfile") {
    Write-Host "✅ Gemfile 存在" -ForegroundColor Green
    $gemfileContent = Get-Content "Gemfile" -Raw
    if ($gemfileContent -match "github-pages") {
        Write-Host "✅ GitHub Pages gem 已配置" -ForegroundColor Green
    } else {
        Write-Host "警告: 建议添加 github-pages gem" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Gemfile 不存在" -ForegroundColor Red
}

Write-Host ""

# 提供设置说明
Write-Host "4. GitHub 仓库设置说明：" -ForegroundColor Yellow
Write-Host "   • 访问: https://github.com/Blissful-Jasper/blissful-jasper.github.io/settings/pages" -ForegroundColor White
Write-Host "   • Source: 选择 'GitHub Actions'" -ForegroundColor White
Write-Host "   • 不要选择 'Deploy from a branch'" -ForegroundColor White

Write-Host ""

Write-Host "5. 部署步骤：" -ForegroundColor Yellow
Write-Host "   • 提交所有更改: git add . && git commit -m 'Fix GitHub Pages deployment'" -ForegroundColor White
Write-Host "   • 推送到主分支: git push origin main" -ForegroundColor White
Write-Host "   • 查看 Actions: https://github.com/Blissful-Jasper/blissful-jasper.github.io/actions" -ForegroundColor White

Write-Host ""

Write-Host "6. 可用的工作流：" -ForegroundColor Yellow
Write-Host "   • deploy-main.yml - 推荐使用的主要部署工作流" -ForegroundColor Green
Write-Host "   • pages.yml - GitHub官方Pages部署方法" -ForegroundColor Green
Write-Host "   • deploy.yml - 传统gh-pages方法（已修复权限）" -ForegroundColor Cyan
Write-Host "   • build-and-deploy.yml - 包含优化的部署方法" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== 验证完成 ===" -ForegroundColor Cyan

# 检查Git状态
Write-Host ""
Write-Host "7. Git 状态检查：" -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "警告: 有未提交的更改" -ForegroundColor Yellow
        Write-Host "   运行: git add . && git commit -m 'Fix deployment configuration'" -ForegroundColor White
    } else {
        Write-Host "✅ 工作目录干净" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ 无法检查Git状态，请确保在Git仓库中" -ForegroundColor Red
}
