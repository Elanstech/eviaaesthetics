// ========================================
// LUXURY MANHATTAN MED SPA - ENHANCED JAVASCRIPT
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
        preloaderMinTime: 2500,
        scrollThreshold: 50,
        animationDuration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        particleCount: 50
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
        
        // Easing functions
        easeInOutCubic: (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        },
        
        easeOutExpo: (t) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        },
        
        easeOutBack: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        },
        
        // Check if element is in viewport
        isInViewport: (element, threshold = 0) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) - threshold &&
                rect.bottom >= threshold &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth) - threshold &&
                rect.right >= threshold
            );
        },
        
        // Generate random ID
        generateId: () => {
            return Math.random().toString(36).substr(2, 9);
        },

        // Enhanced magnetic effect
        addMagneticEffect: (element, strength = 0.3) => {
            if (!element || LuxuryMedSpa.isMobile) return;
            
            let boundingRect = element.getBoundingClientRect();
            
            // Update bounding rect on window resize
            window.addEventListener('resize', () => {
                boundingRect = element.getBoundingClientRect();
            });
            
            element.addEventListener('mousemove', (e) => {
                const centerX = boundingRect.left + boundingRect.width / 2;
                const centerY = boundingRect.top + boundingRect.height / 2;
                
                const deltaX = (e.clientX - centerX) * strength;
                const deltaY = (e.clientY - centerY) * strength;
                
                gsap.to(element, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'elastic.out(1, 0.3)'
                });
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
        },

        // Lerp function for smooth animations
        lerp: (start, end, factor) => {
            return start + (end - start) * factor;
        }
    }
};

// ========================================
// ENHANCED PRELOADER
// ========================================

class EnhancedPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressBar = document.getElementById('loadingProgress');
        this.percentageText = document.querySelector('.loading-percentage');
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
        const targetProgress = 95;
        const duration = LuxuryMedSpa.settings.preloaderMinTime * 0.8;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            this.progress = LuxuryMedSpa.utils.easeOutExpo(progress) * targetProgress;
            
            if (this.progressBar) {
                this.progressBar.style.width = `${this.progress}%`;
            }
            
            if (this.percentageText) {
                this.percentageText.textContent = `${Math.floor(this.progress)}%`;
            }
            
            if (progress < 1 && !this.isComplete) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
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
        
        if (this.percentageText) {
            this.percentageText.textContent = '100%';
        }
        
        // Fade out preloader with GSAP
        gsap.to(this.element, {
            opacity: 0,
            scale: 1.1,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                this.element.classList.add('hidden');
                document.body.classList.remove('no-scroll');
                document.body.classList.add('page-loaded');
                
                this.onComplete();
            }
        });
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
        
        console.log('✨ Evia Aesthetics Loaded Successfully');
    }
}

// ========================================
// ENHANCED HEADER
// ========================================

class EnhancedHeader {
    constructor() {
        this.element = document.getElementById('header');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.bindEvents();
        this.initNavigation();
        this.updateScrollProgress();
        this.initEnhancements();
        this.initGSAPAnimations();
    }
    
