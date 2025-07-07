/* ================================================
   Gallery Page JavaScript
   ================================================ */

/**
 * Initialize gallery functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeFilterButtons();
  initializeLightbox();
  initializeImageLoading();
  updatePageStats();
  updateCurrentTime();
});

/* ====================
   Filter Functionality
   ==================== */

/**
 * Initialize filter buttons and their click handlers
 */
function initializeFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;
      handleCategoryFilter(category, filterButtons, galleryItems);
    });
  });
}

/**
 * Handle category filtering
 * @param {string} category - The category to filter by
 * @param {NodeList} filterButtons - All filter buttons
 * @param {NodeList} galleryItems - All gallery items
 */
function handleCategoryFilter(category, filterButtons, galleryItems) {
  // Update active button
  filterButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Filter and animate items
  galleryItems.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      showGalleryItem(item);
    } else {
      hideGalleryItem(item);
    }
  });
  
  // Update statistics
  updateGalleryStats(category, galleryItems);
}

/**
 * Show gallery item with animation
 * @param {Element} item - Gallery item to show
 */
function showGalleryItem(item) {
  item.style.display = 'block';
  item.classList.add('filter-animate');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    item.classList.remove('filter-animate');
  }, 500);
}

/**
 * Hide gallery item
 * @param {Element} item - Gallery item to hide
 */
function hideGalleryItem(item) {
  item.style.display = 'none';
}

/* ====================
   Lightbox Functionality
   ==================== */

/**
 * Initialize lightbox event listeners
 */
function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  if (!lightbox) return;
  
  // 点击背景关闭
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // 阻止内容区域的点击事件冒泡
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  if (lightboxContent) {
    lightboxContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

/**
 * 打开增强型灯箱
 * @param {string} imageSrc - 图片源路径
 * @param {string} title - 图片标题
 * @param {string} description - 图片描述
 * @param {Object} options - 额外选项
 */
function openLightbox(imageSrc, title, description, options = {}) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const imageLoading = document.getElementById('imageLoading');
  
  if (!lightbox || !lightboxImage) {
    console.warn('Lightbox elements not found');
    return;
  }
  
  // 存储当前图片信息到全局变量
  window.currentImageData = {
    src: imageSrc,
    title: title || '图片',
    description: description || '',
    originalPath: options.originalPath || imageSrc,
    thumbnail: options.thumbnail || imageSrc,
    metadata: options.metadata || {}
  };
  
  // 设置基本信息
  lightboxTitle.textContent = title || '图片';
  lightboxDescription.textContent = description || '';
  
  // 显示加载状态
  imageLoading.style.display = 'flex';
  lightboxImage.style.opacity = '0';
  
  // 预加载图片
  const img = new Image();
  img.onload = function() {
    lightboxImage.src = this.src;
    lightboxImage.alt = title || '图片';
    lightboxImage.style.opacity = '1';
    imageLoading.style.display = 'none';
    
    // 重置缩放
    resetZoom();
  };
  
  img.onerror = function() {
    console.warn('Failed to load image:', imageSrc);
    // 尝试原图路径
    if (options.originalPath && options.originalPath !== imageSrc) {
      img.src = options.originalPath;
    } else {
      imageLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>图片加载失败</span>';
    }
  };
  
  // 开始加载图片
  img.src = imageSrc;
  
  // 显示灯箱
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // 添加渐入动画
  setTimeout(() => {
    lightbox.classList.add('active');
  }, 10);
  
  // 更新元数据显示
  updateImageMeta(options.metadata || {});
  
  // 绑定键盘事件
  document.addEventListener('keydown', handleLightboxKeyboard);
}

/**
 * 更新图片元数据显示
 * @param {Object} metadata - 元数据对象
 */
function updateImageMeta(metadata) {
  const metaContainer = document.getElementById('lightbox-meta');
  if (!metaContainer) return;
  
  let metaHTML = '';
  
  if (metadata.location) {
    metaHTML += `<div class="meta-item"><i class="fas fa-map-marker-alt"></i> ${metadata.location}</div>`;
  }
  
  if (metadata.date) {
    metaHTML += `<div class="meta-item"><i class="fas fa-calendar"></i> ${metadata.date}</div>`;
  }
  
  if (metadata.camera) {
    metaHTML += `<div class="meta-item"><i class="fas fa-camera"></i> ${metadata.camera}</div>`;
  }
  
  if (metadata.size) {
    metaHTML += `<div class="meta-item"><i class="fas fa-expand-arrows-alt"></i> ${metadata.size}</div>`;
  }
  
  metaContainer.innerHTML = metaHTML;
}

