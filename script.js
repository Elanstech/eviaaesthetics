// ========================================
// LUXURY MANHATTAN MED SPA - ORGANIZED JAVASCRIPT
// ========================================

'use strict';

// ========================================
// GLOBAL APPLICATION OBJECT & UTILITIES
// ========================================

const LuxuryMedSpa = {
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
                
                const easeProgress = LuxuryMedSpa.utils.easeInOutCubic(progress);
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
        
        // Generate random ID
        generateId: () => {
            return Math.random().toString(36).substr(2, 9);
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
        },

        // Add ripple effect to buttons
        addRippleEffect: (element) => {
            if (!element) return;
            
            element.addEventListener('click', function(e) {
                // Remove existing ripple
                const existingRipple = this.querySelector('.ripple-wave');
                if (existingRipple) {
                    existingRipple.remove();
                }
                
                // Create ripple element
                const ripple = document.createElement('div');
                ripple.className = 'ripple-wave';
                
                // Get click position relative to button
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Set ripple position and size
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    left: ${x - size / 2}px;
                    top: ${y - size / 2}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                    z-index: 0;
                `;
                
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }
    }
};

// ========================================
// PRELOADER SECTION
// ========================================

class LuxuryPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressBar = document.getElementById('loadingProgress');
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
        }, LuxuryMedSpa.settings.preloaderMinTime);
        
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
            
            if (this.progress >= 95 || this.isComplete) {
                clearInterval(interval);
                if (this.isComplete && this.progressBar) {
                    this.progressBar.style.width = '100%';
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
        
        if (this.assetsReady && timePassed >= LuxuryMedSpa.settings.preloaderMinTime && !this.isComplete) {
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
        LuxuryMedSpa.isLoaded = true;
        window.dispatchEvent(new CustomEvent('spaLoaded'));
        
        // Start hero animations
        if (LuxuryMedSpa.components.hero) {
            LuxuryMedSpa.components.hero.startAnimations();
        }
        
        console.log('🌟 Enhanced Luxury Med Spa Loaded Successfully');
    }
}

// ========================================
// HEADER SECTION
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
        const scrollHandler = LuxuryMedSpa.utils.throttle(() => {
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
                if (LuxuryMedSpa.components.modal) {
                    LuxuryMedSpa.components.modal.openBookingModal();
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
            LuxuryMedSpa.utils.addMagneticEffect(logoBubble, 0.2);
        }
        if (phoneBubble) {
            LuxuryMedSpa.utils.addMagneticEffect(phoneBubble, 0.15);
        }
        if (headerCTA) {
            LuxuryMedSpa.utils.addMagneticEffect(headerCTA, 0.2);
            LuxuryMedSpa.utils.addRippleEffect(headerCTA);
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > LuxuryMedSpa.settings.scrollThreshold;
        
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
        LuxuryMedSpa.scrollY = scrollY;
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
        
        LuxuryMedSpa.utils.smoothScrollTo(element, offset);
    }
    
    scrollToTop() {
        LuxuryMedSpa.utils.smoothScrollTo(document.body, 0);
    }
}

// ========================================
// MOBILE MENU SECTION
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
                        if (LuxuryMedSpa.components.header) {
                            LuxuryMedSpa.components.header.navigateToSection(href);
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
            LuxuryMedSpa.utils.addRippleEffect(mobileCTA);
            mobileCTA.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    if (LuxuryMedSpa.components.modal) {
                        LuxuryMedSpa.components.modal.openBookingModal();
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
// HERO SECTION
// ========================================

class HeroSection {
    constructor() {
        this.video = document.querySelector('.hero-video');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.animatedElements = document.querySelectorAll('[class*="animate-"]');
        
        this.statsAnimated = false;
        this.animationsTriggered = false;
        
        this.init();
    }
    
    init() {
        this.initVideo();
        this.initButtons();
        this.initScrollIndicator();
        this.observeStats();
        this.initHeroAnimations();
        this.initMagneticEffects();
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
            // Show fallback if available
            const fallback = document.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.opacity = '1';
            }
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
        // Hero booking button
        const heroBooking = document.getElementById('heroBooking');
        if (heroBooking) {
            LuxuryMedSpa.utils.addMagneticEffect(heroBooking, 0.3);
            LuxuryMedSpa.utils.addRippleEffect(heroBooking);
            heroBooking.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modal) {
                    LuxuryMedSpa.components.modal.openBookingModal();
                }
            });
        }
        
        // Virtual tour button
        const virtualTour = document.getElementById('virtualTour');
        if (virtualTour) {
            LuxuryMedSpa.utils.addMagneticEffect(virtualTour, 0.25);
            virtualTour.addEventListener('click', () => {
                this.showVirtualTour();
            });
        }

        // Add magnetic effects to all CTA bubbles
        const ctaBubbles = document.querySelectorAll('.cta-bubble.magnetic-btn');
        ctaBubbles.forEach(btn => {
            LuxuryMedSpa.utils.addMagneticEffect(btn, 0.2);
            LuxuryMedSpa.utils.addRippleEffect(btn);
        });
    }
    
    showVirtualTour() {
        // Placeholder for virtual tour functionality
        const tourUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with actual tour
        window.open(tourUrl, '_blank');
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.querySelector('#services');
            if (servicesSection && LuxuryMedSpa.components.header) {
                LuxuryMedSpa.components.header.navigateToSection('#services');
            }
        });
        
        // Hide scroll indicator on scroll
        const scrollHandler = LuxuryMedSpa.utils.throttle(() => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 400));
            this.scrollIndicator.style.opacity = opacity;
            this.scrollIndicator.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        }, 16);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    initHeroAnimations() {
        // Professional entrance animations with proper delays
        this.animatedElements.forEach(element => {
            const delay = element.dataset.delay || 0;
            element.style.animationDelay = delay + 'ms';
        });
    }

    initMagneticEffects() {
        // Add magnetic effects to stat bubbles
        const statBubbles = document.querySelectorAll('.stat-bubble');
        statBubbles.forEach(bubble => {
            LuxuryMedSpa.utils.addMagneticEffect(bubble, 0.1);
        });

        // Add magnetic effects to credential badge
        const credentialBadge = document.querySelector('.medical-credential-badge');
        if (credentialBadge) {
            LuxuryMedSpa.utils.addMagneticEffect(credentialBadge, 0.15);
        }
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
        
        const statsContainer = document.querySelector('.hero-stats-container');
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
        const target = parseInt(counter.dataset.count);
        if (!target) return;
        
        const duration = 2500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = LuxuryMedSpa.utils.easeInOutCubic(progress);
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
    
    startAnimations() {
        // Called after preloader completes
        if (this.animationsTriggered) return;
        this.animationsTriggered = true;
        
        console.log('Hero animations started');
    }
}

// ========================================
// MODERN SERVICES CAROUSEL SECTION
// ========================================

class ModernServicesCarousel {
    constructor() {
        this.carouselContainer = document.querySelector('.services-carousel-container');
        this.swiperElement = document.querySelector('.services-swiper');
        this.serviceCards = document.querySelectorAll('.luxury-service-card');
        this.serviceButtons = document.querySelectorAll('.service-cta-luxury');
        
        this.swiper = null;
        
        this.init();
    }
    
    init() {
        if (!this.swiperElement) return;
        
        this.initSwiper();
        this.initServiceCards();
        this.initServiceButtons();
        this.initMagneticEffects();
        this.initIntersectionObserver();
    }
    
    initSwiper() {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper not loaded, falling back to basic functionality');
            return;
        }
        
        this.swiper = new Swiper('.services-swiper', {
            // Basic settings
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            
            // Responsive breakpoints
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                }
            },
            
            // Autoplay
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            
            // Effects
            effect: 'slide',
            speed: 800,
            
            // Navigation
            navigation: {
                nextEl: '.services-nav-next',
                prevEl: '.services-nav-prev',
            },
            
            // Pagination
            pagination: {
                el: '.services-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Accessibility
            a11y: {
                enabled: true,
                prevSlideMessage: 'Previous service',
                nextSlideMessage: 'Next service',
            },
            
            // Events
            on: {
                slideChange: () => {
                    this.onSlideChange();
                },
                
                slideChangeTransitionEnd: () => {
                    this.onSlideChangeEnd();
                }
            }
        });
        
        console.log('🎠 Services carousel initialized');
    }
    
    onSlideChange() {
        // Add any slide change animations here
        const activeSlide = this.swiperElement.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const card = activeSlide.querySelector('.luxury-service-card');
            if (card) {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 300);
            }
        }
    }
    
    onSlideChangeEnd() {
        // Reset any transformations after slide change
        const allCards = this.swiperElement.querySelectorAll('.luxury-service-card');
        allCards.forEach(card => {
            card.style.transform = '';
        });
    }
    
    initServiceCards() {
        this.serviceCards.forEach((card, index) => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.onCardHover(card);
                // Pause autoplay on hover
                if (this.swiper && this.swiper.autoplay) {
                    this.swiper.autoplay.stop();
                }
            });
            
            card.addEventListener('mouseleave', () => {
                this.onCardLeave(card);
                // Resume autoplay
                if (this.swiper && this.swiper.autoplay) {
                    this.swiper.autoplay.start();
                }
            });
            
            // Add click handler for entire card
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (!e.target.closest('.service-cta-luxury')) {
                    const button = card.querySelector('.service-cta-luxury');
                    if (button) {
                        button.click();
                    }
                }
            });
        });
    }
    
    onCardHover(card) {
        // Add additional hover animations
        const icon = card.querySelector('.service-icon-luxury');
        const image = card.querySelector('.service-bg-image');
        
        if (icon) {
            icon.style.transform = 'translateY(-5px) scale(1.1)';
        }
        
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
    }
    
    onCardLeave(card) {
        // Reset animations
        const icon = card.querySelector('.service-icon-luxury');
        const image = card.querySelector('.service-bg-image');
        
        if (icon) {
            icon.style.transform = '';
        }
        
        if (image) {
            image.style.transform = '';
        }
    }
    
    initServiceButtons() {
        this.serviceButtons.forEach(button => {
            // Add ripple effect
            LuxuryMedSpa.utils.addRippleEffect(button);
            
            // Add magnetic effect
            LuxuryMedSpa.utils.addMagneticEffect(button, 0.15);
            
            // Add click handler
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const service = button.dataset.service;
                this.handleServiceClick(service, button);
            });
        });
    }
    
    handleServiceClick(service, button) {
        // Add loading state
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate service selection and open modal
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
            
            // Pre-select service in modal if available
            if (LuxuryMedSpa.components.modal) {
                LuxuryMedSpa.components.modal.openBookingModal(service);
            }
        }, 800);
        
        // Analytics tracking (placeholder)
        console.log(`Service selected: ${service}`);
        
        // Optional: Track with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_click', {
                'service_type': service,
                'event_category': 'engagement'
            });
        }
    }
    
    initMagneticEffects() {
        // Add magnetic effects to service icons
        const serviceIcons = document.querySelectorAll('.service-icon-luxury');
        serviceIcons.forEach(icon => {
            LuxuryMedSpa.utils.addMagneticEffect(icon, 0.1);
        });
        
        // Add magnetic effects to navigation buttons
        const navButtons = document.querySelectorAll('.services-nav-next, .services-nav-prev');
        navButtons.forEach(btn => {
            LuxuryMedSpa.utils.addMagneticEffect(btn, 0.2);
        });
    }
    
    initIntersectionObserver() {
        // Enhanced entrance animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.classList.add('animated');
                    }, index * 150);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.serviceCards.forEach(card => {
            // Set initial state for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            observer.observe(card);
        });
    }
    
    // Public methods for external control
    goToSlide(index) {
        if (this.swiper) {
            this.swiper.slideTo(index);
        }
    }
    
    nextSlide() {
        if (this.swiper) {
            this.swiper.slideNext();
        }
    }
    
    prevSlide() {
        if (this.swiper) {
            this.swiper.slidePrev();
        }
    }
    
    pauseAutoplay() {
        if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.stop();
        }
    }
    
    resumeAutoplay() {
        if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.start();
        }
    }
    
    destroy() {
        if (this.swiper) {
            this.swiper.destroy();
            this.swiper = null;
        }
    }
}

// ========================================
// ENHANCED BUTTON SYSTEM
// ========================================

class EnhancedButtons {
    constructor() {
        this.init();
    }

    init() {
        this.initModernButtons();
        this.initServiceButtons();
        this.initFilterTabs();
    }

    initModernButtons() {
        const modernButtons = document.querySelectorAll('.modern-btn');
        modernButtons.forEach(btn => {
            LuxuryMedSpa.utils.addRippleEffect(btn);
            
            // Add hover sound effect (optional)
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    initServiceButtons() {
        const serviceButtons = document.querySelectorAll('.service-cta:not(.service-cta-luxury)');
        serviceButtons.forEach(btn => {
            LuxuryMedSpa.utils.addRippleEffect(btn);
            btn.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modal) {
                    LuxuryMedSpa.components.modal.openBookingModal();
                }
            });
        });
    }

    initFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            LuxuryMedSpa.utils.addRippleEffect(tab);
        });
    }
}

// ========================================
// RESULTS GALLERY SECTION
// ========================================

class ResultsGallery {
    constructor() {
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.resultItems = document.querySelectorAll('.result-bubble');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        if (!this.filterTabs.length) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.dataset.filter;
                this.setActiveFilter(filter);
                this.filterResults(filter);
            });
        });
    }
    
    setActiveFilter(filter) {
        this.filterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });
        this.activeFilter = filter;
    }
    
    filterResults(filter) {
        this.resultItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = '';
                item.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// ========================================
// MODAL SYSTEM
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
        const bookingTriggers = document.querySelectorAll('[data-booking], .service-cta:not(.service-cta-luxury)');
        bookingTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openBookingModal();
            });
        });
    }

    initFormEnhancements() {
        if (!this.form) return;
        
        // Add ripple effect to submit button
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            LuxuryMedSpa.utils.addRippleEffect(submitBtn);
            LuxuryMedSpa.utils.addMagneticEffect(submitBtn, 0.15);
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
                // Map service data attributes to select values
                const serviceMap = {
                    'botox': 'botox',
                    'weight-loss': 'weightloss',
                    'iv-therapy': 'iv',
                    'microneedling': 'microneedling',
                    'prp': 'prp',
                    'chemical-peels': 'peels'
                };
                
                const selectValue = serviceMap[preSelectedService];
                if (selectValue) {
                    serviceSelect.value = selectValue;
                }
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
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// ========================================
// FLOATING BOOKING BUTTON
// ========================================

class FloatingBooking {
    constructor() {
        this.button = document.getElementById('floatingBook');
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        this.bindEvents();
        this.checkVisibility();
        this.initEnhancements();
    }
    
    bindEvents() {
        // Click event
        this.button.addEventListener('click', () => {
            if (LuxuryMedSpa.components.modal) {
                LuxuryMedSpa.components.modal.openBookingModal();
            }
        });
        
        // Show/hide based on scroll
        const scrollHandler = LuxuryMedSpa.utils.throttle(() => {
            this.checkVisibility();
        }, 100);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    initEnhancements() {
        const floatCTA = this.button.querySelector('.float-cta');
        if (floatCTA) {
            LuxuryMedSpa.utils.addMagneticEffect(floatCTA, 0.3);
            LuxuryMedSpa.utils.addRippleEffect(floatCTA);
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
        this.button.classList.add('visible');
    }
    
    hide() {
        this.isVisible = false;
        this.button.classList.remove('visible');
    }
}

// ========================================
// CONTACT FORM SECTION
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
            LuxuryMedSpa.utils.addMagneticEffect(submitBtn, 0.2);
            LuxuryMedSpa.utils.addRippleEffect(submitBtn);
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
        if (LuxuryMedSpa.components.modal) {
            LuxuryMedSpa.components.modal.showNotification(message, type);
        }
    }
}

// ========================================
// ANIMATION OBSERVER
// ========================================

class AnimationObserver {
    constructor() {
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        // Observe counter elements
        this.observeCounters();
        
        // Observe bubbles for entrance animations
        this.observeBubbles();

        // Observe scroll-triggered animations
        this.observeScrollAnimations();
    }
    
    observeCounters() {
        const counters = document.querySelectorAll('[data-count]:not(.stat-number)');
        
        counters.forEach(counter => {
            this.observeElement(counter, () => {
                if (!this.animatedElements.has(counter)) {
                    this.animateCounter(counter);
                    this.animatedElements.add(counter);
                }
            });
        });
    }
    
    observeBubbles() {
        const bubbles = document.querySelectorAll('.service-bubble, .offer-bubble, .experience-bubble');
        
        bubbles.forEach((bubble, index) => {
            this.observeElement(bubble, () => {
                if (!this.animatedElements.has(bubble)) {
                    bubble.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s both`;
                    this.animatedElements.add(bubble);
                }
            }, 0.2);
        });
    }

    observeScrollAnimations() {
        const elements = document.querySelectorAll('.rating-bubble, .contact-bubble, .credential-bubble');
        
        elements.forEach((element, index) => {
            this.observeElement(element, () => {
                if (!this.animatedElements.has(element)) {
                    element.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                    this.animatedElements.add(element);
                }
            }, 0.3);
        });
    }
    
    observeElement(element, callback, threshold = 0.3) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(element);
                }
            });
        }, { threshold });
        
        observer.observe(element);
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        if (!target) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = LuxuryMedSpa.utils.easeInOutCubic(progress);
            const currentValue = Math.floor(easeProgress * target);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ========================================
