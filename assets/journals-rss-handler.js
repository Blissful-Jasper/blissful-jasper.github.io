// Journals RSS Handler
class JournalsRSSHandler {
  constructor() {
    this.corsProxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
    this.cache = new Map();
    this.cacheExpiry = 3600000; // 1 hour
    this.aiSummaryCache = new Map();
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

  async generateAISummary(title, description, journalName) {
    if (!journalsConfig.aiSummary.enabled) {
      return null;
    }

    const cacheKey = title + journalName;
    const cachedSummary = this.aiSummaryCache.get(cacheKey);
    
    if (cachedSummary && Date.now() - cachedSummary.timestamp < this.cacheExpiry) {
      return cachedSummary.summary;
    }

    try {
      // This is a placeholder for AI summary generation
      // In a real implementation, you would call your AI service here
      const summary = await this.callAIService(title, description, journalName);
      
      this.aiSummaryCache.set(cacheKey, {
        summary: summary,
        timestamp: Date.now()
      });
      
      return summary;
    } catch (error) {
      console.error('AI summary generation failed:', error);
      return null;
    }
  }

  async callAIService(title, description, journalName) {
    // Placeholder for AI service call
    // This would integrate with your chosen AI service (DeepSeek, OpenAI, etc.)
    
    const prompt = `请为以下地球科学论文生成中文摘要总结（不超过200字）：

标题：${title}
期刊：${journalName}
摘要：${description}

请重点关注：
1. 研究的核心发现
2. 对地球科学的贡献
3. 研究方法和数据
4. 实际应用价值

如果这篇论文与地球科学关系不大，请简要说明其相关性。`;

    // This is a mock response - replace with actual AI service call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`这是一篇关于${journalName}的重要研究，主要探讨了${title}。该研究通过创新的方法和数据分析，为地球科学领域提供了新的见解。研究结果对于理解相关地球科学过程具有重要意义，并可能为未来的研究和应用提供参考。`);
      }, 1000);
    });
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
    
    const hasAISummary = Math.random() > 0.5; // Mock AI summary availability
    
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
      <div class="article-abstract">${this.truncateText(safeDescription, 150)}</div>
      <div class="article-actions">
        <button class="read-full-btn" onclick="window.open('${safeLink}', '_blank')" ${safeLink === '#' ? 'disabled' : ''}>
          <i class="fas fa-external-link-alt"></i>
          阅读全文
        </button>
        <button class="ai-summary-btn" onclick="journalsRSSHandler.openArticleModal(event, ${JSON.stringify({
          title: safeTitle,
          description: safeDescription,
          author: safeAuthor,
          link: safeLink,
          pubDate: article.pubDate
        }).replace(/"/g, '&quot;')}, '${journalName}', '${journalColor}')">
          <i class="fas fa-brain"></i>
          查看详情
        </button>
      </div>
      <div class="article-tags">
        ${hasAISummary ? '<span class="ai-summary-badge"><i class="fas fa-brain"></i> AI总结</span>' : ''}
        <span class="article-tag">${journalName}</span>
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

  async openArticleModal(event, article, journalName, journalColor) {
    event.preventDefault();
    event.stopPropagation();
    
    const modal = document.getElementById('article-modal');
    if (!modal) {
      console.error('Article modal not found');
      return;
    }
    
    const modalTitle = document.getElementById('modal-title');
    const modalJournal = document.getElementById('modal-journal');
    const modalDate = document.getElementById('modal-date');
    const modalSummary = document.getElementById('modal-summary');
    const modalAbstract = document.getElementById('modal-abstract');
    const modalLink = document.getElementById('modal-link');

    if (modalTitle) modalTitle.textContent = article.title || 'Untitled';
    if (modalJournal) modalJournal.textContent = journalName;
    if (modalDate) modalDate.textContent = new Date(article.pubDate).toLocaleDateString('zh-CN');
    if (modalAbstract) modalAbstract.textContent = article.description || '暂无摘要';
    if (modalLink) {
      modalLink.href = article.link || '#';
      modalLink.style.display = article.link && article.link !== '#' ? 'inline-block' : 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Generate AI summary
    if (modalSummary) {
      modalSummary.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成AI总结...';
      
      try {
        const summary = await this.generateAISummary(article.title, article.description, journalName);
        modalSummary.textContent = summary || '基于文章标题和摘要，这是一篇关于' + journalName + '领域的学术文章。文章探讨了相关的科学问题和研究方法，为该领域的发展提供了重要见解。';
      } catch (error) {
        modalSummary.textContent = 'AI总结生成失败，请查看原文摘要了解详情。';
      }
    }
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

// Setup modal
function setupModal() {
  const modal = document.getElementById('article-modal');
  const closeBtn = document.querySelector('.close');
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
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
window.setupModal = setupModal;
