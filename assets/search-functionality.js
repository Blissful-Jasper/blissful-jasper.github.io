// 全站搜索功能
class SiteSearch {
  constructor() {
    this.searchData = [];
    this.searchInput = document.getElementById('search-input');
    this.clearButton = document.getElementById('clear-search');
    this.searchFilters = document.getElementById('search-filters');
    this.searchResults = document.getElementById('search-results');
    this.resultsCount = document.querySelector('.results-count');
    this.resultsList = document.querySelector('.results-list');
    
    this.init();
  }
  
  async init() {
    await this.loadSearchData();
    this.bindEvents();
  }
  
  async loadSearchData() {
    try {
      // 加载博客数据
      const blogResponse = await fetch('/blog/index.json');
      const blogData = await blogResponse.json();
      
      // 加载其他内容数据
      const otherData = [
        // 研究内容
        {
          title: "气候变化与极端天气事件",
          type: "research",
          url: "/research.html#climate-change",
          excerpt: "研究气候变化对极端天气事件频率和强度的影响，包括热浪、暴雨、干旱等极端事件的变化趋势。",
          tags: ["气候变化", "极端天气", "数据分析"],
          date: "2024-01-01"
        },
        {
          title: "海洋动力学建模",
          type: "research", 
          url: "/research.html#ocean-dynamics",
          excerpt: "利用数值模型研究海洋环流、波浪传播和海洋-大气相互作用机制。",
          tags: ["海洋学", "数值建模", "动力学"],
          date: "2024-01-01"
        },
        // 发表论文
        {
          title: "Climate Model Evaluation Using CMIP6 Data",
          type: "publications",
          url: "/publications.html#cmip6-eval",
          excerpt: "Comprehensive evaluation of climate models using the latest CMIP6 dataset to assess model performance in simulating historical climate patterns.",
          tags: ["CMIP6", "Climate Models", "Model Evaluation"],
          date: "2024-06-15"
        }
      ];
      
      this.searchData = [...blogData, ...otherData];
    } catch (error) {
      console.error('Failed to load search data:', error);
      this.searchData = [];
    }
  }
  
  bindEvents() {
    // 搜索输入事件
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        this.clearButton.style.display = 'block';
        this.searchFilters.style.display = 'block';
        this.performSearch(query);
      } else {
        this.clearSearch();
      }
    });
    
    // 清空搜索
    this.clearButton.addEventListener('click', () => {
      this.clearSearch();
    });
    
    // 搜索过滤器
    const filterInputs = document.querySelectorAll('.filter-option input');
    filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        const query = this.searchInput.value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
    });
    
    // ESC键清空搜索
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clearSearch();
      }
    });
  }
  
  clearSearch() {
    this.searchInput.value = '';
    this.clearButton.style.display = 'none';
    this.searchFilters.style.display = 'none';
    this.searchResults.style.display = 'none';
  }
  
  performSearch(query) {
    const selectedTypes = Array.from(document.querySelectorAll('.filter-option input:checked'))
      .map(input => input.value);
    
    const results = this.searchData.filter(item => {
      // 类型过滤
      if (!selectedTypes.includes(item.type)) {
        return false;
      }
      
      // 文本搜索
      const searchText = `${item.title} ${item.excerpt} ${item.tags?.join(' ') || ''}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    this.displayResults(results, query);
  }
  
  displayResults(results, query) {
    this.searchResults.style.display = 'block';
    this.resultsCount.textContent = `找到 ${results.length} 个结果`;
    
    if (results.length === 0) {
      this.resultsList.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search" style="font-size: 2rem; color: var(--text-muted); margin-bottom: var(--spacing-sm);"></i>
          <p>没有找到相关内容</p>
          <p style="font-size: 0.9rem; color: var(--text-muted);">试试其他关键词或调整筛选条件</p>
        </div>
      `;
      return;
    }
    
    this.resultsList.innerHTML = results.map(item => this.renderResultItem(item, query)).join('');
  }
  
  renderResultItem(item, query) {
    const highlightedTitle = this.highlightText(item.title, query);
    const highlightedExcerpt = this.highlightText(item.excerpt, query);
    
    const typeLabels = {
      'blog': '博客',
      'research': '研究',
      'publications': '论文'
    };
    
    const tagsHtml = item.tags ? 
      item.tags.map(tag => `<a href="#" class="result-tag" onclick="searchTags('${tag}')">${tag}</a>`).join('') 
      : '';
    
    return `
      <div class="result-item">
        <div class="result-title">
          <a href="${item.url}">${highlightedTitle}</a>
        </div>
        <div class="result-meta">
          <span class="result-type">${typeLabels[item.type] || item.type}</span>
          ${item.date ? `• <span class="result-date">${this.formatDate(item.date)}</span>` : ''}
        </div>
        <div class="result-excerpt">${highlightedExcerpt}</div>
        ${tagsHtml ? `<div class="result-tags">${tagsHtml}</div>` : ''}
      </div>
    `;
  }
  
  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// 标签搜索功能
function searchTags(tag) {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = tag;
    searchInput.dispatchEvent(new Event('input'));
    searchInput.scrollIntoView({ behavior: 'smooth' });
  }
}