// APPLICATION INITIALIZER
// ========================================

class LuxuryMedSpaApp {
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
        
        console.log('🌟 Initializing Enhanced Luxury Med Spa Application...');
        
        try {
            // Add required CSS for animations
            this.injectAnimationCSS();
            
            // Initialize all components
            LuxuryMedSpa.components = {
                preloader: new LuxuryPreloader(),
                header: new LuxuryHeader(),
                mobileMenu: new MobileMenu(),
                hero: new HeroSection(),
                modernServicesCarousel: new ModernServicesCarousel(), // NEW COMPONENT
                enhancedButtons: new EnhancedButtons(),
                resultsGallery: new ResultsGallery(),
                modal: new ModalSystem(),
                floatingBooking: new FloatingBooking(),
                contactForm: new ContactForm(),
                animationObserver: new AnimationObserver()
            };
            
            // Global event listeners
            this.bindGlobalEvents();
            
            // Performance optimizations
            this.initPerformanceOptimizations();
            
            this.isInitialized = true;
            
            console.log('✅ Enhanced Luxury Med Spa Application Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
    }

    injectAnimationCSS() {
        const animationCSS = `
            @keyframes ripple-animation {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
            
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
        style.textContent = animationCSS;
        document.head.appendChild(style);
    }
    
    bindGlobalEvents() {
        // Window resize handler
        const resizeHandler = LuxuryMedSpa.utils.debounce(() => {
            LuxuryMedSpa.isMobile = window.innerWidth <= 768;
            
            // Dispatch resize event for components
            window.dispatchEvent(new CustomEvent('appResize', {
                detail: { isMobile: LuxuryMedSpa.isMobile }
            }));
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
        
        // Global click handler for smooth anchors
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (LuxuryMedSpa.components.header) {
                    LuxuryMedSpa.components.header.navigateToSection(target);
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
                
                // Pause carousel autoplay
                if (LuxuryMedSpa.components.modernServicesCarousel) {
                    LuxuryMedSpa.components.modernServicesCarousel.pauseAutoplay();
                }
            } else {
                // Resume videos when tab is visible
                videos.forEach(video => {
                    if (video.dataset.wasPlaying === 'true') {
                        video.play().catch(() => {});
                        delete video.dataset.wasPlaying;
                    }
                });
                
                // Resume carousel autoplay
                if (LuxuryMedSpa.components.modernServicesCarousel) {
                    LuxuryMedSpa.components.modernServicesCarousel.resumeAutoplay();
                }
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
        
        // Preload critical resources
        this.preloadCriticalResources();
        
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
    
    preloadCriticalResources() {
        // Preload hero video poster
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && heroVideo.poster) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroVideo.poster;
            document.head.appendChild(link);
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
                
                // Disable carousel autoplay for slow connections
                if (LuxuryMedSpa.components.modernServicesCarousel) {
                    LuxuryMedSpa.components.modernServicesCarousel.pauseAutoplay();
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
const app = new LuxuryMedSpaApp();

// Export for global access
window.LuxuryMedSpa = LuxuryMedSpa;

// Debug helper in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.LuxuryMedSpaDebug = {
        components: () => LuxuryMedSpa.components,
        settings: () => LuxuryMedSpa.settings,
        utils: () => LuxuryMedSpa.utils,
        carousel: () => LuxuryMedSpa.components.modernServicesCarousel,
        version: '3.0.0 - Enhanced with Modern Services Carousel'
    };
    
    console.log('🔧 Debug mode enabled. Use window.LuxuryMedSpaDebug for debugging.');
    console.log('🎠 Carousel controls available via window.LuxuryMedSpaDebug.carousel()');
}
