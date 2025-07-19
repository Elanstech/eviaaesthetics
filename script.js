// Evia Aesthetics - Modern Advanced Animations JavaScript

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
    }
};

/**
 * Advanced Animation System
 */
class AnimationController {
    constructor() {
        this.queue = new Map();
        this.running = new Set();
        this.completed = new Set();
        this.isReduced = EviaApp.animations.isReduced;
        
        this.init();
    }
    
    init() {
        if (this.isReduced) {
            this.disableAnimations();
            return;
        }
        
        this.setupObservers();
        this.initializeElements();
    }
    
    disableAnimations() {
        document.body.classList.add('no-animations');
        // Show all elements immediately
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    setupObservers() {
        // Header animation observer
        const headerObserver = new IntersectionObserver(
            (entries) => this.handleHeaderAnimation(entries),
            { threshold: 0, rootMargin: '0px' }
        );
        
        // Section animation observer
        const sectionObserver = new IntersectionObserver(
            (entries) => this.handleSectionAnimations(entries),
            { threshold: 0.1, rootMargin: '-50px 0px' }
        );
        
        // Stagger animation observer
        const staggerObserver = new IntersectionObserver(
            (entries) => this.handleStaggerAnimations(entries),
            { threshold: 0.2, rootMargin: '-30px 0px' }
        );
        
        EviaApp.animations.observers.set('header', headerObserver);
        EviaApp.animations.observers.set('section', sectionObserver);
        EviaApp.animations.observers.set('stagger', staggerObserver);
    }
    
    initializeElements() {
        // Observe header elements
        document.querySelectorAll('[data-animate="header"]').forEach(el => {
            EviaApp.animations.observers.get('header').observe(el);
        });
        
        // Observe section elements
        document.querySelectorAll('[data-animate="section"]').forEach(el => {
            EviaApp.animations.observers.get('section').observe(el);
        });
        
        // Observe stagger elements
        document.querySelectorAll('[data-animate="stagger"]').forEach(el => {
            EviaApp.animations.observers.get('stagger').observe(el);
        });
    }
    
    handleHeaderAnimation(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.completed.has('header')) {
                this.completed.add('header');
                this.animateHeader();
            }
        });
    }
    
    handleSectionAnimations(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseFloat(element.dataset.animateDelay) || 0;
                
                if (!this.running.has(element)) {
                    this.running.add(element);
                    this.animateElement(element, delay * 1000);
                }
            }
        });
    }
    
    handleStaggerAnimations(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const container = element.closest('.expertise-grid-new, .credentials-list, .services-grid');
                
                if (container && !this.running.has(container)) {
                    this.running.add(container);
                    this.animateStaggerGroup(container);
                }
            }
        });
    }
    
    animateHeader() {
        const headerElements = document.querySelectorAll('[data-animate="header"]');
        
        headerElements.forEach((element, index) => {
            const delay = parseFloat(element.dataset.animateDelay) || index * 0.1;
            this.animateElement(element, delay * 1000);
        });
    }
    
    animateElement(element, delay = 0) {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('animated');
        }, delay);
    }
    
    animateStaggerGroup(container) {
        const children = container.querySelectorAll('[data-animate="stagger"]');
        
        children.forEach((child, index) => {
            const delay = index * 100;
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'none';
                child.classList.add('animated');
            }, delay);
        });
    }
    
    animateHero() {
        if (this.isReduced) return;
        
        const heroElements = document.querySelectorAll('[data-animate="hero"]');
        
        heroElements.forEach(element => {
            const delay = parseFloat(element.dataset.animateDelay) || 0;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.classList.add('animated');
                
                // Special handling for title words
                if (element.classList.contains('hero-title')) {
                    this.animateTitleWords(element);
                }
            }, delay * 1000);
        });
    }
    
    animateTitleWords(titleContainer) {
        const words = titleContainer.querySelectorAll('.title-word');
        
        words.forEach(word => {
            const delay = parseFloat(word.dataset.wordDelay) || 0;
            
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'none';
                word.classList.add('word-animated');
            }, delay * 1000);
        });
    }
}

/**
 * Enhanced Preloader Controller
 */
class PreloaderController {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.progress = 0;
        this.isComplete = false;
        this.duration = 3500;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing advanced preloader');
        
        // Add loading class to body
        document.body.classList.add('loading', 'no-scroll');
        
