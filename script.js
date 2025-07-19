// Evia Aesthetics - Complete Redesigned JavaScript

'use strict';

// Global Application State
const EviaApp = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    components: {},
    animations: {
        gsap: null,
        timeline: null
    }
};

/**
 * Utility Functions
 */
const Utils = {
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
        };
    },

    // Smooth scroll to element
    scrollToElement: (selector, offset = 80) => {
        const element = document.querySelector(selector);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
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

    // Generate random number
    random: (min, max) => Math.random() * (max - min) + min,

    // Format phone number
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    }
};

/**
 * Preloader Controller (Enhanced)
 */
class PreloaderController {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.progress = 0;
        this.isComplete = false;
        this.loadingSteps = [
            'Initializing Experience...',
            'Loading Assets...',
            'Preparing Interface...',
            'Almost Ready...'
        ];
        this.currentStep = 0;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🔄 Initializing enhanced preloader');
        
        // Add no-scroll class to body
        document.body.classList.add('no-scroll');
        
        // Start progress animation
        this.animateProgress();
        
        // Animate loading messages
        this.animateLoadingMessages();
        
        // Check page load status
        this.checkPageReady();
        
        // Fallback timer
        this.fallbackTimer = setTimeout(() => {
            if (!this.isComplete) {
                console.log('⏰ Preloader fallback triggered');
                this.complete();
            }
        }, 4000);
    }
    
    animateProgress() {
        const duration = 3000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const targetProgress = Math.min((elapsed / duration) * 85, 85);
            
            // Smooth easing
            const easedProgress = this.easeOutCubic(targetProgress / 85) * 85;
            
            this.updateProgress(easedProgress);
            
            if (targetProgress < 85) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateLoadingMessages() {
        const messageElement = this.element.querySelector('.loading-message');
        if (!messageElement) return;

        const updateMessage = () => {
            if (this.isComplete) return;
            
            messageElement.style.opacity = '0';
            
            setTimeout(() => {
                if (this.currentStep < this.loadingSteps.length) {
                    messageElement.textContent = this.loadingSteps[this.currentStep];
                    messageElement.style.opacity = '1';
                    this.currentStep++;
                }
            }, 300);
            
            if (this.currentStep < this.loadingSteps.length) {
                setTimeout(updateMessage, 800);
            }
        };

        setTimeout(updateMessage, 500);
    }
    
    checkPageReady() {
        if (document.readyState === 'complete') {
            setTimeout(() => this.complete(), 1000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.complete(), 1000);
            });
        }
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
        
        // Complete progress
        this.updateProgress(100);
        
        // Enhanced exit animation
        setTimeout(() => {
            if (this.element) {
                this.element.style.transform = 'scale(1.1)';
                this.element.style.opacity = '0';
                
                setTimeout(() => {
                    this.element.classList.add('hidden');
                    document.body.classList.remove('no-scroll');
                    
                    // Initialize main app with entrance animation
                    setTimeout(() => {
                        this.onComplete();
                    }, 200);
                }, 500);
            }
        }, 300);
        
        console.log('✅ Enhanced preloader completed');
    }
    
    onComplete() {
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        EviaApp.isLoaded = true;
        
        // Trigger entrance animations
        this.triggerEntranceAnimations();
    }

    triggerEntranceAnimations() {
        // Animate hero elements if GSAP is available
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            tl.from('.hero-content > *', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
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
        this.lastScrollY = 0;
        this.scrollThreshold = 60;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('📱 Initializing enhanced header');
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollSpy();
        this.initDropdownInteractions();
    }
    
    bindEvents() {
        const throttledScroll = Utils.throttle(this.handleScroll.bind(this), 16);
        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        const debouncedResize = Utils.debounce(this.handleResize.bind(this), 250);
        window.addEventListener('resize', debouncedResize);
        
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

    initDropdownInteractions() {
        const dropdown = document.querySelector('.dropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (!dropdown || !dropdownMenu) return;

        let hoverTimeout;

        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            if (typeof gsap !== 'undefined') {
                gsap.to(dropdownMenu, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(dropdownMenu, {
                        opacity: 0,
                        y: 10,
                        visibility: 'hidden',
                        duration: 0.2,
                        ease: 'power2.in'
                    });
                }
            }, 100);
        });

        // Service item interactions
        const serviceItems = dropdownMenu.querySelectorAll('.service-column a');
        serviceItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const service = item.dataset.service;
                if (service) {
                    this.navigateToService(service);
                }
            });
        });
    }

    navigateToService(service) {
        // Close dropdown
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu && typeof gsap !== 'undefined') {
            gsap.to(dropdownMenu, {
                opacity: 0,
                y: 10,
                visibility: 'hidden',
                duration: 0.2
            });
        }

        // Navigate to services section and highlight specific service
        Utils.scrollToElement('#services', 100);
        
        setTimeout(() => {
            const serviceElement = document.querySelector(`[data-service="${service}"]`);
            if (serviceElement) {
                serviceElement.classList.add('highlight');
                setTimeout(() => {
                    serviceElement.classList.remove('highlight');
                }, 2000);
            }
        }, 500);
    }
    
    handleScroll() {
        if (this.ticking) return;
        
        this.ticking = true;
        
        requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            const shouldBeScrolled = scrollY > this.scrollThreshold;
            
            // Update scrolled state
            if (shouldBeScrolled !== this.isScrolled) {
                this.isScrolled = shouldBeScrolled;
                this.element.classList.toggle('scrolled', this.isScrolled);
                
                // Animate header transformation
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.element, {
                        backgroundColor: this.isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                        backdropFilter: this.isScrolled ? 'blur(20px)' : 'none',
                        duration: 0.3
                    });
                }
            }
            
            // Update scroll progress
            this.updateScrollProgress();
            
            // Update active navigation
            this.updateActiveNavigation();
            
            this.lastScrollY = scrollY;
            EviaApp.scrollY = scrollY;
            this.ticking = false;
        });
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
        });
    }
    
    navigateToSection(target, activeLink) {
        const element = document.querySelector(target);
        if (!element) return;
        
        // Update active state
        this.setActiveNav(activeLink);
        
        // Smooth scroll with offset
        const headerHeight = this.element.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        this.smoothScrollTo(targetPosition);
    }
    
    setActiveNav(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
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
                        document.querySelectorAll('.nav-dot').forEach(dot => dot.classList.remove('active'));
                        sideNavDot.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveNavigation() {
        // Additional navigation updates can be added here
    }
    
    scrollToTop() {
        this.smoothScrollTo(0);
    }
    
    smoothScrollTo(position) {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
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
        this.animationDuration = 0.6;
        
        this.init();
    }
    
    init() {
        if (!this.menu) return;
        
        console.log('📱 Initializing modern mobile menu');
        
        this.bindEvents();
        this.initNavigation();
        this.setupAnimations();
    }
    
    bindEvents() {
        // Toggle button
        if (this.toggle) {
            this.toggle.addEventListener('click', this.toggleMenu.bind(this));
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

        // Prevent scroll when menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.isOpen && !this.menu.contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupAnimations() {
        if (typeof gsap === 'undefined') return;

        // Set initial states
        gsap.set(this.menu, { x: '100%' });
        gsap.set(this.overlay, { opacity: 0, visibility: 'hidden' });
        
        if (this.navLinks.length) {
            gsap.set(this.navLinks, { x: 50, opacity: 0 });
        }
    }
    
    initNavigation() {
        this.navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(href, index);
                });
            }

            // Add hover effect
            link.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(link.querySelector('.nav-arrow'), {
                        x: 5,
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });

            link.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(link.querySelector('.nav-arrow'), {
                        x: -10,
                        opacity: 0,
                        duration: 0.3
                    });
                }
            });
        });
    }
    
    navigateTo(target, index) {
        // Animate out current link
        if (typeof gsap !== 'undefined') {
            const currentLink = this.navLinks[index];
            gsap.to(currentLink, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        }

        this.closeMenu();
        
        setTimeout(() => {
            Utils.scrollToElement(target, 100);
        }, this.animationDuration * 1000);
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
        this.toggle.classList.add('active');
        document.body.classList.add('no-scroll');
        
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            
            // Show overlay
            tl.to(this.overlay, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.3
            }, 0);
            
            // Slide in menu
            tl.to(this.menu, {
                x: '0%',
                duration: this.animationDuration,
                ease: 'power3.out'
            }, 0.1);
            
            // Animate nav items
            tl.to(this.navLinks, {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, 0.3);
            
            // Animate contact info
            const contactItems = this.menu.querySelectorAll('.contact-item, .social-link');
            tl.from(contactItems, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05
            }, 0.6);
        } else {
            // Fallback without GSAP
            this.overlay.classList.add('active');
            this.menu.classList.add('active');
        }
        
        console.log('📱 Modern mobile menu opened');
    }
    
    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.toggle.classList.remove('active');
        
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.classList.remove('no-scroll');
                }
            });
            
            // Animate out nav items
            tl.to(this.navLinks, {
                x: 50,
                opacity: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.in'
            }, 0);
            
            // Slide out menu
            tl.to(this.menu, {
                x: '100%',
                duration: this.animationDuration,
                ease: 'power3.in'
            }, 0.2);
            
            // Hide overlay
            tl.to(this.overlay, {
                opacity: 0,
                visibility: 'hidden',
                duration: 0.3
            }, 0.4);
        } else {
            // Fallback without GSAP
            this.overlay.classList.remove('active');
            this.menu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
        
        console.log('📱 Modern mobile menu closed');
    }
}

