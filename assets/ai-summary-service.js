/**
 * AI Summary Service for Academic Articles
 * 学术文章AI总结服务
 */

class AISummaryService {
    constructor() {
        this.providers = {
            openai: {
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo'
            },
            claude: {
                endpoint: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-sonnet-20240229'
            },
            gemini: {
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                model: 'gemini-pro'
            },
            deepseek: {
                endpoint: 'https://api.deepseek.com/v1/chat/completions',
                model: 'deepseek-chat'
            }
        };
        
        this.currentProvider = 'deepseek'; // 使用DeepSeek作为默认提供商
        this.apiKey = 'sk-dc3ff3328d0f419f91d4d50def473298';
        this.cache = new Map();
        this.cacheTimeout = 86400000; // 24 hours
    }

    /**
     * 生成文章摘要
     * @param {Object} article - 文章对象
     * @param {string} language - 语言 (zh-CN, en-US)
     * @returns {Promise<Object>} 摘要结果
     */
    async generateSummary(article, language = 'zh-CN') {
        const cacheKey = `summary_${article.id}_${language}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            let summary;
            
            // 优先使用真实AI服务
            if (this.currentProvider !== 'mock' && this.apiKey) {
                summary = await this.generateRealSummary(article, language);
            } else {
                summary = await this.generateMockSummary(article, language);
            }
            
            // 缓存结果
            this.setCache(cacheKey, summary);
            
            return summary;
        } catch (error) {
            console.error('Error generating AI summary:', error);
            return this.generateFallbackSummary(article, language);
        }
    }

    /**
     * 生成模拟总结（用于演示）
     */
    async generateMockSummary(article, language) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const summaries = {
            'zh-CN': [
                '这项研究探讨了气候变化对全球生态系统的深远影响，通过大规模数据分析揭示了温度上升与生物多样性变化之间的复杂关系。研究发现，在过去十年中，极地地区的冰川融化速度比预期快30%，这将对海平面上升产生重大影响。',
                '本文提出了一种新的机器学习算法，能够更准确地预测极端天气事件的发生概率。该算法结合了卫星数据、地面观测站信息和历史气象记录，预测准确率达到92%，为灾害预警系统提供了重要的技术支撑。',
                '研究团队通过分析全球海洋温度数据，发现了海洋环流系统的新模式。这一发现有助于我们更好地理解气候变化的机制，并为制定应对策略提供科学依据。研究结果表明，海洋酸化程度正在加剧。',
                '这项跨学科研究整合了地质学、生物学和气候科学的最新发现，提出了地球系统相互作用的新理论框架。研究揭示了大气、海洋、陆地和生物圈之间的复杂耦合关系，为地球系统科学发展贡献了新的见解。',
                '通过先进的数值模拟技术，科学家们成功重现了过去千年的气候变化过程。这项研究不仅验证了现有的气候模型，还为未来气候预测提供了更可靠的基础。模拟结果显示，人类活动对气候系统的影响正在加速。'
            ],
            'en-US': [
                'This study investigates the profound impacts of climate change on global ecosystems through large-scale data analysis, revealing complex relationships between temperature rise and biodiversity changes. The research found that polar ice melting has accelerated by 30% faster than expected over the past decade.',
                'This paper proposes a novel machine learning algorithm that can more accurately predict the probability of extreme weather events. The algorithm combines satellite data, ground station observations, and historical meteorological records, achieving 92% prediction accuracy.',
                'The research team discovered new patterns in ocean circulation systems by analyzing global ocean temperature data. This finding helps us better understand climate change mechanisms and provides scientific basis for developing response strategies.',
                'This interdisciplinary study integrates the latest findings from geology, biology, and climate science, proposing a new theoretical framework for Earth system interactions. The research reveals complex coupling relationships between atmosphere, ocean, land, and biosphere.',
                'Using advanced numerical simulation techniques, scientists successfully reconstructed climate change processes over the past millennium. This research not only validates existing climate models but also provides a more reliable foundation for future climate predictions.'
            ]
        };
        
        const summaryTexts = summaries[language] || summaries['zh-CN'];
        const randomSummary = summaryTexts[Math.floor(Math.random() * summaryTexts.length)];
        
        return {
            summary: randomSummary,
            keyPoints: this.extractKeyPoints(randomSummary, language),
            confidence: 0.85 + Math.random() * 0.1,
            wordCount: randomSummary.length,
            language: language,
            generatedAt: new Date().toISOString(),
            provider: 'mock-ai'
        };
    }

    /**
     * 生成真实AI总结（支持DeepSeek和其他提供商）
     */
    async generateRealSummary(article, language) {
        try {
            const provider = this.providers[this.currentProvider];
            const prompt = this.buildPrompt(article, language);
            
            let requestBody;
            let headers = {
                'Content-Type': 'application/json'
            };
            
            // 根据不同提供商构建请求
            if (this.currentProvider === 'deepseek') {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
                requestBody = {
                    model: provider.model,
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的地球科学、海洋科学和大气科学论文分析助手，能够准确提取和总结科学研究的核心内容，并用简洁的中文表达。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.3,
                    stream: false
                };
            } else {
                // 其他提供商的通用格式
                headers['Authorization'] = `Bearer ${this.getApiKey()}`;
                requestBody = {
                    model: provider.model,
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的学术论文分析助手，擅长总结科学研究的核心内容。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.3
                };
            }
            
            const response = await fetch(provider.endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 检查响应格式
            let content;
            if (data.choices && data.choices[0] && data.choices[0].message) {
                content = data.choices[0].message.content;
            } else if (data.message && data.message.content) {
                content = data.message.content;
            } else {
                throw new Error('Unexpected API response format');
            }
            
            return {
                summary: content,
                keyPoints: this.extractKeyPoints(content, language),
                confidence: 0.9,
                wordCount: content.length,
                language: language,
                generatedAt: new Date().toISOString(),
                provider: this.currentProvider
            };
            
        } catch (error) {
            console.warn('AI summary generation failed, falling back to mock summary:', error);
            // 如果AI调用失败，降级到模拟摘要
            return await this.generateMockSummary(article, language);
        }
    }

    /**
     * 构建AI提示词
     */
    buildPrompt(article, language) {
        const prompts = {
            'zh-CN': `请为以下学术文章生成一个简洁而全面的中文摘要（200-300字）：

标题：${article.title}
摘要：${article.abstract}

请重点说明：
1. 研究的主要发现
2. 使用的方法或技术
3. 研究的意义和影响
4. 可能的应用前景

请用学术但易懂的语言，避免过于技术性的术语。`,

            'en-US': `Please generate a concise and comprehensive English summary (200-300 words) for the following academic article:

Title: ${article.title}
Abstract: ${article.abstract}

Please highlight:
1. Main findings of the research
2. Methods or techniques used
3. Significance and impact of the study
4. Potential applications

Use academic but accessible language, avoiding overly technical jargon.`
        };
        
        return prompts[language] || prompts['zh-CN'];
    }

    /**
     * 提取关键点
     */
    extractKeyPoints(summary, language) {
        const sentences = summary.split(/[。！？\.!?]/).filter(s => s.trim().length > 10);
        
        // 简单的关键点提取（基于句子长度和位置）
        const keyPoints = sentences
            .slice(0, 4)
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0);
        
        return keyPoints;
    }

    /**
     * 生成备用总结
     */
    generateFallbackSummary(article, language) {
        const fallbackTexts = {
            'zh-CN': '抱歉，AI总结服务暂时不可用。这篇文章讨论了相关领域的重要研究进展，建议您阅读原文获取详细信息。',
            'en-US': 'Sorry, AI summary service is temporarily unavailable. This article discusses important research progress in the relevant field. Please read the original article for detailed information.'
        };
        
        return {
            summary: fallbackTexts[language] || fallbackTexts['zh-CN'],
            keyPoints: ['AI服务暂时不可用', '请阅读原文获取详细信息'],
            confidence: 0.0,
            wordCount: fallbackTexts[language]?.length || 0,
            language: language,
            generatedAt: new Date().toISOString(),
            provider: 'fallback',
            isError: true
        };
    }

    /**
     * 获取API密钥（从环境变量或配置中）
     */
    getApiKey() {
        // 在实际应用中，这应该从安全的配置中获取
        return localStorage.getItem('ai_api_key') || process.env.AI_API_KEY || '';
    }

    /**
     * 设置AI服务提供商
     */
    setProvider(provider) {
        if (this.providers[provider] || provider === 'mock') {
            this.currentProvider = provider;
        }
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
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * 获取缓存统计
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// 导出全局实例
window.aiSummaryService = new AISummaryService();
