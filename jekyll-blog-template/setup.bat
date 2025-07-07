@echo off
echo 🚀 Simple Jekyll Blog Template Setup
echo =====================================

:: 检查Ruby是否安装
ruby -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Ruby is not installed. Please install Ruby first.
    echo Visit: https://www.ruby-lang.org/en/downloads/
    pause
    exit /b 1
)

:: 检查Bundler是否安装
bundle -v >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Bundler...
    gem install bundler
)

:: 安装依赖
echo 📦 Installing dependencies...
bundle install

if errorlevel 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🎯 Next steps:
    echo 1. Edit _config.yml to customize your site
    echo 2. Add your posts to _posts/ directory
    echo 3. Run: bundle exec jekyll serve
    echo 4. Open: http://localhost:4000
    echo.
    echo 📚 Documentation: See README.md for detailed instructions
) else (
    echo ❌ Failed to install dependencies. Please check the error messages above.
    pause
    exit /b 1
)

pause
