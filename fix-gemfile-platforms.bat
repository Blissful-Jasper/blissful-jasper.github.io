@echo off
REM GitHub Pages 部署修复脚本 (Windows)
REM 解决 Gemfile.lock 平台兼容性问题

echo 🔧 修复 GitHub Pages 部署平台兼容性问题...

REM 检查是否在正确的目录中
if not exist "Gemfile" (
    echo ❌ 错误：未找到 Gemfile 文件
    echo 请确保在 Jekyll 项目根目录运行此脚本
    pause
    exit /b 1
)

echo 📦 添加多平台支持到 Gemfile.lock...

REM 添加 Linux 平台支持
bundle lock --add-platform x86_64-linux

REM 添加 macOS 平台支持  
bundle lock --add-platform x86_64-darwin

REM 如果存在其他平台，也添加支持
bundle lock --add-platform arm64-darwin

echo ✅ 平台兼容性修复完成！

echo.
echo 🔍 当前支持的平台：
findstr /A "PLATFORMS" Gemfile.lock
findstr /A "x64-mingw-ucrt" Gemfile.lock
findstr /A "x86_64-linux" Gemfile.lock
findstr /A "x86_64-darwin" Gemfile.lock

echo.
echo 🚀 现在可以尝试重新部署到 GitHub Pages
echo 💡 如果问题依然存在，请检查 .github/workflows/ 中的部署配置

pause
