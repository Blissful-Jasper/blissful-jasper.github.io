/**
 * Links 页面搜索和过滤功能
 * 实现学术链接的动态搜索、分类过滤、排序等功能
 */

class LinksManager {
    constructor() {
        this.allLinks = [];
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.searchQuery = '';
        this.searchHistory = this.loadSearchHistory();
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.indexLinks();
        this.updateDisplay();
    }

    cacheElements() {
        this.searchInput = document.getElementById('searchInput');
        this.clearSearch = document.getElementById('clearSearch');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.sortSelect = document.getElementById('sortSelect');
        this.resultsInfo = document.getElementById('resultsInfo');
        this.resultsText = document.getElementById('resultsText');
        this.noResults = document.getElementById('noResults');
        this.linksGrid = document.getElementById('linksGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.categorySections = document.querySelectorAll('.category-section');
        this.linkCards = document.querySelectorAll('.link-card');
    }

    bindEvents() {
        // 搜索框事件
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });

        this.searchInput.addEventListener('blur', () => {
            // 延迟隐藏建议，允许点击建议项
            setTimeout(() => this.hideSearchSuggestions(), 200);
        });

        // 键盘导航支持
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleSearchKeyboard(e);
        });

        // 清除搜索按钮
        this.clearSearch.addEventListener('click', () => {
            this.clearSearch();
        });

        // 分类过滤按钮
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.closest('.filter-btn').dataset.category);
            });
        });

        // 排序选择
        this.sortSelect.addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // 全局键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearAllFilters();
            } else if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    handleSearchKeyboard(e) {
        const suggestions = this.searchSuggestions.querySelectorAll('.suggestion-item');
        const currentActive = this.searchSuggestions.querySelector('.suggestion-item.active');
        let activeIndex = currentActive ? Array.from(suggestions).indexOf(currentActive) : -1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, suggestions.length - 1);
                this.highlightSuggestion(suggestions, activeIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, -1);
                this.highlightSuggestion(suggestions, activeIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    const suggestionText = currentActive.querySelector('span').textContent;
                    this.applySuggestion(suggestionText);
                } else if (this.searchQuery.length > 1) {
                    // 直接搜索当前输入
                    this.addToSearchHistory(this.searchQuery);
                    this.hideSearchSuggestions();
                }
                break;
            case 'Escape':
                this.hideSearchSuggestions();
                this.searchInput.blur();
                break;
        }
    }

    highlightSuggestion(suggestions, activeIndex) {
        suggestions.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });
    }

    indexLinks() {
        this.allLinks = Array.from(this.linkCards).map(card => ({
            element: card,
            name: card.dataset.name || '',
            url: card.dataset.url || '',
            category: card.dataset.category || '',
            group: card.dataset.group || '',
            title: card.querySelector('.link-title')?.textContent || '',
            description: card.querySelector('.link-description')?.textContent || '',
            domain: card.querySelector('.link-domain')?.textContent || ''
        }));
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        
        // 显示/隐藏清除按钮
        this.clearSearch.style.display = this.searchQuery ? 'flex' : 'none';
        
        this.updateDisplay();
        this.updateSearchSuggestions();
    }

    handleFilter(category) {
        this.currentFilter = category;
        
        // 更新按钮状态
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.updateDisplay();
    }

    handleSort(sortType) {
        this.currentSort = sortType;
        this.updateDisplay();
    }

    updateDisplay() {
        let visibleLinks = this.filterLinks();
        visibleLinks = this.sortLinks(visibleLinks);
        
        this.showFilteredLinks(visibleLinks);
        this.updateResultsInfo(visibleLinks.length);
        this.updateCategorySections(visibleLinks);
        this.updateVisibleCount(visibleLinks.length);
    }

    updateVisibleCount(count) {
        const visibleCountEl = document.getElementById('visibleCount');
        if (visibleCountEl) {
            visibleCountEl.textContent = count;
        }
    }

    filterLinks() {
        return this.allLinks.filter(link => {
            // 分类过滤
            const categoryMatch = this.currentFilter === 'all' || 
                                 link.category === this.currentFilter;
            
            // 搜索过滤
            const searchMatch = !this.searchQuery || 
                               this.matchesSearch(link);
            
            return categoryMatch && searchMatch;
        });
    }

    matchesSearch(link) {
        const searchTerms = this.searchQuery.split(' ').filter(term => term.length > 0);
        const searchableText = `${link.name} ${link.title} ${link.description} ${link.group} ${link.domain}`.toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
    }

    sortLinks(links) {
        switch (this.currentSort) {
            case 'name':
                return [...links].sort((a, b) => a.title.localeCompare(b.title));
            case 'category':
                return [...links].sort((a, b) => a.group.localeCompare(b.group));
            default:
                return links;
        }
    }

    showFilteredLinks(visibleLinks) {
        const visibleElements = new Set(visibleLinks.map(link => link.element));
        
        this.allLinks.forEach(link => {
            const shouldShow = visibleElements.has(link.element);
            link.element.style.display = shouldShow ? 'block' : 'none';
            
            // 添加动画效果
            if (shouldShow) {
                link.element.style.animation = 'fadeInUp 0.3s ease forwards';
            }
        });

        // 显示/隐藏无结果状态
        this.noResults.style.display = visibleLinks.length === 0 ? 'block' : 'none';
    }

    updateCategorySections(visibleLinks) {
        const visibleCategories = new Set(visibleLinks.map(link => link.category));
        
        this.categorySections.forEach(section => {
            const category = section.dataset.category;
            const hasVisibleLinks = visibleCategories.has(category) || this.currentFilter === 'all';
            const categoryLinks = visibleLinks.filter(link => link.category === category);
            
            if (this.searchQuery || this.currentFilter !== 'all') {
                // 搜索或过滤模式：只显示有匹配结果的分类
                section.style.display = categoryLinks.length > 0 ? 'block' : 'none';
            } else {
                // 默认模式：显示所有分类
                section.style.display = 'block';
            }
        });
    }

    updateResultsInfo(count) {
        const isFiltered = this.searchQuery || this.currentFilter !== 'all';
        
        if (isFiltered) {
            this.resultsInfo.style.display = 'block';
            
            let resultText = `找到 ${count} 个结果`;
            if (this.searchQuery) {
                resultText += ` (搜索: "${this.searchQuery}")`;
            }
            if (this.currentFilter !== 'all') {
                const filterBtn = document.querySelector(`[data-category="${this.currentFilter}"]`);
                const filterName = filterBtn?.textContent.replace(/\d+/g, '').trim() || this.currentFilter;
                resultText += ` (分类: ${filterName})`;
            }
            
            this.resultsText.textContent = resultText;
        } else {
            this.resultsInfo.style.display = 'none';
        }
    }

    updateSearchSuggestions() {
        if (!this.searchQuery) {
            this.hideSearchSuggestions();
            return;
        }

        const suggestions = this.generateSuggestions();
        
        if (suggestions.length > 0) {
            this.showSearchSuggestions(suggestions);
        } else {
            this.hideSearchSuggestions();
        }
    }

    generateSuggestions() {
        const suggestions = new Set();
        const maxSuggestions = 8;
        
        // 如果没有搜索词，显示搜索历史
        if (!this.searchQuery && this.searchHistory.length > 0) {
            this.searchHistory.slice(0, 5).forEach(item => suggestions.add(item));
            return Array.from(suggestions);
        }
        
        // 预定义的常用搜索词
        const commonTerms = [
            'ENSO', '预测', '卫星', '模式', '数据', '气候', 'Python', 
            '季风', '波动', '论文', '监测', 'NOAA', 'NASA'
        ];
        
        // 搜索历史匹配
        this.searchHistory.forEach(item => {
            if (item.toLowerCase().includes(this.searchQuery)) {
                suggestions.add(item);
            }
        });
        
        // 检查常用词匹配
        commonTerms.forEach(term => {
            if (term.toLowerCase().includes(this.searchQuery) || 
                term.toLowerCase().startsWith(this.searchQuery)) {
                suggestions.add(term);
            }
        });
        
        // 基于链接内容生成建议
        this.allLinks.forEach(link => {
            // 链接标题建议
            if (link.title.toLowerCase().includes(this.searchQuery)) {
                suggestions.add(link.title);
            }
            
            // 分类建议
            if (link.group.toLowerCase().includes(this.searchQuery)) {
                suggestions.add(link.group);
            }
            
            // 描述中的关键词
            if (link.description) {
                const words = link.description.split(/[\s\u3000\uff0c\u3001\uff1a\uff1b]+/);
                words.forEach(word => {
                    word = word.replace(/[^\w\u4e00-\u9fff]/g, '');
                    if (word.length > 2 && word.toLowerCase().includes(this.searchQuery)) {
                        suggestions.add(word);
                    }
                });
            }
            
            // 域名建议
            if (link.domain && link.domain.includes(this.searchQuery)) {
                suggestions.add(link.domain);
            }
        });

        // 按相关性排序（长度短的优先，完全匹配优先）
        const sortedSuggestions = Array.from(suggestions).sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            const query = this.searchQuery;
            
            // 搜索历史优先
            if (this.searchHistory.includes(a) && !this.searchHistory.includes(b)) return -1;
            if (this.searchHistory.includes(b) && !this.searchHistory.includes(a)) return 1;
            
            // 完全匹配优先
            if (aLower === query && bLower !== query) return -1;
            if (bLower === query && aLower !== query) return 1;
            
            // 开头匹配优先
            if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1;
            if (bLower.startsWith(query) && !aLower.startsWith(query)) return 1;
            
            // 长度短的优先
            return a.length - b.length;
        });

        return sortedSuggestions.slice(0, maxSuggestions);
    }

    showSearchSuggestions(suggestions = []) {
        if (suggestions.length === 0) {
            this.hideSearchSuggestions();
            return;
        }

        const html = suggestions.map(suggestion => {
            const isHistory = this.searchHistory.includes(suggestion);
            const icon = isHistory ? 'fas fa-history' : 'fas fa-search';
            
            return `<div class="suggestion-item ${isHistory ? 'history-item' : ''}" onclick="linksManager.applySuggestion('${suggestion}')">
                <i class="${icon}"></i>
                <span>${this.highlightQuery(suggestion)}</span>
                ${isHistory ? '<span class="suggestion-label">历史</span>' : ''}
            </div>`;
        }).join('');

        this.searchSuggestions.innerHTML = html;
        this.searchSuggestions.style.display = 'block';
    }

    hideSearchSuggestions() {
        this.searchSuggestions.style.display = 'none';
    }

    applySuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.handleSearch(suggestion);
        this.addToSearchHistory(suggestion);
        this.hideSearchSuggestions();
        this.searchInput.blur();
    }

    addToSearchHistory(query) {
        if (!query || query.length < 2) return;
        
        // 移除重复项并添加到开头
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.searchHistory.unshift(query);
        
        // 限制历史记录数量
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // 保存到本地存储
        localStorage.setItem('linksSearchHistory', JSON.stringify(this.searchHistory));
    }

    loadSearchHistory() {
        try {
            const history = localStorage.getItem('linksSearchHistory');
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }

    highlightQuery(text) {
        if (!this.searchQuery) return text;
        
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.clearSearch.style.display = 'none';
        this.hideSearchSuggestions();
        this.updateDisplay();
    }

    clearAllFilters() {
        this.clearSearch();
        this.handleFilter('all');
        this.handleSort('default');
        this.sortSelect.value = 'default';
    }

    // 获取统计信息
    getStats() {
        const visibleLinks = this.filterLinks();
        return {
            total: this.allLinks.length,
            categories: new Set(this.allLinks.map(link => link.category)).size,
            currentVisible: visibleLinks.length,
            searchQuery: this.searchQuery,
            currentFilter: this.currentFilter
        };
    }

    // 导出当前结果
    exportResults() {
        const visibleLinks = this.filterLinks();
        const data = visibleLinks.map(link => ({
            name: link.title,
            url: link.element.href,
            category: link.group,
            description: link.description || '',
            domain: link.domain
        }));

        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const filename = `学术链接_${this.currentFilter === 'all' ? '全部' : this.currentFilter}_${new Date().toISOString().slice(0, 10)}.csv`;
        
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    convertToCSV(data) {
        const headers = ['名称', 'URL', '分类', '描述', '域名'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                `"${row.name}"`,
                `"${row.url}"`,
                `"${row.category}"`,
                `"${row.description}"`,
                `"${row.domain}"`
            ].join(','))
        ].join('\n');
        
        return '\uFEFF' + csvContent; // 添加BOM以支持中文
    }

    // 随机访问链接
    randomLink() {
        const visibleLinks = this.filterLinks();
        if (visibleLinks.length === 0) {
            alert('没有可用的链接');
            return;
        }

        const randomIndex = Math.floor(Math.random() * visibleLinks.length);
        const randomLink = visibleLinks[randomIndex];
        
        // 添加视觉反馈
        randomLink.element.style.transform = 'scale(1.05)';
        randomLink.element.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
        
        setTimeout(() => {
            randomLink.element.style.transform = '';
            randomLink.element.style.boxShadow = '';
            window.open(randomLink.element.href, '_blank');
        }, 500);
    }
}

// 全局函数
function clearAllFilters() {
    if (window.linksManager) {
        window.linksManager.clearAllFilters();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.linksManager = new LinksManager();
    
    // 添加键盘快捷键提示
    console.log('Links Manager 已初始化');
    console.log('快捷键: ESC - 清除所有筛选');
});

// CSS 动画定义
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
}

.suggestion-item:hover {
    background-color: var(--bg-secondary, #f8f9fa);
}

.suggestion-item i {
    color: var(--text-muted, #6c757d);
    font-size: 12px;
}

.suggestion-item mark {
    background-color: var(--primary-color, #007bff);
    color: white;
    padding: 1px 3px;
    border-radius: 2px;
}
`;
document.head.appendChild(style);
