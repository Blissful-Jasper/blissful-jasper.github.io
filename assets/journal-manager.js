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
        this.rssParser = window.rssParser;
        this.aiService = window.aiSummaryService;
    }

    /**
     * 初始化期刊管理器
     */
    async initialize(journalsData) {
        this.journals = journalsData;
        console.log('Initializing Journal Manager with', this.journals.length, 'journals');
        
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
    async loadJournalArticles(journalName, rssUrl) {
        const cacheKey = `journal_${journalName}`;
        const cachedData = this.getCachedData(cacheKey);
        
        if (cachedData) {
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

        try {
            const articles = await this.fetchRSSFeed(rssUrl);
            const enrichedArticles = await this.enrichArticles(articles, journalName);
            
            this.articles.set(journalName, enrichedArticles);
            this.setCachedData(cacheKey, enrichedArticles);
            this.renderJournalArticles(journalName, enrichedArticles);
            
        } catch (error) {
            console.error(`Error loading articles for ${journalName}:`, error);
            this.showJournalError(journalName, error.message);
        }
    }

    /**
     * 获取RSS订阅内容
     */
    async fetchRSSFeed(rssUrl) {
        // 使用RSS解析服务 (例如 rss2json.com 或自建解析器)
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.status !== 'ok') throw new Error(data.message);
            
            return data.items.map(item => ({
                id: this.generateArticleId(item.link),
                title: this.cleanTitle(item.title),
                abstract: this.extractAbstract(item.description || item.content),
                link: item.link,
                publishDate: item.pubDate,
                authors: this.extractAuthors(item.author || item.description),
                image: this.extractImage(item.description || item.content),
                categories: item.categories || [],
                guid: item.guid
            }));
            
        } catch (error) {
            console.warn(`Failed to fetch RSS for ${rssUrl}, using sample data:`, error);
            return this.getSampleArticles();
        }
    }

    /**
     * 丰富文章数据 (添加AI总结等)
     */
    async enrichArticles(articles, journalName) {
        const enrichedArticles = [];
        
        for (const article of articles.slice(0, this.config.maxArticlesPerJournal)) {
            const enriched = { ...article };
            
            // 尝试获取AI总结
            try {
                enriched.aiSummary = await this.generateAISummary(article, journalName);
            } catch (error) {
                console.warn(`Failed to generate AI summary for ${article.title}:`, error);
            }
            
            // 获取文章元数据
            enriched.metadata = await this.extractMetadata(article.link);
            
            enrichedArticles.push(enriched);
        }
        
        return enrichedArticles;
    }

    /**
     * 生成AI总结
     */
    async generateAISummary(article, journalName) {
        const cacheKey = `ai_summary_${article.id}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) return cached;

        try {
            // 这里应该集成实际的AI服务 (OpenAI, Claude, Gemini等)
            const summary = await this.callAIService({
                title: article.title,
                abstract: article.abstract,
                journal: journalName,
                link: article.link
            });
            
            this.setCachedData(cacheKey, summary, 86400000); // 缓存24小时
            return summary;
            
        } catch (error) {
            console.warn(`AI summary generation failed:`, error);
            return this.generateFallbackSummary(article);
        }
    }

    /**
     * 调用AI服务
     */
    async callAIService(articleData) {
        // 模拟AI总结 - 实际应用中应该调用真实的AI API
        return {
            summary: `这篇发表在${articleData.journal}上的研究文章探讨了${this.extractKeywords(articleData.title).join('、')}等关键议题。研究采用了创新的方法论，为相关领域提供了新的见解。`,
            keyFindings: [
                '提出了新的理论框架',
                '验证了重要假设',
                '为实际应用提供了指导'
            ],
            methodology: '采用了定量分析和实验验证相结合的研究方法',
            limitations: '研究样本有限，需要进一步验证',
            implications: '为后续研究和实际应用提供了重要参考',
            confidence: 0.85
        };
    }

    /**
     * 渲染期刊文章
     */
    renderJournalArticles(journalName, articles) {
        const containerId = `articles-${journalName.toLowerCase().replace(/\s+/g, '-')}`;
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Container not found for journal: ${journalName}`);
            return;
        }

        container.innerHTML = '';
        
        if (!articles || articles.length === 0) {
            container.innerHTML = this.getNoArticlesHTML();
            return;
        }

        articles.forEach((article, index) => {
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
        articleDiv.style.animationDelay = `${index * 0.1}s`;
        
        const hasImage = article.image && article.image !== '';
        
        articleDiv.innerHTML = `
            <div class="article-content">
                ${hasImage ? `
                <div class="article-image">
                    <img src="${article.image}" 
                         alt="${article.title}" 
                         loading="lazy"
                         onerror="this.parentElement.style.display='none'">
                    <div class="article-category">${journalName}</div>
                </div>
                ` : ''}
                
                <div class="article-details">
                    <h4 class="article-title">
                        <a href="${article.link}" target="_blank" rel="noopener">${article.title}</a>
                    </h4>
                    
                    <div class="article-meta">
                        <span class="article-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(article.publishDate)}
                        </span>
                        ${article.authors ? `
                        <span class="article-authors">
                            <i class="fas fa-user"></i>
                            ${this.truncateAuthors(article.authors)}
                        </span>
                        ` : ''}
                    </div>
                    
                    <div class="article-abstract">
                        <p>${this.truncateText(article.abstract, 150)}</p>
                    </div>
                    
                    <div class="article-actions">
                        <a href="${article.link}" target="_blank" class="read-more-btn">
                            <i class="fas fa-external-link-alt"></i>
                            阅读原文
                        </a>
                        ${article.aiSummary ? `
                        <button class="ai-summary-btn" onclick="journalManager.showAISummary('${article.id}')">
                            <i class="fas fa-robot"></i>
                            AI 总结
                        </button>
                        ` : ''}
                        <button class="save-btn" onclick="journalManager.saveArticle('${article.id}')">
                            <i class="fas fa-bookmark"></i>
                            收藏
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return articleDiv;
    }

    /**
     * 显示AI总结
     */
    showAISummary(articleId) {
        const article = this.findArticleById(articleId);
        if (!article || !article.aiSummary) {
            this.showError('AI总结暂不可用');
            return;
        }

        const modal = document.getElementById('aiSummaryModal');
        const content = document.getElementById('aiSummaryContent');
        
        content.innerHTML = this.renderAISummaryContent(article.aiSummary, article);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * 渲染AI总结内容
     */
    renderAISummaryContent(summary, article) {
        return `
            <div class="ai-summary-content">
                <div class="summary-header">
                    <h4>${article.title}</h4>
                    <div class="confidence-indicator">
                        <span>可信度: ${Math.round(summary.confidence * 100)}%</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${summary.confidence * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="summary-section">
                    <h5><i class="fas fa-lightbulb"></i> 核心洞察</h5>
                    <p>${summary.summary}</p>
                </div>
                
                <div class="summary-section">
                    <h5><i class="fas fa-key"></i> 主要发现</h5>
                    <ul>
                        ${summary.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="summary-section">
                    <h5><i class="fas fa-flask"></i> 研究方法</h5>
                    <p>${summary.methodology}</p>
                </div>
                
                <div class="summary-section">
                    <h5><i class="fas fa-exclamation-triangle"></i> 研究局限</h5>
                    <p>${summary.limitations}</p>
                </div>
                
                <div class="summary-section">
                    <h5><i class="fas fa-arrow-right"></i> 实际意义</h5>
                    <p>${summary.implications}</p>
                </div>
            </div>
        `;
    }

    /**
     * 工具方法
     */
    generateArticleId(link) {
        return btoa(link).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    cleanTitle(title) {
        return title.replace(/<[^>]*>/g, '').trim();
    }

    extractAbstract(content) {
        if (!content) return '';
        const text = content.replace(/<[^>]*>/g, '');
        return text.substring(0, 500) + (text.length > 500 ? '...' : '');
    }

    extractAuthors(authorData) {
        if (!authorData) return '';
        if (typeof authorData === 'string') {
            const match = authorData.match(/authors?:?\s*([^.]+)/i);
            return match ? match[1].trim() : '';
        }
        return '';
    }

    extractImage(content) {
        if (!content) return null;
        const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
        return imgMatch ? imgMatch[1] : null;
    }

    extractKeywords(title) {
        const keywords = title.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 3);
        return keywords;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    truncateAuthors(authors) {
        if (!authors) return '';
        const authorList = authors.split(',').map(a => a.trim());
        return authorList.length > 2 ? 
            `${authorList.slice(0, 2).join(', ')} et al.` : 
            authors;
    }

    findArticleById(articleId) {
        for (const [journalName, articles] of this.articles) {
            const article = articles.find(a => a.id === articleId);
            if (article) return article;
        }
        return null;
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data, timeout = null) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now(),
            timeout: timeout || this.config.cacheTimeout
        });
    }

    getSampleArticles() {
        return [
            {
                id: 'sample-1',
                title: 'Sample Research Article Title',
                abstract: 'This is a sample abstract demonstrating the structure of academic articles...',
                link: '#',
                publishDate: new Date().toISOString(),
                authors: 'Sample Author, Another Author',
                image: 'https://via.placeholder.com/300x200/4285f4/white?text=Research'
            }
        ];
    }

    generateFallbackSummary(article) {
        return {
            summary: `这是关于"${article.title}"的研究概要。`,
            keyFindings: ['需要人工分析'],
            methodology: '详见原文',
            limitations: '需要进一步评估',
            implications: '需要专家解读',
            confidence: 0.3
        };
    }

    getNoArticlesHTML() {
        return `
            <div class="no-articles">
                <i class="fas fa-inbox"></i>
                <span>暂无文章</span>
            </div>
        `;
    }

    showJournalError(journalName, errorMessage) {
        const containerId = `articles-${journalName.toLowerCase().replace(/\s+/g, '-')}`;
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>无法加载 ${journalName} 的文章</span>
                    <small>${errorMessage}</small>
                    <button onclick="journalManager.retryLoadJournal('${journalName}')" class="retry-btn">
                        <i class="fas fa-redo"></i>
                        重试
                    </button>
                </div>
            `;
        }
    }

    showError(message) {
        // 简单的错误提示
        alert(message);
    }

    setupAutoRefresh() {
        setInterval(() => {
            this.loadAllJournals();
        }, this.config.updateInterval);
    }

    updateStatistics() {
        const totalArticles = Array.from(this.articles.values())
            .reduce((sum, articles) => sum + articles.length, 0);
        
        const totalSummaries = Array.from(this.articles.values())
            .reduce((sum, articles) => sum + articles.filter(a => a.aiSummary).length, 0);

        document.getElementById('totalArticles').textContent = totalArticles;
        document.getElementById('aiSummaries').textContent = totalSummaries;
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('zh-CN');
    }

    // 公共方法供HTML调用
    closeAISummary() {
        const modal = document.getElementById('aiSummaryModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    saveArticle(articleId) {
        // 实现文章保存功能
        console.log(`Saving article: ${articleId}`);
        // 这里可以集成到本地存储或数据库
    }

    retryLoadJournal(journalName) {
        const journal = this.journals.find(j => j.name === journalName);
        if (journal) {
            this.loadJournalArticles(journal.name, journal.rss_url);
        }
    }
}

// 全局实例
window.journalManager = new JournalManager();
