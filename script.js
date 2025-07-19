// Evia Aesthetics - Advanced Professional JavaScript with Perfect Animations

'use strict';

// Global Application State
const EviaApp = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    components: {},
    animations: {
        timeline: null,
        observers: new Map(),
        isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },
    performance: {
        startTime: performance.now(),
        loadTime: 0,
        animations: new Set()
    }
};

/**
 * Advanced Performance Monitor
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            animationFrames: 0,
            fps: 60,
            lastFrame: performance.now()
        };
        this.init();
    }
    
    init() {
        this.trackFPS();
        this.trackLoadTime();
        this.optimizeAnimations();
    }
    
    trackFPS() {
        const trackFrame = (timestamp) => {
            this.metrics.animationFrames++;
            const delta = timestamp - this.metrics.lastFrame;
            this.metrics.fps = Math.round(1000 / delta);
            this.metrics.lastFrame = timestamp;
            
            // Adjust animation quality based on FPS
            if (this.metrics.fps < 30) {
                this.reduceAnimationQuality();
            }
            
            requestAnimationFrame(trackFrame);
        };
        requestAnimationFrame(trackFrame);
    }
    
    trackLoadTime() {
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - EviaApp.performance.startTime;
            console.log(`🚀 Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });
    }
    
    optimizeAnimations() {
        // Disable heavy animations on low-end devices
        if (navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-animations');
        }
    }
    
    reduceAnimationQuality() {
        document.body.classList.add('low-performance');
    }
}

/**
 * Enhanced Preloader with Perfect Sequencing
 */
class AdvancedPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.isComplete = false;
        this.duration = 3000;
        this.progress = 0;
        this.sequence = [];
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing advanced preloader system');
        
        // Prevent scrolling during load
        document.body.classList.add('loading', 'no-scroll');
        
        // Setup sequence
        this.createSequence();
        
        // Start loading process
        this.startSequence();
        
        // Check for completion
        this.checkReadiness();
        
        // Fallback safety
        this.setupFallback();
    }
    
    createSequence() {
        this.sequence = [
            { name: 'logo', duration: 800, progress: 20 },
            { name: 'brand', duration: 600, progress: 40 },
            { name: 'loading', duration: 500, progress: 60 },
            { name: 'progress', duration: 1100, progress: 100 }
        ];
    }
    
    startSequence() {
        let cumulativeDelay = 0;
        
        this.sequence.forEach((step, index) => {
            setTimeout(() => {
                this.executeStep(step, index);
            }, cumulativeDelay);
            
            cumulativeDelay += step.duration;
        });
    }
    
    executeStep(step, index) {
        const stepElement = this.element.querySelector(`.${step.name}-animation`);
        
        switch (step.name) {
            case 'logo':
                this.animateLogo();
                break;
            case 'brand':
                this.animateBrand();
                break;
            case 'loading':
                this.animateLoading();
                break;
            case 'progress':
                this.animateProgress();
                break;
        }
        
        // Update progress
        this.updateProgress(step.progress);
    }
    
    animateLogo() {
        const logoWrapper = this.element.querySelector('.logo-wrapper');
        const logoCircle = this.element.querySelector('.preloader-logo-circle');
        const logoImg = this.element.querySelector('.preloader-logo');
        
        if (logoWrapper) {
            logoWrapper.style.opacity = '1';
            logoWrapper.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (logoCircle) {
            logoCircle.style.opacity = '1';
            logoCircle.style.transform = 'scale(1)';
        }
        
        if (logoImg) {
            setTimeout(() => {
                logoImg.style.opacity = '1';
                logoImg.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    animateBrand() {
        const brandText = this.element.querySelector('.brand-text');
        if (brandText) {
            brandText.style.opacity = '1';
            brandText.style.transform = 'translateY(0)';
        }
    }
    
    animateLoading() {
        const loadingText = this.element.querySelector('.loading-text');
        if (loadingText) {
            loadingText.style.opacity = '1';
            loadingText.style.transform = 'translateY(0)';
        }
    }
    
    animateProgress() {
        this.animateProgressBar();
    }
    
    animateProgressBar() {
        if (!this.progressFill) return;
        
        const duration = 1200;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / duration), 1);
            
            // Smooth easing
            const easedProgress = this.easeOutQuart(progress) * 100;
            this.updateProgress(easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => this.checkCompletion(), 200);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateProgress(progress) {
        this.progress = Math.min(progress, 100);
        
        if (this.progressFill) {
            this.progressFill.style.width = `${this.progress}%`;
        }
    }
    
    checkReadiness() {
        const checkAssets = () => {
            const images = Array.from(document.images);
            const videos = Array.from(document.querySelectorAll('video'));
            
            const allAssetsLoaded = [
                ...images.map(img => img.complete),
                ...videos.map(video => video.readyState >= 3)
            ].every(Boolean);
            
            if (allAssetsLoaded && document.readyState === 'complete') {
                this.assetsReady = true;
            } else {
                setTimeout(checkAssets, 100);
            }
        };
        
        if (document.readyState === 'complete') {
            checkAssets();
        } else {
            window.addEventListener('load', checkAssets);
        }
    }
    
    checkCompletion() {
        if (this.progress >= 100 && !this.isComplete) {
            this.complete();
        }
    }
    
    setupFallback() {
        this.fallbackTimer = setTimeout(() => {
            if (!this.isComplete) {
                console.log('⏰ Preloader fallback triggered');
                this.complete();
            }
        }, 6000);
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        console.log('✨ Preloader sequence completed');
        
        // Clear fallback
        if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
        }
        
        // Final progress
        this.updateProgress(100);
        
        // Exit animation
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.element.classList.add('hidden');
                document.body.classList.remove('loading', 'no-scroll');
                document.body.classList.add('page-loaded');
                
                this.onComplete();
            }, 800);
        }, 300);
    }
    
    onComplete() {
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 100
            });
        }
        
        // Trigger post-load animations
        setTimeout(() => {
            EviaApp.components.hero?.initAnimations();
            EviaApp.components.header?.show();
        }, 200);
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        EviaApp.isLoaded = true;
        
        // Track performance
        EviaApp.performance.loadTime = performance.now() - EviaApp.performance.startTime;
        console.log(`🚀 Total load time: ${EviaApp.performance.loadTime.toFixed(2)}ms`);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

