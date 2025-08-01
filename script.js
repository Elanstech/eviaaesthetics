/* ========================================
   EVIA AESTHETICS - CINEMATIC LUXURY JAVASCRIPT
   ======================================== */

'use strict';

// ========================================
// GLOBAL APPLICATION OBJECT
// ========================================

const EviaLuxury = {
    // Application state
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth <= 1024,
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
    
    // Component instances
    components: {},
    
    // Settings
    settings: {
        preloaderMinTime: 3000,
        scrollThreshold: 80,
        animationDuration: 1000,
        easing: 'power2.out',
        particleCount: 50,
        magneticStrength: 0.3
    },
    
    // Utility functions
    utils: {
        // Debounce function
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
        
        // Throttle function
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
        smoothScrollTo: (target, offset = 120) => {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (!element) return;
            
            const targetPosition = element.offsetTop - offset;
            
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: targetPosition,
                    autoKill: true
                },
                ease: "power2.out"
            });
        },
        
        // Check if element is in viewport
        isInViewport: (element, threshold = 0.1) => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top < windowHeight * (1 + threshold) &&
                rect.bottom > windowHeight * -threshold &&
                rect.left < windowWidth * (1 + threshold) &&
                rect.right > windowWidth * -threshold
            );
        },
        
        // Random number generator
        random: (min, max) => Math.random() * (max - min) + min,
        
        // Map number from one range to another
        map: (num, in_min, in_max, out_min, out_max) => {
            return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        },
        
        // Magnetic effect for elements
        addMagneticEffect: (element, strength = 0.3) => {
            if (!element || EviaLuxury.isMobile) return;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(element, {
                    duration: 0.3,
                    x: x * strength,
                    y: y * strength,
                    scale: 1.05,
                    ease: "power2.out"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    scale: 1,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        },
        
        // Show notification
        showNotification: (message, type = 'success', duration = 4000) => {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'error-warning-line' : 'information-line'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            // Add styles
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                zIndex: '10000',
                transform: 'translateX(400px)',
                opacity: '0',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            });
            
            document.body.appendChild(notification);
            
            // Animate in
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            });
            
            // Auto remove
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }
};

// ========================================
// LUXURY PRELOADER CLASS
// ========================================

class LuxuryPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.loadingFill = document.getElementById('loadingFill');
        this.loadingPercent = document.querySelector('.loading-percent');
        this.loadingStatus = document.querySelector('.loading-status');
        this.startTime = Date.now();
        this.progress = 0;
        this.isComplete = false;
        
        this.statusMessages = [
            'Initializing Experience...',
            'Loading Luxury Assets...',
            'Preparing Beauty Treatments...',
            'Setting Up Consultation...',
            'Almost Ready...',
            'Welcome to Excellence'
        ];
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        // Prevent scrolling
        document.body.classList.add('no-scroll');
        
        // Initialize particles
        this.initParticles();
        
        // Start progress animation
        this.animateProgress();
        
        // Check assets loaded
        this.checkAssetsLoaded();
        
        // Minimum loading time
        setTimeout(() => {
            this.checkComplete();
        }, EviaLuxury.settings.preloaderMinTime);
        
        // Maximum loading time (fallback)
        setTimeout(() => {
            if (!this.isComplete) {
                this.complete();
            }
        }, 8000);
    }
    
    initParticles() {
        const particlesContainer = document.getElementById('preloaderParticles');
        if (particlesContainer && typeof particlesJS !== 'undefined') {
            particlesJS('preloaderParticles', {
                particles: {
                    number: { value: 30, density: { enable: true, value_area: 800 } },
                    color: { value: "#FF9E18" },
                    shape: { type: "circle" },
                    opacity: { value: 0.3, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false } } },
                retina_detect: true
            });
        }
    }
    
    animateProgress() {
        const progressInterval = setInterval(() => {
            this.progress += EviaLuxury.utils.random(8, 15);
            this.progress = Math.min(this.progress, 95);
            
            this.updateProgress();
            
            if (this.progress >= 95 || this.isComplete) {
                clearInterval(progressInterval);
                if (this.isComplete) {
                    this.finalizeProgress();
                }
            }
        }, 200);
    }
    
    updateProgress() {
        if (this.loadingFill) {
            gsap.to(this.loadingFill, {
                duration: 0.5,
                width: `${this.progress}%`,
                ease: "power2.out"
            });
        }
        
        if (this.loadingPercent) {
            gsap.to({ value: parseInt(this.loadingPercent.textContent) || 0 }, {
                duration: 0.5,
                value: Math.floor(this.progress),
                ease: "power2.out",
                onUpdate: function() {
                    this.targets()[0].value = Math.floor(this.vars.value);
                    if (EviaLuxury.components.preloader.loadingPercent) {
                        EviaLuxury.components.preloader.loadingPercent.textContent = `${Math.floor(this.vars.value)}%`;
                    }
                }
            });
        }
        
        // Update status message
        const statusIndex = Math.floor((this.progress / 100) * (this.statusMessages.length - 1));
        if (this.loadingStatus && this.statusMessages[statusIndex]) {
            this.loadingStatus.textContent = this.statusMessages[statusIndex];
        }
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
        
        if (totalAssets === 0) {
            this.assetsReady = true;
        }
    }
    
    checkComplete() {
        const timePassed = Date.now() - this.startTime;
        
        if (this.assetsReady && timePassed >= EviaLuxury.settings.preloaderMinTime && !this.isComplete) {
            this.complete();
        }
    }
    
    finalizeProgress() {
        this.progress = 100;
        this.updateProgress();
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        this.finalizeProgress();
        
        // Final animation
        const tl = gsap.timeline({
            onComplete: () => {
                this.element.style.display = 'none';
                document.body.classList.remove('no-scroll');
                document.body.classList.add('page-loaded');
                this.onComplete();
            }
        });
        
        tl.to(this.element, {
            duration: 1,
            opacity: 0,
            scale: 1.1,
            ease: "power2.out"
        });
    }
    
    onComplete() {
        // Initialize all components
        EviaLuxury.isLoaded = true;
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 100
            });
        }
        
        // Start hero animations
        if (EviaLuxury.components.hero) {
            EviaLuxury.components.hero.startAnimations();
        }
        
        // Trigger loaded event
        window.dispatchEvent(new CustomEvent('evia-loaded'));
        
        console.log('✨ Evia Luxury Experience Loaded Successfully');
    }
}

