/**
 * 简化的RSS解析器测试版
 * 专门用于调试和解决命名空间问题
 */

class SimpleRSSParser {
    constructor() {
        this.corsProxy = 'https://api.allorigins.win/raw?url=';
        this.debug = true;
    }

    log(...args) {
        if (this.debug) {
            console.log('[Simple RSS Parser]', ...args);
        }
    }

    /**
     * 安全的文本提取方法
     */
    safeGetText(item, tagName) {
        try {
            // 方法1: 直接querySelector (大多数情况有效)
            let element = item.querySelector(tagName);
            if (element) {
                return element.textContent.trim();
            }

            // 方法2: 如果包含命名空间，尝试不同方法
            if (tagName.includes(':')) {
                const parts = tagName.split(':');
                const localName = parts[parts.length - 1];
                
                // 尝试getElementsByTagName
                const elements = item.getElementsByTagName(tagName);
                if (elements.length > 0) {
                    return elements[0].textContent.trim();
                }
                
                // 尝试只使用本地名称
                const localElements = item.getElementsByTagName(localName);
                if (localElements.length > 0) {
                    return localElements[0].textContent.trim();
                }
                
                // 遍历所有子元素查找匹配
                const allElements = item.querySelectorAll('*');
                for (const el of allElements) {
                    if (el.tagName === tagName || el.tagName === localName || 
                        el.tagName.endsWith(':' + localName) || el.localName === localName) {
                        return el.textContent.trim();
                    }
                }
            }

            return null;
        } catch (error) {
            this.log(`Error getting text for ${tagName}:`, error.message);
            return null;
        }
    }

    /**
     * 简化的文章提取
     */
    extractSimpleArticle(item, index) {
        try {
            this.log(`Processing item ${index + 1}:`, item.tagName);

            // 基本信息提取
            const title = this.safeGetText(item, 'title') || `Article ${index + 1}`;
            
            // 链接提取 - 多种方法
            let link = '#';
            try {
                const linkEl = item.querySelector('link');
                if (linkEl) {
                    link = linkEl.textContent.trim() || linkEl.getAttribute('href') || '#';
                }
                if (link === '#') {
                    const guidEl = item.querySelector('guid');
                    if (guidEl && guidEl.textContent.startsWith('http')) {
                        link = guidEl.textContent.trim();
                    }
                }
            } catch (e) {
                this.log('Link extraction error:', e.message);
            }

            // 描述提取
            const description = this.safeGetText(item, 'description') || 
                               this.safeGetText(item, 'summary') || 
                               this.safeGetText(item, 'content') ||
                               '暂无摘要';

            // 作者提取 - 安全方法
            let author = 'Unknown Author';
            try {
                author = this.safeGetText(item, 'author') ||
                        this.safeGetText(item, 'creator') ||
                        this.safeGetText(item, 'managingEditor') ||
                        'Multiple Authors';
                
                // 特别处理dc:creator
                if (!author || author === 'Multiple Authors') {
                    const dcCreators = item.getElementsByTagName('creator');
                    if (dcCreators.length > 0) {
                        author = dcCreators[0].textContent.trim();
                    }
                }
            } catch (e) {
                this.log('Author extraction error:', e.message);
            }

            // 日期提取
            const pubDate = this.safeGetText(item, 'pubDate') || 
                           this.safeGetText(item, 'published') ||
                           this.safeGetText(item, 'updated') ||
                           new Date().toISOString();

            const article = {
                id: `simple_article_${Date.now()}_${index}`,
                title: this.cleanText(title),
                abstract: this.cleanText(description),
                link: link,
                publishDate: this.parseDate(pubDate),
                authors: this.cleanText(author),
                image: null, // 暂时跳过图片解析
                category: this.safeGetText(item, 'category') || 'General',
                journal: 'Academic Journal'
            };

            this.log(`Successfully extracted: ${article.title}`);
            return article;

        } catch (error) {
            console.error(`Failed to extract article ${index + 1}:`, error);
            
            // 返回错误占位符
            return {
                id: `error_article_${Date.now()}_${index}`,
                title: `解析错误 - 文章 ${index + 1}`,
                abstract: '该文章在解析时发生错误，请稍后重试或直接访问原文。',
                link: '#',
                publishDate: new Date().toISOString(),
                authors: 'System',
                image: null,
                category: 'Error',
                journal: 'Error',
                isError: true
            };
        }
    }

    /**
     * 清理文本
     */
    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/<[^>]*>/g, '') // 移除HTML标签
            .replace(/\s+/g, ' ')    // 合并空格
            .trim()
            .substring(0, 500);      // 限制长度
    }

    /**
     * 解析日期
     */
    parseDate(dateString) {
        try {
            if (!dateString) return new Date().toISOString();
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    }

    /**
     * 简化的RSS解析主方法
     */
    async parseRSSSimple(rssUrl) {
        try {
            this.log('Parsing RSS:', rssUrl);
            
            const response = await fetch(this.corsProxy + encodeURIComponent(rssUrl));
            const xmlText = await response.text();
            
            if (!xmlText || xmlText.length < 100) {
                throw new Error('Empty or invalid RSS response');
            }

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // 检查解析错误
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('XML parsing failed: ' + parseError.textContent);
            }

            // 查找文章项目
            let items = xmlDoc.querySelectorAll('item');
            if (items.length === 0) {
                items = xmlDoc.querySelectorAll('entry');
            }

            this.log(`Found ${items.length} items to process`);

            if (items.length === 0) {
                return [];
            }

            const articles = [];
            for (let i = 0; i < Math.min(items.length, 5); i++) {
                const article = this.extractSimpleArticle(items[i], i);
                if (article) {
                    articles.push(article);
                }
            }

            this.log(`Successfully extracted ${articles.length} articles`);
            return articles;

        } catch (error) {
            console.error('RSS parsing failed:', error);
            return [{
                id: `fallback_${Date.now()}`,
                title: 'RSS解析失败',
                abstract: `无法解析RSS源：${error.message}`,
                link: rssUrl,
                publishDate: new Date().toISOString(),
                authors: 'System',
                image: null,
                category: 'Error',
                journal: 'Error',
                isError: true
            }];
        }
    }
}

// 创建简化解析器实例
window.simpleRSSParser = new SimpleRSSParser();
