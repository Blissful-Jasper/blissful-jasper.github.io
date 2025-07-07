@echo off
echo ======================================
echo Jekyll 图库调试服务器启动脚本
echo ======================================

cd /d "o:\blissful-jasper.github.io-main\blissful-jasper.github.io"

echo 检查当前目录...
echo %CD%

echo.
echo 检查 Gemfile 是否存在...
if exist Gemfile (
    echo ✅ Gemfile 存在
) else (
    echo ❌ Gemfile 不存在
    pause
    exit /b 1
)

echo.
echo 检查 pictures 目录...
if exist pictures (
    echo ✅ pictures 目录存在
    dir pictures
) else (
    echo ❌ pictures 目录不存在
    pause
    exit /b 1
)

echo.
echo 检查 _data/gallery.yml...
if exist _data\gallery.yml (
    echo ✅ gallery.yml 存在
) else (
    echo ❌ gallery.yml 不存在
    pause
    exit /b 1
)

echo.
echo 清理之前的构建...
if exist _site (
    rmdir /s /q _site
    echo ✅ 清理了 _site 目录
)

echo.
echo 开始 Jekyll 构建...
bundle exec jekyll build --verbose

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Jekyll 构建失败
    pause
    exit /b 1
)

echo.
echo ✅ Jekyll 构建成功！

echo.
echo 检查构建后的文件...
if exist _site\pictures (
    echo ✅ _site/pictures 目录存在
    dir _site\pictures
) else (
    echo ❌ _site/pictures 目录不存在
)

echo.
echo 启动Jekyll服务器...
echo 服务器将在 http://127.0.0.1:4000 启动
echo 按 Ctrl+C 停止服务器

bundle exec jekyll serve --host 127.0.0.1 --port 4000 --livereload --verbose

pause
