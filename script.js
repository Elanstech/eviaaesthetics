/* ========================================
   EVIA AESTHETICS - COMPLETE WEBSITE SCRIPT
   Fixed for Mobile & All Functionality
   ======================================== */

// Ensure AOS is properly initialized and content is visible
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with proper settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });
        
        setTimeout(() => {
            AOS.refresh();
        }, 500);
    }
    
    // Ensure hero content is visible
    const heroContent = document.querySelector('.hero-content-stack');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.visibility = 'visible';
        heroContent.style.zIndex = '100';
    }
    
    // Force video to load properly
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.load();
        heroVideo.play().catch(e => console.log('Video autoplay prevented:', e));
    }
});

// Add CSS overrides to prevent conflicts
const style = document.createElement('style');
style.textContent = `
    .hero-content-stack {
        opacity: 1 !important;
        visibility: visible !important;
        z-index: 100 !important;
    }
    
    .services-title, .services-header, .services-subtitle {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .hero-headline-primary, .hero-headline-secondary, .hero-subheadline-elegant {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Mobile menu fix */
    .modern-mobile-menu {
        transform: translateX(100%);
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .modern-mobile-menu.active {
        transform: translateX(0);
        visibility: visible;
    }
    
    .modern-mobile-backdrop {
        opacity: 0;
        visibility: hidden;
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .modern-mobile-backdrop.active {
        opacity: 1;
        visibility: visible;
    }
`;
document.head.appendChild(style);

/* ========================================
   MOBILE MENU COMPONENT - COMPLETELY FIXED
   ======================================== */
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('luxuryMobileToggle') || document.querySelector('.luxury-mobile-toggle');
        this.menu = document.getElementById('mobileMenu') || document.querySelector('.modern-mobile-menu');
        this.backdrop = document.getElementById('mobileBackdrop') || document.querySelector('.modern-mobile-backdrop');
        this.closeBtn = document.getElementById('mobileClose') || document.querySelector('.mobile-menu-close');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        this.ctaBtn = document.querySelector('.mobile-cta-button');
        this.isOpen = false;
        
        console.log('Mobile Menu elements found:', {
            toggle: !!this.toggle,
            menu: !!this.menu,
            backdrop: !!this.backdrop,
            closeBtn: !!this.closeBtn
        });
        
        if (this.toggle && this.menu) {
            this.init();
            console.log('✅ Mobile Menu Initialized Successfully');
        } else {
            console.error('❌ Mobile menu elements not found');
        }
    }

    init() {
        this.setupInitialState();
        this.bindEvents();
    }

    setupInitialState() {
        // Ensure menu is properly hidden initially
        if (this.menu) {
            this.menu.classList.remove('active');
            this.menu.style.transform = 'translateX(100%)';
            this.menu.style.visibility = 'hidden';
        }
        
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
            this.backdrop.style.opacity = '0';
            this.backdrop.style.visibility = 'hidden';
        }
        
        if (this.toggle) {
            this.toggle.classList.remove('active');
        }
        
        document.body.classList.remove('mobile-menu-open');
        this.isOpen = false;
    }

    bindEvents() {
        // Toggle button - main functionality
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile toggle clicked');
                this.toggleMenu();
            });
            
            // Touch events for better mobile responsiveness
            this.toggle.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile toggle touched');
                this.toggleMenu();
            });
        }

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile close clicked');
                this.closeMenu();
            });
            
            this.closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenu();
            });
        }

        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', (e) => {
                console.log('Backdrop clicked');
                this.closeMenu();
            });
            
            this.backdrop.addEventListener('touchend', (e) => {
                this.closeMenu();
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                console.log('Mobile nav clicked:', href);
                this.navigateAndClose(href);
            });
            
            link.addEventListener('touchend', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateAndClose(href);
            });
        });

        // CTA button
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Mobile CTA clicked');
                this.navigateAndClose('#contact');
            });
            
            this.ctaBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.navigateAndClose('#contact');
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        console.log('Toggle menu called, current state:', this.isOpen);
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        console.log('Opening mobile menu');
        this.isOpen = true;
        
        // Update toggle button
        if (this.toggle) {
            this.toggle.classList.add('active');
        }
        
        // Show backdrop
        if (this.backdrop) {
            this.backdrop.classList.add('active');
            this.backdrop.style.opacity = '1';
            this.backdrop.style.visibility = 'visible';
        }
        
        // Show menu
        if (this.menu) {
            this.menu.classList.add('active');
            this.menu.style.transform = 'translateX(0)';
            this.menu.style.visibility = 'visible';
        }
        
        // Prevent body scroll
        document.body.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
        
        // Animate nav links
        this.navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 100);
        });
    }

    closeMenu() {
        console.log('Closing mobile menu');
        this.isOpen = false;
        
        // Update toggle button
        if (this.toggle) {
            this.toggle.classList.remove('active');
        }
        
        // Hide backdrop
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
            this.backdrop.style.opacity = '0';
            this.backdrop.style.visibility = 'hidden';
        }
        
        // Hide menu
        if (this.menu) {
            this.menu.classList.remove('active');
            this.menu.style.transform = 'translateX(100%)';
            setTimeout(() => {
                this.menu.style.visibility = 'hidden';
            }, 600);
        }
        
        // Restore body scroll
        document.body.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
        
        // Reset nav links
        this.navLinks.forEach(link => {
            link.style.transform = '';
            link.style.opacity = '';
        });
    }

    navigateAndClose(target) {
        console.log('Navigating to:', target);
        this.closeMenu();
        
        setTimeout(() => {
            if (target.startsWith('http')) {
                // External link
                window.open(target, '_blank');
            } else if (target.startsWith('#')) {
                // Internal anchor
                const element = document.querySelector(target);
                if (element) {
                    const headerHeight = 80;
                    const elementPosition = element.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                // Page navigation
                window.location.href = target;
            }
        }, 300);
    }
}

