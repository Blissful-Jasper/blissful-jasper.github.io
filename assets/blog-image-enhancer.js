/**
 * Blog Image Enhancement Script
 * 智能图片适配、lazy loading、错误处理、预览功能
 */

document.addEventListener('DOMContentLoaded', function() {
    initImageEnhancements();
});

function initImageEnhancements() {
    // 初始化所有图片增强功能
    setupIntelligentImageFit();
    setupImageLazyLoading();
    setupImagePreview();
    setupImageErrorHandling();
    setupSkeletonLoading();
}

// 智能图片适配
function setupIntelligentImageFit() {
    const images = document.querySelectorAll('.card-image img');
    
    images.forEach(img => {
        // 如果图片已经加载
        if (img.complete && img.naturalHeight !== 0) {
            applyIntelligentFit(img);
        } else {
            // 图片加载完成后应用智能适配
            img.addEventListener('load', () => applyIntelligentFit(img));
        }
    });
}

function applyIntelligentFit(img) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = 1.5; // 卡片图片容器的宽高比
    
    // 移除所有现有的fit类
    img.classList.remove('fit-cover', 'fit-contain', 'fit-fill');
    
    // 根据图片特征应用最佳fit方式
    if (isChartOrDiagram(img)) {
        // 图表、示意图等使用contain保持完整性
        img.classList.add('fit-contain');
        img.style.objectFit = 'contain';
        img.style.background = 'white';
        img.style.padding = '10px';
    } else if (aspectRatio > 2 || aspectRatio < 0.5) {
        // 极端比例图片使用contain
        img.classList.add('fit-contain');
        img.style.objectFit = 'contain';
        img.style.background = 'var(--bg-gray-50)';
    } else if (Math.abs(aspectRatio - containerAspectRatio) < 0.3) {
        // 比例接近的图片使用cover
        img.classList.add('fit-cover');
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
    } else {
        // 默认使用智能裁剪
        img.classList.add('fit-cover');
        img.style.objectFit = 'cover';
        img.style.objectPosition = getSmartObjectPosition(img, aspectRatio);
    }
}

function isChartOrDiagram(img) {
    const src = img.src.toLowerCase();
    const alt = img.alt.toLowerCase();
    
    // 检查文件名或alt文本中的关键词
    const chartKeywords = ['chart', 'graph', 'plot', 'diagram', 'figure', 'mrg', 'cckws', 'scale'];
    
    return chartKeywords.some(keyword => 
        src.includes(keyword) || alt.includes(keyword)
    );
}

function getSmartObjectPosition(img, aspectRatio) {
    // 根据图片比例智能确定对象位置
    if (aspectRatio > 1.8) {
        return 'center top'; // 宽图片关注顶部
    } else if (aspectRatio < 0.8) {
        return 'center center'; // 窄图片居中
    } else {
        return 'center center'; // 默认居中
    }
}

// 图片懒加载
function setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('.card-image img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级：立即加载所有图片
        document.querySelectorAll('.card-image img[data-src]').forEach(loadImage);
    }
}

function loadImage(img) {
    if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loading');
        
        img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
            applyIntelligentFit(img);
        });
        
        img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');
            handleImageError(img);
        });
    }
}

// 图片错误处理
function setupImageErrorHandling() {
    document.querySelectorAll('.card-image img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
}

function handleImageError(img) {
    const container = img.closest('.card-image');
    if (!container) return;
    
    // 获取文章分类用于降级显示
    const article = img.closest('.blog-post-card');
    const category = article ? article.dataset.category : '';
    
    // 创建降级占位符
    const fallback = createImageFallback(category);
    container.innerHTML = '';
    container.appendChild(fallback);
    container.classList.add('placeholder');
}

function createImageFallback(category) {
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    
    let icon = 'fas fa-image';
    let bgGradient = 'linear-gradient(135deg, #6b7280, #9ca3af)';
    
    switch(category) {
        case '科研':
            icon = 'fas fa-microscope';
            bgGradient = 'linear-gradient(135deg, #8b5cf6, #a855f7)';
            break;
        case '技术':
            icon = 'fas fa-code';
            bgGradient = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            break;
        case '杂谈':
            icon = 'fas fa-coffee';
            bgGradient = 'linear-gradient(135deg, #f59e0b, #f97316)';
            break;
    }
    
    fallback.innerHTML = `
        <div class="fallback-icon">
            <i class="${icon}"></i>
        </div>
        <span class="fallback-text">${category || '文章'}</span>
    `;
    
    fallback.style.background = bgGradient;
    
    return fallback;
}

// 图片预览功能
function setupImagePreview() {
    document.querySelectorAll('.card-image img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openImagePreview(img);
        });
    });
}

function openImagePreview(img) {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    
    if (modalImg && modalTitle) {
        modalImg.src = img.src;
        modalTitle.textContent = img.alt || '图片预览';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 添加关闭事件
        modal.addEventListener('click', closeImagePreview);
        document.addEventListener('keydown', handleEscapeKey);
    }
}

function closeImagePreview() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        modal.removeEventListener('click', closeImagePreview);
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeImagePreview();
    }
}

// 骨架屏加载效果
function setupSkeletonLoading() {
    // 为所有图片添加骨架屏效果
    document.querySelectorAll('.card-image img').forEach(img => {
        if (!img.complete) {
            const skeleton = createImageSkeleton();
            const container = img.closest('.card-image');
            
            container.insertBefore(skeleton, img);
            
            img.addEventListener('load', () => {
                skeleton.remove();
            });
            
            img.addEventListener('error', () => {
                skeleton.remove();
            });
        }
    });
}

function createImageSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'image-skeleton';
    skeleton.innerHTML = `
        <div class="skeleton-animation"></div>
    `;
    return skeleton;
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 响应式图片加载
window.addEventListener('resize', debounce(() => {
    setupIntelligentImageFit();
}, 250));

// 导出API供外部使用
window.BlogImageEnhancer = {
    refresh: initImageEnhancements,
    applyIntelligentFit: setupIntelligentImageFit,
    handleError: handleImageError
};