        // Start sequential animations
        this.startSequence();
        
        // Check page readiness
        this.checkPageReady();
        
        // Fallback timer
        this.fallbackTimer = setTimeout(() => {
            if (!this.isComplete) {
                console.log('⏰ Preloader fallback triggered');
                this.complete();
            }
        }, 5000);
    }
    
    startSequence() {
        // Phase 1: Logo animation (0-1000ms)
        this.animateLogo();
        
        // Phase 2: Brand text (1000-1500ms)
        setTimeout(() => this.animateBrandText(), 1000);
        
        // Phase 3: Loading text (1500-2000ms)
        setTimeout(() => this.animateLoadingText(), 1500);
        
        // Phase 4: Progress bar (2000-3500ms)
        setTimeout(() => this.animateProgress(), 2000);
    }
    
    animateLogo() {
        const logoWrapper = this.element.querySelector('.logo-wrapper');
        const logoCircle = this.element.querySelector('.logo-circle-preloader');
        const logoInner = this.element.querySelector('.logo-inner');
        const badge = this.element.querySelector('.medical-badge-preloader');
        
        if (logoWrapper) {
            logoWrapper.style.animation = 'float 4s ease-in-out infinite';
        }
        
        if (logoCircle) {
            logoCircle.style.animation = 'pulse 3s ease-in-out infinite';
        }
        
        if (logoInner) {
            setTimeout(() => {
                logoInner.style.opacity = '1';
                logoInner.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        }
        
        if (badge) {
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'scale(1)';
            }, 1200);
        }
    }
    
    animateBrandText() {
        const brandText = this.element.querySelector('.brand-text');
        if (brandText) {
            brandText.style.opacity = '1';
            brandText.style.transform = 'translateY(0)';
        }
    }
    
    animateLoadingText() {
        const loadingText = this.element.querySelector('.loading-text');
        if (loadingText) {
            loadingText.style.opacity = '1';
            loadingText.style.transform = 'translateY(0)';
        }
    }
    
    animateProgress() {
        const duration = 1500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            
            // Eased progress
            const easedProgress = this.easeOutExpo(progress / 100) * 100;
            this.updateProgress(easedProgress);
            
            if (progress < 100) {
                requestAnimationFrame(animate);
            } else {
                // Auto-complete after progress finishes
                setTimeout(() => this.complete(), 300);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateProgress(progress) {
        this.progress = progress;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        // Clear fallback timer
        if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
        }
        
        // Final progress
        this.updateProgress(100);
        
        // Exit animation
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.element.classList.add('hidden');
                document.body.classList.remove('loading', 'no-scroll');
                this.onComplete();
            }, 800);
        }, 400);
        
        console.log('✨ Advanced preloader completed');
    }
    
    onComplete() {
        document.body.classList.add('page-loaded');
        
        // Trigger post-load animations
        setTimeout(() => {
            EviaApp.components.animations?.animateHero();
            EviaApp.components.header?.show();
        }, 200);
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        EviaApp.isLoaded = true;
    }
    
    checkPageReady() {
        if (document.readyState === 'complete') {
            // Already loaded
        } else {
            window.addEventListener('load', () => {
                // Let animations play out before auto-completing
            });
        }
    }
    
    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
}

/**
 * Enhanced Header Controller
 */
class HeaderController {
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
        
        console.log('📱 Initializing enhanced header');
        
