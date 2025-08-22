/* ========================================
   MAIN APPLICATION CLASS
   ======================================== */
class EviaAestheticsApp {
    constructor() {
        this.components = new Map();
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handlePreloader();
        console.log('🚀 Evia Aesthetics App Initialized');
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('resize', this.debounce(() => this.onResize(), 250));
        window.addEventListener('scroll', this.throttle(() => this.onScroll(), 16));
    }

    onDOMReady() {
        this.initializeComponents();
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }
    }

    onWindowLoad() {
        this.hidePreloader();
        this.components.forEach(component => {
            if (component.onWindowLoad) component.onWindowLoad();
        });
    }

    onResize() {
        const wasMobile = this.isMobile;
        const wasTablet = this.isTablet;
        
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992;
        
        if (wasMobile !== this.isMobile || wasTablet !== this.isTablet) {
            this.components.forEach(component => {
                if (component.onResize) component.onResize();
            });
        }
    }

    onScroll() {
        this.components.forEach(component => {
            if (component.onScroll) component.onScroll();
        });
    }

    initializeComponents() {
        // Initialize all components
        this.components.set('header', new ModernHeader());
        this.components.set('mobileMenu', new MobileMenu());
        this.components.set('servicesCarousel', new ServicesCarousel());
        this.components.set('aboutSection', new AboutSection());
        this.components.set('resultsGallery', new ResultsGallery());
        this.components.set('contactForm', new ContactForm());
        this.components.set('scrollIndicator', new ScrollIndicator());
    }

    getComponent(name) {
        return this.components.get(name);
    }

    handlePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => this.hidePreloader(), 2000);
        }
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 600);
        }
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
        }
    }
}

/* ========================================
   HEADER COMPONENT
   ======================================== */
class ModernHeader {
    constructor() {
        this.header = document.getElementById('header');
        this.isScrolled = false;
        
        if (this.header) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Navigation links
        const navLinks = document.querySelectorAll('.modern-nav-link');
        navLinks.forEach(link => {
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
        const ctaBtn = document.getElementById('headerCTA');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => this.scrollToSection('#contact'));
        }
    }

    onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollTop > 100;

        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.header.classList.toggle('scrolled', this.isScrolled);
        }
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = this.header.offsetHeight;
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.modern-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
}