/* ========================================
   FLOATING BUTTONS - COMPLETELY FIXED
   ======================================== */
class FloatingButtons {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.hermes-back-to-top');
        this.contactFabBtn = document.getElementById('contactFabBtn') || document.querySelector('.hermes-contact-fab');
        this.contactBackdrop = document.getElementById('contactBackdrop') || document.querySelector('.contact-fab-backdrop');
        this.mainContactBtn = this.contactFabBtn?.querySelector('.main-contact-btn');
        this.contactOptions = document.querySelectorAll('.contact-option');
        
        // State management
        this.isContactExpanded = false;
        this.isBackToTopVisible = false;
        this.scrollThreshold = 400;
        this.lastScrollY = 0;
        
        console.log('Floating Buttons elements found:', {
            backToTop: !!this.backToTopBtn,
            contactFab: !!this.contactFabBtn,
            mainContactBtn: !!this.mainContactBtn,
            contactOptions: this.contactOptions.length
        });
        
        if (this.backToTopBtn || this.contactFabBtn) {
            this.init();
            console.log('✅ Floating Buttons Initialized Successfully');
        }
    }

    init() {
        this.setupInitialState();
        this.bindEvents();
        this.setupScrollObserver();
    }

    setupInitialState() {
        // Hide back to top initially
        if (this.backToTopBtn) {
            this.backToTopBtn.classList.remove('visible');
            this.backToTopBtn.style.opacity = '0';
            this.backToTopBtn.style.visibility = 'hidden';
            this.backToTopBtn.style.transform = 'translateY(100px) scale(0.8)';
        }
        
        // Close contact FAB initially
        if (this.contactFabBtn) {
            this.contactFabBtn.classList.remove('expanded');
            this.isContactExpanded = false;
        }
        
        if (this.contactBackdrop) {
            this.contactBackdrop.classList.remove('active');
            this.contactBackdrop.style.opacity = '0';
            this.contactBackdrop.style.visibility = 'hidden';
        }
    }

    bindEvents() {
        // Back to Top button
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back to top clicked');
                this.scrollToTop();
            });
            
            this.backToTopBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back to top touched');
                this.scrollToTop();
            });
        }

        // Contact FAB main button
        if (this.mainContactBtn) {
            this.mainContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Contact FAB clicked, current state:', this.isContactExpanded);
                this.toggleContactFab();
            });
            
            this.mainContactBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Contact FAB touched');
                this.toggleContactFab();
            });
        }

        // Contact backdrop
        if (this.contactBackdrop) {
            this.contactBackdrop.addEventListener('click', (e) => {
                console.log('Contact backdrop clicked');
                this.closeContactFab();
            });
            
            this.contactBackdrop.addEventListener('touchend', (e) => {
                this.closeContactFab();
            });
        }

        // Individual contact options
        this.contactOptions.forEach((option, index) => {
            const link = option.querySelector('.contact-link');
            const contactType = option.dataset.contact;
            
            if (link && contactType) {
                link.addEventListener('click', (e) => {
                    console.log('Contact option clicked:', contactType);
                    this.handleContactClick(e, contactType, link);
                });
                
                link.addEventListener('touchend', (e) => {
                    // Allow default for touch to work with tel: and mailto: links
                    console.log('Contact option touched:', contactType);
                    setTimeout(() => this.closeContactFab(), 500);
                });
            }
        });

        // Global events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Document click to close FAB
        document.addEventListener('click', (e) => {
            if (this.isContactExpanded && 
                this.contactFabBtn && 
                !this.contactFabBtn.contains(e.target)) {
                this.closeContactFab();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isContactExpanded) {
                this.closeContactFab();
            }
        });
    }

    setupScrollObserver() {
        // Simple scroll handler for back to top
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const shouldShow = scrollY > this.scrollThreshold;
            
            if (shouldShow !== this.isBackToTopVisible) {
                this.isBackToTopVisible = shouldShow;
                this.toggleBackToTopVisibility(shouldShow);
            }
        }, { passive: true });
    }

    handleScroll() {
        // Close contact FAB when scrolling
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (this.isContactExpanded && Math.abs(scrollY - this.lastScrollY) > 100) {
            this.closeContactFab();
        }
        
        this.lastScrollY = scrollY;
    }

    toggleBackToTopVisibility(shouldShow) {
        if (!this.backToTopBtn) return;
        
        console.log('Toggle back to top visibility:', shouldShow);
        
        if (shouldShow) {
            this.backToTopBtn.classList.add('visible');
            this.backToTopBtn.style.opacity = '1';
            this.backToTopBtn.style.visibility = 'visible';
            this.backToTopBtn.style.transform = 'translateY(0) scale(1)';
        } else {
            this.backToTopBtn.classList.remove('visible');
            this.backToTopBtn.style.opacity = '0';
            this.backToTopBtn.style.visibility = 'hidden';
            this.backToTopBtn.style.transform = 'translateY(100px) scale(0.8)';
        }
    }

    scrollToTop() {
        console.log('Scrolling to top');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Show feedback
        this.showFeedback('Scrolling to top...', 'ri-arrow-up-line');
    }

    toggleContactFab() {
        console.log('Toggle contact FAB, current state:', this.isContactExpanded);
        
        if (this.isContactExpanded) {
            this.closeContactFab();
        } else {
            this.openContactFab();
        }
    }

    openContactFab() {
        console.log('Opening contact FAB');
        this.isContactExpanded = true;
        
        // Update main button
        if (this.contactFabBtn) {
            this.contactFabBtn.classList.add('expanded');
        }
        
        // Show backdrop
        if (this.contactBackdrop) {
            this.contactBackdrop.classList.add('active');
            this.contactBackdrop.style.opacity = '1';
            this.contactBackdrop.style.visibility = 'visible';
        }
        
        // Show contact options with stagger
        this.contactOptions.forEach((option, index) => {
            setTimeout(() => {
                option.style.opacity = '1';
                option.style.visibility = 'visible';
                option.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    closeContactFab() {
        console.log('Closing contact FAB');
        this.isContactExpanded = false;
        
        // Update main button
        if (this.contactFabBtn) {
            this.contactFabBtn.classList.remove('expanded');
        }
        
        // Hide backdrop
        if (this.contactBackdrop) {
            this.contactBackdrop.classList.remove('active');
            this.contactBackdrop.style.opacity = '0';
            this.contactBackdrop.style.visibility = 'hidden';
        }
        
        // Hide contact options
        this.contactOptions.forEach(option => {
            option.style.opacity = '0';
            option.style.visibility = 'hidden';
            option.style.transform = 'translateY(20px) scale(0.8)';
        });
    }

    handleContactClick(event, contactType, link) {
        console.log('Handling contact click:', contactType);
        
        // Don't prevent default for tel:, mailto:, or external links
        const href = link.getAttribute('href');
        if (href && (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http'))) {
            // Let the browser handle the link naturally
            console.log('Allowing default link behavior for:', href);
        } else {
            event.preventDefault();
        }
        
        // Show feedback
        const messages = {
            call: 'Opening phone...',
            email: 'Opening email...',
            instagram: 'Opening Instagram...'
        };
        
        this.showFeedback(messages[contactType] || 'Opening...', this.getIconForContactType(contactType));
        
        // Close FAB after short delay
        setTimeout(() => {
            this.closeContactFab();
        }, 1000);
    }

    getIconForContactType(type) {
        const icons = {
            call: 'ri-phone-line',
            email: 'ri-mail-line',
            instagram: 'ri-instagram-line'
        };
        return icons[type] || 'ri-contacts-line';
    }

    showFeedback(message, iconClass, color = '#FF8C00') {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${color};
            color: white;
            padding: 16px 24px;
            border-radius: 24px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            justify-content: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s ease';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2000);
    }
}

/* ========================================
   HEADER COMPONENT - FIXED
   ======================================== */
class LuxuryHeader {
    constructor() {
        this.header = document.getElementById('luxuryHeader') || document.querySelector('.luxury-floating-header');
        this.navLinks = document.querySelectorAll('.luxury-nav-link');
        this.ctaButton = document.getElementById('luxuryHeaderCTA') || document.querySelector('.luxury-cta-button');
        this.isScrolled = false;
        this.scrollThreshold = 100;
        
        if (this.header) {
            this.init();
            console.log('✅ Header Initialized Successfully');
        }
    }

    init() {
        this.bindEvents();
        this.setupScrollHandler();
    }

    bindEvents() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                    this.setActiveNavLink(link);
                }
            });
        });

        // CTA button
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#contact');
            });
            
            this.ctaButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.scrollToSection('#contact');
            });
        }

        // Logo click to scroll to top
        const logoWrapper = this.header.querySelector('.logo-glow-wrapper');
        if (logoWrapper) {
            logoWrapper.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const shouldBeScrolled = scrollY > this.scrollThreshold;
            
            if (shouldBeScrolled !== this.isScrolled) {
                this.isScrolled = shouldBeScrolled;
                this.header.classList.toggle('scrolled', this.isScrolled);
            }
        }, { passive: true });
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = this.header.offsetHeight || 80;
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
}

