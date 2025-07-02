/**
 * DOI Information Fetcher
 * 自动获取DOI文献的引用和下载信息
 */

class DOIInfoFetcher {
    constructor() {
        this.apiEndpoints = {
            crossref: 'https://api.crossref.org/works/',
            semantic: 'https://api.semanticscholar.org/graph/v1/paper/',
            altmetric: 'https://api.altmetric.com/v1/doi/'
        };
        
        this.cache = new Map(); // 缓存已获取的信息
    }

    /**
     * 获取DOI的完整信息
     * @param {string} doi - DOI标识符
     * @returns {Promise<Object>} 文献信息
     */
    async fetchDOIInfo(doi) {
        if (this.cache.has(doi)) {
            return this.cache.get(doi);
        }

        try {
            const info = await this.fetchFromMultipleSources(doi);
            this.cache.set(doi, info);
            return info;
        } catch (error) {
            console.error('Error fetching DOI info:', error);
            return this.getDefaultInfo(doi);
        }
    }

    async fetchFromMultipleSources(doi) {
        const info = {
            doi: doi,
            title: '',
            authors: [],
            journal: '',
            year: '',
            citations: 0,
            downloads: 0,
            altmetric: 0,
            url: `https://doi.org/${doi}`
        };

        // 尝试从多个来源获取信息
        const sources = [
            () => this.fetchFromCrossRef(doi),
            () => this.fetchFromSemanticScholar(doi),
            () => this.fetchFromAltmetric(doi)
        ];

        const results = await Promise.allSettled(sources.map(fn => fn()));
        
        // 合并结果
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                Object.assign(info, result.value);
            }
        });

        return info;
    }

    async fetchFromCrossRef(doi) {
        try {
            const response = await fetch(`${this.apiEndpoints.crossref}${doi}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            const work = data.message;

            return {
                title: work.title?.[0] || '',
                authors: work.author?.map(a => `${a.given || ''} ${a.family || ''}`.trim()) || [],
                journal: work['container-title']?.[0] || work.publisher || '',
                year: work.published?.['date-parts']?.[0]?.[0]?.toString() || '',
                citations: work['is-referenced-by-count'] || 0
            };
        } catch (error) {
            console.error('CrossRef API error:', error);
            return null;
        }
    }

    async fetchFromSemanticScholar(doi) {
        try {
            const response = await fetch(`${this.apiEndpoints.semantic}DOI:${doi}?fields=title,authors,venue,year,citationCount,influentialCitationCount`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();

            return {
                title: data.title || '',
                authors: data.authors?.map(a => a.name) || [],
                journal: data.venue || '',
                year: data.year?.toString() || '',
                citations: data.citationCount || 0,
                influentialCitations: data.influentialCitationCount || 0
            };
        } catch (error) {
            console.error('Semantic Scholar API error:', error);
            return null;
        }
    }

    async fetchFromAltmetric(doi) {
        try {
            const response = await fetch(`${this.apiEndpoints.altmetric}${doi}`);

            if (!response.ok) return null;

            const data = await response.json();

            return {
                altmetric: data.score || 0,
                downloads: data.readers?.mendeley || 0 // Mendeley readers as proxy for downloads
            };
        } catch (error) {
            console.error('Altmetric API error:', error);
            return null;
        }
    }

    getDefaultInfo(doi) {
        return {
            doi: doi,
            title: 'Loading...',
            authors: [],
            journal: '',
            year: '',
            citations: 0,
            downloads: 0,
            altmetric: 0,
            url: `https://doi.org/${doi}`
        };
    }

    /**
     * 更新页面中的DOI信息显示
     * @param {string} doi - DOI标识符
     * @param {string} containerId - 容器元素ID
     */
    async updateDOIDisplay(doi, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // 显示加载状态
        this.showLoadingState(container);

        try {
            const info = await this.fetchDOIInfo(doi);
            this.renderDOIInfo(container, info);
        } catch (error) {
            this.showErrorState(container, doi);
        }
    }

    showLoadingState(container) {
        container.innerHTML = `
            <div class="doi-loading">
                <div class="loading-spinner"></div>
                <span>获取文献信息中...</span>
            </div>
        `;
    }

    showErrorState(container, doi) {
        container.innerHTML = `
            <div class="doi-error">
                <i class="fas fa-exclamation-triangle"></i>
                <span>无法获取 ${doi} 的信息</span>
                <a href="https://doi.org/${doi}" target="_blank" rel="noopener">查看原文</a>
            </div>
        `;
    }

    renderDOIInfo(container, info) {
        container.innerHTML = `
            <div class="doi-info-card">
                <div class="doi-header">
                    <h4 class="doi-title">${info.title}</h4>
                    <div class="doi-meta">
                        <span class="doi-authors">${info.authors.slice(0, 3).join(', ')}${info.authors.length > 3 ? ' et al.' : ''}</span>
                        <span class="doi-journal">${info.journal} (${info.year})</span>
                    </div>
                </div>
                <div class="doi-metrics">
                    <div class="metric-item">
                        <i class="fas fa-quote-right"></i>
                        <span class="metric-value">${info.citations}</span>
                        <span class="metric-label">引用</span>
                    </div>
                    <div class="metric-item">
                        <i class="fas fa-download"></i>
                        <span class="metric-value">${info.downloads}</span>
                        <span class="metric-label">下载</span>
                    </div>
                    ${info.altmetric > 0 ? `
                    <div class="metric-item">
                        <i class="fas fa-chart-line"></i>
                        <span class="metric-value">${info.altmetric}</span>
                        <span class="metric-label">Altmetric</span>
                    </div>
                    ` : ''}
                </div>
                <div class="doi-actions">
                    <a href="${info.url}" target="_blank" rel="noopener" class="doi-link">
                        <i class="fas fa-external-link-alt"></i>
                        查看原文
                    </a>
                    <button class="cite-button" onclick="showCitation('${info.doi}')">
                        <i class="fas fa-quote-left"></i>
                        引用格式
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 批量更新页面中的所有DOI信息
     */
    async updateAllDOIs() {
        const doiElements = document.querySelectorAll('[data-doi]');
        
        for (const element of doiElements) {
            const doi = element.dataset.doi;
            if (doi) {
                await this.updateDOIDisplay(doi, element.id);
                // 添加延迟避免API限制
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    /**
     * 生成引用格式
     * @param {string} doi - DOI标识符
     * @returns {Promise<Object>} 各种格式的引用
     */
    async generateCitations(doi) {
        const info = await this.fetchDOIInfo(doi);
        
        return {
            apa: this.formatAPA(info),
            mla: this.formatMLA(info),
            chicago: this.formatChicago(info),
            bibtex: this.formatBibTeX(info)
        };
    }

    formatAPA(info) {
        const authors = info.authors.length > 0 ? 
            `${info.authors.join(', ')}` : 'Unknown Author';
        return `${authors} (${info.year}). ${info.title}. ${info.journal}. https://doi.org/${info.doi}`;
    }

    formatMLA(info) {
        const authors = info.authors.length > 0 ? 
            `${info.authors.join(', ')}` : 'Unknown Author';
        return `${authors}. "${info.title}." ${info.journal}, ${info.year}, doi:${info.doi}.`;
    }

    formatChicago(info) {
        const authors = info.authors.length > 0 ? 
            `${info.authors.join(', ')}` : 'Unknown Author';
        return `${authors}. "${info.title}." ${info.journal} (${info.year}). https://doi.org/${info.doi}.`;
    }

    formatBibTeX(info) {
        const firstAuthor = info.authors[0]?.split(' ').pop() || 'Unknown';
        return `@article{${firstAuthor}${info.year},
  title={${info.title}},
  author={${info.authors.join(' and ')}},
  journal={${info.journal}},
  year={${info.year}},
  doi={${info.doi}}
}`;
    }
}