/**
 * 获取原图路径
 * @param {string} imagePath - 图片路径
 * @returns {string} 处理后的原图路径
 */
function getOriginalImagePath(imagePath) {
  // 如果已经是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 确保路径以 / 开头
  if (!imagePath.startsWith('/')) {
    imagePath = '/' + imagePath;
  }
  
  // 构建完整的URL路径
  const baseUrl = window.location.origin;
  const fullPath = baseUrl + imagePath;
  
  console.log('Original image path:', fullPath); // 调试日志
  return fullPath;
}

/**
 * 查看原图 - 重新设计
 */
function viewOriginalImage() {
  if (!window.currentImageData) {
    showNotification('无法获取图片信息');
    return;
  }
  
  const originalPath = getOriginalImagePath(window.currentImageData.originalPath);
  
  // 创建原图查看器
  const originalViewer = document.createElement('div');
  originalViewer.className = 'original-image-viewer';
  originalViewer.innerHTML = `
    <div class="original-viewer-overlay" onclick="closeOriginalViewer()"></div>
    <div class="original-viewer-content">
      <div class="original-viewer-header">
        <div class="viewer-title">
          <i class="fas fa-expand-arrows-alt"></i>
          <span>原图查看 - ${window.currentImageData.title}</span>
        </div>
        <div class="viewer-controls">
          <button class="viewer-btn" onclick="downloadOriginalImage()" title="下载原图">
            <i class="fas fa-download"></i>
            下载
          </button>
          <button class="viewer-btn" onclick="openInNewTab('${originalPath}')" title="在新标签页打开">
            <i class="fas fa-external-link-alt"></i>
            新窗口
          </button>
          <button class="viewer-btn viewer-close" onclick="closeOriginalViewer()" title="关闭">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="original-image-container">
        <div class="image-loading-state" id="originalImageLoading">
          <div class="loading-spinner"></div>
          <span>正在加载原图...</span>
        </div>
        <img id="originalImage" 
             src="${originalPath}" 
             alt="${window.currentImageData.title}"
             onload="onOriginalImageLoad()"
             onerror="onOriginalImageError()"
             style="display: none;">
        <div class="image-zoom-controls">
          <button onclick="zoomOriginalImage(1.2)" title="放大"><i class="fas fa-search-plus"></i></button>
          <button onclick="zoomOriginalImage(0.8)" title="缩小"><i class="fas fa-search-minus"></i></button>
          <button onclick="resetOriginalZoom()" title="重置"><i class="fas fa-compress"></i></button>
          <button onclick="fitToScreen()" title="适应屏幕"><i class="fas fa-expand"></i></button>
        </div>
      </div>
      
      <div class="original-image-info">
        <div class="image-details">
          <span class="detail-item"><i class="fas fa-image"></i> 原始尺寸</span>
          <span class="detail-item" id="imageSize">加载中...</span>
        </div>
        ${window.currentImageData.description ? `<p class="image-description">${window.currentImageData.description}</p>` : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(originalViewer);
  document.body.style.overflow = 'hidden';
  
  // 添加渐入动画
  setTimeout(() => {
    originalViewer.classList.add('active');
  }, 10);
}

/**
 * 原图加载成功回调
 */
function onOriginalImageLoad() {
  const loading = document.getElementById('originalImageLoading');
  const image = document.getElementById('originalImage');
  const sizeElement = document.getElementById('imageSize');
  
  if (loading) loading.style.display = 'none';
  if (image) {
    image.style.display = 'block';
    // 显示图片尺寸
    if (sizeElement) {
      sizeElement.textContent = `${image.naturalWidth} × ${image.naturalHeight}`;
    }
  }
}

/**
 * 原图加载失败回调
 */
function onOriginalImageError() {
  const loading = document.getElementById('originalImageLoading');
  const image = document.getElementById('originalImage');
  
  if (loading) {
    loading.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="color: #ff6b6b; font-size: 24px;"></i>
      <span>原图加载失败</span>
      <small style="display: block; margin-top: 5px; opacity: 0.7;">正在尝试其他路径...</small>
    `;
  }
  
  // 尝试其他可能的路径
  if (window.currentImageData && image) {
    const originalPath = window.currentImageData.originalPath;
    const alternativePaths = [
      originalPath,
      originalPath.replace('.JPG', '.jpg'),
      originalPath.replace('.jpg', '.JPG'),
      originalPath.replace('/pictures/', '/assets/pictures/'),
      window.currentImageData.thumbnail // 降级到缩略图
    ];
    
    let currentIndex = 0;
    const currentSrc = image.src;
    
    // 找到当前尝试的路径索引
    for (let i = 0; i < alternativePaths.length; i++) {
      if (currentSrc.includes(alternativePaths[i])) {
        currentIndex = i;
        break;
      }
    }
    
    // 尝试下一个路径
    currentIndex++;
    if (currentIndex < alternativePaths.length) {
      const nextPath = getOriginalImagePath(alternativePaths[currentIndex]);
      console.log('Trying alternative path:', nextPath);
      image.src = nextPath;
    } else {
      // 所有路径都失败了
      if (loading) {
        loading.innerHTML = `
          <i class="fas fa-exclamation-triangle" style="color: #ff6b6b; font-size: 24px;"></i>
          <span>无法加载原图</span>
          <small style="display: block; margin-top: 5px; opacity: 0.7;">图片文件可能不存在或网络连接问题</small>
          <button onclick="retryOriginalLoad()" style="margin-top: 10px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">重试</button>
        `;
      }
    }
  }
}