/**
 * Perfect Header Controller
 */
class PerfectHeader {
    constructor() {
        this.element = document.getElementById('header');
        this.progressLine = document.getElementById('progressLine');
        this.logoContainer = document.getElementById('logoContainer');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isScrolled = false;
        this.isVisible = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 80;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('📱 Initializing perfect header system');
        
        // Initially hidden
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(-100%)';
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollSpy();
        this.initEnhancedEffects();
    }
    
    bindEvents() {
        // Optimized scroll handler
        const scrollHandler = () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
        
        // Logo interactions
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
            
            this.logoContainer.addEventListener('mouseenter', () => {
                this.logoContainer.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            this.logoContainer.addEventListener('mouseleave', () => {
                this.logoContainer.style.transform = 'scale(1) rotate(0deg)';
            });
        }
        
        // Header CTA
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerButtonEffect(headerCTA);
                setTimeout(() => {
                    EviaApp.components.modals?.openModal('appointmentModal');
                }, 300);
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > this.scrollThreshold;
        
        // Update scrolled state
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.updateScrolledState();
        }
        
        // Update scroll progress
        this.updateScrollProgress();
        
        // Update active navigation
        this.updateActiveNavigation();
        
        this.lastScrollY = scrollY;
        EviaApp.scrollY = scrollY;
    }
    
    updateScrolledState() {
        if (this.isScrolled) {
            this.element.classList.add('scrolled');
            this.animateScrolledState();
        } else {
            this.element.classList.remove('scrolled');
            this.animateNormalState();
        }
    }
    
    animateScrolledState() {
        // Animate to compact state
        this.element.style.padding = 'var(--space-md) 0';
        this.element.style.background = 'var(--glass-white)';
        this.element.style.backdropFilter = 'var(--glass-blur)';
        this.element.style.boxShadow = 'var(--shadow-lg)';
        
        // Logo animation
        if (this.logoContainer) {
            this.logoContainer.style.width = '60px';
            this.logoContainer.style.height = '60px';
        }
    }
    
    animateNormalState() {
        // Animate to normal state
        this.element.style.padding = 'var(--space-lg) 0';
        this.element.style.background = 'rgba(255, 255, 255, 0.05)';
        this.element.style.backdropFilter = 'blur(15px)';
        this.element.style.boxShadow = 'none';
        
        // Logo animation
        if (this.logoContainer) {
            this.logoContainer.style.width = '70px';
            this.logoContainer.style.height = '70px';
        }
    }
    
    updateScrollProgress() {
        if (!this.progressLine) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.progressLine.style.width = `${Math.min(progress, 100)}%`;
    }
    
