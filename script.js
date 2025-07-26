// ========================================
// EVIA AESTHETICS - REFINED & PERFECTED JAVASCRIPT
// ========================================

'use strict';

// ========================================
// GLOBAL APPLICATION OBJECT
// ========================================

const EviaAesthetics = {
    // Application state
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    
    // Component instances
    components: {},
    
    // Settings
    settings: {
        preloaderMinTime: 2000,
        scrollThreshold: 50,
        animationDuration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    // Utility functions
    utils: {
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle function for scroll events
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        },
        
        // Smooth scroll to element
        smoothScrollTo: (target, offset = 0) => {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (!element) return;
            
            const targetPosition = element.offsetTop - offset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = Math.min(Math.abs(distance) / 2, 800);
            let start = null;
            
            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                const easeProgress = EviaAesthetics.utils.easeInOutCubic(progress);
                window.scrollTo(0, startPosition + (distance * easeProgress));
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            };
            
            requestAnimationFrame(animation);
        },
        
        // Easing function
        easeInOutCubic: (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        },
        
        // Check if element is in viewport
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        // Add magnetic effect to buttons
        addMagneticEffect: (element, strength = 0.3) => {
            if (!element) return;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        }
    }
};

// ========================================
// PRELOADER CLASS
// ========================================

class LuxuryPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressBar = document.getElementById('loadingProgress');
        this.percentageEl = document.querySelector('.loading-percentage');
        this.startTime = Date.now();
        this.isComplete = false;
        this.progress = 0;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        // Prevent scrolling during preloader
        document.body.classList.add('no-scroll');
        
        // Start progress animation
        this.animateProgress();
        
        // Check if assets are loaded
        this.checkAssetsLoaded();
        
        // Minimum loading time
        setTimeout(() => {
            this.checkComplete();
        }, EviaAesthetics.settings.preloaderMinTime);
        
        // Maximum loading time (fallback)
        setTimeout(() => {
            if (!this.isComplete) {
                this.complete();
            }
        }, 5000);
    }
    
    animateProgress() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            this.progress = Math.min(this.progress, 95);
            
            if (this.progressBar) {
                this.progressBar.style.width = `${this.progress}%`;
            }
            
            if (this.percentageEl) {
                this.percentageEl.textContent = `${Math.floor(this.progress)}%`;
            }
            
            if (this.progress >= 95 || this.isComplete) {
                clearInterval(interval);
                if (this.isComplete) {
                    if (this.progressBar) this.progressBar.style.width = '100%';
                    if (this.percentageEl) this.percentageEl.textContent = '100%';
                }
            }
        }, 150);
    }
    
    checkAssetsLoaded() {
        const images = Array.from(document.images);
        const videos = Array.from(document.querySelectorAll('video'));
        
        let assetsLoaded = 0;
        const totalAssets = images.length + videos.length;
        
        const checkComplete = () => {
            assetsLoaded++;
            if (assetsLoaded >= totalAssets || document.readyState === 'complete') {
                this.assetsReady = true;
                this.checkComplete();
            }
        };
        
        // Check images
        images.forEach(img => {
            if (img.complete) {
                checkComplete();
            } else {
                img.addEventListener('load', checkComplete);
                img.addEventListener('error', checkComplete);
            }
        });
        
        // Check videos
        videos.forEach(video => {
            if (video.readyState >= 3) {
                checkComplete();
            } else {
                video.addEventListener('loadeddata', checkComplete);
                video.addEventListener('error', checkComplete);
            }
        });
        
        // If no assets, mark as ready
        if (totalAssets === 0) {
            this.assetsReady = true;
        }
    }
    
    checkComplete() {
        const timePassed = Date.now() - this.startTime;
        
        if (this.assetsReady && timePassed >= EviaAesthetics.settings.preloaderMinTime && !this.isComplete) {
            this.complete();
        }
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        // Complete progress bar
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
        }
        if (this.percentageEl) {
            this.percentageEl.textContent = '100%';
        }
        
        // Fade out preloader
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                this.element.classList.add('hidden');
                document.body.classList.remove('no-scroll');
                document.body.classList.add('page-loaded');
                
                this.onComplete();
            }, 600);
        }, 300);
    }
    
    onComplete() {
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 100
            });
        }
        
        // Trigger loaded event
        EviaAesthetics.isLoaded = true;
        window.dispatchEvent(new CustomEvent('evia-loaded'));
        
        // Start hero animations
        if (EviaAesthetics.components.hero) {
            EviaAesthetics.components.hero.startAnimations();
        }
        
        console.log('✨ Evia Aesthetics Loaded Successfully');
    }
}

