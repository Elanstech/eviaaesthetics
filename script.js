/**
 * Evia Aesthetics - Manhattan Luxury Medical Spa
 * Enhanced JavaScript for professional medical spa experience
 */

'use strict';

// Global Application State
const EviaManhattanApp = {
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
 * Luxury Manhattan Preloader
 */
class LuxuryManhattanPreloader {
    constructor() {
        this.element = document.getElementById('luxuryPreloader');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.loadingMessage = document.getElementById('loadingMessage');
        
        this.progress = 0;
        this.isComplete = false;
        this.messages = [
            'Welcome to Manhattan\'s Premier Medical Spa',
            'Preparing your luxury experience',
            'Loading premium medical treatments',
            'Creating your wellness journey',
            'Dr. Nano awaits your arrival',
            'Almost ready for excellence'
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
        
        console.log('🏙️ Initializing Manhattan luxury preloader');
        
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
        }, 5000);
    }
    
    animateProgress() {
        const duration = 3200;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const targetProgress = Math.min((elapsed / duration) * 95, 95);
            
            // Luxury easing function
            const easedProgress = this.luxuryEaseOut(targetProgress / 95) * 95;
            
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
            this.loadingMessage.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                if (this.loadingMessage) {
                    this.loadingMessage.textContent = this.messages[this.currentMessage];
                    this.loadingMessage.style.opacity = '1';
                    this.loadingMessage.style.transform = 'translateY(0)';
                }
            }, 300);
            
        }, 2800);
    }
    
    checkPageReady() {
        const checkReady = () => {
            if (document.readyState === 'complete') {
                setTimeout(() => this.complete(), 1000);
            } else {
                setTimeout(checkReady, 100);
            }
        };
        
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
        
        // Luxury exit animation
        setTimeout(() => {
            if (this.element) {
                this.element.classList.add('hidden');
                document.body.classList.remove('loading');
                
                // Initialize main app
                setTimeout(() => {
                    this.onComplete();
                }, 400);
            }
        }, 800);
        
        console.log('✨ Manhattan luxury preloader completed');
    }
    
    onComplete() {
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('manhattanPreloaderComplete'));
        EviaManhattanApp.isLoaded = true;
    }
    
    luxuryEaseOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

/**
 * Manhattan Luxury Header Controller
 */
class ManhattanLuxuryHeader {
    constructor() {
        this.element = document.getElementById('manhattanHeader');
        this.logoContainer = document.getElementById('logoContainer');
        this.scrollProgressLine = document.getElementById('scrollProgressLine');
        this.hamburgerToggle = document.getElementById('hamburgerToggle');
        this.navLinks = document.querySelectorAll('.nav-link-luxury');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 80;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Header element not found');
            return;
        }
        
        console.log('🏢 Initializing Manhattan luxury header');
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollEffects();
        this.initDropdowns();
        this.initRippleEffects();
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
            EviaManhattanApp.scrollY = scrollY;
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
        const shouldHide = isScrollingDown && scrollY > 250;
        
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
        const targetPosition = element.offsetTop - headerHeight - 30;
        
        this.smoothScrollTo(targetPosition);
        
        // Track navigation
        this.trackEvent('navigation_click', { target: target });
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
            rootMargin: '-25% 0px -65% 0px',
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
        EviaManhattanApp.observers.scrollSpy = observer;
    }
    
    updateActiveNavigation() {
        // Additional navigation updates can be added here
    }
    
    initDropdowns() {
        const dropdowns = this.element.querySelectorAll('.dropdown-luxury');
        
        dropdowns.forEach(dropdown => {
            let timeout;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 300);
            });
        });
    }
    
    initRippleEffects() {
        const buttons = this.element.querySelectorAll('.cta-manhattan, .phone-manhattan');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createManhattanRipple(e, button);
            });
        });
    }
    
    createManhattanRipple(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'manhattan-ripple-effect';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
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
        window.dispatchEvent(new CustomEvent('toggleManhattanMobileMenu'));
    }
    
    handleResize() {
        EviaManhattanApp.isMobile = window.innerWidth <= 768;
    }
    
    trackEvent(eventName, eventData = {}) {
        console.log('Event tracked:', eventName, eventData);
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'navigation',
                ...eventData
            });
        }
    }
}

