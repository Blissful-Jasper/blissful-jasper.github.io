# =============================================================================
# 📄 INSTALLATION.md - 详细安装说明
# =============================================================================

# Installation Guide

This guide will help you set up your academic Jekyll website from scratch.

## Prerequisites

### Required Software

1. **Ruby** (version 2.7 or higher)
   - macOS: `brew install ruby`
   - Ubuntu: `sudo apt-get install ruby-full`
   - Windows: [RubyInstaller](https://rubyinstaller.org/)

2. **Git**
   - macOS: `brew install git`
   - Ubuntu: `sudo apt-get install git`
   - Windows: [Git for Windows](https://gitforwindows.org/)

3. **Node.js** (optional, for additional tools)
   - Download from [nodejs.org](https://nodejs.org/)

## Installation Steps

### 1. Download the Template

```bash
# Clone the repository
git clone https://github.com/yourusername/academic-website.git
cd academic-website

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
# Install Ruby gems
gem install bundler
bundle install

# Optional: Install Node.js packages
npm install
```

### 3. Configuration

1. **Edit `_config.yml`**
   - Update your personal information
   - Change site title and description
   - Add your social media links

2. **Add Your Photo**
   - Replace `assets/img/profile.jpg` with your photo
   - Recommended size: 400x400 pixels

3. **Update Data Files**
   - `_data/publications.yml` - Your publications
   - `_data/projects.yml` - Research projects
   - `_data/teaching.yml` - Courses and teaching info
   - `_data/news.yml` - News and updates

### 4. Customize Content

1. **Update Pages**
   - `about.markdown` - Your biography
   - `research.markdown` - Research interests
   - `contact.markdown` - Contact information

2. **Add Publications**
   - Add PDF files to `assets/papers/`
   - Update publication data in `_data/publications.yml`

3. **Add Course Materials**
   - Add syllabi to `assets/teaching/`
   - Update course data in `_data/teaching.yml`

### 5. Test Locally

```bash
# Start development server
bundle exec jekyll serve

# With live reload (recommended)
bundle exec jekyll serve --livereload

# Visit http://localhost:4000
```

### 6. Deploy Your Site

#### GitHub Pages (Free)

1. Create a GitHub repository
2. Push your code to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://username.github.io/repository-name`

#### Netlify (Free with custom domain)

1. Connect your GitHub repository to Netlify
2. Set build command: `bundle exec jekyll build`
3. Set publish directory: `_site`
4. Deploy automatically on git push

#### Custom Server

```bash
# Build the site
bundle exec jekyll build

# Upload _site folder to your web server
rsync -avz _site/ user@yourserver.com:/path/to/website/
```

## Troubleshooting

### Common Issues

1. **Ruby Version Issues**
   ```bash
   # Check Ruby version
   ruby --version
   
   # Use rbenv to manage Ruby versions
   rbenv install 3.0.0
   rbenv global 3.0.0
   ```

2. **Bundle Install Fails**
   ```bash
   # Update RubyGems
   gem update --system
   
   # Clear gem cache
   gem cleanup
   ```

3. **Jekyll Serve Fails**
   ```bash
   # Try with bundle exec
   bundle exec jekyll serve
   
   # Check for port conflicts
   bundle exec jekyll serve --port 4001
   ```

4. **Permission Errors (macOS/Linux)**
   ```bash
   # Use local gem installation
   bundle config set --local path vendor/bundle
   bundle install
   ```

### Getting Help

- Check the [Jekyll documentation](https://jekyllrb.com/docs/)
- Search [Jekyll GitHub Issues](https://github.com/jekyll/jekyll/issues)
- Ask questions on [Jekyll Talk](https://talk.jekyllrb.com/)

## Advanced Configuration

### Custom Domain

1. Add `CNAME` file to root directory with your domain
2. Configure DNS records with your domain provider
3. Enable HTTPS in your hosting platform settings

### Analytics

Add Google Analytics to `_config.yml`:
```yaml
google_analytics: UA-XXXXXXXXX-X
```

### SEO Optimization

The template includes SEO optimization out of the box:
- Meta tags for social sharing
- Schema.org markup
- Sitemap generation
- Proper heading structure

### Performance Optimization

- Images are optimized for web
- CSS is minified in production
- Gzip compression enabled
- Browser caching configured

---

**Need more help?** Open an issue on GitHub or contact the maintainer!
