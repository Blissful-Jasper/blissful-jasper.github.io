@echo off
echo Starting Jekyll build and serve...
cd /d "o:\blissful-jasper.github.io-main\blissful-jasper.github.io"
bundle exec jekyll build --verbose
echo Build complete. Starting server...
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --livereload
pause
