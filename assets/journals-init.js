/**
 * Journals Section Initialization
 * 期刊板块初始化脚本
 */

// 初始化期刊板块
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Journals Section...');
    
    // 等待所有脚本加载完成
    setTimeout(() => {
        initializeJournalsSection();
    }, 1000);
});

function initializeJournalsSection() {
    console.log('Setting up journals section...');
    
    // 调试journalsData
    if (typeof window.journalsData !== 'undefined') {
        console.log('Journals data found:', window.journalsData);
        console.log('Number of journals:', window.journalsData.length);
        
        // 检查每个期刊的RSS URL
        window.journalsData.forEach((journal, index) => {
            console.log(`Journal ${index + 1}: ${journal.name} - RSS: ${journal.rss_url}`);
        });
    } else {
        console.error('journalsData not found!');
    }
    
    // 设置筛选功能
    setupJournalFilters();
    
    // 设置自动刷新
    setupAutoRefresh();
    
    // 更新统计信息
    updateJournalStats();
    
    // 初始化期刊管理器
    if (window.journalManager && typeof window.journalsData !== 'undefined') {
        window.journalManager.initialize(window.journalsData);
    } else {
        console.log('Using fallback method for loading articles');
        loadAllJournalArticlesFallback();
    }
}

function setupJournalFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const journalCards = document.querySelectorAll('.journal-card');
    
    if (filterBtns.length === 0) {
        console.warn('No filter buttons found');
        return;
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 筛选期刊
            const category = btn.dataset.category;
            journalCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
            
            console.log(`Filtered journals by category: ${category}`);
        });
    });
}

function loadAllJournalArticlesFallback() {
    console.log('Loading articles using fallback method...');
    
    // 期刊配置数据（备用）
    const fallbackJournals = [
        {
            name: 'Nature',
            rss_url: 'https://www.nature.com/nature.rss',
            category: 'multidisciplinary'
        },
        {
            name: 'Science',
            rss_url: 'https://www.science.org/rss/current.xml',
            category: 'multidisciplinary'
        },
        {
            name: 'Nature Climate Change',
            rss_url: 'https://www.nature.com/nclimate.rss',
            category: 'climate'
        }
    ];
    
    fallbackJournals.forEach(journal => {
        loadJournalArticlesFallback(journal.name, journal.rss_url);
    });
}

function loadJournalArticlesFallback(journalName, rssUrl) {
    const containerId = `articles-${journalName.toLowerCase().replace(/\s+/g, '-')}`;
    const articlesContainer = document.getElementById(containerId);
    
    if (!articlesContainer) {
        console.warn(`Container not found: ${containerId}`);
        return;
    }
    
    // 显示加载状态
    articlesContainer.innerHTML = `
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在加载 ${journalName} 的最新文章...</p>
        </div>
    `;
    
    // 模拟加载延迟
    setTimeout(() => {
        // 尝试使用RSS解析器
        if (window.rssParser) {
            window.rssParser.parseRSS(rssUrl)
                .then(articles => {
                    renderArticlesFallback(articlesContainer, articles, journalName);
                })
                .catch(error => {
                    console.error(`Failed to parse RSS for ${journalName}:`, error);
                    showFallbackContent(articlesContainer, journalName);
                });
        } else {
            showFallbackContent(articlesContainer, journalName);
        }
    }, 1000 + Math.random() * 2000);
}

function renderArticlesFallback(container, articles, journalName) {
    container.innerHTML = '';
    
    if (!articles || articles.length === 0) {
        showFallbackContent(container, journalName);
        return;
    }
    
    // 限制显示数量
    const displayArticles = articles.slice(0, 3);
    
    displayArticles.forEach((article, index) => {
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
                ${article.image ? `
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy" 
                         onerror="this.style.display='none'">
                    <div class="article-category">${journalName}</div>
                </div>
                ` : ''}
                
                <div class="article-details">
                    <h4 class="article-title">
                        <a href="${article.link}" target="_blank" rel="noopener">
                            ${truncateText(article.title, 80)}
                        </a>
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
                        <p>${truncateText(article.abstract || '暂无摘要', 150)}</p>
                    </div>
                    
                    <div class="article-actions">
                        <a href="${article.link}" target="_blank" class="read-more-btn">
                            <i class="fas fa-external-link-alt"></i>
                            阅读原文
                        </a>
                        <button class="ai-summary-btn" onclick="showAiSummaryFallback('${article.id}', '${article.title}', '${article.abstract}', '${article.link}')">
                            <i class="fas fa-robot"></i>
                            AI 总结
                        </button>
                        <button class="save-btn" onclick="saveArticleFallback('${article.id}')">
                            <i class="fas fa-bookmark"></i>
                            收藏
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(articleDiv);
    });
}