/* ========================================
   SERVICES CAROUSEL - FIXED
   ======================================== */
class ServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel') || document.querySelector('.hermes-services-carousel');
        this.track = document.getElementById('carouselTrack') || document.querySelector('.carousel-track');
        this.prevBtn = document.getElementById('prevBtn') || document.querySelector('.hermes-nav-btn.prev');
        this.nextBtn = document.getElementById('nextBtn') || document.querySelector('.hermes-nav-btn.next');
        this.currentCounter = document.querySelector('.counter-current');
        this.totalCounter = document.querySelector('.counter-total');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressDots = document.querySelectorAll('.progress-dot');
        
        // State
        this.currentIndex = 0;
        this.totalSlides = 0;
        this.isAutoplay = true;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        
        if (this.carousel && this.track) {
            this.init();
            console.log('✅ Services Carousel Initialized Successfully');
        }
    }

    init() {
        this.calculateSlides();
        this.bindEvents();
        this.updateCounters();
        this.updateProgress();
        this.startAutoplay();
    }

    calculateSlides() {
        const cards = this.track.querySelectorAll('.hermes-service-card');
        this.totalSlides = cards.length;
        
        if (this.totalCounter) {
            this.totalCounter.textContent = this.totalSlides.toString();
        }
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }

        // Progress dots
        this.progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Service card clicks
        const serviceCards = document.querySelectorAll('.hermes-service-card');
        serviceCards.forEach(card => {
            const primaryCta = card.querySelector('.primary-cta');
            const secondaryCta = card.querySelector('.secondary-cta');
            
            if (primaryCta) {
                primaryCta.addEventListener('click', (e) => {
                    // Allow natural link behavior
                    console.log('Service primary CTA clicked');
                });
            }
            
            if (secondaryCta) {
                secondaryCta.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Service secondary CTA clicked - booking');
                    this.scrollToContact();
                });
            }
        });

        // Touch events for mobile swipe
        if (this.track) {
            let startX, startY, isScrolling;
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isScrolling = false;
            }, { passive: true });
            
            this.track.addEventListener('touchmove', (e) => {
                if (!startX || !startY) return;
                
                const diffX = startX - e.touches[0].clientX;
                const diffY = startY - e.touches[0].clientY;
                
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    // Horizontal swipe
                    isScrolling = false;
                    e.preventDefault();
                } else {
                    // Vertical scroll
                    isScrolling = true;
                }
            });
            
            this.track.addEventListener('touchend', (e) => {
                if (!startX || isScrolling) return;
                
                const endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.previousSlide();
                    }
                }
                
                startX = null;
                startY = null;
            }, { passive: true });
        }

        // Pause autoplay on hover (desktop only)
        if (this.carousel && window.innerWidth > 768) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.carousel.addEventListener('mouseleave', () => this.resumeAutoplay());
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlide();
    }

    previousSlide() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateSlide();
    }

    updateSlide() {
        this.isTransitioning = true;
        
        // Update visual indicators
        this.updateCounters();
        this.updateProgress();
        this.updateDots();
        
        // Update slide position (only on desktop)
        if (window.innerWidth > 768) {
            const slideWidth = 430; // Card width + gap
            const translateX = -(this.currentIndex * slideWidth);
            this.track.style.transform = `translateX(${translateX}px)`;
        }
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    updateCounters() {
        if (this.currentCounter) {
            this.currentCounter.textContent = (this.currentIndex + 1).toString();
        }
    }

    updateProgress() {
        if (this.progressFill) {
            const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
    }

    updateDots() {
        this.progressDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        if (this.isAutoplay && !this.autoplayInterval && window.innerWidth > 768) {
            this.autoplayInterval = setInterval(() => {
                if (!document.hidden) {
                    this.nextSlide();
                }
            }, 4000);
        }
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resumeAutoplay() {
        if (this.isAutoplay && window.innerWidth > 768) {
            this.startAutoplay();
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
}

/* ========================================
   RESULTS GALLERY - FIXED
   ======================================== */
class ResultsGallery {
    constructor() {
        this.gallery = document.querySelector('.results-showcase');
        this.filterButtons = document.querySelectorAll('.results-showcase__filter');
        this.resultItems = document.querySelectorAll('.results-showcase__item');
        this.mobileResultsBtn = document.getElementById('mobileResultsBtn');
        this.resultsCtaBtn = document.getElementById('resultsCtaBtn');
        this.activeFilter = 'all';
        
        if (this.gallery) {
            this.init();
            console.log('✅ Results Gallery Initialized Successfully');
        }
    }

    init() {
        this.initImageComparisons();
        this.bindEvents();
    }

    initImageComparisons() {
        const comparisons = document.querySelectorAll('.results-showcase__comparison');
        
        comparisons.forEach(comparison => {
            const slider = comparison.querySelector('.comparison-slider');
            const afterImage = comparison.querySelector('.comparison-image.after');
            
            if (slider && afterImage) {
                let isActive = false;
                
                const updateSlider = (clientX) => {
                    const rect = comparison.getBoundingClientRect();
                    const x = clientX - rect.left;
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    
                    slider.style.left = `${percentage}%`;
                    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                };
                
                // Mouse events
                slider.addEventListener('mousedown', (e) => {
                    isActive = true;
                    updateSlider(e.clientX);
                    e.preventDefault();
                });
                
                comparison.addEventListener('mousemove', (e) => {
                    if (isActive) {
                        updateSlider(e.clientX);
                    }
                });
                
                document.addEventListener('mouseup', () => {
                    isActive = false;
                });
                
                // Touch events
                slider.addEventListener('touchstart', (e) => {
                    isActive = true;
                    updateSlider(e.touches[0].clientX);
                    e.preventDefault();
                });
                
                comparison.addEventListener('touchmove', (e) => {
                    if (isActive) {
                        updateSlider(e.touches[0].clientX);
                        e.preventDefault();
                    }
                });
                
                comparison.addEventListener('touchend', () => {
                    isActive = false;
                });
            }
        });
    }

    bindEvents() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.setActiveFilter(filter);
                this.filterResults(filter);
            });
        });

        // Mobile results button
        if (this.mobileResultsBtn) {
            this.mobileResultsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFeedback('Loading full gallery...', 'ri-image-line');
                
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 1000);
            });
        }

        // Results CTA button
        if (this.resultsCtaBtn) {
            this.resultsCtaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
        }
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        this.filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.filter === filter);
        });
    }

    filterResults(filter) {
        this.resultItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    showFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FF8C00;
            color: white;
            padding: 16px 24px;
            border-radius: 24px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s ease';
            feedback.style.opacity = '1';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 400);
        }, 2000);
    }
}