// ========================================
// HEADER CLASS
// ========================================

class LuxuryHeader {
    constructor() {
        this.element = document.getElementById('header');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.bindEvents();
        this.initNavigation();
        this.updateScrollProgress();
        this.initEnhancements();
    }
    
    bindEvents() {
        // Optimized scroll handler
        const scrollHandler = EviaAesthetics.utils.throttle(() => {
            this.handleScroll();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Logo click - scroll to top
        const logoSection = document.querySelector('.logo-section');
        if (logoSection) {
            logoSection.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
        
        // Header booking button
        const headerBooking = document.getElementById('headerBooking');
        if (headerBooking) {
            headerBooking.addEventListener('click', () => {
                if (EviaAesthetics.components.modal) {
                    EviaAesthetics.components.modal.openBookingModal();
                }
            });
        }
    }
    
    initNavigation() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToSection(href);
                });
            }
        });
    }

    initEnhancements() {
        // Add magnetic effects to logo and buttons
        const logoBubble = document.querySelector('.logo-bubble');
        const phoneBubble = document.querySelector('.phone-bubble');
        const headerCTA = document.querySelector('#headerBooking');

        if (logoBubble) {
            EviaAesthetics.utils.addMagneticEffect(logoBubble, 0.2);
        }
        if (phoneBubble) {
            EviaAesthetics.utils.addMagneticEffect(phoneBubble, 0.15);
        }
        if (headerCTA) {
            EviaAesthetics.utils.addMagneticEffect(headerCTA, 0.2);
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > EviaAesthetics.settings.scrollThreshold;
        
        // Update header state
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.element.classList.toggle('scrolled', this.isScrolled);
        }
        
        // Update scroll progress
        this.updateScrollProgress();
        
        // Update active navigation
        this.updateActiveNav();
        
        this.lastScrollY = scrollY;
        EviaAesthetics.scrollY = scrollY;
    }
    
    updateScrollProgress() {
        if (!this.scrollProgress) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let activeSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const threshold = window.innerHeight * 0.3;
            
            if (rect.top <= threshold && rect.bottom >= threshold) {
                activeSection = section.getAttribute('id');
            }
        });
        
        if (activeSection) {
            this.setActiveNav(activeSection);
        }
    }
    
    setActiveNav(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    navigateToSection(target) {
        const element = document.querySelector(target);
        if (!element) return;
        
        const headerHeight = this.element.offsetHeight;
        const offset = headerHeight + 20;
        
        EviaAesthetics.utils.smoothScrollTo(element, offset);
    }
    
    scrollToTop() {
        EviaAesthetics.utils.smoothScrollTo(document.body, 0);
    }
}

// ========================================
// MOBILE MENU CLASS
// ========================================