/**
 * 重试原图加载
 */
function retryOriginalLoad() {
  if (!window.currentImageData) return;
  
  const loading = document.getElementById('originalImageLoading');
  const image = document.getElementById('originalImage');
  
  if (loading) {
    loading.innerHTML = `
      <div class="loading-spinner"></div>
      <span>重新加载中...</span>
    `;
    loading.style.display = 'flex';
  }
  
  if (image) {
    image.style.display = 'none';
    const originalPath = getOriginalImagePath(window.currentImageData.originalPath);
    image.src = originalPath + '?t=' + Date.now(); // 添加时间戳避免缓存
  }
}

/**
 * 关闭原图查看器
 */
function closeOriginalViewer() {
  const viewer = document.querySelector('.original-image-viewer');
  if (viewer) {
    viewer.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(viewer);
      document.body.style.overflow = '';
    }, 300);
  }
}

/**
 * 在新标签页打开
 */
function openInNewTab(url) {
  window.open(url, '_blank');
}

/**
 * 下载原图
 */
function downloadOriginalImage() {
  if (!window.currentImageData) return;
  
  const originalPath = getOriginalImagePath(window.currentImageData.originalPath);
  const link = document.createElement('a');
  link.href = originalPath;
  link.download = `${window.currentImageData.title}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showNotification('开始下载原图');
}

/**
 * 下载当前图片（从lightbox调用）
 */
function downloadImage() {
  if (!window.currentImageData) {
    showNotification('无法获取图片信息');
    return;
  }
  
  const originalPath = getOriginalImagePath(window.currentImageData.originalPath);
  downloadImageFromUrl(originalPath, window.currentImageData.title);
}

/**
 * 通用下载图片函数
 * @param {string} url - 图片URL
 * @param {string} filename - 文件名
 */
function downloadImageFromUrl(url, filename) {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename + '.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('开始下载图片');
  } catch (error) {
    console.error('Download failed:', error);
    // 备用方案：在新窗口打开
    window.open(url, '_blank');
    showNotification('已在新窗口打开图片，请右键保存');
  }
}

/**
 * 原图缩放功能
 */
let originalZoom = 1;

function zoomOriginalImage(factor) {
  const img = document.getElementById('originalImage');
  if (!img) return;
  
  originalZoom *= factor;
  originalZoom = Math.max(0.2, Math.min(originalZoom, 5)); // 限制缩放范围
  
  img.style.transform = `scale(${originalZoom})`;
  img.style.transition = 'transform 0.3s ease';
}

function resetOriginalZoom() {
  const img = document.getElementById('originalImage');
  if (!img) return;
  
  originalZoom = 1;
  img.style.transform = 'scale(1)';
  img.style.transition = 'transform 0.3s ease';
}

function fitToScreen() {
  const img = document.getElementById('originalImage');
  const container = document.querySelector('.original-image-container');
  if (!img || !container) return;
  
  const containerRect = container.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  
  const scaleX = (containerRect.width * 0.9) / img.naturalWidth;
  const scaleY = (containerRect.height * 0.9) / img.naturalHeight;
  originalZoom = Math.min(scaleX, scaleY);
  
  img.style.transform = `scale(${originalZoom})`;
  img.style.transition = 'transform 0.3s ease';
}

/**
 * 分享当前图片
 */
function shareCurrentImage() {
  if (!window.currentImageData) return;
  
  if (navigator.share) {
    navigator.share({
      title: window.currentImageData.title,
      text: window.currentImageData.description,
      url: window.currentImageData.originalPath
    }).catch(console.error);
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.currentImageData.originalPath).then(() => {
      showNotification('图片链接已复制到剪贴板');
    }).catch(() => {
      // 备用方案：显示链接
      prompt('图片链接（请手动复制）:', window.currentImageData.originalPath);
    });
  }
}

/**
 * 图片缩放功能
 */
let currentZoom = 1;

function zoomImage(factor) {
  const img = document.getElementById('lightbox-image');
  if (!img) return;
  
  currentZoom *= factor;
  currentZoom = Math.max(0.5, Math.min(currentZoom, 3)); // 限制缩放范围
  
  img.style.transform = `scale(${currentZoom})`;
  img.style.transition = 'transform 0.3s ease';
}

function resetZoom() {
  const img = document.getElementById('lightbox-image');
  if (!img) return;
  
  currentZoom = 1;
  img.style.transform = 'scale(1)';
  img.style.transition = 'transform 0.3s ease';
}

/**
 * 显示通知
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'gallery-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * 关闭灯箱
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  if (!lightbox) return;
  
  // 移除活动状态
  lightbox.classList.remove('active');
  
  // 延迟隐藏
  setTimeout(() => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
  
  // 清理数据
  window.currentImageData = null;
  resetZoom();
  
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleLightboxKeyboard);
}

/**
 * 处理灯箱键盘事件
 * @param {KeyboardEvent} e - 键盘事件
 */
function handleLightboxKeyboard(e) {
  switch(e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case '+':
    case '=':
      e.preventDefault();
      zoomImage(1.2);
      break;
    case '-':
      e.preventDefault();
      zoomImage(0.8);
      break;
    case '0':
      e.preventDefault();
      resetZoom();
      break;
    case 'o':
    case 'O':
      e.preventDefault();
      viewOriginalImage();
      break;
    case 'd':
    case 'D':
      e.preventDefault();
      downloadImage();
      break;
  }
}

/* ====================
   Image Loading
   ==================== */

/**
 * Initialize lazy loading for images
 */
function initializeImageLoading() {
  const images = document.querySelectorAll('.gallery-item img');
  
  images.forEach(img => {
    img.classList.add('loading');
    
    img.onload = function() {
      this.classList.remove('loading');
      this.classList.add('loaded');
    };
    
    img.onerror = function() {
      this.classList.remove('loading');
      this.classList.add('error');
      console.error('Failed to load image:', this.src);
    };
  });
}

/* ====================
   Statistics Update
   ==================== */

/**
 * Update gallery statistics based on current filter
 * @param {string} category - Current active category
 * @param {NodeList} galleryItems - All gallery items
 */
function updateGalleryStats(category, galleryItems) {
  const totalPhotosElement = document.getElementById('totalPhotos');
  
  if (totalPhotosElement) {
    let visibleCount = 0;
    
    if (category === 'all') {
      visibleCount = galleryItems.length;
    } else {
      galleryItems.forEach(item => {
        if (item.dataset.category === category) {
          visibleCount++;
        }
      });
    }
    
    totalPhotosElement.textContent = visibleCount;
  }
}

/* ====================
   页面统计功能
   ==================== */

/**
 * 更新当前时间
 */
function updatePageStats() {
  // 更新当前时间
  const timeElement = document.getElementById('currentTime');
  if (timeElement) {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    timeElement.textContent = `当前时间：${timeString}`;
  }

  // 更新访问信息
  const visitorElement = document.getElementById('visitorInfo');
  if (visitorElement) {
    const visits = localStorage.getItem('gallery-visits') || 0;
    const newVisits = parseInt(visits) + 1;
    localStorage.setItem('gallery-visits', newVisits);
    
    const lastVisit = localStorage.getItem('gallery-last-visit');
    const now = new Date();
    
    if (lastVisit) {
      const lastDate = new Date(lastVisit);
      const timeDiff = Math.floor((now - lastDate) / (1000 * 60)); // 分钟差
      let timeText = '';
      
      if (timeDiff < 1) {
        timeText = '刚刚';
      } else if (timeDiff < 60) {
        timeText = `${timeDiff}分钟前`;
      } else if (timeDiff < 1440) {
        timeText = `${Math.floor(timeDiff / 60)}小时前`;
      } else {
        timeText = `${Math.floor(timeDiff / 1440)}天前`;
      }
      
      visitorElement.innerHTML = `第${newVisits}次访问 | 上次访问：${timeText}`;
    } else {
      visitorElement.innerHTML = `欢迎首次访问！这是第${newVisits}次访问`;
    }
    
    localStorage.setItem('gallery-last-visit', now.toISOString());
  }
}

/**
 * 实时更新当前时间
 */
function updateCurrentTime() {
  setInterval(() => {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
      const now = new Date();
      const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      timeElement.textContent = `当前时间：${timeString}`;
    }
  }, 1000);
}

/* ====================
   Utility Functions
   ==================== */

/**
 * Get all unique categories from gallery items
 * @param {NodeList} galleryItems - All gallery items
 * @returns {Array} Array of unique categories
 */
function getUniqueCategories(galleryItems) {
  const categories = Array.from(galleryItems).map(item => item.dataset.category);
  return [...new Set(categories)];
}

/**
 * Debug function to log gallery information
 */
function debugGalleryInfo() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const categories = getUniqueCategories(galleryItems);
  
  console.log('Gallery Debug Info:');
  console.log('Total items:', galleryItems.length);
  console.log('Categories:', categories);
  console.log('Items per category:', categories.map(cat => ({
    category: cat,
    count: Array.from(galleryItems).filter(item => item.dataset.category === cat).length
  })));
}

/* ====================
   分享功能
   ==================== */

/**
 * 分享照片功能
 * @param {string} title - 照片标题
 * @param {string} imageUrl - 图片URL
 */
function sharePhoto(title, imageUrl) {
  if (navigator.share) {
    // 使用原生分享API
    navigator.share({
      title: title,
      text: `查看这张照片：${title}`,
      url: imageUrl
    }).catch(err => {
      console.log('分享失败:', err);
      fallbackShare(title, imageUrl);
    });
  } else {
    fallbackShare(title, imageUrl);
  }
}

/**
 * 备用分享方式
 * @param {string} title - 照片标题
 * @param {string} imageUrl - 图片URL
 */
function fallbackShare(title, imageUrl) {
  // 复制链接到剪贴板
  if (navigator.clipboard) {
    navigator.clipboard.writeText(imageUrl).then(() => {
      showToast('图片链接已复制到剪贴板！');
    }).catch(() => {
      showManualCopyDialog(imageUrl);
    });
  } else {
    showManualCopyDialog(imageUrl);
  }
}

/**
 * 显示手动复制对话框
 * @param {string} url - 要复制的URL
 */
function showManualCopyDialog(url) {
  const dialog = document.createElement('div');
  dialog.className = 'share-dialog';
  dialog.innerHTML = `
    <div class="share-dialog-content">
      <h3>分享链接</h3>
      <input type="text" value="${url}" readonly onclick="this.select()">
      <div class="dialog-buttons">
        <button onclick="this.closest('.share-dialog').remove()">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  
  // 自动选择文本
  const input = dialog.querySelector('input');
  input.focus();
  input.select();
  
  // 点击外部关闭
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.remove();
    }
  });
}