/**
 * Manhattan Mobile Menu Controller
 */
class ManhattanMobileMenu {
    constructor() {
        this.element = document.getElementById('mobileMenu');
        this.backdrop = document.getElementById('mobileBackdrop');
        this.closeBtn = document.getElementById('mobileCloseBtn');
        this.navLinks = this.element?.querySelectorAll('.mobile-nav-link-luxury');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Mobile menu element not found');
            return;
        }
        
        console.log('📱 Initializing Manhattan mobile menu');
        
        this.bindEvents();
        this.initNavigation();
        this.initRippleEffects();
    }
    
    bindEvents() {
        // Listen for toggle event
        window.addEventListener('toggleManhattanMobileMenu', this.toggle.bind(this));
        
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
                const parent = toggle.closest('.dropdown-mobile-luxury');
                parent.classList.toggle('active');
            });
        });
    }
    
    initRippleEffects() {
        const buttons = this.element.querySelectorAll('.mobile-cta-manhattan, .mobile-phone-manhattan');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createGoldenRipple(e, button);
            });
        });
    }
    
    createGoldenRipple(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'manhattan-ripple-effect';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.8;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    navigateTo(target) {
        this.close();
        
        setTimeout(() => {
            const element = document.querySelector(target);
            if (element) {
                const headerHeight = 90;
                const targetPosition = element.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 400);
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
        
        console.log('📱 Manhattan mobile menu opened');
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.element.classList.remove('active');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        const dropdowns = this.element.querySelectorAll('.dropdown-mobile-luxury');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        
        // Update hamburger state
        const hamburger = document.getElementById('hamburgerToggle');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        
        console.log('📱 Manhattan mobile menu closed');
    }
}

/**
 * Manhattan Cinematic Hero Controller
 */
class ManhattanCinematicHero {
    constructor() {
        this.element = document.querySelector('.manhattan-cinematic-hero');
        this.video = document.querySelector('.hero-video-luxury');
        this.typingText = document.getElementById('typingText');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.heroBookingBtn = document.getElementById('heroBookingBtn');
        this.videoPlayBtn = document.getElementById('videoPlayBtn');
        this.statNumbers = document.querySelectorAll('.stat-number-luxury');
        this.sideNavDots = document.querySelectorAll('.nav-dot-luxury');
        
        this.typed = null;
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Hero element not found');
            return;
        }
        
        console.log('🎬 Initializing Manhattan cinematic hero');
        
        this.initVideo();
        this.initTypingAnimation();
        this.initButtonInteractions();
        this.initScrollIndicator();
        this.initSideNavigation();
        this.initStatsCounter();
        this.initScrollEffects();
        this.initParallaxEffects();
    }
    
    initVideo() {
        if (!this.video) return;
        
        this.video.addEventListener('loadeddata', () => {
            if (this.video.paused) {
                this.video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                    // Add fallback background
                    this.element.style.background = 'linear-gradient(135deg, #1E293B 0%, #475569 50%, #1E293B 100%)';
                });
            }
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            // Fallback background
            this.element.style.background = 'linear-gradient(135deg, #1E293B 0%, #475569 50%, #1E293B 100%)';
        });
    }
    
    initTypingAnimation() {
        if (!this.typingText || typeof Typed === 'undefined') {
            console.warn('Typed.js not available or typing element not found');
            return;
        }
        
        const services = [
            'Advanced Medical Aesthetics',
            'Board-Certified Excellence',
            'Premium Botox & Dermal Fillers',
            'Elite Body Sculpting',
            'Medical-Grade Skincare',
            'Hair Restoration Therapy',
            'IV Wellness & Longevity',
            'Non-Invasive Treatments',
            'Holistic Beauty Medicine',
            'Manhattan\'s Finest Care'
        ];
        
        try {
            this.typed = new Typed(this.typingText, {
                strings: services,
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 3000,
                loop: true,
                showCursor: false,
                fadeOut: true,
                fadeOutDelay: 500,
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
                this.trackEvent('hero_booking_clicked', { location: 'hero_primary_cta' });
            });
            
            this.addLuxuryButtonEffects(this.heroBookingBtn);
        }
        
        // Video play button
        if (this.videoPlayBtn) {
            this.videoPlayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openVideoModal();
                this.trackEvent('hero_video_clicked', { location: 'hero_video_cta' });
            });
            
            this.addLuxuryButtonEffects(this.videoPlayBtn);
        }
        
        // Additional CTA buttons
        const additionalCTAs = document.querySelectorAll('#headerCTA, #mobileCTA, .book-with-doctor');
        additionalCTAs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
            });
            this.addLuxuryButtonEffects(btn);
        });
    }
    
    addLuxuryButtonEffects(button) {
        if (!button) return;
        
        // Manhattan ripple effect
        button.addEventListener('click', (e) => {
            this.createManhattanRipple(e, button);
        });
        
        // Magnetic effect for desktop
        if (!EviaManhattanApp.isMobile) {
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
                this.createManhattanRipple(e, button);
                button.click();
            }
        });
    }
    
    createManhattanRipple(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'manhattan-ripple-effect';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.2;
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
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
        
        const strength = 0.15;
        const magnetX = x * strength;
        const magnetY = y * strength;
        
        button.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const headerHeight = 90;
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
            const opacity = scrollY > 200 ? 0 : 1;
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
        const headerHeight = 90;
        let targetPosition;
        
        if (target === '#hero') {
            targetPosition = 0;
        } else {
            targetPosition = element.offsetTop - headerHeight - 30;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        this.trackEvent('side_nav_clicked', { target: target });
    }
    
    updateActiveDot() {
        const sections = ['hero', 'about', 'services', 'results', 'contact'];
        
        const observerOptions = {
            rootMargin: '-45% 0px -45% 0px',
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
        
        EviaManhattanApp.observers.sideNav = observer;
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 80; // Slower, more luxury feel
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    // Luxury completion effect
                    counter.style.transform = 'scale(1.15)';
                    counter.style.textShadow = '0 0 30px rgba(212, 175, 55, 0.8)';
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
                    
                    // Staggered animations
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 250);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.7 });
        
        const statsContainer = document.querySelector('.stats-manhattan-luxury');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
        
        EviaManhattanApp.observers.stats = statsObserver;
    }
    
    initScrollEffects() {
        // Add luxury scroll effects
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            // Parallax effect for video
            if (this.video && window.innerWidth > 768) {
                const parallaxValue = scrollY * 0.5;
                this.video.style.transform = `translate(-50%, -50%) scale(1.02) translateY(${parallaxValue}px)`;
            }
            
            // Floating elements parallax
            const floaters = document.querySelectorAll('.luxury-floater');
            floaters.forEach((floater, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = -(scrollY * speed);
                floater.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }
    
    initParallaxEffects() {
        if (typeof gsap !== 'undefined' && window.innerWidth > 768) {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero video parallax
            gsap.to('.hero-video-luxury', {
                yPercent: -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.manhattan-cinematic-hero',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
            
            // Luxury floaters
            gsap.to('.luxury-floater', {
                y: -120,
                rotation: 360,
                ease: 'none',
                stagger: 0.3,
                scrollTrigger: {
                    trigger: '.manhattan-cinematic-hero',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
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
            }, 500);
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
 * Manhattan Doctor Section Controller
 */
class ManhattanDoctorSection {
    constructor() {
        this.element = document.querySelector('.meet-doctor-manhattan');
        this.statNumbers = document.querySelectorAll('.stat-number-manhattan');
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
        
        console.log('👩‍⚕️ Initializing Manhattan doctor section');
        
        this.initButtonInteractions();
        this.initStatsCounter();
        this.initHoverEffects();
        this.initScrollAnimations();
    }
    
    initButtonInteractions() {
        if (this.bookWithDoctorBtn) {
            this.bookWithDoctorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
                this.trackEvent('book_with_doctor_clicked');
            });
            this.addLuxuryButtonEffects(this.bookWithDoctorBtn);
        }
        
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToServices();
                this.trackEvent('learn_more_doctor_clicked');
            });
            this.addLuxuryButtonEffects(this.learnMoreBtn);
        }
    }
    
    addLuxuryButtonEffects(button) {
        if (!button) return;
        
        button.addEventListener('click', (e) => {
            this.createManhattanRipple(e, button);
        });
        
        if (!EviaManhattanApp.isMobile) {
            button.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, button);
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        }
    }
    
    createManhattanRipple(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'manhattan-ripple-effect';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
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
        
        const strength = 0.12;
        const magnetX = x * strength;
        const magnetY = y * strength;
        
        button.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    // Manhattan completion effect
                    counter.style.transform = 'scale(1.2)';
                    counter.style.textShadow = '0 0 35px rgba(212, 175, 55, 0.9)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.textShadow = '';
                    }, 500);
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
                        }, index * 400);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.7 });
        
        const statsSection = document.querySelector('.stats-section-manhattan');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    initHoverEffects() {
        const expertiseItems = document.querySelectorAll('.expertise-item-luxury');
        
        expertiseItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.expertise-icon-manhattan');
                if (icon) {
                    this.createIconEffect(icon);
                }
            });
        });
        
        const credentialItems = document.querySelectorAll('.credential-item-luxury');
        credentialItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createGoldenShimmer(item);
            });
        });
    }
    
    createIconEffect(icon) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            background: rgba(212, 175, 55, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: manhattanIconEffect 0.8s ease-out;
            pointer-events: none;
        `;
        
        icon.style.position = 'relative';
        icon.appendChild(effect);
        
        setTimeout(() => effect.remove(), 800);
    }
    
    createGoldenShimmer(element) {
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(212, 175, 55, 0.4), 
                transparent);
            animation: goldenShimmer 0.8s ease-out;
            pointer-events: none;
            border-radius: inherit;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shimmer);
        
        setTimeout(() => shimmer.remove(), 800);
    }
    
    initScrollAnimations() {
        if (typeof gsap !== 'undefined' && window.innerWidth > 768) {
            // Doctor image entrance
            gsap.fromTo('.doctor-image-manhattan', 
                { x: -100, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.doctor-image-manhattan',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Doctor content entrance
            gsap.fromTo('.doctor-content-manhattan', 
                { x: 100, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.doctor-content-manhattan',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
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
            const headerHeight = 90;
            const targetPosition = servicesSection.offsetTop - headerHeight - 30;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    trackEvent(eventName, eventData = {}) {
        console.log('Event tracked:', eventName, eventData);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'doctor_section',
                ...eventData
            });
        }
    }
}

/**
 * Manhattan Modal System
 */
class ManhattanModalSystem {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        console.log('🏢 Initializing Manhattan modal system');
        
        this.initAppointmentModal();
        this.initVideoModal();
        this.initFormHandling();
        this.initKeyboardNavigation();
    }
    
    initAppointmentModal() {
        if (!this.appointmentModal) return;
        
        const closeBtn = this.appointmentModal.querySelector('.modal-close-manhattan');
        const overlay = this.appointmentModal.querySelector('.modal-overlay-manhattan');
        
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
        
        const closeBtn = this.videoModal.querySelector('.video-modal-close-manhattan');
        const overlay = this.videoModal.querySelector('.video-modal-overlay-manhattan');
        
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
            
            // Real-time validation
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    this.validateField(input);
                }
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
                <div class="btn-icon-luxury">
                    <i class="bi bi-arrow-clockwise"></i>
                </div>
            `;
        }
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage(form);
            this.trackFormSubmission(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
            }, 4000);
        }, 2500);
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
        
        const group = field.closest('.form-group-manhattan');
        if (group) {
            group.classList.toggle('error', !isValid);
            group.classList.toggle('valid', isValid);
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const group = field.closest('.form-group-manhattan');
        if (group) {
            group.classList.remove('error');
        }
    }
    
    showFormError(message) {
        // Create Manhattan style error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'manhattan-error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 40px;
            right: 40px;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 25px 30px;
            border-radius: 20px;
            font-size: 1rem;
            font-weight: 600;
            box-shadow: 0 20px 50px rgba(239, 68, 68, 0.5);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%) scale(0.8);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
        `;
        
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 28px; height: 28px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-exclamation" style="font-size: 14px;"></i>
                </div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateX(0) scale(1)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateX(100%) scale(0.8)';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="manhattan-success-message" style="text-align: center; padding: 80px 40px;">
                <div class="success-icon-manhattan" style="
                    width: 100px; 
                    height: 100px; 
                    margin: 0 auto 40px; 
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-size: 2.5rem;
                    box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
                ">
                    <i class="bi bi-check"></i>
                </div>
                <h3 style="
                    color: #442C15; 
                    margin-bottom: 25px; 
                    font-size: 2rem;
                    font-weight: 700;
                    font-family: 'Playfair Display', serif;
                ">Thank You!</h3>
                <p style="
                    color: #6D6D6D; 
                    line-height: 1.7;
                    font-size: 1.125rem;
                    margin-bottom: 25px;
                ">Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment at our Manhattan location.</p>
                <div style="
                    font-size: 0.9375rem;
                    color: #D4AF37;
                    font-style: italic;
                    font-weight: 600;
                ">This window will close automatically...</div>
            </div>
        `;
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
                const activeModal = document.querySelector('.manhattan-modal-luxury.active, .video-modal-manhattan.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }
    
    trackFormSubmission(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log('Form submission tracked:', data);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'contact',
                event_label: 'appointment_request',
                value: 1
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: 'Appointment Request'
            });
        }
    }
}