        // Initially hidden
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(-100%)';
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollSpy();
    }
    
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.element.style.opacity = '1';
        this.element.style.transform = 'translateY(0)';
        
        // Animate header elements
        const headerElements = this.element.querySelectorAll('[data-animate="header"]');
        headerElements.forEach((element, index) => {
            const delay = parseFloat(element.dataset.animateDelay) || index * 0.1;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.classList.add('header-animated');
            }, delay * 1000);
        });
    }
    
    bindEvents() {
        // Throttled scroll handler
        window.addEventListener('scroll', () => {
            if (this.ticking) return;
            
            this.ticking = true;
            requestAnimationFrame(() => {
                this.handleScroll();
                this.ticking = false;
            });
        }, { passive: true });
        
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Logo click
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
        
        // Header CTA
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('appointmentModal');
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > this.scrollThreshold;
        
        // Update scrolled state with smooth transition
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            
            if (this.isScrolled) {
                this.element.classList.add('scrolled');
            } else {
                this.element.classList.remove('scrolled');
            }
        }
        
        // Update scroll progress
        this.updateScrollProgress();
        
        // Update active navigation
        this.updateActiveNavigation();
        
        this.lastScrollY = scrollY;
        EviaApp.scrollY = scrollY;
    }
    
    updateScrollProgress() {
        if (!this.progressLine) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.progressLine.style.width = `${Math.min(progress, 100)}%`;
    }
    
    initNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateToSection(href, link);
                }
            });
            
            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', () => {
                if (!link.classList.contains('active')) {
                    link.style.transform = 'translateY(0)';
                }
            });
        });
    }
    
    navigateToSection(target, activeLink) {
        const element = document.querySelector(target);
        if (!element) return;
        
        // Update active state with animation
        this.setActiveNav(activeLink);
        
        // Smooth scroll with easing
        const headerHeight = this.element.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        this.smoothScrollTo(targetPosition);
    }
    
    setActiveNav(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.transform = 'translateY(0)';
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.style.transform = 'translateY(-2px)';
        }
    }
    
    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = this.element.querySelector(`[href="#${id}"]`);
                    if (activeLink) {
                        this.setActiveNav(activeLink);
                    }
                    
                    // Update side nav
                    const sideNavDot = document.querySelector(`.nav-dot[href="#${id}"]`);
                    if (sideNavDot) {
                        document.querySelectorAll('.nav-dot').forEach(dot => {
                            dot.classList.remove('active');
                            dot.style.transform = 'scale(1)';
                        });
                        sideNavDot.classList.add('active');
                        sideNavDot.style.transform = 'scale(1.4)';
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    scrollToTop() {
        this.smoothScrollTo(0);
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
            
            // Eased progress
            const easeProgress = this.easeInOutCubic(progress);
            const currentPosition = startPosition + (distance * easeProgress);
            
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    handleResize() {
        EviaApp.isMobile = window.innerWidth <= 768;
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }
}

/**
 * Modern Mobile Menu Controller
 */
class ModernMobileMenuController {
    constructor() {
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileMenuOverlay');
        this.toggle = document.getElementById('mobileToggle');
        this.close = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        
        this.isOpen = false;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (!this.menu) return;
        
        console.log('📱 Initializing modern mobile menu');
        
        this.bindEvents();
        this.initNavigation();
        this.initGestures();
    }
    
    bindEvents() {
        // Toggle button with enhanced animation
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }
        
        // Close button
        if (this.close) {
            this.close.addEventListener('click', this.closeMenu.bind(this));
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', this.closeMenu.bind(this));
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // CTA buttons
        const mobileBookingBtn = document.getElementById('mobileBookingBtn');
        if (mobileBookingBtn) {
            mobileBookingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
                setTimeout(() => {
                    EviaApp.components.modals?.openModal('appointmentModal');
                }, 300);
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
        });
    }
    
    initGestures() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.menu.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.menu.addEventListener('touchmove', (e) => {
            if (!isDragging || !this.isOpen) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            if (deltaX > 0) {
                const progress = Math.min(deltaX / 200, 1);
                this.menu.style.transform = `translateX(${deltaX}px) scale(${1 - progress * 0.1})`;
                this.overlay.style.opacity = 1 - progress * 0.5;
            }
        }, { passive: true });
        
        this.menu.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaX = currentX - startX;
            
            if (deltaX > 100) {
                this.closeMenu();
            } else {
                // Snap back
                this.menu.style.transform = 'translateX(0) scale(1)';
                this.overlay.style.opacity = '1';
            }
            
            isDragging = false;
        }, { passive: true });
    }
    
    animateNavItem(item, state) {
        const icon = item.querySelector('.nav-icon');
        const arrow = item.querySelector('.nav-arrow');
        
        if (state === 'enter') {
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(10deg)';
            }
            if (arrow) {
                arrow.style.opacity = '1';
                arrow.style.transform = 'translateX(0) scale(1)';
            }
        } else {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            if (arrow) {
                arrow.style.opacity = '0';
                arrow.style.transform = 'translateX(-20px) scale(0.8)';
            }
        }
    }
    
    navigateTo(target) {
        this.closeMenu();
        
        setTimeout(() => {
            EviaApp.components.header?.navigateToSection(target);
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
        
        // Update toggle button
        this.toggle.classList.add('active');
        
        // Show overlay
        this.overlay.classList.add('active');
        
        // Show menu
        this.menu.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Sequence animations
        this.animateMenuOpen();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1200);
        
        console.log('📱 Modern mobile menu opened');
    }
    
    closeMenu() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        
        // Update toggle button
        this.toggle.classList.remove('active');
        
        // Hide overlay
        this.overlay.classList.remove('active');
        
        // Hide menu
        this.menu.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
        
        console.log('📱 Modern mobile menu closed');
    }
    
    animateMenuOpen() {
        // Reset all elements for animation
        const header = this.menu.querySelector('.mobile-menu-header');
        const navItems = this.menu.querySelectorAll('.mobile-nav-item');
        const contact = this.menu.querySelector('.mobile-contact');
        
        // Animate header
        if (header) {
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Animate nav items with stagger
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        });
        
        // Animate contact section
        if (contact) {
            setTimeout(() => {
                contact.style.opacity = '1';
                contact.style.transform = 'translateY(0)';
            }, 800);
        }
    }
}