/* ========================================
   MOBILE MENU COMPONENT
   ======================================== */
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileToggle');
        this.menu = document.getElementById('mobileMenu');
        this.backdrop = document.getElementById('mobileBackdrop');
        this.closeBtn = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
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
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeMenu());
        }

        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateAndClose(href);
                }
            });
        });

        // CTA button
        const ctaBtn = document.querySelector('.mobile-cta-button');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => this.navigateAndClose('#contact'));
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
        this.backdrop.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        
        // Animate nav links
        this.navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 50);
        });
    }

    closeMenu() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.backdrop.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        
        // Reset nav links
        this.navLinks.forEach(link => {
            link.style.transform = '';
            link.style.opacity = '';
        });
    }

    navigateAndClose(target) {
        this.closeMenu();
        setTimeout(() => {
            const element = document.querySelector(target);
            if (element) {
                const headerHeight = 80;
                const elementPosition = element.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }

    onResize() {
        if (window.innerWidth > 992 && this.isOpen) {
            this.closeMenu();
        }
    }
}

/* ========================================
   SERVICES CAROUSEL COMPONENT
   ======================================== */
class ServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        this.learnMoreBtn = document.getElementById('learnMoreBtn');
        this.currentCounter = document.getElementById('currentCounter');
        this.totalCounter = document.getElementById('totalCounter');
        this.mobileProgressFill = document.getElementById('mobileProgressFill');
        
        this.currentIndex = 0;
        this.totalSlides = 0;
        this.slideWidth = 0;
        this.isAutoplay = true;
        this.autoplayInterval = null;
        this.isMobile = window.innerWidth <= 768;
        
        if (this.carousel && this.track) {
            this.init();
        }
    }

    init() {
        this.calculateDimensions();
        this.bindEvents();
        this.updateCounters();
        this.updateMobileProgress();
        this.startAutoplay();
        console.log('🎠 Services Carousel Initialized');
    }

    calculateDimensions() {
        const cards = this.track.querySelectorAll('.service-card');
        this.totalSlides = cards.length;
        
        if (this.totalCounter) {
            this.totalCounter.textContent = String(this.totalSlides).padStart(2, '0');
        }
        
        if (cards.length > 0) {
            const cardRect = cards[0].getBoundingClientRect();
            this.slideWidth = cardRect.width;
            const trackStyles = window.getComputedStyle(this.track);
            this.gap = parseInt(trackStyles.gap) || 24;
        }
    }

    bindEvents() {
        // Desktop navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
                this.handleUserInteraction();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.handleUserInteraction();
            });
        }

        // Autoplay toggle
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        }

        // Learn more button
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', () => this.showLearnMoreFeedback());
        }

        // Service CTAs
        const serviceCTAs = document.querySelectorAll('.service-cta');
        serviceCTAs.forEach(cta => {
            cta.addEventListener('click', (e) => {
                const service = e.currentTarget.dataset.service;
                this.handleServiceClick(service);
            });
        });

        // Mobile touch events
        if (this.isMobile) {
            this.bindTouchEvents();
        }

        // Track scroll for mobile progress
        if (this.isMobile && this.track) {
            this.track.addEventListener('scroll', this.throttle(() => {
                this.updateMobileProgress();
            }, 16), { passive: true });
        }

        // Window resize
        window.addEventListener('resize', this.debounce(() => this.onResize(), 250));
    }

    bindTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
                this.handleUserInteraction();
            }
            
            isDragging = false;
        }, { passive: true });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlide();
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }

    updateSlide() {
        if (!this.isMobile) {
            const translateX = -(this.currentIndex * (this.slideWidth + this.gap));
            this.track.style.transform = `translateX(${translateX}px)`;
        }
        
        this.updateCounters();
        this.updateMobileProgress();
    }

    updateCounters() {
        if (this.currentCounter) {
            this.currentCounter.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }
    }

    updateMobileProgress() {
        if (this.mobileProgressFill && this.isMobile) {
            const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
            this.mobileProgressFill.style.width = `${progress}%`;
        }
    }

    startAutoplay() {
        if (this.isAutoplay && !this.isMobile) {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        
        if (this.autoplayBtn) {
            const icon = this.autoplayBtn.querySelector('i');
            if (icon) {
                icon.className = this.isAutoplay ? 'ri-pause-line' : 'ri-play-line';
            }
        }

        if (this.isAutoplay) {
            this.startAutoplay();
        } else {
            this.stopAutoplay();
        }
    }

    handleUserInteraction() {
        this.stopAutoplay();
        setTimeout(() => {
            if (this.isAutoplay) this.startAutoplay();
        }, 10000);
    }

    handleServiceClick(service) {
        this.showServiceFeedback(service);
        // Here you could add navigation to service detail page
        // window.location.href = `/services/${service}`;
    }

    showServiceFeedback(service) {
        const serviceNames = {
            'botox': 'Botox & Fillers',
            'weight': 'Weight Management',
            'iv': 'IV Therapy',
            'microneedling': 'Microneedling',
            'prp': 'PRP Therapy',
            'peels': 'Chemical Peels'
        };

        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-heart-pulse-line" style="font-size: 18px;"></i>
            <span>Learn more about ${serviceNames[service] || 'this service'}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }

    showLearnMoreFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-information-line" style="font-size: 18px;"></i>
            <span>Loading detailed services...</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 500);
        }, 2500);
    }

    onResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.stopAutoplay();
                this.track.style.transform = '';
            } else {
                if (this.isAutoplay) this.startAutoplay();
                this.calculateDimensions();
                this.updateSlide();
            }
        } else if (!this.isMobile) {
            this.calculateDimensions();
            this.updateSlide();
        }
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
        }
    }
}

/* ========================================
   ABOUT SECTION COMPONENT
   ======================================== */
class AboutSection {
    constructor() {
        this.section = document.querySelector('.hermes-about-section');
        this.consultationBtn = document.getElementById('hermesConsultationBtn');
        this.learnMoreBtn = document.getElementById('hermesLearnMoreBtn');
        this.mobileAboutBtn = document.getElementById('mobileAboutBtn');
        
        if (this.section) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.initScrollReveal();
    }

    bindEvents() {
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', () => this.scrollToContact());
        }

        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', () => this.showLearnMoreFeedback());
        }

        if (this.mobileAboutBtn) {
            this.mobileAboutBtn.addEventListener('click', () => this.showMobileAboutFeedback());
        }
    }

    initScrollReveal() {
        const revealElements = this.section.querySelectorAll('[data-hermes-reveal]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('reveal');
                    }, parseInt(entry.target.dataset.delay) || 0);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => observer.observe(element));
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showLearnMoreFeedback() {
        this.showFeedback('Loading more about Dr. Nano...', 'ri-information-line');
    }

    showMobileAboutFeedback() {
        this.showFeedback('Navigating to About page...', 'ri-user-heart-line');
    }

    showFeedback(message, icon) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="${icon}" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
}

