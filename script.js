/*
* Evia Aesthetics - Luxury Medical Spa JavaScript
* Version: 5.0 - Premium Functionality
* Focus: Preloader through Hero Section
*/

'use strict';

// ==============================
// MAIN APPLICATION CLASS
// ==============================
class EviaAesthetics {
    constructor() {
        // State management
        this.state = {
            isLoading: true,
            isScrolled: false,
            isMobileMenuOpen: false,
            currentScrollPosition: 0,
            lastScrollPosition: 0,
            isVideoLoaded: false,
            countersAnimated: false
        };

        // DOM Elements cache
        this.elements = {};
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // ==============================
    // INITIALIZATION
    // ==============================
    init() {
        console.log('🌟 Initializing Evia Aesthetics...');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Initialize components
        this.initPreloader();
        this.initHeader();
        this.initNavigation();
        this.initMobileMenu();
        this.initHeroSection();
        this.initSmoothScroll();
        this.initEventListeners();
        
        console.log('✨ Evia Aesthetics initialized successfully!');
    }

    cacheElements() {
        this.elements = {
            // Preloader
            preloader: document.querySelector('.preloader'),
            preloaderProgress: document.querySelector('.preloader-progress-bar'),
            preloaderPercentage: document.querySelector('.loading-percentage'),
            
            // Header
            header: document.querySelector('.luxury-header'),
            headerLogo: document.querySelector('.header-logo'),
            navItems: document.querySelectorAll('.nav-item'),
            navLinks: document.querySelectorAll('.nav-link'),
            
            // Mobile Menu
            mobileToggle: document.querySelector('.mobile-menu-toggle'),
            mobileMenu: document.querySelector('.mobile-menu'),
            mobileClose: document.querySelector('.mobile-menu-close'),
            mobileNavItems: document.querySelectorAll('.mobile-nav-item'),
            
            // Hero
            heroSection: document.querySelector('.luxury-hero'),
            heroVideo: document.querySelector('.hero-bg-video video'),
            heroVideoWrapper: document.querySelector('.hero-bg-video'),
            statNumbers: document.querySelectorAll('.stat-number'),
            
            // General
            body: document.body,
            scrollIndicator: document.querySelector('.scroll-indicator')
        };
    }

    // ==============================
    // PRELOADER
    // ==============================
    initPreloader() {
        if (!this.elements.preloader) return;

        let progress = 0;
        const duration = 2000; // 2 seconds
        const interval = 20; // Update every 20ms
        const increment = (100 / duration) * interval;

        // Prevent scrolling while loading
        this.elements.body.classList.add('loading');

        // Simulate loading progress
        const loadingInterval = setInterval(() => {
            progress += increment;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                this.completePreloader();
            }
            
            this.updatePreloaderProgress(progress);
        }, interval);

        // Fallback: ensure preloader completes
        setTimeout(() => {
            if (this.state.isLoading) {
                clearInterval(loadingInterval);
                this.completePreloader();
            }
        }, 3000);
    }

    updatePreloaderProgress(progress) {
        const roundedProgress = Math.round(progress);
        
        if (this.elements.preloaderProgress) {
            this.elements.preloaderProgress.style.width = `${progress}%`;
        }
        
        if (this.elements.preloaderPercentage) {
            this.elements.preloaderPercentage.textContent = `${roundedProgress}%`;
        }
    }

    completePreloader() {
        // Mark loading as complete
        this.state.isLoading = false;
        
        // Fade out preloader
        this.elements.preloader.classList.add('fade-out');
        
        // Remove preloader and show content
        setTimeout(() => {
            this.elements.preloader.style.display = 'none';
            this.elements.body.classList.remove('loading');
            this.elements.body.classList.add('loaded');
            
            // Initialize animations that depend on page load
            this.initHeroAnimations();
            this.observeStatCounters();
        }, 500);
    }

    // ==============================
    // HEADER
    // ==============================
    initHeader() {
        if (!this.elements.header) return;

        // Initial check
        this.checkHeaderScroll();

        // Throttled scroll handler
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.checkHeaderScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    checkHeaderScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = 50;

        // Update scroll state
        this.state.lastScrollPosition = this.state.currentScrollPosition;
        this.state.currentScrollPosition = scrollPosition;

        // Add/remove scrolled class
        if (scrollPosition > scrollThreshold && !this.state.isScrolled) {
            this.state.isScrolled = true;
            this.elements.header.classList.add('scrolled');
        } else if (scrollPosition <= scrollThreshold && this.state.isScrolled) {
            this.state.isScrolled = false;
            this.elements.header.classList.remove('scrolled');
        }
    }