/* ========================================
   CONTACT SECTION - FIXED
   ======================================== */
class ContactSection {
    constructor() {
        this.section = document.querySelector('.luxury-contact-section');
        this.actionBtns = document.querySelectorAll('.action-btn');
        this.emergencyBtns = document.querySelectorAll('.emergency-btn');
        this.methodCards = document.querySelectorAll('.method-card');
        
        if (this.section) {
            this.init();
            console.log('✅ Contact Section Initialized Successfully');
        }
    }

    init() {
        this.bindEvents();
        this.enhanceElfsightForm();
    }

    bindEvents() {
        // Action buttons (Get Directions, Call Now)
        this.actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                console.log('Action button clicked:', href);
                
                if (href.startsWith('tel:') || href.startsWith('http')) {
                    // Let browser handle these naturally
                    this.showFeedback('Opening...', 'ri-external-link-line');
                } else {
                    e.preventDefault();
                }
            });
        });

        // Emergency buttons
        this.emergencyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                console.log('Emergency button clicked:', href);
                
                if (href.startsWith('tel:')) {
                    this.showFeedback('Calling...', 'ri-phone-line');
                } else if (href.startsWith('sms:')) {
                    this.showFeedback('Opening messages...', 'ri-message-line');
                }
            });
        });

        // Method cards
        this.methodCards.forEach(card => {
            const link = card.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href.startsWith('tel:')) {
                        this.showFeedback('Calling...', 'ri-phone-line');
                    }
                });
            }
        });
    }

    enhanceElfsightForm() {
        // Wait for Elfsight form to load
        const checkForForm = () => {
            const elfsightWidget = this.section.querySelector('[class*="elfsight"]');
            if (elfsightWidget) {
                console.log('✅ Elfsight form found and enhanced');
                // Form is loaded, can add enhancements here
            } else {
                setTimeout(checkForForm, 500);
            }
        };
        
        setTimeout(checkForForm, 1000);
    }

    showFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: #FF8C00;
            color: white;
            padding: 12px 18px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 500;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            transform: translateY(20px);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s ease';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(20px)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
}