/**
 * Enhanced Hero Section Controller
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
        this.initParallaxEffect();
    }

    initParallaxEffect() {
        if (typeof gsap === 'undefined') return;

        // Parallax scroll effect for hero content
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to('.hero-content', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Floating animation for credentials
        gsap.to('.hero-credentials', {
            y: 10,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
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
            // Add fallback background
            this.element.style.background = 'linear-gradient(135deg, #442C15 0%, #FF9E18 100%)';
        });

        // Pause video when not visible (performance optimization)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (this.video) {
                    if (entry.isIntersecting) {
                        this.video.play().catch(e => console.log('Video play failed:', e));
                    } else {
                        this.video.pause();
                    }
                }
            });
        });

        observer.observe(this.element);
    }
    
    initTypingAnimation() {
        if (!this.typingElement) return;
        
        this.startTypingAnimation();
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
            
            // Add cursor effect
            this.typingElement.style.borderRight = '2px solid var(--evia-orange)';
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
                this.typingElement.style.borderRight = '2px solid transparent';
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.typingTexts.length;
                typeSpeed = 500; // Pause before next word
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
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            button.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Hero booking button
        if (this.heroBooking) {
            this.heroBooking.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButtonClick(this.heroBooking);
                setTimeout(() => this.openModal('appointmentModal'), 200);
            });
        }
        
        // Video play button
        if (this.videoPlay) {
            this.videoPlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButtonClick(this.videoPlay);
                setTimeout(() => this.openModal('videoModal'), 200);
            });
        }
        
        // Book with doctor button
        const bookWithDoctor = document.getElementById('bookWithDoctorNew');
        if (bookWithDoctor) {
            bookWithDoctor.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButtonClick(bookWithDoctor);
                setTimeout(() => this.openModal('appointmentModal'), 200);
            });
        }
    }

    animateButtonClick(button) {
        if (typeof gsap === 'undefined') return;
        
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                Utils.scrollToElement('#about', 100);
            }
        });
        
        // Hide on scroll with smooth animation
        const hideIndicator = Utils.throttle(() => {
            const scrollY = window.pageYOffset;
            const opacity = scrollY > 200 ? 0 : 1;
            const translateY = scrollY > 200 ? 20 : 0;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(this.scrollIndicator, {
                    opacity,
                    y: translateY,
                    duration: 0.3
                });
            } else {
                this.scrollIndicator.style.opacity = opacity;
                this.scrollIndicator.style.transform = `translateX(-50%) translateY(${translateY}px)`;
            }
        }, 16);
        
        window.addEventListener('scroll', hideIndicator, { passive: true });
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

            // Add hover effects
            dot.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(dot, {
                        scale: 1.3,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            dot.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(dot, {
                        scale: dot.classList.contains('active') ? 1.3 : 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }
    
    navigateToSection(target, activeDot) {
        const element = document.querySelector(target);
        if (!element) return;
        
        // Update active state with animation
        this.sideNavDots.forEach(dot => {
            dot.classList.remove('active');
            if (typeof gsap !== 'undefined') {
                gsap.to(dot, { scale: 1, duration: 0.3 });
            }
        });
        
        activeDot.classList.add('active');
        if (typeof gsap !== 'undefined') {
            gsap.to(activeDot, { scale: 1.3, duration: 0.3 });
        }
        
        // Smooth scroll
        const headerHeight = 80;
        let targetPosition;
        
        if (target === '#home') {
            targetPosition = 0;
        } else {
            targetPosition = element.offsetTop - headerHeight - 20;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 60; // 1 second animation at 60fps
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
                    
                    // Animate all counters with stagger
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                            
                            // Add pulse effect
                            if (typeof gsap !== 'undefined') {
                                gsap.from(counter.parentElement, {
                                    scale: 0.8,
                                    duration: 0.6,
                                    ease: 'back.out(1.7)',
                                    delay: index * 0.2
                                });
                            }
                        }, index * 200);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsContainer = document.querySelector('.hero-stats, .stats-container');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Enhanced modal entrance animation
            if (typeof gsap !== 'undefined') {
                const container = modal.querySelector('.modal-container, .video-modal-content');
                if (container) {
                    gsap.from(container, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'back.out(1.7)'
                    });
                }
            }
            
            // For video modal, set video source
            if (modalId === 'videoModal') {
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
                }
            }
        }
    }
}

/**
 * Enhanced About Section Controller
 */
