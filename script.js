/**
 * Evia Aesthetics - Complete Refined JavaScript
 * Smooth, elegant animations for a sophisticated medical spa experience
 */

'use strict';

// Global Application State
const EviaRefinedApp = {
    isLoaded: false,
    isScrolling: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    components: {},
    animations: {},
    observers: {},
    timers: {}
};

/**
 * Soft Elegant Preloader
 */
class ElegantPreloader {
    constructor() {
        this.element = document.getElementById('elegantPreloader');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.loadingMessage = document.getElementById('loadingMessage');
        
        this.progress = 0;
        this.isComplete = false;
        this.messages = [
            'Welcome to Evia Aesthetics',
            'Preparing your luxury experience',
            'Loading premium treatments',
            'Creating your wellness journey',
            'Almost ready for elegance'
        ];
        this.currentMessage = 0;
        this.messageTimer = null;
        this.progressTimer = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Preloader element not found');
            return;
        }
        
        console.log('🌸 Initializing elegant preloader');
        
        // Add loading class to body
        document.body.classList.add('loading');
        
        // Start progress animation
        this.animateProgress();
        
        // Rotate messages
        this.rotateMessages();
        
        // Check page load status
        this.checkPageReady();
        
        // Fallback timer
        this.fallbackTimer = setTimeout(() => {
            if (!this.isComplete) {
                console.log('Preloader fallback triggered');
                this.complete();
            }
        }, 4500);
    }
    
    animateProgress() {
        const duration = 2800;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const targetProgress = Math.min((elapsed / duration) * 95, 95);
            
            // Smooth easing function
            const easedProgress = this.easeOutQuart(targetProgress / 95) * 95;
            
            this.updateProgress(easedProgress);
            
            if (targetProgress < 95) {
                this.progressTimer = requestAnimationFrame(animate);
            }
        };
        
        this.progressTimer = requestAnimationFrame(animate);
    }
    
    rotateMessages() {
        if (!this.loadingMessage) return;
        
        this.loadingMessage.textContent = this.messages[0];
        
        this.messageTimer = setInterval(() => {
            if (this.isComplete) {
                clearInterval(this.messageTimer);
                return;
            }
            
            this.currentMessage = (this.currentMessage + 1) % this.messages.length;
            
            // Smooth message transition
            this.loadingMessage.style.opacity = '0';
            this.loadingMessage.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                if (this.loadingMessage) {
                    this.loadingMessage.textContent = this.messages[this.currentMessage];
                    this.loadingMessage.style.opacity = '1';
                    this.loadingMessage.style.transform = 'translateY(0)';
                }
            }, 250);
            
        }, 2500);
    }
    
    checkPageReady() {
        const checkReady = () => {
            if (document.readyState === 'complete') {
                setTimeout(() => this.complete(), 800);
            } else {
                setTimeout(checkReady, 100);
            }
        };
        
        if (document.readyState === 'complete') {
            setTimeout(() => this.complete(), 800);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.complete(), 800);
            });
        }
    }
    
    updateProgress(progress) {
        this.progress = progress;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${Math.round(progress)}%`;
        }
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        // Clear timers
        if (this.messageTimer) clearInterval(this.messageTimer);
        if (this.progressTimer) cancelAnimationFrame(this.progressTimer);
        if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
        
        // Complete progress
        this.updateProgress(100);
        
        // Elegant exit animation
        setTimeout(() => {
            if (this.element) {
                this.element.classList.add('hidden');
                document.body.classList.remove('loading');
                
                // Initialize main app
                setTimeout(() => {
                    this.onComplete();
                }, 300);
            }
        }, 600);
        
        console.log('✨ Elegant preloader completed');
    }
    
    onComplete() {
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        EviaRefinedApp.isLoaded = true;
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

/**
 * Modern Circled Header Controller
 */
class ModernCircledHeader {
    constructor() {
        this.element = document.getElementById('modernHeader');
        this.logoContainer = document.getElementById('logoContainer');
        this.scrollProgressLine = document.getElementById('scrollProgressLine');
        this.hamburgerToggle = document.getElementById('hamburgerToggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 60;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Header element not found');
            return;
        }
        
        console.log('🎯 Initializing modern circled header');
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollEffects();
        this.initDropdowns();
        this.fixLogoHover();
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Mobile toggle
        if (this.hamburgerToggle) {
            this.hamburgerToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Logo click
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
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
            }
            
            // Update scroll progress
            this.updateScrollProgress();
            
            // Show/hide header on scroll
            this.updateHeaderVisibility(scrollY);
            
            // Update active navigation
            this.updateActiveNavigation();
            
            this.lastScrollY = scrollY;
            EviaRefinedApp.scrollY = scrollY;
            this.ticking = false;
        });
    }
    
    updateScrollProgress() {
        if (!this.scrollProgressLine) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.scrollProgressLine.style.width = `${Math.min(progress, 100)}%`;
    }
    
    updateHeaderVisibility(scrollY) {
        const isScrollingDown = scrollY > this.lastScrollY;
        const shouldHide = isScrollingDown && scrollY > 200;
        
        if (shouldHide) {
            this.element.style.transform = 'translateY(-100%)';
        } else {
            this.element.style.transform = 'translateY(0)';
        }
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
        
        this.initScrollSpy();
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
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
        EviaRefinedApp.observers.scrollSpy = observer;
    }
    
    updateActiveNavigation() {
        // Additional navigation updates can be added here
    }
    
    initDropdowns() {
        const dropdowns = this.element.querySelectorAll('.dropdown-item');
        
        dropdowns.forEach(dropdown => {
            let timeout;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 200);
            });
        });
    }
    
    fixLogoHover() {
        // Fix the logo hover issue by ensuring proper boundaries
        if (this.logoContainer) {
            const logoCircle = this.logoContainer.querySelector('.logo-circle');
            if (logoCircle) {
                // Reset any existing styles that might cause invisible frames
                logoCircle.style.margin = '0';
                logoCircle.style.padding = '0';
                
                // Ensure hover area matches visual area
                this.logoContainer.style.display = 'inline-block';
                this.logoContainer.style.lineHeight = '1';
            }
        }
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
    
    toggleMobileMenu() {
        this.hamburgerToggle.classList.toggle('active');
        window.dispatchEvent(new CustomEvent('toggleMobileMenu'));
    }
    
    handleResize() {
        EviaRefinedApp.isMobile = window.innerWidth <= 768;
    }
}

/**
 * Two-Circle Mobile Menu Controller
 */
class TwoCircleMobileMenu {
    constructor() {
        this.element = document.getElementById('mobileMenu');
        this.backdrop = document.getElementById('mobileBackdrop');
        this.closeBtn = document.getElementById('mobileCloseBtn');
        this.navLinks = this.element?.querySelectorAll('.mobile-nav-link');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Mobile menu element not found');
            return;
        }
        
        console.log('📱 Initializing two-circle mobile menu');
        
        this.bindEvents();
        this.initNavigation();
    }
    
    bindEvents() {
        // Listen for toggle event
        window.addEventListener('toggleMobileMenu', this.toggle.bind(this));
        
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', this.close.bind(this));
        }
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', this.close.bind(this));
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    initNavigation() {
        if (!this.navLinks) return;
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href') || link.dataset.section;
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(href);
                });
            }
        });
        
        // Dropdown toggles
        const dropdownToggles = this.element.querySelectorAll('.dropdown-toggle-mobile');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const parent = toggle.closest('.dropdown-mobile');
                parent.classList.toggle('active');
            });
        });
    }
    
    navigateTo(target) {
        this.close();
        
        setTimeout(() => {
            const element = document.querySelector(target);
            if (element) {
                const headerHeight = 80;
                const targetPosition = element.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 350);
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.element.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('📱 Mobile menu opened');
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.element.classList.remove('active');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        const dropdowns = this.element.querySelectorAll('.dropdown-mobile');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        
        // Update hamburger state
        const hamburger = document.getElementById('hamburgerToggle');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        
        console.log('📱 Mobile menu closed');
    }
}

/**
 * Cinematic Hero Controller
 */
class CinematicHeroController {
    constructor() {
        this.element = document.querySelector('.cinematic-hero');
        this.video = document.querySelector('.hero-video');
        this.typingText = document.getElementById('typingText');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.heroBookingBtn = document.getElementById('heroBookingBtn');
        this.videoPlayBtn = document.getElementById('videoPlayBtn');
        this.statNumbers = document.querySelectorAll('.stat-number-small');
        this.sideNavDots = document.querySelectorAll('.nav-dot');
        
        this.typed = null;
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Hero element not found');
            return;
        }
        
        console.log('🎬 Initializing cinematic hero');
        
        this.initVideo();
        this.initTypingAnimation();
        this.initButtonInteractions();
        this.initScrollIndicator();
        this.initSideNavigation();
        this.initStatsCounter();
        this.initScrollEffects();
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
            // Fallback background
            this.element.style.background = 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 50%, #FFF8F0 100%)';
        });
    }
    
    initTypingAnimation() {
        if (!this.typingText || typeof Typed === 'undefined') {
            console.warn('Typed.js not available or typing element not found');
            return;
        }
        
        const services = [
            'Advanced Facial Rejuvenation',
            'Premium Botox & Dermal Fillers',
            'Elite Body Contouring',
            'Medical-Grade Skincare',
            'Hair Restoration Therapy',
            'IV Wellness & Longevity',
            'Non-Invasive Treatments',
            'Holistic Aesthetic Care'
        ];
        
        try {
            this.typed = new Typed(this.typingText, {
                strings: services,
                typeSpeed: 45,
                backSpeed: 25,
                backDelay: 2500,
                loop: true,
                showCursor: false,
                fadeOut: true,
                fadeOutDelay: 400,
                smartBackspace: true,
                onComplete: () => {
                    if (this.typingText) {
                        this.typingText.style.borderRight = 'none';
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing typing animation:', error);
        }
    }
    
    initButtonInteractions() {
        // Primary booking button
        if (this.heroBookingBtn) {
            this.heroBookingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
                this.trackEvent('hero_booking_clicked');
            });
            
            this.addButtonEffects(this.heroBookingBtn);
        }
        
        // Video play button
        if (this.videoPlayBtn) {
            this.videoPlayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openVideoModal();
                this.trackEvent('hero_video_clicked');
            });
            
            this.addButtonEffects(this.videoPlayBtn);
        }
        
        // Additional CTA buttons
        const additionalCTAs = document.querySelectorAll('#headerCTA, #mobileCTA, .book-with-doctor');
        additionalCTAs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
            });
            this.addButtonEffects(btn);
        });
    }
    
    addButtonEffects(button) {
        if (!button) return;
        
        // Ripple effect
        button.addEventListener('click', (e) => {
            this.createRippleEffect(e, button);
        });
        
        // Magnetic effect for desktop
        if (!EviaRefinedApp.isMobile) {
            button.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, button);
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        }
        
        // Enhanced keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.createRippleEffect(e, button);
                button.click();
            }
        });
    }
    
    createRippleEffect(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    createMagneticEffect(event, button) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        const strength = 0.12;
        const magnetX = x * strength;
        const magnetY = y * strength;
        
        button.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const headerHeight = 80;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const opacity = scrollY > 150 ? 0 : 1;
            this.scrollIndicator.style.opacity = opacity;
        }, { passive: true });
    }
    
    initSideNavigation() {
        this.sideNavDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const href = dot.getAttribute('href');
                if (href) {
                    this.navigateToSection(href, dot);
                }
            });
        });
        
        this.updateActiveDot();
    }
    
    navigateToSection(target, activeDot) {
        const element = document.querySelector(target);
        if (!element) return;
        
        // Update active state
        this.sideNavDots.forEach(dot => dot.classList.remove('active'));
        activeDot.classList.add('active');
        
        // Smooth scroll
        const headerHeight = 80;
        let targetPosition;
        
        if (target === '#hero') {
            targetPosition = 0;
        } else {
            targetPosition = element.offsetTop - headerHeight - 20;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    updateActiveDot() {
        const sections = ['hero', 'about', 'services', 'results', 'contact'];
        
        const observerOptions = {
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const index = sections.indexOf(id);
                    
                    if (index !== -1 && this.sideNavDots[index]) {
                        this.sideNavDots.forEach(dot => dot.classList.remove('active'));
                        this.sideNavDots[index].classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
        
        EviaRefinedApp.observers.sideNav = observer;
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 60; // Smooth animation
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    // Completion effect
                    counter.style.transform = 'scale(1.1)';
                    counter.style.textShadow = '0 0 20px rgba(255, 158, 24, 0.6)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.textShadow = '';
                    }, 300);
                }
            };
            
            updateCounter();
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    
                    // Staggered animations
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 200);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.6 });
        
        const statsContainer = document.querySelector('.stats-row-small');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
        
        EviaRefinedApp.observers.stats = statsObserver;
    }
    
    initScrollEffects() {
        // Add any additional scroll effects here
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            // Parallax effect for video
            if (this.video && window.innerWidth > 768) {
                const parallaxValue = scrollY * 0.3;
                this.video.style.transform = `translate(-50%, -50%) scale(1.05) translateY(${parallaxValue}px)`;
            }
        }, { passive: true });
    }
    
    openAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 400);
        }
    }
    
    openVideoModal() {
        const modal = document.getElementById('videoModal');
        if (modal) {
            modal.classList.add('active');
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                // Replace with actual video URL
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
            }
        }
    }
    
    trackEvent(eventName, eventData = {}) {
        console.log('Event tracked:', eventName, eventData);
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'hero_interaction',
                ...eventData
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                event_name: eventName,
                ...eventData
            });
        }
    }
}

/**
 * Enhanced Doctor Section Controller
 */
class EnhancedDoctorSection {
    constructor() {
        this.element = document.querySelector('.meet-doctor-refined');
        this.statNumbers = document.querySelectorAll('.stat-number-refined');
        this.bookWithDoctorBtn = document.getElementById('bookWithDoctorBtn');
        this.learnMoreBtn = document.getElementById('learnMoreDoctorBtn');
        
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Doctor section element not found');
            return;
        }
        
        console.log('👩‍⚕️ Initializing enhanced doctor section');
        
        this.initButtonInteractions();
        this.initStatsCounter();
        this.initHoverEffects();
    }
    
    initButtonInteractions() {
        if (this.bookWithDoctorBtn) {
            this.bookWithDoctorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
            });
            this.addButtonEffects(this.bookWithDoctorBtn);
        }
        
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToServices();
            });
            this.addButtonEffects(this.learnMoreBtn);
        }
    }
    
    addButtonEffects(button) {
        if (!button) return;
        
        button.addEventListener('click', (e) => {
            this.createRippleEffect(e, button);
        });
        
        if (!EviaRefinedApp.isMobile) {
            button.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, button);
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        }
    }
    
    createRippleEffect(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'doctor-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.8;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.8s ease-out;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    createMagneticEffect(event, button) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        const strength = 0.1;
        const magnetX = x * strength;
        const magnetY = y * strength;
        
        button.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
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
                    // Completion effect
                    counter.style.transform = 'scale(1.15)';
                    counter.style.textShadow = '0 0 25px rgba(255, 158, 24, 0.7)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.textShadow = '';
                    }, 400);
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
        }, { threshold: 0.6 });
        
        const statsSection = document.querySelector('.stats-section-refined');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    initHoverEffects() {
        const expertiseItems = document.querySelectorAll('.expertise-item-refined');
        
        expertiseItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.expertise-icon-refined');
                if (icon) {
                    this.createIconEffect(icon);
                }
            });
        });
    }
    
    createIconEffect(icon) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: iconEffect 0.6s ease-out;
            pointer-events: none;
        `;
        
        icon.style.position = 'relative';
        icon.appendChild(effect);
        
        setTimeout(() => effect.remove(), 600);
    }
    
    openAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    scrollToServices() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const headerHeight = 80;
            const targetPosition = servicesSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

