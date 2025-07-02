// 阅读进度条功能
class ReadingProgress {
  constructor() {
    this.progressBar = null;
    this.progressPercentage = null;
    this.estimatedTime = null;
    this.init();
  }
  
  init() {
    if (this.isPostPage()) {
      this.createProgressBar();
      this.calculateReadingTime();
      this.bindScrollEvents();
      this.addNavigationButtons();
    }
  }
  
  isPostPage() {
    // 检查是否为博客文章页面
    return document.querySelector('.post-content, .blog-post-content, article') !== null;
  }
  
  createProgressBar() {
    // 创建进度条容器
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    progressContainer.innerHTML = `
      <div class="reading-progress-bar">
        <div class="reading-progress-fill"></div>
      </div>
      <div class="reading-progress-info">
        <span class="progress-percentage">0%</span>
        <span class="estimated-time"></span>
      </div>
    `;
    
    document.body.insertBefore(progressContainer, document.body.firstChild);
    
    this.progressBar = document.querySelector('.reading-progress-fill');
    this.progressPercentage = document.querySelector('.progress-percentage');
    this.estimatedTime = document.querySelector('.estimated-time');
  }
  
  calculateReadingTime() {
    const content = document.querySelector('.post-content, .blog-post-content, article');
    if (!content) return;
    
    const text = content.textContent || content.innerText || '';
    const wordCount = text.trim().split(/\s+/).length;
    const readingSpeed = 200; // 每分钟约200个中文字符或单词
    const totalMinutes = Math.ceil(wordCount / readingSpeed);
    
    this.estimatedTime.textContent = `预计阅读 ${totalMinutes} 分钟`;
  }
  
  bindScrollEvents() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  updateProgress() {
    const content = document.querySelector('.post-content, .blog-post-content, article');
    if (!content) return;
    
    const contentRect = content.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 计算阅读进度
    let progress = 0;
    if (documentHeight > 0) {
      progress = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
    }
    
    // 更新进度条
    this.progressBar.style.width = `${progress}%`;
    this.progressPercentage.textContent = `${Math.round(progress)}%`;
    
    // 显示/隐藏进度条
    const progressContainer = document.querySelector('.reading-progress-container');
    if (scrollTop > 100) {
      progressContainer.classList.add('visible');
    } else {
      progressContainer.classList.remove('visible');
    }
  }
  
  addNavigationButtons() {
    const navContainer = document.createElement('div');
    navContainer.className = 'reading-navigation';
    navContainer.innerHTML = `
      <button class="nav-btn scroll-to-top" title="返回顶部">
        <i class="fas fa-arrow-up"></i>
      </button>
      <button class="nav-btn scroll-to-bottom" title="文章底部">
        <i class="fas fa-arrow-down"></i>
      </button>
      <button class="nav-btn toggle-toc" title="目录">
        <i class="fas fa-list"></i>
      </button>
    `;
    
    document.body.appendChild(navContainer);
    
    // 绑定导航事件
    navContainer.querySelector('.scroll-to-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    navContainer.querySelector('.scroll-to-bottom').addEventListener('click', () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    navContainer.querySelector('.toggle-toc').addEventListener('click', () => {
      this.toggleTableOfContents();
    });
  }
  
  toggleTableOfContents() {
    let tocContainer = document.querySelector('.table-of-contents');
    
    if (!tocContainer) {
      tocContainer = this.generateTableOfContents();
    }
    
    tocContainer.classList.toggle('visible');
  }
  
  generateTableOfContents() {
    const content = document.querySelector('.post-content, .blog-post-content, article');
    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) return;
    
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    
    const tocHeader = document.createElement('div');
    tocHeader.className = 'toc-header';
    tocHeader.innerHTML = `
      <h4>文章目录</h4>
      <button class="toc-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      const li = document.createElement('li');
      li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
      li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
      
      tocList.appendChild(li);
    });
    
    tocContainer.appendChild(tocHeader);
    tocContainer.appendChild(tocList);
    document.body.appendChild(tocContainer);
    
    // 绑定关闭事件
    tocHeader.querySelector('.toc-close').addEventListener('click', () => {
      tocContainer.classList.remove('visible');
    });
    
    // 绑定锚点跳转事件
    tocList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          tocContainer.classList.remove('visible');
        }
      }
    });
    
    return tocContainer;
  }
}

// 页面加载完成后初始化阅读进度
document.addEventListener('DOMContentLoaded', () => {
  new ReadingProgress();
});

// CSS 样式（通过JavaScript插入）
const progressStyles = document.createElement('style');
progressStyles.textContent = `
  .reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-light);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
  
  .reading-progress-container.visible {
    transform: translateY(0);
  }
  
  .reading-progress-bar {
    height: 3px;
    background: var(--bg-tertiary);
    position: relative;
    overflow: hidden;
  }
  
  .reading-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--secondary-color), var(--accent-color));
    width: 0%;
    transition: width 0.1s ease;
  }
  
  .reading-progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  
  .progress-percentage {
    font-weight: 600;
    color: var(--secondary-color);
  }
  
  .reading-navigation {
    position: fixed;
    right: var(--spacing-lg);
    bottom: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    z-index: 999;
  }
  
  .nav-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--secondary-color);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
  }
  
  .nav-btn:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .table-of-contents {
    position: fixed;
    top: 50%;
    right: var(--spacing-lg);
    transform: translateY(-50%) translateX(100%);
    background: var(--bg-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 300px;
    max-height: 60vh;
    overflow-y: auto;
    z-index: 1001;
    transition: transform 0.3s ease;
  }
  
  .table-of-contents.visible {
    transform: translateY(-50%) translateX(0);
  }
  
  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-light);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  
  .toc-header h4 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1rem;
  }
  
  .toc-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  
  .toc-close:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .toc-list {
    list-style: none;
    padding: var(--spacing-md);
    margin: 0;
  }
  
  .toc-item {
    margin-bottom: var(--spacing-xs);
  }
  
  .toc-item a {
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
    display: block;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }
  
  .toc-item a:hover {
    background: var(--bg-secondary);
    color: var(--secondary-color);
  }
  
  .toc-h1 { margin-left: 0; }
  .toc-h2 { margin-left: var(--spacing-md); }
  .toc-h3 { margin-left: var(--spacing-lg); }
  .toc-h4 { margin-left: calc(var(--spacing-lg) + var(--spacing-md)); }
  .toc-h5 { margin-left: calc(var(--spacing-lg) * 2); }
  .toc-h6 { margin-left: calc(var(--spacing-lg) * 2 + var(--spacing-md)); }
  
  @media (max-width: 768px) {
    .reading-navigation {
      right: var(--spacing-md);
      bottom: var(--spacing-md);
    }
    
    .nav-btn {
      width: 40px;
      height: 40px;
    }
    
    .table-of-contents {
      right: var(--spacing-md);
      left: var(--spacing-md);
      max-width: none;
      transform: translateY(-50%) translateX(0);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .table-of-contents.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .reading-progress-info {
      font-size: 0.8rem;
      padding: var(--spacing-xs);
    }
  }
`;

document.head.appendChild(progressStyles);
