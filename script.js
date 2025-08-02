/* ========================================
   EVIA AESTHETICS - ENHANCED HERO JS
   ======================================== */

'use strict';

// ========================================
// GLOBAL VARIABLES & UTILITIES
// ========================================

const EviaUtils = {
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
    
    smoothScrollTo: (target, offset = 100) => {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    wait: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Utility for creating smooth animations
    animate: (element, keyframes, options = {}) => {
        if (!element) return;
        return element.animate(keyframes, {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards',
            ...options
        });
    }
};

// ========================================
// LUXURY APPLICATION CLASS
// ========================================

class EviaLuxuryApp {
    constructor() {
        this.isLoaded = false;
        this.isMobile = window.innerWidth <= 768;
        this.scrollY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.components = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        console.log('🌟 Evia Luxury Experience Initializing...');
    }
    
    bindEvents() {
        // Wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
        
        // Window events
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('resize', EviaUtils.debounce(() => this.onWindowResize(), 250));
        
        // Mouse tracking for magnetic effects
        if (!this.isMobile) {
            document.addEventListener('mousemove', (e) => this.trackMouse(e));
        }
    }
    
    onDOMReady() {
        try {
            // Initialize components in order
            this.components.preloader = new LuxuryPreloader();
            this.components.header = new HermesLuxuryHeader();
            this.components.mobileMenu = new LuxuryMobileMenu();
            this.components.cinematicHero = new CinematicHero(); // New enhanced hero
            this.components.beforeAfter = new BeforeAfterSlider();
            this.components.contactForm = new ContactForm();
            this.components.magneticEffects = new MagneticEffects();
            
            // Initialize AOS
            this.initAOS();
            
            // Initialize modern intersection observers
            this.initModernObservers();
            
            console.log('✅ All components initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 100
            });
        }
    }
    
    initModernObservers() {
        // Performance-optimized intersection observers
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        };
        
        // Animate elements on scroll
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('animate-in');
                    animationObserver.unobserve(element);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
        
        // Apply to elements that need scroll animation
        const elementsToAnimate = document.querySelectorAll('.service-card, .result-card, .contact-item, .credential-item, .review-card');
        elementsToAnimate.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                animationObserver.observe(el);
            }
        });
    }
    
    onWindowLoad() {
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        if (this.components.preloader) {
            this.components.preloader.fadeOut();
        }
        
        console.log('✨ Evia Luxury Experience Fully Loaded');
    }
    
    onWindowResize() {
        this.isMobile = window.innerWidth <= 768;
        
        // Update components on resize
        Object.values(this.components).forEach(component => {
            if (component && typeof component.onResize === 'function') {
                component.onResize();
            }
        });
    }
    
    trackMouse(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Update CSS custom properties for magnetic effects
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
    
    // Public methods for external access
    smoothScrollTo(target, offset = 100) {
        return EviaUtils.smoothScrollTo(target, offset);
    }
}

// ========================================
// LUXURY PRELOADER CLASS
// ========================================

class LuxuryPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.minDisplayTime = 3000; // 3 seconds minimum
        this.startTime = Date.now();
        this.logoLoaded = false;
        
        if (this.preloader) {
            this.init();
        }
    }
    
    init() {
        // Prevent scrolling during preload
        document.body.style.overflow = 'hidden';
        
        // Add floating animation to medspa icons
        this.addFloatingAnimation();
        
        // Check for logo loading
        this.checkLogoLoading();
        
        // Check if page is already loaded
        if (document.readyState === 'complete') {
            this.checkFadeOut();
        } else {
            window.addEventListener('load', () => this.checkFadeOut());
        }
    }
    
    checkLogoLoading() {
        const logoImage = this.preloader.querySelector('.preloader-logo');
        if (logoImage) {
            if (logoImage.complete && logoImage.naturalHeight !== 0) {
                this.logoLoaded = true;
            } else {
                logoImage.addEventListener('load', () => {
                    this.logoLoaded = true;
                });
                logoImage.addEventListener('error', () => {
                    this.logoLoaded = true; // Continue even if logo fails to load
                });
            }
        } else {
            this.logoLoaded = true; // No logo found, continue
        }
    }
    
    addFloatingAnimation() {
        const medSpaIcons = this.preloader.querySelectorAll('.medspa-icon');
        medSpaIcons.forEach((icon, index) => {
            // Add randomized floating movement
            setInterval(() => {
                const time = Date.now() * 0.001;
                const offset = index * 0.5;
                const x = Math.sin(time + offset) * 15;
                const y = Math.cos(time * 0.8 + offset) * 10;
                icon.style.transform = `translate(${x}px, ${y}px) rotate(${Math.sin(time + offset) * 5}deg)`;
            }, 50);
        });
        
        // Add subtle animation to logo
        const logo = this.preloader.querySelector('.preloader-logo');
        if (logo) {
            setInterval(() => {
                const time = Date.now() * 0.0008;
                const scale = 1 + Math.sin(time) * 0.02;
                logo.style.transform = `scale(${scale})`;
            }, 16);
        }
    }
    
    checkFadeOut() {
        const checkConditions = () => {
            const timeElapsed = Date.now() - this.startTime;
            const timeConditionMet = timeElapsed >= this.minDisplayTime;
            
            if (timeConditionMet && this.logoLoaded) {
                this.fadeOut();
            } else {
                // Check again in 100ms
                setTimeout(checkConditions, 100);
            }
        };
        
        checkConditions();
    }
    
    fadeOut() {
        if (!this.preloader) return;
        
        // Add fade out animation to icons first
        const medSpaIcons = this.preloader.querySelectorAll('.medspa-icon');
        medSpaIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(0.5) rotate(180deg)';
            }, index * 50);
        });
        
        // Fade out logo and loading indicator
        setTimeout(() => {
            const logo = this.preloader.querySelector('.preloader-logo');
            const loadingIndicator = this.preloader.querySelector('.loading-indicator');
            
            if (logo) {
                logo.style.opacity = '0';
                logo.style.transform = 'scale(0.8)';
            }
            
            if (loadingIndicator) {
                loadingIndicator.style.opacity = '0';
            }
        }, 400);
        
        // Fade out entire preloader
        setTimeout(() => {
            this.preloader.classList.add('fade-out');
        }, 800);
        
        // Remove preloader from DOM
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.add('preloader-complete');
        }, 2000);
    }
}

// ========================================
// HERMÈS-INSPIRED LUXURY HEADER CLASS
// ========================================

class HermesLuxuryHeader {
    constructor() {
        this.header = document.getElementById('header');
        this.lastScrollY = 0;
        this.ticking = false;
        this.isScrolled = false;
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initNavigationEffects();
        this.initPremiumBehavior();
    }
    
