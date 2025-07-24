// 博客文章动态加载脚本
class BlogPostLoader {
    constructor() {
        this.blogData = null;
        this.currentPost = null;
        this.init();
    }

    async init() {
        await this.loadBlogData();
        this.setupEventListeners();
        this.loadCurrentPost();
    }

    async loadBlogData() {
        try {
            // 这里应该从Jekyll数据中获取，但为了简化，我们使用静态数据
            this.blogData = [
                {
                    title: "Welcome to My Academic Website!",
                    date: "2025-06-29",
                    summary: "欢迎来到我的学术网站！",
                    file: "2025-06-29-welcome.md",
                    tags: ["welcome", "introduction", "academic"],
                    category: "academic"
                },
                {
                    title: "深度学习在气象预报中的应用",
                    date: "2025-07-01",
                    summary: "探讨深度学习技术在气象预报领域的应用与发展",
                    file: "2025-07-01-deep-learning-weather-forecast.md",
                    tags: ["深度学习", "气象预报", "机器学习", "科研"],
                    category: "research"
                }
            ];
        } catch (error) {
            console.error('Failed to load blog data:', error);
        }
    }

    setupEventListeners() {
        // 设置文章操作按钮事件
        const likeBtn = document.getElementById('like-btn');
        const shareBtn = document.getElementById('share-btn');
        const bookmarkBtn = document.getElementById('bookmark-btn');

        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.sharePost());
        }

        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
        }
    }

    async loadCurrentPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postFile = urlParams.get('file');

        if (!postFile) {
            this.showError('文章未找到', '请检查链接是否正确');
            return;
        }

        // 查找文章信息
        this.currentPost = this.blogData.find(post => post.file === postFile);
        
        if (!this.currentPost) {
            this.showError('文章信息未找到', '无法找到对应的文章信息');
            return;
        }

        // 更新页面信息
        this.updatePostInfo();
        
        // 加载文章内容
        await this.loadPostContent(postFile);
        
        // 设置导航
        this.setupNavigation();
    }

    updatePostInfo() {
        const elements = {
            title: document.getElementById('post-title'),
            breadcrumb: document.getElementById('current-post-title'),
            date: document.getElementById('post-date'),
            category: document.getElementById('post-category'),
            tags: document.getElementById('post-tags')
        };

        if (elements.title) elements.title.textContent = this.currentPost.title;
        if (elements.breadcrumb) elements.breadcrumb.textContent = this.currentPost.title;
        if (elements.date) elements.date.textContent = this.formatDate(this.currentPost.date);
        if (elements.category) elements.category.textContent = this.currentPost.category;

        // 更新标签
        if (elements.tags && this.currentPost.tags) {
            elements.tags.innerHTML = '';
            this.currentPost.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                elements.tags.appendChild(tagElement);
            });
        }
    }

    async loadPostContent(postFile) {
        try {
            const response = await fetch(`/_posts/${postFile}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let content = await response.text();
            
            // 移除YAML front matter
            content = content.replace(/^---[\s\S]*?---\n/, '');
            
            // 简单的Markdown转HTML处理
            const htmlContent = this.parseMarkdown(content);
            
            const contentElement = document.getElementById('post-content');
            if (contentElement) {
                contentElement.innerHTML = htmlContent;
            }
        } catch (error) {
            console.error('Failed to load post content:', error);
            this.showError('内容加载失败', '无法加载文章内容，请稍后重试');
        }
    }

    parseMarkdown(content) {
        // 简单的Markdown解析
        return content
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\- (.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|u|o])/gm, '<p>')
            .replace(/(?<![>])\n(?!<)/g, '</p><p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>)/g, '$1')
            .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
            .replace(/<p>(<[u|o]l>)/g, '$1')
            .replace(/(<\/[u|o]l>)<\/p>/g, '$1');
    }

    setupNavigation() {
        const currentIndex = this.blogData.findIndex(post => post.file === this.currentPost.file);
        
        // 上一篇
        if (currentIndex > 0) {
            const prevPost = this.blogData[currentIndex - 1];
            this.setupNavItem('prev-post', prevPost, '上一篇');
        }
        
        // 下一篇
        if (currentIndex < this.blogData.length - 1) {
            const nextPost = this.blogData[currentIndex + 1];
            this.setupNavItem('next-post', nextPost, '下一篇');
        }
    }

    setupNavItem(elementId, post, label) {
        const element = document.getElementById(elementId);
        if (element) {
            const link = element.querySelector('.nav-link');
            const title = element.querySelector('.nav-title');
            
            if (link) link.href = `blog-post-dynamic.html?file=${post.file}`;
            if (title) title.textContent = post.title;
            
            element.style.display = 'block';
        }
    }

    showError(title, message) {
        const contentElement = document.getElementById('post-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <a href="/blog.html" class="btn btn-primary">返回博客首页</a>
                </div>
            `;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    toggleLike() {
        const likeBtn = document.getElementById('like-btn');
        if (likeBtn) {
            likeBtn.classList.toggle('liked');
            const icon = likeBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        }
    }

    sharePost() {
        const title = this.currentPost ? this.currentPost.title : document.title;
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(url).then(() => {
                alert('链接已复制到剪贴板！');
            }).catch(err => {
                console.error('无法复制链接:', err);
                // 提供手动复制的选项
                prompt('请复制以下链接:', url);
            });
        }
    }

    toggleBookmark() {
        const bookmarkBtn = document.getElementById('bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.classList.toggle('bookmarked');
            const icon = bookmarkBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BlogPostLoader();
});
