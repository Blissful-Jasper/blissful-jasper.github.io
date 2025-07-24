class VisitorAnalytics{constructor(){this.visitorData=[],this.pageViews={},this.currentSession={},this.init()}init(){this.loadStoredData(),this.recordVisit(),this.createAnalyticsPanel(),this.updateDisplay(),this.bindEvents()}loadStoredData(){try{var t,i=localStorage.getItem("visitor-analytics");i&&(t=JSON.parse(i),this.visitorData=t.visitors||[],this.pageViews=t.pageViews||{})}catch(t){console.log("Failed to load analytics data:",t)}}saveData(){try{var t={visitors:this.visitorData,pageViews:this.pageViews,lastUpdated:(new Date).toISOString()};localStorage.setItem("visitor-analytics",JSON.stringify(t))}catch(t){console.log("Failed to save analytics data:",t)}}async recordVisit(){var t=window.location.pathname,i=(new Date).toISOString(),s=this.getOrCreateSessionId(),e=(this.pageViews[t]=(this.pageViews[t]||0)+1,await this.getVisitorInfo()),a=this.visitorData[this.visitorData.length-1],a=!a||18e5<new Date(i)-new Date(a.timestamp)||a.sessionId!==s;this.currentSession={page:t,timestamp:i,location:e.location,country:e.country,city:e.city,ip:e.ip,sessionId:s,isNewSession:a,referrer:document.referrer||"直接访问",userAgent:navigator.userAgent.substring(0,100),viewport:window.innerWidth+"x"+window.innerHeight,device:this.getDeviceType()},this.visitorData.push(this.currentSession),2e3<this.visitorData.length&&(this.visitorData=this.visitorData.slice(-2e3)),this.saveData(),this.updateGlobalStats()}getOrCreateSessionId(){let t=sessionStorage.getItem("visitor-session-id");return t||(t="session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9),sessionStorage.setItem("visitor-session-id",t)),t}getDeviceType(){var t=window.innerWidth;return t<=768?"移动设备":t<=1024?"平板设备":"桌面设备"}async getVisitorInfo(){try{var t=await(await fetch("https://ipapi.co/json/")).json();return{ip:t.ip||"未知",country:t.country_name||"未知",city:t.city||"未知",location:t.city+", "+t.country_name,latitude:t.latitude,longitude:t.longitude}}catch(t){return console.log("Failed to get location info:",t),{ip:"本地",country:"未知",city:"未知",location:"本地访问",latitude:null,longitude:null}}}createAnalyticsPanel(){var t=document.createElement("button"),i=(t.className="analytics-toggle",t.innerHTML='<i class="fas fa-chart-line"></i>',t.title="网站访问统计",document.createElement("div"));i.className="analytics-panel",i.innerHTML=`
      <div class="stats-header">
        <i class="fas fa-globe"></i>
        <span>网站访问统计</span>
        <button class="panel-close" onclick="window.toggleAnalyticsPanel()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="stats-overview">
        <div class="overview-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <div class="card-number" id="total-visits">0</div>
            <div class="card-label">总访问量</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <div class="card-number" id="unique-visitors">0</div>
            <div class="card-label">独立访客</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">📱</div>
          <div class="card-content">
            <div class="card-number" id="today-visits">0</div>
            <div class="card-label">今日访问</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">🌍</div>
          <div class="card-content">
            <div class="card-number" id="countries-count">0</div>
            <div class="card-label">访问国家</div>
          </div>
        </div>
      </div>
      
      <div class="stats-tabs">
        <button class="tab-btn active" data-tab="pages">📄 页面统计</button>
        <button class="tab-btn" data-tab="visitors">👥 访客分析</button>
        <button class="tab-btn" data-tab="geography">🗺️ 地理分布</button>
      </div>
      
      <div class="stats-content">
        <div class="tab-content active" id="tab-pages">
          <div class="content-header">
            <h4>页面访问排行</h4>
            <span class="current-page">当前页面: <span id="current-page-views">0</span> 次访问</span>
          </div>
          <div id="page-stats-list" class="stats-list"></div>
        </div>
        
        <div class="tab-content" id="tab-visitors">
          <div class="content-header">
            <h4>访客设备分析</h4>
            <div id="device-stats" class="device-stats"></div>
          </div>
          <div class="content-header">
            <h4>最近访客记录</h4>
          </div>
          <div id="recent-visitors" class="visitor-list"></div>
        </div>
        
        <div class="tab-content" id="tab-geography">
          <div class="content-header">
            <h4>地理位置分布</h4>
          </div>
          <div id="geography-stats" class="geography-stats"></div>
        </div>
      </div>
    `,document.body.appendChild(t),document.body.appendChild(i),this.toggleBtn=t,this.panel=i,this.bindTabEvents()}bindEvents(){this.toggleBtn.addEventListener("click",()=>{this.panel.classList.toggle("visible"),this.toggleBtn.classList.toggle("active")}),document.addEventListener("click",t=>{this.panel.contains(t.target)||this.toggleBtn.contains(t.target)||(this.panel.classList.remove("visible"),this.toggleBtn.classList.remove("active"))})}bindTabEvents(){let s=this.panel.querySelectorAll(".tab-btn"),e=this.panel.querySelectorAll(".tab-content");s.forEach(i=>{i.addEventListener("click",()=>{s.forEach(t=>t.classList.remove("active")),e.forEach(t=>t.classList.remove("active")),i.classList.add("active");var t="tab-"+i.dataset.tab;document.getElementById(t).classList.add("active"),this.updateTabContent(i.dataset.tab)})})}updateTabContent(t){switch(t){case"pages":this.updatePageStats();break;case"visitors":this.updateVisitorAnalysis();break;case"geography":this.updateGeographyStats()}}updateGlobalStats(){var t,i;document.getElementById("visitorInfo")&&(t=new Set(this.visitorData.map(t=>t.sessionId)).size,i=Object.keys(this.pageViews).length,document.getElementById("visitorInfo").innerHTML=`总访问 ${this.visitorData.length} | 会话 ${t} | 页面 `+i)}updateVisitorAnalysis(){let i={};this.visitorData.forEach(t=>{t=t.device||"未知设备";i[t]=(i[t]||0)+1});var t=document.getElementById("device-stats");let e=this.visitorData.length;t.innerHTML=Object.entries(i).sort(([,t],[,i])=>i-t).map(([t,i])=>{var s=(i/e*100).toFixed(1);return`
          <div class="device-stat-item">
            <div class="device-info">
              <span class="device-name">${t}</span>
              <span class="device-count">${i} (${s}%)</span>
            </div>
            <div class="device-bar">
              <div class="device-progress" style="width: ${s}%"></div>
            </div>
          </div>
        `}).join(""),this.updateRecentVisitors()}updateGeographyStats(){var t=document.getElementById("geography-stats");let i={},s={};this.visitorData.forEach(t=>{t.country&&"未知"!==t.country&&(i[t.country]=(i[t.country]||0)+1),t.city&&"未知"!==t.city&&(s[t.city]=(s[t.city]||0)+1)});var e=Object.entries(i).sort(([,t],[,i])=>i-t).slice(0,8),a=Object.entries(s).sort(([,t],[,i])=>i-t).slice(0,8);t.innerHTML=`
      <div class="geo-section">
        <h5>🌍 访问国家/地区</h5>
        <div class="geo-list">
          ${e.map(([t,i])=>`
            <div class="geo-item">
              <span class="geo-name">${t}</span>
              <span class="geo-count">${i}</span>
            </div>
          `).join("")}
        </div>
      </div>
      
      <div class="geo-section">
        <h5>🏙️ 访问城市</h5>
        <div class="geo-list">
          ${a.map(([t,i])=>`
            <div class="geo-item">
              <span class="geo-name">${t}</span>
              <span class="geo-count">${i}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `}updateDisplay(){var t=this.visitorData.length,i=new Set(this.visitorData.map(t=>t.sessionId||t.ip)).size,s=this.getTodayVisits(),e=this.pageViews[window.location.pathname]||0,a=new Set(this.visitorData.map(t=>t.country).filter(t=>t&&"未知"!==t)).size,t=(this.safeUpdateElement("total-visits",t),this.safeUpdateElement("unique-visitors",i),this.safeUpdateElement("today-visits",s),this.safeUpdateElement("current-page-views",e),this.safeUpdateElement("countries-count",a),this.updatePageStats(),this.updateRecentVisitors(),this.panel?.querySelector(".tab-btn.active"));t&&this.updateTabContent(t.dataset.tab)}safeUpdateElement(t,i){t=document.getElementById(t);t&&(t.textContent=i)}getTodayVisits(){let i=(new Date).toDateString();return this.visitorData.filter(t=>new Date(t.timestamp).toDateString()===i).length}updatePageStats(){var t,i=document.getElementById("page-stats-list");i&&(t=Object.entries(this.pageViews).sort(([,t],[,i])=>i-t).slice(0,10),i.innerHTML=t.map(([t,i])=>`
        <div class="page-stat-item ${t===window.location.pathname?"current":""}">
          <div class="page-info">
            <span class="page-name">${this.getPageDisplayName(t)}</span>
            <span class="page-path">${t}</span>
          </div>
          <div class="page-metrics">
            <span class="page-views">${i}</span>
            <span class="views-label">次</span>
          </div>
        </div>
      `).join(""))}getPageDisplayName(t){return{"/":"🏠 首页","/index.html":"🏠 首页","/about.html":"👤 关于我","/blog.html":"📝 博客文章","/research.html":"🔬 研究工作","/publications.html":"📚 学术发表","/gallery.html":"📷 摄影作品","/contact.html":"📧 联系方式","/links.html":"🔗 友情链接","/maps.html":"🗺️ 地图导航","/demo.html":"🎯 功能演示","/gallery-test.html":"🧪 测试页面"}[t]||"📄 "+t.replace(/\.html$/,"").replace(/^\//,"")}updateRecentVisitors(){var t,i=document.getElementById("recent-visitors");i&&(t=this.visitorData.slice(-15).reverse(),i.innerHTML=t.map(t=>{var i=new Date(t.timestamp).toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),s=this.getPageDisplayName(t.page);return`
        <div class="visitor-item">
          <div class="visitor-avatar">
            ${this.getCountryFlag(t.country)}
          </div>
          <div class="visitor-details">
            <div class="visitor-location">${t.location||"未知位置"}</div>
            <div class="visitor-meta">
              <span class="visitor-page">${s}</span>
              <span class="visitor-time">${i}</span>
            </div>
            ${t.device?`<div class="visitor-device">${t.device}</div>`:""}
          </div>
        </div>
      `}).join(""))}getCountryFlag(t){return{"中国":"🇨🇳","美国":"🇺🇸","日本":"🇯🇵","英国":"🇬🇧","德国":"🇩🇪","法国":"🇫🇷","韩国":"🇰🇷","加拿大":"🇨🇦","澳大利亚":"🇦🇺"}[t]||"🌍"}updateVisitorMap(){var t,i=this.panel.querySelector(".visitor-map");let s={};this.visitorData.forEach(t=>{t.country&&"未知"!==t.country&&(s[t.country]=(s[t.country]||0)+1)}),0<Object.keys(s).length&&(t=Object.entries(s).sort(([,t],[,i])=>i-t).slice(0,5),i.innerHTML=`
        <div style="padding: 10px; font-size: 12px;">
          <strong style="display: block; margin-bottom: 8px;">访客地区分布</strong>
          ${t.map(([t,i])=>`
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>${t}</span>
              <span style="color: #667eea; font-weight: 600;">${i}</span>
            </div>
          `).join("")}
        </div>
      `)}}document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{new VisitorAnalytics},1e3)}),window.VisitorAnalytics=VisitorAnalytics,window.toggleAnalyticsPanel=function(){var t=document.querySelector(".analytics-panel"),i=document.querySelector(".analytics-toggle");t&&i?(t.classList.toggle("visible"),i.classList.toggle("active")):console.log("统计面板组件尚未初始化")},window.getVisitStats=function(){try{var t,i=localStorage.getItem("visitor-analytics");if(i)return{totalVisits:(t=JSON.parse(i)).visitors?t.visitors.length:0,pageViews:t.pageViews||{},lastUpdated:t.lastUpdated}}catch(t){console.log("Failed to get visit stats:",t)}return{totalVisits:0,pageViews:{},lastUpdated:null}};