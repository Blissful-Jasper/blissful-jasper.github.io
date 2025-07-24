// Performance Monitoring
(function() {
  // 页面加载性能监控
  window.addEventListener('load', function() {
    // 使用Performance API监控加载时间
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
      
      // 发送性能数据到分析服务（可选）
      console.log('Page Load Time:', loadTime + 'ms');
      
      // 如果加载时间超过3秒，显示警告
      if (loadTime > 3000) {
        console.warn('Page load time is slow:', loadTime + 'ms');
      }
    }
    
    // 监控最大内容绘制 (LCP)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({entryTypes: ['largest-contentful-paint']});
    }
  });
  
  // 资源加载错误监控
  window.addEventListener('error', function(e) {
    if (e.target.tagName) {
      console.error('Resource failed to load:', e.target.src || e.target.href);
    }
  }, true);
})();
