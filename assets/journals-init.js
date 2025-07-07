function initializeJournalsSection(){console.log("Setting up journals section..."),void 0!==window.journalsData?(console.log("Journals data found:",window.journalsData),console.log("Number of journals:",window.journalsData.length),window.journalsData.forEach((a,e)=>{console.log(`Journal ${e+1}: ${a.name} - RSS: `+a.rss_url)})):console.error("journalsData not found!"),setupJournalFilters(),setupAutoRefresh(),updateJournalStats(),window.journalManager&&void 0!==window.journalsData?window.journalManager.initialize(window.journalsData):(console.log("Using fallback method for loading articles"),loadAllJournalArticlesFallback())}function setupJournalFilters(){let t=document.querySelectorAll(".filter-btn"),l=document.querySelectorAll(".journal-card");0===t.length?console.warn("No filter buttons found"):t.forEach(a=>{a.addEventListener("click",()=>{t.forEach(a=>a.classList.remove("active")),a.classList.add("active");let e=a.dataset.category;l.forEach(a=>{"all"===e||a.dataset.category===e?(a.style.display="block",a.classList.add("animate-fade-in")):a.style.display="none"}),console.log("Filtered journals by category: "+e)})})}function loadAllJournalArticlesFallback(){console.log("Loading articles using fallback method...");[{name:"Nature",rss_url:"https://www.nature.com/nature.rss",category:"multidisciplinary"},{name:"Science",rss_url:"https://www.science.org/rss/current.xml",category:"multidisciplinary"},{name:"Nature Climate Change",rss_url:"https://www.nature.com/nclimate.rss",category:"climate"}].forEach(a=>{loadJournalArticlesFallback(a.name,a.rss_url)})}function loadJournalArticlesFallback(e,a){var t="articles-"+e.toLowerCase().replace(/\s+/g,"-");let l=document.getElementById(t);l?(l.innerHTML=`
        <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在加载 ${e} 的最新文章...</p>
        </div>
    `,setTimeout(()=>{window.rssParser?window.rssParser.parseRSS(a).then(a=>{renderArticlesFallback(l,a,e)}).catch(a=>{console.error(`Failed to parse RSS for ${e}:`,a),showFallbackContent(l,e)}):showFallbackContent(l,e)},1e3+2e3*Math.random())):console.warn("Container not found: "+t)}function renderArticlesFallback(n,a,s){n.innerHTML="",a&&0!==a.length?a.slice(0,3).forEach((a,e)=>{var t=document.createElement("div");t.className="article-item",t.setAttribute("data-article-id",a.id);var l=(a.publishDate?new Date(a.publishDate):new Date).toLocaleDateString("zh-CN",{year:"numeric",month:"short",day:"numeric"});t.innerHTML=`
            <div class="article-content">
                ${a.image?`
                <div class="article-image">
                    <img src="${a.image}" alt="${a.title}" loading="lazy" 
                         onerror="this.style.display='none'">
                    <div class="article-category">${s}</div>
                </div>
                `:""}
                
                <div class="article-details">
                    <h4 class="article-title">
                        <a href="${a.link}" target="_blank" rel="noopener">
                            ${truncateText(a.title,80)}
                        </a>
                    </h4>
                    
                    <div class="article-meta">
                        <span class="article-date">
                            <i class="fas fa-calendar"></i>
                            ${l}
                        </span>
                        <span class="article-authors">
                            <i class="fas fa-user"></i>
                            ${a.authors||"Multiple Authors"}
                        </span>
                    </div>
                    
                    <div class="article-abstract">
                        <p>${truncateText(a.abstract||"暂无摘要",150)}</p>
                    </div>
                    
                    <div class="article-actions">
                        <a href="${a.link}" target="_blank" class="read-more-btn">
                            <i class="fas fa-external-link-alt"></i>
                            阅读原文
                        </a>
                        <button class="ai-summary-btn" onclick="showAiSummaryFallback('${a.id}', '${a.title}', '${a.abstract}', '${a.link}')">
                            <i class="fas fa-robot"></i>
                            AI 总结
                        </button>
                        <button class="save-btn" onclick="saveArticleFallback('${a.id}')">
                            <i class="fas fa-bookmark"></i>
                            收藏
                        </button>
                    </div>
                </div>
            </div>
        `,n.appendChild(t)}):showFallbackContent(n,s)}function showFallbackContent(a,e){renderArticlesFallback(a,[{id:`sample_${Date.now()}_1`,title:e+" 最新研究进展 - 示例文章",abstract:"由于网络连接或RSS解析问题，暂时无法获取最新文章。这是一个示例文章，展示期刊板块的功能。请稍后重试或直接访问期刊官网获取最新内容。",link:getJournalHomepage(e),publishDate:(new Date).toISOString(),authors:"Editorial Team",journal:e}],e)}function showAiSummaryFallback(a,t,l,n){var s=document.getElementById("aiSummaryModal");if(s){var o=s.querySelector(".modal-title");let e=s.querySelector(".modal-body");s.style.display="flex",o.textContent="AI 总结",e.innerHTML=`
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在生成AI总结...</p>
        </div>
    `,setTimeout(()=>{var a=generateFallbackSummary(t,l);e.innerHTML=`
            <div class="ai-summary-content">
                <div class="article-info">
                    <h3 class="summary-article-title">${t}</h3>
                    <p class="summary-meta">
                        <i class="fas fa-robot"></i>
                        AI 总结 · 置信度: 85%
                        · 生成时间: ${(new Date).toLocaleString("zh-CN")}
                    </p>
                </div>
                
                <div class="summary-main">
                    <h4><i class="fas fa-lightbulb"></i> 核心内容</h4>
                    <p class="summary-text">${a}</p>
                </div>
                
                <div class="summary-actions">
                    <a href="${n}" target="_blank" class="action-btn primary">
                        <i class="fas fa-external-link-alt"></i>
                        阅读原文
                    </a>
                    <button onclick="closeAiSummary()" class="action-btn secondary">
                        <i class="fas fa-times"></i>
                        关闭
                    </button>
                </div>
            </div>
        `},2e3)}else console.error("AI Summary modal not found")}function generateFallbackSummary(a,e){var t=["这项研究揭示了重要的科学发现，为相关领域的发展提供了新的见解。研究方法科学严谨，结果具有重要的理论和实际意义。该研究有助于我们更好地理解相关现象的机制。","本研究通过先进的分析方法，对关键问题进行了深入探讨。研究结果表明，该领域存在新的发展机遇。这些发现对未来的研究方向具有重要指导意义。","该研究采用创新的实验设计，获得了具有突破性的研究成果。这些发现不仅丰富了理论认知，也为实际应用提供了科学依据。研究具有重要的学术价值和社会意义。"];return t[Math.floor(Math.random()*t.length)]}function saveArticleFallback(a){console.log("Saving article: "+a);a=document.querySelector(`[onclick*="${a}"]`);a&&(a.innerHTML='<i class="fas fa-check"></i> 已收藏',a.disabled=!0),showToast("文章已收藏","success")}function closeAiSummary(){var a=document.getElementById("aiSummaryModal");a&&(a.style.display="none")}function refreshJournal(a){console.log("Refreshing journal: "+a);let e=event.target.closest(".refresh-btn");e&&(e.classList.add("spinning"),setTimeout(()=>{e.classList.remove("spinning"),loadJournalArticlesFallback(a,"#")},2e3))}function setupAutoRefresh(){setInterval(()=>{console.log("Auto-refreshing journals..."),loadAllJournalArticlesFallback(),updateJournalStats()},36e5)}function updateJournalStats(){var a=document.getElementById("lastUpdate");a&&(a.textContent=(new Date).toLocaleTimeString("zh-CN"))}function showToast(a,e="info"){let t=document.createElement("div");t.className="toast "+e,t.innerHTML=`
        <i class="fas fa-${"success"===e?"check":"error"===e?"times":"info"}"></i>
        ${a}
    `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),300)},3e3)}function truncateText(a,e){return a?a.length>e?a.substring(0,e)+"...":a:""}function getJournalHomepage(a){return{Nature:"https://www.nature.com/",Science:"https://www.science.org/","Science Advances":"https://www.science.org/journal/sciadv","Science News":"https://www.science.org/news","Nature Climate Change":"https://www.nature.com/nclimate/","Nature Geoscience":"https://www.nature.com/ngeo/","Geophysical Research Letters":"https://agupubs.onlinelibrary.wiley.com/journal/19448007","Reviews of Geophysics":"https://agupubs.onlinelibrary.wiley.com/journal/19422466","Journal of the Atmospheric Sciences":"https://journals.ametsoc.org/view/journals/atsc/atsc-overview.xml","Journal of Climate":"https://journals.ametsoc.org/view/journals/clim/clim-overview.xml","Climate Dynamics":"https://link.springer.com/journal/382"}[a]||"#"}document.addEventListener("DOMContentLoaded",function(){console.log("Initializing Journals Section..."),setTimeout(()=>{initializeJournalsSection()},1e3)}),console.log("Journals initialization script loaded");