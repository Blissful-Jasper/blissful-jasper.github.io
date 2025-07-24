class DOIInfoFetcher{constructor(){this.apiEndpoints={crossref:"https://api.crossref.org/works/",semantic:"https://api.semanticscholar.org/graph/v1/paper/",altmetric:"https://api.altmetric.com/v1/doi/"},this.cache=new Map}async fetchDOIInfo(a){if(this.cache.has(a))return this.cache.get(a);try{var t=await this.fetchFromMultipleSources(a);return this.cache.set(a,t),t}catch(t){return console.error("Error fetching DOI info:",t),this.getDefaultInfo(a)}}async fetchFromMultipleSources(t){let a={doi:t,title:"",authors:[],journal:"",year:"",citations:0,downloads:0,altmetric:0,url:"https://doi.org/"+t};var i=[()=>this.fetchFromCrossRef(t),()=>this.fetchFromSemanticScholar(t),()=>this.fetchFromAltmetric(t)];return(await Promise.allSettled(i.map(t=>t()))).forEach(t=>{"fulfilled"===t.status&&t.value&&Object.assign(a,t.value)}),a}async fetchFromCrossRef(t){try{var a,i=await fetch(""+this.apiEndpoints.crossref+t,{headers:{Accept:"application/json"}});return i.ok?{title:(a=(await i.json()).message).title?.[0]||"",authors:a.author?.map(t=>(`${t.given||""} `+(t.family||"")).trim())||[],journal:a["container-title"]?.[0]||a.publisher||"",year:a.published?.["date-parts"]?.[0]?.[0]?.toString()||"",citations:a["is-referenced-by-count"]||0}:null}catch(t){return console.error("CrossRef API error:",t),null}}async fetchFromSemanticScholar(t){try{var a,i=await fetch(this.apiEndpoints.semantic+`DOI:${t}?fields=title,authors,venue,year,citationCount,influentialCitationCount`,{headers:{Accept:"application/json"}});return i.ok?{title:(a=await i.json()).title||"",authors:a.authors?.map(t=>t.name)||[],journal:a.venue||"",year:a.year?.toString()||"",citations:a.citationCount||0,influentialCitations:a.influentialCitationCount||0}:null}catch(t){return console.error("Semantic Scholar API error:",t),null}}async fetchFromAltmetric(t){try{var a,i=await fetch(""+this.apiEndpoints.altmetric+t);return i.ok?{altmetric:(a=await i.json()).score||0,downloads:a.readers?.mendeley||0}:null}catch(t){return console.error("Altmetric API error:",t),null}}getDefaultInfo(t){return{doi:t,title:"Loading...",authors:[],journal:"",year:"",citations:0,downloads:0,altmetric:0,url:"https://doi.org/"+t}}async updateDOIDisplay(a,i){i=document.getElementById(i);if(i){this.showLoadingState(i);try{var t=await this.fetchDOIInfo(a);this.renderDOIInfo(i,t)}catch(t){this.showErrorState(i,a)}}}showLoadingState(t){t.innerHTML=`
            <div class="doi-loading">
                <div class="loading-spinner"></div>
                <span>获取文献信息中...</span>
            </div>
        `}showErrorState(t,a){t.innerHTML=`
            <div class="doi-error">
                <i class="fas fa-exclamation-triangle"></i>
                <span>无法获取 ${a} 的信息</span>
                <a href="https://doi.org/${a}" target="_blank" rel="noopener">查看原文</a>
            </div>
        `}renderDOIInfo(t,a){t.innerHTML=`
            <div class="doi-info-card">
                <div class="doi-header">
                    <h4 class="doi-title">${a.title}</h4>
                    <div class="doi-meta">
                        <span class="doi-authors">${a.authors.slice(0,3).join(", ")}${3<a.authors.length?" et al.":""}</span>
                        <span class="doi-journal">${a.journal} (${a.year})</span>
                    </div>
                </div>
                <div class="doi-metrics">
                    <div class="metric-item">
                        <i class="fas fa-quote-right"></i>
                        <span class="metric-value">${a.citations}</span>
                        <span class="metric-label">引用</span>
                    </div>
                    <div class="metric-item">
                        <i class="fas fa-download"></i>
                        <span class="metric-value">${a.downloads}</span>
                        <span class="metric-label">下载</span>
                    </div>
                    ${0<a.altmetric?`
                    <div class="metric-item">
                        <i class="fas fa-chart-line"></i>
                        <span class="metric-value">${a.altmetric}</span>
                        <span class="metric-label">Altmetric</span>
                    </div>
                    `:""}
                </div>
                <div class="doi-actions">
                    <a href="${a.url}" target="_blank" rel="noopener" class="doi-link">
                        <i class="fas fa-external-link-alt"></i>
                        查看原文
                    </a>
                    <button class="cite-button" onclick="showCitation('${a.doi}')">
                        <i class="fas fa-quote-left"></i>
                        引用格式
                    </button>
                </div>
            </div>
        `}async updateAllDOIs(){var t;for(t of document.querySelectorAll("[data-doi]")){var a=t.dataset.doi;a&&(await this.updateDOIDisplay(a,t.id),await new Promise(t=>setTimeout(t,100)))}}async generateCitations(t){t=await this.fetchDOIInfo(t);return{apa:this.formatAPA(t),mla:this.formatMLA(t),chicago:this.formatChicago(t),bibtex:this.formatBibTeX(t)}}formatAPA(t){return(0<t.authors.length?""+t.authors.join(", "):"Unknown Author")+` (${t.year}). ${t.title}. ${t.journal}. https://doi.org/`+t.doi}formatMLA(t){return(0<t.authors.length?""+t.authors.join(", "):"Unknown Author")+`. "${t.title}." ${t.journal}, ${t.year}, doi:${t.doi}.`}formatChicago(t){return(0<t.authors.length?""+t.authors.join(", "):"Unknown Author")+`. "${t.title}." ${t.journal} (${t.year}). https://doi.org/${t.doi}.`}formatBibTeX(t){return`@article{${t.authors[0]?.split(" ").pop()||"Unknown"}${t.year},
  title={${t.title}},
  author={${t.authors.join(" and ")}},
  journal={${t.journal}},
  year={${t.year}},
  doi={${t.doi}}
}`}}async function showCitation(t){var t=await window.doiFetcher.generateCitations(t),a=document.createElement("div");a.className="citation-modal",a.innerHTML=`
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
                    <pre>${t.apa}</pre>
                    <button onclick="navigator.clipboard.writeText('${t.apa.replace(/'/g,"\\'")}')">复制</button>
                </div>
                <div class="citation-format">
                    <h4>MLA</h4>
                    <pre>${t.mla}</pre>
                    <button onclick="navigator.clipboard.writeText('${t.mla.replace(/'/g,"\\'")}')">复制</button>
                </div>
                <div class="citation-format">
                    <h4>Chicago</h4>
                    <pre>${t.chicago}</pre>
                    <button onclick="navigator.clipboard.writeText('${t.chicago.replace(/'/g,"\\'")}')">复制</button>
                </div>
                <div class="citation-format">
                    <h4>BibTeX</h4>
                    <pre>${t.bibtex}</pre>
                    <button onclick="navigator.clipboard.writeText('${t.bibtex.replace(/'/g,"\\'")}')">复制</button>
                </div>
            </div>
        </div>
    `,document.body.appendChild(a)}window.doiFetcher=new DOIInfoFetcher,document.addEventListener("DOMContentLoaded",()=>{window.doiFetcher.updateAllDOIs()});