    // ==============================
    // NAVIGATION
    // ==============================
    initNavigation() {
        // Desktop navigation dropdowns
        const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
        
        dropdownItems.forEach(item => {
            let hoverTimeout;
            
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                this.showDropdown(item);
            });
            
            item.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    this.hideDropdown(item);
                }, 200);
            });
        });

        // Active navigation state
        this.updateActiveNavigation();
        
        // Update on scroll
        window.addEventListener('scroll', this.debounce(() => {
            this.updateActiveNavigation();
        }, 100));
    }

    showDropdown(item) {
        const dropdown = item.querySelector('.dropdown-menu');
        if (!dropdown) return;

        // Use GSAP if available, fallback to CSS
        if (typeof gsap !== 'undefined') {
            gsap.set(dropdown, { display: 'block' });
            gsap.to(dropdown, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    hideDropdown(item) {
        const dropdown = item.querySelector('.dropdown-menu');
        if (!dropdown) return;

        if (typeof gsap !== 'undefined') {
            gsap.to(dropdown, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    gsap.set(dropdown, { display: 'none' });
                }
            });
        }
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all items
                this.elements.navItems.forEach(item => item.classList.remove('active'));
                this.elements.mobileNavItems.forEach(item => item.classList.remove('active'));

                // Add active class to current section
                const activeItems = document.querySelectorAll(`a[href="#${sectionId}"]`);
                activeItems.forEach(item => {
                    item.closest('.nav-item, .mobile-nav-item')?.classList.add('active');
                });
            }
        });
    }

    // ==============================
    // MOBILE MENU
    // ==============================
    initMobileMenu() {
        if (!this.elements.mobileToggle || !this.elements.mobileMenu) return;

        // Toggle mobile menu
        this.elements.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu
        this.elements.mobileClose?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Close on overlay click
        this.elements.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.elements.mobileMenu) {
                this.closeMobileMenu();
            }
        });

        // Handle submenu toggles
        const submenuToggles = document.querySelectorAll('.mobile-nav-item.has-submenu > a');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = toggle.closest('.mobile-nav-item');
                parent.classList.toggle('active');
                
                // Close other submenus
                const siblings = parent.parentElement.querySelectorAll('.mobile-nav-item.has-submenu');
                siblings.forEach(sibling => {
                    if (sibling !== parent) {
                        sibling.classList.remove('active');
                    }
                });
            });
        });

        // Close menu on navigation
        const mobileLinks = this.elements.mobileMenu.querySelectorAll('a[href^="#"]:not(.submenu-toggle)');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 300);
            });
        });
    }

    toggleMobileMenu() {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        
        if (this.state.isMobileMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        this.elements.mobileToggle.classList.add('active');
        this.elements.mobileMenu.classList.add('active');
        this.elements.body.classList.add('menu-open');
        
        // Animate menu items
        if (typeof gsap !== 'undefined') {
            const menuItems = this.elements.mobileMenu.querySelectorAll('.mobile-nav-item, .btn-mobile-cta, .mobile-contact-info a, .mobile-social a');
            
            gsap.fromTo(menuItems, 
                {
                    opacity: 0,
                    x: -30
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'power2.out',
                    delay: 0.2
                }
            );
        }
    }

    closeMobileMenu() {
        this.elements.mobileToggle.classList.remove('active');
        this.elements.mobileMenu.classList.remove('active');
        this.elements.body.classList.remove('menu-open');
        this.state.isMobileMenuOpen = false;
    }

    // ==============================
    // HERO SECTION
    // ==============================
    initHeroSection() {
        this.initHeroVideo();
        this.initScrollIndicator();
        this.initHeroButtons();
    }

    initHeroVideo() {
        if (!this.elements.heroVideo) return;

        // Handle video loading
        this.elements.heroVideo.addEventListener('loadeddata', () => {
            this.state.isVideoLoaded = true;
            this.elements.heroVideoWrapper?.classList.add('loaded');
        });

        // Fallback for slow connections
        setTimeout(() => {
            if (!this.state.isVideoLoaded && this.elements.heroVideoWrapper) {
                this.elements.heroVideoWrapper.classList.add('loaded');
            }
        }, 3000);

        // Ensure video plays on user interaction if autoplay fails
        document.addEventListener('click', () => {
            if (this.elements.heroVideo.paused) {
                this.elements.heroVideo.play().catch(() => {
                    // Silently handle autoplay errors
                });
            }
        }, { once: true });
    }

    initHeroAnimations() {
        // Animate hero elements after page load
        if (typeof gsap !== 'undefined') {
            // Create timeline for hero animations
            const heroTl = gsap.timeline({ delay: 0.5 });

            // Badge animation
            heroTl.from('.hero-badge', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            });

            // Title animations
            heroTl.from('.title-line-1', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.title-line-2', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.6');

            // Description
            heroTl.from('.hero-description', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.6');

            // CTA buttons
            heroTl.from('.hero-cta > *', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.6');

            // Stats
            heroTl.from('.hero-stats', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.4');

            // Floating cards
            heroTl.from('.floating-card', {
                duration: 0.8,
                scale: 0,
                opacity: 0,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.4');

            // Hero image
            heroTl.from('.hero-image', {
                duration: 1,
                scale: 0.8,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.6');
        }
    }

    initScrollIndicator() {
        if (!this.elements.scrollIndicator) return;

        this.elements.scrollIndicator.addEventListener('click', () => {
            const heroHeight = this.elements.heroSection?.offsetHeight || window.innerHeight;
            
            window.scrollTo({
                top: heroHeight,
                behavior: 'smooth'
            });
        });

        // Hide scroll indicator on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled > 100) {
                this.elements.scrollIndicator.style.opacity = '0';
            } else {
                this.elements.scrollIndicator.style.opacity = '1';
            }
        }, { passive: true });
    }

    initHeroButtons() {
        // Primary CTA button
        const primaryBtn = document.querySelector('.hero-cta .btn-primary');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Open booking modal (to be implemented)
                console.log('Opening booking modal...');
            });
        }

        // Secondary button
        const secondaryBtn = document.querySelector('.hero-cta .btn-secondary');
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Scroll to treatments or play video
                const treatmentsSection = document.querySelector('#treatments-preview');
                if (treatmentsSection) {
                    treatmentsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // ==============================
    // COUNTER ANIMATIONS
    // ==============================
    observeStatCounters() {
        if (!this.elements.statNumbers.length) return;

        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.countersAnimated) {
                    this.state.countersAnimated = true;
                    this.animateCounters();
                    counterObserver.disconnect();
                }
            });
        }, observerOptions);

        // Observe the stats container
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            counterObserver.observe(statsContainer);
        }
    }

    animateCounters() {
        this.elements.statNumbers.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                
                // Add suffix if needed
                if (element.nextElementSibling?.classList.contains('stat-label')) {
                    const label = element.nextElementSibling.textContent.toLowerCase();
                    if (label.includes('clients')) {
                        element.textContent = target.toLocaleString() + '+';
                    } else if (label.includes('reviews')) {
                        element.textContent = target + 'K+';
                    } else {
                        element.textContent = target + '+';
                    }
                }
            }
        };

        updateCounter();
    }

    // ==============================
    // SMOOTH SCROLL
    // ==============================
    initSmoothScroll() {
        // Handle all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            
            const headerHeight = this.elements.header?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    // ==============================
    // EVENT LISTENERS
    // ==============================
    initEventListeners() {
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            }
        });

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.elements.heroVideo) {
                this.elements.heroVideo.play().catch(() => {});
            }
        });
    }

    handleResize() {
        // Close mobile menu on desktop resize
        if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Refresh scroll-based calculations
        this.checkHeaderScroll();
        this.updateActiveNavigation();
    }

    // ==============================
    // UTILITY FUNCTIONS
    // ==============================
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
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ==============================
// INITIALIZE APPLICATION
// ==============================
const eviaApp = new EviaAesthetics();

// Export for global access if needed
window.EviaAesthetics = eviaApp;

// Log successful initialization
console.log('%c✨ Evia Aesthetics - Luxury Med Spa Experience Loaded', 
    'color: #C9A961; font-size: 16px; font-weight: bold; padding: 10px; background: #2C1810; border-radius: 4px;');

// ==============================
// GSAP ENHANCEMENTS (if available)
// ==============================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effects for hero background
    gsap.to('.hero-bg-pattern', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.luxury-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Floating animation for cards
    gsap.utils.toArray('.floating-card').forEach((card, index) => {
        gsap.to(card, {
            y: -20,
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });
}

// ==============================
// PERFORMANCE MONITORING
// ==============================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`📊 Page load time: ${pageLoadTime}ms`);
        }, 0);
    });
}