class EnhancedAboutController {
    constructor() {
        this.element = document.querySelector('.about-section-new');
        this.statNumbers = document.querySelectorAll('.stat-number-new');
        this.expertiseCards = document.querySelectorAll('.expertise-card');
        this.doctorCard = document.querySelector('.doctor-card');
        this.experienceRing = document.querySelector('.ring-progress');
        
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('👩‍⚕️ Initializing enhanced about section');
        
        this.initScrollAnimations();
        this.initStatsCounter();
        this.initExpertiseCards();
        this.initDoctorCard();
        this.initParticleAnimation();
        this.initExperienceRing();
    }

    initScrollAnimations() {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Animate section elements as they come into view
        gsap.from('.section-header-new > *', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.section-header-new',
                start: 'top 80%',
                end: 'bottom 20%'
            }
        });

        // Animate about grid
        gsap.from('.about-grid > *', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            scrollTrigger: {
                trigger: '.about-grid',
                start: 'top 80%',
                end: 'bottom 20%'
            }
        });
    }

    initParticleAnimation() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Randomize initial position
            const randomX = Utils.random(10, 90);
            const randomY = Utils.random(10, 90);
            
            particle.style.left = `${randomX}%`;
            particle.style.top = `${randomY}%`;
            
            if (typeof gsap !== 'undefined') {
                // Create floating animation
                gsap.to(particle, {
                    y: Utils.random(-30, 30),
                    x: Utils.random(-20, 20),
                    rotation: Utils.random(0, 360),
                    duration: Utils.random(6, 12),
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.5
                });

                // Pulsing opacity
                gsap.to(particle, {
                    opacity: Utils.random(0.3, 0.8),
                    duration: Utils.random(2, 4),
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.2
                });
            }
        });
    }

    initExperienceRing() {
        if (!this.experienceRing) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (typeof gsap !== 'undefined') {
                        gsap.from(this.experienceRing, {
                            strokeDashoffset: 565,
                            duration: 2,
                            ease: 'power2.out',
                            delay: 0.5
                        });
                    }
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.experienceRing);
    }

    initDoctorCard() {
        if (!this.doctorCard) return;

        // 3D tilt effect
        this.doctorCard.addEventListener('mousemove', (e) => {
            if (typeof gsap === 'undefined') return;

            const rect = this.doctorCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(this.doctorCard.querySelector('.card-inner'), {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        this.doctorCard.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.doctorCard.querySelector('.card-inner'), {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    initExpertiseCards() {
        this.expertiseCards.forEach((card, index) => {
            // Hover animations
            card.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });

                    gsap.to(card.querySelector('.card-glow'), {
                        opacity: 0.3,
                        duration: 0.3
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });

                    gsap.to(card.querySelector('.card-glow'), {
                        opacity: 0,
                        duration: 0.3
                    });
                }
            });

            // Staggered entrance animation
            if (typeof gsap !== 'undefined') {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%'
                    }
                });
            }
        });
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 80;
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
                            
                            // Add entrance animation
                            if (typeof gsap !== 'undefined') {
                                gsap.from(counter.parentElement, {
                                    scale: 0.8,
                                    opacity: 0,
                                    duration: 0.5,
                                    ease: 'back.out(1.7)',
                                    delay: index * 0.1
                                });
                            }
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
}