class MobileMenu {
    constructor() {
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileOverlay');
        this.toggle = document.getElementById('mobileToggle');
        this.close = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menu || !this.toggle) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Toggle button
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close button
        if (this.close) {
            this.close.addEventListener('click', () => this.closeMenu());
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Navigation links
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMenu();
                    setTimeout(() => {
                        if (EviaAesthetics.components.header) {
                            EviaAesthetics.components.header.navigateToSection(href);
                        }
                    }, 300);
                });
            }
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Mobile CTA button
        const mobileCTA = document.querySelector('.mobile-cta .cta-bubble');
        if (mobileCTA) {
            mobileCTA.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    if (EviaAesthetics.components.modal) {
                        EviaAesthetics.components.modal.openBookingModal();
                    }
                }, 300);
            });
        }
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        document.body.classList.add('no-scroll');
        
        this.toggle.classList.add('active');
        this.overlay.classList.add('active');
        this.menu.classList.add('active');
    }
    
    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        this.toggle.classList.remove('active');
        this.overlay.classList.remove('active');
        this.menu.classList.remove('active');
        
        document.body.classList.remove('no-scroll');
    }
}

// ========================================
// HERO SECTION CLASS
// ========================================

class HeroSection {
    constructor() {
        this.hero = document.querySelector('.hero-section');
        this.video = document.querySelector('.hero-video');
        this.dynamicText = document.getElementById('dynamicText');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator');
        this.primaryCTA = document.querySelector('.hero-primary-cta');
        this.secondaryCTA = document.querySelector('.hero-secondary-cta');
        this.statNumbers = document.querySelectorAll('[data-count], [data-target]');
        this.quickBookingForm = document.getElementById('heroQuickForm');
        
        this.statsAnimated = false;
        this.typedInstance = null;
        
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        this.initVideo();
        this.initButtons();
        this.initScrollIndicator();
        this.initQuickBooking();
        this.observeStats();
        this.initDynamicText();
        this.initMagneticEffects();
        this.initBeforeAfterSlider();
    }
    
