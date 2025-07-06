# Personal Academic Website

This is a personal academic website built with Jekyll. It is designed to be a clean, professional, and easily maintainable platform for showcasing research, publications, and other academic activities.

## Project Structure

The project follows a standard Jekyll structure, with some customizations for better organization and maintainability.

```
.
├── _data/              # Data files for navigation, publications, etc.
├── _deployment/        # Deployment-related files (Dockerfile, etc.)
├── _includes/          # HTML partials for different sections
├── _layouts/           # Page layouts (default, page, post)
├── _pages/             # Main content pages (About, Research, etc.)
├── _posts/             # Blog posts
├── _sass/              # Sass partials for styling
├── _site/              # Generated site (do not edit manually)
├── assets/             # Static assets (CSS, JS, images)
├── docs/               # Documentation and logs
│   └── logs/           # Development logs and reports
├── scripts/            # Utility scripts
├── .gitignore          # Files and directories to ignore
├── _config.yml         # Main Jekyll configuration
├── _config_secure.yml  # Secure configuration for API keys (ignored by Git)
├── Gemfile             # Ruby dependencies
├── index.html          # Main entry point of the site
└── README.md           # This file
```

### Directory Descriptions

*   **`_data`**: Contains YAML files with structured data used throughout the site, such as navigation links (`navigation.yml`), publication lists (`publications.yml`), and contact information (`contact.yml`). This allows for easy updates without touching the HTML code.

*   **`_deployment`**: Holds all files related to deploying the website. This includes the `Dockerfile` and `docker-compose.yml` for building and running the site in a container, and `netlify.toml` for configuring deployments on Netlify.