// ========================================
// CINEMATIC HEADER CLASS
// ========================================

class CinematicHeader {
    constructor() {
        this.element = document.getElementById('header');
        this.progressFill = document.getElementById('scrollProgress');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.logoContainer = document.querySelector('.logo-container');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.bindEvents();
        this.initNavigation();
        this.initMagneticEffects();
        this.updateScrollProgress();
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
        
        // Logo click - scroll to top
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
        
        // Header booking button
        const headerBooking = document.getElementById('headerBooking');
        if (headerBooking) {
            headerBooking.addEventListener('click', () => {
                if (EviaLuxury.components.modal) {
                    EviaLuxury.components.modal.openBookingModal();
                }
            });
        }
        
        // Contact bubble click
        const contactBubble = document.querySelector('.contact-bubble');
        if (contactBubble) {
            contactBubble.addEventListener('click', (e) => {
                e.preventDefault();
                EviaLuxury.utils.smoothScrollTo('#contact');
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
                    this.setActiveNav(href.substring(1));
                });
            }
        });
    }
    
    initMagneticEffects() {
        // Add magnetic effects to interactive elements
        const magneticElements = [
            '.logo-container',
            '.contact-bubble',
            '.primary-cta'
        ];
        
        magneticElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                EviaLuxury.utils.addMagneticEffect(element, 0.2);
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > EviaLuxury.settings.scrollThreshold;
        
        // Update header state
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.element.classList.toggle('scrolled', this.isScrolled);
        }
        
        // Update scroll progress
        this.updateScrollProgress();
        
        // Update active navigation
        this.updateActiveNav();
        
        // Header animation based on scroll direction
        if (scrollY > this.lastScrollY + 10 && scrollY > 200) {
            // Scrolling down
            gsap.to(this.element, {
                duration: 0.3,
                y: -20,
                ease: "power2.out"
            });
        } else if (scrollY < this.lastScrollY - 10) {
            // Scrolling up
            gsap.to(this.element, {
                duration: 0.3,
                y: 0,
                ease: "power2.out"
            });
        }
        
        this.lastScrollY = scrollY;
        EviaLuxury.scrollY = scrollY;
    }
    
    updateScrollProgress() {
        if (!this.progressFill) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        gsap.set(this.progressFill, {
            width: `${Math.min(progress, 100)}%`
        });
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
        EviaLuxury.utils.smoothScrollTo(target);
    }
    
    scrollToTop() {
        gsap.to(window, {
            duration: 2,
            scrollTo: { y: 0 },
            ease: "power2.out"
        });
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
        this.navItems = document.querySelectorAll('.mobile-nav-item');
        
        this.isOpen = false;
        this.timeline = null;
        
        this.init();
    }
    
    init() {
        if (!this.menu || !this.toggle) return;
        
        this.bindEvents();
        this.initAnimations();
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
        
        // Navigation items
        this.navItems.forEach((item, index) => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMenu();
                    setTimeout(() => {
                        EviaLuxury.utils.smoothScrollTo(href);
                    }, 300);
                });
            }
            
            // Add magnetic effect
            EviaLuxury.utils.addMagneticEffect(item, 0.15);
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Mobile CTA button
        const mobileCTA = document.querySelector('.mobile-book-btn');
        if (mobileCTA) {
            mobileCTA.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    if (EviaLuxury.components.modal) {
                        EviaLuxury.components.modal.openBookingModal();
                    }
                }, 300);
            });
        }
    }
    
    initAnimations() {
        // Set initial states
        gsap.set(this.menu, { x: '100%' });
        gsap.set(this.overlay, { opacity: 0, visibility: 'hidden' });
        gsap.set(this.navItems, { x: 50, opacity: 0 });
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
        
        // Toggle animation
        this.toggle.classList.add('active');
        
        // Menu animation
        this.timeline = gsap.timeline();
        
        this.timeline
            .set(this.overlay, { visibility: 'visible' })
            .to(this.overlay, {
                duration: 0.3,
                opacity: 1,
                ease: "power2.out"
            })
            .to(this.menu, {
                duration: 0.5,
                x: '0%',
                ease: "power3.out"
            }, 0.1)
            .to(this.navItems, {
                duration: 0.4,
                x: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "power2.out"
            }, 0.3);
    }
    
    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.toggle.classList.remove('active');
        
        // Close animation
        this.timeline = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('no-scroll');
            }
        });
        
        this.timeline
            .to(this.navItems, {
                duration: 0.2,
                x: 50,
                opacity: 0,
                stagger: 0.05,
                ease: "power2.in"
            })
            .to(this.menu, {
                duration: 0.4,
                x: '100%',
                ease: "power3.in"
            }, 0.1)
            .to(this.overlay, {
                duration: 0.3,
                opacity: 0,
                ease: "power2.out"
            }, 0.2)
            .set(this.overlay, { visibility: 'hidden' });
    }
}

