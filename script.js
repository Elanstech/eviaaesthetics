// Evia Aesthetics - Optimized Professional JavaScript

'use strict';

// Global Application State
const EviaApp = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    components: {},
    animations: {
        isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },
    performance: {
        startTime: performance.now(),
        loadTime: 0
    }
};

/**
 * Performance Monitor
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            fps: 60
        };
        this.init();
    }
    
    init() {
        this.trackLoadTime();
        this.optimizeAnimations();
    }
    
    trackLoadTime() {
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - EviaApp.performance.startTime;
            console.log(`🚀 Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });
    }
    
    optimizeAnimations() {
        if (navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-animations');
        }
    }
}

/**
 * Enhanced Preloader
 */
class AdvancedPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.isComplete = false;
        this.duration = 2500;
        this.progress = 0;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing preloader system');
        
        document.body.classList.add('loading', 'no-scroll');
        
        this.startSequence();
        this.checkReadiness();
        this.setupFallback();
    }
    
    startSequence() {
        // Animate progress bar
        this.animateProgressBar();
        
        // Check for completion after sequence
        setTimeout(() => {
            this.checkCompletion();
        }, this.duration);
    }
    
    animateProgressBar() {
        if (!this.progressFill) return;
        
        const duration = this.duration - 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / duration), 1);
            
            const easedProgress = this.easeOutQuart(progress) * 100;
            this.updateProgress(easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
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
            const allImagesLoaded = images.every(img => img.complete);
            
            if (allImagesLoaded && document.readyState === 'complete') {
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
        }, 4000);
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        console.log('✨ Preloader completed');
        
        if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
        }
        
        this.updateProgress(100);
        
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.element.classList.add('hidden');
                document.body.classList.remove('loading', 'no-scroll');
                document.body.classList.add('page-loaded');
                
                this.onComplete();
            }, 600);
        }, 200);
    }
    
    onComplete() {
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                delay: 50
            });
        }
        
        // Trigger post-load animations
        setTimeout(() => {
            if (EviaApp.components.hero) {
                EviaApp.components.hero.initAnimations();
            }
            if (EviaApp.components.header) {
                EviaApp.components.header.show();
            }
        }, 100);
        
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        EviaApp.isLoaded = true;
        
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
        this.scrollThreshold = 60;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('📱 Initializing header system');
        
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(-100%)';
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollSpy();
    }
    
    bindEvents() {
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
        
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
            
            this.logoContainer.addEventListener('mouseenter', () => {
                this.logoContainer.style.transform = 'scale(1.05) rotate(3deg)';
            });
            
            this.logoContainer.addEventListener('mouseleave', () => {
                this.logoContainer.style.transform = 'scale(1) rotate(0deg)';
            });
        }
        
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerButtonEffect(headerCTA);
                setTimeout(() => {
                    if (EviaApp.components.modals) {
                        EviaApp.components.modals.openModal('appointmentModal');
                    }
                }, 200);
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > this.scrollThreshold;
        
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.updateScrolledState();
        }
        
        this.updateScrollProgress();
        this.updateActiveNavigation();
        
        this.lastScrollY = scrollY;
        EviaApp.scrollY = scrollY;
    }
    
    updateScrolledState() {
        if (this.isScrolled) {
            this.element.classList.add('scrolled');
        } else {
            this.element.classList.remove('scrolled');
        }
    }
    
    updateScrollProgress() {
        if (!this.progressLine) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.progressLine.style.width = `${Math.min(progress, 100)}%`;
    }
    
    updateActiveNavigation() {
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
            this.updateSideNav(activeSection);
        }
    }
    
    setActiveNav(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = this.element.querySelector(`[href="#${activeId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    updateSideNav(activeId) {
        const sideNavDots = document.querySelectorAll('.nav-dot');
        sideNavDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        const activeDot = document.querySelector(`.nav-dot[href="#${activeId}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    }
    
    initNavigation() {
        this.navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateToSection(href, link);
                }
            });
        });
    }
    
    navigateToSection(target, activeLink) {
        const element = document.querySelector(target);
        if (!element) return;
        
        if (activeLink) {
            this.setActiveNav(target.substring(1));
        }
        
        const headerHeight = this.element.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        this.smoothScrollTo(targetPosition);
    }
    
    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNav(id);
                    this.updateSideNav(id);
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        
        this.element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.element.style.opacity = '1';
        this.element.style.transform = 'translateY(0)';
        
        this.navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 80);
        });
    }
    
    smoothScrollTo(position) {
        const startPosition = window.pageYOffset;
        const distance = position - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000);
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
        
        if (shine) {
            shine.style.left = '-100%';
            setTimeout(() => {
                shine.style.left = '100%';
            }, 10);
        }
        
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
        
        this.init();
    }
    
    init() {
        if (!this.menu) return;
        
        console.log('📱 Initializing mobile menu');
        
        this.bindEvents();
        this.initNavigation();
        this.initAnimationSequence();
    }
    
    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        if (this.close) {
            this.close.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenu();
            });
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        const mobileBookingBtn = document.getElementById('mobileBookingBtn');
        if (mobileBookingBtn) {
            mobileBookingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
                setTimeout(() => {
                    if (EviaApp.components.modals) {
                        EviaApp.components.modals.openModal('appointmentModal');
                    }
                }, 300);
            });
        }
        
        if (this.menu) {
            this.menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    initNavigation() {
        this.navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(href);
                });
            }
        });
    }
    
    initAnimationSequence() {
        this.navItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            item.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        const contactSection = this.menu.querySelector('.mobile-contact');
        if (contactSection) {
            contactSection.style.opacity = '0';
            contactSection.style.transform = 'translateY(20px)';
            contactSection.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }
    
    navigateTo(target) {
        this.closeMenu();
        
        setTimeout(() => {
            if (EviaApp.components.header) {
                EviaApp.components.header.navigateToSection(target);
            }
        }, 300);
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
        
        console.log('📱 Opening mobile menu');
        
        document.body.classList.add('no-scroll');
        
        this.toggle.classList.add('active');
        this.overlay.classList.add('active');
        this.menu.classList.add('active');
        
        this.animateMenuOpen();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    closeMenu() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        
        console.log('📱 Closing mobile menu');
        
        this.toggle.classList.remove('active');
        this.overlay.classList.remove('active');
        this.menu.classList.remove('active');
        
        document.body.classList.remove('no-scroll');
        
        setTimeout(() => {
            this.initAnimationSequence();
            this.isAnimating = false;
        }, 400);
    }
    
    animateMenuOpen() {
        const header = this.menu.querySelector('.mobile-menu-header');
        if (header) {
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
        
        this.navItems.forEach((item, index) => {
            const delay = item.dataset.delay ? parseInt(item.dataset.delay) : index * 80;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 150 + delay);
        });
        
        const contactSection = this.menu.querySelector('.mobile-contact');
        if (contactSection) {
            setTimeout(() => {
                contactSection.style.opacity = '1';
                contactSection.style.transform = 'translateY(0)';
            }, 500);
        }
    }
}