/**
 * Enhanced Hero Controller
 */
class HeroController {
    constructor() {
        this.element = document.querySelector('.hero');
        this.video = document.querySelector('.hero-video');
        this.typingElement = document.getElementById('typingText');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.heroBooking = document.getElementById('heroBooking');
        this.videoPlay = document.getElementById('videoPlay');
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
        this.currentIndex = 0;
        this.typingInterval = null;
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing enhanced hero section');
        
        this.initVideo();
        this.initTypingAnimation();
        this.initButtonInteractions();
        this.initScrollIndicator();
        this.initSideNavigation();
        this.initStatsCounter();
        this.initParticles();
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
        });
        
        // Enhanced video controls
        this.video.addEventListener('mouseenter', () => {
            this.video.style.transform = 'translate(-50%, -50%) scale(1.02)';
        });
        
        this.video.addEventListener('mouseleave', () => {
            this.video.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    initTypingAnimation() {
        if (!this.typingElement) return;
        
        setTimeout(() => {
            this.startTypingAnimation();
        }, 2000);
    }
    
    startTypingAnimation() {
        let currentText = '';
        let isDeleting = false;
        let charIndex = 0;
        
        const type = () => {
            const fullText = this.typingTexts[this.currentIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            this.typingElement.textContent = currentText;
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.typingTexts.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        };
        
        type();
    }
    
    initButtonInteractions() {
        // Enhanced button animations
        const buttons = [this.heroBooking, this.videoPlay];
        
        buttons.forEach(button => {
            if (!button) return;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(-1px) scale(1.02)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-3px) scale(1.05)';
            });
        });
        
        // Hero booking button
        if (this.heroBooking) {
            this.heroBooking.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('appointmentModal');
            });
        }
        
        // Video play button
        if (this.videoPlay) {
            this.videoPlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('videoModal');
            });
        }
        
        // Other CTAs
        const bookWithDoctor = document.getElementById('bookWithDoctorNew');
        if (bookWithDoctor) {
            bookWithDoctor.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('appointmentModal');
            });
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
        
        // Hide on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 300));
            this.scrollIndicator.style.opacity = opacity;
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
                dot.style.transform = 'scale(1.6)';
                dot.style.boxShadow = '0 0 20px rgba(255, 158, 24, 0.6)';
            });
            
            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.transform = 'scale(1)';
                    dot.style.boxShadow = 'none';
                }
            });
        });
    }
    
    navigateToSection(target, activeDot) {
        // Update active state
        this.sideNavDots.forEach(dot => {
            dot.classList.remove('active');
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = 'none';
        });
        
        activeDot.classList.add('active');
        activeDot.style.transform = 'scale(1.4)';
        activeDot.style.boxShadow = '0 0 15px rgba(255, 158, 24, 0.5)';
        
        // Navigate
        EviaApp.components.header?.navigateToSection(target);
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 200);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
    }
    
    initParticles() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            const delay = index * 4000;
            const duration = 20000 + (index * 5000);
            
            setTimeout(() => {
                particle.style.animation = `particleFloat ${duration}ms infinite ease-in-out`;
            }, delay);
        });
    }
    
    openModal(modalId) {
        EviaApp.components.modals?.openModal(modalId);
    }
}

/**
 * Enhanced Modal System Controller
 */
