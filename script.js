// Evia Aesthetics - JavaScript Functionality

'use strict';

// Global Application State
const EviaApp = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    components: {}
};

/**
 * Preloader Controller
 */
class PreloaderController {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.progress = 0;
        this.isComplete = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🔄 Initializing preloader');
        
        // Add no-scroll class to body
        document.body.classList.add('no-scroll');
        
        // Start progress animation
        this.animateProgress();
        
        // Check page load status
        this.checkPageReady();
        
        // Fallback timer
        this.fallbackTimer = setTimeout(() => {
            if (!this.isComplete) {
                console.log('⏰ Preloader fallback triggered');
                this.complete();
            }
        }, 4000);
    }
    
    animateProgress() {
        const duration = 2500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            if (this.isComplete) return;
            
            const elapsed = currentTime - startTime;
            const targetProgress = Math.min((elapsed / duration) * 90, 90);
            
            // Smooth easing
            const easedProgress = this.easeOutCubic(targetProgress / 90) * 90;
            
            this.updateProgress(easedProgress);
            
            if (targetProgress < 90) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    checkPageReady() {
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
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        // Clear fallback timer
        if (this.fallbackTimer) {
            clearTimeout(this.fallbackTimer);
        }
        
        // Complete progress
        this.updateProgress(100);
        
        // Hide preloader
        setTimeout(() => {
            if (this.element) {
                this.element.classList.add('hidden');
                document.body.classList.remove('no-scroll');
                
                // Initialize main app
                setTimeout(() => {
                    this.onComplete();
                }, 300);
            }
        }, 600);
        
        console.log('✅ Preloader completed');
    }
    
    onComplete() {
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        EviaApp.isLoaded = true;
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

/**
 * Header Controller
 */
class HeaderController {
    constructor() {
        this.element = document.getElementById('header');
        this.progressLine = document.getElementById('progressLine');
        this.logoContainer = document.getElementById('logoContainer');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 60;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('📱 Initializing header');
        
        this.bindEvents();
        this.initNavigation();
        this.initScrollSpy();
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Logo click
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
        
        // Header CTA
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('appointmentModal');
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
            
            // Update active navigation
            this.updateActiveNavigation();
            
            this.lastScrollY = scrollY;
            EviaApp.scrollY = scrollY;
            this.ticking = false;
        });
    }
    
    updateScrollProgress() {
        if (!this.progressLine) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.progressLine.style.width = `${Math.min(progress, 100)}%`;
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
                    
                    // Update side nav
                    const sideNavDot = document.querySelector(`.nav-dot[href="#${id}"]`);
                    if (sideNavDot) {
                        document.querySelectorAll('.nav-dot').forEach(dot => dot.classList.remove('active'));
                        sideNavDot.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveNavigation() {
        // Additional navigation updates can be added here
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
    
    handleResize() {
        EviaApp.isMobile = window.innerWidth <= 768;
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }
}

/**
 * Mobile Menu Controller
 */
class MobileMenuController {
    constructor() {
        this.element = document.getElementById('mobileMenu');
        this.toggle = document.getElementById('mobileToggle');
        this.close = document.getElementById('mobileClose');
        this.overlay = document.getElementById('mobileOverlay');
        this.navLinks = this.element?.querySelectorAll('.mobile-nav-link');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('📱 Initializing mobile menu');
        
        this.bindEvents();
        this.initNavigation();
    }
    
    bindEvents() {
        // Toggle button
        if (this.toggle) {
            this.toggle.addEventListener('click', this.toggle_menu.bind(this));
        }
        
        // Close button
        if (this.close) {
            this.close.addEventListener('click', this.close_menu.bind(this));
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', this.close_menu.bind(this));
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close_menu();
            }
        });
    }
    
    initNavigation() {
        if (!this.navLinks) return;
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(href);
                });
            }
        });
    }
    
    navigateTo(target) {
        this.close_menu();
        
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
        }, 300);
    }
    
    toggle_menu() {
        if (this.isOpen) {
            this.close_menu();
        } else {
            this.open_menu();
        }
    }
    
    open_menu() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.element.classList.add('active');
        this.toggle.classList.add('active');
        document.body.classList.add('no-scroll');
        
        console.log('📱 Mobile menu opened');
    }
    
    close_menu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.element.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        console.log('📱 Mobile menu closed');
    }
}

/**
 * Hero Section Controller
 */