/**
 * 显示提示消息
 * @param {string} message - 提示消息
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * 智能图片错误处理
 * @param {HTMLImageElement} img - 图片元素
 * @param {string} relativeUrl - 相对URL
 * @param {string} absoluteUrl - 绝对URL
 */
function handleImageError(img, relativeUrl, absoluteUrl) {
  if (img.dataset.retryCount) {
    // 已经重试过，显示默认图片
    img.src = createPlaceholderImage(img.alt);
    img.parentElement.classList.add('image-error');
    return;
  }
  
  // 标记已重试
  img.dataset.retryCount = '1';
  
  // 尝试不同的路径
  const paths = [
    absoluteUrl,
    relativeUrl,
    relativeUrl.replace('/pictures/', './pictures/'),
    relativeUrl.replace('/pictures/', '/assets/pictures/'),
    window.location.origin + relativeUrl
  ];
  
  tryImagePaths(img, paths, 0);
}

/**
 * 尝试多个图片路径
 * @param {HTMLImageElement} img - 图片元素
 * @param {Array} paths - 路径数组
 * @param {number} index - 当前尝试的索引
 */
function tryImagePaths(img, paths, index) {
  if (index >= paths.length) {
    // 所有路径都失败，显示占位图
    img.src = createPlaceholderImage(img.alt);
    img.parentElement.classList.add('image-error');
    return;
  }
  
  const testImg = new Image();
  testImg.onload = function() {
    img.src = paths[index];
    img.parentElement.classList.add('image-success');
  };
  
  testImg.onerror = function() {
    tryImagePaths(img, paths, index + 1);
  };
  
  testImg.src = paths[index];
}

