// 统一的section JavaScript功能
// =====================================

document.addEventListener('DOMContentLoaded', function() {
  // 初始化所有section
  initializeSections();
  
  // 添加平滑滚动效果
  addSmoothScrolling();
  
  // 添加卡片动画
  addCardAnimations();
  
  // 添加过滤功能
  addFilterFunctionality();
});

// 初始化所有section
function initializeSections() {
  console.log('Initializing sections...');
  
  // 为每个section添加fade-in动画
  const sections = document.querySelectorAll('.section-wrapper');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
    section.classList.add('fade-in');
  });
}

// 添加平滑滚动效果
function addSmoothScrolling() {
  // 为所有内部链接添加平滑滚动
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 添加卡片动画
function addCardAnimations() {
  // 观察者API用于卡片进入视口时的动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // 观察所有卡片
  const cards = document.querySelectorAll('.unified-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// 添加过滤功能
function addFilterFunctionality() {
  // 为所有过滤按钮添加事件监听器
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.dataset.category;
      const sectionId = this.closest('section').id;
      
      // 更新按钮状态
      const sectionButtons = this.closest('section').querySelectorAll('.filter-btn');
      sectionButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // 执行过滤
      filterCards(sectionId, category);
    });
  });
}

// 过滤卡片
function filterCards(sectionId, category) {
  const section = document.getElementById(sectionId);
  const cards = section.querySelectorAll('[data-category]');
  
  cards.forEach(card => {
    const cardCategory = card.dataset.category;
    
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

// 复制到剪贴板功能
function copyToClipboard(text, successMessage = '已复制到剪贴板') {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(successMessage, 'success');
  }).catch(err => {
    console.error('复制失败:', err);
    showNotification('复制失败', 'error');
  });
}

// 显示通知
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // 样式设置
  Object.assign(notification.style, {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '9999',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  });
  
  // 根据类型设置背景色
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  notification.style.background = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // 显示动画
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // 隐藏动画
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// 懒加载图片
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    imageObserver.observe(img);
  });
}

// 工具函数
const utils = {
  // 防抖函数
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // 节流函数
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // 格式化日期
  formatDate: function(date) {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  },
  
  // 截断文本
  truncateText: function(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
};

// 暴露给全局使用
window.SectionUtils = {
  filterCards,
  copyToClipboard,
  showNotification,
  lazyLoadImages,
  utils
};
