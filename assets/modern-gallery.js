/**
 * 现代化画廊交互脚本
 * Modern Gallery Interactive Script
 */

class ModernGallery {
  constructor() {
    this.currentZoom = 1;
    this.maxZoom = 5;
    this.minZoom = 0.1;
    this.currentImageSrc = '';
    this.currentImageTitle = '';
    this.currentImageDescription = '';
    this.currentImageDate = '';
    this.currentImageLocation = '';
    this.currentImageCamera = '';
    this.currentImageTags = [];
    this.isLightboxOpen = false;
    this.isOriginalViewerOpen = false;
    this.visibleItems = 12;
    this.totalItems = 0;
    this.currentImageIndex = 0;
    this.allImages = [];
    this.currentTab = 'details';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupLazyLoading();
    this.setupFilterSystem();
    this.setupLoadMore();
    this.addScrollAnimations();
    this.initializeImageData();
    this.setupTabSystem();
  }

  /**
   * 初始化图片数据
   */
  initializeImageData() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    this.allImages = Array.from(galleryItems).map((item, index) => {
      const img = item.querySelector('.photo-image');
      const title = item.querySelector('.photo-title').textContent;
      const description = item.querySelector('.photo-description').textContent;
      const metaItems = item.querySelectorAll('.meta-item');
      
      let date = '', location = '', camera = '';
      metaItems.forEach(meta => {
        const text = meta.textContent.trim();
        if (text.includes('📅')) date = text.replace('📅', '').trim();
        if (text.includes('📍')) location = text.replace('📍', '').trim();
        if (text.includes('📷')) camera = text.replace('📷', '').trim();
      });

      const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent);

      return {
        index,
        src: img.src,
        title,
        description,
        date,
        location,
        camera,
        tags,
        element: item
      };
    });
  }

  /**
   * 设置标签页系统
   */
  setupTabSystem() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.tab-btn')) {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      }
    });
  }

  /**
   * 切换标签页
   */
  switchTab(tabName) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 更新面板显示
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-panel`).classList.add('active');

    this.currentTab = tabName;

    // 如果切换到EXIF或元数据标签，加载相应数据
    if (tabName === 'exif') {
      this.loadExifData();
    } else if (tabName === 'metadata') {
      this.loadMetadata();
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 过滤按钮点击
    document.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn') || e.target.closest('.filter-btn')) {
        const btn = e.target.closest('.filter-btn');
        const category = btn.dataset.category;
        this.filterGallery(category);
        this.updateActiveFilter(btn);
      }
    });

    // 标签点击过滤
    document.addEventListener('click', (e) => {
      if (e.target.matches('.tag') || e.target.closest('.tag')) {
        const tag = e.target.closest('.tag');
        const tagText = tag.textContent.trim();
        this.filterByTag(tagText);
        this.highlightActiveTag(tag);
      }
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
      if (this.isLightboxOpen) {
        switch(e.key) {
          case 'Escape':
            this.closeLightbox();
            break;
          case 'ArrowLeft':
            this.navigateImage(-1);
            break;
          case 'ArrowRight':
            this.navigateImage(1);
            break;
          case 'f':
          case 'F':
            this.toggleFullscreen();
            break;
        }
      }
      
      if (this.isOriginalViewerOpen && e.key === 'Escape') {
        this.closeOriginalViewer();
      }
    });
  }

  /**
   * 根据标签过滤图片
   */
  filterByTag(tagText) {
    console.log('Filtering by tag:', tagText);
    
    const items = document.querySelectorAll('.gallery-item');
    let visibleCount = 0;
    
    items.forEach(item => {
      const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.trim());
      
      if (tags.includes(tagText)) {
        item.style.display = 'block';
        item.style.animation = 'fadeInUp 0.5s ease';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // 更新结果计数
    this.updateResultCount(visibleCount, `标签: ${tagText}`);
    
    // 重置所有过滤按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 创建或更新标签过滤指示器
    this.showTagFilterIndicator(tagText);
  }

  /**
   * 显示标签过滤指示器
   */
  showTagFilterIndicator(tagText) {
    // 移除之前的指示器
    const existingIndicator = document.querySelector('.tag-filter-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    // 创建新的指示器
    const indicator = document.createElement('div');
    indicator.className = 'tag-filter-indicator';
    indicator.innerHTML = `
      <span class="indicator-text">
        <i class="fas fa-tag"></i>
        正在显示标签: <strong>${tagText}</strong>
      </span>
      <button class="clear-filter-btn" onclick="window.modernGallery.clearAllFilters()">
        <i class="fas fa-times"></i>
        清除过滤
      </button>
    `;
    
    // 插入到过滤器区域
    const filterSection = document.querySelector('.filter-section .container');
    filterSection.appendChild(indicator);
  }

  /**
   * 清除所有过滤器
   */
  clearAllFilters() {
    // 显示所有图片
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.style.display = 'block';
      item.style.animation = 'fadeInUp 0.5s ease';
    });
    
    // 重置过滤按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
    
    // 移除标签过滤指示器
    const indicator = document.querySelector('.tag-filter-indicator');
    if (indicator) {
      indicator.remove();
    }
    
    // 移除标签高亮
    document.querySelectorAll('.tag.active').forEach(tag => {
      tag.classList.remove('active');
    });
    
    // 更新结果计数
    this.updateResultCount(items.length, '全部');
  }

  /**
   * 高亮活动标签
   */
  highlightActiveTag(activeTag) {
    // 移除之前的高亮
    document.querySelectorAll('.tag.active').forEach(tag => {
      tag.classList.remove('active');
    });
    
    // 高亮所有相同的标签
    const tagText = activeTag.textContent.trim();
    document.querySelectorAll('.tag').forEach(tag => {
      if (tag.textContent.trim() === tagText) {
        tag.classList.add('active');
      }
    });
  }

  /**
   * 更新结果计数
   */
  updateResultCount(count, filterType) {
    let resultInfo = document.querySelector('.result-info');
    if (!resultInfo) {
      resultInfo = document.createElement('div');
      resultInfo.className = 'result-info';
      const filterSection = document.querySelector('.filter-section .container');
      filterSection.appendChild(resultInfo);
    }
    
    resultInfo.innerHTML = `
      <i class="fas fa-images"></i>
      显示 <strong>${count}</strong> 张图片 (${filterType})
    `;
  }

  /**
   * 设置图片懒加载
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('.photo-image').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * 设置过滤系统
   */
  setupFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 更新活动按钮
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // 过滤图片
        const category = button.dataset.category;
        this.filterItems(category, galleryItems);
      });
    });
  }

  /**
   * 过滤图片项目
   */
  filterItems(category, items) {
    items.forEach((item, index) => {
      const shouldShow = category === 'all' || item.dataset.category === category;
      
      if (shouldShow) {
        item.style.display = 'block';
        // 添加动画延迟
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // 更新可见项目计数
    this.updateVisibleCount();
  }

  /**
   * 设置加载更多功能
   */
  setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    this.totalItems = galleryItems.length;

    // 初始隐藏超出的项目
    this.showItems(this.visibleItems);

    if (loadMoreBtn && this.totalItems > this.visibleItems) {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreItems();
      });
    }
  }

  /**
   * 显示指定数量的项目
   */
  showItems(count) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      if (index < count) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  /**
   * 加载更多项目
   */
  loadMoreItems() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    this.visibleItems += 8;

    this.showItems(this.visibleItems);

    if (this.visibleItems >= this.totalItems) {
      loadMoreBtn.style.display = 'none';
    }

    // 滚动动画
    this.addScrollAnimations();
  }

  /**
   * 添加滚动动画
   */
  addScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      document.querySelectorAll('.gallery-item').forEach(item => {
        animationObserver.observe(item);
      });
    }
  }

  /**
   * 打开高级灯箱
   */
  openAdvancedLightbox(imageSrc, title, description, date, location, camera, tags) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const imageLoader = document.getElementById('imageLoader');

    // 设置当前图片信息
    this.currentImageSrc = imageSrc;
    this.currentImageTitle = title;
    this.currentImageDescription = description;
    this.currentImageDate = date;
    this.currentImageLocation = location;
    this.currentImageCamera = camera;
    this.currentImageTags = typeof tags === 'string' ? tags.split(',') : (tags || []);
    this.isLightboxOpen = true;

    // 找到当前图片索引
    this.currentImageIndex = this.allImages.findIndex(img => img.src === imageSrc);

    // 显示加载器
    imageLoader.style.display = 'flex';
    lightboxImage.style.opacity = '0';

    // 设置头部信息
    document.getElementById('lightboxTitleHeader').textContent = title;
    document.getElementById('lightboxDateHeader').textContent = date ? new Date(date).toLocaleDateString('zh-CN') : '';
    document.getElementById('lightboxLocationHeader').textContent = location || '';

    // 设置详细信息
    this.updateLightboxInfo();

    // 显示灯箱
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 加载图片
    this.loadLightboxImage(imageSrc, title);

    // 重置缩放
    this.resetZoom();

    // 更新导航按钮状态
    this.updateNavigationButtons();
  }

  /**
   * 加载灯箱图片
   */
  loadLightboxImage(imageSrc, title) {
    const lightboxImage = document.getElementById('lightboxImage');
    const imageLoader = document.getElementById('imageLoader');

    const img = new Image();
    img.onload = () => {
      lightboxImage.src = imageSrc;
      lightboxImage.alt = title;
      
      // 隐藏加载器，显示图片
      setTimeout(() => {
        imageLoader.style.display = 'none';
        lightboxImage.style.opacity = '1';
      }, 300);

      // 更新图片尺寸信息
      this.updateImageDimensions(img.naturalWidth, img.naturalHeight);
    };

    img.onerror = () => {
      imageLoader.innerHTML = '<div class="error-message">图片加载失败</div>';
    };

    img.src = imageSrc;
  }

  /**
   * 更新灯箱信息
   */
  updateLightboxInfo() {
    document.getElementById('lightboxTitle').textContent = this.currentImageTitle;
    document.getElementById('lightboxDescription').textContent = this.currentImageDescription;
    document.getElementById('lightboxDate').textContent = this.formatDate(this.currentImageDate);
    document.getElementById('lightboxLocation').textContent = this.currentImageLocation || '未知';
    document.getElementById('lightboxCamera').textContent = this.currentImageCamera || '未知';

    // 更新标签
    const tagsContainer = document.getElementById('lightboxTags');
    tagsContainer.innerHTML = '';
    this.currentImageTags.forEach(tag => {
      if (tag.trim()) {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag.trim();
        tagsContainer.appendChild(tagElement);
      }
    });

    // 更新URL
    document.getElementById('imageUrl').value = window.location.origin + this.currentImageSrc;
  }

  /**
   * 格式化日期
   */
  formatDate(dateString) {
    if (!dateString) return '未知';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * 图片导航
   */
  navigateImage(direction) {
    if (!this.isLightboxOpen || this.allImages.length === 0) return;

    this.currentImageIndex += direction;
    
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.allImages.length - 1;
    } else if (this.currentImageIndex >= this.allImages.length) {
      this.currentImageIndex = 0;
    }

    const imageData = this.allImages[this.currentImageIndex];
    this.openAdvancedLightbox(
      imageData.src,
      imageData.title,
      imageData.description,
      imageData.date,
      imageData.location,
      imageData.camera,
      imageData.tags
    );
  }

  /**
   * 更新导航按钮状态
   */
  updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
      prevBtn.disabled = this.allImages.length <= 1;
      nextBtn.disabled = this.allImages.length <= 1;
    }
  }

  /**
   * 查看原图
   */
  viewOriginalImage(imageSrc, title) {
    const originalViewer = document.getElementById('originalViewer');
    const originalImage = document.getElementById('originalImage');
    const originalLoader = document.getElementById('originalLoader');
    const originalResolution = document.getElementById('originalResolution');

    this.isOriginalViewerOpen = true;

    // 显示原图查看器
    originalViewer.classList.add('active');
    originalLoader.style.display = 'flex';
    originalImage.style.opacity = '0';

    // 重置进度条
    document.getElementById('loadingProgress').style.width = '0%';

    // 模拟加载进度
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      document.getElementById('loadingProgress').style.width = progress + '%';
    }, 200);

    // 加载原图
    const img = new Image();
    img.onload = () => {
      clearInterval(progressInterval);
      document.getElementById('loadingProgress').style.width = '100%';
      
      originalImage.src = imageSrc;
      originalImage.alt = title;
      originalResolution.textContent = `${img.naturalWidth} × ${img.naturalHeight} 像素`;
      
      setTimeout(() => {
        originalLoader.style.display = 'none';
        originalImage.style.opacity = '1';
      }, 500);

      // 添加原图缩放和拖拽功能
      this.setupOriginalImageInteraction(originalImage);
    };

    img.onerror = () => {
      clearInterval(progressInterval);
      originalLoader.innerHTML = '<div class="error-message">原图加载失败</div>';
    };

    img.src = imageSrc;
  }

  /**
   * 从灯箱查看原图
   */
  viewOriginalFromLightbox() {
    this.viewOriginalImage(this.currentImageSrc, this.currentImageTitle);
  }

  /**
   * 关闭原图查看器
   */
  closeOriginalViewer() {
    const originalViewer = document.getElementById('originalViewer');
    originalViewer.classList.remove('active');
    this.isOriginalViewerOpen = false;
  }

  /**
   * 设置原图交互功能
   */
  setupOriginalImageInteraction(imageElement) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    // 鼠标滚轮缩放
    imageElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale *= delta;
      scale = Math.max(0.1, Math.min(10, scale));
      this.updateOriginalImageTransform(imageElement, scale, translateX, translateY);
    });

    // 鼠标拖拽
    imageElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      imageElement.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      this.updateOriginalImageTransform(imageElement, scale, translateX, translateY);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      imageElement.style.cursor = 'grab';
    });

    // 双击重置
    imageElement.addEventListener('dblclick', () => {
      scale = 1;
      translateX = 0;
      translateY = 0;
      this.updateOriginalImageTransform(imageElement, scale, translateX, translateY);
    });
  }

  /**
   * 更新原图变换
   */
  updateOriginalImageTransform(element, scale, translateX, translateY) {
    element.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }

  /**
   * 切换全屏
   */
  toggleFullscreen() {
    const lightboxContainer = document.querySelector('.lightbox-container');
    
    if (!document.fullscreenElement) {
      lightboxContainer.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err.message);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * 加载EXIF数据
   */
  loadExifData() {
    const exifContainer = document.getElementById('exifData');
    exifContainer.innerHTML = '<div class="exif-loading"><div class="loader-spinner small"></div><span>读取EXIF信息中...</span></div>';

    // 模拟EXIF数据加载
    setTimeout(() => {
      const mockExifData = {
        '相机制造商': this.currentImageCamera || 'Unknown',
        '拍摄时间': this.currentImageDate || 'Unknown',
        '曝光时间': '1/60s',
        '光圈值': 'f/2.8',
        'ISO感光度': '400',
        '焦距': '24mm',
        '闪光灯': '未使用',
        '白平衡': '自动',
        '色彩空间': 'sRGB'
      };

      let exifHtml = '<div class="exif-data">';
      for (const [key, value] of Object.entries(mockExifData)) {
        exifHtml += `
          <div class="exif-item">
            <span class="exif-key">${key}</span>
            <span class="exif-value">${value}</span>
          </div>
        `;
      }
      exifHtml += '</div>';

      exifContainer.innerHTML = exifHtml;
    }, 1000);
  }

  /**
   * 加载元数据
   */
  loadMetadata() {
    // 获取图片文件大小
    this.getImageFileSize(this.currentImageSrc);
  }

  /**
   * 获取图片文件大小
   */
  async getImageFileSize(imageSrc) {
    try {
      const response = await fetch(imageSrc, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength);
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        document.getElementById('fileSize').textContent = `${sizeInMB} MB`;
      } else {
        document.getElementById('fileSize').textContent = '无法获取';
      }
    } catch (error) {
      document.getElementById('fileSize').textContent = '无法获取';
    }
  }

  /**
   * 更新图片尺寸信息
   */
  updateImageDimensions(width, height) {
    document.getElementById('imageDimensions').textContent = `${width} × ${height} 像素`;
  }

  /**
   * 显示/隐藏EXIF信息
   */
  toggleExifInfo() {
    if (this.currentTab !== 'exif') {
      this.switchTab('exif');
    }
  }

  /**
   * 关闭灯箱
   */
  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    this.isLightboxOpen = false;
    this.resetZoom();
  }

  /**
   * 缩放图片
   */
  zoomImage(factor) {
    this.currentZoom *= factor;
    this.currentZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.currentZoom));
    
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.style.transform = `scale(${this.currentZoom})`;
    
    // 更新缩放指示器
    document.getElementById('zoomLevel').textContent = Math.round(this.currentZoom * 100) + '%';
    
    // 添加可拖拽功能（如果放大）
    if (this.currentZoom > 1) {
      lightboxImage.style.cursor = 'grab';
      this.enableImageDragging(lightboxImage);
    } else {
      lightboxImage.style.cursor = 'default';
      this.disableImageDragging(lightboxImage);
    }
  }

  /**
   * 重置缩放
   */
  resetZoom() {
    this.currentZoom = 1;
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.style.transform = 'scale(1)';
    lightboxImage.style.cursor = 'default';
    
    // 更新缩放指示器
    if (document.getElementById('zoomLevel')) {
      document.getElementById('zoomLevel').textContent = '100%';
    }
    
    this.disableImageDragging(lightboxImage);
  }

  /**
   * 启用图片拖拽
   */
  enableImageDragging(element) {
    let isDragging = false;
    let startX, startY, initialX = 0, initialY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      element.style.cursor = 'grabbing';
      startX = e.clientX - initialX;
      startY = e.clientY - initialY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      initialX = e.clientX - startX;
      initialY = e.clientY - startY;
      element.style.transform = `scale(${this.currentZoom}) translate(${initialX}px, ${initialY}px)`;
    };

    const handleMouseUp = () => {
      isDragging = false;
      element.style.cursor = 'grab';
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 存储事件处理器以便后续移除
    element._dragHandlers = { handleMouseDown, handleMouseMove, handleMouseUp };
  }

  /**
   * 禁用图片拖拽
   */
  disableImageDragging(element) {
    if (element._dragHandlers) {
      element.removeEventListener('mousedown', element._dragHandlers.handleMouseDown);
      document.removeEventListener('mousemove', element._dragHandlers.handleMouseMove);
      document.removeEventListener('mouseup', element._dragHandlers.handleMouseUp);
      delete element._dragHandlers;
    }
  }

  /**
   * 下载图片
   */
  downloadImage() {
    if (!this.currentImageSrc) return;

    const link = document.createElement('a');
    link.href = this.currentImageSrc;
    link.download = this.currentImageTitle || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 分享当前图片
   */
  shareCurrentImage() {
    this.sharePhoto(this.currentImageTitle, window.location.origin + this.currentImageSrc);
  }

  /**
   * 分享照片
   */
  sharePhoto(title, imageUrl) {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `查看这张精彩的照片：${title}`,
        url: imageUrl
      }).catch(console.error);
    } else {
      // 降级方案：复制到剪贴板
      const textToCopy = `${title} - ${imageUrl}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showNotification('链接已复制到剪贴板！');
        });
      } else {
        // 进一步降级：创建文本框并选择
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showNotification('链接已复制到剪贴板！');
      }
    }
  }

  /**
   * 显示通知
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 100);

    // 自动移除
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  /**
   * 处理滚动事件
   */
  handleScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-shape');
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.5 + (index * 0.2);
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  /**
   * 更新可见项目计数
   */
  updateVisibleCount() {
    const visibleItems = document.querySelectorAll('.gallery-item[style*="block"], .gallery-item:not([style*="none"])');
    console.log(`显示 ${visibleItems.length} 张照片`);
  }

  /**
   * 过滤画廊
   */
  filterGallery(category) {
    console.log('Filtering gallery by category:', category);
    
    const items = document.querySelectorAll('.gallery-item');
    let visibleCount = 0;
    
    items.forEach(item => {
      const itemCategory = item.dataset.category;
      
      if (category === 'all' || itemCategory === category) {
        item.style.display = 'block';
        item.style.animation = 'fadeInUp 0.5s ease';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // 更新结果计数
    const categoryName = category === 'all' ? '全部' : category;
    this.updateResultCount(visibleCount, categoryName);
    
    // 移除标签过滤指示器
    const indicator = document.querySelector('.tag-filter-indicator');
    if (indicator) {
      indicator.remove();
    }
    
    // 移除标签高亮
    document.querySelectorAll('.tag.active').forEach(tag => {
      tag.classList.remove('active');
    });
  }

  /**
   * 更新活动过滤器
   */
  updateActiveFilter(activeBtn) {
    // 移除之前的活动状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 添加当前活动状态
    activeBtn.classList.add('active');
  }
}

// 全局函数（保持向后兼容）
function openLightbox(imageSrc, title, description) {
  if (window.modernGallery) {
    window.modernGallery.openAdvancedLightbox(imageSrc, title, description, '', '', '', []);
  }
}

function openAdvancedLightbox(imageSrc, title, description, date, location, camera, tags) {
  if (window.modernGallery) {
    window.modernGallery.openAdvancedLightbox(imageSrc, title, description, date, location, camera, tags);
  }
}

function viewOriginalImage(imageSrc, title) {
  if (window.modernGallery) {
    window.modernGallery.viewOriginalImage(imageSrc, title);
  }
}

function viewOriginalFromLightbox() {
  if (window.modernGallery) {
    window.modernGallery.viewOriginalFromLightbox();
  }
}

function closeOriginalViewer() {
  if (window.modernGallery) {
    window.modernGallery.closeOriginalViewer();
  }
}

function navigateImage(direction) {
  if (window.modernGallery) {
    window.modernGallery.navigateImage(direction);
  }
}

function toggleFullscreen() {
  if (window.modernGallery) {
    window.modernGallery.toggleFullscreen();
  }
}

function toggleExifInfo() {
  if (window.modernGallery) {
    window.modernGallery.toggleExifInfo();
  }
}

function downloadOriginalImage() {
  if (window.modernGallery) {
    const link = document.createElement('a');
    link.href = window.modernGallery.currentImageSrc;
    link.download = `${window.modernGallery.currentImageTitle}_original` || 'original_image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function closeLightbox() {
  if (window.modernGallery) {
    window.modernGallery.closeLightbox();
  }
}

function zoomImage(factor) {
  if (window.modernGallery) {
    window.modernGallery.zoomImage(factor);
  }
}

function resetZoom() {
  if (window.modernGallery) {
    window.modernGallery.resetZoom();
  }
}

function downloadImage() {
  if (window.modernGallery) {
    window.modernGallery.downloadImage();
  }
}

function shareCurrentImage() {
  if (window.modernGallery) {
    window.modernGallery.shareCurrentImage();
  }
}

function sharePhoto(title, imageUrl) {
  if (window.modernGallery) {
    window.modernGallery.sharePhoto(title, imageUrl);
  }
}

function clearAllFilters() {
  if (window.modernGallery) {
    window.modernGallery.clearAllFilters();
  }
}

function filterByTag(tagText) {
  if (window.modernGallery) {
    window.modernGallery.filterByTag(tagText);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  window.modernGallery = new ModernGallery();
  
  // 添加页面加载完成的淡入效果
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// 页面可见性API - 暂停/恢复动画
document.addEventListener('visibilitychange', () => {
  const animations = document.querySelectorAll('[style*="animation"]');
  if (document.hidden) {
    animations.forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    animations.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

// 性能监控
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
    }
  });
  
  observer.observe({entryTypes: ['largest-contentful-paint']});
}