/**
 * Modern Modal System
 */
class ModernModalSystem {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        console.log('🎭 Initializing modern modal system');
        
        this.initAppointmentModal();
        this.initVideoModal();
        this.initFormHandling();
        this.initKeyboardNavigation();
    }
    
    initAppointmentModal() {
        if (!this.appointmentModal) return;
        
        const closeBtn = this.appointmentModal.querySelector('.modal-close-elegant');
        const overlay = this.appointmentModal.querySelector('.modal-overlay-elegant');
        
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
        
        const closeBtn = this.videoModal.querySelector('.video-modal-close-elegant');
        const overlay = this.videoModal.querySelector('.video-modal-overlay-elegant');
        
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
        
        // Enhanced form validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    handleFormSubmission(form) {
        if (!this.validateForm(form)) {
            this.showFormError('Please fill in all required fields correctly.');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn?.innerHTML;
        
        // Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading-state');
            submitBtn.innerHTML = `
                <span class="btn-text">Sending Request...</span>
                <div class="btn-icon">
                    <i class="bi bi-arrow-clockwise"></i>
                </div>
            `;
        }
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
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
        
        const group = field.closest('.form-group-elegant');
        if (group) {
            group.classList.toggle('error', !isValid);
            group.classList.toggle('valid', isValid);
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const group = field.closest('.form-group-elegant');
        if (group) {
            group.classList.remove('error');
        }
    }
    
    showFormError(message) {
        // Create elegant error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-elegant';
        errorDiv.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            font-size: 0.9375rem;
            font-weight: 500;
            box-shadow: 0 15px 40px rgba(239, 68, 68, 0.4);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%) scale(0.8);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 350px;
        `;
        
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-exclamation" style="font-size: 12px;"></i>
                </div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateX(0) scale(1)';
        }, 50);
        
        // Remove after delay
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateX(100%) scale(0.8)';
            setTimeout(() => errorDiv.remove(), 400);
        }, 4000);
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message-elegant" style="text-align: center; padding: 60px 30px;">
                <div class="success-icon-elegant" style="
                    width: 80px; 
                    height: 80px; 
                    margin: 0 auto 30px; 
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-size: 2rem;
                    animation: successPulse 0.6s ease-out;
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                ">
                    <i class="bi bi-check"></i>
                </div>
                <h3 style="
                    color: #442C15; 
                    margin-bottom: 20px; 
                    font-size: 1.75rem;
                    font-weight: 600;
                ">Thank You!</h3>
                <p style="
                    color: #6D6D6D; 
                    line-height: 1.6;
                    font-size: 1rem;
                    margin-bottom: 20px;
                ">Your consultation request has been received. Our team will contact you within 24 hours to schedule your appointment.</p>
                <div style="
                    font-size: 0.875rem;
                    color: #9F9F9F;
                    font-style: italic;
                ">This window will close automatically...</div>
            </div>
        `;
        
        // Add success animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes successPulse {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.activeModal = null;
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modern-modal-elegant.active, .video-modal-elegant.active');
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
        this.addDynamicStyles();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120,
                delay: 0,
                disable: EviaRefinedApp.isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
            
            // Refresh on window load
            window.addEventListener('load', () => {
                setTimeout(() => AOS.refresh(), 500);
            });
        }
    }
    
    initGSAP() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Parallax effects
            if (window.innerWidth > 768) {
                gsap.to('.hero-video', {
                    yPercent: -30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.cinematic-hero',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
                
                gsap.to('.aesthetic-floaters .floater', {
                    y: -100,
                    rotation: 360,
                    ease: 'none',
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.cinematic-hero',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        }
    }
    
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            @keyframes iconEffect {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
            }
            
            .button-ripple {
                animation: ripple 0.6s ease-out;
            }
            
            .doctor-ripple {
                animation: ripple 0.8s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Main Application Controller
 */
class EviaRefinedApplication {
    constructor() {
        this.isLoading = true;
        this.components = {};
        
        this.init();
    }
    
    init() {
        console.log('🌿 Initializing Evia Refined Application...');
        
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
            this.components.preloader = new ElegantPreloader();
            
            // Initialize other components after preloader completes
            window.addEventListener('preloaderComplete', () => {
                this.onPreloaderComplete();
            });
            
            // Initialize header immediately (it should work during loading too)
            this.components.header = new ModernCircledHeader();
            this.components.mobileMenu = new TwoCircleMobileMenu();
            this.components.modals = new ModernModalSystem();
            
            // Bind global events
            this.bindGlobalEvents();
            
            console.log('✅ Evia Refined Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize remaining components
        setTimeout(() => {
            this.components.hero = new CinematicHeroController();
            this.components.doctor = new EnhancedDoctorSection();
            this.components.animations = new EnhancedAnimationsController();
            
            console.log('🎬 Post-preloader components initialized');
        }, 500);
    }
    
    bindGlobalEvents() {
        // Resize handler
        window.addEventListener('resize', () => {
            EviaRefinedApp.isMobile = window.innerWidth <= 768;
            
            // Refresh AOS if available
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 300);
            }
        });
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause any heavy animations when tab is not visible
                this.pauseAnimations();
            } else {
                // Resume animations when tab becomes visible
                this.resumeAnimations();
            }
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
        // Pause video if playing
        const video = document.querySelector('.hero-video');
        if (video && !video.paused) {
            video.pause();
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
    }
    
    handleInitError() {
        // Remove preloader and loading class
        document.body.classList.remove('loading');
        const preloader = document.getElementById('elegantPreloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
    
    // Utility methods for global use
    scrollToElement(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Cleanup method
    destroy() {
        // Clean up components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // Clean up observers
        Object.values(EviaRefinedApp.observers).forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        
        // Clean up timers
        Object.values(EviaRefinedApp.timers).forEach(timer => {
            if (timer) {
                clearTimeout(timer);
                clearInterval(timer);
            }
        });
        
        console.log('🧹 Application cleaned up');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.EviaApp = new EviaRefinedApplication();
});

// Global utility functions for external use
window.EviaUtils = {
    scrollTo: (selector, offset = 80) => {
        if (window.EviaApp) {
            window.EviaApp.scrollToElement(selector, offset);
        }
    },
    
    openModal: (modalId) => {
        if (window.EviaApp) {
            window.EviaApp.openModal(modalId);
        }
    },
    
    closeModal: (modalId) => {
        if (window.EviaApp) {
            window.EviaApp.closeModal(modalId);
        }
    }
};

// Expose global state for debugging
window.EviaRefinedApp = EviaRefinedApp;
