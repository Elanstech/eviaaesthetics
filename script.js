/*
* Evia Aesthetics - Complete Bulletproof JavaScript
* Version: 4.0 - Stunning & Functional
*/

// ==============================
// MAIN APPLICATION CLASS
// ==============================
class EviaAestheticsApp {
    constructor() {
        this.isLoaded = false;
        this.countersAnimated = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚀 Initializing Evia Aesthetics...');
        
        // Initialize all components
        this.initPreloader();
        this.initNavigation();
        this.initAnimations();
        this.initHeroSection();
        this.initModals();
        this.initScrollEffects();
        this.initInteractiveElements();
        
        this.isLoaded = true;
        console.log('✨ Evia Aesthetics loaded successfully!');
    }

    // ==============================
    // PRELOADER
    // ==============================
    initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                    this.triggerInitialAnimations();
                }, 600);
            }, 1200);
        });

        // Fallback
        setTimeout(() => {
            if (preloader.style.opacity !== '0') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                    this.triggerInitialAnimations();
                }, 600);
            }
        }, 4000);
    }

    // ==============================
    // NAVIGATION
    // ==============================
    initNavigation() {
        const header = document.querySelector('.site-header');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (!header) return;

        // Header scroll effect
        const handleScroll = this.throttle(() => {
            const scrolled = window.scrollY > 50;
            header.classList.toggle('scrolled', scrolled);
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Mobile menu toggle
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                const isActive = mobileToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                this.animateMobileToggle(mobileToggle, isActive);
            });
        }

        // Mobile dropdowns
        const dropdownItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
        dropdownItems.forEach(item => {
            const link = item.querySelector('a');
            const dropdown = item.querySelector('.mobile-dropdown');
            
            if (link && dropdown) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                });
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu?.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Smooth scroll for anchor links
        this.initSmoothScroll();
    }

    animateMobileToggle(toggle, isActive) {
        const spans = toggle.querySelectorAll('span');
        if (typeof gsap !== 'undefined') {
            if (isActive) {
                gsap.to(spans[0], { rotation: 45, y: 9, duration: 0.3 });
                gsap.to(spans[1], { opacity: 0, duration: 0.2 });
                gsap.to(spans[2], { rotation: -45, y: -9, duration: 0.3 });
            } else {
                gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
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

    // ==============================
    // ANIMATIONS
    // ==============================
    initAnimations() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }

        // Initialize GSAP
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    triggerInitialAnimations() {
        if (typeof gsap !== 'undefined') {
            // Animate hero elements
            const tl = gsap.timeline({ delay: 0.5 });
            
            tl.from('.premium-badge', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            })
            .from('.title-line-1, .title-line-2, .title-line-3', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.hero-subtitle', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.hero-actions .btn-hero-primary, .hero-actions .btn-hero-secondary', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.2')
            .from('.hero-stats', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.hero-visual', {
                duration: 1,
                x: 100,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.8')
            .from('.service-card', {
                duration: 0.8,
                scale: 0,
                opacity: 0,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.5')
            .from('.central-feature', {
                duration: 0.8,
                scale: 0,
                opacity: 0,
                ease: 'back.out(1.7)'
            }, '-=0.3');
        }
    }

    // ==============================
    // HERO SECTION
    // ==============================
    initHeroSection() {
        this.initCounterAnimations();
        this.initButtonEffects();
        this.initScrollIndicator();
        
        console.log('🎨 Hero section initialized');
    }

    initCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-target]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.target);
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

        // Observe counters
        this.observeElements(counterElements, (element) => {
            if (!this.countersAnimated) {
                this.countersAnimated = true;
                counterElements.forEach((counter, index) => {
                    setTimeout(() => animateCounter(counter), index * 200);
                });
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
        const buttons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .btn-appointment');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRippleEffect(e, button));
            
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
        });
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

    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
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
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ==============================
    // MODALS
    // ==============================
    initModals() {
        const modal = document.getElementById('appointmentModal');
        const triggers = document.querySelectorAll('.btn-appointment, .btn-hero-primary, #heroBookBtn');
        const closeBtn = modal?.querySelector('.modal-close');
        const overlay = modal?.querySelector('.modal-overlay');
        
        if (!modal) return;

        // Open modal
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(modal);
            });
        });

        // Close modal
        closeBtn?.addEventListener('click', () => this.closeModal(modal));
        overlay?.addEventListener('click', () => this.closeModal(modal));

        // Form submission
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e, modal));
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal(modal);
            }
        });
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (typeof gsap !== 'undefined') {
            const content = modal.querySelector('.modal-content');
            gsap.fromTo(content, 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }

    closeModal(modal) {
        if (typeof gsap !== 'undefined') {
            const content = modal.querySelector('.modal-content');
            gsap.to(content, {
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
        
        console.log('📋 Form submitted:', formValues);
        
        // Show success message
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
        
        // Auto close and reset
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

    // ==============================
    // SCROLL EFFECTS
    // ==============================
    initScrollEffects() {
        // Parallax for floating elements
        const floatingElements = document.querySelectorAll('.float-element');
        
        if (floatingElements.length > 0) {
            const updateParallax = this.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                floatingElements.forEach((element, index) => {
                    const speed = 0.5 + (index * 0.1);
                    const yPos = rate * speed;
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            }, 16);
            
            window.addEventListener('scroll', updateParallax, { passive: true });
        }
    }

    // ==============================
    // INTERACTIVE ELEMENTS
    // ==============================
    initInteractiveElements() {
        // Service card hover effects
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { 
                        y: -10, 
                        scale: 1.02,
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

        // Add ripple styles
        this.addRippleStyles();
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

    // ==============================
    // UTILITY FUNCTIONS
    // ==============================
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
        } else {
            elements.forEach(callback);
        }
    }

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
}

// ==============================
// ENHANCED GSAP ANIMATIONS
// ==============================
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Enhanced hover effects for all interactive elements
    document.addEventListener('DOMContentLoaded', function() {
        // Service cards
        gsap.utils.toArray('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Buttons
        gsap.utils.toArray('.btn-hero-primary, .btn-hero-secondary, .btn-appointment').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Trust badges
        gsap.utils.toArray('.trust-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                gsap.to(badge, {
                    scale: 1.1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            
            badge.addEventListener('mouseleave', () => {
                gsap.to(badge, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    });
}

// ==============================
// INITIALIZE APPLICATION
// ==============================
let eviaApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        eviaApp = new EviaAestheticsApp();
    });
} else {
    eviaApp = new EviaAestheticsApp();
}

// Global API
window.EviaAesthetics = {
    app: () => eviaApp,
    refresh: () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
};

// Console styling
console.log(
    '%c✨ Evia Aesthetics %c4.0 %cStunning & Functional Design Loaded!',
    'color: #F4A024; font-weight: bold; font-size: 16px;',
    'color: #5A3925; font-weight: bold; background: #F4A024; padding: 2px 6px; border-radius: 3px;',
    'color: #68b984; font-weight: normal;'
);