class HeroController {
    constructor() {
        this.element = document.querySelector('.hero');
        this.video = document.querySelector('.hero-video');
        this.typingElement = document.getElementById('typingText');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.heroBooking = document.getElementById('heroBooking');
        this.videoPlay = document.getElementById('videoPlay');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.sideNavDots = document.querySelectorAll('.nav-dot');
        
        this.typingTexts = [
            'Premium Botox',
            'Advanced Facial Rejuvenation',
            'Medical-Grade Skincare',
            'Expert Injectable Medicine',
            'Hair Restoration Therapy',
            'Body Sculpting Excellence',
            'IV Wellness Therapy',
            'Holistic Beauty Medicine'
        ];
        this.currentIndex = 0;
        this.typingInterval = null;
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('🎬 Initializing hero section');
        
        this.initVideo();
        this.initTypingAnimation();
        this.initButtonInteractions();
        this.initScrollIndicator();
        this.initSideNavigation();
        this.initStatsCounter();
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
        });
    }
    
    initTypingAnimation() {
        if (!this.typingElement) return;
        
        this.startTypingAnimation();
    }
    
    startTypingAnimation() {
        let currentText = '';
        let isDeleting = false;
        let charIndex = 0;
        
        const type = () => {
            const fullText = this.typingTexts[this.currentIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            this.typingElement.textContent = currentText;
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.typingTexts.length;
                typeSpeed = 500; // Pause before next word
            }
            
            setTimeout(type, typeSpeed);
        };
        
        type();
    }
    
    initButtonInteractions() {
        // Hero booking button
        if (this.heroBooking) {
            this.heroBooking.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('appointmentModal');
            });
        }
        
        // Video play button
        if (this.videoPlay) {
            this.videoPlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('videoModal');
            });
        }
        
        // Book with doctor button
        const bookWithDoctor = document.getElementById('bookWithDoctor');
        if (bookWithDoctor) {
            bookWithDoctor.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('appointmentModal');
            });
        }
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
            const opacity = scrollY > 200 ? 0 : 1;
            this.scrollIndicator.style.opacity = opacity;
        }, { passive: true });
    }
    
    initSideNavigation() {
        this.sideNavDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const href = dot.getAttribute('href');
                if (href) {
                    this.navigateToSection(href, dot);
                }
            });
        });
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
        
        if (target === '#home') {
            targetPosition = 0;
        } else {
            targetPosition = element.offsetTop - headerHeight - 20;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    initStatsCounter() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 60; // 1 second animation at 60fps
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    
                    // Animate all counters with stagger
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 200);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsContainer = document.querySelector('.hero-stats, .stats-container');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // For video modal, set video source
            if (modalId === 'videoModal') {
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
                }
            }
        }
    }
}

/**
 * Modal System Controller
 */
class ModalController {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        console.log('🔧 Initializing modal system');
        
        this.initAppointmentModal();
        this.initVideoModal();
        this.initFormHandling();
        this.initKeyboardNavigation();
    }
    
    initAppointmentModal() {
        if (!this.appointmentModal) return;
        
        const closeBtn = this.appointmentModal.querySelector('.modal-close');
        const overlay = this.appointmentModal.querySelector('.modal-overlay');
        
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
        
        const closeBtn = this.videoModal.querySelector('.video-modal-close');
        const overlay = this.videoModal.querySelector('.video-modal-overlay');
        
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
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    handleFormSubmission(form) {
        if (!this.validateForm(form)) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn?.innerHTML;
        
        // Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Sending Request...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
        }
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
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
        
        // Visual feedback
        const group = field.closest('.form-group');
        if (group) {
            group.classList.toggle('error', !isValid && value);
            group.classList.toggle('valid', isValid && value);
        }
        
        return isValid;
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem;">
                <div style="
                    width: 80px; 
                    height: 80px; 
                    margin: 0 auto 1.5rem; 
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-size: 2rem;
                ">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="color: var(--evia-brown); margin-bottom: 1rem; font-size: 1.5rem;">Thank You!</h3>
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
                    Your consultation request has been received. Dr. Nano's team will contact you within 24 hours to schedule your appointment.
                </p>
                <div style="font-size: 0.875rem; color: var(--evia-orange); font-style: italic;">
                    This window will close automatically...
                </div>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#EF4444' : '#10B981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        this.activeModal = null;
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active, .video-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }
}

/**
 * About Section Controller
 */
class AboutController {
    constructor() {
        this.element = document.querySelector('.about-section');
        this.statNumbers = document.querySelectorAll('.stats-container .stat-number');
        this.statsAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        console.log('👩‍⚕️ Initializing about section');
        
        this.initStatsCounter();
        this.initHoverEffects();
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
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    initHoverEffects() {
        const expertiseItems = document.querySelectorAll('.expertise-item');
        
        expertiseItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.expertise-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.expertise-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
}

/**
 * Animations Controller
 */
class AnimationsController {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('✨ Initializing animations');
        
        this.initAOS();
        this.initIntersectionObservers();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120,
                delay: 0,
                disable: EviaApp.isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
            
            // Refresh on window load
            window.addEventListener('load', () => {
                setTimeout(() => AOS.refresh(), 300);
            });
        }
    }
    
    initIntersectionObservers() {
        // Animate elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToObserve = document.querySelectorAll(
            '.expertise-item, .credential-item, .stat-item'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }
}

/**
 * Main Application Controller
 */
class EviaApplication {
    constructor() {
        this.isLoading = true;
        this.components = {};
        
        this.init();
    }
    
    init() {
        console.log('🏢 Initializing Evia Aesthetics Application...');
        
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
            this.components.preloader = new PreloaderController();
            
            // Initialize other components after preloader completes
            window.addEventListener('preloaderComplete', () => {
                this.onPreloaderComplete();
            });
            
            // Initialize header immediately
            this.components.header = new HeaderController();
            this.components.mobileMenu = new MobileMenuController();
            this.components.modals = new ModalController();
            
            // Bind global events
            this.bindGlobalEvents();
            
            console.log('✅ Evia application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize remaining components
        setTimeout(() => {
            this.components.hero = new HeroController();
            this.components.about = new AboutController();
            this.components.animations = new AnimationsController();
            
            console.log('🎬 Post-preloader components initialized');
        }, 500);
    }
    
    bindGlobalEvents() {
        // Resize handler
        window.addEventListener('resize', () => {
            EviaApp.isMobile = window.innerWidth <= 768;
            
            // Refresh AOS if available
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 300);
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
        document.body.classList.remove('no-scroll');
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
    
    // Utility methods
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
            document.body.classList.add('no-scroll');
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.EviaApp = new EviaApplication();
});

// Global utility functions
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

// CSS Animation Classes
const style = document.createElement('style');
style.textContent = `
    .in-view {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .form-group.valid input,
    .form-group.valid select,
    .form-group.valid textarea {
        border-color: #10B981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
`;
document.head.appendChild(style);
