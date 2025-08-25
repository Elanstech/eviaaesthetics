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
class HermesFloatingButtons {
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
        this.backToTopClicks = 0;
        this.contactInteractions = {};
        
        console.log('Hermes Floating Buttons elements found:', {
            backToTop: !!this.backToTopBtn,
            contactFab: !!this.contactFabBtn,
            mainContactBtn: !!this.mainContactBtn,
            contactOptions: this.contactOptions.length
        });
        
        if (this.backToTopBtn || this.contactFabBtn) {
            this.init();
            console.log('✅ Hermes Floating Buttons Initialized Successfully');
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
        this.backToTopClicks++;
        
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
            option.style.transform = 'translateY(50px) scale(0.8)';
        });
    }

    handleContactClick(event, contactType, link) {
        console.log('Handling contact click:', contactType);
        
        // Track interaction
        this.contactInteractions[contactType] = (this.contactInteractions[contactType] || 0) + 1;
        
        // Don't prevent default for tel:, mailto:, or external links
        const href = link.getAttribute('href');
        if (href && (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('sms:') || href.startsWith('http'))) {
            // Let the browser handle the link naturally
            console.log('Allowing default link behavior for:', href);
        } else {
            event.preventDefault();
        }
        
        // Show feedback
        const messages = {
            call: 'Opening phone...',
            email: 'Opening email...',
            instagram: 'Opening Instagram...',
            text: 'Opening messages...'
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
            instagram: 'ri-instagram-line',
            text: 'ri-message-line'
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

    // Public API methods
    showBackToTop() {
        this.toggleBackToTopVisibility(true);
    }

    hideBackToTop() {
        this.toggleBackToTopVisibility(false);
    }

    openContactMenu() {
        if (!this.isContactExpanded) {
            this.openContactFab();
        }
    }

    closeContactMenu() {
        if (this.isContactExpanded) {
            this.closeContactFab();
        }
    }

    getInteractionStats() {
        return {
            backToTopClicks: this.backToTopClicks,
            contactInteractions: { ...this.contactInteractions },
            isContactExpanded: this.isContactExpanded,
            isBackToTopVisible: this.isBackToTopVisible
        };
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
class HermesServicesCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 6; // Exactly 6 services
    this.isAnimating = false;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000; // 5 seconds
    
    this.initializeElements();
    this.bindEvents();
    this.startAutoSlide();
    this.updateCarousel();
  }

  initializeElements() {
    this.track = document.getElementById('hermesCarouselTrack');
    this.cards = document.querySelectorAll('.hermes-service-card');
    this.prevBtn = document.getElementById('hermesPrevBtn');
    this.nextBtn = document.getElementById('hermesNextBtn');
    this.dots = document.querySelectorAll('.hermes-dot');
    this.learnBtns = document.querySelectorAll('.hermes-learn-btn');

    // Validate elements exist
    if (!this.track || !this.cards.length) {
      console.error('Hermes Carousel: Required elements not found');
      return;
    }
  }

  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Learn more buttons
    this.learnBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleLearnMore(e));
    });

    // Touch events for mobile
    this.bindTouchEvents();

    // Pause auto-slide on hover
    if (this.track) {
      this.track.addEventListener('mouseenter', () => this.pauseAutoSlide());
      this.track.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  bindTouchEvents() {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
      this.pauseAutoSlide();
    }, { passive: true });

    this.track.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Determine if user is scrolling vertically
      if (Math.abs(diffY) > Math.abs(diffX)) {
        isScrolling = true;
        return;
      }

      // Prevent horizontal scroll if we're handling the swipe
      if (Math.abs(diffX) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    this.track.addEventListener('touchend', (e) => {
      if (!startX || isScrolling) {
        this.startAutoSlide();
        return;
      }

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      const minSwipeDistance = 50;

      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }

      startX = 0;
      startY = 0;
      this.startAutoSlide();
    }, { passive: true });
  }

  handleKeyboard(e) {
    if (!this.track.matches(':hover')) return;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case ' ':
        e.preventDefault();
        this.toggleAutoSlide();
        break;
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateCarousel(false); // Update without animation on resize
    }, 250);
  }

  prevSlide() {
    if (this.isAnimating) return;
    
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }

  nextSlide() {
    if (this.isAnimating) return;
    
    this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentSlide || index >= this.totalSlides) return;
    
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel(animate = true) {
    if (!this.track || !this.cards.length) return;

    this.isAnimating = animate;

    // Calculate the offset
    const cardWidth = this.cards[0].offsetWidth;
    const gap = 40; // Gap between cards
    const containerWidth = this.track.parentElement.offsetWidth;
    const totalCardWidth = cardWidth + gap;
    
    // Center the current card
    const centerOffset = (containerWidth - cardWidth) / 2;
    const translateX = centerOffset - (this.currentSlide * totalCardWidth);

    // Apply transform
    if (animate) {
      this.track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
    } else {
      this.track.style.transition = 'none';
    }
    
    this.track.style.transform = `translateX(${translateX}px)`;

    // Update card states
    this.updateCardStates();
    this.updateDots();
    this.updateNavButtons();

    // Reset animation flag after transition
    if (animate) {
      setTimeout(() => {
        this.isAnimating = false;
      }, 800);
    } else {
      this.isAnimating = false;
    }
  }

  updateCardStates() {
    this.cards.forEach((card, index) => {
      card.classList.toggle('hermes-active', index === this.currentSlide);
      
      // Add entrance animation for newly active card
      if (index === this.currentSlide) {
        card.style.animationDelay = '0.2s';
      }
    });
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('hermes-dot-active', index === this.currentSlide);
    });
  }

  updateNavButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = false; // Always enabled due to infinite loop
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = false; // Always enabled due to infinite loop
    }
  }

  startAutoSlide() {
    this.pauseAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideDelay);
  }

  pauseAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  toggleAutoSlide() {
    if (this.autoSlideInterval) {
      this.pauseAutoSlide();
    } else {
      this.startAutoSlide();
    }
  }

  handleLearnMore(e) {
    const btn = e.currentTarget;
    const service = btn.dataset.service;
    
    // Add click animation
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);

    // Redirect to services page with specific service anchor
    setTimeout(() => {
      window.location.href = `services.html#${service}`;
    }, 200);
  }

  // Optional: Contact modal function
  openContactModal(service) {
    // Implement your contact modal logic here
    alert(`Contact us about ${service} service!`);
  }

  // Public methods for external control
  destroy() {
    this.pauseAutoSlide();
    
    // Remove event listeners
    if (this.prevBtn) {
      this.prevBtn.removeEventListener('click', this.prevSlide);
    }
    if (this.nextBtn) {
      this.nextBtn.removeEventListener('click', this.nextSlide);
    }
    
    this.dots.forEach((dot) => {
      dot.removeEventListener('click', this.goToSlide);
    });
    
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeyboard);
  }

  // Public getter for current slide
  getCurrentSlide() {
    return this.currentSlide;
  }

  // Public method to set slide programmatically
  setSlide(index) {
    this.goToSlide(index);
  }
}