/**
 * 创建占位图片
 * @param {string} alt - 图片描述
 * @returns {string} Base64编码的SVG占位图
 */
function createPlaceholderImage(alt) {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect x="50" y="50" width="300" height="200" fill="none" stroke="#667eea" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="200" y="140" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="#667eea" text-anchor="middle">
        <tspan x="200" dy="0">🖼️ 图片加载失败</tspan>
        <tspan x="200" dy="20">${alt || '未知图片'}</tspan>
      </text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

/**
 * 获取原图路径
 * @param {string} thumbnailPath - 缩略图路径
 * @returns {string} 原图路径
 */
function getOriginalImagePath(thumbnailPath) {
  // 移除缩略图相关的后缀或路径修饰符
  let originalPath = thumbnailPath;
  
  // 如果是缩略图目录，替换为原图目录
  originalPath = originalPath.replace('/thumbs/', '/');
  originalPath = originalPath.replace('_thumb', '');
  originalPath = originalPath.replace('-thumb', '');
  originalPath = originalPath.replace('_small', '');
  originalPath = originalPath.replace('-small', '');
  
  // 尝试不同的原图路径
  const possiblePaths = [
    originalPath,
    originalPath.replace('/_picture/', '/pictures/'),
    originalPath.replace('/assets/', '/'),
    originalPath.replace('/gallery/', '/pictures/'),
    '/pictures/' + originalPath.split('/').pop()
  ];
  
  return possiblePaths[0]; // 返回第一个可能的路径
}

/**
 * 添加查看原图按钮
 * @param {string} originalPath - 原图路径
 * @param {string} fallbackPath - 回退路径
 */
function addViewOriginalButton(originalPath, fallbackPath) {
  const lightbox = document.getElementById('lightbox');
  let viewOriginalBtn = lightbox.querySelector('.view-original-btn');
  
  if (!viewOriginalBtn) {
    viewOriginalBtn = document.createElement('button');
    viewOriginalBtn.className = 'view-original-btn';
    viewOriginalBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> 查看原图';
    
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    if (lightboxContent) {
      lightboxContent.appendChild(viewOriginalBtn);
    }
  }
  
  viewOriginalBtn.onclick = function() {
    window.open(originalPath, '_blank');
  };
}

/* ====================
   数据属性处理函数
   ==================== */

/**
 * 从按钮的数据属性打开lightbox
 * @param {HTMLElement} button - 触发按钮
 */
function openLightboxFromButton(button) {
  const imageSrc = button.dataset.image;
  const title = button.dataset.title;
  const description = button.dataset.description;
  const originalPath = button.dataset.original;
  const location = button.dataset.location;
  const date = button.dataset.date;
  const camera = button.dataset.camera;
  const tags = button.dataset.tags;
  
  const metadata = {
    location: location,
    date: date,
    camera: camera,
    tags: tags ? tags.split(',') : []
  };
  
  const options = {
    originalPath: originalPath,
    thumbnail: imageSrc,
    metadata: metadata
  };
  
  console.log('Opening lightbox from button:', { imageSrc, title, description, options });
  openLightbox(imageSrc, title, description, options);
}

/**
 * 从按钮的数据属性分享照片
 * @param {HTMLElement} button - 触发按钮
 */
function sharePhotoFromButton(button) {
  const title = button.dataset.title;
  const imageUrl = button.dataset.image;
  sharePhoto(title, imageUrl);
}
