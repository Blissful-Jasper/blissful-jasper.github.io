/* ================================================
   Enhanced Theme Switcher with Dark Mode Support
   ================================================ */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'blue';
    this.currentMode = localStorage.getItem('mode') || 'light';
    this.init();
  }

  init() {
    this.applyTheme();
    this.bindToggleButton();
    this.createThemeSwitcher();
    this.bindEvents();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentMode);
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${this.currentTheme}`);
    
    // Update toggle button icon
    this.updateToggleIcon();
  }

  bindToggleButton() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleMode();
      });
    }
  }

  toggleMode() {
    this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('mode', this.currentMode);
    this.applyTheme();
  }

  updateToggleIcon() {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = this.currentMode === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  createThemeSwitcher() {
    // Check if theme switcher already exists
    if (document.getElementById('theme-switcher-panel')) return;

    const themeSwitcher = document.createElement('div');
    themeSwitcher.id = 'theme-switcher-panel';
    themeSwitcher.className = 'theme-switcher-panel';
    themeSwitcher.innerHTML = `
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
    `;

    document.body.appendChild(themeSwitcher);
  }

  bindEvents() {
    // Theme toggle button in header
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleMode();
      });
    }

    // Color theme buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('theme-color-btn')) {
        const theme = e.target.dataset.theme;
        this.setTheme(theme);
      }

      if (e.target.classList.contains('mode-btn') || e.target.parentElement.classList.contains('mode-btn')) {
        const mode = e.target.dataset.mode || e.target.parentElement.dataset.mode;
        this.setMode(mode);
      }

      if (e.target.classList.contains('preset-btn') || e.target.parentElement.classList.contains('preset-btn')) {
        const preset = e.target.dataset.preset || e.target.parentElement.dataset.preset;
        this.applyPreset(preset);
      }

      if (e.target.classList.contains('close-theme-switcher')) {
        this.closeThemeSwitcher();
      }
    });

    // Double-click to open theme switcher
    document.addEventListener('dblclick', (e) => {
      if (e.ctrlKey || e.metaKey) {
        this.openThemeSwitcher();
      }
    });

    // Keyboard shortcut: Ctrl/Cmd + Shift + T
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.openThemeSwitcher();
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
    this.updateActiveStates();
    this.showNotification(`已切换到 ${this.getThemeName(theme)} 主题`);
  }

  setMode(mode) {
    this.currentMode = mode;
    localStorage.setItem('mode', mode);
    this.applyTheme();
    this.updateActiveStates();
    this.updateThemeIcon();
    this.showNotification(`已切换到${mode === 'dark' ? '深色' : '浅色'}模式`);
  }

  toggleMode() {
    const newMode = this.currentMode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  applyPreset(preset) {
    const presets = {
      academic: { theme: 'blue', mode: 'light' },
      creative: { theme: 'warm', mode: 'light' },
      professional: { theme: 'purple', mode: 'light' }
    };

    const config = presets[preset];
    if (config) {
      this.setTheme(config.theme);
      this.setMode(config.mode);
      this.showNotification(`已应用${this.getPresetName(preset)}预设`);
    }
  }

  getThemeName(theme) {
    const names = {
      blue: '经典蓝',
      purple: '优雅紫',
      warm: '温暖渐变',
      cool: '清新渐变',
      sunset: '日落渐变'
    };
    return names[theme] || theme;
  }

  getPresetName(preset) {
    const names = {
      academic: '学术风格',
      creative: '创意风格',
      professional: '商务风格'
    };
    return names[preset] || preset;
  }

  updateActiveStates() {
    // Update color theme buttons
    document.querySelectorAll('.theme-color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
    });

    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === this.currentMode);
    });
  }

  updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.className = this.currentMode === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  openThemeSwitcher() {
    const panel = document.getElementById('theme-switcher-panel');
    if (panel) {
      panel.classList.add('active');
      this.updateActiveStates();
    }
  }

  closeThemeSwitcher() {
    const panel = document.getElementById('theme-switcher-panel');
    if (panel) {
      panel.classList.remove('active');
    }
  }

  showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.theme-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${message}
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeSwitcher = new ThemeSwitcher();
});

// Export for global use
window.ThemeSwitcher = ThemeSwitcher;
