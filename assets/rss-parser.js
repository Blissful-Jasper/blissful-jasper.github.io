/**
 * RSS Feed Parser for Academic Journals
 * 学术期刊RSS解析器
 */

class RSSParser {
    constructor() {
        this.corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/',
            'https://api.codetabs.com/v1/proxy?quest='
        ];
        this.currentProxyIndex = 0;
        this.cache = new Map();
        this.cacheTimeout = 3600000; // 1 hour
        this.debug = true; // 调试模式开关
    }

    /**
     * 调试日志
     */
    log(...args) {
        if (this.debug) {
            console.log('[RSS Parser]', ...args);
        }
    }

    /**
     * 调试警告
     */
    warn(...args) {
        if (this.debug) {
            console.warn('[RSS Parser]', ...args);
        }
    }

    /**
     * 解析RSS订阅（带重试机制）
     * @param {string} rssUrl - RSS订阅地址
     * @returns {Promise<Array>} 文章列表
     */
    async parseRSS(rssUrl, retryCount = 0) {
        const cacheKey = `rss_${rssUrl}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            this.log(`Using cached data for ${rssUrl}`);
            return cached;
        }

        const maxRetries = 3;
        const retryDelay = 1000 * (retryCount + 1); // 递增延迟

        // 获取RSS变体（备用源）
        const rssVariants = this.getRSSVariants(rssUrl);
        
        for (let variantIndex = 0; variantIndex < rssVariants.length; variantIndex++) {
            const currentRssUrl = rssVariants[variantIndex];
            
            try {
                this.log(`Fetching RSS from ${currentRssUrl} (variant ${variantIndex + 1}/${rssVariants.length}, attempt ${retryCount + 1}/${maxRetries + 1})`);
                
                // 选择CORS代理
                const corsProxy = this.corsProxies[this.currentProxyIndex % this.corsProxies.length];
                this.log(`Using CORS proxy: ${corsProxy}`);
                
                // 使用CORS代理获取RSS内容
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
                
                const response = await fetch(corsProxy + encodeURIComponent(currentRssUrl), {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const xmlText = await response.text();
                
                if (!xmlText || xmlText.length < 100) {
                    throw new Error('RSS feed appears to be empty or invalid');
                }
                
                // 检查是否返回的是HTML而不是XML
                if (xmlText.toLowerCase().includes('<!doctype html') || 
                    xmlText.toLowerCase().includes('<html')) {
                    throw new Error('Server returned HTML instead of RSS XML - possibly a server error or incorrect URL');
                }
                
                // 解析XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                
                // 检查解析错误
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    throw new Error(`XML parsing error: ${parseError.textContent}`);
                }
                
                // 检查是否是有效的RSS/Atom格式
                const isRSS = xmlDoc.querySelector('rss') || xmlDoc.querySelector('channel');
                const isAtom = xmlDoc.querySelector('feed');
                
                if (!isRSS && !isAtom) {
                    throw new Error('Document does not appear to be valid RSS or Atom feed');
                }
                
                // 检测RSS版本并解析
                const articles = this.extractArticles(xmlDoc);
                
                if (articles.length === 0) {
                    this.warn(`No articles found in RSS feed: ${currentRssUrl}`);
                    if (variantIndex < rssVariants.length - 1) {
                        this.log(`Trying next RSS variant...`);
                        continue; // 尝试下一个变体
                    }
                }
                
                // 成功获取文章，缓存并返回
                this.setCache(cacheKey, articles);
                this.log(`Successfully parsed ${articles.length} articles from ${currentRssUrl}`);
                
                return articles;
                
            } catch (error) {
                this.warn(`Error parsing RSS variant ${variantIndex + 1} (${currentRssUrl}):`, error.message);
                
                // 如果不是最后一个变体，继续尝试下一个
                if (variantIndex < rssVariants.length - 1) {
                    this.log(`Trying next RSS variant...`);
                    continue;
                }
                
                // 如果是最后一个变体且还有重试次数，进行重试
                if (retryCount < maxRetries) {
                    // 尝试下一个CORS代理
                    if (error.message.includes('Failed to fetch') || 
                        error.message.includes('HTTP2_PROTOCOL_ERROR') ||
                        error.name === 'AbortError') {
                        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
                        this.log(`Switching to next CORS proxy (index: ${this.currentProxyIndex})`);
                    }
                    
                    this.log(`All variants failed, retrying in ${retryDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return this.parseRSS(rssUrl, retryCount + 1);
                }
            }
        }
        
        // 所有变体和重试都失败，返回fallback
        console.error(`All attempts and variants failed for RSS feed ${rssUrl}`);
        return this.getFallbackArticles(rssUrl, '所有RSS源均无法访问');
    }

    /**
     * 提取文章信息
     * @param {Document} xmlDoc - XML文档
     * @returns {Array} 文章数组
     */
    extractArticles(xmlDoc) {
        const articles = [];
        
        try {
            // 尝试RSS 2.0格式
            let items = xmlDoc.querySelectorAll('item');
            this.log(`Found ${items.length} RSS items`);
            
            // 如果没有找到，尝试Atom格式
            if (items.length === 0) {
                items = xmlDoc.querySelectorAll('entry');
                this.log(`Found ${items.length} Atom entries`);
            }

            if (items.length === 0) {
                this.warn('No RSS items or Atom entries found');
                return [];
            }

            items.forEach((item, index) => {
                try {
                    const article = this.extractArticleData(item, index);
                    if (article) {
                        articles.push(article);
                    }
                } catch (error) {
                    console.error(`Failed to process item ${index + 1}:`, error);
                    // 继续处理其他文章，不让一个错误影响所有文章
                }
            });

            this.log(`Successfully extracted ${articles.length} articles`);
            return articles.slice(0, 10); // 限制为最新10篇
        } catch (error) {
            console.error('Error extracting articles:', error);
            return [];
        }
    }

    /**
     * 提取单个文章数据
     * @param {Element} item - 文章元素
     * @param {number} index - 索引
     * @returns {Object} 文章对象
     */
    extractArticleData(item, index) {
        try {
            this.log(`Extracting article ${index + 1}:`, item.tagName);
            
            const title = this.getTextContent(item, 'title') || `Article ${index + 1}`;
            this.log(`  Title: ${title}`);
            
            const link = this.getLinkHref(item);
            this.log(`  Link: ${link}`);
            
            // 安全地获取描述
            let description = null;
            try {
                description = this.getTextContent(item, 'description') || 
                             this.getTextContent(item, 'summary') ||
                             this.getTextContent(item, 'content:encoded') ||
                             this.getTextContent(item, 'content');
            } catch (error) {
                this.warn('Error getting description:', error);
                description = 'No description available';
            }
            
            // 安全地获取发布日期
            let pubDate = null;
            try {
                pubDate = this.getTextContent(item, 'pubDate') || 
                         this.getTextContent(item, 'published') ||
                         this.getTextContent(item, 'updated') ||
                         this.getTextContent(item, 'dc:date');
            } catch (error) {
                this.warn('Error getting publication date:', error);
            }
            
            // 安全地获取作者
            let author = null;
            try {
                author = this.getAuthor(item);
                this.log(`  Author: ${author}`);
            } catch (error) {
                this.warn('Error getting author:', error);
            }
            
            // 安全地获取图片
            let image = null;
            try {
                image = this.getImage(item);
            } catch (error) {
                this.warn('Error getting image:', error);
            }
            
            // 安全地获取分类
            let category = null;
            try {
                category = this.getCategory(item);
            } catch (error) {
                this.warn('Error getting category:', error);
            }

            const article = {
                id: `article_${Date.now()}_${index}`,
                title: this.cleanText(title),
                abstract: this.cleanText(description),
                link: link,
                publishDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                authors: author || 'Multiple Authors',
                image: image,
                category: category,
                journal: this.extractJournalName(item)
            };
            
            this.log(`  Successfully extracted article:`, article.title);
            return article;
        } catch (error) {
            console.error(`Error extracting article data for item ${index + 1}:`, error);
            this.log('Item details:', {
                tagName: item.tagName,
                innerHTML: item.innerHTML.substring(0, 200) + '...'
            });
            
            // 返回一个基本的文章对象，避免完全失败
            return {
                id: `fallback_article_${Date.now()}_${index}`,
                title: `Article ${index + 1} (解析失败)`,
                abstract: '文章解析时发生错误，请点击链接查看原文。',
                link: this.extractFallbackLink(item),
                publishDate: new Date().toISOString(),
                authors: 'Unknown',
                image: null,
                category: 'Error',
                journal: 'Unknown',
                isError: true
            };
        }
    }

    /**
     * 提取备用链接
     */
    extractFallbackLink(item) {
        try {
            // 尝试从任何可能的地方获取链接
            const allLinks = item.querySelectorAll('*');
            for (const element of allLinks) {
                if (element.textContent && element.textContent.startsWith('http')) {
                    return element.textContent.trim();
                }
                if (element.getAttribute('href')) {
                    return element.getAttribute('href');
                }
                if (element.getAttribute('url')) {
                    return element.getAttribute('url');
                }
            }
        } catch (e) {
            this.warn('Failed to extract fallback link:', e);
        }
        return '#';
    }

    /**
     * 获取文本内容 - 支持命名空间
     */
    getTextContent(item, tagName) {
        try {
            // 处理命名空间标签 (如 dc:creator)
            if (tagName.includes(':')) {
                const [namespace, localName] = tagName.split(':');
                
                // 方法1: 尝试通过getElementsByTagName查找完整标签名
                let element = null;
                try {
                    const elements = item.getElementsByTagName(tagName);
                    element = elements.length > 0 ? elements[0] : null;
                } catch (e) {
                    // 忽略错误，继续下一个方法
                }
                
                // 方法2: 如果方法1失败，尝试通过本地名称查找
                if (!element) {
                    try {
                        const localElements = item.getElementsByTagName(localName);
                        element = localElements.length > 0 ? localElements[0] : null;
                    } catch (e) {
                        // 忽略错误，继续下一个方法
                    }
                }
                
                // 方法3: 尝试通过getElementsByTagNameNS查找
                if (!element) {
                    try {
                        const nsElements = item.getElementsByTagNameNS('*', localName);
                        element = nsElements.length > 0 ? nsElements[0] : null;
                    } catch (e) {
                        // getElementsByTagNameNS 不支持时忽略
                    }
                }
                
                // 方法4: 遍历所有元素查找匹配的
                if (!element) {
                    try {
                        const allElements = item.querySelectorAll('*');
                        for (const el of allElements) {
                            if (el.localName === localName || 
                                el.tagName === tagName ||
                                el.tagName.toLowerCase() === tagName.toLowerCase() ||
                                el.tagName.endsWith(':' + localName)) {
                                element = el;
                                break;
                            }
                        }
                    } catch (e) {
                        // 忽略错误
                    }
                }
                
                return element ? element.textContent.trim() : null;
            } else {
                // 普通标签，使用安全的查询方法
                const element = this.safeQuerySelector(item, tagName);
                return element ? element.textContent.trim() : null;
            }
        } catch (error) {
            this.warn(`Error getting text content for ${tagName}:`, error);
            return null;
        }
    }

    /**
     * 安全的元素查找方法
     */
    safeQuerySelector(item, selector) {
        try {
            return item.querySelector(selector);
        } catch (error) {
            this.warn(`Invalid selector: ${selector}`, error);
            return null;
        }
    }

    /**
     * 获取命名空间元素
     */
    getNamespacedElement(item, tagName) {
        try {
            // 先尝试getElementsByTagName
            const elements = item.getElementsByTagName(tagName);
            if (elements.length > 0) {
                return elements[0];
            }
            
            // 如果包含命名空间，尝试不同方法
            if (tagName.includes(':')) {
                const localName = tagName.split(':')[1];
                
                // 尝试只用本地名称查找
                const localElements = item.getElementsByTagName(localName);
                if (localElements.length > 0) {
                    return localElements[0];
                }
                
                // 尝试查找所有匹配本地名称的元素
                const allElements = item.querySelectorAll('*');
                for (const element of allElements) {
                    if (element.localName === localName || element.tagName.endsWith(':' + localName)) {
                        return element;
                    }
                }
            }
            
            return null;
        } catch (error) {
            this.warn(`Error finding element ${tagName}:`, error);
            return null;
        }
    }

    /**
     * 获取链接地址
     */
    getLinkHref(item) {
        // RSS 2.0 格式
        let link = this.safeQuerySelector(item, 'link');
        if (link && link.textContent && link.textContent.trim().startsWith('http')) {
            return link.textContent.trim();
        }
        
        // Atom 格式
        link = this.safeQuerySelector(item, 'link[rel="alternate"]');
        if (link && link.getAttribute('href')) {
            return link.getAttribute('href');
        }
        
        // 其他link元素
        link = this.safeQuerySelector(item, 'link[href]');
        if (link && link.getAttribute('href')) {
            return link.getAttribute('href');
        }
        
        // GUID作为链接
        const guid = this.safeQuerySelector(item, 'guid');
        if (guid && guid.textContent && guid.textContent.startsWith('http')) {
            return guid.textContent.trim();
        }
        
        // 检查id元素（Atom格式）
        const id = this.safeQuerySelector(item, 'id');
        if (id && id.textContent && id.textContent.startsWith('http')) {
            return id.textContent.trim();
        }
        
        // 如果都找不到，返回默认值
        return '#';
    }

    /**
     * 获取作者信息
     */
    getAuthor(item) {
        // 尝试多种作者字段
        const authorFields = ['author', 'dc:creator', 'creator', 'managingEditor'];
        
        for (const field of authorFields) {
            const author = this.getTextContent(item, field);
            if (author) {
                return this.cleanAuthorName(author);
            }
        }

        // 检查Atom格式的作者元素
        const authorElement = this.safeQuerySelector(item, 'author name');
        if (authorElement) {
            return authorElement.textContent.trim();
        }

        // 检查RSS中嵌套的作者信息
        const authors = this.safeQuerySelector(item, 'author');
        if (authors && authors.textContent) {
            return this.cleanAuthorName(authors.textContent);
        }

        return null;
    }

    /**
     * 清理作者名称
     */
    cleanAuthorName(authorText) {
        if (!authorText) return null;
        
        // 移除邮箱地址
        let cleaned = authorText.replace(/\([^)]*@[^)]*\)/g, '');
        // 移除多余空格
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        // 如果太长，可能包含其他信息，截取前面部分
        if (cleaned.length > 100) {
            cleaned = cleaned.substring(0, 100) + '...';
        }
        
        return cleaned;
    }

    /**
     * 获取图片
     */
    getImage(item) {
        // 查找enclosure中的图片
        const enclosure = this.safeQuerySelector(item, 'enclosure[type^="image"]');
        if (enclosure) {
            return enclosure.getAttribute('url');
        }

        // 查找media:content (使用安全方法)
        const mediaContent = this.getNamespacedElement(item, 'media:content') || 
                           this.safeQuerySelector(item, 'content[type^="image"]');
        if (mediaContent) {
            return mediaContent.getAttribute('url');
        }

        // 在描述中查找图片
        const description = this.getTextContent(item, 'description') || 
                           this.getTextContent(item, 'content:encoded') ||
                           this.getTextContent(item, 'summary');
        
        if (description) {
            const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) {
                return imgMatch[1];
            }
        }

        // 查找thumbnail或image元素
        const thumbnail = this.getNamespacedElement(item, 'media:thumbnail') ||
                         this.safeQuerySelector(item, 'thumbnail') ||
                         this.safeQuerySelector(item, 'image');
        
        if (thumbnail) {
            return thumbnail.getAttribute('url') || thumbnail.getAttribute('src') || thumbnail.textContent;
        }

        return null;
    }

    /**
     * 获取分类
     */
    getCategory(item) {
        // 尝试多种分类字段
        const categoryFields = ['category', 'dc:subject', 'subject'];
        
        for (const field of categoryFields) {
            const category = this.getTextContent(item, field);
            if (category) {
                return category;
            }
        }

        // 检查category元素的domain属性
        const categoryElement = this.safeQuerySelector(item, 'category');
        if (categoryElement) {
            return categoryElement.getAttribute('domain') || categoryElement.textContent;
        }

        return null;
    }

    /**
     * 提取期刊名称
     */
    extractJournalName(item) {
        const source = this.getTextContent(item, 'source');
        if (source) return source;

        // 从链接中推断
        const link = this.getLinkHref(item);
        if (link.includes('nature.com')) return 'Nature';
        if (link.includes('science.org')) return 'Science';
        if (link.includes('agupubs')) return 'AGU';
        
        return 'Journal';
    }

    /**
     * 清理文本内容
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
     * 缓存管理
     */
    getCached(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    /**
     * 获取备用文章（当RSS解析失败时）
     */
    getFallbackArticles(rssUrl, errorMessage = '网络连接问题') {
        const journalName = this.getJournalNameFromUrl(rssUrl);
        
        return [
            {
                id: `fallback_${Date.now()}_1`,
                title: `${journalName} - 暂时无法获取内容`,
                abstract: `由于${errorMessage}，暂时无法获取最新文章。系统将自动重试，您也可以稍后刷新页面或直接访问期刊官网获取最新内容。`,
                link: this.getJournalHomepage(rssUrl),
                publishDate: new Date().toISOString(),
                authors: 'System Notice',
                image: null,
                category: 'Notice',
                journal: journalName,
                isFallback: true,
                errorMessage: errorMessage
            }
        ];
    }

    /**
     * 从URL获取期刊名称
     */
    getJournalNameFromUrl(url) {
        if (url.includes('nature.com/nature')) return 'Nature';
        if (url.includes('nature.com/nclimate')) return 'Nature Climate Change';
        if (url.includes('nature.com/ngeo')) return 'Nature Geoscience';
        if (url.includes('science.org') && url.includes('jc=science')) return 'Science';
        if (url.includes('science.org') && url.includes('jc=sciadv')) return 'Science Advances';
        if (url.includes('science.org') && url.includes('news_current')) return 'Science News';
        if (url.includes('agupubs') && url.includes('19448007')) return 'Geophysical Research Letters';
        if (url.includes('agupubs') && url.includes('21698996')) return 'JGR: Atmospheres';
        if (url.includes('agupubs') && url.includes('19422466')) return 'Reviews of Geophysics';
        if (url.includes('ametsoc') && (url.includes('atsc') || url.includes('journals/atsc'))) return 'Journal of Atmospheric Sciences';
        if (url.includes('ametsoc') && (url.includes('clim') || url.includes('journals/clim'))) return 'Journal of Climate';
        if (url.includes('sciencedirect.com') && url.includes('0012821X')) return 'Earth and Planetary Science Letters';
        if (url.includes('acp.copernicus.org')) return 'Atmospheric Chemistry and Physics';
        if (url.includes('link.springer.com') && url.includes('journal-id=382')) return 'Climate Dynamics';
        return 'Unknown Journal';
    }

    /**
     * 获取期刊主页
     */
    getJournalHomepage(rssUrl) {
        const urlMap = {
            'nature.com/nature': 'https://www.nature.com/',
            'nature.com/nclimate': 'https://www.nature.com/nclimate/',
            'nature.com/ngeo': 'https://www.nature.com/ngeo/',
            'science.org': 'https://www.science.org/',
            'agupubs': 'https://agupubs.onlinelibrary.wiley.com/',
            'ametsoc': 'https://journals.ametsoc.org/',
            'springer': 'https://link.springer.com/'
        };

        for (const [domain, homepage] of Object.entries(urlMap)) {
            if (rssUrl.includes(domain)) {
                return homepage;
            }
        }

        return '#';
    }

    /**
     * 增强的文章数据提取 - 专门处理Science期刊格式
     */
    extractScienceArticleData(item, index) {
        try {
            // Science期刊的特殊处理
            const title = this.getTextContent(item, 'title') || `Article ${index + 1}`;
            const link = this.getLinkHref(item);
            
            // Science期刊可能有不同的描述字段
            const description = this.getTextContent(item, 'description') || 
                               this.getTextContent(item, 'summary') ||
                               this.getTextContent(item, 'content:encoded') ||
                               this.getTextContent(item, 'content');
            
            const pubDate = this.getTextContent(item, 'pubDate') || 
                           this.getTextContent(item, 'published') ||
                           this.getTextContent(item, 'updated') ||
                           this.getTextContent(item, 'dc:date');
            
            // Science期刊的作者信息可能在不同字段
            const author = this.getTextContent(item, 'author') ||
                          this.getTextContent(item, 'dc:creator') ||
                          this.getTextContent(item, 'creator') ||
                          this.extractAuthorFromDescription(description);
            
            const image = this.getImage(item);
            const category = this.getCategory(item) || this.extractCategoryFromUrl(link);

            return {
                id: `article_${Date.now()}_${index}`,
                title: this.cleanText(title),
                abstract: this.cleanText(description),
                link: link,
                publishDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                authors: author || 'Multiple Authors',
                image: image,
                category: category,
                journal: this.extractJournalName(item)
            };
        } catch (error) {
            console.error('Error extracting Science article data:', error);
            return null;
        }
    }

    /**
     * 从描述中提取作者信息
     */
    extractAuthorFromDescription(description) {
        if (!description) return null;
        
        // 查找常见的作者模式
        const authorPatterns = [
            /By\s+([^,\n]+)/i,
            /Author[s]?:\s*([^,\n]+)/i,
            /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+et\s+al\.?)?)/
        ];
        
        for (const pattern of authorPatterns) {
            const match = description.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        return null;
    }

    /**
     * 从URL提取分类信息
     */
    extractCategoryFromUrl(url) {
        if (url.includes('climate')) return 'Climate Science';
        if (url.includes('geophys')) return 'Geophysics';
        if (url.includes('atmos')) return 'Atmospheric Science';
        if (url.includes('earth')) return 'Earth Science';
        return null;
    }

    /**
     * 设置调试模式
     */
    setDebugMode(enabled) {
        this.debug = enabled;
        this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * 获取RSS URL的变体（备用源）
     * @param {string} originalUrl - 原始RSS URL
     * @returns {Array} RSS URL变体数组
     */
    getRSSVariants(originalUrl) {
        const variants = [originalUrl];
        
        // 为AMS期刊添加备用RSS源 - 只使用有效格式
        if (originalUrl.includes('journals.ametsoc.org') && originalUrl.includes('showFeed')) {
            if (originalUrl.includes('jc=atsc')) {
                variants.push(
                    'https://journals.ametsoc.org/journalissuetocrss/journals/atsc/atsc-overview.xml'
                );
            } else if (originalUrl.includes('jc=clim')) {
                variants.push(
                    'https://journals.ametsoc.org/journalissuetocrss/journals/clim/clim-overview.xml'
                );
            }
        }
        // 为AGU期刊添加备用RSS源 - 使用不同的URL格式
        else if (originalUrl.includes('agupubs.onlinelibrary.wiley.com')) {
            if (originalUrl.includes('19448007')) {
                // Geophysical Research Letters
                if (originalUrl.includes('/rss/journal/')) {
                    variants.push('https://agupubs.onlinelibrary.wiley.com/action/showFeed?jc=19448007&type=etoc&feed=rss');
                } else {
                    variants.push('https://agupubs.onlinelibrary.wiley.com/rss/journal/19448007');
                }
            } else if (originalUrl.includes('21698996')) {
                // JGR: Atmospheres
                if (originalUrl.includes('/rss/journal/')) {
                    variants.push('https://agupubs.onlinelibrary.wiley.com/action/showFeed?jc=21698996&type=etoc&feed=rss');
                } else {
                    variants.push('https://agupubs.onlinelibrary.wiley.com/rss/journal/21698996');
                }
            } else if (originalUrl.includes('19422466')) {
                // Reviews of Geophysics - 只保留有效格式
                if (originalUrl.includes('showFeed')) {
                    // 当前使用的是showFeed格式，可以尝试简化的RSS格式
                    variants.push('https://agupubs.onlinelibrary.wiley.com/rss/journal/19422466');
                }
            }
        }
        // 为Nature期刊添加备用RSS源
        else if (originalUrl.includes('nature.com')) {
            if (originalUrl.includes('nature.rss')) {
                variants.push('https://feeds.nature.com/nature/rss/current');
            } else if (originalUrl.includes('ngeo.rss')) {
                variants.push('https://feeds.nature.com/ngeo/rss/current');
            } else if (originalUrl.includes('nclimate.rss')) {
                variants.push('https://feeds.nature.com/nclimate/rss/current');
            }
        }
        // 为Science期刊添加备用RSS源
        else if (originalUrl.includes('science.org')) {
            if (originalUrl.includes('jc=science')) {
                variants.push('https://science.sciencemag.org/rss/current.xml');
            } else if (originalUrl.includes('jc=sciadv')) {
                variants.push('https://advances.sciencemag.org/rss/current.xml');
            }
        }
        
        this.log(`Generated ${variants.length} RSS variants for ${originalUrl}`);
        return variants;
    }
}

// 导出全局实例
window.rssParser = new RSSParser();
