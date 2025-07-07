@echo off
REM Ruby版本兼容性修复脚本 (Windows)

echo 🔧 修复Ruby版本兼容性问题...

REM 检查当前Ruby版本
echo 📋 当前Ruby版本：
ruby --version

echo.
echo 🎯 解决zeitwerk版本兼容性问题...

REM 方案1：更新Gemfile.lock以支持Ruby 3.2+
echo 📦 更新依赖锁定文件...

REM 备份现有Gemfile.lock（如果存在版本冲突）
if exist "Gemfile.lock" (
    echo ⚠️  备份现有Gemfile.lock...
    copy Gemfile.lock Gemfile.lock.backup
)

REM 重新生成Gemfile.lock
echo 🔄 重新生成Gemfile.lock...
bundle install

REM 添加平台支持
echo 🌍 添加多平台支持...
bundle lock --add-platform x86_64-linux
bundle lock --add-platform x86_64-darwin
bundle lock --add-platform arm64-darwin

echo.
echo ✅ 修复完成！
echo.
echo 📊 验证修复结果：

REM 检查zeitwerk版本
findstr "zeitwerk" Gemfile.lock >nul 2>&1
if %errorlevel%==0 (
    echo 🔍 zeitwerk版本：
    findstr "zeitwerk" Gemfile.lock
)

REM 检查平台支持
echo 🌍 支持的平台：
findstr /A "PLATFORMS" Gemfile.lock
findstr /A "x64-mingw-ucrt" Gemfile.lock
findstr /A "x86_64-linux" Gemfile.lock
findstr /A "x86_64-darwin" Gemfile.lock

echo.
echo 🚀 现在可以推送到GitHub进行部署测试！

REM 提供GitHub Actions状态检查建议
echo.
echo 💡 部署建议：
echo 1. 推送代码到GitHub
echo 2. 查看Actions页面的构建日志
echo 3. 如果仍有问题，检查Ruby版本是否为3.2+

pause