// ========================================
// CINEMATIC HERO CLASS
// ========================================

class CinematicHero {
    constructor() {
        this.hero = document.querySelector('.cinematic-hero');
        this.video = document.querySelector('.hero-video');
        this.dynamicText = document.getElementById('dynamicText');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.primaryCTA = document.querySelector('.hero-primary-cta');
        this.secondaryCTA = document.querySelector('.hero-secondary-cta');
        this.statNumbers = document.querySelectorAll('[data-count], [data-target]');
        this.quickBookingForm = document.getElementById('quickBookingForm');
        this.floatingOrbs = document.querySelectorAll('.float-orb');
        
        this.statsAnimated = false;
        this.typedInstance = null;
        this.particlesInitialized = false;
        
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        this.initVideo();
        this.initButtons();
        this.initScrollIndicator();
        this.initQuickBooking();
        this.initParticles();
        this.initFloatingOrbs();
        this.initBeforeAfterSliders();
        this.observeStats();
        this.initMagneticEffects();
    }
    
    initVideo() {
        if (!this.video) return;
        
        // Video optimization
        this.video.addEventListener('loadeddata', () => {
            this.video.classList.add('loaded');
            console.log('Hero video loaded successfully');
        });
        
        this.video.addEventListener('error', () => {
            console.warn('Hero video failed to load, using fallback');
            this.hero.style.background = 'linear-gradient(135deg, #1A1A1A 0%, #442C15 100%)';
        });
        
        // Ensure video plays
        const playVideo = () => {
            if (this.video.paused) {
                this.video.play().catch((error) => {
                    console.warn('Video autoplay prevented:', error);
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
        }, { threshold: 0.5 });
        
        observer.observe(this.video);
        
        // Page visibility API
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.video.pause();
            } else {
                playVideo();
            }
        });
    }
    
    initButtons() {
        // Primary CTA button
        if (this.primaryCTA) {
            EviaLuxury.utils.addMagneticEffect(this.primaryCTA, 0.4);
            
            this.primaryCTA.addEventListener('click', () => {
                if (EviaLuxury.components.modal) {
                    EviaLuxury.components.modal.openBookingModal();
                }
            });
            
            // Add ripple effect
            this.addRippleEffect(this.primaryCTA);
        }
        
        // Secondary CTA button
        if (this.secondaryCTA) {
            EviaLuxury.utils.addMagneticEffect(this.secondaryCTA, 0.3);
            
            this.secondaryCTA.addEventListener('click', () => {
                this.playVirtualTour();
            });
        }
        
        // Add magnetic effects to other CTA elements
        const ctaElements = document.querySelectorAll('.trust-item, .service-item, .gallery-btn');
        ctaElements.forEach(element => {
            EviaLuxury.utils.addMagneticEffect(element, 0.15);
        });
    }
    
    addRippleEffect(button) {
        button.addEventListener('click', (e) => {
            const ripple = button.querySelector('.cta-ripple');
            if (!ripple) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            gsap.set(ripple, {
                left: x,
                top: y,
                scale: 0,
                opacity: 1
            });
            
            gsap.to(ripple, {
                duration: 0.6,
                scale: 4,
                opacity: 0,
                ease: "power2.out"
            });
        });
    }
    
    playVirtualTour() {
        // Create modal for virtual tour or redirect
        const tourURL = 'https://www.youtube.com/watch?v=spa-tour';
        window.open(tourURL, '_blank', 'width=1200,height=800');
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            EviaLuxury.utils.smoothScrollTo('#services');
        });
        
        // Hide on scroll with parallax effect
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to(this.scrollIndicator, {
            scrollTrigger: {
                trigger: this.hero,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 100,
            opacity: 0,
            ease: "none"
        });
    }
    
    initQuickBooking() {
        if (!this.quickBookingForm) return;
        
        this.quickBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickBooking();
        });
        
        // Add magnetic effect to submit button
        const submitBtn = this.quickBookingForm.querySelector('.submit-btn');
        if (submitBtn) {
            EviaLuxury.utils.addMagneticEffect(submitBtn, 0.2);
        }
        
        // Form field animations
        const formFields = this.quickBookingForm.querySelectorAll('input, select');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                gsap.to(field, {
                    duration: 0.3,
                    y: -2,
                    boxShadow: '0 8px 25px rgba(255, 158, 24, 0.15)',
                    ease: "power2.out"
                });
            });
            
            field.addEventListener('blur', () => {
                gsap.to(field, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    ease: "power2.out"
                });
            });
        });
    }
    
    handleQuickBooking() {
        const formData = new FormData(this.quickBookingForm);
        const data = Object.fromEntries(formData);
        
        // Validation
        const requiredFields = ['serviceSelect', 'dateSelect', 'phoneInput'];
        const isValid = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim();
        });
        
        if (!isValid) {
            EviaLuxury.utils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Submit animation
        const submitBtn = this.quickBookingForm.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span> <i class="ri-loader-4-line"></i>';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Confirmed!</span> <i class="ri-check-line"></i>';
            EviaLuxury.utils.showNotification('Booking confirmed! We\'ll contact you shortly.', 'success');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                this.quickBookingForm.reset();
            }, 3000);
        }, 2000);
        
        console.log('Quick booking submitted:', data);
    }
    
    initParticles() {
        const particlesContainer = document.getElementById('heroParticles');
        if (particlesContainer && typeof particlesJS !== 'undefined') {
            particlesJS('heroParticles', {
                particles: {
                    number: { value: EviaLuxury.settings.particleCount, density: { enable: true, value_area: 1200 } },
                    color: { value: ["#FF9E18", "#442C15", "#FFF8F0"] },
                    shape: { type: "circle" },
                    opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
                    size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.5 } },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: true, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" }
                    },
                    modes: {
                        repulse: { distance: 100, duration: 0.4 },
                        push: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            });
            
            this.particlesInitialized = true;
        }
    }
    
    initFloatingOrbs() {
        this.floatingOrbs.forEach((orb, index) => {
            // Random initial properties
            const delay = index * 2;
            const duration = EviaLuxury.utils.random(15, 25);
            const rotation = EviaLuxury.utils.random(-360, 360);
            
            gsap.set(orb, {
                rotation: rotation,
                scale: EviaLuxury.utils.random(0.8, 1.2)
            });
            
            // Floating animation
            gsap.to(orb, {
                duration: duration,
                rotation: rotation + 360,
                repeat: -1,
                ease: "none",
                delay: delay
            });
            
            gsap.to(orb, {
                duration: EviaLuxury.utils.random(8, 12),
                y: EviaLuxury.utils.random(-50, 50),
                x: EviaLuxury.utils.random(-30, 30),
                scale: EviaLuxury.utils.random(0.9, 1.3),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: delay
            });
        });
    }
    
    initBeforeAfterSliders() {
        const sliders = document.querySelectorAll('.ba-slider, .ba-wrapper');
        
        sliders.forEach(slider => {
            let isDragging = false;
            let currentX = 50; // Start at middle
            
            const handle = slider.querySelector('.slider-handle, .ba-slider-handle');
            const afterImage = slider.querySelector('.after-image, .after-img');
            
            if (!handle || !afterImage) return;
            
            // Set initial position
            gsap.set(handle, { left: '50%' });
            gsap.set(afterImage, { clipPath: 'inset(0 50% 0 0)' });
            
            const handleMove = (e) => {
                if (!isDragging) return;
                
                const rect = slider.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const x = clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                currentX = percentage;
                
                gsap.set(handle, { left: `${percentage}%` });
                gsap.set(afterImage, { clipPath: `inset(0 ${100 - percentage}% 0 0)` });
            };
            
            // Mouse events
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', stopDragging);
            });
            
            // Touch events
            handle.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault();
                document.addEventListener('touchmove', handleMove, { passive: false });
                document.addEventListener('touchend', stopDragging);
            });
            
            function stopDragging() {
                isDragging = false;
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', stopDragging);
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('touchend', stopDragging);
            }
            
            // Auto-slide demo
            let autoSlideInterval;
            const startAutoSlide = () => {
                autoSlideInterval = setInterval(() => {
                    if (!isDragging) {
                        const targetX = currentX === 50 ? (Math.random() > 0.5 ? 20 : 80) : 50;
                        
                        gsap.to({ value: currentX }, {
                            duration: 2,
                            value: targetX,
                            ease: "power2.inOut",
                            onUpdate: function() {
                                const percentage = this.targets()[0].value;
                                currentX = percentage;
                                gsap.set(handle, { left: `${percentage}%` });
                                gsap.set(afterImage, { clipPath: `inset(0 ${100 - percentage}% 0 0)` });
                            }
                        });
                    }
                }, 4000);
            };
            
            // Start auto-slide when in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAutoSlide();
                    } else {
                        clearInterval(autoSlideInterval);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(slider);
        });
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
        }, { threshold: 0.7 });
        
        const statsContainer = document.querySelector('.features-showcase') || 
                               document.querySelector('.doctor-stats') ||
                               document.querySelector('.stats-grid');
        
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }
    
    animateStats() {
        if (this.statsAnimated) return;
        
        this.statsAnimated = true;
        
        this.statNumbers.forEach((counter, index) => {
            const target = parseInt(counter.dataset.count || counter.getAttribute('data-target'));
            if (!target) return;
            
            gsap.fromTo({ value: 0 }, {
                duration: 2.5,
                value: target,
                ease: "power2.out",
                delay: index * 0.2,
                onUpdate: function() {
                    counter.textContent = Math.floor(this.targets()[0].value);
                },
                onComplete: () => {
                    counter.textContent = target;
                }
            });
        });
    }
    
    initMagneticEffects() {
        // Add magnetic effects to various interactive elements
        const magneticSelectors = [
            '.feature-card',
            '.service-item',
            '.trust-item',
            '.booking-card',
            '.availability-status',
            '.benefit'
        ];
        
        magneticSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                EviaLuxury.utils.addMagneticEffect(element, 0.1);
            });
        });
    }
    
    initDynamicText() {
        if (typeof Typed !== 'undefined' && this.dynamicText) {
            const beautyWords = [
                'Beauty',
                'Confidence', 
                'Radiance',
                'Elegance',
                'Transformation',
                'Excellence',
                'Luxury',
                'Glow'
            ];
            
            this.typedInstance = new Typed(this.dynamicText, {
                strings: beautyWords,
                typeSpeed: 120,
                backSpeed: 80,
                backDelay: 2500,
                startDelay: 2000,
                loop: true,
                showCursor: false,
                smartBackspace: true,
                fadeOut: true,
                fadeOutDelay: 500
            });
        } else {
            // Fallback animation
            if (this.dynamicText) {
                const words = ['Beauty', 'Confidence', 'Radiance', 'Excellence'];
                let currentIndex = 0;
                
                const changeWord = () => {
                    gsap.to(this.dynamicText, {
                        duration: 0.5,
                        opacity: 0,
                        y: -20,
                        ease: "power2.in",
                        onComplete: () => {
                            this.dynamicText.textContent = words[currentIndex];
                            currentIndex = (currentIndex + 1) % words.length;
                            
                            gsap.to(this.dynamicText, {
                                duration: 0.5,
                                opacity: 1,
                                y: 0,
                                ease: "power2.out"
                            });
                        }
                    });
                };
                
                // Start animation
                this.dynamicText.textContent = words[0];
                setInterval(changeWord, 3000);
            }
        }
    }
    
    startAnimations() {
        // Called after preloader completes
        console.log('Hero animations started');
        
        // Animate feature cards
        gsap.fromTo('.feature-card', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            duration: 1,
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.5
        });
        
        // Animate popularity meters
        setTimeout(() => {
            const popularityFills = document.querySelectorAll('.meter-fill, .popularity-fill');
            popularityFills.forEach(fill => {
                const targetWidth = fill.style.width || '0%';
                gsap.fromTo(fill, {
                    width: '0%'
                }, {
                    duration: 1.5,
                    width: targetWidth,
                    ease: "power2.out",
                    delay: EviaLuxury.utils.random(0, 0.5)
                });
            });
        }, 1000);
        
        // Initialize dynamic text
        this.initDynamicText();
    }
    
    destroy() {
        // Cleanup method
        if (this.typedInstance) {
            this.typedInstance.destroy();
        }
        
        if (this.particlesInitialized && window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
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
        this.timeline = null;
        
        this.init();
    }
    
    init() {
        if (!this.overlay || !this.bookingModal) return;
        
        this.bindEvents();
        this.initFormEnhancements();
        this.setupInitialStates();
    }
    
    setupInitialStates() {
        gsap.set(this.overlay, { opacity: 0, visibility: 'hidden' });
        gsap.set(this.bookingModal, { scale: 0.8, y: 50 });
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
        const bookingTriggers = document.querySelectorAll('.service-cta, .primary-cta, .hero-primary-cta, .mobile-book-btn, .fab-button');
        bookingTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                if (!trigger.closest('form')) { // Don't interfere with form submissions
                    e.preventDefault();
                    this.openBookingModal();
                }
            });
        });
    }
    
    initFormEnhancements() {
        if (!this.form) return;
        
        // Add magnetic effect to submit button
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            EviaLuxury.utils.addMagneticEffect(submitBtn, 0.2);
        }
        
        // Form field enhancements
        const formFields = this.form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            // Focus animations
            field.addEventListener('focus', () => {
                gsap.to(field, {
                    duration: 0.3,
                    y: -2,
                    boxShadow: '0 8px 25px rgba(255, 158, 24, 0.15)',
                    ease: "power2.out"
                });
                
                const focusElement = field.nextElementSibling;
                if (focusElement && focusElement.classList.contains('input-focus')) {
                    gsap.to(focusElement, {
                        duration: 0.3,
                        opacity: 1,
                        scale: 1,
                        ease: "power2.out"
                    });
                }
            });
            
            field.addEventListener('blur', () => {
                gsap.to(field, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    ease: "power2.out"
                });
                
                const focusElement = field.nextElementSibling;
                if (focusElement && focusElement.classList.contains('input-focus')) {
                    gsap.to(focusElement, {
                        duration: 0.3,
                        opacity: 0,
                        scale: 0.95,
                        ease: "power2.out"
                    });
                }
            });
        });
    }
    
    openBookingModal(preSelectedService = null) {
        this.activeModal = this.bookingModal;
        document.body.classList.add('no-scroll');
        
        // Pre-select service if provided
        if (preSelectedService && this.form) {
            const serviceSelect = this.form.querySelector('select');
            if (serviceSelect) {
                serviceSelect.value = preSelectedService;
            }
        }
        
        // Animation
        this.timeline = gsap.timeline();
        
        this.timeline
            .set(this.overlay, { visibility: 'visible' })
            .to(this.overlay, {
                duration: 0.3,
                opacity: 1,
                ease: "power2.out"
            })
            .to(this.bookingModal, {
                duration: 0.5,
                scale: 1,
                y: 0,
                ease: "back.out(1.7)"
            }, 0.1);
    }
    
    closeModal() {
        if (!this.activeModal) return;
        
        this.timeline = gsap.timeline({
            onComplete: () => {
                this.activeModal = null;
                document.body.classList.remove('no-scroll');
            }
        });
        
        this.timeline
            .to(this.bookingModal, {
                duration: 0.3,
                scale: 0.8,
                y: 50,
                ease: "power2.in"
            })
            .to(this.overlay, {
                duration: 0.3,
                opacity: 0,
                ease: "power2.out"
            }, 0.1)
            .set(this.overlay, { visibility: 'hidden' });
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
                this.showFieldError(field, 'This field is required');
            } else {
                this.clearFieldError(field);
            }
        });
        
        if (!isValid) {
            EviaLuxury.utils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                EviaLuxury.utils.showNotification('Please enter a valid email address', 'error');
                return;
            }
        }
        
        // Submit form
        this.submitForm(data);
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
            opacity: 0;
            transform: translateY(-10px);
        `;
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // Animate in
        gsap.to(errorDiv, {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        });
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            gsap.to(errorDiv, {
                duration: 0.3,
                opacity: 0,
                y: -10,
                ease: "power2.out",
                onComplete: () => errorDiv.remove()
            });
        }
    }
    
    submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="ri-loader-4-line"></i>';
        
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
            
            console.log('Form submitted successfully:', data);
            
        }, 2000);
    }
    
    showSuccessMessage() {
        const modalContent = this.bookingModal.querySelector('.modal-content');
        
        const successHTML = `
            <div class="success-message" style="text-align: center; padding: 3rem 1rem;">
                <div class="success-icon" style="
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2rem;
                    color: white;
                    font-size: 2.5rem;
                ">
                    <i class="ri-check-line"></i>
                </div>
                <h3 style="font-size: 2rem; margin-bottom: 1rem; color: #1A1A1A; font-family: 'Playfair Display', serif;">Thank You!</h3>
                <p style="color: #6B7280; line-height: 1.6; margin-bottom: 1.5rem; font-size: 1.1rem;">
                    Your consultation request has been received. 
                    Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                </p>
                <div style="
                    background: #F0FDF4;
                    border: 2px solid #BBF7D0;
                    border-radius: 1rem;
                    padding: 1.5rem;
                    color: #065F46;
                    font-size: 1rem;
                    font-weight: 500;
                ">
                    <i class="ri-information-line" style="margin-right: 0.5rem; font-size: 1.2rem;"></i>
                    We'll send a confirmation email shortly with all the details.
                </div>
            </div>
        `;
        
        modalContent.innerHTML = successHTML;
        
        // Animate success message
        const successMessage = modalContent.querySelector('.success-message');
        const successIcon = modalContent.querySelector('.success-icon');
        
        gsap.fromTo(successMessage, {
            opacity: 0,
            y: 20
        }, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        });
        
        gsap.fromTo(successIcon, {
            scale: 0,
            rotation: -180
        }, {
            duration: 0.8,
            scale: 1,
            rotation: 0,
            ease: "back.out(1.7)",
            delay: 0.2
        });
    }
}

// ========================================
// FLOATING ACTION BUTTON CLASS
// ========================================

class FloatingActionButton {
    constructor() {
        this.fab = document.getElementById('floatingAction');
        this.isVisible = false;
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        if (!this.fab) return;
        
        this.bindEvents();
        this.checkVisibility();
        this.initEnhancements();
    }
    
    bindEvents() {
        // FAB click event
        const fabButton = this.fab.querySelector('.fab-button');
        if (fabButton) {
            fabButton.addEventListener('click', () => {
                if (EviaLuxury.components.modal) {
                    EviaLuxury.components.modal.openBookingModal();
                }
            });
            
            // Add magnetic effect
            EviaLuxury.utils.addMagneticEffect(fabButton, 0.3);
            
            // Add ripple effect
            fabButton.addEventListener('click', (e) => {
                const ripple = fabButton.querySelector('.fab-ripple');
                if (ripple) {
                    gsap.set(ripple, {
                        scale: 0,
                        opacity: 1
                    });
                    
                    gsap.to(ripple, {
                        duration: 0.6,
                        scale: 4,
                        opacity: 0,
                        ease: "power2.out"
                    });
                }
            });
        }
        
        // Show/hide based on scroll
        const scrollHandler = EviaLuxury.utils.throttle(() => {
            this.checkVisibility();
        }, 100);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    
    initEnhancements() {
        // Floating animation
        if (this.fab) {
            gsap.to(this.fab, {
                duration: 3,
                y: -10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
    
    checkVisibility() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const shouldShow = scrollY > windowHeight * 0.5 && scrollY < documentHeight - windowHeight - 200;
        
        if (shouldShow !== this.isVisible) {
            this.isVisible = shouldShow;
            
            if (this.isVisible) {
                this.show();
            } else {
                this.hide();
            }
        }
        
        this.lastScrollY = scrollY;
    }
    
    show() {
        this.fab.classList.add('visible');
        
        gsap.fromTo(this.fab, {
            opacity: 0,
            y: 100,
            scale: 0.8
        }, {
            duration: 0.6,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "back.out(1.7)"
        });
    }
    
    hide() {
        gsap.to(this.fab, {
            duration: 0.4,
            opacity: 0,
            y: 100,
            scale: 0.8,
            ease: "power2.in",
            onComplete: () => {
                this.fab.classList.remove('visible');
            }
        });
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
            
            // Focus animations
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    duration: 0.3,
                    y: -2,
                    boxShadow: '0 8px 25px rgba(255, 158, 24, 0.15)',
                    ease: "power2.out"
                });
            });
            
            input.addEventListener('blur', () => {
                gsap.to(input, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    ease: "power2.out"
                });
            });
        });
    }
    
    initEnhancements() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            EviaLuxury.utils.addMagneticEffect(submitBtn, 0.2);
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
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        this.clearError(field);
        return true;
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#EF4444';
        
        // Remove existing error
        const existingError = field.closest('.form-group').querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #EF4444;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            opacity: 0;
            transform: translateY(-10px);
        `;
        errorDiv.textContent = message;
        field.closest('.form-group').appendChild(errorDiv);
        
        gsap.to(errorDiv, {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        });
    }
    
    clearError(field) {
        field.style.borderColor = '';
        const errorDiv = field.closest('.form-group').querySelector('.field-error');
        if (errorDiv) {
            gsap.to(errorDiv, {
                duration: 0.3,
                opacity: 0,
                y: -10,
                ease: "power2.out",
                onComplete: () => errorDiv.remove()
            });
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
            EviaLuxury.utils.showNotification('Please correct the errors above', 'error');
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
        submitBtn.innerHTML = '<span>Sending...</span> <i class="ri-loader-4-line"></i>';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            this.form.reset();
            EviaLuxury.utils.showNotification('Thank you! We\'ll be in touch soon.', 'success');
            
            console.log('Contact form submitted:', data);
        }, 2000);
    }
}