    initNavigation() {
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateToSection(href, link);
                }
            });
            
            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                this.animateNavHover(link, true);
            });
            
            link.addEventListener('mouseleave', () => {
                if (!link.classList.contains('active')) {
                    this.animateNavHover(link, false);
                }
            });
        });
    }
    
    animateNavHover(link, isHover) {
        const underline = link.querySelector('.nav-underline');
        
        if (isHover) {
            link.style.transform = 'translateY(-2px)';
            link.style.color = 'var(--evia-orange)';
            if (underline) {
                underline.style.width = '80%';
            }
        } else {
            link.style.transform = 'translateY(0)';
            link.style.color = this.isScrolled ? 'var(--text-primary)' : 'var(--white)';
            if (underline) {
                underline.style.width = '0';
            }
        }
    }
    
    navigateToSection(target, activeLink) {
        const element = document.querySelector(target);
        if (!element) return;
        
        // Update active state
        this.setActiveNav(activeLink);
        
        // Smooth scroll
        const headerHeight = this.element.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        this.smoothScrollTo(targetPosition);
    }
    
    setActiveNav(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            this.animateNavHover(link, false);
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            this.animateNavHover(activeLink, true);
        }
    }
    
    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = this.element.querySelector(`[href="#${id}"]`);
                    if (activeLink) {
                        this.setActiveNav(activeLink);
                    }
                    
                    // Update side nav
                    this.updateSideNav(id);
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateSideNav(activeId) {
        const sideNavDots = document.querySelectorAll('.nav-dot');
        sideNavDots.forEach(dot => {
            dot.classList.remove('active');
            dot.style.transform = 'scale(1)';
        });
        
        const activeDot = document.querySelector(`.nav-dot[href="#${activeId}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
            activeDot.style.transform = 'scale(1.4)';
        }
    }
    
    initEnhancedEffects() {
        // Logo glow effect
        if (this.logoContainer) {
            const logoGlow = this.logoContainer.querySelector('.logo-glow');
            if (logoGlow) {
                this.logoContainer.addEventListener('mouseenter', () => {
                    logoGlow.style.opacity = '1';
                });
                
                this.logoContainer.addEventListener('mouseleave', () => {
                    logoGlow.style.opacity = '0';
                });
            }
        }
        
        // Phone link pulse effect
        const phoneLink = document.querySelector('.phone-link');
        if (phoneLink) {
            const phonePulse = phoneLink.querySelector('.phone-pulse');
            if (phonePulse) {
                phoneLink.addEventListener('mouseenter', () => {
                    phonePulse.style.opacity = '1';
                });
                
                phoneLink.addEventListener('mouseleave', () => {
                    phonePulse.style.opacity = '0';
                });
            }
        }
    }
    
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        
        // Smooth reveal
        this.element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.element.style.opacity = '1';
        this.element.style.transform = 'translateY(0)';
        
        // Stagger navigation items
        this.navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    smoothScrollTo(position) {
        const startPosition = window.pageYOffset;
        const distance = position - startPosition;
        const duration = Math.min(Math.abs(distance) / 3, 1200);
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeProgress = this.easeInOutCubic(progress);
            const currentPosition = startPosition + (distance * easeProgress);
            
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    scrollToTop() {
        this.smoothScrollTo(0);
    }
    
    triggerButtonEffect(button) {
        const shine = button.querySelector('.button-shine');
        const particles = button.querySelector('.button-particles');
        
        if (shine) {
            shine.style.left = '-100%';
            setTimeout(() => {
                shine.style.left = '100%';
            }, 10);
        }
        
        if (particles) {
            particles.style.opacity = '1';
            setTimeout(() => {
                particles.style.opacity = '0';
            }, 800);
        }
        
        // Scale effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    handleResize() {
        EviaApp.isMobile = window.innerWidth <= 768;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

/**
 * Professional Mobile Menu Controller
 */
class ProfessionalMobileMenu {
    constructor() {
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileMenuOverlay');
        this.toggle = document.getElementById('mobileToggle');
        this.close = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        this.navItems = document.querySelectorAll('.mobile-nav-item');
        
        this.isOpen = false;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        
        this.init();
    }
    
    init() {
        if (!this.menu) return;
        
        console.log('📱 Initializing professional mobile menu');
        
        this.bindEvents();
        this.initNavigation();
        this.initGestures();
        this.initAnimationSequence();
        this.preventHorizontalScroll();
    }
    
    preventHorizontalScroll() {
        // Disable horizontal scrolling globally
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
        
        // Prevent horizontal scroll on touch devices
        let isScrolling = false;
        
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isOpen) {
                const touchCurrentX = e.touches[0].clientX;
                const deltaX = Math.abs(touchCurrentX - this.touchStartX);
                const deltaY = Math.abs(e.touches[0].clientY - (e.touches[0].clientY || 0));
                
                // Prevent horizontal scrolling if moving more horizontally than vertically
                if (deltaX > deltaY && deltaX > 10) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }
    
    bindEvents() {
        // Toggle button
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Close button
        if (this.close) {
            this.close.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenu();
            });
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // CTA button
        const mobileBookingBtn = document.getElementById('mobileBookingBtn');
        if (mobileBookingBtn) {
            mobileBookingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
                setTimeout(() => {
                    EviaApp.components.modals?.openModal('appointmentModal');
                }, 400);
            });
        }
        
        // Prevent menu close when clicking inside menu
        if (this.menu) {
            this.menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    initNavigation() {
        this.navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(href);
                });
            }
            
            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                this.animateNavItem(link, 'enter');
            });
            
            link.addEventListener('mouseleave', () => {
                this.animateNavItem(link, 'leave');
            });
            
            // Touch effects for mobile
            link.addEventListener('touchstart', () => {
                this.animateNavItem(link, 'enter');
            });
            
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    this.animateNavItem(link, 'leave');
                }, 150);
            });
        });
    }
    
    animateNavItem(item, state) {
        const icon = item.querySelector('.nav-icon');
        const arrow = item.querySelector('.nav-arrow');
        const content = item.querySelector('.nav-content');
        
        if (state === 'enter') {
            item.style.background = 'linear-gradient(135deg, rgba(255, 158, 24, 0.15) 0%, rgba(255, 158, 24, 0.08) 100%)';
            item.style.transform = 'translateX(8px)';
            item.style.borderColor = 'rgba(255, 158, 24, 0.3)';
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.boxShadow = 'var(--shadow-lg)';
            }
            
            if (arrow) {
                arrow.style.opacity = '1';
                arrow.style.transform = 'translateX(0) scale(1)';
            }
            
            if (content) {
                content.style.transform = 'translateX(4px)';
            }
        } else {
            item.style.background = 'rgba(255, 255, 255, 0.7)';
            item.style.transform = 'translateX(0)';
            item.style.borderColor = 'transparent';
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = 'var(--shadow-sm)';
            }
            
            if (arrow) {
                arrow.style.opacity = '0';
                arrow.style.transform = 'translateX(-10px) scale(0.8)';
            }
            
            if (content) {
                content.style.transform = 'translateX(0)';
            }
        }
    }
    
    initGestures() {
        if (!this.menu) return;
        
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        
        this.menu.addEventListener('touchstart', (e) => {
            if (!this.isOpen) return;
            
            startX = e.touches[0].clientX;
            isDragging = true;
            this.menu.style.transition = 'none';
        }, { passive: true });
        
        this.menu.addEventListener('touchmove', (e) => {
            if (!isDragging || !this.isOpen) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            if (deltaX > 0) {
                const progress = Math.min(deltaX / 200, 1);
                const translateX = deltaX;
                const scale = 1 - progress * 0.05;
                const opacity = 1 - progress * 0.3;
                
                this.menu.style.transform = `translateX(${translateX}px) scale(${scale})`;
                this.overlay.style.opacity = opacity;
            }
        }, { passive: true });
        
        this.menu.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            isDragging = false;
            this.menu.style.transition = 'all var(--transition-slow)';
            
            const deltaX = currentX - startX;
            
            if (deltaX > 100) {
                this.closeMenu();
            } else {
                // Snap back
                this.menu.style.transform = 'translateX(0) scale(1)';
                this.overlay.style.opacity = '1';
            }
        }, { passive: true });
    }
    
    initAnimationSequence() {
        // Reset all items for animation
        this.navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(50px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        // Contact section
        const contactSection = this.menu.querySelector('.mobile-contact');
        if (contactSection) {
            contactSection.style.opacity = '0';
            contactSection.style.transform = 'translateY(30px)';
            contactSection.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }
    
    navigateTo(target) {
        this.closeMenu();
        
        setTimeout(() => {
            EviaApp.components.header?.navigateToSection(target);
        }, 400);
    }
    
    toggleMenu() {
        if (this.isAnimating) return;
        
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = true;
        
        console.log('📱 Opening professional mobile menu');
        
        // Prevent body scroll
        document.body.classList.add('no-scroll');
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Update toggle button
        this.toggle.classList.add('active');
        
        // Show overlay
        this.overlay.classList.add('active');
        
        // Show menu
        this.menu.classList.add('active');
        
        // Animate menu items in sequence
        this.animateMenuOpen();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }
    
    closeMenu() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        
        console.log('📱 Closing professional mobile menu');
        
        // Update toggle button
        this.toggle.classList.remove('active');
        
        // Hide overlay
        this.overlay.classList.remove('active');
        
        // Hide menu
        this.menu.classList.remove('active');
        
        // Restore body scroll
        document.body.classList.remove('no-scroll');
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Reset menu items for next open
        setTimeout(() => {
            this.initAnimationSequence();
            this.isAnimating = false;
        }, 500);
    }
    
    animateMenuOpen() {
        // Animate header first
        const header = this.menu.querySelector('.mobile-menu-header');
        if (header) {
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Animate navigation items with stagger
        this.navItems.forEach((item, index) => {
            const delay = item.dataset.delay ? parseInt(item.dataset.delay) : index * 100;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + delay);
        });
        
        // Animate contact section
        const contactSection = this.menu.querySelector('.mobile-contact');
        if (contactSection) {
            setTimeout(() => {
                contactSection.style.opacity = '1';
                contactSection.style.transform = 'translateY(0)';
            }, 600);
        }
    }
}

/**
 * Enhanced Hero Controller with Perfect Animations
 */
class EnhancedHero {
    constructor() {
        this.element = document.querySelector('.hero');
        this.video = document.querySelector('.hero-video');
        this.typingElement = document.getElementById('typingText');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.sideNavDots = document.querySelectorAll('.nav-dot');
        
        this.typingTexts = [
            'Premium Botox',
            'Advanced Facial Rejuvenation',
            'Medical-Grade Skincare',
            'Expert Injectable Medicine',
            'Hair Restoration Therapy',
            'Body Sculpting Excellence',
            'IV Wellness Therapy',
            'Holistic Beauty Medicine'
        ];
        this.currentTextIndex = 0;
        this.statsAnimated = false;
        this.typingInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing enhanced hero section');
        
        this.initVideo();
        this.initParticles();
        this.initButtonInteractions();
        this.initScrollIndicator();
        this.initSideNavigation();
        this.initStatsCounter();
        this.perfectLayoutAdjustment();
    }
    
    perfectLayoutAdjustment() {
        // Ensure hero fits viewport perfectly
        const adjustLayout = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Adjust hero height
            this.element.style.height = `${window.innerHeight}px`;
            
            // Ensure scroll indicator is perfectly positioned
            if (this.scrollIndicator) {
                const heroHeight = this.element.offsetHeight;
                const indicatorHeight = this.scrollIndicator.offsetHeight;
                const perfectBottom = Math.max(40, (heroHeight * 0.08));
                
                this.scrollIndicator.style.bottom = `${perfectBottom}px`;
            }
        };
        
        adjustLayout();
        window.addEventListener('resize', adjustLayout, { passive: true });
        window.addEventListener('orientationchange', () => {
            setTimeout(adjustLayout, 100);
        });
    }
    
    initAnimations() {
        if (!EviaApp.isLoaded) return;
        
        console.log('🎨 Starting hero animations');
        
        // Start typing animation
        setTimeout(() => {
            this.startTypingAnimation();
        }, 1500);
        
        // Initialize stats counter
        setTimeout(() => {
            this.initStatsCounter();
        }, 2000);
        
        // Animate particles
        this.animateParticles();
    }
    
    initVideo() {
        if (!this.video) return;
        
        this.video.addEventListener('loadeddata', () => {
            if (this.video.paused) {
                this.video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            }
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            // Hide video container if error
            const videoContainer = this.video.closest('.hero-video-container');
            if (videoContainer) {
                videoContainer.style.display = 'none';
            }
        });
        
        // Enhanced video effects
        this.video.addEventListener('mouseenter', () => {
            this.video.style.transform = 'translate(-50%, -50%) scale(1.02)';
            this.video.style.filter = 'brightness(0.7) saturate(1.2)';
        });
        
        this.video.addEventListener('mouseleave', () => {
            this.video.style.transform = 'translate(-50%, -50%) scale(1)';
            this.video.style.filter = 'brightness(0.6) saturate(1.1)';
        });
    }
    
    initParticles() {
        const particles = document.querySelectorAll('.floating-particles .particle');
        
        particles.forEach((particle, index) => {
            const speed = particle.dataset.speed || 0.5;
            const delay = index * 3000;
            const duration = 15000 + (index * 2000);
            
            setTimeout(() => {
                particle.style.animation = `particleFloat ${duration}ms infinite linear`;
            }, delay);
        });
    }
    
    animateParticles() {
        const particles = document.querySelectorAll('.floating-particles .particle');
        
        particles.forEach((particle, index) => {
            // Random initial position
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 5000;
            
            particle.style.left = `${randomX}%`;
            particle.style.animationDelay = `${randomDelay}ms`;
        });
    }
    
    startTypingAnimation() {
        if (!this.typingElement) return;
        
        let currentText = '';
        let isDeleting = false;
        let charIndex = 0;
        let typeSpeed = 100;
        
        const type = () => {
            const fullText = this.typingTexts[this.currentTextIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 120;
            }
            
            this.typingElement.textContent = currentText;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
                typeSpeed = 500;
            }
            
            this.typingInterval = setTimeout(type, typeSpeed);
        };
        
        type();
    }
    
    initButtonInteractions() {
        const buttons = [
            document.getElementById('heroBooking'),
            document.getElementById('videoPlay'),
            document.getElementById('bookWithDoctorNew')
        ];
        
        buttons.forEach(button => {
            if (!button) return;
            
            // Enhanced hover effects
            button.addEventListener('mouseenter', () => {
                this.animateButtonHover(button, true);
            });
            
            button.addEventListener('mouseleave', () => {
                this.animateButtonHover(button, false);
            });
            
            button.addEventListener('mousedown', () => {
                this.triggerButtonPress(button);
            });
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonClick(button);
            });
        });
    }
    
    animateButtonHover(button, isHover) {
        const shine = button.querySelector('.button-shine');
        const particles = button.querySelector('.button-particles');
        
        if (isHover) {
            button.style.transform = 'translateY(-4px) scale(1.03)';
            button.style.boxShadow = 'var(--shadow-2xl)';
            
            if (shine) {
                shine.style.left = '100%';
            }
        } else {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = 'var(--shadow-lg)';
            
            if (shine) {
                shine.style.left = '-100%';
            }
        }
    }
    
    triggerButtonPress(button) {
        button.style.transform = 'translateY(-2px) scale(1.01)';
        
        setTimeout(() => {
            button.style.transform = 'translateY(-4px) scale(1.03)';
        }, 100);
    }
    
    handleButtonClick(button) {
        const buttonId = button.id;
        
        // Trigger particle explosion
        const particles = button.querySelector('.button-particles');
        if (particles) {
            particles.style.opacity = '1';
            setTimeout(() => {
                particles.style.opacity = '0';
            }, 800);
        }
        
        // Handle different button actions
        switch (buttonId) {
            case 'heroBooking':
            case 'bookWithDoctorNew':
                setTimeout(() => {
                    EviaApp.components.modals?.openModal('appointmentModal');
                }, 200);
                break;
                
            case 'videoPlay':
                setTimeout(() => {
                    EviaApp.components.modals?.openModal('videoModal');
                }, 200);
                break;
        }
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                EviaApp.components.header?.navigateToSection('#about');
            }
        });
        
        // Enhanced hover effects
        this.scrollIndicator.addEventListener('mouseenter', () => {
            this.scrollIndicator.style.transform = 'translateX(-50%) translateY(-12px) scale(1.1)';
        });
        
        this.scrollIndicator.addEventListener('mouseleave', () => {
            this.scrollIndicator.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        });
        
        // Auto-hide on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 400));
            this.scrollIndicator.style.opacity = opacity;
            
            if (opacity < 0.1) {
                this.scrollIndicator.style.pointerEvents = 'none';
            } else {
                this.scrollIndicator.style.pointerEvents = 'auto';
            }
        }, { passive: true });
    }
    
    initSideNavigation() {
        this.sideNavDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const href = dot.getAttribute('href');
                if (href) {
                    this.navigateToSection(href, dot);
                }
            });
            
            // Enhanced hover effects
            dot.addEventListener('mouseenter', () => {
                this.animateDotHover(dot, true);
            });
            
            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    this.animateDotHover(dot, false);
                }
            });
        });
    }
    
    animateDotHover(dot, isHover) {
        const glow = dot.querySelector('.dot-glow');
        
        if (isHover) {
            dot.style.transform = 'scale(1.6)';
            dot.style.background = 'var(--evia-orange)';
            if (glow) {
                glow.style.opacity = '1';
            }
        } else {
            dot.style.transform = 'scale(1)';
            dot.style.background = 'rgba(255, 158, 24, 0.3)';
            if (glow) {
                glow.style.opacity = '0';
            }
        }
    }
    
    navigateToSection(target, activeDot) {
        // Update active state
        this.sideNavDots.forEach(dot => {
            dot.classList.remove('active');
            this.animateDotHover(dot, false);
        });
        
        activeDot.classList.add('active');
        this.animateDotHover(activeDot, true);
        
        // Navigate
        EviaApp.components.header?.navigateToSection(target);
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length || this.statsAnimated) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    this.animateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }
    
    animateStats() {
        this.statNumbers.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Eased progress
            const easeProgress = this.easeOutCubic(progress);
            const currentValue = Math.floor(easeProgress * target);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target;
                
                // Trigger completion effect
                const statItem = counter.closest('.stat-item');
                if (statItem) {
                    const glow = statItem.querySelector('.stat-glow');
                    if (glow) {
                        glow.style.opacity = '1';
                        setTimeout(() => {
                            glow.style.opacity = '0';
                        }, 1000);
                    }
                }
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

/**
 * Enhanced Modal System
 */
class EnhancedModalSystem {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        console.log('🔧 Initializing enhanced modal system');
        
        this.initAppointmentModal();
        this.initVideoModal();
        this.initFormHandling();
        this.initKeyboardNavigation();
        this.initAccessibility();
    }
    
    initAppointmentModal() {
        if (!this.appointmentModal) return;
        
        const closeBtn = this.appointmentModal.querySelector('.modal-close');
        const overlay = this.appointmentModal.querySelector('.modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal(this.appointmentModal);
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeModal(this.appointmentModal);
            });
        }
    }
    
    initVideoModal() {
        if (!this.videoModal) return;
        
        const closeBtn = this.videoModal.querySelector('.video-modal-close');
        const overlay = this.videoModal.querySelector('.video-modal-overlay');
        
        const closeVideo = () => {
            this.closeModal(this.videoModal);
            
            // Clear video source
            const iframe = this.videoModal.querySelector('iframe');
            if (iframe) {
                iframe.src = '';
            }
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeVideo);
        }
        
        if (overlay) {
            overlay.addEventListener('click', closeVideo);
        }
    }
    
    initFormHandling() {
        const form = document.getElementById('appointmentForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
        
        // Enhanced form validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    handleFormSubmission(form) {
        if (!this.validateForm(form)) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn?.innerHTML;
        
        // Enhanced loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.98)';
            submitBtn.innerHTML = `
                <span>Sending Request...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
        }
        
        // Simulate API call
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.transform = 'scale(1)';
                    submitBtn.innerHTML = originalHTML;
                }
                
                // Reset form
                form.reset();
                this.clearAllFieldErrors(form);
            }, 3000);
        }, 2000);
    }
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = field.checkValidity() && value !== '';
        
        // Enhanced validation rules
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            isValid = phoneRegex.test(value.replace(/[^\d\+]/g, ''));
        }
        
        // Visual feedback
        const group = field.closest('.form-group');
        if (group) {
            if (!isValid && value) {
                group.classList.add('error');
                group.classList.remove('valid');
                this.addFieldShake(field);
            } else if (isValid && value) {
                group.classList.add('valid');
                group.classList.remove('error');
                this.addFieldSuccess(field);
            } else {
                group.classList.remove('error', 'valid');
            }
        }
        
        return isValid;
    }
    
    addFieldShake(field) {
        field.style.transform = 'translateX(5px)';
        setTimeout(() => {
            field.style.transform = 'translateX(-5px)';
            setTimeout(() => {
                field.style.transform = 'translateX(0)';
            }, 100);
        }, 100);
    }
    
    addFieldSuccess(field) {
        field.style.transform = 'scale(1.02)';
        setTimeout(() => {
            field.style.transform = 'scale(1)';
        }, 200);
    }
    
    clearFieldError(field) {
        const group = field.closest('.form-group');
        if (group) {
            group.classList.remove('error');
        }
    }
    
    clearAllFieldErrors(form) {
        const groups = form.querySelectorAll('.form-group');
        groups.forEach(group => {
            group.classList.remove('error', 'valid');
        });
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 3rem 2rem;">
                <div style="
                    width: 100px; 
                    height: 100px; 
                    margin: 0 auto 2rem; 
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-size: 2.5rem;
                    animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                ">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="color: var(--evia-brown); margin-bottom: 1.5rem; font-size: 1.75rem; font-family: var(--font-display);">Thank You!</h3>
                <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-size: 1.1rem;">
                    Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                </p>
                <div style="font-size: 0.9rem; color: var(--evia-orange); font-style: italic; font-weight: 600;">
                    This window will close automatically...
                </div>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const bgColor = type === 'error' ? '#EF4444' : '#10B981';
        const icon = type === 'error' ? 'exclamation-circle' : 'check-circle';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%) scale(0.9);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 350px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${icon}" style="font-size: 1.25rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0) scale(1)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%) scale(0.9)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
    
    openModal(modalId) {
        if (this.isAnimating) return;
        
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.isAnimating = true;
        this.activeModal = modal;
        
        // Prevent body scroll
        document.body.classList.add('no-scroll');
        
        // Show modal
        modal.classList.add('active');
        
        // Enhanced opening animation
        const container = modal.querySelector('.modal-container, .video-modal-content');
        if (container) {
            container.style.transform = 'scale(0.8) translateY(60px)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                container.style.transform = 'scale(1) translateY(0)';
                container.style.opacity = '1';
                this.isAnimating = false;
            }, 100);
        } else {
            this.isAnimating = false;
        }
        
        // Setup video modal
        if (modalId === 'videoModal') {
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
            }
        }
        
        // Focus management
        this.trapFocus(modal);
    }
    
    closeModal(modal) {
        if (!modal || this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Enhanced closing animation
        const container = modal.querySelector('.modal-container, .video-modal-content');
        if (container) {
            container.style.transform = 'scale(0.9) translateY(30px)';
            container.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            this.activeModal = null;
            this.isAnimating = false;
        }, 300);
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
    }
    
    initAccessibility() {
        // Add ARIA attributes
        const modals = document.querySelectorAll('.modal, .video-modal');
        modals.forEach(modal => {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-hidden', 'true');
        });
    }
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement) {
            firstElement.focus();
        }
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