/**
 * Enhanced Services Section Controller
 */
class EnhancedServicesController {
    constructor() {
        this.element = document.querySelector('.services-section');
        this.serviceCategories = document.querySelectorAll('.service-category');
        this.serviceItems = document.querySelectorAll('.service-item');
        this.servicesBooking = document.getElementById('servicesBooking');
        this.servicesCatalog = document.getElementById('servicesCatalog');
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('💼 Initializing enhanced services section');
        
        this.initScrollAnimations();
        this.initServiceInteractions();
        this.initCTAButtons();
        this.initBackgroundAnimations();
    }

    initScrollAnimations() {
        if (typeof gsap === 'undefined') return;

        // Animate services header
        gsap.from('.services-header > *', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.services-header',
                start: 'top 80%'
            }
        });

        // Animate service categories
        gsap.from('.service-category', {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 80%'
            }
        });

        // Animate CTA section
        gsap.from('.services-cta', {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.services-cta',
                start: 'top 80%'
            }
        });
    }

    initBackgroundAnimations() {
        if (typeof gsap === 'undefined') return;

        // Animate golden accent lines
        const accentLines = document.querySelectorAll('.accent-line');
        accentLines.forEach((line, index) => {
            gsap.to(line, {
                scaleX: 0,
                duration: 2,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.5
            });
        });
    }

    initServiceInteractions() {
        // Service category interactions
        this.serviceCategories.forEach((category, index) => {
            category.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(category, {
                        y: -15,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });

                    // Animate category icon
                    const icon = category.querySelector('.category-icon');
                    if (icon) {
                        gsap.to(icon, {
                            rotation: 5,
                            scale: 1.1,
                            duration: 0.3
                        });
                    }
                }
            });

            category.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(category, {
                        y: category.classList.contains('featured') ? -10 : 0,
                        boxShadow: category.classList.contains('featured') ? 
                            '0 25px 50px rgba(0, 0, 0, 0.25)' : '0 10px 15px rgba(0, 0, 0, 0.1)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });

                    const icon = category.querySelector('.category-icon');
                    if (icon) {
                        gsap.to(icon, {
                            rotation: 0,
                            scale: 1,
                            duration: 0.3
                        });
                    }
                }
            });
        });

        // Service item interactions
        this.serviceItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const service = item.dataset.service;
                if (service) {
                    this.handleServiceSelection(service, item);
                }
            });

            item.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(item, {
                        x: 10,
                        backgroundColor: '#FFF8F0',
                        duration: 0.3
                    });

                    const arrow = item.querySelector('.service-arrow');
                    if (arrow) {
                        gsap.to(arrow, {
                            x: 5,
                            scale: 1.1,
                            duration: 0.3
                        });
                    }
                }
            });

            item.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(item, {
                        x: 0,
                        backgroundColor: '#F5F5F5',
                        duration: 0.3
                    });

                    const arrow = item.querySelector('.service-arrow');
                    if (arrow) {
                        gsap.to(arrow, {
                            x: 0,
                            scale: 1,
                            duration: 0.3
                        });
                    }
                }
            });
        });
    }

    handleServiceSelection(service, item) {
        // Animate selection
        if (typeof gsap !== 'undefined') {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    // Open modal with pre-selected service
                    this.openServiceModal(service);
                }
            });
        } else {
            this.openServiceModal(service);
        }
    }

    openServiceModal(service) {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            // Pre-select the service in the form
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
            
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }

    initCTAButtons() {
        // Services booking button
        if (this.servicesBooking) {
            this.servicesBooking.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButtonClick(this.servicesBooking);
                setTimeout(() => {
                    const modal = document.getElementById('appointmentModal');
                    if (modal) {
                        modal.classList.add('active');
                        document.body.classList.add('no-scroll');
                    }
                }, 200);
            });
        }

        // Services catalog button
        if (this.servicesCatalog) {
            this.servicesCatalog.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButtonClick(this.servicesCatalog);
                setTimeout(() => {
                    this.downloadCatalog();
                }, 200);
            });
        }
    }

    animateButtonClick(button) {
        if (typeof gsap === 'undefined') return;
        
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }

    downloadCatalog() {
        // Simulate catalog download
        this.showNotification('Treatment guide download will be available soon!', 'info');
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
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

/**
 * Enhanced Modal System Controller
 */
class EnhancedModalController {
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
        
        // Enhanced form validation with real-time feedback
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });

            // Phone number formatting
            if (input.type === 'tel') {
                input.addEventListener('input', (e) => {
                    e.target.value = Utils.formatPhone(e.target.value);
                });
            }
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
            submitBtn.innerHTML = `
                <span>Sending Request...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(submitBtn, {
                    scale: 0.98,
                    duration: 0.1
                });
            }
        }
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to(submitBtn, {
                            scale: 1,
                            duration: 0.1
                        });
                    }
                }
                
                // Reset form
                form.reset();
                this.clearFormValidation(form);
            }, 3000);
        }, 2000);
    }

    clearFormValidation(form) {
        const groups = form.querySelectorAll('.form-group');
        groups.forEach(group => {
            group.classList.remove('error', 'valid');
        });
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
        
        // Visual feedback with animation
        const group = field.closest('.form-group');
        if (group) {
            group.classList.toggle('error', !isValid && value);
            group.classList.toggle('valid', isValid && value);
            
            if (typeof gsap !== 'undefined') {
                if (!isValid && value) {
                    gsap.to(field, {
                        x: -5,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 3
                    });
                }
            }
        }
        
        return isValid;
    }
    
    showSuccessMessage(form) {
        if (typeof gsap !== 'undefined') {
            gsap.to(form, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                onComplete: () => {
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
                            ">
                                <i class="fas fa-check"></i>
                            </div>
                            <h3 style="color: var(--evia-brown); margin-bottom: 1rem; font-size: 1.5rem;">Thank You!</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
                                Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                            </p>
                            <div style="font-size: 0.875rem; color: var(--evia-orange); font-style: italic;">
                                This window will close automatically...
                            </div>
                        </div>
                    `;
                    
                    gsap.from(form, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.5,
                        ease: 'back.out(1.7)'
                    });
                }
            });
        } else {
            // Fallback without GSAP
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
                    ">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 style="color: var(--evia-brown); margin-bottom: 1rem; font-size: 1.5rem;">Thank You!</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
                        Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                    </p>
                    <div style="font-size: 0.875rem; color: var(--evia-orange); font-style: italic;">
                        This window will close automatically...
                    </div>
                </div>
            `;
        }
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
            transform: translateX(100%);
            transition: all 0.3s ease;
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
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        if (typeof gsap !== 'undefined') {
            const container = modal.querySelector('.modal-container, .video-modal-content');
            if (container) {
                gsap.to(container, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        modal.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                });
            }
        } else {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
        
        this.activeModal = null;
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active, .video-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }
}

/**
 * Enhanced Animations Controller
 */
class EnhancedAnimationsController {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('✨ Initializing enhanced animations');
        
        this.initAOS();
        this.initGSAP();
        this.initScrollTriggers();
        this.initInteractionObservers();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120,
                delay: 0,
                disable: EviaApp.isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
            
            // Refresh on window load
            window.addEventListener('load', () => {
                setTimeout(() => AOS.refresh(), 300);
            });
        }
    }

    initGSAP() {
        if (typeof gsap === 'undefined') return;

        // Register plugins
        gsap.registerPlugin(ScrollTrigger);

        // Set up global animation defaults
        gsap.defaults({
            duration: 0.6,
            ease: 'power2.out'
        });

        // Create global timeline
        EviaApp.animations.timeline = gsap.timeline();
    }

    initScrollTriggers() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // Parallax effects
        gsap.utils.toArray('.manhattan-bg, .services-bg').forEach(bg => {
            gsap.to(bg, {
                yPercent: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Stagger animations for grids
        gsap.utils.toArray('.expertise-grid-new, .services-grid').forEach(grid => {
            const items = grid.children;
            gsap.from(items, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%'
                }
            });
        });
    }
    
    initInteractionObservers() {
        // Animate elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Trigger custom animations
                    if (typeof gsap !== 'undefined') {
                        gsap.from(entry.target, {
                            y: 30,
                            opacity: 0,
                            duration: 0.6,
                            ease: 'power2.out'
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToObserve = document.querySelectorAll(
            '.expertise-item, .credential-item, .stat-item, .service-item'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0
        };
        
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`📊 Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });

        // Monitor largest contentful paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log(`🎨 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    logInteraction(action) {
        console.log(`🔗 User interaction: ${action} at ${performance.now().toFixed(2)}ms`);
    }
}