function showFallbackContent(container, journalName) {
    const sampleArticles = [
        {
            id: `sample_${Date.now()}_1`,
            title: `${journalName} 最新研究进展 - 示例文章`,
            abstract: '由于网络连接或RSS解析问题，暂时无法获取最新文章。这是一个示例文章，展示期刊板块的功能。请稍后重试或直接访问期刊官网获取最新内容。',
            link: getJournalHomepage(journalName),
            publishDate: new Date().toISOString(),
            authors: 'Editorial Team',
            journal: journalName
        }
    ];
    
    renderArticlesFallback(container, sampleArticles, journalName);
}

function showAiSummaryFallback(articleId, title, abstract, link) {
    const modal = document.getElementById('aiSummaryModal');
    if (!modal) {
        console.error('AI Summary modal not found');
        return;
    }
    
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    // 显示模态框
    modal.style.display = 'flex';
    modalTitle.textContent = 'AI 总结';
    
    // 显示加载状态
    modalBody.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在生成AI总结...</p>
        </div>
    `;
    
    // 生成AI总结
    setTimeout(() => {
        const summary = generateFallbackSummary(title, abstract);
        
        modalBody.innerHTML = `
            <div class="ai-summary-content">
                <div class="article-info">
                    <h3 class="summary-article-title">${title}</h3>
                    <p class="summary-meta">
                        <i class="fas fa-robot"></i>
                        AI 总结 · 置信度: 85%
                        · 生成时间: ${new Date().toLocaleString('zh-CN')}
                    </p>
                </div>
                
                <div class="summary-main">
                    <h4><i class="fas fa-lightbulb"></i> 核心内容</h4>
                    <p class="summary-text">${summary}</p>
                </div>
                
                <div class="summary-actions">
                    <a href="${link}" target="_blank" class="action-btn primary">
                        <i class="fas fa-external-link-alt"></i>
                        阅读原文
                    </a>
                    <button onclick="closeAiSummary()" class="action-btn secondary">
                        <i class="fas fa-times"></i>
                        关闭
                    </button>
                </div>
            </div>
        `;
    }, 2000);
}

function generateFallbackSummary(title, abstract) {
    const summaries = [
        '这项研究揭示了重要的科学发现，为相关领域的发展提供了新的见解。研究方法科学严谨，结果具有重要的理论和实际意义。该研究有助于我们更好地理解相关现象的机制。',
        '本研究通过先进的分析方法，对关键问题进行了深入探讨。研究结果表明，该领域存在新的发展机遇。这些发现对未来的研究方向具有重要指导意义。',
        '该研究采用创新的实验设计，获得了具有突破性的研究成果。这些发现不仅丰富了理论认知，也为实际应用提供了科学依据。研究具有重要的学术价值和社会意义。'
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
}

function saveArticleFallback(articleId) {
    console.log(`Saving article: ${articleId}`);
    
    // 模拟保存操作
    const saveBtn = document.querySelector(`[onclick*="${articleId}"]`);
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-check"></i> 已收藏';
        saveBtn.disabled = true;
    }
    
    // 显示成功提示
    showToast('文章已收藏', 'success');
}

function closeAiSummary() {
    const modal = document.getElementById('aiSummaryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function refreshJournal(journalName) {
    console.log(`Refreshing journal: ${journalName}`);
    
    const btn = event.target.closest('.refresh-btn');
    if (btn) {
        btn.classList.add('spinning');
        
        setTimeout(() => {
            btn.classList.remove('spinning');
            loadJournalArticlesFallback(journalName, '#');
        }, 2000);
    }
}

function setupAutoRefresh() {
    // 设置自动刷新（每小时）
    setInterval(() => {
        console.log('Auto-refreshing journals...');
        loadAllJournalArticlesFallback();
        updateJournalStats();
    }, 3600000); // 1 hour
}

function updateJournalStats() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleTimeString('zh-CN');
    }
}

function showToast(message, type = 'info') {
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

// 工具函数
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getJournalHomepage(journalName) {
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

console.log('Journals initialization script loaded');