class ModalController {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        console.log('🔧 Initializing enhanced modal system');
        
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
        
        // Enhanced form validation with animations
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
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
        
        // Simulate form submission with enhanced animation
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.transform = 'scale(1)';
                    submitBtn.innerHTML = originalHTML;
                }
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
        
        // Enhanced validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            isValid = phoneRegex.test(value.replace(/[^\d\+]/g, ''));
        }
        
        // Enhanced visual feedback with animations
        const group = field.closest('.form-group');
        if (group) {
            if (!isValid && value) {
                group.classList.add('error');
                group.classList.remove('valid');
                field.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    field.style.transform = 'translateX(-5px)';
                    setTimeout(() => {
                        field.style.transform = 'translateX(0)';
                    }, 150);
                }, 150);
            } else if (isValid && value) {
                group.classList.add('valid');
                group.classList.remove('error');
                field.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    field.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const group = field.closest('.form-group');
        if (group) {
            group.classList.remove('error');
        }
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem; animation: fadeInScale 0.6s ease-out;">
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
                    animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both;
                ">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="color: var(--evia-brown); margin-bottom: 1rem; font-size: 1.5rem; animation: slideInUp 0.6s ease-out 0.4s both;">Thank You!</h3>
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; animation: slideInUp 0.6s ease-out 0.6s both;">
                    Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                </p>
                <div style="font-size: 0.875rem; color: var(--evia-orange); font-style: italic; animation: slideInUp 0.6s ease-out 0.8s both;">
                    This window will close automatically...
                </div>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#EF4444' : '#10B981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%) scale(0.9);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
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
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.activeModal = modal;
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Enhanced open animation
        const container = modal.querySelector('.modal-container, .video-modal-content');
        if (container) {
            container.style.transform = 'scale(0.8) translateY(60px)';
            container.style.opacity = '0';
            
            setTimeout(() => {
                container.style.transform = 'scale(1) translateY(0)';
                container.style.opacity = '1';
            }, 100);
        }
        
        // For video modal, set video source
        if (modalId === 'videoModal') {
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
            }
        }
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        // Enhanced close animation
        const container = modal.querySelector('.modal-container, .video-modal-content');
        if (container) {
            container.style.transform = 'scale(0.9) translateY(30px)';
            container.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            this.activeModal = null;
        }, 300);
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
 * Services Section Controller
 */
class ServicesController {
    constructor() {
        this.element = document.querySelector('.services-section');
        this.serviceItems = document.querySelectorAll('.service-item');
        this.servicesBooking = document.getElementById('servicesBooking');
        this.servicesCatalog = document.getElementById('servicesCatalog');
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('💼 Initializing enhanced services section');
        
        this.initServiceInteractions();
        this.initCTAButtons();
        this.observeAnimations();
    }
    
    initServiceInteractions() {
        this.serviceItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const service = item.dataset.service;
                if (service) {
                    this.handleServiceSelection(service);
                }
            });
            
            // Enhanced hover effects
            item.addEventListener('mouseenter', () => {
                this.animateServiceItem(item, 'enter');
            });
            
            item.addEventListener('mouseleave', () => {
                this.animateServiceItem(item, 'leave');
            });
        });
    }
    
    animateServiceItem(item, state) {
        const arrow = item.querySelector('.service-arrow');
        const features = item.querySelectorAll('.feature-tag');
        
        if (state === 'enter') {
            item.style.transform = 'translateX(12px) translateY(-3px)';
            if (arrow) {
                arrow.style.transform = 'translateX(8px) scale(1.2)';
            }
            features.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                }, index * 50);
            });
        } else {
            item.style.transform = 'translateX(0) translateY(0)';
            if (arrow) {
                arrow.style.transform = 'translateX(0) scale(1)';
            }
            features.forEach(tag => {
                tag.style.transform = 'scale(1)';
            });
        }
    }
    
    handleServiceSelection(service) {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            const serviceSelect = modal.querySelector('#service');
            if (serviceSelect) {
                const optionMap = {
                    'hydrafacial': 'facial',
                    'microneedling': 'facial',
                    'peels': 'facial',
                    'led': 'facial',
                    'coolsculpting': 'body',
                    'emsculpt': 'body',
                    'morpheus': 'body',
                    'cellulite': 'body',
                    'botox': 'injectable',
                    'fillers': 'injectable',
                    'sculptra': 'injectable',
                    'prp': 'injectable'
                };
                
                const category = optionMap[service] || 'consultation';
                serviceSelect.value = category;
            }
            
            EviaApp.components.modals?.openModal('appointmentModal');
        }
    }
    
    initCTAButtons() {
        if (this.servicesBooking) {
            this.servicesBooking.addEventListener('click', (e) => {
                e.preventDefault();
                EviaApp.components.modals?.openModal('appointmentModal');
            });
        }
        
        if (this.servicesCatalog) {
            this.servicesCatalog.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Treatment guide download will be available soon!', 'info');
            });
        }
    }
    
    observeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.classList.contains('service-category')) {
                        this.animateServiceCategory(element);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        const categories = document.querySelectorAll('.service-category');
        categories.forEach(category => observer.observe(category));
    }
    
    animateServiceCategory(category) {
        const icon = category.querySelector('.category-icon');
        const items = category.querySelectorAll('.service-item');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 600);
        }
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    showNotification(message, type = 'info') {
        EviaApp.components.modals?.showNotification(message, type);
    }
}