// Initialize the carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if the hermes services section exists
  const hermesSection = document.querySelector('.hermes-services-section');
  if (hermesSection) {
    window.hermesCarousel = new HermesServicesCarousel();
  }
});

// Handle page visibility change to pause/resume auto-slide
document.addEventListener('visibilitychange', function() {
  if (window.hermesCarousel) {
    if (document.hidden) {
      window.hermesCarousel.pauseAutoSlide();
    } else {
      window.hermesCarousel.startAutoSlide();
    }
  }
});

// Optional: Intersection Observer for performance
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (window.hermesCarousel) {
        if (entry.isIntersecting) {
          window.hermesCarousel.startAutoSlide();
        } else {
          window.hermesCarousel.pauseAutoSlide();
        }
      }
    });
  }, { threshold: 0.5 });

  document.addEventListener('DOMContentLoaded', function() {
    const hermesSection = document.querySelector('.hermes-services-section');
    if (hermesSection) {
      observer.observe(hermesSection);
    }
  });
}

/* ========================================
   RESULTS GALLERY - FIXED
   ======================================== */
class HermesResultsShowcase {
    constructor() {
        this.section = document.querySelector('.hermes-results-showcase');
        this.filterButtons = document.querySelectorAll('.hermes-filter-btn');
        this.resultItems = document.querySelectorAll('.hermes-result-item');
        this.ctaButton = document.getElementById('hermesResultsCtaBtn');
        
        // Comparison functionality
        this.comparisons = document.querySelectorAll('.result-comparison-wrapper');
        this.activeComparison = null;
        
        // Filter state
        this.activeFilter = 'all';
        this.isAnimating = false;
        
        if (this.section) {
            this.init();
            console.log('✅ Hermes Results Showcase Initialized');
        }
    }
   
