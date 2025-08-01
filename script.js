/* ========================================
   EVIA AESTHETICS - UNDERSTATED LUXURY JS
   ======================================== */

'use strict';

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
        this.initComponents();
        console.log('🌟 Evia Luxury Experience Initialized');
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
        window.addEventListener('resize', this.debounce(() => this.onWindowResize(), 250));
        
        // Mouse tracking for magnetic effects
        document.addEventListener('mousemove', (e) => this.trackMouse(e));
    }
    
    onDOMReady() {
        this.components.preloader = new LuxuryPreloader();
        this.components.header = new GlassHeader();
        this.components.mobileMenu = new MobileMenu();
        this.components.hero = new LuxuryHero();
        this.components.beforeAfter = new BeforeAfterSlider();
        this.components.contactForm = new ContactForm();
        this.components.magneticEffects = new MagneticEffects();
        
        // Initialize AOS
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
            if (component.onResize) {
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
    
    smoothScrollTo(target, offset = 100) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// LUXURY PRELOADER
// ========================================

class LuxuryPreloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.minDisplayTime = 2500; // Minimum time in ms
        this.startTime = Date.now();
        
        if (this.preloader) {
            this.init();
        }
    }
    
    init() {
        // Prevent scrolling during preload
        document.body.style.overflow = 'hidden';
        
        // Add floating animation to logo
        this.addFloatingAnimation();
        
        // Check if page is already loaded
        if (document.readyState === 'complete') {
            this.checkFadeOut();
        } else {
            window.addEventListener('load', () => this.checkFadeOut());
        }
    }
    
    addFloatingAnimation() {
        const logoCircle = this.preloader.querySelector('.logo-glow-circle');
        if (logoCircle) {
            // Add subtle breathing effect
            setInterval(() => {
                logoCircle.style.transform = `translateY(${Math.sin(Date.now() * 0.001) * 10}px)`;
            }, 16);
        }
    }
    
    checkFadeOut() {
        const timeElapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - timeElapsed);
        
        setTimeout(() => {
            this.fadeOut();
        }, remainingTime);
    }
    
    fadeOut() {
        if (!this.preloader) return;
        
        this.preloader.classList.add('fade-out');
        
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.add('preloader-complete');
        }, 800);
    }
}

// ========================================
// GLASS HEADER
// ========================================

class GlassHeader {
    constructor() {
        this.header = document.getElementById('header');
        this.lastScrollY = 0;
        this.ticking = false;
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.initNavigationEffects();
        this.initLogoShimmer();
    }
    
    bindEvents() {
        // Optimized scroll handler
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
        
        // CTA button
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', () => {
                app.smoothScrollTo('#contact');
            });
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldShrink = scrollY > 80;
        
        // Add/remove scrolled class
        this.header.classList.toggle('scrolled', shouldShrink);
        
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
            }
        });
        
        // Update active link on scroll
        this.updateActiveNavigation();
    }
    
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveLink(`#${id}`);
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveLink(href) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
    
    initLogoShimmer() {
        const logoWrapper = document.querySelector('.logo-wrapper');
        if (logoWrapper) {
            setInterval(() => {
                const shimmer = logoWrapper.querySelector('.shimmer-overlay');
                if (shimmer) {
                    shimmer.style.animation = 'none';
                    setTimeout(() => {
                        shimmer.style.animation = 'shimmer 3s ease-in-out infinite';
                    }, 100);
                }
            }, 5000); // Shimmer every 5 seconds
        }
    }
}

// ========================================
// MOBILE MENU
// ========================================

class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileToggle');
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileOverlay');
        this.close = document.getElementById('mobileClose');
        this.isOpen = false;
        
        if (this.toggle && this.menu) {
            this.init();
        }
    }
    
    init() {
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
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.closeMenu();
                    setTimeout(() => {
                        app.smoothScrollTo(href);
                    }, 300);
                }
            });
        });
        
        // Mobile CTA
        const mobileCTA = document.querySelector('.mobile-cta');
        if (mobileCTA) {
            mobileCTA.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    app.smoothScrollTo('#contact');
                }, 300);
            });
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// LUXURY HERO
// ========================================

class LuxuryHero {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.cyclingText = document.getElementById('cyclingText');
        this.primaryCTA = document.getElementById('primaryCTA');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        
        this.textOptions = [
            'Beauty',
            'Confidence',
            'Radiance',
            'Elegance',
            'Transformation',
            'Excellence'
        ];
        this.currentTextIndex = 0;
        