/* ========================================
   HERO SECTION - FIXED
   ======================================== */
class HeroSection {
    constructor() {
        this.hero = document.querySelector('.cinematic-hero');
        this.ctaBtn = document.querySelector('.hero-cta-signature');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator-elegant');
        
        if (this.hero) {
            this.init();
            console.log('✅ Hero Section Initialized Successfully');
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // CTA button
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
            
            this.ctaBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
        }

        // Scroll indicator
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToServices();
            });
            
            this.scrollIndicator.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.scrollToServices();
            });
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    scrollToServices() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const headerHeight = 80;
            const elementPosition = servicesSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
}

/* ========================================
   ABOUT SECTION - FIXED
   ======================================== */
class AboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-about-showcase');
        this.profileCtaBtns = document.querySelectorAll('.doctor-profile-cta, .mobile-profile-btn');
        this.primaryCta = document.querySelector('.primary-cta-luxury');
        this.secondaryCta = document.querySelector('.secondary-cta-luxury');
        
        if (this.section) {
            this.init();
            console.log('✅ About Section Initialized Successfully');
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Profile CTA buttons
        this.profileCtaBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFeedback('Loading profile...', 'ri-user-line');
                setTimeout(() => {
                    window.location.href = 'about.html';
                }, 1000);
            });
        });

        // Primary CTA (Meet Dr. Nano)
        if (this.primaryCta) {
            this.primaryCta.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFeedback('Loading profile...', 'ri-user-heart-line');
                setTimeout(() => {
                    window.location.href = 'about.html';
                }, 1000);
            });
        }

        // Secondary CTA (Schedule Consultation)
        if (this.secondaryCta) {
            this.secondaryCta.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToContact();
            });
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 80;
            const elementPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    showFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FF8C00;
            color: white;
            padding: 16px 24px;
            border-radius: 24px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s ease';
            feedback.style.opacity = '1';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 400);
        }, 2000);
    }
}