    bindEvents() {
        // Optimized scroll handler with RAF
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
        
        // Premium CTA button smooth scroll
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', (e) => {
                e.preventDefault();
                app.smoothScrollTo('#contact');
            });
        }
        
        // Logo click to top with premium animation
        const headerLogo = this.header.querySelector('.header-logo');
        if (headerLogo) {
            headerLogo.addEventListener('click', () => {
                app.smoothScrollTo('#home', 0);
            });
        }
        
        // Mobile toggle
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldTransform = scrollY > 100;
        
        // Update scrolled state with premium transitions
        if (shouldTransform !== this.isScrolled) {
            this.isScrolled = shouldTransform;
            this.header.classList.toggle('scrolled', this.isScrolled);
            
            // Add premium floating animation on scroll
            const container = this.header.querySelector('.aluminum-container');
            if (container) {
                if (this.isScrolled) {
                    container.style.transform = 'scale(0.94) translateY(-2px)';
                    container.style.borderColor = '#FF8C00';
                    container.style.borderWidth = '2px';
                } else {
                    container.style.transform = 'scale(1) translateY(0)';
                    container.style.borderColor = '#C0C0C0';
                    container.style.borderWidth = '3px';
                }
            }
        }
        
        this.lastScrollY = scrollY;
    }
    
    initNavigationEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    app.smoothScrollTo(href);
                    this.updateActiveLink(href);
                });
                
                // Enhanced hover effects
                link.addEventListener('mouseenter', () => {
                    this.addNavLinkShine(link);
                });
            }
        });
        
        // Update active link on scroll
        this.updateActiveNavigation();
    }
    
    addNavLinkShine(link) {
        // Add premium shine effect on hover
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
            border-radius: 1.5rem;
        `;
        
        link.style.position = 'relative';
        link.appendChild(shine);
        
        // Trigger shine animation
        requestAnimationFrame(() => {
            shine.style.left = '100%';
        });
        
        // Remove shine element after animation
        setTimeout(() => {
            if (shine.parentNode) {
                shine.parentNode.removeChild(shine);
            }
        }, 600);
    }
    
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveLink(`#${id}`);
                }
            });
        }, { 
            threshold: [0.3, 0.5, 0.7],
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveLink(href) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
                this.addActiveAnimation(link);
            }
        });
    }
    
    addActiveAnimation(link) {
        // Add premium active state animation
        link.style.transform = 'scale(1.05)';
        setTimeout(() => {
            link.style.transform = '';
        }, 300);
    }
    
    initPremiumBehavior() {
        const container = this.header.querySelector('.aluminum-container');
        if (!container) return;
        
        // Add subtle floating animation to the entire header
        let floatOffset = 0;
        
        const animate = () => {
            floatOffset += 0.006;
            const yOffset = Math.sin(floatOffset) * 1;
            
            if (!this.isScrolled) {
                container.style.transform = `translateY(${yOffset}px)`;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Premium CTA button effects
        const premiumCTA = this.header.querySelector('.premium-cta');
        if (premiumCTA) {
            premiumCTA.addEventListener('mouseenter', () => {
                this.triggerCTAShine();
            });
        }
    }
    
    triggerCTAShine() {
        const ctaShine = this.header.querySelector('.cta-shine');
        if (ctaShine) {
            ctaShine.style.left = '-100%';
            ctaShine.offsetHeight; // Force reflow
            ctaShine.style.left = '100%';
        }
    }
    
    toggleMobileMenu() {
        const toggle = document.getElementById('mobileToggle');
        if (toggle) {
            toggle.classList.toggle('active');
            
            // Trigger mobile menu component
            if (app.components.mobileMenu) {
                app.components.mobileMenu.toggleMenu();
            }
        }
    }
    
    onResize() {
        // Handle responsive behavior
        if (window.innerWidth > 768) {
            const toggle = document.getElementById('mobileToggle');
            if (toggle) {
                toggle.classList.remove('active');
            }
        }
    }
}

// ========================================
// LUXURY MOBILE MENU CLASS
// ========================================

class LuxuryMobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileToggle');
        this.menu = document.getElementById('mobileMenu');
        this.backdrop = document.getElementById('mobileBackdrop');
        this.close = document.getElementById('mobileClose');
        this.navItems = document.querySelectorAll('.nav-item');
        this.isOpen = false;
        this.animationInProgress = false;
        
        if (this.toggle && this.menu) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initAnimationStates();
    }
    
    bindEvents() {
        // Close button with modern animation
        if (this.close) {
            this.close.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
        }
        
        // Backdrop click to close
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Navigation links with smooth transitions
        this.navItems.forEach((item, index) => {
            const link = item.querySelector('.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        this.navigateAndClose(href, index);
                    }
                });
                
                // Add hover sound effect (optional)
                link.addEventListener('mouseenter', () => {
                    this.playHoverEffect(item);
                });
            }
        });
        
        // Menu CTA button
        const menuCTA = document.querySelector('.menu-cta');
        if (menuCTA) {
            menuCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateAndClose('#contact');
            });
        }
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            if (this.isOpen && window.innerWidth > 768) {
                this.closeMenu();
            }
        }, 250));
    }
    
    initAnimationStates() {
        // Set initial states for animations
        this.navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(50px)';
            item.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
        });
        
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            menuFooter.style.opacity = '0';
            menuFooter.style.transform = 'translateY(30px)';
            menuFooter.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s';
        }
    }
    
    toggleMenu() {
        if (this.animationInProgress) return;
        
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    async openMenu() {
        if (this.isOpen || this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show backdrop
        this.backdrop.classList.add('active');
        
        // Show menu container
        this.menu.classList.add('active');
        
        // Wait for menu to slide in, then animate content
        await this.wait(200);
        
        // Animate navigation items with stagger
        this.navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
        
        // Animate footer
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            setTimeout(() => {
                menuFooter.style.opacity = '1';
                menuFooter.style.transform = 'translateY(0)';
            }, 600);
        }
        
        this.animationInProgress = false;
    }
    
    async closeMenu() {
        if (!this.isOpen || this.animationInProgress) return;
        
        this.animationInProgress = true;
        this.isOpen = false;
        
        // Update toggle state
        const toggle = document.getElementById('mobileToggle');
        if (toggle) {
            toggle.classList.remove('active');
        }
        
        // Reverse animate navigation items
        const reverseItems = Array.from(this.navItems).reverse();
        reverseItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px)';
            }, index * 50);
        });
        
        // Hide footer
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            menuFooter.style.opacity = '0';
            menuFooter.style.transform = 'translateY(30px)';
        }
        
        // Wait for content animation, then hide menu
        await this.wait(400);
        
        // Hide menu container
        this.menu.classList.remove('active');
        
        // Hide backdrop
        this.backdrop.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        this.animationInProgress = false;
    }
    
    async navigateAndClose(href, itemIndex = 0) {
        // Highlight selected item
        if (itemIndex >= 0 && this.navItems[itemIndex]) {
            this.navItems[itemIndex].style.background = 'rgba(255, 158, 24, 0.1)';
            this.navItems[itemIndex].style.transform = 'translateX(0) scale(1.02)';
        }
        
        // Close menu
        await this.closeMenu();
        
        // Navigate after menu closes
        setTimeout(() => {
            app.smoothScrollTo(href);
        }, 300);
    }
    
    playHoverEffect(item) {
        // Subtle hover animation
        const underline = item.querySelector('.nav-underline');
        if (underline) {
            underline.style.width = 'calc(100% - 2rem)';
        }
        
        // Optional: Add subtle scaling
        item.style.transform = 'translateX(0) scale(1.02)';
        
        // Reset on mouse leave
        const link = item.querySelector('.nav-link');
        const resetHover = () => {
            if (underline) {
                underline.style.width = '0';
            }
            item.style.transform = 'translateX(0) scale(1)';
            link.removeEventListener('mouseleave', resetHover);
        };
        
        link.addEventListener('mouseleave', resetHover);
    }
    
    // Utility methods
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
    
    onResize() {
        // Handle responsive behavior
        if (this.isOpen && window.innerWidth > 768) {
            this.closeMenu();
        }
    }
}

