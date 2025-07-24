/**
 * Academic Journal Manager - Enhanced Version
 * 学术期刊RSS订阅和AI总结管理系统 - 增强版
 */

class JournalManager {
    constructor() {
        this.journals = [];
        this.articles = new Map();
        this.aiSummaries = new Map();
        this.savedArticles = new Set();
        this.cache = new Map();
        this.config = {
            maxArticlesPerJournal: 5,
            cacheTimeout: 3600000, // 1 hour
            aiSummaryProvider: 'mock',
            updateInterval: 86400000 // 24 hours
        };
        
        // 绑定RSS解析器和AI服务
        this.rssParser = null;
        this.aiService = null;
    }

    /**
     * 初始化期刊管理器
     */
    async initialize(journalsData) {
        this.journals = journalsData;
        console.log('Initializing Journal Manager with', this.journals.length, 'journals');
        
        // 等待依赖服务加载
        await this.waitForServices();
        
        // 设置AI服务提供商
        if (this.aiService) {
            this.aiService.setProvider(this.config.aiSummaryProvider);
        }
        
        await this.loadAllJournals();
        this.setupAutoRefresh();
        this.updateStatistics();
        this.loadSavedArticles();
    }

    /**
     * 等待依赖服务加载
     */
    async waitForServices() {
        let attempts = 0;
        const maxAttempts = 50; // 5秒最大等待时间
        
        while (attempts < maxAttempts) {
            if (window.rssParser && window.aiSummaryService) {
                this.rssParser = window.rssParser;
                this.aiService = window.aiSummaryService;
                console.log('Services loaded successfully');
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.warn('Services not loaded, using fallback methods');
    }

    /**
     * 加载所有期刊的最新文章
     */
    async loadAllJournals() {
        console.log('Loading articles for all journals...');
        
        const loadPromises = this.journals.map(journal => 
            this.loadJournalArticles(journal.name, journal.rss_url)
                .catch(error => {
                    console.error(`Failed to load ${journal.name}:`, error);
                    return [];
                })
        );
        
        const results = await Promise.allSettled(loadPromises);
        console.log('Finished loading articles. Results:', results.length);
    }

    /**
     * 加载单个期刊的文章
     */
    async loadJournalArticles(journalName, rssUrl, skipCache = false) {
        // 验证RSS URL
        if (!rssUrl || rssUrl === '#' || rssUrl === '' || rssUrl === 'undefined') {
            console.warn(`Invalid RSS URL for journal ${journalName}: ${rssUrl}`);
            return await this.getFallbackArticles(journalName);
        }
        
        const cacheKey = `journal_${journalName}`;
        const cachedData = this.getCachedData(cacheKey);
        
        if (!skipCache && cachedData) {
            console.log(`Using cached data for ${journalName}`);
            this.renderJournalArticles(journalName, cachedData);
            return cachedData;
        }
        
        try {
            console.log(`Fetching articles for ${journalName} from ${rssUrl}`);
            
            // 使用RSS解析器获取文章
            const articles = this.rssParser ? 
                await this.rssParser.parseRSS(rssUrl) :
                await this.getFallbackArticles(journalName);
            
            // 缓存结果
            this.setCachedData(cacheKey, articles);
            
            // 存储到articles映射中
            this.articles.set(journalName, articles);
            
            // 渲染文章
            this.renderJournalArticles(journalName, articles);
            
            return articles;
        } catch (error) {
            console.error(`Error loading articles for ${journalName}:`, error);
            const fallbackArticles = await this.getFallbackArticles(journalName);
            this.renderJournalArticles(journalName, fallbackArticles);
            return fallbackArticles;
        }
    }

    /**
     * 渲染期刊文章
     */
    renderJournalArticles(journalName, articles) {
        const container = document.getElementById(`articles-${journalName.toLowerCase().replace(/\s+/g, '-')}`);
        
        if (!container) {
            console.warn(`Container not found for journal: ${journalName}`);
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        if (!articles || articles.length === 0) {
            container.innerHTML = `
                <div class="no-articles">
                    <i class="fas fa-info-circle"></i>
                    <p>暂无最新文章</p>
                </div>
            `;
            return;
        }
        
        // 限制显示的文章数量
        const displayArticles = articles.slice(0, this.config.maxArticlesPerJournal);
        
        displayArticles.forEach((article, index) => {
            const articleElement = this.createArticleElement(article, journalName, index);
            container.appendChild(articleElement);
        });
    }

    /**
     * 创建文章元素
     */
    createArticleElement(article, journalName, index) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article-item';
        articleDiv.setAttribute('data-article-id', article.id);
        
        const publishDate = article.publishDate ? new Date(article.publishDate) : new Date();
        const formattedDate = publishDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        articleDiv.innerHTML = `
            <div class="article-content">
                ${article.image && !article.isFallback ? `
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy" 
                         onerror="this.style.display='none'">
                    <div class="article-category">${journalName}</div>
                </div>
                ` : ''}
                
                <div class="article-details">
                    <h4 class="article-title">
                        <a href="${article.link}" target="_blank" rel="noopener">${this.truncateText(article.title, 80)}</a>
                    </h4>
                    
                    <div class="article-meta">
                        <span class="article-date">
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span class="article-authors">
                            <i class="fas fa-user"></i>
                            ${article.authors || 'Multiple Authors'}
                        </span>
                    </div>
                    
                    <div class="article-abstract">
                        <p>${this.truncateText(article.abstract || '暂无摘要', 150)}</p>
                    </div>
                    
                    <div class="article-actions">
                        <a href="${article.link}" target="_blank" class="read-more-btn">
                            <i class="fas fa-external-link-alt"></i>
                            阅读原文
                        </a>
                        ${!article.isFallback ? `
                        <button class="ai-summary-btn" onclick="journalManager.showAISummary('${article.id}')">
                            <i class="fas fa-robot"></i>
                            AI 总结
                        </button>
                        <button class="save-btn ${this.savedArticles.has(article.id) ? 'saved' : ''}" 
                                onclick="journalManager.toggleSaveArticle('${article.id}')">
                            <i class="fas fa-bookmark"></i>
                            ${this.savedArticles.has(article.id) ? '已收藏' : '收藏'}
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        return articleDiv;
    }

    /**
     * 显示AI总结
     */
    async showAISummary(articleId) {
        const modal = document.getElementById('aiSummaryModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        const loadingSpinner = modal.querySelector('.loading-spinner');
        
        if (!modal) {
            console.error('AI Summary modal not found');
            return;
        }
        
        // 显示模态框
        modal.style.display = 'flex';
        modalTitle.textContent = 'AI 总结';
        
        // 显示加载状态
        modalBody.innerHTML = '';
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
        
        // 查找对应的文章
        const article = this.findArticleById(articleId);
        if (!article) {
            this.showSummaryError(modalBody, loadingSpinner, '文章未找到');
            return;
        }
        
        try {
            // 生成AI总结
            const summary = this.aiService ? 
                await this.aiService.generateSummary(article, 'zh-CN') :
                await this.generateFallbackSummary(article);
            
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            
            this.renderAiSummary(modalBody, summary, article);
        } catch (error) {
            console.error('Error generating AI summary:', error);
            this.showSummaryError(modalBody, loadingSpinner, 'AI总结生成失败，请稍后重试');
        }
    }

    /**
     * 渲染AI总结
     */
    renderAiSummary(container, summary, article) {
        container.innerHTML = `
            <div class="ai-summary-content">
                <div class="article-info">
                    <h3 class="summary-article-title">${article.title}</h3>
                    <p class="summary-meta">
                        <i class="fas fa-robot"></i>
                        AI 总结 · 置信度: ${Math.round(summary.confidence * 100)}%
                        · 生成时间: ${new Date(summary.generatedAt).toLocaleString('zh-CN')}
                    </p>
                </div>
                
                <div class="summary-main">
                    <h4><i class="fas fa-lightbulb"></i> 核心内容</h4>
                    <p class="summary-text">${summary.summary}</p>
                </div>
                
                ${summary.keyPoints && summary.keyPoints.length > 0 ? `
                <div class="key-points">
                    <h4><i class="fas fa-key"></i> 关键要点</h4>
                    <ul class="key-points-list">
                        ${summary.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="summary-actions">
                    <a href="${article.link}" target="_blank" class="action-btn primary">
                        <i class="fas fa-external-link-alt"></i>
                        阅读原文
                    </a>
                    <button onclick="journalManager.regenerateSummary('${article.id}')" class="action-btn secondary">
                        <i class="fas fa-redo"></i>
                        重新生成
                    </button>
                    <button onclick="journalManager.saveSummary('${article.id}')" class="action-btn secondary">
                        <i class="fas fa-save"></i>
                        保存总结
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 显示总结错误
     */
    showSummaryError(container, loadingSpinner, message) {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="journalManager.closeAiSummary()" class="action-btn">关闭</button>
            </div>
        `;
    }

    /**
     * 关闭AI总结模态框
     */
    closeAiSummary() {
        const modal = document.getElementById('aiSummaryModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * 重新生成总结
     */
    async regenerateSummary(articleId) {
        // 清除缓存并重新生成
        if (this.aiService && this.aiService.cache) {
            const cacheKey = `summary_${articleId}_zh-CN`;
            this.aiService.cache.delete(cacheKey);
        }
        
        // 重新显示总结
        await this.showAISummary(articleId);
    }

    /**
     * 保存总结
     */
    saveSummary(articleId) {
        console.log(`Saving summary for article ${articleId}`);
        
        // 在实际应用中，这里会保存到本地存储或服务器
        const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
        if (!savedSummaries.includes(articleId)) {
            savedSummaries.push(articleId);
            localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));
        }
        
        // 显示保存成功提示
        this.showToast('总结已保存', 'success');
    }

    /**
     * 加载更多文章
     * @param {string} journalName - 期刊名称
     */
    async loadMoreArticles(journalName) {
        try {
            console.log(`Loading more articles for: ${journalName}`);
            
            const journal = this.journals.find(j => j.name === journalName);
            if (!journal) {
                console.error(`Journal not found: ${journalName}`);
                return;
            }
            
            // 显示加载指示器
            this.showLoadingIndicator(journalName);
            
            // 重新获取文章（跳过缓存）
            const articles = await this.loadJournalArticles(journal, true);
            
            if (articles && articles.length > 0) {
                // 更新UI显示更多文章
                this.displayMoreArticles(journalName, articles);
                console.log(`Loaded ${articles.length} more articles for ${journalName}`);
            } else {
                console.log(`No additional articles found for ${journalName}`);
                this.showNoMoreArticlesMessage(journalName);
            }
            
        } catch (error) {
            console.error(`Error loading more articles for ${journalName}:`, error);
            this.showErrorMessage(journalName, '无法加载更多文章');
        } finally {
            this.hideLoadingIndicator(journalName);
        }
    }

    /**
     * 显示加载指示器
     */
    showLoadingIndicator(journalName) {
        const container = document.querySelector(`[data-journal="${journalName}"]`);
        if (container) {
            const loadButton = container.querySelector('.load-more-btn');
            if (loadButton) {
                loadButton.textContent = '加载中...';
                loadButton.disabled = true;
            }
        }
    }

    /**
     * 隐藏加载指示器
     */
    hideLoadingIndicator(journalName) {
        const container = document.querySelector(`[data-journal="${journalName}"]`);
        if (container) {
            const loadButton = container.querySelector('.load-more-btn');
            if (loadButton) {
                loadButton.textContent = '加载更多';
                loadButton.disabled = false;
            }
        }
    }

    /**
     * 显示更多文章
     */
    displayMoreArticles(journalName, articles) {
        const container = document.querySelector(`[data-journal="${journalName}"] .articles-grid`);
        if (container && articles.length > 0) {
            // 这里应该调用UI组件来显示更多文章
            // 具体实现取决于UI框架
            if (window.journalUI && window.journalUI.appendArticles) {
                window.journalUI.appendArticles(journalName, articles);
            }
        }
    }

    /**
     * 显示没有更多文章的消息
     */
    showNoMoreArticlesMessage(journalName) {
        const container = document.querySelector(`[data-journal="${journalName}"]`);
        if (container) {
            const loadButton = container.querySelector('.load-more-btn');
            if (loadButton) {
                loadButton.textContent = '暂无更多';
                loadButton.disabled = true;
                setTimeout(() => {
                    loadButton.textContent = '加载更多';
                    loadButton.disabled = false;
                }, 3000);
            }
        }
    }

    /**
     * 显示错误消息
     */
    showErrorMessage(journalName, message) {
        const container = document.querySelector(`[data-journal="${journalName}"]`);
        if (container) {
            const loadButton = container.querySelector('.load-more-btn');
            if (loadButton) {
                loadButton.textContent = message;
                loadButton.disabled = true;
                setTimeout(() => {
                    loadButton.textContent = '加载更多';
                    loadButton.disabled = false;
                }, 3000);
            }
        }
    }

    /**
     * 显示toast通知
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * 查找文章by ID
     */
    findArticleById(articleId) {
        for (const [journalName, articles] of this.articles.entries()) {
            const article = articles.find(a => a.id === articleId);
            if (article) {
                return article;
            }
        }
        
        // 从DOM中提取文章信息（备用方法）
        const articleElement = document.querySelector(`[data-article-id="${articleId}"]`);
        if (articleElement) {
            return this.extractArticleFromElement(articleElement);
        }
        
        return null;
    }

    /**
     * 从DOM元素提取文章信息
     */
    extractArticleFromElement(element) {
        const titleElement = element.querySelector('.article-title a');
        const abstractElement = element.querySelector('.article-abstract p');
        const linkElement = element.querySelector('.article-title a');
        
        return {
            id: element.getAttribute('data-article-id') || Date.now().toString(),
            title: titleElement ? titleElement.textContent : '未知标题',
            abstract: abstractElement ? abstractElement.textContent : '暂无摘要',
            link: linkElement ? linkElement.href : '#'
        };
    }

    /**
     * 获取备用文章
     */
    async getFallbackArticles(journalName) {
        return [
            {
                id: `fallback_${Date.now()}_1`,
                title: `${journalName} 最新研究成果`,
                abstract: '由于网络连接问题，暂时无法获取最新文章。请稍后重试或直接访问期刊官网获取最新内容。',
                link: this.getJournalHomepage(journalName),
                publishDate: new Date().toISOString(),
                authors: 'Editorial Team',
                image: null,
                category: 'Notice',
                journal: journalName,
                isFallback: true
            }
        ];
    }

    /**
     * 获取备用AI总结
     */
    async generateFallbackSummary(article) {
        return {
            summary: '由于AI服务暂时不可用，无法生成智能总结。建议您直接阅读原文获取详细信息。这篇文章来自权威学术期刊，具有重要的研究价值。',
            keyPoints: ['AI服务暂时不可用', '建议阅读原文', '来自权威期刊'],
            confidence: 0.0,
            wordCount: 50,
            language: 'zh-CN',
            generatedAt: new Date().toISOString(),
            provider: 'fallback',
            isError: true
        };
    }

    /**
     * 获取期刊主页
     */
    getJournalHomepage(journalName) {
        const homepageMap = {
            'Nature': 'https://www.nature.com/',
            'Science': 'https://www.science.org/',
            'Science Advances': 'https://www.science.org/journal/sciadv',
            'Science News': 'https://www.science.org/news',
            'Nature Climate Change': 'https://www.nature.com/nclimate/',
            'Nature Geoscience': 'https://www.nature.com/ngeo/',
            'Geophysical Research Letters': 'https://agupubs.onlinelibrary.wiley.com/journal/19448007',
            'Reviews of Geophysics': 'https://agupubs.onlinelibrary.wiley.com/journal/19422466',
            'Journal of the Atmospheric Sciences': 'https://journals.ametsoc.org/view/journals/atsc/atsc-overview.xml',
            'Journal of Climate': 'https://journals.ametsoc.org/view/journals/clim/clim-overview.xml',
            'Climate Dynamics': 'https://link.springer.com/journal/382'
        };
        
        return homepageMap[journalName] || '#';
    }

    /**
     * 截断文本
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    /**
     * 设置自动刷新
     */
    setupAutoRefresh() {
        setInterval(() => {
            console.log('Auto-refreshing journal articles...');
            this.loadAllJournals();
            this.updateStatistics();
        }, this.config.updateInterval);
    }

    /**
     * 更新统计信息
     */
    updateStatistics() {
        const totalArticles = Array.from(this.articles.values()).reduce((sum, articles) => sum + articles.length, 0);
        const lastUpdateElement = document.getElementById('lastUpdate');
        const totalArticlesElement = document.getElementById('totalArticles');
        
        if (lastUpdateElement) {
            lastUpdateElement.textContent = new Date().toLocaleTimeString('zh-CN');
        }
        
        if (totalArticlesElement) {
            totalArticlesElement.textContent = totalArticles.toString();
        }
    }

    /**
     * 加载已保存的文章
     */
    loadSavedArticles() {
        const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        this.savedArticles = new Set(saved);
    }

    /**
     * 保存已收藏的文章
     */
    saveSavedArticles() {
        localStorage.setItem('savedArticles', JSON.stringify(Array.from(this.savedArticles)));
    }

    /**
     * 缓存管理
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
}

// 创建全局实例
window.journalManager = new JournalManager();

// 全局函数，供HTML按钮调用
window.loadMoreArticles = function(journalName) {
    if (window.journalManager) {
        return window.journalManager.loadMoreArticles(journalName);
    } else {
        console.error('Journal Manager not initialized');
    }
};

// 其他全局函数
window.saveArticle = function(articleId) {
    if (window.journalManager) {
        return window.journalManager.saveArticle(articleId);
    }
};

window.refreshJournal = function(journalName) {
    if (window.journalManager) {
        return window.journalManager.refreshJournal(journalName);
    }
};