// 全局实例
window.doiFetcher = new DOIInfoFetcher();

// 显示引用格式的函数
async function showCitation(doi) {
    const citations = await window.doiFetcher.generateCitations(doi);
    
    const modal = document.createElement('div');
    modal.className = 'citation-modal';
    modal.innerHTML = `
        <div class="citation-content">
            <div class="citation-header">
                <h3>引用格式</h3>
                <button class="close-btn" onclick="this.closest('.citation-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="citation-formats">
                <div class="citation-format">
                    <h4>APA</h4>
                    <pre>${citations.apa}</pre>
                    <button onclick="navigator.clipboard.writeText('${citations.apa.replace(/'/g, "\\'")}')">复制</button>
                </div>
                <div class="citation-format">
                    <h4>MLA</h4>
                    <pre>${citations.mla}</pre>
                    <button onclick="navigator.clipboard.writeText('${citations.mla.replace(/'/g, "\\'")}')">复制</button>
                </div>
                <div class="citation-format">
                    <h4>Chicago</h4>
                    <pre>${citations.chicago}</pre>
                    <button onclick="navigator.clipboard.writeText('${citations.chicago.replace(/'/g, "\\'")}')">复制</button>
                </div>
                <div class="citation-format">
                    <h4>BibTeX</h4>
                    <pre>${citations.bibtex}</pre>
                    <button onclick="navigator.clipboard.writeText('${citations.bibtex.replace(/'/g, "\\'")}')">复制</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 页面加载完成后自动更新所有DOI信息
document.addEventListener('DOMContentLoaded', () => {
    window.doiFetcher.updateAllDOIs();
});