/**
 * Enhanced Hero Controller with Video Support
 */
class EnhancedHero {
    constructor() {
        this.element = document.querySelector('.hero');
        this.video = document.querySelector('.hero-video');
        this.videoContainer = document.querySelector('.hero-video-container');
        this.videoFallback = document.querySelector('.video-fallback');
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
            'IV Wellness Therapy'
        ];
        this.currentTextIndex = 0;
        this.statsAnimated = false;
        this.typingInterval = null;
        this.videoLoaded = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing hero section with video');
        
        this.initVideo();
        this.initButtonInteractions();
        this.initScrollIndicator();
        this.initSideNavigation();
        this.initStatsCounter();
        this.perfectLayoutAdjustment();
    }
    
    initVideo() {
        if (!this.video) {
            console.warn('Hero video element not found, using fallback');
            this.showVideoFallback();
            return;
        }
        
        // Add loading class to container
        if (this.videoContainer) {
            this.videoContainer.classList.add('loading');
        }
        
        // Video loading and error handling
        this.video.addEventListener('loadeddata', () => {
            console.log('✅ Hero video loaded successfully');
            this.videoLoaded = true;
            this.hideVideoFallback();
            this.video.classList.add('loaded');
            
            if (this.videoContainer) {
                this.videoContainer.classList.add('loaded');
                this.videoContainer.classList.remove('loading');
            }
            
            // Ensure video plays
            const playPromise = this.video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Video autoplay prevented:', error);
                    this.showVideoFallback();
                });
            }
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            this.showVideoFallback();
            if (this.videoContainer) {
                this.videoContainer.classList.add('loaded');
                this.videoContainer.classList.remove('loading');
            }
        });
        
        this.video.addEventListener('canplaythrough', () => {
            if (!this.videoLoaded) {
                this.videoLoaded = true;
                this.hideVideoFallback();
                this.video.classList.add('loaded');
                
                if (this.videoContainer) {
                    this.videoContainer.classList.add('loaded');
                    this.videoContainer.classList.remove('loading');
                }
            }
        });
        
        // Video interaction effects
        this.video.addEventListener('mouseenter', () => {
            if (this.videoLoaded) {
                this.video.style.transform = 'translate(-50%, -50%) scale(1.02)';
                this.video.style.filter = 'brightness(0.7) saturate(1.2)';
            }
        });
        
        this.video.addEventListener('mouseleave', () => {
            if (this.videoLoaded) {
                this.video.style.transform = 'translate(-50%, -50%) scale(1)';
                this.video.style.filter = 'brightness(0.6) saturate(1.1)';
            }
        });
        
        // Handle video loading timeout
        setTimeout(() => {
            if (!this.videoLoaded) {
                console.warn('Video loading timeout, showing fallback');
                this.showVideoFallback();
                if (this.videoContainer) {
                    this.videoContainer.classList.add('loaded');
                    this.videoContainer.classList.remove('loading');
                }
            }
        }, 8000);
        
        // Intersection Observer for video performance optimization
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.video.paused && this.videoLoaded) {
                    this.video.play().catch(e => console.warn('Video play failed:', e));
                } else if (!entry.isIntersecting && !this.video.paused) {
                    this.video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        if (this.videoContainer) {
            videoObserver.observe(this.videoContainer);
        }
        
        // Handle video metadata for better loading
        this.video.addEventListener('loadedmetadata', () => {
            console.log('📹 Video metadata loaded');
        });
        
        // Handle video progress for smooth experience
        this.video.addEventListener('progress', () => {
            if (this.video.buffered.length > 0) {
                const bufferedPercent = (this.video.buffered.end(0) / this.video.duration) * 100;
                if (bufferedPercent > 25 && !this.videoLoaded) {
                    this.videoLoaded = true;
                    this.hideVideoFallback();
                }
            }
        });
    }
    
    showVideoFallback() {
        if (this.videoFallback) {
            this.videoFallback.style.opacity = '1';
            this.videoFallback.style.zIndex = '2';
        }
        if (this.video) {
            this.video.style.opacity = '0';
        }
    }
    
    hideVideoFallback() {
        if (this.videoFallback) {
            this.videoFallback.style.opacity = '0';
            this.videoFallback.style.zIndex = '0';
        }
        if (this.video) {
            this.video.style.opacity = '1';
        }
    }
    
    perfectLayoutAdjustment() {
        const adjustLayout = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            this.element.style.height = `${window.innerHeight}px`;
            
            if (this.scrollIndicator) {
                const heroHeight = this.element.offsetHeight;
                const perfectBottom = Math.max(30, (heroHeight * 0.06));
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
        
        setTimeout(() => {
            this.startTypingAnimation();
        }, 1000);
        
        setTimeout(() => {
            this.initStatsCounter();
        }, 1500);
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
                typeSpeed = 100;
            }
            
            this.typingElement.textContent = currentText;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
                typeSpeed = 400;
            }
            
            this.typingInterval = setTimeout(type, typeSpeed);
        };
        
        type();
    }
    
    initButtonInteractions() {
        const buttons = [
            document.getElementById('heroBooking'),
            document.getElementById('videoPlay'),
            document.getElementById('bookWithDoctorNew'),
            document.getElementById('servicesBooking'),
            document.getElementById('servicesCatalog'),
            document.getElementById('learnMoreNew')
        ];
        
        buttons.forEach(button => {
            if (!button) return;
            
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
        
        if (isHover) {
            button.style.transform = 'translateY(-3px) scale(1.02)';
            button.style.boxShadow = 'var(--shadow-xl)';
            
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
        button.style.transform = 'translateY(-1px) scale(1.01)';
        
        setTimeout(() => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        }, 100);
    }
    
    handleButtonClick(button) {
        const buttonId = button.id;
        
        const particles = button.querySelector('.button-particles');
        if (particles) {
            particles.style.opacity = '1';
            setTimeout(() => {
                particles.style.opacity = '0';
            }, 600);
        }
        
        switch (buttonId) {
            case 'heroBooking':
            case 'bookWithDoctorNew':
            case 'servicesBooking':
                setTimeout(() => {
                    if (EviaApp.components.modals) {
                        EviaApp.components.modals.openModal('appointmentModal');
                    }
                }, 150);
                break;
                
            case 'videoPlay':
                setTimeout(() => {
                    if (EviaApp.components.modals) {
                        EviaApp.components.modals.openModal('videoModal');
                    }
                }, 150);
                break;
                
            case 'servicesCatalog':
            case 'learnMoreNew':
                console.log('Download/Learn more functionality would be implemented here');
                break;
        }
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection && EviaApp.components.header) {
                EviaApp.components.header.navigateToSection('#about');
            }
        });
        
        this.scrollIndicator.addEventListener('mouseenter', () => {
            this.scrollIndicator.style.transform = 'translateX(-50%) translateY(-8px) scale(1.05)';
        });
        
        this.scrollIndicator.addEventListener('mouseleave', () => {
            this.scrollIndicator.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        });
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 300));
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
                if (href && EviaApp.components.header) {
                    EviaApp.components.header.navigateToSection(href);
                }
            });
        });
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
        }, { threshold: 0.3 });
        
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }
    
    animateStats() {
        this.statNumbers.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 150);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const duration = 1500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easeOutCubic(progress);
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
        console.log('🔧 Initializing modal system');
        
        this.initAppointmentModal();
        this.initVideoModal();
        this.initFormHandling();
        this.initKeyboardNavigation();
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
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.98)';
            submitBtn.innerHTML = `
                <span>Sending Request...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
        }
        
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.transform = 'scale(1)';
                    submitBtn.innerHTML = originalHTML;
                }
                
                form.reset();
                this.clearAllFieldErrors(form);
            }, 2500);
        }, 1500);
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
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            isValid = phoneRegex.test(value.replace(/[^\d\+]/g, ''));
        }
        
        const group = field.closest('.form-group');
        if (group) {
            if (!isValid && value) {
                group.classList.add('error');
                group.classList.remove('valid');
                this.addFieldShake(field);
            } else if (isValid && value) {
                group.classList.add('valid');
                group.classList.remove('error');
            } else {
                group.classList.remove('error', 'valid');
            }
        }
        
        return isValid;
    }
    
    addFieldShake(field) {
        field.style.transform = 'translateX(3px)';
        setTimeout(() => {
            field.style.transform = 'translateX(-3px)';
            setTimeout(() => {
                field.style.transform = 'translateX(0)';
            }, 100);
        }, 100);
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
            <div class="success-message" style="text-align: center; padding: 2rem;">
                <div style="
                    width: 80px; 
                    height: 80px; 
                    margin: 0 auto 1.5rem; 
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-size: 2rem;
                    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
                ">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="color: var(--evia-brown); margin-bottom: 1rem; font-size: 1.5rem; font-family: var(--font-display);">Thank You!</h3>
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; font-size: 1rem;">
                    Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                </p>
                <div style="font-size: 0.85rem; color: var(--evia-orange); font-style: italic; font-weight: 600;">
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
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%) scale(0.9);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 320px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${icon}" style="font-size: 1.125rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0) scale(1)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%) scale(0.9)';
            setTimeout(() => notification.remove(), 300);
        }, 3500);
    }
    
    openModal(modalId) {
        if (this.isAnimating) return;
        
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.isAnimating = true;
        this.activeModal = modal;
        
        document.body.classList.add('no-scroll');
        
        modal.classList.add('active');
        
        const container = modal.querySelector('.modal-container, .video-modal-content');
        if (container) {
            container.style.transform = 'scale(0.9) translateY(40px)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                container.style.transform = 'scale(1) translateY(0)';
                container.style.opacity = '1';
                this.isAnimating = false;
            }, 100);
        } else {
            this.isAnimating = false;
        }
        
        if (modalId === 'videoModal') {
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
            }
        }
    }
    
    closeModal(modal) {
        if (!modal || this.isAnimating) return;
        
        this.isAnimating = true;
        
        const container = modal.querySelector('.modal-container, .video-modal-content');
        if (container) {
            container.style.transform = 'scale(0.95) translateY(20px)';
            container.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            this.activeModal = null;
            this.isAnimating = false;
        }, 250);
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
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
            this.components.preloader = new AdvancedPreloader();
            this.components.header = new PerfectHeader();
            this.components.mobileMenu = new ProfessionalMobileMenu();
            this.components.modals = new EnhancedModalSystem();
            this.components.hero = new EnhancedHero();
            
            this.bindGlobalEvents();
            
            EviaApp.components = this.components;
            
            const loadTime = performance.now() - this.loadStartTime;
            console.log(`✅ Evia application initialized in ${loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    bindGlobalEvents() {
        window.addEventListener('resize', this.debounce(() => {
            EviaApp.isMobile = window.innerWidth <= 768;
            this.handleResize();
        }, 200), { passive: true });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        window.addEventListener('load', () => {
            const totalLoadTime = performance.now() - this.loadStartTime;
            console.log(`🚀 Complete application load: ${totalLoadTime.toFixed(2)}ms`);
            
            this.optimizeAfterLoad();
        });
        
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
        
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
        EviaApp.scrollY = scrollY;
        
        if (scrollY > 100) {
            document.body.classList.add('scrolling');
        } else {
            document.body.classList.remove('scrolling');
        }
    }
    
    handleResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        if (EviaApp.isMobile !== (window.innerWidth <= 768)) {
            EviaApp.isMobile = window.innerWidth <= 768;
            
            if (!EviaApp.isMobile && this.components.mobileMenu?.isOpen) {
                this.components.mobileMenu.closeMenu();
            }
        }
        
        Object.values(this.components).forEach(component => {
            if (component.handleResize) {
                component.handleResize();
            }
        });
    }
    
    pauseAnimations() {
        document.body.classList.add('paused-animations');
        
        // Pause hero video when page is not visible
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && !heroVideo.paused) {
            heroVideo.pause();
            this.videoPausedByVisibility = true;
        }
    }
    
    resumeAnimations() {
        document.body.classList.remove('paused-animations');
        
        // Resume hero video when page becomes visible
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && this.videoPausedByVisibility) {
            heroVideo.play().catch(e => console.warn('Video resume failed:', e));
            this.videoPausedByVisibility = false;
        }
    }
    
    optimizeAfterLoad() {
        document.body.classList.remove('loading');
        
        // Initialize about section stats counters
        const aboutStatNumbers = document.querySelectorAll('.stat-number-new');
        if (aboutStatNumbers.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateAboutStats(aboutStatNumbers);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            
            const aboutSection = document.querySelector('.about-section-new');
            if (aboutSection) {
                observer.observe(aboutSection);
            }
        }
    }
    
    animateAboutStats(statNumbers) {
        statNumbers.forEach((counter, index) => {
            setTimeout(() => {
                const target = parseInt(counter.dataset.count);
                const duration = 1500;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.floor(easeProgress * target);
                    
                    counter.textContent = currentValue;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                requestAnimationFrame(animate);
            }, index * 200);
        });
    }
    
    handleInitError() {
        document.body.classList.remove('loading', 'no-scroll');
        
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
    
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.EviaApp = new EviaAdvancedApplication();
});

// Global utility functions
window.EviaUtils = {
    scrollTo: (selector, offset = 60) => {
        if (EviaApp.components && EviaApp.components.header) {
            EviaApp.components.header.navigateToSection(selector);
        }
    },
    
    openModal: (modalId) => {
        if (EviaApp.components && EviaApp.components.modals) {
            EviaApp.components.modals.openModal(modalId);
        }
    },
    
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (EviaApp.components && EviaApp.components.modals && modal) {
            EviaApp.components.modals.closeModal(modal);
        }
    },
    
    showNotification: (message, type = 'info') => {
        if (EviaApp.components && EviaApp.components.modals) {
            EviaApp.components.modals.showNotification(message, type);
        }
    }
};

console.log('🚀 Evia Aesthetics Optimized JavaScript System Loaded Successfully!');
