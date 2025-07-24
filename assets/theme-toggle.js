// 主题切换脚本
(function() {
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.title = '切换主题';
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.style = 'position:fixed;top:1.2rem;right:1.2rem;z-index:9999;background:var(--bg-secondary,#f8f9fa);border:none;border-radius:50%;width:44px;height:44px;box-shadow:0 2px 8px rgba(44,62,80,0.10);cursor:pointer;font-size:1.3rem;';
  document.body.appendChild(themeToggle);
  function setTheme(dark) {
    if(dark) {
      document.documentElement.setAttribute('data-theme','dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  themeToggle.onclick = function() {
    setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  };
  // 初始化
  if(localStorage.getItem('theme')==='dark') setTheme(true);
})();
