/**
 * Modern Interactions JavaScript
 * Handles theme toggling, skill animations, and other interactive features
 */

(function() {
    'use strict';
    
    // Theme Management
    const ThemeManager = {
        init() {
            this.themeToggle = document.getElementById('themeToggle');
            this.themeIcon = document.getElementById('themeIcon');
            this.currentTheme = localStorage.getItem('theme') || 'light';
            
            this.setTheme(this.currentTheme);
            this.bindEvents();
        },
        
        bindEvents() {
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
            }
        },
        
        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.currentTheme = theme;
            
            if (this.themeIcon) {
                this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        },
        
        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        }
    };
    
    // Mobile Menu Management
    const MobileMenu = {
        init() {
            this.menuToggle = document.getElementById('mobileMenuToggle');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.isOpen = false;
            
            this.bindEvents();
        },
        
        bindEvents() {
            if (this.menuToggle) {
                this.menuToggle.addEventListener('click', () => {
                    this.toggleMenu();
                });
            }
            
            if (this.mobileMenu) {
                this.mobileMenu.addEventListener('click', (e) => {
                    if (e.target === this.mobileMenu) {
                        this.closeMenu();
                    }
                });
            }
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeMenu();
                }
            });
        },
        
        toggleMenu() {
            this.isOpen ? this.closeMenu() : this.openMenu();
        },
        
        openMenu() {
            if (this.mobileMenu) {
                this.mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.isOpen = true;
            }
        },
        
        closeMenu() {
            if (this.mobileMenu) {
                this.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                this.isOpen = false;
            }
        }
    };
    
    // Skills Animation
    const SkillsAnimation = {
        init() {
            this.skillBars = document.querySelectorAll('.skill-bar');
            this.isAnimated = false;
            
            if (this.skillBars.length > 0) {
                this.bindEvents();
            }
        },
        
        bindEvents() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isAnimated) {
                        this.animateSkills();
                        this.isAnimated = true;
                    }
                });
            }, { threshold: 0.3 });
            
            const skillsSection = document.querySelector('.skills-section');
            if (skillsSection) {
                observer.observe(skillsSection);
            }
        },
        
        animateSkills() {
            this.skillBars.forEach((bar, index) => {
                const level = bar.getAttribute('data-level') || 0;
                
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, index * 200);
            });
        }
    };
    
    // Smooth Scrolling for Anchor Links
    const SmoothScroll = {
        init() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', this.handleClick.bind(this));
            });
        },
        
        handleClick(e) {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.modern-header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    // Search Functionality (for blog and other sections)
    const SearchManager = {
        init() {
            this.searchInputs = document.querySelectorAll('.search-input');
            this.bindEvents();
        },
        
        bindEvents() {
            this.searchInputs.forEach(input => {
                input.addEventListener('input', this.handleSearch.bind(this));
            });
        },
        
        handleSearch(e) {
            const query = e.target.value.toLowerCase();
            const targetContainer = e.target.closest('.search-container');
            
            if (!targetContainer) return;
            
            const items = targetContainer.querySelectorAll('.searchable-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const isVisible = text.includes(query);
                
                item.style.display = isVisible ? '' : 'none';
                
                // Add fade animation
                if (isVisible) {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                }
            });
            
            // Update results count if exists
            const visibleItems = targetContainer.querySelectorAll('.searchable-item:not([style*="display: none"])');
            const countElement = targetContainer.querySelector('.results-count');
            if (countElement) {
                countElement.textContent = `${visibleItems.length} results`;
            }
        }
    };
    
    // Card Hover Effects
    const CardEffects = {
        init() {
            this.cards = document.querySelectorAll('.card, .post-card, .skill-item, .link-card, .map-card');
            this.bindEvents();
        },
        
        bindEvents() {
            this.cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
                card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            });
        },
        
        handleMouseEnter(e) {
            const card = e.currentTarget;
            card.style.transition = 'all 0.3s ease';
        },
        
        handleMouseLeave(e) {
            const card = e.currentTarget;
            // Reset any custom styles if needed
        }
    };
    
    // Lazy Loading for Images
    const LazyLoading = {
        init() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                images.forEach(img => {
                    img.src = img.dataset.src;
                });
            }
        }
    };
    
    // Reading Progress Bar (for blog posts)
    const ReadingProgress = {
        init() {
            if (document.querySelector('.blog-post-content')) {
                this.createProgressBar();
                this.bindEvents();
            }
        },
        
        createProgressBar() {
            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
            document.body.appendChild(progressBar);
            
            this.progressBar = progressBar.querySelector('.reading-progress-bar');
        },
        
        bindEvents() {
            window.addEventListener('scroll', this.updateProgress.bind(this));
        },
        
        updateProgress() {
            const content = document.querySelector('.blog-post-content');
            if (!content) return;
            
            const contentHeight = content.offsetHeight;
            const contentTop = content.offsetTop;
            const scrolled = window.scrollY - contentTop;
            const progress = Math.min(Math.max(scrolled / contentHeight, 0), 1);
            
            if (this.progressBar) {
                this.progressBar.style.width = (progress * 100) + '%';
            }
        }
    };
    
    // Form Validation and Enhancement
    const FormManager = {
        init() {
            this.forms = document.querySelectorAll('form');
            this.bindEvents();
        },
        
        bindEvents() {
            this.forms.forEach(form => {
                form.addEventListener('submit', this.handleSubmit.bind(this));
                
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.addEventListener('blur', this.validateField.bind(this));
                    input.addEventListener('focus', this.clearErrors.bind(this));
                });
            });
        },
        
        handleSubmit(e) {
            e.preventDefault();
            const form = e.target;
            
            if (this.validateForm(form)) {
                this.showSuccess(form);
                // Here you would typically send the form data
            }
        },
        
        validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!this.validateField({ target: input })) {
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            let isValid = true;
            
            // Clear previous errors
            this.clearFieldError(field);
            
            // Required field validation
            if (field.hasAttribute('required') && !value) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            return isValid;
        },
        
        showFieldError(field, message) {
            field.classList.add('error');
            
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        },
        
        clearFieldError(field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        },
        
        clearErrors(e) {
            this.clearFieldError(e.target);
        },
        
        showSuccess(form) {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Message sent successfully!';
            
            form.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
                form.reset();
            }, 3000);
        }
    };
    
    // Initialize all modules when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        ThemeManager.init();
        MobileMenu.init();
        SkillsAnimation.init();
        SmoothScroll.init();
        SearchManager.init();
        CardEffects.init();
        LazyLoading.init();
        ReadingProgress.init();
        FormManager.init();
        
        // Add loading class removal
        document.body.classList.add('loaded');
        
        // Initialize tooltips if any
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                this._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden
            document.title = '(Away) ' + document.title.replace('(Away) ', '');
        } else {
            // Page is visible
            document.title = document.title.replace('(Away) ', '');
        }
    });
    
})();