/* ========================================
   PRELOADER - FIXED
   ======================================== */
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader') || document.querySelector('.evia-modern-preloader');
        
        if (this.preloader) {
            this.init();
        }
    }

    init() {
        // Hide preloader after delay
        setTimeout(() => {
            this.hidePreloader();
        }, 2000);
        
        // Also hide on window load
        window.addEventListener('load', () => {
            setTimeout(() => this.hidePreloader(), 500);
        });
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.classList.add('loaded');
            this.preloader.style.opacity = '0';
            this.preloader.style.visibility = 'hidden';
            
            setTimeout(() => {
                if (this.preloader.parentNode) {
                    this.preloader.remove();
                }
            }, 600);
        }
    }
}

/* ========================================
   MAIN APPLICATION CLASS - FIXED
   ======================================== */
class EviaAestheticsApp {
    constructor() {
        this.components = new Map();
        this.isMobile = window.innerWidth <= 768;
        this.isInitialized = false;
        
        console.log('🚀 Initializing Evia Aesthetics App');
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        this.setupGlobalEvents();
    }

    initializeComponents() {
        try {
            console.log('📱 Initializing all components...');
            
            // Initialize in specific order for dependencies
            this.components.set('preloader', new Preloader());
            this.components.set('mobileMenu', new MobileMenu());
            this.components.set('header', new LuxuryHeader());
            this.components.set('hero', new HeroSection());
            this.components.set('servicesCarousel', new ServicesCarousel());
            this.components.set('about', new AboutSection());
            this.components.set('results', new ResultsGallery());
            this.components.set('contact', new ContactSection());
            this.components.set('floatingButtons', new FloatingButtons());
            
            this.isInitialized = true;
            console.log('✅ All components initialized successfully');
            
            // Make components globally accessible for debugging
            window.eviaComponents = this.components;
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }

    setupGlobalEvents() {
        // Global resize handler
        window.addEventListener('resize', this.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                console.log('📱 Screen size changed, mobile:', this.isMobile);
                this.handleScreenSizeChange();
            }
        }, 250));

        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 500);
        });
    }

    handleScreenSizeChange() {
        // Close mobile menu if switching to desktop
        const mobileMenu = this.components.get('mobileMenu');
        if (mobileMenu && !this.isMobile && mobileMenu.isOpen) {
            mobileMenu.closeMenu();
        }
        
        // Close contact FAB if switching screens
        const floatingButtons = this.components.get('floatingButtons');
        if (floatingButtons && floatingButtons.isContactExpanded) {
            floatingButtons.closeContactFab();
        }
    }

    getComponent(name) {
        return this.components.get(name);
    }

    // Utility function
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
}