/**
 * Main Application Controller
 */
class EviaAdvancedApplication {
    constructor() {
        this.isLoading = true;
        this.components = {};
        this.loadStartTime = performance.now();
        this.performanceMonitor = new PerformanceMonitor();
        
        this.init();
    }
    
    init() {
        console.log('🏢 Initializing Evia Advanced Application...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    initApp() {
        try {
            // Initialize preloader first
            this.components.preloader = new AdvancedPreloader();
            
            // Initialize core components
            this.components.header = new PerfectHeader();
            this.components.mobileMenu = new ProfessionalMobileMenu();
            this.components.modals = new EnhancedModalSystem();
            this.components.hero = new EnhancedHero();
            
            // Bind global events
            this.bindGlobalEvents();
            
            // Store components globally
            EviaApp.components = this.components;
            
            // Performance tracking
            const loadTime = performance.now() - this.loadStartTime;
            console.log(`✅ Evia application initialized in ${loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    bindGlobalEvents() {
        // Enhanced resize handler
        window.addEventListener('resize', this.debounce(() => {
            EviaApp.isMobile = window.innerWidth <= 768;
            this.handleResize();
        }, 250), { passive: true });
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Performance monitoring
        window.addEventListener('load', () => {
            const totalLoadTime = performance.now() - this.loadStartTime;
            console.log(`🚀 Complete application load: ${totalLoadTime.toFixed(2)}ms`);
            
            // Optimize after load
            this.optimizeAfterLoad();
        });
        
        // Enhanced error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handlePromiseRejection(event);
        });
        
        // Perfect scroll handling
        this.initScrollOptimization();
    }
    
    initScrollOptimization() {
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    this.handleGlobalScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }
    
    handleGlobalScroll() {
        const scrollY = window.pageYOffset;
        
        // Update global scroll position
        EviaApp.scrollY = scrollY;
        
        // Performance optimization: reduce animations during scroll
        if (scrollY > 100) {
            document.body.classList.add('scrolling');
        } else {
            document.body.classList.remove('scrolling');
        }
    }
    
    handleResize() {
        // Update CSS custom properties for perfect responsive design
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Update mobile state
        if (EviaApp.isMobile !== (window.innerWidth <= 768)) {
            EviaApp.isMobile = window.innerWidth <= 768;
            
            // Close mobile menu if switching to desktop
            if (!EviaApp.isMobile && this.components.mobileMenu?.isOpen) {
                this.components.mobileMenu.closeMenu();
            }
        }
        
        // Trigger component resize handlers
        Object.values(this.components).forEach(component => {
            if (component.handleResize) {
                component.handleResize();
            }
        });
    }
    
    pauseAnimations() {
        const video = document.querySelector('.hero-video');
        if (video && !video.paused) {
            video.pause();
        }
        
        // Pause CSS animations
        document.body.classList.add('paused-animations');
    }
    
    resumeAnimations() {
        const video = document.querySelector('.hero-video');
        if (video && video.paused) {
            video.play().catch(e => {
                console.log('Video resume failed:', e);
            });
        }
        
        // Resume CSS animations
        document.body.classList.remove('paused-animations');
    }
    
    optimizeAfterLoad() {
        // Remove unused CSS classes
        document.body.classList.remove('loading');
        
        // Lazy load non-critical resources
        this.lazyLoadResources();
        
        // Preload critical next-page resources
        this.preloadCriticalResources();
    }
    
    lazyLoadResources() {
        // Implement lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    preloadCriticalResources() {
        // Preload font resources
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap'
        ];
        
        fontPreloads.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    handleInitError() {
        document.body.classList.remove('loading', 'no-scroll');
        
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
        
        // Show fallback interface
        this.showFallbackInterface();
    }
    
    handleGlobalError(event) {
        // Log error details
        console.error('Error details:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
        
        // Show user-friendly error message if critical
        if (event.error && event.error.name === 'TypeError') {
            this.showErrorNotification('Something went wrong. Please refresh the page.');
        }
    }
    
    handlePromiseRejection(event) {
        console.error('Promise rejection details:', event.reason);
        
        // Prevent default browser behavior
        event.preventDefault();
    }
    
    showFallbackInterface() {
        const fallback = document.createElement('div');
        fallback.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--white);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: var(--font-primary);
            ">
                <div style="text-align: center; max-width: 400px; padding: 2rem;">
                    <h2 style="color: var(--evia-brown); margin-bottom: 1rem;">Evia Aesthetics</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        We're experiencing technical difficulties. Please refresh the page or contact us directly.
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: var(--gradient-primary);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 2rem;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(fallback);
    }
    
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #EF4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Utility functions
    debounce(func, wait) {
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
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.EviaApp = new EviaAdvancedApplication();
});

// Global utility functions for external access
window.EviaUtils = {
    scrollTo: (selector, offset = 80) => {
        if (EviaApp.components.header) {
            EviaApp.components.header.navigateToSection(selector);
        }
    },
    
    openModal: (modalId) => {
        if (EviaApp.components.modals) {
            EviaApp.components.modals.openModal(modalId);
        }
    },
    
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (EviaApp.components.modals && modal) {
            EviaApp.components.modals.closeModal(modal);
        }
    },
    
    showNotification: (message, type = 'info') => {
        if (EviaApp.components.modals) {
            EviaApp.components.modals.showNotification(message, type);
        }
    }
};

console.log('🚀 Evia Aesthetics Advanced JavaScript System Loaded Successfully!');
