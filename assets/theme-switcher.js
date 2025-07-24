class ThemeSwitcher{constructor(){this.currentTheme=localStorage.getItem("theme")||"blue",this.currentMode=localStorage.getItem("mode")||"light",this.init()}init(){this.applyTheme(),this.bindToggleButton(),this.createThemeSwitcher(),this.bindEvents()}applyTheme(){document.documentElement.setAttribute("data-theme",this.currentMode),document.body.className=document.body.className.replace(/theme-\w+/g,""),document.body.classList.add("theme-"+this.currentTheme),this.updateToggleIcon()}bindToggleButton(){var e=document.getElementById("themeToggle");e&&e.addEventListener("click",()=>{this.toggleMode()})}toggleMode(){this.currentMode="light"===this.currentMode?"dark":"light",localStorage.setItem("mode",this.currentMode),this.applyTheme()}updateToggleIcon(){var e=document.getElementById("themeIcon");e&&(e.className="light"===this.currentMode?"fas fa-moon":"fas fa-sun")}createThemeSwitcher(){var e;document.getElementById("theme-switcher-panel")||((e=document.createElement("div")).id="theme-switcher-panel",e.className="theme-switcher-panel",e.innerHTML=`
      <div class="theme-switcher-header">
        <h3><i class="fas fa-palette"></i> 主题设置</h3>
        <button class="close-theme-switcher" aria-label="关闭主题切换器">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="theme-switcher-content">
        <div class="theme-section">
          <h4>颜色主题</h4>
          <div class="theme-colors">
            <button class="theme-color-btn" data-theme="blue" style="background: linear-gradient(135deg, #2563eb, #1e40af)"></button>
            <button class="theme-color-btn" data-theme="purple" style="background: linear-gradient(135deg, #7c3aed, #6d28d9)"></button>
            <button class="theme-color-btn" data-theme="warm" style="background: linear-gradient(135deg, #667eea, #764ba2)"></button>
            <button class="theme-color-btn" data-theme="cool" style="background: linear-gradient(135deg, #a8edea, #fed6e3)"></button>
            <button class="theme-color-btn" data-theme="sunset" style="background: linear-gradient(135deg, #ff9a9e, #fecfef)"></button>
          </div>
        </div>
        
        <div class="theme-section">
          <h4>明暗模式</h4>
          <div class="mode-switch">
            <button class="mode-btn" data-mode="light">
              <i class="fas fa-sun"></i>
              浅色模式
            </button>
            <button class="mode-btn" data-mode="dark">
              <i class="fas fa-moon"></i>
              深色模式
            </button>
          </div>
        </div>
        
        <div class="theme-section">
          <h4>快速预设</h4>
          <div class="theme-presets">
            <button class="preset-btn" data-preset="academic">
              <i class="fas fa-university"></i>
              学术风格
            </button>
            <button class="preset-btn" data-preset="creative">
              <i class="fas fa-paint-brush"></i>
              创意风格
            </button>
            <button class="preset-btn" data-preset="professional">
              <i class="fas fa-briefcase"></i>
              商务风格
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(e))}bindEvents(){var e=document.getElementById("themeToggle");e&&e.addEventListener("click",()=>{this.toggleMode()}),document.addEventListener("click",e=>{var t;e.target.classList.contains("theme-color-btn")&&(t=e.target.dataset.theme,this.setTheme(t)),(e.target.classList.contains("mode-btn")||e.target.parentElement.classList.contains("mode-btn"))&&(t=e.target.dataset.mode||e.target.parentElement.dataset.mode,this.setMode(t)),(e.target.classList.contains("preset-btn")||e.target.parentElement.classList.contains("preset-btn"))&&(t=e.target.dataset.preset||e.target.parentElement.dataset.preset,this.applyPreset(t)),e.target.classList.contains("close-theme-switcher")&&this.closeThemeSwitcher()}),document.addEventListener("dblclick",e=>{(e.ctrlKey||e.metaKey)&&this.openThemeSwitcher()}),document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.shiftKey&&"T"===e.key&&(e.preventDefault(),this.openThemeSwitcher())})}setTheme(e){this.currentTheme=e,localStorage.setItem("theme",e),this.applyTheme(),this.updateActiveStates(),this.showNotification(`已切换到 ${this.getThemeName(e)} 主题`)}setMode(e){this.currentMode=e,localStorage.setItem("mode",e),this.applyTheme(),this.updateActiveStates(),this.updateThemeIcon(),this.showNotification(`已切换到${"dark"===e?"深色":"浅色"}模式`)}toggleMode(){var e="light"===this.currentMode?"dark":"light";this.setMode(e)}applyPreset(e){var t={academic:{theme:"blue",mode:"light"},creative:{theme:"warm",mode:"light"},professional:{theme:"purple",mode:"light"}}[e];t&&(this.setTheme(t.theme),this.setMode(t.mode),this.showNotification(`已应用${this.getPresetName(e)}预设`))}getThemeName(e){return{blue:"经典蓝",purple:"优雅紫",warm:"温暖渐变",cool:"清新渐变",sunset:"日落渐变"}[e]||e}getPresetName(e){return{academic:"学术风格",creative:"创意风格",professional:"商务风格"}[e]||e}updateActiveStates(){document.querySelectorAll(".theme-color-btn").forEach(e=>{e.classList.toggle("active",e.dataset.theme===this.currentTheme)}),document.querySelectorAll(".mode-btn").forEach(e=>{e.classList.toggle("active",e.dataset.mode===this.currentMode)})}updateThemeIcon(){var e=document.getElementById("themeIcon");e&&(e.className="dark"===this.currentMode?"fas fa-sun":"fas fa-moon")}openThemeSwitcher(){var e=document.getElementById("theme-switcher-panel");e&&(e.classList.add("active"),this.updateActiveStates())}closeThemeSwitcher(){var e=document.getElementById("theme-switcher-panel");e&&e.classList.remove("active")}showNotification(e){var t=document.querySelector(".theme-notification");t&&t.remove();let a=document.createElement("div");a.className="theme-notification",a.innerHTML=`
      <i class="fas fa-check-circle"></i>
      ${e}
    `,document.body.appendChild(a),setTimeout(()=>{a.classList.add("fade-out"),setTimeout(()=>a.remove(),300)},3e3)}}document.addEventListener("DOMContentLoaded",()=>{window.themeSwitcher=new ThemeSwitcher}),window.ThemeSwitcher=ThemeSwitcher;