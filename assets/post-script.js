// 博客文章页面功能
document.addEventListener('DOMContentLoaded', function() {
    initializeTOC();
    initializeBackToTop();
    initializeImageZoom();
    initializeCodeHighlight();
    initializeScrollProgress();
});

// 初始化目录
function initializeTOC() {
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
    const tocContent = document.getElementById('tocContent');
    
    if (headings.length === 0) {
        document.querySelector('.toc-trigger').style.display = 'none';
        return;
    }
    
    const tocList = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        // 为标题添加ID
        const id = `heading-${index}`;
        heading.id = id;
        
        // 创建目录项
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.className = `toc-level-${heading.tagName.toLowerCase()}`;
        
        // 添加点击事件
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth'
            });
            
            // 在移动设备上自动关闭目录
            if (window.innerWidth <= 768) {
                toggleToc();
            }
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    tocContent.appendChild(tocList);
    
    // 监听滚动，高亮当前标题
    window.addEventListener('scroll', updateTOCHighlight);
}

// 更新目录高亮
function updateTOCHighlight() {
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
    const tocLinks = document.querySelectorAll('.toc-content a');
    
    let currentHeading = null;
    const scrollTop = window.pageYOffset;
    
    headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
            currentHeading = index;
        }
    });
    
    tocLinks.forEach((link, index) => {
        link.classList.toggle('active', index === currentHeading);
    });
}

// 切换目录显示
function toggleToc() {
    const tocContainer = document.getElementById('tocContainer');
    tocContainer.classList.toggle('active');
}

// 初始化回到顶部
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

// 回到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 分享功能
function sharePost() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        copyUrl();
    }
}

function shareToWeibo() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
}

function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
}

function copyUrl() {
    navigator.clipboard.writeText(window.location.href).then(function() {
        showToast('链接已复制到剪贴板！');
    }, function() {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('链接已复制到剪贴板！');
    });
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 初始化图片缩放
function initializeImageZoom() {
    const images = document.querySelectorAll('.post-content img');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            openImageModal(this);
        });
    });
}

// 打开图片模态框
function openImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImageModal(this)"></div>
        <div class="modal-content">
            <img src="${img.src}" alt="${img.alt}" style="max-width: 90vw; max-height: 90vh;">
            <button class="modal-close" onclick="closeImageModal(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: -40px;
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1.2rem;
        color: #333;
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // 阻止body滚动
    document.body.style.overflow = 'hidden';
}

// 关闭图片模态框
function closeImageModal(element) {
    const modal = element.closest('.image-modal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }, 300);
}

// 初始化代码高亮
function initializeCodeHighlight() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // 添加复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const pre = block.parentNode;
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        pre.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
    });
}

// 初始化滚动进度
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC 键关闭目录
    if (e.key === 'Escape') {
        const tocContainer = document.getElementById('tocContainer');
        if (tocContainer.classList.contains('active')) {
            toggleToc();
        }
    }
    
    // T 键切换目录
    if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            e.preventDefault();
            toggleToc();
        }
    }
    
    // 上箭头键回到顶部
    if (e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
    }
});

// 平滑滚动到锚点
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// 懒加载图片
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 文章阅读时间计算
function calculateReadingTime() {
    const content = document.querySelector('.post-content');
    if (!content) return;
    
    const text = content.textContent;
    const wordsPerMinute = 200; // 假设每分钟阅读200个字
    const words = text.length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} 分钟阅读`;
    }
}