/**
 * Enhanced Animations Controller
 */
class ManhattanAnimationsController {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('✨ Initializing Manhattan animations');
        
        this.initAOS();
        this.initGSAP();
        this.addDynamicStyles();
        this.initIntersectionObservers();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1200,
                easing: 'ease-out-cubic',
                once: true,
                offset: 150,
                delay: 0,
                disable: EviaManhattanApp.isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
            
            // Refresh on window load
            window.addEventListener('load', () => {
                setTimeout(() => AOS.refresh(), 500);
            });
        }
    }
    
    initGSAP() {
        if (typeof gsap !== 'undefined' && window.innerWidth > 768) {
            gsap.registerPlugin(ScrollTrigger);
            
            // Manhattan building animations
            gsap.from('.manhattan-skyline .building', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: 'power3.out'
            });
            
            // Luxury floating elements
            gsap.to('.luxury-accent', {
                y: -50,
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none',
                stagger: 2
            });
            
            // Professional credentials animation
            gsap.from('.professional-credentials .credential-item', {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.professional-credentials',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }
    
    initIntersectionObservers() {
        // Enhance elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Add specific animations based on element type
                    if (entry.target.classList.contains('expertise-item-luxury')) {
                        this.animateExpertiseItem(entry.target);
                    }
                    
                    if (entry.target.classList.contains('stat-item-manhattan')) {
                        this.animateStatItem(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToObserve = document.querySelectorAll(
            '.expertise-item-luxury, .stat-item-manhattan, .credential-item-luxury, .brand-item-luxury'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
        
        EviaManhattanApp.observers.animations = observer;
    }
    
    animateExpertiseItem(element) {
        const icon = element.querySelector('.expertise-icon-manhattan');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }, 200);
        }
    }
    
    animateStatItem(element) {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 400);
    }
    
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes manhattanIconEffect {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
            }
            
            @keyframes goldenShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            .in-view {
                animation: fadeInUp 0.8s ease-out;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .expertise-item-luxury.in-view,
            .credential-item-luxury.in-view {
                animation: luxurySlideIn 0.8s ease-out;
            }
            
            @keyframes luxurySlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.metrics = {};
        
        this.init();
    }
    
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePerformance();
        });
        
        // Monitor scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                this.measureScrollPerformance();
                scrollTimeout = null;
            }, 100);
        }, { passive: true });
    }
    
    measurePerformance() {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.metrics = {
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstContentfulPaint: this.getFirstContentfulPaint(),
            timeToInteractive: performance.now() - this.startTime
        };
        
        console.log('📊 Performance Metrics:', this.metrics);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'page_load',
                value: Math.round(this.metrics.pageLoadTime)
            });
        }
    }
    
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }
    
    measureScrollPerformance() {
        const scrollStart = performance.now();
        
        requestAnimationFrame(() => {
            const scrollTime = performance.now() - scrollStart;
            
            if (scrollTime > 16) { // 60fps threshold
                console.warn('⚠️ Scroll performance issue detected:', scrollTime + 'ms');
            }
        });
    }
}