*   **`_includes`**: Contains reusable HTML snippets that are included in layouts and pages. This helps to keep the code DRY (Don't Repeat Yourself) and makes it easier to manage common elements like the header, footer, and different sections of the homepage.

*   **`_layouts`**: Defines the basic HTML structure for different types of pages. For example, `default.html` provides the main template, while `page.html` and `post.html` build upon it for specific content types.

*   **`_pages`**: A custom collection for the main content pages of the site, such as "About", "Research", and "Publications". Using a collection allows for better organization and makes it easy to loop through these pages programmatically.

*   **`_posts`**: Contains blog posts, with each post in its own Markdown file. The filename format must be `YYYY-MM-DD-title.md`.

*   **`_sass`**: Holds the Sass partials that are compiled into the main stylesheet. This allows for a modular and organized approach to writing CSS.

*   **`assets`**: Stores all static assets, including compiled CSS, JavaScript files, images, and other resources.

*   **`docs/logs`**: A place for all development-related documentation, logs, and reports. This helps to keep the root directory clean and provides a historical record of the project's development.

*   **`scripts`**: Contains utility scripts for tasks such as generating blog indexes or converting Markdown to HTML.

### Configuration Files

*   **`_config.yml`**: The main configuration file for the Jekyll site. It contains settings for the site title, theme, plugins, and custom variables like the `page_sections` for controlling the visibility of different sections on the homepage.

*   **`_config_secure.yml`**: A special configuration file for storing sensitive information, such as API keys. This file is included in `.gitignore` to prevent it from being committed to the repository. When running the site locally, Jekyll will automatically load this file. For deployment, these settings should be configured as environment variables.

## Usage

To run the site locally, you need to have Ruby and Jekyll installed. Then, you can run the following command in the root directory of the project:

```bash
bundle exec jekyll serve --livereload
```

This will start a local server at `http://localhost:4000`, and the `--livereload` option will automatically refresh the page when you make changes to the files.

## ✨ 核心特色

### 🎯 **智能期刊追踪系统**
- 📊 **实时RSS订阅** - 自动获取Nature、Science等顶级期刊最新文章
- 🔬 **地球科学专注** - 专门筛选地球科学、地球物理、气候科学等相关领域文章
- 🤖 **AI智能摘要** - 集成GPT-4自动生成中文摘要
- 🏷️ **智能分类** - 按期刊类型、研究领域自动分类展示
- 🎨 **卡片化设计** - 现代化卡片布局，图片封面展示

### 📱 **现代化设计**
- 🌐 **完全响应式** - 完美适配桌面、平板、手机
- 🎨 **Material Design** - 现代化视觉设计语言
- 🌙 **深色模式支持** - 护眼深色主题
- ⚡ **极速加载** - 优化性能，秒速加载
- ♿ **无障碍设计** - 支持屏幕阅读器等辅助功能

### 📚 **学术功能完整**
- 👨‍� **个人简介** - 展示教育背景、研究兴趣
- 🔬 **研究项目** - 详细展示研究项目和成果
- 📄 **发表论文** - 自动格式化的论文列表，支持DOI链接
- 📧 **联系方式** - 多种联系方式集成展示
- 🔍 **SEO优化** - 提升搜索引擎可见性

## 🖥️ 网站展示

### 期刊追踪系统界面
![期刊系统](docs/images/journals-demo.png)
*实时追踪地球科学顶级期刊，AI智能摘要*

### 响应式设计
![响应式](docs/images/responsive-demo.png)
*完美适配各种设备尺寸*

### 研究项目展示
![研究项目](docs/images/research-demo.png)
*优雅展示研究项目和成果*

## 🚀 快速开始

### 环境要求
- Ruby 2.7+ 
- Jekyll 4.0+
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Blissful-Jasper/blissful-jasper.github.io.git
   cd blissful-jasper.github.io
   ```

2. **安装依赖**
   ```bash
   # 安装Jekyll和Bundler
   gem install jekyll bundler
   
   # 安装项目依赖
   bundle install
   ```

3. **个性化配置**
   ```bash
   # 编辑网站配置
   nano _config.yml
   
   # 替换个人照片
   cp your-photo.jpg assets/profile.jpg
   ```

4. **本地预览**
   ```bash
   # 启动开发服务器
   bundle exec jekyll serve --livereload
   
   # 访问 http://localhost:4000
   ```

5. **部署上线**
   ```bash
   # GitHub Pages部署
   git add .
   git commit -m "Initial setup"
   git push origin main
   
   # 在GitHub仓库设置中启用Pages
   ```

## ⚙️ 配置指南

### 基本配置

编辑 `_config.yml` 文件：

```yaml
# 网站基本信息
title: "您的姓名"
description: "地球科学研究者"
url: "https://yourusername.github.io"

# 个人信息
author:
  name: "您的姓名"
  email: "your.email@university.edu"
  university: "您的大学"
  department: "地球科学系"
```

### 期刊配置

编辑 `_data/journals.yml` 添加或修改期刊：

```yaml
journals:
  - name: "Nature Geoscience"
    fullname: "Nature Geoscience"
    description: "Earth and planetary sciences"
    rss_url: "https://www.nature.com/ngeo.rss"
    homepage: "https://www.nature.com/ngeo/"
    impact_factor: 18.3
    category: "geoscience"
    color: "#8d6e63"
    icon: "fas fa-mountain"
    geoscience_relevance: "core"
```

### 研究项目配置

编辑 `_data/research.yml` 添加研究项目：

```yaml
research:
  - title: "气候变化对海洋环流的影响"
    description: "研究全球变暖背景下海洋环流的变化规律"
    status: "进行中"
    funding: "国家自然科学基金"
    keywords: ["气候变化", "海洋环流", "数值模拟"]
```

### 发表论文配置

编辑 `_data/publications.yml` 添加论文：

```yaml
publications:
  - title: "Ocean circulation changes under global warming"
    authors: "您的姓名, 合作者"
    journal: "Nature Geoscience"
    year: 2024
    doi: "10.1038/s41561-024-xxxxx"
    type: "期刊论文"
```

## 🔧 高级功能

### AI摘要配置

在 `_data/journals.yml` 中配置AI服务：

```yaml
ai_summary:
  enabled: true
  provider: "openai"  # openai, claude, gemini
  model: "gpt-4"
  max_length: 300
  language: "zh-CN"
  focus: "geoscience"
```

### 自定义样式

修改 `assets/custom.scss` 文件：

```scss
// 自定义颜色
:root {
  --primary-color: #your-color;
  --secondary-color: #your-secondary-color;
}

// 自定义字体
body {
  font-family: 'Your-Preferred-Font', sans-serif;
}
```

### 添加新页面

1. 在根目录创建 `new-page.md`
2. 添加页面配置：
   ```yaml
   ---
   layout: page
   title: "新页面"
   permalink: /new-page/
   ---
   
   ## 页面内容
   ```

### 自定义期刊源

1. 在 `_data/journals.yml` 中添加新期刊
2. 确保RSS链接有效
3. 设置合适的分类和颜色
4. 重启Jekyll服务器

## 🎨 自定义主题

### 颜色主题

编辑 `assets/modern-theme.css`：

```css
:root {
  /* 主色调 */
  --primary-color: #2c5aa0;
  --secondary-color: #1976d2;
  
  /* 地球科学主题色 */
  --earth-blue: #1e88e5;
  --earth-green: #43a047;
  --earth-brown: #6d4c41;
}
```

### 字体配置

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
  font-family: 'Roboto', 'Source Han Sans', sans-serif;
}
```

## 📊 期刊系统说明

### 支持的期刊
- **综合性期刊**: Nature, Science
- **地球科学**: Nature Geoscience, Earth and Planetary Science Letters
- **地球物理**: Geophysical Research Letters, Reviews of Geophysics
- **气候科学**: Nature Climate Change, Journal of Climate
- **地质学**: Geology
- **环境科学**: Environmental Research Letters

### 技术特性
- ✅ RSS实时订阅
- ✅ CORS代理解决跨域问题
- ✅ 智能缓存机制
- ✅ 错误恢复和降级
- ✅ 命名空间XML标签支持
- ✅ 响应式卡片布局
- ✅ 分类筛选
- ✅ 搜索功能

## 🔧 故障排除

### 常见问题

**Q: Jekyll服务器无法启动**
```bash
# 检查Ruby版本
ruby --version

# 重新安装依赖
bundle install

# 清理缓存
bundle exec jekyll clean
```

**Q: 期刊无法加载**
```bash
# 检查网络连接
# 确认RSS链接有效
# 查看浏览器控制台错误信息
```

**Q: 样式显示异常**
```bash
# 清除浏览器缓存
# 检查CSS文件路径
# 重新构建网站
bundle exec jekyll build
```

### 调试模式

启用调试日志：
```javascript
// 在浏览器控制台执行
window.rssParser.debug = true;
```

## 📝 更新日志

### v2.0.0 (2025-07-02)
- ✨ 新增智能期刊追踪系统
- 🤖 集成AI文章摘要功能  
- 🌍 专注地球科学领域
- 🎨 全新现代化UI设计
- 📱 完善响应式布局
- 🔧 修复RSS命名空间解析问题

### v1.0.0
- 🎉 初始版本发布
- 📚 基础学术页面功能
- 📄 论文管理系统
- 📧 联系方式展示

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 提交Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Jekyll](https://jekyllrb.com/) - 静态网站生成器
- [Bootstrap](https://getbootstrap.com/) - CSS框架
- [Font Awesome](https://fontawesome.com/) - 图标库
- [AllOrigins](https://allorigins.win/) - CORS代理服务

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 Email: your.email@university.edu
- 🐛 Issues: [GitHub Issues](https://github.com/Blissful-Jasper/blissful-jasper.github.io/issues)
- 💬 讨论: [GitHub Discussions](https://github.com/Blissful-Jasper/blissful-jasper.github.io/discussions)

---

⭐ 如果这个项目对您有帮助，请给个Star支持！

## Customization

### Personal Information
Edit `_config.yml` to update:
- Your name and title
- Contact information
- Social media links
- Site configuration


### Styling
- Modify colors and fonts in `assets/main.scss`

## File Structure

```
academic-website/
├── _config.yml          # Site configuration
├── Gemfile             # Ruby dependencies
├── index.html          # Homepage
├── about.markdown      # About page
├── research.markdown   # Research page
├── publications.markdown # Publications page
├── teaching.markdown   # Teaching page
├── contact.markdown    # Contact page
├── _layouts/           # Page templates
├── _includes/          # Reusable components
├── _posts/            # Blog posts
├── _sass/             # Custom stylesheets
└── assets/            # Images, CSS, JS
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have questions or need help:
- Open an issue on GitHub
- Check the Jekyll documentation
- Contact the maintainer

---

**Happy Academic Website Building! 🎓**