    init() {
        this.initializeComparisons();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
    }

    initializeComparisons() {
        this.comparisons.forEach(comparison => {
            const slider = comparison.querySelector('.result-slider');
            const afterImage = comparison.querySelector('.result-after');
            
            if (slider && afterImage) {
                let isActive = false;
                let currentPosition = 50;
                
                // Initialize position
                this.updateSliderPosition(comparison, currentPosition);
                
                // Mouse Events
                slider.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isActive = true;
                    this.activeComparison = comparison;
                    comparison.classList.add('dragging');
                    document.body.style.cursor = 'ew-resize';
                    this.updateSliderPosition(comparison, this.getPositionFromEvent(e, comparison));
                });
                
                comparison.addEventListener('mousemove', (e) => {
                    if (isActive && this.activeComparison === comparison) {
                        this.updateSliderPosition(comparison, this.getPositionFromEvent(e, comparison));
                    }
                });
                
                // Touch Events
                slider.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    isActive = true;
                    this.activeComparison = comparison;
                    comparison.classList.add('dragging');
                    this.updateSliderPosition(comparison, this.getPositionFromEvent(e.touches[0], comparison));
                }, { passive: false });
                
                comparison.addEventListener('touchmove', (e) => {
                    if (isActive && this.activeComparison === comparison) {
                        e.preventDefault();
                        this.updateSliderPosition(comparison, this.getPositionFromEvent(e.touches[0], comparison));
                    }
                }, { passive: false });
                
                // Global mouse/touch end events
                document.addEventListener('mouseup', () => this.endDragging());
                document.addEventListener('touchend', () => this.endDragging());
                
                // Hover effect
                comparison.addEventListener('mouseenter', () => {
                    if (!isActive) {
                        comparison.classList.add('hover');
                    }
                });
                
                comparison.addEventListener('mouseleave', () => {
                    comparison.classList.remove('hover');
                });
                
