class JournalManager{constructor(){this.journals=[],this.articles=new Map,this.aiSummaries=new Map,this.savedArticles=new Set,this.cache=new Map,this.config={maxArticlesPerJournal:5,cacheTimeout:36e5,aiSummaryProvider:"mock",updateInterval:864e5},this.rssParser=null,this.aiService=null}async initialize(e){this.journals=e,console.log("Initializing Journal Manager with",this.journals.length,"journals"),await this.waitForServices(),this.aiService&&this.aiService.setProvider(this.config.aiSummaryProvider),await this.loadAllJournals(),this.setupAutoRefresh(),this.updateStatistics(),this.loadSavedArticles()}async waitForServices(){let e=0;for(;e<50;){if(window.rssParser&&window.aiSummaryService)return this.rssParser=window.rssParser,this.aiService=window.aiSummaryService,void console.log("Services loaded successfully");await new Promise(e=>setTimeout(e,100)),e++}console.warn("Services not loaded, using fallback methods")}async loadAllJournals(){console.log("Loading articles for all journals...");var e=this.journals.map(a=>this.loadJournalArticles(a.name,a.rss_url).catch(e=>(console.error(`Failed to load ${a.name}:`,e),[]))),e=await Promise.allSettled(e);console.log("Finished loading articles. Results:",e.length)}async loadJournalArticles(a,e,t=!1){if(!e||"#"===e||""===e||"undefined"===e)return console.warn(`Invalid RSS URL for journal ${a}: `+e),this.getFallbackArticles(a);var r="journal_"+a,i=this.getCachedData(r);if(!t&&i)return console.log("Using cached data for "+a),this.renderJournalArticles(a,i),i;try{console.log(`Fetching articles for ${a} from `+e);var s=this.rssParser?await this.rssParser.parseRSS(e):await this.getFallbackArticles(a);return this.setCachedData(r,s),this.articles.set(a,s),this.renderJournalArticles(a,s),s}catch(e){console.error(`Error loading articles for ${a}:`,e);t=await this.getFallbackArticles(a);return this.renderJournalArticles(a,t),t}}renderJournalArticles(t,e){let r=document.getElementById("articles-"+t.toLowerCase().replace(/\s+/g,"-"));r?(r.innerHTML="",e&&0!==e.length?e.slice(0,this.config.maxArticlesPerJournal).forEach((e,a)=>{e=this.createArticleElement(e,t,a);r.appendChild(e)}):r.innerHTML=`
                <div class="no-articles">
                    <i class="fas fa-info-circle"></i>
                    <p>暂无最新文章</p>
                </div>
            `):console.warn("Container not found for journal: "+t)}createArticleElement(e,a,t){var r=document.createElement("div");r.className="article-item",r.setAttribute("data-article-id",e.id);var i=(e.publishDate?new Date(e.publishDate):new Date).toLocaleDateString("zh-CN",{year:"numeric",month:"short",day:"numeric"});return r.innerHTML=`
            <div class="article-content">
                ${e.image&&!e.isFallback?`
                <div class="article-image">
                    <img src="${e.image}" alt="${e.title}" loading="lazy" 
                         onerror="this.style.display='none'">
                    <div class="article-category">${a}</div>
                </div>
                `:""}
                
                <div class="article-details">
                    <h4 class="article-title">
                        <a href="${e.link}" target="_blank" rel="noopener">${this.truncateText(e.title,80)}</a>
                    </h4>
                    
                    <div class="article-meta">
                        <span class="article-date">
                            <i class="fas fa-calendar"></i>
                            ${i}
                        </span>
                        <span class="article-authors">
                            <i class="fas fa-user"></i>
                            ${e.authors||"Multiple Authors"}
                        </span>
                    </div>
                    
                    <div class="article-abstract">
                        <p>${this.truncateText(e.abstract||"暂无摘要",150)}</p>
                    </div>
                    
                    <div class="article-actions">
                        <a href="${e.link}" target="_blank" class="read-more-btn">
                            <i class="fas fa-external-link-alt"></i>
                            阅读原文
                        </a>
                        ${e.isFallback?"":`
                        <button class="ai-summary-btn" onclick="journalManager.showAISummary('${e.id}')">
                            <i class="fas fa-robot"></i>
                            AI 总结
                        </button>
                        <button class="save-btn ${this.savedArticles.has(e.id)?"saved":""}" 
                                onclick="journalManager.toggleSaveArticle('${e.id}')">
                            <i class="fas fa-bookmark"></i>
                            ${this.savedArticles.has(e.id)?"已收藏":"收藏"}
                        </button>
                        `}
                    </div>
                </div>
            </div>
        `,r}async showAISummary(e){var a=document.getElementById("aiSummaryModal"),t=a.querySelector(".modal-title"),r=a.querySelector(".modal-body"),i=a.querySelector(".loading-spinner");if(a){a.style.display="flex",t.textContent="AI 总结",r.innerHTML="",i&&(i.style.display="block");a=this.findArticleById(e);if(a)try{var s=this.aiService?await this.aiService.generateSummary(a,"zh-CN"):await this.generateFallbackSummary(a);i&&(i.style.display="none"),this.renderAiSummary(r,s,a)}catch(e){console.error("Error generating AI summary:",e),this.showSummaryError(r,i,"AI总结生成失败，请稍后重试")}else this.showSummaryError(r,i,"文章未找到")}else console.error("AI Summary modal not found")}renderAiSummary(e,a,t){e.innerHTML=`
            <div class="ai-summary-content">
                <div class="article-info">
                    <h3 class="summary-article-title">${t.title}</h3>
                    <p class="summary-meta">
                        <i class="fas fa-robot"></i>
                        AI 总结 · 置信度: ${Math.round(100*a.confidence)}%
                        · 生成时间: ${new Date(a.generatedAt).toLocaleString("zh-CN")}
                    </p>
                </div>
                
                <div class="summary-main">
                    <h4><i class="fas fa-lightbulb"></i> 核心内容</h4>
                    <p class="summary-text">${a.summary}</p>
                </div>
                
                ${a.keyPoints&&0<a.keyPoints.length?`
                <div class="key-points">
                    <h4><i class="fas fa-key"></i> 关键要点</h4>
                    <ul class="key-points-list">
                        ${a.keyPoints.map(e=>`<li>${e}</li>`).join("")}
                    </ul>
                </div>
                `:""}
                
                <div class="summary-actions">
                    <a href="${t.link}" target="_blank" class="action-btn primary">
                        <i class="fas fa-external-link-alt"></i>
                        阅读原文
                    </a>
                    <button onclick="journalManager.regenerateSummary('${t.id}')" class="action-btn secondary">
                        <i class="fas fa-redo"></i>
                        重新生成
                    </button>
                    <button onclick="journalManager.saveSummary('${t.id}')" class="action-btn secondary">
                        <i class="fas fa-save"></i>
                        保存总结
                    </button>
                </div>
            </div>
        `}showSummaryError(e,a,t){a&&(a.style.display="none"),e.innerHTML=`
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${t}</p>
                <button onclick="journalManager.closeAiSummary()" class="action-btn">关闭</button>
            </div>
        `}closeAiSummary(){var e=document.getElementById("aiSummaryModal");e&&(e.style.display="none")}async regenerateSummary(e){this.aiService&&this.aiService.cache&&this.aiService.cache.delete(`summary_${e}_zh-CN`),await this.showAISummary(e)}saveSummary(e){console.log("Saving summary for article "+e);var a=JSON.parse(localStorage.getItem("savedSummaries")||"[]");a.includes(e)||(a.push(e),localStorage.setItem("savedSummaries",JSON.stringify(a))),this.showToast("总结已保存","success")}async loadMoreArticles(a){try{console.log("Loading more articles for: "+a);var e,t=this.journals.find(e=>e.name===a);t?(this.showLoadingIndicator(a),(e=await this.loadJournalArticles(t,!0))&&0<e.length?(this.displayMoreArticles(a,e),console.log(`Loaded ${e.length} more articles for `+a)):(console.log("No additional articles found for "+a),this.showNoMoreArticlesMessage(a))):console.error("Journal not found: "+a)}catch(e){console.error(`Error loading more articles for ${a}:`,e),this.showErrorMessage(a,"无法加载更多文章")}finally{this.hideLoadingIndicator(a)}}showLoadingIndicator(e){var e=document.querySelector(`[data-journal="${e}"]`);e&&(e=e.querySelector(".load-more-btn"))&&(e.textContent="加载中...",e.disabled=!0)}hideLoadingIndicator(e){var e=document.querySelector(`[data-journal="${e}"]`);e&&(e=e.querySelector(".load-more-btn"))&&(e.textContent="加载更多",e.disabled=!1)}displayMoreArticles(e,a){document.querySelector(`[data-journal="${e}"] .articles-grid`)&&0<a.length&&window.journalUI&&window.journalUI.appendArticles&&window.journalUI.appendArticles(e,a)}showNoMoreArticlesMessage(a){a=document.querySelector(`[data-journal="${a}"]`);if(a){let e=a.querySelector(".load-more-btn");e&&(e.textContent="暂无更多",e.disabled=!0,setTimeout(()=>{e.textContent="加载更多",e.disabled=!1},3e3))}}showErrorMessage(a,t){a=document.querySelector(`[data-journal="${a}"]`);if(a){let e=a.querySelector(".load-more-btn");e&&(e.textContent=t,e.disabled=!0,setTimeout(()=>{e.textContent="加载更多",e.disabled=!1},3e3))}}showToast(e,a="info"){let t=document.createElement("div");t.className="toast "+a,t.innerHTML=`
            <i class="fas fa-${"success"===a?"check":"error"===a?"times":"info"}"></i>
            ${e}
        `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),300)},3e3)}findArticleById(a){for(var[e,t]of this.articles.entries()){t=t.find(e=>e.id===a);if(t)return t}var r=document.querySelector(`[data-article-id="${a}"]`);return r?this.extractArticleFromElement(r):null}extractArticleFromElement(e){var a=e.querySelector(".article-title a"),t=e.querySelector(".article-abstract p"),r=e.querySelector(".article-title a");return{id:e.getAttribute("data-article-id")||Date.now().toString(),title:a?a.textContent:"未知标题",abstract:t?t.textContent:"暂无摘要",link:r?r.href:"#"}}async getFallbackArticles(e){return[{id:`fallback_${Date.now()}_1`,title:e+" 最新研究成果",abstract:"由于网络连接问题，暂时无法获取最新文章。请稍后重试或直接访问期刊官网获取最新内容。",link:this.getJournalHomepage(e),publishDate:(new Date).toISOString(),authors:"Editorial Team",image:null,category:"Notice",journal:e,isFallback:!0}]}async generateFallbackSummary(e){return{summary:"由于AI服务暂时不可用，无法生成智能总结。建议您直接阅读原文获取详细信息。这篇文章来自权威学术期刊，具有重要的研究价值。",keyPoints:["AI服务暂时不可用","建议阅读原文","来自权威期刊"],confidence:0,wordCount:50,language:"zh-CN",generatedAt:(new Date).toISOString(),provider:"fallback",isError:!0}}getJournalHomepage(e){return{Nature:"https://www.nature.com/",Science:"https://www.science.org/","Science Advances":"https://www.science.org/journal/sciadv","Science News":"https://www.science.org/news","Nature Climate Change":"https://www.nature.com/nclimate/","Nature Geoscience":"https://www.nature.com/ngeo/","Geophysical Research Letters":"https://agupubs.onlinelibrary.wiley.com/journal/19448007","Reviews of Geophysics":"https://agupubs.onlinelibrary.wiley.com/journal/19422466","Journal of the Atmospheric Sciences":"https://journals.ametsoc.org/view/journals/atsc/atsc-overview.xml","Journal of Climate":"https://journals.ametsoc.org/view/journals/clim/clim-overview.xml","Climate Dynamics":"https://link.springer.com/journal/382"}[e]||"#"}truncateText(e,a){return e?e.length>a?e.substring(0,a)+"...":e:""}setupAutoRefresh(){setInterval(()=>{console.log("Auto-refreshing journal articles..."),this.loadAllJournals(),this.updateStatistics()},this.config.updateInterval)}updateStatistics(){var e=Array.from(this.articles.values()).reduce((e,a)=>e+a.length,0),a=document.getElementById("lastUpdate"),t=document.getElementById("totalArticles");a&&(a.textContent=(new Date).toLocaleTimeString("zh-CN")),t&&(t.textContent=e.toString())}loadSavedArticles(){var e=JSON.parse(localStorage.getItem("savedArticles")||"[]");this.savedArticles=new Set(e)}saveSavedArticles(){localStorage.setItem("savedArticles",JSON.stringify(Array.from(this.savedArticles)))}getCachedData(e){e=this.cache.get(e);return e&&Date.now()-e.timestamp<this.config.cacheTimeout?e.data:null}setCachedData(e,a){this.cache.set(e,{data:a,timestamp:Date.now()})}}window.journalManager=new JournalManager,window.loadMoreArticles=function(e){if(window.journalManager)return window.journalManager.loadMoreArticles(e);console.error("Journal Manager not initialized")},window.saveArticle=function(e){if(window.journalManager)return window.journalManager.saveArticle(e)},window.refreshJournal=function(e){if(window.journalManager)return window.journalManager.refreshJournal(e)};