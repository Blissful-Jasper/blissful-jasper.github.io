source "https://rubygems.org"

# GitHub Pages 兼容版本
gem "github-pages", group: :jekyll_plugins

# 添加缺失的依赖
gem "faraday-retry"

# Ruby 3.0+ 兼容性
gem "csv"
gem "base64"
gem "bigdecimal"

# 跨平台支持
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Windows 开发环境
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# HTTP 服务器
gem "webrick", "~> 1.9"
