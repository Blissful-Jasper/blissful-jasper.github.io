// About Page Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all content cards
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach(card => {
        observer.observe(card);
    });

    // Observe interest items
    const interestItems = document.querySelectorAll('.interest-item');
    interestItems.forEach(item => {
        observer.observe(item);
    });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Hero stats counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        updateCounter();
    }

    // Start counter animation when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach((stat, index) => {
                        const targets = [3, 5, 10]; // Corresponding to the stat values
                        setTimeout(() => {
                            animateCounter(stat, targets[index]);
                        }, index * 300);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(heroStats);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const heroAvatar = document.querySelector('.hero-avatar');
        const profileRing = document.querySelector('.profile-ring');
        
        if (heroSection && scrolled < window.innerHeight) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
            
            if (heroAvatar) {
                heroAvatar.style.transform = `translate3d(0, ${rate * 0.3}px, 0)`;
            }
            
            if (profileRing) {
                profileRing.style.transform = `translate3d(0, ${rate * 0.2}px, 0) rotate(${scrolled * 0.1}deg)`;
            }
        }
    });

    // Skill tags hover effect
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact item click to copy
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const emailItem = item.querySelector('.contact-info p');
        const phoneItem = item.querySelector('.contact-info p');
        
        if (emailItem && emailItem.textContent.includes('@')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                navigator.clipboard.writeText(emailItem.textContent).then(() => {
                    showToast('邮箱地址已复制到剪贴板');
                });
            });
        }
        
        if (phoneItem && phoneItem.textContent.includes('+86')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                navigator.clipboard.writeText(phoneItem.textContent).then(() => {
                    showToast('电话号码已复制到剪贴板');
                });
            });
        }
    });

    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(79, 70, 229, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutContentSection = document.querySelector('.about-content-section');
            if (aboutContentSection) {
                aboutContentSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Profile image hover effect
    const heroAvatar = document.querySelector('.hero-avatar');
    if (heroAvatar) {
        heroAvatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1)';
        });
        
        heroAvatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    }

    // Add CSS for animation classes
    const style = document.createElement('style');
    style.textContent = `
        .content-card,
        .interest-item,
        .timeline-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .content-card.animate-in,
        .interest-item.animate-in,
        .timeline-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .interest-item.animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        .timeline-item.animate-in {
            animation: slideInLeft 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Social links tracking (optional analytics)
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.title || this.querySelector('span').textContent;
            console.log(`Social link clicked: ${platform}`);
            // Add analytics tracking here if needed
        });
    });

    // Print friendly adjustments
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('print-mode');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('print-mode');
    });
});

// Utility function for responsive font sizing
function adjustFontSizes() {
    const viewportWidth = window.innerWidth;
    const heroName = document.querySelector('.name-en');
    
    if (heroName) {
        if (viewportWidth < 576) {
            heroName.style.fontSize = '2rem';
        } else if (viewportWidth < 768) {
            heroName.style.fontSize = '2.5rem';
        } else if (viewportWidth < 1024) {
            heroName.style.fontSize = '3rem';
        } else {
            heroName.style.fontSize = '3.5rem';
        }
    }
}

// Adjust font sizes on load and resize
window.addEventListener('load', adjustFontSizes);
window.addEventListener('resize', adjustFontSizes);