    initVideo() {
        if (!this.video) return;
        
        // Video event listeners
        this.video.addEventListener('loadeddata', () => {
            this.video.classList.add('loaded');
            console.log('Hero video loaded');
        });
        
        this.video.addEventListener('error', () => {
            console.warn('Hero video failed to load');
        });
        
        // Ensure video plays
        const playVideo = () => {
            if (this.video.paused) {
                this.video.play().catch(() => {
                    console.warn('Video autoplay prevented');
                });
            }
        };
        
        // Try to play on various events
        ['loadeddata', 'canplay'].forEach(event => {
            this.video.addEventListener(event, playVideo);
        });
        
        // Intersection observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.video.paused) {
                    playVideo();
                } else if (!entry.isIntersecting && !this.video.paused) {
                    this.video.pause();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.video);
    }
    
    initButtons() {
        // Primary CTA button
        if (this.primaryCTA) {
            EviaAesthetics.utils.addMagneticEffect(this.primaryCTA, 0.3);
            this.primaryCTA.addEventListener('click', () => {
                if (EviaAesthetics.components.modal) {
                    EviaAesthetics.components.modal.openBookingModal();
                }
            });
        }
        
        // Secondary CTA button (Virtual Tour)
        if (this.secondaryCTA) {
            EviaAesthetics.utils.addMagneticEffect(this.secondaryCTA, 0.25);
            this.secondaryCTA.addEventListener('click', () => {
                this.showVirtualTour();
            });
        }
    }
    
    showVirtualTour() {
        // Create modal or redirect to virtual tour
        window.open('https://www.youtube.com/watch?v=spa-tour', '_blank');
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.querySelector('#services');
            if (servicesSection && EviaAesthetics.components.header) {
                EviaAesthetics.components.header.navigateToSection('#services');
            }
        });
        
        // Hide scroll indicator on scroll
        const scrollHandler = EviaAesthetics.utils.throttle(() => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 500));
            const translateY = scrollY * 0.3;
            
            this.scrollIndicator.style.opacity = opacity;
            this.scrollIndicator.style.transform = `translateX(-50%) translateY(${translateY}px)`;
            this.scrollIndicator.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        }, 16);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    initQuickBooking() {
        if (!this.quickBookingForm) return;

        const submitBtn = this.quickBookingForm.querySelector('.booking-submit-btn');
        
        this.quickBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickBooking();
        });

        if (submitBtn) {
            EviaAesthetics.utils.addMagneticEffect(submitBtn, 0.2);
        }
    }

    handleQuickBooking() {
        const formData = new FormData(this.quickBookingForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        const requiredFields = ['heroServiceSelect', 'heroDateSelect', 'heroPhoneInput'];
        const isValid = requiredFields.every(field => {
            const input = document.getElementById(field);
            return input && input.value.trim();
        });

        if (!isValid) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Show success state
        const submitBtn = this.quickBookingForm.querySelector('.booking-submit-btn');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Booking...</span> <i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Confirmed!</span> <i class="fas fa-check"></i>';
            this.showNotification('Booking confirmed! We\'ll call you soon.', 'success');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                this.quickBookingForm.reset();
            }, 3000);
        }, 2000);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#EF4444' : '#10B981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    observeStats() {
        if (!this.statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.animateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsContainer = document.querySelector('.hero-features-grid') || document.querySelector('.doctor-stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }
    
    animateStats() {
        if (this.statsAnimated) return;
        
        this.statsAnimated = true;
        
        this.statNumbers.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.dataset.count || counter.getAttribute('data-target'));
        if (!target) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = EviaAesthetics.utils.easeInOutCubic(progress);
            const currentValue = Math.floor(easeProgress * target);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    }

    initMagneticEffects() {
        // Add magnetic effects to various elements
        const magneticElements = [
            '.service-item',
            '.hero-feature-card',
            '.trust-item'
        ];

        magneticElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                EviaAesthetics.utils.addMagneticEffect(element, 0.1);
            });
        });
    }
    
    initDynamicText() {
        if (typeof Typed !== 'undefined' && this.dynamicText) {
            // Dynamic beauty words
            const beautyWords = [
                'Beauty',
                'Confidence',
                'Radiance',
                'Elegance',
                'Glow',
                'Youth'
            ];
            
            // Initialize Typed.js
            this.typedInstance = new Typed(this.dynamicText, {
                strings: beautyWords,
                typeSpeed: 100,
                backSpeed: 70,
                backDelay: 2000,
                startDelay: 1500,
                loop: true,
                showCursor: false // We handle cursor in CSS
            });
        } else {
            // Fallback if Typed.js is not available
            if (this.dynamicText) {
                this.dynamicText.textContent = 'Beauty';
            }
        }
    }

    initBeforeAfterSlider() {
        const sliders = document.querySelectorAll('.slider-handle');
        
        sliders.forEach(slider => {
            let isDragging = false;
            
            const handleMove = (e) => {
                if (!isDragging) return;
                
                const container = slider.closest('.before-after-slider');
                if (!container) return;
                
                const rect = container.getBoundingClientRect();
                const x = (e.clientX || e.touches[0].clientX) - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                slider.style.left = `${percentage}%`;
                const afterImage = container.querySelector('.after-img');
                if (afterImage) {
                    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                }
            };
            
            slider.addEventListener('mousedown', () => {
                isDragging = true;
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMove);
                });
            });
            
            // Touch support
            slider.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault();
            });
            
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', () => {
                isDragging = false;
            });
        });
    }
    
    startAnimations() {
        // Called after preloader completes
        console.log('Hero animations started');
        
        // Animate popularity bars
        setTimeout(() => {
            const popularityFills = document.querySelectorAll('.popularity-fill');
            popularityFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 500);
            });
        }, 1000);
    }
    
    destroy() {
        // Cleanup method
        if (this.typedInstance) {
            this.typedInstance.destroy();
        }
    }
}

// ========================================
// MODAL SYSTEM CLASS
// ========================================

class ModalSystem {
    constructor() {
        this.overlay = document.getElementById('modalOverlay');
        this.bookingModal = document.getElementById('bookingModal');
        this.closeBtn = document.getElementById('modalClose');
        this.form = document.getElementById('bookingForm');
        
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        if (!this.overlay || !this.bookingModal) return;
        
        this.bindEvents();
        this.initFormEnhancements();
    }
    