/* ========================================
   RESULTS GALLERY COMPONENT
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
        }
    }

    init() {
        this.initImageComparisons();
        this.initFilterSystem();
        this.bindEvents();
    }

    initImageComparisons() {
        const comparisons = document.querySelectorAll('.results-showcase__comparison');
        
        comparisons.forEach(comparison => {
            const slider = comparison.querySelector('.comparison-slider');
            const afterImage = comparison.querySelector('.comparison-image.after');
            
            if (slider && afterImage) {
                let isMouseDown = false;
                
                const updateSlider = (e) => {
                    const rect = comparison.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    
                    slider.style.left = `${percentage}%`;
                    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                };
                
                slider.addEventListener('mousedown', (e) => {
                    isMouseDown = true;
                    updateSlider(e);
                });
                
                comparison.addEventListener('mousemove', (e) => {
                    if (isMouseDown) updateSlider(e);
                });
                
                document.addEventListener('mouseup', () => {
                    isMouseDown = false;
                });
                
                // Touch events for mobile
                slider.addEventListener('touchstart', (e) => {
                    isMouseDown = true;
                    const touch = e.touches[0];
                    updateSlider({ clientX: touch.clientX });
                }, { passive: true });
                
                comparison.addEventListener('touchmove', (e) => {
                    if (isMouseDown) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        updateSlider({ clientX: touch.clientX });
                    }
                });
                
                comparison.addEventListener('touchend', () => {
                    isMouseDown = false;
                });
            }
        });
    }

    initFilterSystem() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.setActiveFilter(filter);
                this.filterResults(filter);
            });
        });
    }

    bindEvents() {
        if (this.mobileResultsBtn) {
            this.mobileResultsBtn.addEventListener('click', () => {
                this.showMobileResultsFeedback();
            });
        }

        if (this.resultsCtaBtn) {
            this.resultsCtaBtn.addEventListener('click', () => {
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
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
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
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showMobileResultsFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(255, 140, 0, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-camera-line" style="font-size: 18px;"></i>
            <span>Loading full gallery...</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 2500);
    }
}

/* ========================================
   CONTACT FORM COMPONENT
   ======================================== */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.querySelector('.form-submit-btn');
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.initScrollReveal();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input focus effects
        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.onInputFocus(input));
            input.addEventListener('blur', () => this.onInputBlur(input));
        });

        // Emergency contact buttons
        const emergencyBtns = document.querySelectorAll('.emergency-btn');
        emergencyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('primary')) {
                    this.trackPhoneClick();
                } else if (btn.classList.contains('secondary')) {
                    this.trackTextClick();
                }
            });
        });
    }

    initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseInt(entry.target.dataset.delay) || 0);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => observer.observe(element));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        if (this.validateForm(data)) {
            this.showSubmissionFeedback();
            // Here you would send the data to your backend
            // this.sendFormData(data);
        }
    }

    validateForm(data) {
        const requiredFields = ['name', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        if (missingFields.length > 0) {
            this.showValidationError(`Please fill in: ${missingFields.join(', ')}`);
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showValidationError('Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showValidationError(message) {
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(231, 76, 60, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        error.innerHTML = `
            <i class="ri-error-warning-line" style="font-size: 18px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(error);
        
        requestAnimationFrame(() => {
            error.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            error.style.opacity = '1';
            error.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        setTimeout(() => {
            error.style.opacity = '0';
            error.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => error.remove(), 400);
        }, 3000);
    }

    showSubmissionFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white; padding: 20px 32px; border-radius: 24px;
            font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600;
            z-index: 10000; pointer-events: none; opacity: 0;
            backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(39, 174, 96, 0.4);
            display: flex; align-items: center; gap: 12px; min-width: 280px; justify-content: center;
        `;
        
        feedback.innerHTML = `
            <i class="ri-check-line" style="font-size: 18px;"></i>
            <span>Message sent! We'll contact you soon.</span>
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Reset form
        this.form.reset();
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => feedback.remove(), 400);
        }, 4000);
    }

    onInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    onInputBlur(input) {
        input.parentElement.classList.remove('focused');
    }

    trackPhoneClick() {
        console.log('Phone call initiated');
        // Add analytics tracking here
    }

    trackTextClick() {
        console.log('Text message initiated');
        // Add analytics tracking here
    }
}

/* ========================================
   SCROLL INDICATOR COMPONENT
   ======================================== */
class ScrollIndicator {
    constructor() {
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator-elegant');
        
        if (this.scrollIndicator) {
            this.init();
        }
    }

    init() {
        this.scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

/* ========================================
   INITIALIZE APPLICATION
   ======================================== */
// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eviaApp = new EviaAestheticsApp();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaAestheticsApp;
}