/**
 * Main Manhattan Application Controller
 */
class EviaManhattanApplication {
    constructor() {
        this.isLoading = true;
        this.components = {};
        
        this.init();
    }
    
    init() {
        console.log('🏢 Initializing Evia Manhattan Application...');
        
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
            this.components.preloader = new LuxuryManhattanPreloader();
            
            // Initialize other components after preloader completes
            window.addEventListener('manhattanPreloaderComplete', () => {
                this.onPreloaderComplete();
            });
            
            // Initialize header immediately (it should work during loading too)
            this.components.header = new ManhattanLuxuryHeader();
            this.components.mobileMenu = new ManhattanMobileMenu();
            this.components.modals = new ManhattanModalSystem();
            
            // Initialize performance monitoring
            this.components.performance = new PerformanceMonitor();
            
            // Bind global events
            this.bindGlobalEvents();
            
            console.log('✅ Manhattan application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Manhattan application:', error);
            this.handleInitError();
        }
    }
    
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize remaining components
        setTimeout(() => {
            this.components.hero = new ManhattanCinematicHero();
            this.components.doctor = new ManhattanDoctorSection();
            this.components.animations = new ManhattanAnimationsController();
            
            console.log('🎬 Post-preloader components initialized');
            
            // Track successful app initialization
            this.trackEvent('app_initialized', { 
                loadTime: performance.now(),
                userAgent: navigator.userAgent.substring(0, 50)
            });
        }, 600);
    }
    
    bindGlobalEvents() {
        // Resize handler
        window.addEventListener('resize', () => {
            EviaManhattanApp.isMobile = window.innerWidth <= 768;
            
            // Refresh AOS if available
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 400);
            }
        });
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.trackEvent('javascript_error', {
                message: event.error?.message || 'Unknown error',
                filename: event.filename,
                lineno: event.lineno
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.trackEvent('promise_rejection', {
                reason: event.reason?.toString() || 'Unknown rejection'
            });
        });
    }
    
    pauseAnimations() {
        // Pause video if playing
        const video = document.querySelector('.hero-video-luxury');
        if (video && !video.paused) {
            video.pause();
        }
        
        // Pause GSAP animations if available
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    }
    
    resumeAnimations() {
        // Resume video if it was playing
        const video = document.querySelector('.hero-video-luxury');
        if (video && video.paused) {
            video.play().catch(e => {
                console.log('Video resume failed:', e);
            });
        }
        
        // Resume GSAP animations if available
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.play();
        }
    }
    
    handleInitError() {
        // Remove preloader and loading class
        document.body.classList.remove('loading');
        const preloader = document.getElementById('luxuryPreloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
    
    // Utility methods for global use
    scrollToElement(selector, offset = 90) {
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
    
    trackEvent(eventName, eventData = {}) {
        console.log('📊 Event tracked:', eventName, eventData);
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'manhattan_spa',
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
    
    // Cleanup method
    destroy() {
        // Clean up components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // Clean up observers
        Object.values(EviaManhattanApp.observers).forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        
        // Clean up timers
        Object.values(EviaManhattanApp.timers).forEach(timer => {
            if (timer) {
                clearTimeout(timer);
                clearInterval(timer);
            }
        });
        
        console.log('🧹 Manhattan application cleaned up');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.EviaManhattanApp = new EviaManhattanApplication();
});

// Global utility functions for external use
window.ManhattanUtils = {
    scrollTo: (selector, offset = 90) => {
        if (window.EviaManhattanApp) {
            window.EviaManhattanApp.scrollToElement(selector, offset);
        }
    },
    
    openModal: (modalId) => {
        if (window.EviaManhattanApp) {
            window.EviaManhattanApp.openModal(modalId);
        }
    },
    
    closeModal: (modalId) => {
        if (window.EviaManhattanApp) {
            window.EviaManhattanApp.closeModal(modalId);
        }
    },
    
    trackEvent: (eventName, eventData = {}) => {
        if (window.EviaManhattanApp) {
            window.EviaManhattanApp.trackEvent(eventName, eventData);
        }
    }
};

// Expose global state for debugging
window.EviaManhattanApp = EviaManhattanApp;