// ========================================
// ENHANCED CINEMATIC HERO CLASS
// ========================================

class CinematicHero {
    constructor() {
        this.hero = document.querySelector('.cinematic-hero');
        this.primaryCTA = document.querySelector('.hero-cta-signature');
        this.scrollIndicator = document.querySelector('.scroll-indicator-elegant');
        this.statPills = document.querySelectorAll('.stat-pill');
        this.signature = document.querySelector('.signature-text');
        
        if (this.hero) {
            this.init();
        }
    }
    
    init() {
        this.initCTAButtons();
        this.initScrollIndicator();
        this.initFloatingOrbs();
        this.initStatPills();
        this.initVideo();
        this.initSignatureAnimation();
        this.initTypographyAnimations();
    }
    
    initCTAButtons() {
        if (this.primaryCTA) {
            // Navigate to contact on click
            this.primaryCTA.addEventListener('click', () => {
                app.smoothScrollTo('#contact');
            });
            
            // Enhanced shimmer effect for new design
            this.primaryCTA.addEventListener('click', (e) => {
                this.triggerCTARipple(e);
            });

            // Premium hover effect with shimmer
            this.primaryCTA.addEventListener('mouseenter', () => {
                this.addCTAShimmer();
            });

            // Enhanced hover animations
            this.primaryCTA.addEventListener('mouseenter', () => {
                this.triggerCTAHoverAnimation();
            });

            this.primaryCTA.addEventListener('mouseleave', () => {
                this.resetCTAHoverAnimation();
            });
        }
    }