// ========================================
// SERVICES ENHANCEMENT CLASS
// ========================================

class ServicesEnhancement {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-card');
        this.init();
    }
    
    init() {
        this.enhanceServiceCards();
        this.initIntersectionObserver();
    }
    
    enhanceServiceCards() {
        this.serviceCards.forEach((card, index) => {
            // Add magnetic effect
            EviaLuxury.utils.addMagneticEffect(card, 0.15);
            
            // Enhance hover interactions
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.4,
                    y: -15,
                    scale: 1.02,
                    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.24)',
                    ease: "power2.out"
                });
                
                // Animate service icon
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    gsap.to(icon, {
                        duration: 0.3,
                        scale: 1.1,
                        rotation: 10,
                        ease: "power2.out"
                    });
                }
                
                // Animate service image
                const image = card.querySelector('.service-image img');
                if (image) {
                    gsap.to(image, {
                        duration: 0.6,
                        scale: 1.15,
                        ease: "power2.out"
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.4,
                    y: 0,
                    scale: 1,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    ease: "power2.out"
                });
                
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    gsap.to(icon, {
                        duration: 0.3,
                        scale: 1,
                        rotation: 0,
                        ease: "power2.out"
                    });
                }
                
                const image = card.querySelector('.service-image img');
                if (image) {
                    gsap.to(image, {
                        duration: 0.6,
                        scale: 1,
                        ease: "power2.out"
                    });
                }
            });
        });
    }
    
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    gsap.fromTo(entry.target, {
                        opacity: 0,
                        y: 60,
                        scale: 0.9
                    }, {
                        duration: 0.8,
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        ease: "power2.out",
                        delay: index * 0.1
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        this.serviceCards.forEach(card => {
            observer.observe(card);
        });
    }
}

