/* ================================================
   访问统计和地图标记 JavaScript
   ================================================ */

/**
 * 访问统计和地图标记功能
 */
class VisitorAnalytics {
  constructor() {
    this.visitorData = [];
    this.pageViews = {};
    this.currentSession = {};
    this.init();
  }

  /**
   * 初始化功能
   */
  init() {
    this.loadStoredData();
    this.recordVisit();
    this.createAnalyticsPanel();
    this.updateDisplay();
    this.bindEvents();
  }

  /**
   * 加载存储的数据
   */
  loadStoredData() {
    try {
      const stored = localStorage.getItem('visitor-analytics');
      if (stored) {
        const data = JSON.parse(stored);
        this.visitorData = data.visitors || [];
        this.pageViews = data.pageViews || {};
      }
    } catch (e) {
      console.log('Failed to load analytics data:', e);
    }
  }

  /**
   * 保存数据到本地存储
   */
  saveData() {
    try {
      const data = {
        visitors: this.visitorData,
        pageViews: this.pageViews,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('visitor-analytics', JSON.stringify(data));
    } catch (e) {
      console.log('Failed to save analytics data:', e);
    }
  }

  /**
   * 记录访问
   */
  async recordVisit() {
    const currentPage = window.location.pathname;
    const currentTime = new Date().toISOString();
    const sessionId = this.getOrCreateSessionId();
    
    // 记录页面访问
    this.pageViews[currentPage] = (this.pageViews[currentPage] || 0) + 1;
    
    // 获取访客信息
    const visitorInfo = await this.getVisitorInfo();
    
    // 检查是否是同一会话的重复访问
    const lastVisit = this.visitorData[this.visitorData.length - 1];
    const isNewSession = !lastVisit || 
      (new Date(currentTime) - new Date(lastVisit.timestamp)) > 30 * 60 * 1000 || // 30分钟
      lastVisit.sessionId !== sessionId;
    
    // 记录访客数据
    this.currentSession = {
      page: currentPage,
      timestamp: currentTime,
      location: visitorInfo.location,
      country: visitorInfo.country,
      city: visitorInfo.city,
      ip: visitorInfo.ip,
      sessionId: sessionId,
      isNewSession: isNewSession,
      referrer: document.referrer || '直接访问',
      userAgent: navigator.userAgent.substring(0, 100),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      device: this.getDeviceType()
    };
    
    this.visitorData.push(this.currentSession);
    
    // 限制存储的数据量（只保留最近2000条记录）
    if (this.visitorData.length > 2000) {
      this.visitorData = this.visitorData.slice(-2000);
    }
    
    this.saveData();
    
    // 实时更新全局统计
    this.updateGlobalStats();
  }

  /**
   * 获取或创建会话ID
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('visitor-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('visitor-session-id', sessionId);
    }
    return sessionId;
  }

  /**
   * 获取设备类型
   */
  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return '移动设备';
    if (width <= 1024) return '平板设备';
    return '桌面设备';
  }