// 页面加载完成后初始化搜索
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('search-input')) {
    new SiteSearch();
  }
});

// 博客标签过滤功能
class BlogTagFilter {
  constructor() {
    this.currentTag = null;
    this.allPosts = [];
    this.init();
  }
  
  init() {
    this.allPosts = Array.from(document.querySelectorAll('.blog-post-card'));
    this.bindTagEvents();
    this.createTagCloud();
  }
  
  bindTagEvents() {
    // 绑定所有标签点击事件
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag') || e.target.classList.contains('blog-tag')) {
        e.preventDefault();
        const tag = e.target.textContent.trim();
        this.filterByTag(tag);
      }
    });
  }
  
  filterByTag(tag) {
    if (this.currentTag === tag) {
      // 取消过滤
      this.currentTag = null;
      this.showAllPosts();
      this.updateTagStates();
      return;
    }
    
    this.currentTag = tag;
    this.showPostsWithTag(tag);
    this.updateTagStates(tag);
    this.showFilterStatus(tag);
  }
  
  showPostsWithTag(tag) {
    this.allPosts.forEach(post => {
      const postTags = Array.from(post.querySelectorAll('.tag, .blog-tag'))
        .map(t => t.textContent.trim());
      
      if (postTags.includes(tag)) {
        post.style.display = 'block';
        post.classList.add('tag-filtered');
      } else {
        post.style.display = 'none';
        post.classList.remove('tag-filtered');
      }
    });
  }
  
  showAllPosts() {
    this.allPosts.forEach(post => {
      post.style.display = 'block';
      post.classList.remove('tag-filtered');
    });
    this.hideFilterStatus();
  }
  
  updateTagStates(activeTag = null) {
    document.querySelectorAll('.tag, .blog-tag').forEach(tagEl => {
      if (activeTag && tagEl.textContent.trim() === activeTag) {
        tagEl.classList.add('tag-active');
      } else {
        tagEl.classList.remove('tag-active');
      }
    });
  }
  
  createTagCloud() {
    const tagContainer = document.querySelector('.tag-cloud');
    if (!tagContainer) return;
    
    // 收集所有标签
    const tagCounts = {};
    document.querySelectorAll('.tag, .blog-tag').forEach(tagEl => {
      const tag = tagEl.textContent.trim();
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // 创建标签云
    const sortedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20); // 只显示前20个最常用的标签
    
    tagContainer.innerHTML = sortedTags.map(([tag, count]) => 
      `<span class="tag-cloud-item" onclick="blogTagFilter.filterByTag('${tag}')">${tag} <small>(${count})</small></span>`
    ).join('');
  }
  
  showFilterStatus(tag) {
    let statusEl = document.querySelector('.filter-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'filter-status';
      const postsContainer = document.querySelector('.blog-posts, .posts-container');
      if (postsContainer) {
        postsContainer.insertBefore(statusEl, postsContainer.firstChild);
      }
    }
    
    const visibleCount = this.allPosts.filter(post => post.style.display !== 'none').length;
    statusEl.innerHTML = `
      <div class="filter-info">
        <i class="fas fa-filter"></i>
        正在显示标签 "<strong>${tag}</strong>" 的 ${visibleCount} 篇文章
        <button onclick="blogTagFilter.showAllPosts()" class="clear-filter-btn">
          <i class="fas fa-times"></i> 清除过滤
        </button>
      </div>
    `;
  }
  
  hideFilterStatus() {
    const statusEl = document.querySelector('.filter-status');
    if (statusEl) {
      statusEl.remove();
    }
  }
}

// 全局变量
let blogTagFilter;

// 页面加载完成后初始化标签过滤
document.addEventListener('DOMContentLoaded', () => {
  blogTagFilter = new BlogTagFilter();
});