    bindEvents() {
        // Optimized scroll handler
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            this.requestTick();
        }, { passive: true });
        
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
    
    requestTick() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.handleScroll();
                this.ticking = false;
            });
            this.ticking = true;
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
    
    initGSAPAnimations() {
        // Animate header on load
        gsap.from(this.element, {
            y: -100,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: 'power3.out'
        });
        
        // Stagger nav links
        gsap.from(this.navLinks, {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.8,
            ease: 'power2.out'
        });
    }
    
    handleScroll() {
        const scrollY = this.lastScrollY;
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ========================================
// MOBILE MENU
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
        
        // Animate menu items
        gsap.from('.mobile-nav-link', {
            x: 50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power2.out'
        });
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
// ENHANCED HERO SECTION
// ========================================

class EnhancedHeroSection {
    constructor() {
        this.hero = document.querySelector('.hero-section-redesigned');
        this.video = document.querySelector('.hero-video');
        this.dynamicText = document.getElementById('dynamicText');
        this.particlesContainer = document.getElementById('heroParticles');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator');
        this.serviceItems = document.querySelectorAll('.service-preview-item');
        this.statNumbers = document.querySelectorAll('.stat-value, .stat-number');
        
        this.particles = [];
        this.typedInstance = null;
        this.animationsTriggered = false;
        
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        this.initVideo();
        this.initParticles();
        this.initButtons();
        this.initScrollIndicator();
        this.initServiceShowcase();
        this.initSliders();
        this.initQuickBooking();
        this.initTypedText();
        this.observeStats();
        this.initParallax();
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
    
    initParticles() {
        if (!this.particlesContainer || LuxuryMedSpa.isMobile) return;
        
        // Create particles
        for (let i = 0; i < LuxuryMedSpa.settings.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            this.particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    initButtons() {
        // Primary CTA button
        const heroBookCTA = document.getElementById('heroBookCTA');
        if (heroBookCTA) {
            LuxuryMedSpa.utils.addMagneticEffect(heroBookCTA, 0.3);
            LuxuryMedSpa.utils.addRippleEffect(heroBookCTA);
            heroBookCTA.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modal) {
                    LuxuryMedSpa.components.modal.openBookingModal();
                }
            });
        }
        
        // Secondary CTA button (Virtual Tour)
        const heroVideoCTA = document.getElementById('heroVideoCTA');
        if (heroVideoCTA) {
            LuxuryMedSpa.utils.addMagneticEffect(heroVideoCTA, 0.25);
            heroVideoCTA.addEventListener('click', () => {
                this.showVirtualTour();
            });
        }
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
        
        // Animate scroll indicator
        gsap.to('.scroll-line::after', {
            y: 30,
            duration: 2,
            repeat: -1,
            ease: 'none'
        });
    }
    
    initServiceShowcase() {
        this.serviceItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.setActiveService(index);
            });
            
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    setActiveService(index) {
        this.serviceItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    
    initSliders() {
        const sliders = document.querySelectorAll('.slider-handle');
        
        sliders.forEach(slider => {
            const container = slider.closest('.before-after-preview');
            const afterImage = container.querySelector('.after-img');
            
            let isDragging = false;
            
            const handleMove = (e) => {
                if (!isDragging) return;
                
                const rect = container.getBoundingClientRect();
                const x = (e.clientX || e.touches[0].clientX) - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                slider.style.left = `${percentage}%`;
                afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
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
    
    initQuickBooking() {
        const form = document.getElementById('heroQuickForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickBooking();
        });
        
        // Add magnetic effect to submit button
        const submitBtn = form.querySelector('.booking-submit-btn');
        if (submitBtn) {
            LuxuryMedSpa.utils.addMagneticEffect(submitBtn, 0.2);
            LuxuryMedSpa.utils.addRippleEffect(submitBtn);
        }
    }
    
    handleQuickBooking() {
        const form = document.getElementById('heroQuickForm');
        const formData = new FormData(form);
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
        const submitBtn = form.querySelector('.booking-submit-btn');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Booking...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Confirmed!</span> <i class="fas fa-check"></i>';
            this.showNotification('Booking confirmed! We\'ll call you soon.', 'success');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                form.reset();
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
    
    initTypedText() {
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
            
            // Initialize Typed.js with smooth typing
            this.typedInstance = new Typed(this.dynamicText, {
                strings: beautyWords,
                typeSpeed: 80,
                backSpeed: 60,
                backDelay: 2000,
                startDelay: 1000,
                loop: true,
                showCursor: false,
                fadeOut: true,
                fadeOutClass: 'typed-fade-out',
                fadeOutDelay: 500
            });
        }
    }
    
    observeStats() {
        if (!this.statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateNumber(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });
        
        this.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    animateNumber(element) {
        const target = parseInt(element.dataset.count || element.dataset.target);
        if (!target) return;
        
        const duration = 2500;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    initParallax() {
        if (LuxuryMedSpa.isMobile) return;
        
        // Parallax for decorative elements
        gsap.to('.floating-orb', {
            y: '100px',
            scrollTrigger: {
                trigger: '.hero-section-redesigned',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        // Parallax for content
        gsap.to('.hero-content-wrapper', {
            y: '50px',
            opacity: 0.8,
            scrollTrigger: {
                trigger: '.hero-section-redesigned',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    initMagneticEffects() {
        // Add magnetic effects to various elements
        const magneticElements = [
            '.trust-item',
            '.hero-feature-card',
            '.view-gallery-btn'
        ];
        
        magneticElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                LuxuryMedSpa.utils.addMagneticEffect(element, 0.1);
            });
        });
    }
    
    startAnimations() {
        // Called after preloader completes
        if (this.animationsTriggered) return;
        this.animationsTriggered = true;
        
        // Animate hero content
        const timeline = gsap.timeline();
        
        timeline
            .from('.location-badge-redesign', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
            .from('.hero-title', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-subtitle, .hero-credentials', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-cta-group', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3')
            .from('.hero-trust-row', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3');
        
        console.log('Hero animations started');
    }
    
    destroy() {
        // Cleanup method
        if (this.typedInstance) {
            this.typedInstance.destroy();
        }
    }
}

// ========================================
// SERVICES CAROUSEL
// ========================================

class ServicesCarousel {
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
            console.warn('Swiper not loaded');
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
            
            // Events
            on: {
                slideChange: () => {
                    this.onSlideChange();
                }
            }
        });
        
        console.log('✨ Services carousel initialized');
    }
    
    onSlideChange() {
        // Add any slide change animations here
        const activeSlide = this.swiperElement.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const card = activeSlide.querySelector('.luxury-service-card');
            if (card) {
                gsap.fromTo(card, 
                    { scale: 0.95, opacity: 0.8 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
                );
            }
        }
    }
    
    initServiceCards() {
        this.serviceCards.forEach((card) => {
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
        });
    }
    
    onCardHover(card) {
        // Add hover animations with GSAP
        const icon = card.querySelector('.service-icon-luxury');
        const image = card.querySelector('.service-bg-image');
        
        if (icon) {
            gsap.to(icon, {
                y: -5,
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        if (image) {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }
    
    onCardLeave(card) {
        // Reset animations
        const icon = card.querySelector('.service-icon-luxury');
        const image = card.querySelector('.service-bg-image');
        
        if (icon) {
            gsap.to(icon, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        if (image) {
            gsap.to(image, {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
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
                e.stopPropagation();
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
                        gsap.fromTo(entry.target,
                            { y: 30, opacity: 0, scale: 0.95 },
                            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
                        );
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
            observer.observe(card);
        });
    }
}

// ========================================
// ENHANCED PARALLAX EFFECTS
// ========================================

class ParallaxEffects {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        if (LuxuryMedSpa.isMobile) return;
        
        this.setupParallaxElements();
        this.bindEvents();
    }
    
    setupParallaxElements() {
        // Find all parallax elements
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;
            this.elements.push({
                element: element,
                speed: parseFloat(speed),
                offset: element.offsetTop
            });
        });
        
        // Doctor image parallax
        gsap.to('.doctor-image-bubble', {
            y: -50,
            scrollTrigger: {
                trigger: '.about-doctor',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        // Floating badges parallax
        gsap.to('.floating-badge', {
            y: -30,
            scrollTrigger: {
                trigger: '.about-doctor',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });
    }
    
    bindEvents() {
        window.addEventListener('scroll', LuxuryMedSpa.utils.throttle(() => {
            this.updateParallax();
        }, 16));
    }
    
    updateParallax() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(item => {
            const { element, speed, offset } = item;
            const yPos = -(scrollY - offset) * speed;
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ========================================
// SMOOTH SCROLL ENHANCEMENTS
// ========================================

class SmoothScrollEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollTriggers();
        this.initScrollProgressRing();
    }
    
    setupScrollTriggers() {
        // Fade in elements on scroll
        gsap.utils.toArray('[data-aos]').forEach(element => {
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
    
    initScrollProgressRing() {
        const progressRing = document.querySelector('.scroll-progress-ring');
        const circle = document.querySelector('.progress-ring__circle');
        
        if (!progressRing || !circle) return;
        
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // Show/hide based on scroll
        window.addEventListener('scroll', LuxuryMedSpa.utils.throttle(() => {
            const scrollY = window.pageYOffset;
            const shouldShow = scrollY > 500;
            
            progressRing.classList.toggle('visible', shouldShow);
            
            // Update progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollY / scrollHeight;
            const offset = circumference - (progress * circumference);
            
            circle.style.strokeDashoffset = offset;
        }, 16));
        
        // Scroll to top on click
        progressRing.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
        
        // Animate modal entrance
        gsap.fromTo(this.bookingModal,
            { scale: 0.9, opacity: 0, y: 50 },
            { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
    }
    
    closeModal() {
        gsap.to(this.bookingModal, {
            scale: 0.9,
            opacity: 0,
            y: 50,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                this.activeModal = null;
                this.overlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
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
        
        // Animate success message
        gsap.from(modalContent.firstElementChild, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
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
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate notification
        gsap.fromTo(notification,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }
        );
        
        // Auto remove
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => notification.remove()
            });
        }, 4000);
    }
}

// ========================================
// FLOATING ELEMENTS
// ========================================

class FloatingElements {
    constructor() {
        this.bookButton = document.getElementById('floatingBook');
        this.callButton = document.getElementById('floatingCall');
        this.socialDock = document.getElementById('floatingSocials');
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkVisibility();
        this.initEnhancements();
        this.initDelayedElements();
    }
    
    bindEvents() {
        // Book button click event
        if (this.bookButton) {
            this.bookButton.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modal) {
                    LuxuryMedSpa.components.modal.openBookingModal();
                }
            });
        }
        
        // Call button click event
        if (this.callButton) {
            this.callButton.addEventListener('click', () => {
                window.location.href = 'tel:+15551234567';
            });
        }
        
        // Show/hide based on scroll
        window.addEventListener('scroll', LuxuryMedSpa.utils.throttle(() => {
            this.checkVisibility();
        }, 100), { passive: true });
    }
    
    initEnhancements() {
        // Add magnetic effects to floating buttons
        if (this.bookButton) {
            const floatCTA = this.bookButton.querySelector('.float-cta');
            if (floatCTA) {
                LuxuryMedSpa.utils.addMagneticEffect(floatCTA, 0.3);
                LuxuryMedSpa.utils.addRippleEffect(floatCTA);
            }
        }
        
        if (this.callButton) {
            const callCTA = this.callButton.querySelector('.call-cta');
            if (callCTA) {
                LuxuryMedSpa.utils.addMagneticEffect(callCTA, 0.3);
                LuxuryMedSpa.utils.addRippleEffect(callCTA);
            }
        }
        
        // Add magnetic effects to social dock icons
        if (this.socialDock) {
            const socialFloatIcons = this.socialDock.querySelectorAll('.social-float-icon');
            socialFloatIcons.forEach(icon => {
                LuxuryMedSpa.utils.addMagneticEffect(icon, 0.2);
            });
        }
    }
    
    initDelayedElements() {
        // Show call button and social dock after delay
        setTimeout(() => {
            if (this.callButton) {
                this.callButton.classList.add('visible');
            }
            if (this.socialDock) {
                this.socialDock.classList.add('visible');
            }
        }, 2500);
    }
    
    checkVisibility() {
        const scrollY = window.pageYOffset;
        const shouldShow = scrollY > 800;
        
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
// CONTACT FORM
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
        
        console.log('🌟 Initializing Evia Aesthetics...');
        
        try {
            // Register GSAP plugins
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
            
            // Initialize all components
            LuxuryMedSpa.components = {
                preloader: new EnhancedPreloader(),
                header: new EnhancedHeader(),
                mobileMenu: new MobileMenu(),
                hero: new EnhancedHeroSection(),
                servicesCarousel: new ServicesCarousel(),
                parallax: new ParallaxEffects(),
                smoothScroll: new SmoothScrollEnhancements(),
                modal: new ModalSystem(),
                floatingElements: new FloatingElements(),
                contactForm: new ContactForm()
            };
            
            // Global event listeners
            this.bindGlobalEvents();
            
            // Performance optimizations
            this.initPerformanceOptimizations();
            
            // Add global magnetic effects
            this.initGlobalMagneticEffects();
            
            this.isInitialized = true;
            
            console.log('✅ Evia Aesthetics Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
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
                if (LuxuryMedSpa.components.servicesCarousel && 
                    LuxuryMedSpa.components.servicesCarousel.swiper) {
                    LuxuryMedSpa.components.servicesCarousel.swiper.autoplay.stop();
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
                if (LuxuryMedSpa.components.servicesCarousel && 
                    LuxuryMedSpa.components.servicesCarousel.swiper) {
                    LuxuryMedSpa.components.servicesCarousel.swiper.autoplay.start();
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
                
                // Disable carousel autoplay
                if (LuxuryMedSpa.components.servicesCarousel && 
                    LuxuryMedSpa.components.servicesCarousel.swiper) {
                    LuxuryMedSpa.components.servicesCarousel.swiper.autoplay.stop();
                }
                
                console.log('🐌 Slow connection detected, optimizing experience');
            }
        }
    }
    
    initGlobalMagneticEffects() {
        // Add magnetic effects to all magnetic-element class
        const magneticElements = document.querySelectorAll('.magnetic-element');
        magneticElements.forEach(element => {
            LuxuryMedSpa.utils.addMagneticEffect(element, 0.2);
        });
    }
}

// ========================================
// APPLICATION INITIALIZATION
// ========================================

// Initialize the application
const app = new LuxuryMedSpaApp();

// Export for global access
window.LuxuryMedSpa = LuxuryMedSpa;

// Enhanced debug helper in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.EviaDebug = {
        components: () => LuxuryMedSpa.components,
        settings: () => LuxuryMedSpa.settings,
        utils: () => LuxuryMedSpa.utils,
        gsap: () => gsap,
        version: '1.0.0 - Enhanced Edition'
    };
    
    console.log('🔧 Debug mode enabled. Use window.EviaDebug for debugging.');
}