  /**
   * 获取访客信息（使用免费的IP地理位置API）
   */
  async getVisitorInfo() {
    try {
      // 使用免费的IP API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ip: data.ip || '未知',
        country: data.country_name || '未知',
        city: data.city || '未知',
        location: data.city + ', ' + data.country_name,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (e) {
      console.log('Failed to get location info:', e);
      return {
        ip: '本地',
        country: '未知',
        city: '未知',
        location: '本地访问',
        latitude: null,
        longitude: null
      };
    }
  }

  /**
   * 创建统计面板
   */
  createAnalyticsPanel() {
    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'analytics-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
    toggleBtn.title = '网站访问统计';
    
    // 创建面板
    const panel = document.createElement('div');
    panel.className = 'analytics-panel';
    panel.innerHTML = `
      <div class="stats-header">
        <i class="fas fa-globe"></i>
        <span>网站访问统计</span>
        <button class="panel-close" onclick="window.toggleAnalyticsPanel()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="stats-overview">
        <div class="overview-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <div class="card-number" id="total-visits">0</div>
            <div class="card-label">总访问量</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <div class="card-number" id="unique-visitors">0</div>
            <div class="card-label">独立访客</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">📱</div>
          <div class="card-content">
            <div class="card-number" id="today-visits">0</div>
            <div class="card-label">今日访问</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">🌍</div>
          <div class="card-content">
            <div class="card-number" id="countries-count">0</div>
            <div class="card-label">访问国家</div>
          </div>
        </div>
      </div>
      
      <div class="stats-tabs">
        <button class="tab-btn active" data-tab="pages">📄 页面统计</button>
        <button class="tab-btn" data-tab="visitors">👥 访客分析</button>
        <button class="tab-btn" data-tab="geography">🗺️ 地理分布</button>
      </div>
      
      <div class="stats-content">
        <div class="tab-content active" id="tab-pages">
          <div class="content-header">
            <h4>页面访问排行</h4>
            <span class="current-page">当前页面: <span id="current-page-views">0</span> 次访问</span>
          </div>
          <div id="page-stats-list" class="stats-list"></div>
        </div>
        
        <div class="tab-content" id="tab-visitors">
          <div class="content-header">
            <h4>访客设备分析</h4>
            <div id="device-stats" class="device-stats"></div>
          </div>
          <div class="content-header">
            <h4>最近访客记录</h4>
          </div>
          <div id="recent-visitors" class="visitor-list"></div>
        </div>
        
        <div class="tab-content" id="tab-geography">
          <div class="content-header">
            <h4>地理位置分布</h4>
          </div>
          <div id="geography-stats" class="geography-stats"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);
    
    this.toggleBtn = toggleBtn;
    this.panel = panel;
    
    // 绑定标签页切换事件
    this.bindTabEvents();
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    this.toggleBtn.addEventListener('click', () => {
      this.panel.classList.toggle('visible');
      this.toggleBtn.classList.toggle('active');
    });
    
    // 点击面板外部关闭
    document.addEventListener('click', (e) => {
      if (!this.panel.contains(e.target) && !this.toggleBtn.contains(e.target)) {
        this.panel.classList.remove('visible');
        this.toggleBtn.classList.remove('active');
      }
    });
  }

  /**
   * 绑定标签页事件
   */
  bindTabEvents() {
    const tabBtns = this.panel.querySelectorAll('.tab-btn');
    const tabContents = this.panel.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // 移除所有活动状态
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // 激活当前标签
        btn.classList.add('active');
        const tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        // 更新对应内容
        this.updateTabContent(btn.dataset.tab);
      });
    });
  }

  /**
   * 更新标签页内容
   */
  updateTabContent(tab) {
    switch (tab) {
      case 'pages':
        this.updatePageStats();
        break;
      case 'visitors':
        this.updateVisitorAnalysis();
        break;
      case 'geography':
        this.updateGeographyStats();
        break;
    }
  }

  /**
   * 更新全局统计概览
   */
  updateGlobalStats() {
    // 实时更新页面上的统计信息
    if (document.getElementById('visitorInfo')) {
      const sessions = new Set(this.visitorData.map(v => v.sessionId)).size;
      const totalPages = Object.keys(this.pageViews).length;
      document.getElementById('visitorInfo').innerHTML = 
        `总访问 ${this.visitorData.length} | 会话 ${sessions} | 页面 ${totalPages}`;
    }
  }

  /**
   * 更新访客分析
   */
  updateVisitorAnalysis() {
    // 设备类型统计
    const deviceStats = {};
    this.visitorData.forEach(visitor => {
      const device = visitor.device || '未知设备';
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });
    
    const deviceContainer = document.getElementById('device-stats');
    const total = this.visitorData.length;
    
    deviceContainer.innerHTML = Object.entries(deviceStats)
      .sort(([,a], [,b]) => b - a)
      .map(([device, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        return `
          <div class="device-stat-item">
            <div class="device-info">
              <span class="device-name">${device}</span>
              <span class="device-count">${count} (${percentage}%)</span>
            </div>
            <div class="device-bar">
              <div class="device-progress" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('');
    
    // 更新最近访客
    this.updateRecentVisitors();
  }

  /**
   * 更新地理统计
   */
  updateGeographyStats() {
    const geoContainer = document.getElementById('geography-stats');
    
    // 统计国家和城市
    const countries = {};
    const cities = {};
    
    this.visitorData.forEach(visitor => {
      if (visitor.country && visitor.country !== '未知') {
        countries[visitor.country] = (countries[visitor.country] || 0) + 1;
      }
      if (visitor.city && visitor.city !== '未知') {
        cities[visitor.city] = (cities[visitor.city] || 0) + 1;
      }
    });
    
    const topCountries = Object.entries(countries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);
    
    const topCities = Object.entries(cities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);
    
    geoContainer.innerHTML = `
      <div class="geo-section">
        <h5>🌍 访问国家/地区</h5>
        <div class="geo-list">
          ${topCountries.map(([country, count]) => `
            <div class="geo-item">
              <span class="geo-name">${country}</span>
              <span class="geo-count">${count}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="geo-section">
        <h5>🏙️ 访问城市</h5>
        <div class="geo-list">
          ${topCities.map(([city, count]) => `
            <div class="geo-item">
              <span class="geo-name">${city}</span>
              <span class="geo-count">${count}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 更新显示数据
   */
  updateDisplay() {
    const totalVisits = this.visitorData.length;
    const uniqueVisitors = new Set(this.visitorData.map(v => v.sessionId || v.ip)).size;
    const todayVisits = this.getTodayVisits();
    const currentPageViews = this.pageViews[window.location.pathname] || 0;
    const countriesCount = new Set(this.visitorData.map(v => v.country).filter(c => c && c !== '未知')).size;
    
    // 更新概览统计数字
    this.safeUpdateElement('total-visits', totalVisits);
    this.safeUpdateElement('unique-visitors', uniqueVisitors);
    this.safeUpdateElement('today-visits', todayVisits);
    this.safeUpdateElement('current-page-views', currentPageViews);
    this.safeUpdateElement('countries-count', countriesCount);
    
    // 更新页面统计
    this.updatePageStats();
    
    // 更新最近访客
    this.updateRecentVisitors();
    
    // 更新当前活动标签的内容
    const activeTab = this.panel?.querySelector('.tab-btn.active');
    if (activeTab) {
      this.updateTabContent(activeTab.dataset.tab);
    }
  }

  /**
   * 安全更新元素内容
   */
  safeUpdateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  /**
   * 获取今日访问数
   */
  getTodayVisits() {
    const today = new Date().toDateString();
    return this.visitorData.filter(visitor => 
      new Date(visitor.timestamp).toDateString() === today
    ).length;
  }

  /**
   * 更新页面统计
   */
  updatePageStats() {
    const pageStatsList = document.getElementById('page-stats-list');
    if (!pageStatsList) return;
    
    const sortedPages = Object.entries(this.pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    pageStatsList.innerHTML = sortedPages.map(([page, views]) => {
      const isCurrentPage = page === window.location.pathname;
      return `
        <div class="page-stat-item ${isCurrentPage ? 'current' : ''}">
          <div class="page-info">
            <span class="page-name">${this.getPageDisplayName(page)}</span>
            <span class="page-path">${page}</span>
          </div>
          <div class="page-metrics">
            <span class="page-views">${views}</span>
            <span class="views-label">次</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 获取页面显示名称
   */
  getPageDisplayName(path) {
    const names = {
      '/': '🏠 首页',
      '/index.html': '🏠 首页',
      '/about.html': '👤 关于我',
      '/blog.html': '📝 博客文章',
      '/research.html': '🔬 研究工作',
      '/publications.html': '📚 学术发表',
      '/gallery.html': '📷 摄影作品',
      '/contact.html': '📧 联系方式',
      '/links.html': '🔗 友情链接',
      '/maps.html': '🗺️ 地图导航',
      '/demo.html': '🎯 功能演示',
      '/gallery-test.html': '🧪 测试页面'
    };
    return names[path] || `📄 ${path.replace(/\.html$/, '').replace(/^\//, '')}`;
  }

  /**
   * 更新最近访客
   */
  updateRecentVisitors() {
    const recentVisitors = document.getElementById('recent-visitors');
    if (!recentVisitors) return;
    
    const recent = this.visitorData
      .slice(-15)
      .reverse();
    
    recentVisitors.innerHTML = recent.map(visitor => {
      const time = new Date(visitor.timestamp);
      const timeStr = time.toLocaleString('zh-CN', { 
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const pageName = this.getPageDisplayName(visitor.page);
      
      return `
        <div class="visitor-item">
          <div class="visitor-avatar">
            ${this.getCountryFlag(visitor.country)}
          </div>
          <div class="visitor-details">
            <div class="visitor-location">${visitor.location || '未知位置'}</div>
            <div class="visitor-meta">
              <span class="visitor-page">${pageName}</span>
              <span class="visitor-time">${timeStr}</span>
            </div>
            ${visitor.device ? `<div class="visitor-device">${visitor.device}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 获取国家旗帜表情符号
   */
  getCountryFlag(country) {
    const flags = {
      '中国': '🇨🇳',
      '美国': '🇺🇸',
      '日本': '🇯🇵',
      '英国': '🇬🇧',
      '德国': '🇩🇪',
      '法国': '🇫🇷',
      '韩国': '🇰🇷',
      '加拿大': '🇨🇦',
      '澳大利亚': '🇦🇺'
    };
    return flags[country] || '🌍';
  }

  /**
   * 更新访客地图（简化版本）
   */
  updateVisitorMap() {
    const mapContainer = this.panel.querySelector('.visitor-map');
    
    // 统计国家/地区分布
    const countries = {};
    this.visitorData.forEach(visitor => {
      if (visitor.country && visitor.country !== '未知') {
        countries[visitor.country] = (countries[visitor.country] || 0) + 1;
      }
    });
    
    // 创建简单的地区列表显示
    if (Object.keys(countries).length > 0) {
      const topCountries = Object.entries(countries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      mapContainer.innerHTML = `
        <div style="padding: 10px; font-size: 12px;">
          <strong style="display: block; margin-bottom: 8px;">访客地区分布</strong>
          ${topCountries.map(([country, count]) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>${country}</span>
              <span style="color: #667eea; font-weight: 600;">${count}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
  // 延迟初始化，避免影响页面加载性能
  setTimeout(() => {
    new VisitorAnalytics();
  }, 1000);
});

/**
 * 导出给全局使用
 */
window.VisitorAnalytics = VisitorAnalytics;

/**
 * 全局切换统计面板功能
 */
window.toggleAnalyticsPanel = function() {
  const panel = document.querySelector('.analytics-panel');
  const toggle = document.querySelector('.analytics-toggle');
  
  if (panel && toggle) {
    panel.classList.toggle('visible');
    toggle.classList.toggle('active');
  } else {
    console.log('统计面板组件尚未初始化');
  }
};

/**
 * 获取当前访问统计
 */
window.getVisitStats = function() {
  try {
    const stored = localStorage.getItem('visitor-analytics');
    if (stored) {
      const data = JSON.parse(stored);
      return {
        totalVisits: data.visitors ? data.visitors.length : 0,
        pageViews: data.pageViews || {},
        lastUpdated: data.lastUpdated
      };
    }
  } catch (e) {
    console.log('Failed to get visit stats:', e);
  }
  return { totalVisits: 0, pageViews: {}, lastUpdated: null };
};
