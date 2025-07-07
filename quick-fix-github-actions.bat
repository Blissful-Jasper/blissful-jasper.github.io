@echo off
chcp 65001 >nul
echo 🔧 修复 GitHub Actions 部署问题...

REM 1. 备份现有 Gemfile.lock
if exist "Gemfile.lock" (
    copy Gemfile.lock Gemfile.lock.backup >nul
    echo ✅ 已备份 Gemfile.lock
)

REM 2. 临时添加 zeitwerk 版本约束到 Gemfile
echo.
echo 📝 检查是否需要添加 zeitwerk 版本约束...
findstr /C:"zeitwerk.*~.*2.6" Gemfile >nul 2>&1
if errorlevel 1 (
    echo.                                                        >> Gemfile
    echo # Temporary fix for GitHub Actions Ruby 3.1 compatibility >> Gemfile
    echo gem "zeitwerk", "~> 2.6.0"                             >> Gemfile
    echo ✅ 已添加 zeitwerk 版本约束
) else (
    echo ⚠️  zeitwerk 版本约束已存在
)

REM 3. 添加平台支持
echo.
echo 🌍 添加多平台支持...
bundle lock --add-platform x86_64-linux    >nul 2>&1
bundle lock --add-platform x86_64-darwin   >nul 2>&1
echo ✅ 已添加平台支持

REM 4. 更新依赖
echo.
echo 📦 更新依赖...
bundle update --conservative >nul 2>&1
if errorlevel 1 (
    echo ⚠️  bundle update 失败，尝试重新安装...
    del Gemfile.lock >nul 2>&1
    bundle install
)

REM 5. 验证安装
echo.
echo 🔍 验证安装...
bundle exec jekyll --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Jekyll 安装失败
    pause
    exit /b 1
) else (
    echo ✅ Jekyll 安装成功
)

echo.
echo 🎉 修复完成！
echo.
echo 下一步：
echo 1. 提交并推送代码到 GitHub
echo 2. 在 Actions 页面观察部署状态
echo 3. 如仍失败，可手动触发备用 workflow
echo.
echo 如果本地测试：
echo bundle exec jekyll serve
echo.
pause
