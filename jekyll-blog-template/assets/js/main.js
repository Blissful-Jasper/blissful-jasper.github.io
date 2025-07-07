// =============================================================================
// 主要JavaScript功能
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // 移动端导航菜单切换
  initMobileNavigation();
  
  // 图片懒加载
  initLazyLoading();
  
  // 平滑滚动
  initSmoothScroll();
  
  // 回到顶部按钮
  initBackToTop();
  
  // 性能监控
  initPerformanceMonitoring();
});

// 移动端导航
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // 点击菜单项后关闭菜单
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
}

// 图片懒加载
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // 观察所有带有 data-src 属性的图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 降级方案：直接加载所有图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.getAttribute('data-src');
      img.classList.remove('lazy');
      img.classList.add('loaded');
    });
  }
}

// 平滑滚动
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 回到顶部按钮
function initBackToTop() {
  // 创建回到顶部按钮
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', '回到顶部');
  document.body.appendChild(backToTopBtn);
  
  // 监听滚动事件
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  
  // 点击回到顶部
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 性能监控
function initPerformanceMonitoring() {
  // 页面加载性能监控
  window.addEventListener('load', function() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        console.log('Page Load Time:', loadTime + 'ms');
        
        // 如果加载时间超过3秒，显示警告
        if (loadTime > 3000) {
          console.warn('Page load time is slow:', loadTime + 'ms');
        }
      }
    }
  });
  
  // 资源加载错误监控
  window.addEventListener('error', function(e) {
    if (e.target.tagName) {
      console.error('Resource failed to load:', e.target.src || e.target.href);
    }
  }, true);
}

// 工具函数：节流
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// 工具函数：防抖
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