/**
 * Main Enhanced Application Controller
 */
class EnhancedEviaApplication {
    constructor() {
        this.isLoading = true;
        this.components = {};
        this.performanceMonitor = new PerformanceMonitor();
        
        this.init();
    }
    
    init() {
        console.log('🏢 Initializing Enhanced Evia Aesthetics Application...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    initApp() {
        try {
            // Initialize preloader first
            this.components.preloader = new PreloaderController();
            
            // Initialize other components after preloader completes
            window.addEventListener('preloaderComplete', () => {
                this.onPreloaderComplete();
            });
            
            // Initialize header and mobile menu immediately
            this.components.header = new HeaderController();
            this.components.mobileMenu = new ModernMobileMenuController();
            this.components.modals = new EnhancedModalController();
            
            // Bind global events
            this.bindGlobalEvents();
            
            console.log('✅ Enhanced Evia application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize remaining components with staggered loading
        const componentLoadOrder = [
            () => { this.components.hero = new HeroController(); },
            () => { this.components.aboutNew = new EnhancedAboutController(); },
            () => { this.components.servicesNew = new EnhancedServicesController(); },
            () => { this.components.animations = new EnhancedAnimationsController(); }
        ];

        componentLoadOrder.forEach((loadComponent, index) => {
            setTimeout(loadComponent, index * 100);
        });
        
        console.log('🎬 Post-preloader components initialized');
        
        // Log performance metrics
        this.performanceMonitor.logInteraction('App fully loaded');
    }
    
    bindGlobalEvents() {
        // Enhanced resize handler
        const debouncedResize = Utils.debounce(() => {
            EviaApp.isMobile = window.innerWidth <= 768;
            
            // Refresh AOS if available
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 300);
            }

            // Refresh GSAP ScrollTrigger if available
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Enhanced error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.performanceMonitor.logInteraction(`Error: ${event.error.message}`);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });

        // Performance monitoring
        window.addEventListener('click', (event) => {
            if (event.target.closest('button, a, [role="button"]')) {
                this.performanceMonitor.logInteraction(`Click: ${event.target.textContent?.trim() || event.target.tagName}`);
            }
        });
    }
    
    pauseAnimations() {
        // Pause video if playing
        const video = document.querySelector('.hero-video');
        if (video && !video.paused) {
            video.pause();
        }

        // Pause GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    }
    
    resumeAnimations() {
        // Resume video if it was playing
        const video = document.querySelector('.hero-video');
        if (video && video.paused) {
            video.play().catch(e => {
                console.log('Video resume failed:', e);
            });
        }

        // Resume GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
    }
    
    handleInitError() {
        // Remove preloader and loading class
        document.body.classList.remove('no-scroll');
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
    
    // Enhanced utility methods
    scrollToElement(selector, offset = 80) {
        Utils.scrollToElement(selector, offset);
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && this.components.modals) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && this.components.modals) {
            this.components.modals.closeModal(modal);
        }
    }
}

// Initialize the enhanced application
document.addEventListener('DOMContentLoaded', () => {
    window.EviaApp = new EnhancedEviaApplication();
});

// Enhanced global utility functions
window.EviaUtils = {
    ...Utils,
    
    openModal: (modalId) => {
        if (window.EviaApp) {
            window.EviaApp.openModal(modalId);
        }
    },
    
    closeModal: (modalId) => {
        if (window.EviaApp) {
            window.EviaApp.closeModal(modalId);
        }
    },

    // Add service highlighting utility
    highlightService: (service) => {
        const serviceElement = document.querySelector(`[data-service="${service}"]`);
        if (serviceElement) {
            serviceElement.classList.add('highlight');
            Utils.scrollToElement(`[data-service="${service}"]`, 100);
            
            setTimeout(() => {
                serviceElement.classList.remove('highlight');
            }, 3000);
        }
    }
};

// Add highlight animation styles
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .highlight {
        animation: highlight-pulse 2s ease-in-out;
        border-color: var(--evia-orange) !important;
        background: rgba(255, 158, 24, 0.1) !important;
    }
    
    @keyframes highlight-pulse {
        0%, 100% { 
            box-shadow: 0 0 0 0 rgba(255, 158, 24, 0.4);
        }
        50% { 
            box-shadow: 0 0 0 10px rgba(255, 158, 24, 0);
        }
    }
    
    .in-view {
        animation: enhancedFadeInUp 0.8s ease-out;
    }
    
    @keyframes enhancedFadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Form validation styles */
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .form-group.valid input,
    .form-group.valid select,
    .form-group.valid textarea {
        border-color: #10B981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
`;

document.head.appendChild(enhancedStyles);

console.log('🚀 Enhanced Evia Aesthetics JavaScript loaded successfully!');