/* ========================================
   MOBILE-SPECIFIC FIXES AND OPTIMIZATIONS
   ======================================== */

// Fix mobile touch events and prevent conflicts
document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on double tap for buttons
    const buttons = document.querySelectorAll('button, .luxury-nav-link, .mobile-nav-link, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Trigger click after short delay
            setTimeout(() => {
                button.click();
            }, 50);
        });
    });

    // Fix iOS Safari viewport height issues
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 500);
    });

    // Improve scroll performance on mobile
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scroll handlers will be called here
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Fix modal/menu scroll issues
    const preventBodyScroll = (isLocked) => {
        if (isLocked) {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    };

    // Make scroll lock function globally available
    window.preventBodyScroll = preventBodyScroll;
});

/* ========================================
   ADDITIONAL MOBILE FIXES
   ======================================== */

// Fix for phones that have hover states
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
    
    // Remove hover states that can stick on mobile
    const style = document.createElement('style');
    style.textContent = `
        .touch-device *:hover {
            -webkit-tap-highlight-color: transparent;
        }
        
        .touch-device .luxury-nav-link:hover,
        .touch-device .hermes-service-card:hover,
        .touch-device .method-card:hover {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Fix for safe area insets (iPhone X and newer)
const addSafeAreaStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @supports(padding: max(0px)) {
            .hermes-floating-controls {
                padding-bottom: max(20px, env(safe-area-inset-bottom));
                padding-left: max(20px, env(safe-area-inset-left));
                padding-right: max(20px, env(safe-area-inset-right));
            }
            
            .modern-mobile-menu {
                padding-bottom: max(20px, env(safe-area-inset-bottom));
            }
        }
    `;
    document.head.appendChild(style);
};