                // Click to center
                comparison.addEventListener('dblclick', () => {
                    this.animateSliderTo(comparison, 50);
                });
            }
        });
    }

    getPositionFromEvent(event, container) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        return percentage;
    }

    updateSliderPosition(container, percentage) {
        const slider = container.querySelector('.result-slider');
        const afterImage = container.querySelector('.result-after');
        
        if (slider && afterImage) {
            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            slider.dataset.position = percentage;
        }
    }

    animateSliderTo(container, targetPercentage) {
        const currentPercentage = parseFloat(container.querySelector('.result-slider').dataset.position) || 50;
        const duration = 600;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            const currentPos = currentPercentage + (targetPercentage - currentPercentage) * easedProgress;
            this.updateSliderPosition(container, currentPos);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    endDragging() {
        if (this.activeComparison) {
            this.activeComparison.classList.remove('dragging');
            this.activeComparison = null;
            document.body.style.cursor = '';
        }
    }

    bindEvents() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAnimating) return;
                
                const filter = button.dataset.filter;
                this.handleFilterChange(filter, button);
            });
        });

        // CTA button
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCtaClick();
            });
            
            this.ctaButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleCtaClick();
            });
        }

        // Result item interactions
        this.resultItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.enhanceItemVisually(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.resetItemVisuals(item);
            });
        });
    }

    handleFilterChange(filter, button) {
        if (filter === this.activeFilter) return;
        
        console.log(`🔍 Filtering results: ${filter}`);
        this.isAnimating = true;
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Add click feedback
        this.addButtonFeedback(button);
        
        // Filter results with animation
        this.filterResults(filter).then(() => {
            this.activeFilter = filter;
            this.isAnimating = false;
        });
    }

    async filterResults(filter) {
        // Hide items that don't match
        const hidePromises = Array.from(this.resultItems).map((item, index) => {
            return new Promise(resolve => {
                const categories = item.dataset.category.split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (!shouldShow) {
                    setTimeout(() => {
                        item.classList.add('hidden');
                        resolve();
                    }, index * 50);
                } else {
                    resolve();
                }
            });
        });
        
        await Promise.all(hidePromises);
        
        // Wait a bit, then show matching items
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const showPromises = Array.from(this.resultItems).map((item, index) => {
            return new Promise(resolve => {
                const categories = item.dataset.category.split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        resolve();
                    }, index * 100);
                } else {
                    resolve();
                }
            });
        });
        
        await Promise.all(showPromises);
    }
   
    enhanceItemVisually(item) {
        const comparison = item.querySelector('.result-comparison-wrapper');
        if (comparison) {
            const images = comparison.querySelectorAll('.result-image img');
            images.forEach(img => {
                img.style.transform = 'scale(1.05)';
                img.style.filter = 'brightness(1.1) contrast(1.05)';
            });
        }
    }

    resetItemVisuals(item) {
        const comparison = item.querySelector('.result-comparison-wrapper');
        if (comparison) {
            const images = comparison.querySelectorAll('.result-image img');
            images.forEach(img => {
                img.style.transform = '';
                img.style.filter = '';
            });
        }
    }

    addButtonFeedback(button) {
        button.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }

    handleCtaClick() {
        console.log('📅 Results CTA clicked - Scheduling consultation');
        
        // Visual feedback
        this.addCtaFeedback();
        
        // Show action feedback
        this.showActionFeedback('Opening consultation booking...', 'ri-calendar-check-line');
        
        // Scroll to contact section
        setTimeout(() => {
            this.scrollToContact();
        }, 1000);
    }

    addCtaFeedback() {
        if (this.ctaButton) {
            this.ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.ctaButton.style.transform = '';
            }, 150);
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

    showActionFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00, #FFA500); color: white;
            padding: 18px 28px; border-radius: 50px; font-family: 'Inter', sans-serif;
            font-size: 14px; font-weight: 600; z-index: 10001; opacity: 0;
            display: flex; align-items: center; gap: 12px; justify-content: center;
            transition: all 0.4s ease; box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
            min-width: 280px;
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
   
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.section.contains(document.activeElement)) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    if (this.activeComparison) {
                        e.preventDefault();
                        const currentPos = parseFloat(this.activeComparison.querySelector('.result-slider').dataset.position) || 50;
                        const newPos = e.key === 'ArrowLeft' ? 
                            Math.max(0, currentPos - 5) : 
                            Math.min(100, currentPos + 5);
                        this.updateSliderPosition(this.activeComparison, newPos);
                    }
                    break;
                case 'Enter':
                case ' ':
                    if (document.activeElement.classList.contains('result-comparison-wrapper')) {
                        e.preventDefault();
                        this.animateSliderTo(document.activeElement, 50);
                    }
                    break;
            }
        });
    }
   
    setupIntersectionObserver() {
        const observeElements = [
            '.hermes-result-item',
            '.hermes-results-cta'
        ];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.triggerItemAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observeElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => observer.observe(el));
        });
    }

    triggerItemAnimation(element) {
        if (element.classList.contains('hermes-result-item')) {
            const slider = element.querySelector('.result-slider');
            if (slider) {
                setTimeout(() => {
                    // Subtle animation to show interactivity
                    this.animateSliderTo(element.querySelector('.result-comparison-wrapper'), 60);
                    setTimeout(() => {
                        this.animateSliderTo(element.querySelector('.result-comparison-wrapper'), 50);
                    }, 800);
                }, Math.random() * 500);
            }
        }
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

    filterByCategory(category) {
        const button = document.querySelector(`[data-filter="${category}"]`);
        if (button) {
            this.handleFilterChange(category, button);
        }
    }

    resetAllSliders() {
        this.comparisons.forEach(comparison => {
            this.animateSliderTo(comparison, 50);
        });
    }

    destroy() {
        // Cleanup event listeners
        document.removeEventListener('mouseup', this.endDragging);
        document.removeEventListener('touchend', this.endDragging);
        console.log('🗑️ Hermes Results Showcase destroyed');
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
class ElevatedAboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-elevated-about');
        this.learnMoreBtn = document.getElementById('learnMoreBtn');
        this.consultationBtn = document.getElementById('consultationBtn');
        this.profileCard = document.querySelector('.doctor-profile-card');
        this.ctaCard = document.querySelector('.cta-card');
        
        // Animation states
        this.isAnimating = false;
        this.observerThreshold = 0.2;
        
        if (this.section) {
            this.init();
            console.log('✅ Elevated About Section Initialized');
        }
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
        this.setupParallaxEffects();
        this.initializeCounters();
    }

    bindEvents() {
        // Learn More Button
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
            
            this.learnMoreBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleLearnMoreClick();
            });
        }

        // Consultation Button
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleConsultationClick();
            });
            
            this.consultationBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleConsultationClick();
            });
        }

        // Profile Card Interactions
        if (this.profileCard) {
            this.profileCard.addEventListener('mouseenter', () => {
                this.triggerProfileCardAnimation();
            });
        }

        // Expertise Tags Interactions
        const expertiseTags = document.querySelectorAll('.expertise-tag');
        expertiseTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.showExpertiseDetails(tag.textContent);
            });
        });

        // Experience Items Hover
        const experienceItems = document.querySelectorAll('.experience-item');
        experienceItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateExperienceItem(item);
            });
        });
    }

    handleLearnMoreClick() {
        if (this.isAnimating) return;
        
        console.log('📖 Learn More button clicked');
        this.isAnimating = true;
        
        // Visual feedback
        this.addClickFeedback(this.learnMoreBtn);
        
        // Show loading feedback
        this.showActionFeedback('Loading Dr. Nano\'s profile...', 'ri-user-line');
        
        // Simulate navigation with delay for UX
        setTimeout(() => {
            // Replace with actual about page URL
            window.location.href = 'about.html';
            this.isAnimating = false;
        }, 1000);
    }

    handleConsultationClick() {
        if (this.isAnimating) return;
        
        console.log('📅 Consultation button clicked');
        this.isAnimating = true;
        
        // Visual feedback
        this.addClickFeedback(this.consultationBtn);
        
        // Show loading feedback
        this.showActionFeedback('Opening consultation booking...', 'ri-calendar-check-line');
        
        // Scroll to contact section
        setTimeout(() => {
            this.scrollToContact();
            this.isAnimating = false;
        }, 800);
    }

    addClickFeedback(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 150);
    }

    showActionFeedback(message, iconClass) {
        const feedback = this.createFeedback(message, iconClass);
        this.displayFeedback(feedback);
    }

    createFeedback(message, iconClass) {
        const feedback = document.createElement('div');
        feedback.className = 'about-action-feedback';
        feedback.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        // Styles
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(135deg, #FF8C00, #FFA500);
            color: white;
            padding: 18px 28px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 20px 60px rgba(255, 140, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 240px;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        return feedback;
    }

    displayFeedback(feedback) {
        document.body.appendChild(feedback);
        
        // Animate in
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Animate out and remove
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }

    triggerProfileCardAnimation() {
        if (!this.profileCard) return;
        
        const image = this.profileCard.querySelector('.doctor-image');
        const certBadge = this.profileCard.querySelector('.certification-badge');
        
        if (image) {
            image.style.transform = 'scale(1.08) rotate(1deg)';
        }
        
        if (certBadge) {
            certBadge.style.animation = 'certificationFloat 2s ease-in-out';
        }
        
        setTimeout(() => {
            if (image) image.style.transform = '';
            if (certBadge) certBadge.style.animation = '';
        }, 2000);
    }

    animateExperienceItem(item) {
        const icon = item.querySelector('.experience-icon');
        const number = item.querySelector('.experience-number');
        
        if (icon) {
            icon.style.transform = 'rotate(360deg) scale(1.1)';
            icon.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        if (number) {
            number.style.color = '#FF8C00';
            number.style.transform = 'scale(1.1)';
            number.style.transition = 'all 0.3s ease';
        }
        
        setTimeout(() => {
            if (icon) {
                icon.style.transform = '';
                icon.style.transition = '';
            }
            if (number) {
                number.style.color = '';
                number.style.transform = '';
                number.style.transition = '';
            }
        }, 600);
    }

    showExpertiseDetails(expertise) {
        const details = {
            'Injectable Artistry': 'Advanced techniques in Botox, dermal fillers, and facial contouring.',
            'Medical Wellness': 'Comprehensive weight management and IV therapy programs.',
            'Aesthetic Innovation': 'Latest treatments including PRP, microneedling, and chemical peels.'
        };
        
        const detail = details[expertise] || 'Specialized expertise in aesthetic medicine.';
        this.showActionFeedback(detail, 'ri-information-line');
    }

    initializeCounters() {
        const counters = [
            { element: document.querySelector('.experience-number'), target: 20, suffix: '+' },
            { 
                element: document.querySelectorAll('.experience-number')[1], 
                target: 5000, 
                suffix: '+',
                formatter: (num) => num >= 1000 ? (num/1000).toFixed(0) + 'K+' : num + '+'
            },
            { element: document.querySelectorAll('.experience-number')[2], target: 98, suffix: '%' }
        ];
        
        counters.forEach(counter => {
            if (counter.element) {
                this.observeCounter(counter);
            }
        });
    }

    observeCounter(counter) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(counter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter.element);
    }

    animateCounter(counter) {
        const duration = 2000;
        const startValue = 0;
        const increment = counter.target / (duration / 16);
        let current = startValue;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < counter.target) {
                const displayValue = counter.formatter ? 
                    counter.formatter(Math.floor(current)) : 
                    Math.floor(current) + (counter.suffix || '');
                counter.element.textContent = displayValue;
                requestAnimationFrame(updateCounter);
            } else {
                const finalValue = counter.formatter ? 
                    counter.formatter(counter.target) : 
                    counter.target + (counter.suffix || '');
                counter.element.textContent = finalValue;
            }
        };
        
        updateCounter();
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

    setupIntersectionObserver() {
        const observeElements = [
            '.doctor-profile-card',
            '.experience-highlight',
            '.philosophy-preview',
            '.specializations',
            '.cta-card'
        ];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, {
            threshold: this.observerThreshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observeElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => observer.observe(el));
        });
    }

    triggerElementAnimation(element) {
        if (element.classList.contains('.doctor-profile-card')) {
            setTimeout(() => this.triggerProfileCardAnimation(), 300);
        }
        
        if (element.classList.contains('.cta-card')) {
            this.animateCtaCard();
        }
    }

    animateCtaCard() {
        const ctaButtons = document.querySelectorAll('.primary-cta-btn, .secondary-cta-btn');
        ctaButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.transform = 'translateY(0)';
                btn.style.opacity = '1';
            }, index * 200);
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.bg-orb');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sectionRect = this.section.getBoundingClientRect();
            
            if (sectionRect.bottom >= 0 && sectionRect.top <= window.innerHeight) {
                parallaxElements.forEach((orb, index) => {
                    const speed = 0.05 + (index * 0.02);
                    const yPos = scrolled * speed;
                    orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            }
        }, { passive: true });
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

    triggerLearnMore() {
        if (this.learnMoreBtn) {
            this.learnMoreBtn.click();
        }
    }

    triggerConsultation() {
        if (this.consultationBtn) {
            this.consultationBtn.click();
        }
    }

    destroy() {
        console.log('🗑️ Elevated About Section destroyed');
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
            this.components.set('servicesCarousel', new HermesServicesCarousel());
            this.components.set('about', new ElevatedAboutSection());
            this.components.set('results', new HermesResultsShowcase());
            this.components.set('contact', new ContactSection());
            this.components.set('floatingButtons', new HermesFloatingButtons());
            
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
            window.hermesFloatingButtons = new HermesFloatingButtons();
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
window.HermesFloatingButtons = HermesFloatingButtons;
window.LuxuryHeader = LuxuryHeader;
window.HermesServicesCarousel = HermesServicesCarousel;
window.ContactSection = ContactSection;
window.HeroSection = HeroSection;
window.ElevatedAboutSection = ElevatedAboutSection;
window.HermesResultsShowcase = HermesResultsShowcase;

// Legacy aliases for backward compatibility
window.FloatingButtons = HermesFloatingButtons;
window.HermesServicesCarousel = HermesServicesCarousel;
window.AboutSection = ElevatedAboutSection;
window.ResultsGallery = HermesResultsShowcase;

console.log('📱 Mobile-optimized Evia Aesthetics Script Loaded Successfully!');
