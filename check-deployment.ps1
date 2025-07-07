# GitHub Pages Deployment Verification Script

Write-Host "=== GitHub Pages Deployment Check ===" -ForegroundColor Cyan
Write-Host ""

# Check workflow files
Write-Host "1. Checking GitHub Actions workflow files..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy-main.yml") {
    Write-Host "   ✓ Main deployment workflow (deploy-main.yml) exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ Main deployment workflow (deploy-main.yml) missing" -ForegroundColor Red
}

if (Test-Path ".github/workflows/pages.yml") {
    Write-Host "   ✓ Pages workflow (pages.yml) exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ Pages workflow (pages.yml) missing" -ForegroundColor Red
}

Write-Host ""

# Check Jekyll config
Write-Host "2. Checking Jekyll configuration..." -ForegroundColor Yellow
if (Test-Path "_config.yml") {
    Write-Host "   ✓ Jekyll config file exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ Jekyll config file missing" -ForegroundColor Red
}

Write-Host ""

# Check Gemfile
Write-Host "3. Checking Gemfile..." -ForegroundColor Yellow
if (Test-Path "Gemfile") {
    Write-Host "   ✓ Gemfile exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ Gemfile missing" -ForegroundColor Red
}

Write-Host ""

# Instructions
Write-Host "4. GitHub Repository Settings:" -ForegroundColor Yellow
Write-Host "   • Visit: https://github.com/Blissful-Jasper/blissful-jasper.github.io/settings/pages" -ForegroundColor White
Write-Host "   • Source: Select 'GitHub Actions'" -ForegroundColor White
Write-Host "   • Do NOT select 'Deploy from a branch'" -ForegroundColor White

Write-Host ""

Write-Host "5. Deployment Steps:" -ForegroundColor Yellow
Write-Host "   • Commit changes: git add . && git commit -m 'Fix GitHub Pages deployment'" -ForegroundColor White
Write-Host "   • Push to main: git push origin main" -ForegroundColor White
Write-Host "   • Check Actions: https://github.com/Blissful-Jasper/blissful-jasper.github.io/actions" -ForegroundColor White

Write-Host ""
Write-Host "=== Check Complete ===" -ForegroundColor Cyan