addSafeAreaStyles();

/* ========================================
   GLOBAL ERROR HANDLING
   ======================================== */
window.addEventListener('error', (event) => {
    console.error('Global JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ========================================
   INITIALIZE APPLICATION
   ======================================== */

// Main app initialization
let app;

const initializeApp = () => {
    try {
        app = new EviaAestheticsApp();
        window.eviaApp = app;
        console.log('🎉 Evia Aesthetics App Fully Loaded and Ready!');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        
        // Fallback initialization for critical components
        try {
            console.log('🔄 Attempting fallback initialization...');
            
            // Initialize critical components directly
            window.mobileMenu = new MobileMenu();
            window.floatingButtons = new FloatingButtons();
            window.header = new LuxuryHeader();
            
            console.log('✅ Fallback initialization completed');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization failed:', fallbackError);
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Double-check initialization on window load
window.addEventListener('load', () => {
    if (!window.eviaApp) {
        console.log('🔄 App not initialized, retrying...');
        setTimeout(initializeApp, 100);
    }
});

// Make components globally accessible for debugging
window.MobileMenu = MobileMenu;
window.FloatingButtons = FloatingButtons;
window.LuxuryHeader = LuxuryHeader;
window.ServicesCarousel = ServicesCarousel;
window.ContactSection = ContactSection;
window.HeroSection = HeroSection;
window.AboutSection = AboutSection;
window.ResultsGallery = ResultsGallery;

console.log('📱 Mobile-optimized Evia Aesthetics Script Loaded Successfully!');