        if (this.hero) {
            this.init();
        }
    }
    
    init() {
        this.initTextCycling();
        this.initCTAButtons();
        this.initScrollIndicator();
        this.initFloatingOrbs();
        this.initVideo();
    }
    
    initTextCycling() {
        if (!this.cyclingText) return;
        
        // Start cycling after a delay
        setTimeout(() => {
            this.startTextCycling();
        }, 3000);
    }
    
    startTextCycling() {
        setInterval(() => {
            this.cyclingText.style.opacity = '0';
            this.cyclingText.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                this.currentTextIndex = (this.currentTextIndex + 1) % this.textOptions.length;
                this.cyclingText.textContent = this.textOptions[this.currentTextIndex];
                this.cyclingText.style.opacity = '1';
                this.cyclingText.style.transform = 'translateY(0)';
            }, 500);
        }, 4000);
    }
    
    initCTAButtons() {
        if (this.primaryCTA) {
            this.primaryCTA.addEventListener('click', () => {
                app.smoothScrollTo('#contact');
            });
            
            // Add ripple effect
            this.primaryCTA.addEventListener('click', (e) => {
                const ripple = this.primaryCTA.querySelector('.cta-ripple');
                if (ripple) {
                    const rect = this.primaryCTA.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;
                    ripple.style.transform = 'scale(0)';
                    ripple.style.opacity = '1';
                    
                    // Animate ripple
                    ripple.animate([
                        { transform: 'scale(0)', opacity: 1 },
                        { transform: 'scale(4)', opacity: 0 }
                    ], {
                        duration: 600,
                        easing: 'ease-out'
                    });
                }
            });
        }
    }
    
    initScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                app.smoothScrollTo('#services');
            });
        }
    }
    
    initFloatingOrbs() {
        const orbs = document.querySelectorAll('.orb');
        
        orbs.forEach((orb, index) => {
            // Random initial positions and animations
            const delay = index * 5;
            const duration = 20 + (index * 5);
            
            orb.style.animationDelay = `-${delay}s`;
            orb.style.animationDuration = `${duration}s`;
            
            // Add parallax effect
            this.addParallaxToOrb(orb, index);
        });
    }
    
    addParallaxToOrb(orb, index) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1 * (index + 1);
            orb.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }
    
    initVideo() {
        const video = document.querySelector('.hero-video');
        if (video) {
            video.addEventListener('loadeddata', () => {
                video.style.opacity = '1';
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
}

// ========================================
// BEFORE/AFTER SLIDER
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
// CONTACT FORM
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
// MAGNETIC EFFECTS
// ========================================

class MagneticEffects {
    constructor() {
        this.magneticElements = document.querySelectorAll('.magnetic-button, .magnetic-card');
        this.strength = 0.3;
        
        if (this.magneticElements.length > 0 && !app.isMobile) {
            this.init();
        }
    }
    
    init() {
        this.magneticElements.forEach(element => {
            this.addMagneticEffect(element);
        });
    }
    
    addMagneticEffect(element) {
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
        if (app.isMobile) {
            this.magneticElements.forEach(element => {
                element.style.transform = '';
                element.style.transition = '';
            });
        } else {
            this.init();
        }
    }
}

// ========================================
// SMOOTH SCROLLING ENHANCEMENT
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
                app.smoothScrollTo(target);
            }
        });
        
        // Handle service buttons
        const serviceButtons = document.querySelectorAll('.service-btn');
        serviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                app.smoothScrollTo('#contact');
            });
        });
    }
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
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
        // Lazy load images
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
        }
    }
    
    handleReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            
            // Disable complex animations
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach(orb => {
                orb.style.animation = 'none';
                orb.style.opacity = '0.1';
            });
        }
    }
    
    optimizeAnimations() {
        // Use will-change for animated elements
        const animatedElements = document.querySelectorAll('.orb, .floating-credential, .logo-glow-circle');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform';
        });
        
        // Remove will-change after animations complete
        setTimeout(() => {
            animatedElements.forEach(element => {
                element.style.willChange = 'auto';
            });
        }, 5000);
    }
}

// ========================================
// INITIALIZE APPLICATION
// ========================================

// Create global app instance
const app = new EviaLuxuryApp();

// Initialize additional components
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScrolling();
    new PerformanceOptimizer();
});

// Debug helper in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.EviaDebug = {
        app: () => app,
        components: () => app.components,
        version: '1.0.0 - Understated Luxury Edition'
    };
    
    console.log('🎭 Evia Luxury Debug Mode Enabled');
    console.log('✨ Understated Luxury Edition Loaded Successfully!');
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EviaLuxuryApp, app };
}
