// =============================================================================
// 性能优化脚本 - 图片懒加载和资源优化
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // 图片懒加载
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

  // 预加载下一页内容（针对分页博客）
  const nextPageLink = document.querySelector('.pagination .next');
  if (nextPageLink && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = nextPageLink.href;
      document.head.appendChild(link);
    });
  }

  // 条件性加载MathJax
  if (document.querySelector('.math, .mathjax, [class*="math"]')) {
    loadMathJax();
  }

  // Service Worker注册（用于缓存）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});

// 动态加载MathJax
function loadMathJax() {
  if (window.MathJax) return; // 已经加载过了
  
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js';
  script.async = true;
  
  script.onload = function() {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        tags: 'ams'
      },
      options: {
        ignoreHtmlClass: "tex2jax_ignore",
        processHtmlClass: "tex2jax_process"
      }
    };
  };
  
  document.head.appendChild(script);
}

// 图片优化：WebP支持检测
function supportsWebP() {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// 根据网络状况调整资源加载
function adaptToNetwork() {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      // 在慢速网络下禁用某些功能
      document.body.classList.add('slow-network');
    }
  }
}

adaptToNetwork();