    bindEvents() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closeModal();
            }
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // All booking trigger buttons
        const bookingTriggers = document.querySelectorAll('.service-cta, .cta-bubble');
        bookingTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openBookingModal();
            });
        });
    }

    initFormEnhancements() {
        if (!this.form) return;
        
        // Add magnetic effect to submit button
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            EviaAesthetics.utils.addMagneticEffect(submitBtn, 0.15);
        }
    }
    
    openBookingModal(preSelectedService = null) {
        this.activeModal = this.bookingModal;
        document.body.classList.add('no-scroll');
        this.overlay.classList.add('active');
        
        // Pre-select service if provided
        if (preSelectedService && this.form) {
            const serviceSelect = this.form.querySelector('select');
            if (serviceSelect) {
                serviceSelect.value = preSelectedService;
            }
        }
    }
    
    closeModal() {
        this.activeModal = null;
        this.overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    handleFormSubmit() {
        // Get form data
        const formData = new FormData(this.form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Simple validation
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#EF4444';
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        this.submitForm(data);
    }
    
    submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            
            // Close modal after delay
            setTimeout(() => {
                this.closeModal();
            }, 3000);
            
        }, 2000);
    }
    
    showSuccessMessage() {
        const modalContent = this.bookingModal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2rem;
                    color: white;
                    font-size: 2rem;
                ">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #1A1A1A;">Thank You!</h3>
                <p style="color: #6B7280; line-height: 1.6; margin-bottom: 1.5rem;">
                    Your consultation request has been received. 
                    Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                </p>
                <div style="
                    background: #F0FDF4;
                    border: 1px solid #BBF7D0;
                    border-radius: 1rem;
                    padding: 1rem;
                    color: #065F46;
                    font-size: 0.9rem;
                ">
                    <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                    We'll send a confirmation email shortly.
                </div>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#EF4444' : '#10B981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// ========================================
// FLOATING ELEMENTS CLASS
// ========================================

class FloatingElements {
    constructor() {
        this.bookButton = document.getElementById('floatingBook');
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkVisibility();
        this.initEnhancements();
    }
    
    bindEvents() {
        // Book button click event
        if (this.bookButton) {
            this.bookButton.addEventListener('click', () => {
                if (EviaAesthetics.components.modal) {
                    EviaAesthetics.components.modal.openBookingModal();
                }
            });
        }
        
        // Show/hide based on scroll
        const scrollHandler = EviaAesthetics.utils.throttle(() => {
            this.checkVisibility();
        }, 100);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    initEnhancements() {
        // Add magnetic effects to floating buttons
        if (this.bookButton) {
            const floatCTA = this.bookButton.querySelector('.float-cta');
            if (floatCTA) {
                EviaAesthetics.utils.addMagneticEffect(floatCTA, 0.3);
            }
        }
    }
    
    checkVisibility() {
        const scrollY = window.pageYOffset;
        const shouldShow = scrollY > 800; // Show after scrolling past hero
        
        if (shouldShow && !this.isVisible) {
            this.show();
        } else if (!shouldShow && this.isVisible) {
            this.hide();
        }
    }
    
    show() {
        this.isVisible = true;
        if (this.bookButton) {
            this.bookButton.classList.add('visible');
        }
    }
    
    hide() {
        this.isVisible = false;
        if (this.bookButton) {
            this.bookButton.classList.remove('visible');
        }
    }
}

// ========================================
// CONTACT FORM CLASS
// ========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.initEnhancements();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    initEnhancements() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            EviaAesthetics.utils.addMagneticEffect(submitBtn, 0.2);
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        this.clearError(field);
        return true;
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#EF4444';
        
        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #EF4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    clearError(field) {
        field.style.borderColor = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    handleSubmit() {
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showMessage('Please correct the errors above', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Submit form
        this.submitForm(data);
    }
    
    submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            this.form.reset();
            this.showMessage('Thank you! We\'ll be in touch soon.', 'success');
            
            console.log('Contact form submitted:', data);
        }, 2000);
    }
    
    showMessage(message, type) {
        // Use the same notification system as modal
        if (EviaAesthetics.components.modal) {
            EviaAesthetics.components.modal.showNotification(message, type);
        }
    }
}

