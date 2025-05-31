/*
* Evia Aesthetics - Redesigned Modern Website JavaScript
* Created by: AI Assistant
* Version: 3.0 - Enhanced Bright Medspa Experience with Advanced Minimalistic Hero
* Last Updated: 2025-05-29
*/

// ==============================
// Enhanced Application Class
// ==============================
class EviaAestheticsApp {
    constructor() {
        this.isLoaded = false;
        this.animations = {};
        this.observers = {};
        this.countersAnimated = false;
        
        this.init();
    }

    init() {
        // Wait for the DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Initialize all components in order
        this.initPreloader();
        this.initNavigation();
        this.initAnimations();
        this.initHeroSection();
        this.initModalHandlers();
        this.initScrollEffects();
        this.initInteractiveElements();
        this.initPerformanceOptimizations();
        
        // Mark as loaded
        this.isLoaded = true;
        
        // Log initialization
        console.log('✨ Evia Aesthetics website initialized with enhanced medspa design');
        this.logBrowserCapabilities();
    }

    /**
     * Enhanced preloader with smooth transitions
     */
    initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;
        
        // Fade out preloader when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                    
                    // Start hero animations
                    this.triggerHeroAnimations();
                }, 600);
            }, 1200);
        });
        
        // Fallback to hide preloader
        setTimeout(() => {
            if (preloader.style.opacity !== '0') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                    this.triggerHeroAnimations();
                }, 600);
            }
        }, 4000);
    }

    /**
     * Enhanced navigation with improved mobile experience
     */
    initNavigation() {
        const header = document.querySelector('.site-header');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileDropdownItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
        const navDropdownItems = document.querySelectorAll('.nav-item.dropdown');
        
        if (!header) return;
        
        // Enhanced scroll effects on header
        const handleHeaderScroll = this.throttle(() => {
            const scrolled = window.scrollY > 50;
            header.classList.toggle('scrolled', scrolled);
            
            // Add smooth background transition
            if (scrolled) {
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.backdropFilter = 'none';
            }
        }, 10);
        
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        
        // Force initial check
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.style.backdropFilter = 'blur(20px)';
        }
        
        // Enhanced mobile menu toggle
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                const isActive = mobileToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                this.animateMobileToggle(mobileToggle, isActive);
                this.animateMobileMenu(mobileMenu, isActive);
            });
        }
        
        // Mobile dropdowns with enhanced animations
        mobileDropdownItems.forEach(item => {
            const link = item.querySelector('a');
            const dropdown = item.querySelector('.mobile-dropdown');
            
            if (link && dropdown) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                    this.animateMobileDropdown(dropdown, item.classList.contains('active'));
                });
            }
        });
        
        // Desktop dropdowns with enhanced effects
        navDropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const menu = item.querySelector('.dropdown-menu');
            const icon = link?.querySelector('i');
            
            if (!menu) return;
            
            item.addEventListener('mouseenter', () => {
                this.animateDesktopDropdown(menu, icon, true);
            });
            
            item.addEventListener('mouseleave', () => {
                this.animateDesktopDropdown(menu, icon, false);
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu?.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Enhanced active navigation highlighting
        this.initActiveNavigation();
    }

    animateMobileToggle(toggle, isActive) {
        const spans = toggle.querySelectorAll('span');
        if (typeof gsap !== 'undefined') {
            if (isActive) {
                gsap.to(spans[0], { rotation: 45, y: 9, duration: 0.3, ease: "power2.inOut" });
                gsap.to(spans[1], { opacity: 0, duration: 0.2 });
                gsap.to(spans[2], { rotation: -45, y: -9, duration: 0.3, ease: "power2.inOut" });
            } else {
                gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
                gsap.to(spans[1], { opacity: 1, duration: 0.3, delay: 0.1 });
                gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
            }
        }
    }

    animateMobileMenu(menu, isActive) {
        if (typeof gsap !== 'undefined') {
            if (isActive) {
                gsap.fromTo(menu, 
                    { x: '100%' },
                    { x: '0%', duration: 0.4, ease: "power3.out" }
                );
                
                // Animate menu items
                const menuItems = menu.querySelectorAll('.mobile-nav-item');
                gsap.fromTo(menuItems,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, delay: 0.2 }
                );
            }
        }
    }

    animateMobileDropdown(dropdown, isOpen) {
        if (typeof gsap !== 'undefined') {
            if (isOpen) {
                dropdown.style.display = 'block';
                gsap.fromTo(dropdown, 
                    { height: 0, opacity: 0 },
                    { height: 'auto', opacity: 1, duration: 0.3, ease: "power2.out" }
                );
            } else {
                gsap.to(dropdown, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => dropdown.style.display = 'none'
                });
            }
        } else {
            dropdown.style.display = isOpen ? 'block' : 'none';
        }
    }

    animateDesktopDropdown(menu, icon, isEntering) {
        if (typeof gsap !== 'undefined') {
            if (isEntering) {
                gsap.to(menu, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                if (icon) {
                    gsap.to(icon, { rotation: 180, duration: 0.3, ease: 'power2.out' });
                }
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    visibility: 'hidden',
                    duration: 0.3,
                    ease: 'power2.in'
                });
                if (icon) {
                    gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.in' });
                }
            }
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            this.animateMobileToggle(mobileToggle, false);
        }
    }

    initActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize enhanced animations
     */
    initAnimations() {
        // Initialize GSAP ScrollTrigger if available
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Initialize AOS with enhanced settings
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                mirror: false,
                offset: 50,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        }
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize floating animations
        this.initFloatingAnimations();
    }

    initScrollAnimations() {
        const fadeElements = document.querySelectorAll('[data-aos]');
        
        // Fallback animation for elements without AOS
        const fadeInElements = document.querySelectorAll('.fade-in:not([data-aos])');
        
        if (typeof gsap !== 'undefined' && fadeInElements.length > 0) {
            fadeInElements.forEach(element => {
                gsap.from(element, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        }
    }

    initFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.glass-card, .particle, .shape');
        
        if (typeof gsap !== 'undefined') {
            floatingElements.forEach((element, index) => {
                // Only animate if element exists
                if (element) {
                    // Continuous floating animation
                    gsap.to(element, {
                        y: index % 2 === 0 ? -15 : 15,
                        duration: 3 + Math.random() * 2,
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true,
                        delay: index * 0.2
                    });
                    
                    // Rotation animation for particles and shapes
                    if (element.classList.contains('shape') || element.classList.contains('particle')) {
                        gsap.to(element, {
                            rotation: 360,
                            duration: 20 + Math.random() * 10,
                            ease: 'none',
                            repeat: -1
                        });
                    }
                }
            });
        }
    }

    /**
     * Enhanced hero section initialization
     */
    initHeroSection() {
        this.initCounterAnimations();
        this.initButtonEffects();
        this.initParallaxEffects();
        this.initScrollIndicator();
        
        console.log('🎨 Enhanced hero section initialized');
    }

    initCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-count]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.count);
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
                    this.formatCounterValue(element, target);
                }
            };

            updateCounter();
        };

        // Observe counters and animate when they come into view
        this.observeElements(counterElements, (element) => {
            if (!this.countersAnimated) {
                this.countersAnimated = true;
                setTimeout(() => animateCounter(element), 500);
            }
        }, { threshold: 0.7 });
    }

    formatCounterValue(element, target) {
        if (target >= 1000) {
            element.textContent = (target / 1000).toFixed(1) + 'K+';
        } else if (target === 98) {
            element.textContent = target + '%';
        } else {
            element.textContent = target + '+';
        }
    }

    initButtonEffects() {
        const primaryButtons = document.querySelectorAll('.btn-primary-new, .btn-primary');
        const secondaryButtons = document.querySelectorAll('.btn-secondary-new, .btn-secondary');
        
        // Add ripple effect to buttons
        [...primaryButtons, ...secondaryButtons].forEach(button => {
            button.addEventListener('click', (e) => this.createRippleEffect(e, button));
            this.addButtonHoverEffects(button);
        });
        
        // Add ripple CSS if not exists
        this.addRippleStyles();
    }

    createRippleEffect(e, button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    addButtonHoverEffects(button) {
        button.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { scale: 1.05, duration: 0.3, ease: "power2.out" });
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { scale: 1, duration: 0.3, ease: "power2.out" });
            }
        });
    }

    addRippleStyles() {
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleEffect {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            
            if (!heroSection) {
                ticking = false;
                return;
            }
            
            const heroHeight = heroSection.offsetHeight;
            const scrollPercent = Math.min(scrolled / heroHeight, 1);
            
            // Parallax for background elements
            this.updateParallaxElements(scrollPercent);
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }

    updateParallaxElements(scrollPercent) {
        const particles = document.querySelectorAll('.particle');
        const glassCards = document.querySelectorAll('.glass-card');
        
        particles.forEach((particle, index) => {
            if (particle) {
                const speed = 0.1 + (index * 0.05);
                const translateY = scrollPercent * 100 * speed;
                particle.style.transform = `translateY(${translateY}px)`;
            }
        });
        
        glassCards.forEach((card, index) => {
            if (card) {
                const speed = 0.05 + (index * 0.02);
                const translateY = scrollPercent * 30 * speed;
                card.style.transform = `translateY(${translateY}px)`;
            }
        });
    }

    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator-new');
        
        if (!scrollIndicator) return;
        
        // Hide/show based on scroll position
        const updateIndicator = this.throttle(() => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.3)));
                
                scrollIndicator.style.opacity = opacity;
            }
        }, 16);
        
        window.addEventListener('scroll', updateIndicator, { passive: true });
        
        // Smooth scroll to next section
        scrollIndicator.addEventListener('click', () => {
            const heroSection = document.querySelector('.hero-section');
            const nextSection = heroSection?.nextElementSibling;
            
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Scroll to a reasonable position if no next section
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }
        });
    }

    triggerHeroAnimations() {
        // Trigger hero animations after page load
        if (typeof gsap !== 'undefined') {
            // Use the new class names for hero elements
            const heroElements = document.querySelectorAll('.minimal-badge, .hero-title, .hero-subtitle, .hero-actions, .minimal-stats');
            
            if (heroElements.length > 0) {
                gsap.from(heroElements, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: 0.3
                });
            }
            
            // Animate hero visual
            const heroVisual = document.querySelector('.hero-visual-new');
            if (heroVisual) {
                gsap.from(heroVisual, {
                    opacity: 0,
                    x: 50,
                    duration: 1,
                    ease: 'power2.out',
                    delay: 0.6
                });
            }
        }
    }

    /**
     * Enhanced modal handlers
     */
    initModalHandlers() {
        const appointmentModal = document.getElementById('appointmentModal');
        const appointmentButtons = document.querySelectorAll('.btn-appointment, .btn-primary-new, #bookConsultationBtn');
        const closeButton = appointmentModal?.querySelector('.modal-close');
        const modalOverlay = appointmentModal?.querySelector('.modal-overlay');
        
        if (!appointmentModal) return;
        
        // Open modal when appointment buttons are clicked
        appointmentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(appointmentModal);
            });
        });
        
        // Close modal handlers
        closeButton?.addEventListener('click', () => this.closeModal(appointmentModal));
        modalOverlay?.addEventListener('click', () => this.closeModal(appointmentModal));
        
        // Handle form submission
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => this.handleFormSubmission(e, appointmentModal));
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appointmentModal.classList.contains('active')) {
                this.closeModal(appointmentModal);
            }
        });
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate modal opening
        if (typeof gsap !== 'undefined') {
            const modalContent = modal.querySelector('.modal-content');
            gsap.fromTo(modalContent, 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }

    closeModal(modal) {
        if (typeof gsap !== 'undefined') {
            const modalContent = modal.querySelector('.modal-content');
            gsap.to(modalContent, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleFormSubmission(e, modal) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        // Log form data (replace with actual API call)
        console.log('📋 Form submitted:', formValues);
        
        // Show success message with animation
        const successMessage = `
            <div class="form-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Consultation Requested!</h3>
                <p>Thank you for your interest. Our team will contact you within 24 hours to schedule your free consultation.</p>
            </div>
        `;
        
        form.innerHTML = successMessage;
        
        if (typeof gsap !== 'undefined') {
            gsap.from('.form-success', {
                opacity: 0,
                scale: 0.8,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
        
        // Close modal after delay
        setTimeout(() => {
            this.closeModal(modal);
            setTimeout(() => {
                form.innerHTML = this.getOriginalFormHTML();
            }, 500);
        }, 3000);
    }

    getOriginalFormHTML() {
        return `
            <h2>Book Your Consultation</h2>
            <div class="form-group">
                <input type="text" name="name" placeholder="Full Name" required>
            </div>
            <div class="form-group">
                <input type="email" name="email" placeholder="Email Address" required>
            </div>
            <div class="form-group">
                <input type="tel" name="phone" placeholder="Phone Number" required>
            </div>
            <div class="form-group">
                <select name="service" required>
                    <option value="">Select Service</option>
                    <option value="consultation">Initial Consultation</option>
                    <option value="facial">Facial Treatments</option>
                    <option value="body">Body Contouring</option>
                    <option value="injectable">Injectable Treatments</option>
                </select>
            </div>
            <button type="submit" class="form-submit">Request Appointment</button>
        `;
    }

    /**
     * Initialize scroll effects
     */
    initScrollEffects() {
        // Smooth scroll for anchor links
        this.initSmoothScroll();
        
        // Background parallax for future sections
        this.initBackgroundParallax();
    }

    initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initBackgroundParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        if (parallaxElements.length === 0) return;
        
        const updateParallax = this.throttle(() => {
            parallaxElements.forEach(element => {
                const scrollPosition = window.pageYOffset;
                const elementTop = element.getBoundingClientRect().top + scrollPosition;
                const elementVisible = window.innerHeight;
                
                if (elementTop < scrollPosition + elementVisible && elementTop + element.offsetHeight > scrollPosition) {
                    const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
                    const yPos = (scrollPosition - elementTop) * speed;
                    element.style.backgroundPosition = `center ${yPos}px`;
                }
            });
        }, 16);
        
        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    /**
     * Initialize interactive elements
     */
    initInteractiveElements() {
        // Enhanced button hover effects
        this.initEnhancedButtons();
        
        // Pill hover effects
        this.initPillEffects();
        
        // Card hover effects
        this.initCardEffects();
    }

    initEnhancedButtons() {
        const buttons = document.querySelectorAll('.btn-primary-new, .btn-secondary-new, .btn-primary, .btn-secondary, .pill');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        y: -2, 
                        duration: 0.3, 
                        ease: "power2.out" 
                    });
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        y: 0, 
                        duration: 0.3, 
                        ease: "power2.out" 
                    });
                }
            });
        });
    }

    initPillEffects() {
        const pills = document.querySelectorAll('.pill');
        
        pills.forEach(pill => {
            pill.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        scale: 1.05, 
                        duration: 0.3, 
                        ease: "power2.out" 
                    });
                }
            });
            
            pill.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        scale: 1, 
                        duration: 0.3, 
                        ease: "power2.out" 
                    });
                }
            });
        });
    }

    initCardEffects() {
        const cards = document.querySelectorAll('.glass-card, .floating-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        y: -10, 
                        scale: 1.05,
                        duration: 0.3, 
                        ease: "power2.out" 
                    });
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        y: 0, 
                        scale: 1,
                        duration: 0.3, 
                        ease: "power2.out" 
                    });
                }
            });
        });
    }

    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        // Lazy load elements
        this.initLazyLoading();
        
        // Optimize for device capabilities
        this.optimizeForDevice();
        
        // Respect reduced motion preferences
        this.respectReducedMotion();
        
        // Initialize resize handler
        this.initResizeHandler();
    }

    initLazyLoading() {
        const lazyElements = document.querySelectorAll('.particle, .glass-card, .shape');
        
        this.observeElements(lazyElements, (element) => {
            if (element) {
                element.style.opacity = '1';
            }
        });
    }

    optimizeForDevice() {
        // Reduce animations on low-performance devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--transition-medium', '0.2s');
            console.log('🔧 Reduced animations for low-performance device');
        }
        
        // Disable parallax on mobile for better performance
        if (window.innerWidth < 768) {
            const parallaxElements = document.querySelectorAll('.parallax-bg, .particle');
            parallaxElements.forEach(el => {
                el.style.transform = 'none';
            });
        }
    }

    respectReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-medium', '0.01s');
            
            // Disable GSAP animations
            if (typeof gsap !== 'undefined') {
                gsap.globalTimeline.clear();
            }
            
            console.log('♿ Reduced motion enabled for accessibility');
        }
    }

    initResizeHandler() {
        const handleResize = this.debounce(() => {
            // Refresh ScrollTrigger if available
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
            
            // Refresh AOS if available
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Update hero height on mobile
            if (window.innerWidth < 768) {
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.style.minHeight = `${window.innerHeight}px`;
                }
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
    }

    /**
     * Utility Functions
     */
    
    // Generic element observer
    observeElements(elements, callback, options = {}) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, ...options });
            
            elements.forEach(element => observer.observe(element));
            this.observers.elements = observer;
        } else {
            // Fallback for browsers without Intersection Observer
            elements.forEach(callback);
        }
    }

    // Throttle function for performance
    throttle(func, limit) {
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
    }

    // Debounce function for resize events
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

    // Browser capability logging
    logBrowserCapabilities() {
        const capabilities = {
            webGL: this.supportsWebGL(),
            intersectionObserver: 'IntersectionObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window,
            gsap: typeof gsap !== 'undefined',
            aos: typeof AOS !== 'undefined',
            modernBrowser: this.isModernBrowser()
        };
        
        console.log('🌐 Browser capabilities:', capabilities);
        return capabilities;
    }

    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    isModernBrowser() {
        return !!(
            window.Promise &&
            window.fetch &&
            window.Object.assign &&
            window.Array.from
        );
    }

    // Public API methods
    destroy() {
        // Clean up observers
        Object.values(this.observers).forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        // Clean up animations
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('*');
            ScrollTrigger?.killAll();
        }
        
        console.log('🧹 Evia Aesthetics app destroyed');
    }

    refresh() {
        // Refresh ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Refresh AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        console.log('🔄 Evia Aesthetics app refreshed');
    }
}

