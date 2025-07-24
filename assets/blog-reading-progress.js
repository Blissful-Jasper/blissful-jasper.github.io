/* ================================================
   阅读进度条 JavaScript - 通用版本
   ================================================ */

/**
 * 阅读进度条功能
 */
class ReadingProgress {
  constructor() {
    this.progressBar = null;
    this.progressPercent = null;
    this.isEnabled = false;
    this.init();
  }

  /**
   * 初始化进度条
   */
  init() {
    // 检查是否应该启用进度条
    this.checkIfEnabled();
    
    if (this.isEnabled) {
      this.createProgressBar();
      this.bindEvents();
      this.updateProgress();
    }
  }

  /**
   * 检查是否应该启用进度条
   */
  checkIfEnabled() {
    const body = document.body;
    const contentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    
    // 只在内容足够长的页面启用进度条
    this.isEnabled = contentHeight > viewportHeight * 1.5;
    
    // 特定页面强制启用
    if (body.classList.contains('blog-page') || 
        body.classList.contains('page-gallery') ||
        body.classList.contains('demo-page')) {
      this.isEnabled = true;
    }
  }

  /**
   * 创建进度条元素
   */
  createProgressBar() {
    // 创建进度条容器
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress';
    
    // 创建进度条
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'reading-progress-bar';
    
    // 创建百分比显示
    this.progressPercent = document.createElement('div');
    this.progressPercent.className = 'reading-progress-percent';
    this.progressPercent.textContent = '0%';
    
    progressContainer.appendChild(this.progressBar);
    document.body.appendChild(progressContainer);
    document.body.appendChild(this.progressPercent);
  }

  /**
   * 绑定事件
   */
  bindEvents() {
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
    
    window.addEventListener('resize', () => {
      this.updateProgress();
    });
  }

  /**
   * 更新进度
   */
  updateProgress() {
    if (!this.progressBar || !this.progressPercent) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / documentHeight, 0), 1);
    const percentage = Math.round(progress * 100);
    
    // 更新进度条
    this.progressBar.style.width = `${percentage}%`;
    
    // 更新百分比显示
    this.progressPercent.textContent = `${percentage}%`;
    
    // 控制百分比显示的可见性
    if (percentage > 5 && percentage < 95) {
      this.progressPercent.classList.add('visible');
    } else {
      this.progressPercent.classList.remove('visible');
    }
  }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
  // 延迟初始化，确保页面完全加载
  setTimeout(() => {
    new ReadingProgress();
  }, 500);
});

/**
 * 导出给全局使用
 */
window.ReadingProgress = ReadingProgress;

// 兼容旧版本调用
window.initReadingProgress = function() {
  new ReadingProgress();
};