// ========================================
// APPLICATION INITIALIZER
// ========================================

class EviaLuxuryApp {
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
        
        console.log('🌟 Initializing Evia Luxury Experience...');
        
        try {
            // Register GSAP plugins
            if (typeof gsap !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                
                // Set GSAP defaults
                gsap.defaults({
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
            
            // Initialize all components
            EviaLuxury.components = {
                preloader: new LuxuryPreloader(),
                header: new CinematicHeader(),
                mobileMenu: new MobileMenu(),
                hero: new CinematicHero(),
                modal: new ModalSystem(),
                fab: new FloatingActionButton(),
                contactForm: new ContactForm(),
                services: new ServicesEnhancement()
            };
            
            // Global event listeners
            this.bindGlobalEvents();
            
            // Performance optimizations
            this.initPerformanceOptimizations();
            
            // Mouse tracking for magnetic effects
            this.initMouseTracking();
            
            this.isInitialized = true;
            
            console.log('✅ Evia Luxury Experience Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
    }
    
    bindGlobalEvents() {
        // Window resize handler
        const resizeHandler = EviaLuxury.utils.debounce(() => {
            EviaLuxury.isMobile = window.innerWidth <= 768;
            EviaLuxury.isTablet = window.innerWidth <= 1024;
            
            // Dispatch resize event for components
            window.dispatchEvent(new CustomEvent('evia-resize', {
                detail: { 
                    isMobile: EviaLuxury.isMobile,
                    isTablet: EviaLuxury.isTablet
                }
            }));
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
        
        // Global click handler for smooth anchors
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#' && !link.classList.contains('no-smooth')) {
                e.preventDefault();
                const target = link.getAttribute('href');
                EviaLuxury.utils.smoothScrollTo(target);
            }
        });
        
        // Page visibility change handler
        document.addEventListener('visibilitychange', () => {
            const videos = document.querySelectorAll('video');
            
            if (document.hidden) {
                videos.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                        video.dataset.wasPlaying = 'true';
                    }
                });
            } else {
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
            
            // Initialize additional animations
            this.initScrollAnimations();
        });
        
        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    }
    
    initMouseTracking() {
        if (EviaLuxury.isMobile) return;
        
        document.addEventListener('mousemove', (e) => {
            EviaLuxury.mouseX = e.clientX;
            EviaLuxury.mouseY = e.clientY;
            
            // Update CSS custom properties for magnetic effects
            document.documentElement.style.setProperty('--mouse-x', `${(e.clientX - window.innerWidth / 2) * 0.01}px`);
            document.documentElement.style.setProperty('--mouse-y', `${(e.clientY - window.innerHeight / 2) * 0.01}px`);
        });
    }
    
    initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        // Parallax effects for non-mobile devices
        if (!EviaLuxury.isMobile) {
            gsap.utils.toArray('.parallax-element').forEach(element => {
                gsap.to(element, {
                    yPercent: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: element,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });
        }
        
        // Fade in animations for sections
        gsap.utils.toArray('section').forEach(section => {
            gsap.fromTo(section.querySelectorAll('h2, h3, p, .section-badge'), {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
    
    initPerformanceOptimizations() {
        // Lazy load images
        this.initLazyLoading();
        
        // Connection type optimizations
        this.initConnectionOptimizations();
        
        // Preload critical resources
        this.preloadCriticalResources();
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
                        img.classList.add('loaded');
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
                img.classList.add('loaded');
            });
        }
    }
    
    initConnectionOptimizations() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Disable auto-playing video for slow connections
                const videos = document.querySelectorAll('video[autoplay]');
                videos.forEach(video => {
                    video.removeAttribute('autoplay');
                    video.preload = 'none';
                });
                
                // Reduce particle count
                EviaLuxury.settings.particleCount = Math.floor(EviaLuxury.settings.particleCount / 2);
                
                // Disable complex animations
                document.body.classList.add('reduced-motion');
                
                console.log('🐌 Slow connection detected, optimizing experience');
            }
        }
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
        ];
        
        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }
}

// ========================================
// INITIALIZE APPLICATION
// ========================================

// Initialize the application
const app = new EviaLuxuryApp();

// Export for global access
window.EviaLuxury = EviaLuxury;

// Debug helper in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.EviaDebug = {
        components: () => EviaLuxury.components,
        settings: () => EviaLuxury.settings,
        utils: () => EviaLuxury.utils,
        version: '2.0.0 - Cinematic Luxury Edition',
        performance: () => {
            return {
                memory: performance.memory,
                navigation: performance.navigation,
                timing: performance.timing
            };
        }
    };
    
    console.log('🔧 Debug mode enabled. Use window.EviaDebug for debugging.');
    console.log('🎭 Cinematic Luxury Edition loaded successfully!');
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Additional utility styles injection
const additionalStyles = `
<style>
.notification {
    font-family: 'Inter', sans-serif;
    border-radius: 1rem;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
}

.field-error {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
}

.success-message {
    font-family: 'Inter', sans-serif;
}

.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

@media (prefers-reduced-motion: reduce) {
    .reduced-motion * {
        animation: none !important;
        transition: none !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

console.log('🚀 Evia Aesthetics - Cinematic Luxury Experience Ready!');