    triggerCTARipple(e) {
        // Create ripple effect at click point
        const rect = this.primaryCTA.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.primaryCTA.appendChild(ripple);
        
        // Animate ripple
        EviaUtils.animate(ripple, [
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(6)', opacity: 0 }
        ], { duration: 800 }).then(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        });
    }

    addCTAShimmer() {
        const shimmer = this.primaryCTA.querySelector('.cta-shimmer');
        if (shimmer) {
            // Reset shimmer position
            shimmer.style.left = '-100%';
            shimmer.style.transition = 'none';
            
            // Force reflow
            shimmer.offsetHeight;
            
            // Animate shimmer
            shimmer.style.transition = 'left 0.8s ease';
            shimmer.style.left = '100%';
        }
    }

    triggerCTAHoverAnimation() {
        // Enhanced hover state with multiple effects
        const glow = this.primaryCTA.querySelector('.cta-glow');
        if (glow) {
            glow.style.opacity = '0.6';
        }
        
        // Add subtle pulse to the button text
        EviaUtils.animate(this.primaryCTA, [
            { transform: 'translateY(-5px) scale(1.02)' }
        ], { duration: 300 });
    }

    resetCTAHoverAnimation() {
        const glow = this.primaryCTA.querySelector('.cta-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
    }
    
    initScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                app.smoothScrollTo('#services');
            });

            // Enhanced hover effect for modern design
            const scrollIcon = this.scrollIndicator.querySelector('.scroll-icon');

            if (this.scrollIndicator) {
                this.scrollIndicator.addEventListener('mouseenter', () => {
                    this.animateScrollIndicator();
                });

                this.scrollIndicator.addEventListener('mouseleave', () => {
                    this.resetScrollIndicator();
                });
            }
        }
    }

    animateScrollIndicator() {
        const scrollIcon = this.scrollIndicator.querySelector('.scroll-icon');
        const scrollText = this.scrollIndicator.querySelector('.scroll-text');

        // Animate the icon container
        if (scrollIcon) {
            EviaUtils.animate(scrollIcon, [
                { transform: 'scale(1)' },
                { transform: 'scale(1.1)' }
            ], { duration: 300 });
        }

        // Animate the text
        if (scrollText) {
            EviaUtils.animate(scrollText, [
                { opacity: 0.8 },
                { opacity: 1 }
            ], { duration: 200 });
        }
    }

    resetScrollIndicator() {
        const scrollIcon = this.scrollIndicator.querySelector('.scroll-icon');
        
        if (scrollIcon) {
            EviaUtils.animate(scrollIcon, [
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
            ], { duration: 300 });
        }
    }
    
    initFloatingOrbs() {
        const orbs = document.querySelectorAll('.orb');
        const bubbles = document.querySelectorAll('.aqua-bubble');
        
        orbs.forEach((orb, index) => {
            // Random initial positions and animations
            const delay = index * 8;
            const duration = 25 + (index * 5);
            
            orb.style.animationDelay = `-${delay}s`;
            orb.style.animationDuration = `${duration}s`;
            
            // Add parallax effect
            this.addParallaxToOrb(orb, index);
        });

        // Initialize aqua bubbles
        bubbles.forEach((bubble, index) => {
            const delay = index * 6;
            const duration = 20 + (index * 3);
            
            bubble.style.animationDelay = `-${delay}s`;
            bubble.style.animationDuration = `${duration}s`;
            
            // Add subtle parallax to bubbles
            this.addParallaxToOrb(bubble, index * 0.5);
        });
    }

    initStatPills() {
        // Enhanced stat pills with hover effects
        this.statPills.forEach((pill, index) => {
            // Add entrance animation with stagger
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                pill.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0)';
            }, 1000 + (index * 150)); // Delay after hero content

            // Enhanced hover interactions
            pill.addEventListener('mouseenter', () => {
                this.animateStatPillHover(pill);
            });

            pill.addEventListener('mouseleave', () => {
                this.resetStatPillHover(pill);
            });
        });
    }

    animateStatPillHover(pill) {
        const statIcon = pill.querySelector('.stat-icon');
        const statNumber = pill.querySelector('.stat-number');

        // Scale and glow effect
        EviaUtils.animate(pill, [
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-8px) scale(1.05)' }
        ], { duration: 300 });

        // Animate icon with pulse
        if (statIcon) {
            EviaUtils.animate(statIcon, [
                { transform: 'scale(1)' },
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
            ], { duration: 400 });
        }

        // Subtle number animation
        if (statNumber) {
            EviaUtils.animate(statNumber, [
                { transform: 'scale(1)' },
                { transform: 'scale(1.05)' }
            ], { duration: 200 });
        }
    }

    resetStatPillHover(pill) {
        EviaUtils.animate(pill, [
            { transform: 'translateY(-8px) scale(1.05)' },
            { transform: 'translateY(0) scale(1)' }
        ], { duration: 300 });
    }
    
    addParallaxToOrb(orb, index) {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.1 * (index + 1);
                    orb.style.transform = `translateY(${rate}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    initVideo() {
        const video = document.querySelector('.hero-video');
        if (video) {
            video.addEventListener('loadeddata', () => {
                video.style.opacity = '0.95';
            });
            
            // Ensure video plays
            const playVideo = () => {
                if (video.paused) {
                    video.play().catch(() => {
                        console.warn('Video autoplay prevented');
                    });
                }
            };
            
            // Try to play on various events
            ['loadeddata', 'canplay'].forEach(event => {
                video.addEventListener(event, playVideo);
            });
            
            // Page visibility API
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    video.pause();
                } else {
                    playVideo();
                }
            });
        }
    }

    initSignatureAnimation() {
        if (this.signature) {
            // Enhanced signature animation
            this.signature.style.opacity = '0';
            this.signature.style.transform = 'translateX(30px)';
            
            // Trigger signature animation after other elements
            setTimeout(() => {
                EviaUtils.animate(this.signature, [
                    { opacity: 0, transform: 'translateX(30px)' },
                    { opacity: 1, transform: 'translateX(0)' }
                ], { duration: 1200, easing: 'ease-out' });
            }, 1800);

            // Add subtle hover effect to signature
            this.signature.addEventListener('mouseenter', () => {
                EviaUtils.animate(this.signature, [
                    { transform: 'translateX(0) scale(1)' },
                    { transform: 'translateX(0) scale(1.05)' }
                ], { duration: 300 });
            });

            this.signature.addEventListener('mouseleave', () => {
                EviaUtils.animate(this.signature, [
                    { transform: 'translateX(0) scale(1.05)' },
                    { transform: 'translateX(0) scale(1)' }
                ], { duration: 300 });
            });
        }
    }

    initTypographyAnimations() {
        // Animate headline elements on load with improved timing
        const badge = document.querySelector('.hero-badge-premium');
        const headlinePrimary = document.querySelector('.headline-primary');
        const headlineSecondary = document.querySelector('.headline-secondary');
        const subheadline = document.querySelector('.hero-subheadline-elegant');

        // Enhanced stagger animation for typography
        const elements = [badge, headlinePrimary, headlineSecondary, subheadline];
        
        elements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    EviaUtils.animate(element, [
                        { opacity: 0, transform: 'translateY(30px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ], { 
                        duration: 800 + (index * 100), 
                        delay: index * 200,
                        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    });
                }, 500); // Start after preloader
            }
        });

        // Animate CTA button
        if (this.primaryCTA) {
            this.primaryCTA.style.opacity = '0';
            this.primaryCTA.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                EviaUtils.animate(this.primaryCTA, [
                    { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)' }
                ], { duration: 800 });
            }, 1200);
        }
    }

    // Add responsive behavior
    onResize() {
        // Adjust animations for mobile
        if (window.innerWidth <= 768) {
            // Reduce parallax effects on mobile
            this.statPills.forEach(pill => {
                pill.style.transform = 'translateY(0)';
            });
        }
    }
}

// ========================================
// BEFORE/AFTER SLIDER CLASS
// ========================================

class BeforeAfterSlider {
    constructor() {
        this.sliders = document.querySelectorAll('.before-after-slider');
        
        if (this.sliders.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.sliders.forEach(slider => this.initSlider(slider));
    }
    
    initSlider(slider) {
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        let isDragging = false;
        let currentX = 50; // Start at middle
        
        if (!handle || !afterImage) return;
        
        // Set initial position
        handle.style.left = '50%';
        afterImage.style.clipPath = 'inset(0 50% 0 0)';
        
        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            currentX = percentage;
            handle.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };
        
        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
            
            const mouseMoveHandler = (e) => {
                if (isDragging) updateSlider(e.clientX);
            };
            
            const mouseUpHandler = () => {
                isDragging = false;
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };
            
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
        
        // Touch events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
            
            const touchMoveHandler = (e) => {
                if (isDragging && e.touches[0]) {
                    updateSlider(e.touches[0].clientX);
                }
            };
            
            const touchEndHandler = () => {
                isDragging = false;
                document.removeEventListener('touchmove', touchMoveHandler);
                document.removeEventListener('touchend', touchEndHandler);
            };
            
            document.addEventListener('touchmove', touchMoveHandler, { passive: false });
            document.addEventListener('touchend', touchEndHandler);
        });
        
        // Auto-demo animation
        let autoSlideInterval;
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                if (!isDragging) {
                    const targetX = currentX === 50 ? (Math.random() > 0.5 ? 20 : 80) : 50;
                    this.animateSliderTo(slider, currentX, targetX, (progress) => {
                        currentX = progress;
                        handle.style.left = `${progress}%`;
                        afterImage.style.clipPath = `inset(0 ${100 - progress}% 0 0)`;
                    });
                }
            }, 5000);
        };
        
        // Start auto-slide when visible
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
    }
    
    animateSliderTo(slider, fromX, toX, updateCallback) {
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function
            const easedProgress = this.easeInOutCubic(progress);
            const currentValue = fromX + (toX - fromX) * easedProgress;
            
            updateCallback(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// ========================================
// CONTACT FORM CLASS
// ========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initFormAnimations();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Form field animations
        const formFields = this.form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', () => this.onFieldFocus(field));
            field.addEventListener('blur', () => this.onFieldBlur(field));
            field.addEventListener('input', () => this.onFieldInput(field));
        });
    }
    
    onFieldFocus(field) {
        field.style.transform = 'translateY(-2px)';
        field.style.boxShadow = '0 8px 25px rgba(255, 158, 24, 0.15)';
    }
    
    onFieldBlur(field) {
        field.style.transform = 'translateY(0)';
        field.style.boxShadow = '';
        this.validateField(field);
    }
    
    onFieldInput(field) {
        this.clearFieldError(field);
    }
    
    initFormAnimations() {
        // Add subtle entrance animations to form fields
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                group.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });
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
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#EF4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #EF4444;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const formFields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        formFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please correct the errors above', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        this.submitForm(data);
    }
    
    submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.opacity = '0.7';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            this.showNotification('Thank you! We\'ll be in touch within 24 hours.', 'success');
            
            // Reset form
            setTimeout(() => {
                this.form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.opacity = '';
                submitBtn.style.background = '';
            }, 3000);
            
            console.log('Contact form submitted:', data);
        }, 2000);
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'}" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
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
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

// ========================================
// MAGNETIC EFFECTS CLASS
// ========================================

class MagneticEffects {
    constructor() {
        this.magneticElements = [];
        this.strength = 0.3;
        this.isEnabled = !window.matchMedia('(max-width: 768px)').matches;
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            this.magneticElements = document.querySelectorAll('.magnetic-button, .magnetic-card');
            this.magneticElements.forEach(element => {
                if (element) {
                    this.addMagneticEffect(element);
                }
            });
        }, 100);
    }
    
    addMagneticEffect(element) {
        if (!element) return;
        
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.1s ease-out';
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * this.strength;
            const moveY = y * this.strength;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.transform = 'translate(0px, 0px)';
        });
    }
    
    onResize() {
        // Disable magnetic effects on mobile
        this.isEnabled = !window.matchMedia('(max-width: 768px)').matches;
        
        if (!this.isEnabled) {
            this.magneticElements.forEach(element => {
                if (element) {
                    element.style.transform = '';
                    element.style.transition = '';
                }
            });
        } else {
            this.init();
        }
    }
}

// ========================================
// SMOOTH SCROLLING ENHANCEMENT CLASS
// ========================================

class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (window.app) {
                    window.app.smoothScrollTo(target);
                } else {
                    EviaUtils.smoothScrollTo(target);
                }
            }
        });
        
        // Handle service buttons
        setTimeout(() => {
            const serviceButtons = document.querySelectorAll('.service-btn');
            serviceButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.app) {
                        window.app.smoothScrollTo('#contact');
                    } else {
                        EviaUtils.smoothScrollTo('#contact');
                    }
                });
            });
        }, 500);
    }
}

// ========================================
// PERFORMANCE OPTIMIZER CLASS
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.handleReducedMotion();
        this.optimizeAnimations();
    }
    
    optimizeImages() {
        // Lazy load images if not using data-src
        const images = document.querySelectorAll('img:not([data-src])');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '1';
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease-out';
                imageObserver.observe(img);
            });
        }
    }
    
    handleReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            
            // Disable complex animations
            const orbs = document.querySelectorAll('.orb, .decoration-orb, .medspa-icon');
            orbs.forEach(orb => {
                orb.style.animation = 'none';
                orb.style.opacity = '0.1';
            });
        }
    }
    
    optimizeAnimations() {
        // Use will-change for animated elements
        const animatedElements = document.querySelectorAll('.orb, .floating-credential, .stat-pill, .medspa-icon, .preloader-logo');
        animatedElements.forEach(element => {
            if (element) {
                element.style.willChange = 'transform';
            }
        });
        
        // Remove will-change after animations complete
        setTimeout(() => {
            animatedElements.forEach(element => {
                if (element) {
                    element.style.willChange = 'auto';
                }
            });
        }, 5000);
    }
}

// ========================================
// INITIALIZE APPLICATION
// ========================================

// Create global app instance
let app;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    try {
        // Create global app instance
        app = new EviaLuxuryApp();
        window.app = app; // Make globally accessible
        
        // Initialize additional components
        new SmoothScrolling();
        new PerformanceOptimizer();
        
        console.log('🎭 Evia Luxury Application Successfully Initialized');
        
    } catch (error) {
        console.error('❌ Failed to initialize Evia Luxury App:', error);
        
        // Fallback initialization
        setTimeout(() => {
            try {
                app = new EviaLuxuryApp();
                window.app = app;
                console.log('✅ Fallback initialization successful');
            } catch (fallbackError) {
                console.error('❌ Fallback initialization also failed:', fallbackError);
            }
        }, 1000);
    }
}

// Debug helper in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.EviaDebug = {
        app: () => window.app,
        components: () => window.app ? window.app.components : {},
        utils: () => EviaUtils,
        version: '3.0.0 - Enhanced Cinematic Hero Edition'
    };
    
    console.log('🔧 Evia Luxury Debug Mode Enabled');
    console.log('✨ Use window.EviaDebug to access debug tools');
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EviaLuxuryApp, EviaUtils };
}