// ========================================
// APPLICATION INITIALIZER
// ========================================

class EviaAestheticsApp {
    constructor() {
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        if (this.isInitialized) return;
        
        console.log('✨ Initializing Evia Aesthetics Application...');
        
        try {
            // Initialize all components
            EviaAesthetics.components = {
                preloader: new LuxuryPreloader(),
                header: new LuxuryHeader(),
                mobileMenu: new MobileMenu(),
                hero: new HeroSection(),
                modal: new ModalSystem(),
                floatingElements: new FloatingElements(),
                contactForm: new ContactForm()
            };
            
            // Global event listeners
            this.bindGlobalEvents();
            
            // Performance optimizations
            this.initPerformanceOptimizations();
            
            this.isInitialized = true;
            
            console.log('✅ Evia Aesthetics Application Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
    }
    
    bindGlobalEvents() {
        // Window resize handler
        const resizeHandler = EviaAesthetics.utils.debounce(() => {
            EviaAesthetics.isMobile = window.innerWidth <= 768;
            
            // Dispatch resize event for components
            window.dispatchEvent(new CustomEvent('evia-resize', {
                detail: { isMobile: EviaAesthetics.isMobile }
            }));
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
        
        // Global click handler for smooth anchors
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (EviaAesthetics.components.header) {
                    EviaAesthetics.components.header.navigateToSection(target);
                }
            }
        });
        
        // Page visibility change handler
        document.addEventListener('visibilitychange', () => {
            const videos = document.querySelectorAll('video');
            
            if (document.hidden) {
                // Pause videos when tab is hidden
                videos.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                        video.dataset.wasPlaying = 'true';
                    }
                });
            } else {
                // Resume videos when tab is visible
                videos.forEach(video => {
                    if (video.dataset.wasPlaying === 'true') {
                        video.play().catch(() => {});
                        delete video.dataset.wasPlaying;
                    }
                });
            }
        });
        
        // Window load event
        window.addEventListener('load', () => {
            document.body.classList.add('fully-loaded');
        });
    }
    
    initPerformanceOptimizations() {
        // Lazy load images
        this.initLazyLoading();
        
        // Connection type optimizations
        this.initConnectionOptimizations();
    }
    
    initLazyLoading() {
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
                img.classList.remove('lazy');
            });
        }
    }
    
    initConnectionOptimizations() {
        // Check connection type if available
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Disable auto-playing video for slow connections
                const videos = document.querySelectorAll('video[autoplay]');
                videos.forEach(video => {
                    video.removeAttribute('autoplay');
                    video.preload = 'none';
                });
                
                // Disable typed animations for performance
                if (EviaAesthetics.components.hero && EviaAesthetics.components.hero.typedInstance) {
                    EviaAesthetics.components.hero.typedInstance.destroy();
                    EviaAesthetics.components.hero.dynamicText.textContent = 'Beauty';
                }
                
                console.log('🐌 Slow connection detected, optimizing experience');
            }
        }
    }
}

// ========================================
// APPLICATION INITIALIZATION
// ========================================

// Initialize the application
const app = new EviaAestheticsApp();

// Export for global access
window.EviaAesthetics = EviaAesthetics;

// Debug helper in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.EviaDebug = {
        components: () => EviaAesthetics.components,
        settings: () => EviaAesthetics.settings,
        utils: () => EviaAesthetics.utils,
        version: '1.0.0 - Refined & Perfected'
    };
    
    console.log('🔧 Debug mode enabled. Use window.EviaDebug for debugging.');
}

// Add additional animation styles
const additionalStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = additionalStyles;
document.head.appendChild(style);
