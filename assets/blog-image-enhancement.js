/**
 * Blog Image Enhancement Script
 * Automatically detects and displays article images
 */

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced image detection for blog posts
    const blogCards = document.querySelectorAll('.blog-post-card');
    
    blogCards.forEach(card => {
        const cardImage = card.querySelector('.card-image img');
        if (cardImage) {
            // Add loading effect
            cardImage.style.opacity = '0';
            cardImage.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.3s ease';
            });
            
            // Add error handling
            cardImage.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
                this.parentElement.classList.add('placeholder');
                this.style.display = 'none';
                
                // Add fallback content
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = `
                    <div class="category-icon">
                        <i class="fas fa-image"></i>
                    </div>
                    <span class="placeholder-text">图片加载失败</span>
                `;
                this.parentElement.appendChild(fallback);
            });
        }
    });
    
    // Add image zoom functionality
    const imageOverlays = document.querySelectorAll('.image-overlay');
    imageOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const img = this.parentElement.querySelector('img');
            const card = this.closest('.blog-post-card');
            const title = card.querySelector('.card-title a').textContent;
            
            if (img && img.src) {
                openImageModal(img.src, img.alt || title, title);
            }
        });
    });
    
    // Add image preview modal functionality
    window.openImageModal = function(imageSrc, imageAlt, articleTitle) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('imageModal');
        if (!modal) {
            modal = createImageModal();
        }
        
        const modalImage = modal.querySelector('#modalImage');
        const modalTitle = modal.querySelector('#modalTitle');
        
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modalTitle.textContent = articleTitle || '图片预览';
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add keyboard support
        document.addEventListener('keydown', handleModalKeydown);
        
        // Add loading state
        modalImage.style.opacity = '0';
        modalImage.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.3s ease';
        });
    };
    
    window.closeImageModal = function() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleModalKeydown);
    };
    
    function handleModalKeydown(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    }
    
    function createImageModal() {
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.style.display = 'none';
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeImageModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="modalTitle">图片预览</h3>
                    <button class="modal-close" onclick="closeImageModal()" aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="modalImage" src="" alt="" loading="lazy">
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeImageModal()">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }
    
    // Add image lazy loading with intersection observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loading');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all images
        const lazyImages = document.querySelectorAll('.card-image img[src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add image comparison functionality for before/after images
    function setupImageComparison() {
        const comparisonContainers = document.querySelectorAll('.image-comparison');
        
        comparisonContainers.forEach(container => {
            const slider = container.querySelector('.comparison-slider');
            const beforeImage = container.querySelector('.before-image');
            const afterImage = container.querySelector('.after-image');
            
            if (slider && beforeImage && afterImage) {
                slider.addEventListener('input', function() {
                    const value = this.value;
                    beforeImage.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
                });
            }
        });
    }
    
    setupImageComparison();
    
    // Add image gallery navigation for multiple images
    let currentImageIndex = 0;
    let currentImageSet = [];
    
    window.openImageGallery = function(images, startIndex = 0) {
        currentImageSet = images;
        currentImageIndex = startIndex;
        
        if (images.length > 0) {
            const image = images[currentImageIndex];
            openImageModal(image.src, image.alt, image.title);
            
            // Add navigation if multiple images
            if (images.length > 1) {
                addGalleryNavigation();
            }
        }
    };
    
    function addGalleryNavigation() {
        const modal = document.getElementById('imageModal');
        const modalBody = modal.querySelector('.modal-body');
        
        // Add previous/next buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.onclick = () => navigateGallery(-1);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => navigateGallery(1);
        
        modalBody.appendChild(prevBtn);
        modalBody.appendChild(nextBtn);
        
        // Add image counter
        const counter = document.createElement('div');
        counter.className = 'gallery-counter';
        counter.textContent = `${currentImageIndex + 1} / ${currentImageSet.length}`;
        modalBody.appendChild(counter);
    }
    
    function navigateGallery(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = currentImageSet.length - 1;
        } else if (currentImageIndex >= currentImageSet.length) {
            currentImageIndex = 0;
        }
        
        const image = currentImageSet[currentImageIndex];
        const modalImage = document.getElementById('modalImage');
        const counter = document.querySelector('.gallery-counter');
        
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${currentImageSet.length}`;
        }
    }
});
