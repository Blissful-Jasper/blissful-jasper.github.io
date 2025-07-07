// Journals RSS Handler
class JournalsRSSHandler {
  constructor() {
    this.corsProxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
    this.cache = new Map();
    this.cacheExpiry = 3600000; // 1 hour
  }

  async fetchRSSFeed(url) {
    const cacheKey = url;
    const cachedData = this.cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < this.cacheExpiry) {
      return cachedData.data;
    }

    try {
      const response = await fetch(this.corsProxy + encodeURIComponent(url));
      const data = await response.json();
      
      if (data.status === 'ok') {
        this.cache.set(cacheKey, {
          data: data.items,
          timestamp: Date.now()
        });
        return data.items;
      } else {
        console.error('RSS fetch error:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch RSS:', error);
      return [];
    }
  }

  filterGeoscienceContent(articles) {
    if (!journalsConfig.display.geoscience_filter) {
      return articles;
    }

    const geoscienceKeywords = [
      'climate', 'atmospheric', 'ocean', 'earth', 'geophysics', 'geology', 
      'meteorology', 'hydrology', 'glaciology', 'seismology', 'volcanology',
      'paleoclimate', 'carbon', 'greenhouse', 'temperature', 'precipitation',
      'sea level', 'ice', 'weather', 'storm', 'hurricane', 'typhoon',
      'ENSO', 'El Niño', 'La Niña', 'monsoon', 'drought', 'flood',
      '气候', '大气', '海洋', '地球', '地质', '气象', '水文', '冰川',
      '地震', '火山', '古气候', '碳', '温室', '温度', '降水', '海平面',
      '冰', '天气', '风暴', '飓风', '台风', '厄尔尼诺', '拉尼娜', '季风'
    ];

    return articles.filter(article => {
      const text = (article.title + ' ' + article.description).toLowerCase();
      return geoscienceKeywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  createArticleCard(article, journalName, journalColor) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.style.borderLeftColor = journalColor;
    
    // 确保链接有效且安全
    const safeLink = article.link && article.link.startsWith('http') ? article.link : '#';
    const safeTitle = this.escapeHtml(article.title || 'Untitled');
    const safeDescription = this.escapeHtml(article.description || 'No description available');
    const safeAuthor = this.escapeHtml(article.author || 'Unknown Author');
    
    card.innerHTML = `
      <h3 class="article-title">${safeTitle}</h3>
      <div class="article-meta">
        <div class="article-authors">${safeAuthor}</div>
        <div class="article-date">${new Date(article.pubDate).toLocaleDateString('zh-CN')}</div>
      </div>
      <div class="article-abstract">${this.truncateText(safeDescription, 200)}</div>
      <div class="article-actions">
        <button class="read-full-btn primary-btn" onclick="window.open('${safeLink}', '_blank')" ${safeLink === '#' ? 'disabled' : ''}>
          <i class="fas fa-external-link-alt"></i>
          阅读原文
        </button>
      </div>
      <div class="article-tags">
        <span class="article-tag" style="background-color: ${journalColor}20; color: ${journalColor};">${journalName}</span>
      </div>
    `;

    return card;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  async loadJournalArticles(journal) {
    const container = document.getElementById(`articles-${journal.name.toLowerCase().replace(/\s+/g, '-')}`);
    
    if (!container) return;

    try {
      const articles = await this.fetchRSSFeed(journal.rss_url);
      const filteredArticles = this.filterGeoscienceContent(articles);
      const displayArticles = filteredArticles.slice(0, journalsConfig.display.articles_per_journal);

      container.innerHTML = '';

      if (displayArticles.length === 0) {
        container.innerHTML = '<div class="no-articles">暂无相关地球科学文献</div>';
        return;
      }

      const articlesGrid = document.createElement('div');
      articlesGrid.className = 'articles-grid';

      displayArticles.forEach(article => {
        const articleCard = this.createArticleCard(article, journal.name, journal.color);
        articlesGrid.appendChild(articleCard);
      });

      container.appendChild(articlesGrid);
    } catch (error) {
      console.error(`Failed to load articles for ${journal.name}:`, error);
      container.innerHTML = '<div class="error-message">加载文章失败，请稍后重试</div>';
    }
  }
}

// Initialize RSS handler
const rssHandler = new JournalsRSSHandler();

// Initialize RSS feeds
async function initializeRSSFeeds() {
  const journals = journalsConfig.journals;
  
  for (const journal of journals) {
    await rssHandler.loadJournalArticles(journal);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  updateLastUpdateTime();
}

// Refresh feeds
async function refreshFeeds() {
  const refreshBtn = document.querySelector('.refresh-btn');
  const originalText = refreshBtn.innerHTML;
  
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
  refreshBtn.disabled = true;
  
  // Clear cache
  rssHandler.cache.clear();
  
  await initializeRSSFeeds();
  
  refreshBtn.innerHTML = originalText;
  refreshBtn.disabled = false;
}

// Setup filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const journalSections = document.querySelectorAll('.journal-section');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const category = button.dataset.category;
      
      journalSections.forEach(section => {
        if (category === 'all' || section.dataset.category === category) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
}

// Update last update time
function updateLastUpdateTime() {
  const lastUpdateElement = document.getElementById('last-update');
  if (lastUpdateElement) {
    lastUpdateElement.textContent = new Date().toLocaleString('zh-CN');
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for global use
window.journalsRSSHandler = rssHandler;
window.initializeRSSFeeds = initializeRSSFeeds;
window.refreshFeeds = refreshFeeds;
window.setupFilterButtons = setupFilterButtons;