// ==============================
// Enhanced GSAP Integration
// ==============================
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Enhanced GSAP animations for the redesigned hero
    document.addEventListener('DOMContentLoaded', function() {
        // Wait for elements to exist before animating
        setTimeout(() => {
            // Create a master timeline
            const tl = gsap.timeline({ delay: 0.5 });
            
            // Check if elements exist before animating
            const minimalBadge = document.querySelector('.minimal-badge');
            const titleElements = document.querySelectorAll('.title-primary, .title-accent, .title-subtle');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const heroButtons = document.querySelectorAll('.hero-actions button');
            const minimalStats = document.querySelector('.minimal-stats');
            const heroVisual = document.querySelector('.hero-visual-new');
            const glassCards = document.querySelectorAll('.glass-card');
            const centralFeature = document.querySelector('.central-feature');
            const scrollIndicator = document.querySelector('.scroll-indicator-new');
            
            // Animate minimal badge
            if (minimalBadge) {
                tl.from(minimalBadge, {
                    duration: 0.6,
                    y: 30,
                    opacity: 0,
                    ease: 'power2.out'
                });
            }
            
            // Animate title lines
            if (titleElements.length > 0) {
                tl.from(titleElements, {
                    duration: 0.8,
                    y: 50,
                    opacity: 0,
                    stagger: 0.2,
                    ease: 'power2.out'
                }, '-=0.3');
            }
            
            // Animate subtitle
            if (heroSubtitle) {
                tl.from(heroSubtitle, {
                    duration: 0.6,
                    y: 30,
                    opacity: 0,
                    ease: 'power2.out'
                }, '-=0.4');
            }
            
            // Animate action buttons
            if (heroButtons.length > 0) {
                tl.from(heroButtons, {
                    duration: 0.6,
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out'
                }, '-=0.2');
            }
            
            // Animate minimal stats
            if (minimalStats) {
                tl.from(minimalStats, {
                    duration: 0.6,
                    y: 30,
                    opacity: 0,
                    ease: 'power2.out'
                }, '-=0.3');
            }
            
            // Animate hero visual
            if (heroVisual) {
                tl.from(heroVisual, {
                    duration: 1,
                    x: 100,
                    opacity: 0,
                    ease: 'power2.out'
                }, '-=0.8');
            }
            
            // Animate glass cards
            if (glassCards.length > 0) {
                tl.from(glassCards, {
                    duration: 0.8,
                    scale: 0,
                    opacity: 0,
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
                }, '-=0.5');
            }
            
            // Animate central feature
            if (centralFeature) {
                tl.from(centralFeature, {
                    duration: 0.8,
                    scale: 0,
                    opacity: 0,
                    ease: 'back.out(1.7)'
                }, '-=0.3');
            }
            
            // Animate scroll indicator
            if (scrollIndicator) {
                tl.from(scrollIndicator, {
                    duration: 0.6,
                    y: 20,
                    opacity: 0,
                    ease: 'power2.out'
                }, '-=0.2');
            }
        }, 100);
    });
}

// ==============================
// Initialize Application
// ==============================

// Create global instance
let eviaApp;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        eviaApp = new EviaAestheticsApp();
    });
} else {
    eviaApp = new EviaAestheticsApp();
}

// ==============================
// Global API & Legacy Support
// ==============================

// Export for global access
window.EviaAesthetics = {
    app: () => eviaApp,
    
    // Public methods
    refresh: () => eviaApp?.refresh(),
    destroy: () => eviaApp?.destroy()
};

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('evia-app-end');
    if (performance.getEntriesByName('evia-app-start').length > 0) {
        performance.measure('evia-app-init', 'evia-app-start', 'evia-app-end');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaAestheticsApp;
}

// Console styling for development
console.log(
    '%c✨ Evia Aesthetics %c3.0 %cEnhanced Medspa Experience Loaded',
    'color: #F4A024; font-weight: bold; font-size: 16px;',
    'color: #5A3925; font-weight: bold; background: #F4A024; padding: 2px 6px; border-radius: 3px;',
    'color: #68b984; font-weight: normal;'
);