/**
 * About Section Controller
 */
class AboutController {
    constructor() {
        this.element = document.querySelector('.about-section-new');
        this.statNumbers = document.querySelectorAll('.stat-number-new');
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('👩‍⚕️ Initializing enhanced about section');
        
        this.initStatsCounter();
        this.observeAnimations();
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = 1500;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 300);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.quick-stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    observeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.classList.contains('doctor-card')) {
                        this.animateDoctorCard(element);
                    } else if (element.classList.contains('expertise-card')) {
                        this.animateExpertiseCard(element);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        const cards = document.querySelectorAll('.doctor-card, .expertise-card');
        cards.forEach(card => observer.observe(card));
    }
    
    animateDoctorCard(card) {
        const image = card.querySelector('.doctor-photo-new');
        const badges = card.querySelectorAll('.floating-badge');
        
        if (image) {
            image.style.transform = 'scale(1.02)';
            setTimeout(() => {
                image.style.transform = 'scale(1)';
            }, 800);
        }
        
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0) scale(1)';
            }, index * 200 + 300);
        });
    }
    
    animateExpertiseCard(card) {
        const icon = card.querySelector('.expertise-icon-new');
        
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        }
    }
}

/**
 * Main Application Controller
 */
class EviaApplication {
    constructor() {
        this.isLoading = true;
        this.components = {};
        this.loadStartTime = performance.now();
        
        this.init();
    }
    
    init() {
        console.log('🏢 Initializing Evia Aesthetics Application...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    initApp() {
        try {
            // Initialize animation system first
            this.components.animations = new AnimationController();
            
            // Initialize preloader
            this.components.preloader = new PreloaderController();
            
            // Initialize other core components
            this.components.header = new HeaderController();
            this.components.mobileMenu = new ModernMobileMenuController();
            this.components.modals = new ModalController();
            
            // Initialize content sections
            this.components.hero = new HeroController();
            this.components.about = new AboutController();
            this.components.services = new ServicesController();
            
            // Bind global events
            this.bindGlobalEvents();
            
            // Store components globally
            EviaApp.components = this.components;
            
            const loadTime = performance.now() - this.loadStartTime;
            console.log(`✅ Evia application initialized successfully in ${loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    bindGlobalEvents() {
        // Enhanced resize handler
        window.addEventListener('resize', this.debounce(() => {
            EviaApp.isMobile = window.innerWidth <= 768;
            
            // Refresh intersection observers
            if (this.components.animations) {
                this.components.animations.setupObservers();
            }
        }, 250));
        
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
            const loadTime = performance.now() - this.loadStartTime;
            console.log(`🚀 Full page load completed in ${loadTime.toFixed(2)}ms`);
        });
        
        // Error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }
    
    pauseAnimations() {
        const video = document.querySelector('.hero-video');
        if (video && !video.paused) {
            video.pause();
        }
        
        // Pause other animations if needed
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    }
    
    resumeAnimations() {
        const video = document.querySelector('.hero-video');
        if (video && video.paused) {
            video.play().catch(e => {
                console.log('Video resume failed:', e);
            });
        }
        
        // Resume other animations
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.EviaApp = new EviaApplication();
});

// Global utility functions
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
    }
};

console.log('🚀 Evia Aesthetics JavaScript loaded successfully!');
