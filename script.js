/**
 * Evia Aesthetics - Complete Integrated JavaScript
 * Includes: preloader, enhanced hero section, header, modals, and Dr. Nano section
 */

'use strict';

/**
 * Enhanced Header with Modern Interactions
 */
class EnhancedHeader {
    constructor() {
        this.header = document.getElementById('luxuryHeader');
        this.menuToggle = document.getElementById('mobileToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileClose = document.getElementById('mobileClose');
        this.searchOverlay = document.getElementById('searchOverlay');
        this.progressBar = document.querySelector('.header-progress .progress-fill');
        
        this.scrolled = false;
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.initScrollEffects();
        this.initMobileMenu();
        this.initMagneticElements();
        this.initDropdowns();
        this.initNavigation();
        this.initSearch();
        this.initScrollProgress();
        this.initParticleHeader();
        
        console.log('✨ Enhanced header initialized');
    }
    
    initScrollEffects() {
        let lastScroll = 0;
        
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                if (this.header) {
                    this.header.style.transform = 'translateY(-100%)';
                }
            } else {
                if (this.header) {
                    this.header.style.transform = 'translateY(0)';
                }
            }
            
            lastScroll = currentScroll;
            this.ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(handleScroll);
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    initMobileMenu() {
        if (!this.menuToggle || !this.mobileMenu) return;
        
        this.menuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.mobileMenu?.classList.contains('active') && 
                !e.target.closest('.mobile-menu') && 
                !e.target.closest('.mobile-toggle')) {
                this.closeMobileMenu();
            }
        });
        
        // Handle dropdown toggles
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = toggle.nextElementSibling;
                const parent = toggle.closest('.has-submenu');
                
                parent?.classList.toggle('active');
            });
        });
        
        // Close menu on link click
        const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.dropdown-toggle), .mobile-sub-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }
    
    toggleMobileMenu() {
        this.mobileMenu?.classList.toggle('active');
        this.menuToggle?.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu?.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.mobileMenu?.classList.remove('active');
        this.menuToggle?.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    initMagneticElements() {
        if (window.innerWidth < 992) return;
        
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const strength = parseInt(element.dataset.strength) || 10;
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const magnetX = x * (strength / 100);
                const magnetY = y * (strength / 100);
                
                element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    initDropdowns() {
        const dropdowns = document.querySelectorAll('.has-dropdown');
        
        dropdowns.forEach(dropdown => {
            let hoverTimeout;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 300);
            });
        });
    }
    
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = this.header?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Update active state on scroll
        this.updateActiveNavOnScroll();
    }
    
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    initSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchClose = document.querySelector('.search-close');
        const searchInput = document.querySelector('.search-input');
        
        searchToggle?.addEventListener('click', () => {
            this.searchOverlay?.classList.add('active');
            setTimeout(() => searchInput?.focus(), 100);
        });
        
        searchClose?.addEventListener('click', () => {
            this.searchOverlay?.classList.remove('active');
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchOverlay?.classList.contains('active')) {
                this.searchOverlay.classList.remove('active');
            }
        });
        
        // Search functionality
        const searchForm = document.querySelector('.search-form');
        searchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput?.value.trim();
            if (query) {
                console.log('Search query:', query);
                // Implement search functionality here
            }
        });
    }
    
    initScrollProgress() {
        if (!this.progressBar) return;
        
        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / scrollHeight) * 100;
            
            this.progressBar.style.width = `${Math.min(progress, 100)}%`;
        };
        
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }
    
    initParticleHeader() {
        const canvas = document.getElementById('headerParticles');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        
        const createParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = canvas.height;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 158, 24, ${particle.opacity})`;
                ctx.fill();
            });
            
            animationId = requestAnimationFrame(animateParticles);
        };
        
        resizeCanvas();
        createParticles();
        animateParticles();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }
}

/**
 * Evia Modern Preloader
 * Handles loading animation and elegant transition to main content
 */
class EviaModernPreloader {
    constructor(options = {}) {
        // Default options
        this.options = {
            minDuration: 1800,       // Minimum display time in ms
            maxDuration: 4000,       // Maximum time before force-hiding
            exitDuration: 1200,      // Exit animation duration
            loadingMessages: [
                'Welcome to Evia Aesthetics',
                'Preparing your experience',
                'Loading treatments',
                'Almost ready'
            ],
            ...options
        };
        
        // Elements
        this.preloader = document.getElementById('eviaPreloader');
        this.progressLine = document.getElementById('progressLine');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.loadingMessage = document.getElementById('loadingMessage');
        
        // State
        this.isLoading = true;
        this.startTime = performance.now();
        this.progress = 0;
        this.raf = null;
        this.messageInterval = null;
        this.currentMessage = 0;
        
        // Initialize
        if (this.preloader) {
            this.init();
        } else {
            console.error('Preloader elements not found');
        }
    }
    
    /**
     * Initialize preloader functionality
     */
    init() {
        console.log('✨ Initializing modern preloader');
        
        // Add loading class to body
        document.body.classList.add('loading');
        
        // Start progress animation
        this.animateProgress();
        
        // Rotate loading messages
        this.rotateMessages();
        
        // Check page load status
        this.checkPageLoaded();
        
        // Fallback timer for maximum duration
        setTimeout(() => {
            if (this.isLoading) {
                console.log('Preloader fallback triggered (max duration)');
                this.completePreloader();
            }
        }, this.options.maxDuration);
    }
    
    /**
     * Animate progress bar with smooth acceleration
     */
    animateProgress() {
        const duration = this.options.minDuration;
        const startTime = performance.now();
        
        // Smooth easing function for natural progress
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        
        const updateProgress = (timestamp) => {
            if (!this.isLoading) return;
            
            const elapsed = timestamp - startTime;
            // Cap at 90% until actually loaded
            const targetProgress = Math.min(elapsed / duration, 0.9);
            
            // Apply easing for natural progression
            this.progress = easeOutCubic(targetProgress) * 90;
            
            // Update DOM
            if (this.progressLine) {
                this.progressLine.style.width = `${this.progress}%`;
            }
            
            if (this.progressPercentage) {
                this.progressPercentage.textContent = `${Math.round(this.progress)}%`;
            }
            
            if (targetProgress < 0.9) {
                this.raf = requestAnimationFrame(updateProgress);
            }
        };
        
        this.raf = requestAnimationFrame(updateProgress);
    }
    
    /**
     * Rotate through loading messages
     */
    rotateMessages() {
        const { loadingMessages } = this.options;
        if (!loadingMessages.length || !this.loadingMessage) return;
        
        this.loadingMessage.textContent = loadingMessages[0];
        
        this.messageInterval = setInterval(() => {
            if (!this.isLoading) {
                clearInterval(this.messageInterval);
                return;
            }
            
            this.currentMessage = (this.currentMessage + 1) % loadingMessages.length;
            
            // Apply fade transition
            this.loadingMessage.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingMessage.textContent = loadingMessages[this.currentMessage];
                this.loadingMessage.style.opacity = '0.7';
            }, 300);
            
        }, 3000);
    }
    
    /**
     * Check if page is fully loaded
     */
    checkPageLoaded() {
        if (document.readyState === 'complete') {
            const elapsedTime = performance.now() - this.startTime;
            
            // Ensure minimum display time
            if (elapsedTime < this.options.minDuration) {
                setTimeout(() => {
                    this.completePreloader();
                }, this.options.minDuration - elapsedTime);
            } else {
                this.completePreloader();
            }
        } else {
            // Check again after a delay
            setTimeout(() => this.checkPageLoaded(), 100);
        }
    }
    
    /**
     * Complete preloader with elegant exit animation
     */
    completePreloader() {
        if (!this.isLoading || !this.preloader) return;
        
        this.isLoading = false;
        
        // Clear any ongoing animations
        if (this.raf) {
            cancelAnimationFrame(this.raf);
        }
        
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }
        
        // Finish progress to 100%
        if (this.progressLine) {
            this.progressLine.style.width = '100%';
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = '100%';
        }
        
        // Trigger the sliding panel animation
        setTimeout(() => {
            this.preloader.classList.add('complete');
            
            // Remove preloader after animation completes
            setTimeout(() => {
                this.preloader.classList.add('hidden');
                document.body.classList.remove('loading');
                
                // Dispatch event when fully complete
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                
                console.log('✨ Modern preloader transition complete');
            }, this.options.exitDuration);
            
        }, 400); // Short delay before starting exit animation
    }
}

/**
 * Professional Med Spa Hero Section Controller
 * Enhanced version with glass morphism design for perfect video background visibility
 */
class ProfessionalMedSpaHero {
    constructor() {
        this.hero = document.querySelector('.manhattan-hero-enhanced');
        this.typedElement = document.getElementById('typingText');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.navDots = document.querySelectorAll('.side-nav-dot');
        this.primaryBtn = document.getElementById('heroBookBtn');
        this.videoBtn = document.getElementById('heroVideoBtn');
        this.trustNumbers = document.querySelectorAll('.trust-number');
        
        this.typed = null;
        this.isAnimating = false;
        this.countersAnimated = false;
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Initialize all hero section functionality
     */
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        this.isInitialized = true;
        console.log('✨ Professional Med Spa Hero initialized');
    }
    
    /**
     * Initialize all components
     */
    initializeComponents() {
        this.initAOS();
        this.initTypedAnimation();
        this.initGSAPAnimations();
        this.initButtonInteractions();
        this.initScrollEffects();
        this.initCounterAnimations();
        this.initMagneticEffects();
        this.initVideoEffects();
        this.initAccessibility();
    }
    
    /**
     * Initialize AOS (Animate On Scroll) animations
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1200,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 100,
                disable: window.innerWidth < 768
            });
            
            // Refresh AOS when needed
            setTimeout(() => {
                AOS.refresh();
            }, 500);
        }
    }
    
    /**
     * Initialize typing animation with medical spa services
     */
    initTypedAnimation() {
        if (!this.typedElement || typeof Typed === 'undefined') {
            console.warn('Typed.js not available or element not found');
            return;
        }
        
        const medSpaServices = [
            'Advanced Botox & Dermal Fillers',
            'Luxury HydraFacial Treatments', 
            'Body Contouring & CoolSculpting',
            'Medical-Grade Skincare Solutions',
            'Anti-Aging & Longevity Medicine',
            'Non-Invasive Aesthetic Procedures',
            'Professional Skin Rejuvenation',
            'Laser Treatments & IPL Therapy'
        ];
        
        const options = {
            strings: medSpaServices,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2500,
            loop: true,
            showCursor: false,
            fadeOut: true,
            fadeOutDelay: 500,
            fadeOutClass: 'typed-fade-out',
            onStringTyped: (arrayPos) => {
                // Add glow effect when typing completes
                this.typedElement.style.textShadow = '0 0 20px rgba(255, 158, 24, 0.6)';
                setTimeout(() => {
                    this.typedElement.style.textShadow = '0 1px 3px rgba(255, 158, 24, 0.3)';
                }, 1200);
            },
            onBegin: () => {
                this.typedElement.style.opacity = '1';
            }
        };
        
        // Initialize with error handling
        try {
            this.typed = new Typed(this.typedElement, options);
        } catch (error) {
            console.error('Error initializing Typed.js:', error);
        }
    }
    
    /**
     * Initialize GSAP animations if available
     */
    initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;
        
        try {
            gsap.registerPlugin(ScrollTrigger);
            
            // Parallax effect for video background
            if (window.innerWidth > 768) {
                gsap.to('.hero-video-bg', {
                    scale: 1.15,
                    scrollTrigger: {
                        trigger: this.hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            }
            
            // Content fade on scroll
            gsap.to('.hero-content', {
                y: 50,
                opacity: 0.6,
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
            
            // Staggered animation for feature cards
            gsap.fromTo('.feature-card', 
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out',
                    delay: 1.5
                }
            );
            
        } catch (error) {
            console.error('Error initializing GSAP:', error);
        }
    }
    
    /**
     * Initialize button interactions and effects
     */
    initButtonInteractions() {
        // Primary CTA button
        if (this.primaryBtn) {
            this.primaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
                this.trackEvent('hero_cta_clicked', { type: 'primary', text: 'Book Your Consultation' });
            });
            
            this.addAdvancedButtonEffects(this.primaryBtn);
        }
        
        // Video button
        if (this.videoBtn) {
            this.videoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openVideoModal();
                this.trackEvent('hero_video_clicked', { type: 'secondary', text: 'Watch Our Story' });
            });
            
            this.addAdvancedButtonEffects(this.videoBtn);
        }
        
        // Additional CTA buttons (header, mobile)
        const additionalCTAs = [
            '.header-cta',
            '.mobile-cta'
        ];
        
        additionalCTAs.forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openAppointmentModal();
                });
                this.addAdvancedButtonEffects(btn);
            }
        });
    }
    
    /**
     * Open appointment modal with smooth animation
     */
    openAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 300);
            
            // Add modal opening animation
            const modalContainer = modal.querySelector('.modal-container');
            if (modalContainer) {
                modalContainer.style.transform = 'scale(0.8) translateY(20px)';
                modalContainer.style.opacity = '0';
                
                setTimeout(() => {
                    modalContainer.style.transform = 'scale(1) translateY(0)';
                    modalContainer.style.opacity = '1';
                }, 50);
            }
        }
    }
    
    /**
     * Open video modal
     */
    openVideoModal() {
        const modal = document.getElementById('videoModal');
        if (modal) {
            modal.classList.add('active');
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                // Replace with your actual video URL
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
            }
        }
    }
    
    /**
     * Add advanced button effects and interactions
     */
    addAdvancedButtonEffects(button) {
        if (!button) return;
        
        // Enhanced ripple effect on click
        button.addEventListener('click', (e) => {
            this.createRippleEffect(e, button);
        });
        
        // Particle effect on hover
        button.addEventListener('mouseenter', () => {
            this.createParticleEffect(button);
        });
        
        // Reset effects on mouse leave
        button.addEventListener('mouseleave', () => {
            this.resetButtonEffects(button);
        });
        
        // Keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.createRippleEffect(e, button);
                button.click();
            }
        });
    }
    
    /**
     * Create ripple effect on button click
     */
    createRippleEffect(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
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
    
    /**
     * Create particle effect on button hover
     */
    createParticleEffect(button) {
        const particles = button.querySelectorAll('.btn-particles span');
        if (particles.length > 0) {
            particles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.style.animation = 'btnParticle 1.2s ease-out';
                }, index * 150);
            });
        }
    }
    
    /**
     * Reset button effects
     */
    resetButtonEffects(button) {
        const particles = button.querySelectorAll('.btn-particles span');
        particles.forEach(particle => {
            particle.style.animation = '';
        });
    }
    
    /**
     * Initialize scroll effects and indicators
     */
    initScrollEffects() {
        // Scroll indicator functionality
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const nextSection = this.hero?.nextElementSibling;
                if (nextSection) {
                    const headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 0;
                    const targetPosition = nextSection.offsetTop - headerHeight;
                    
                    this.smoothScrollTo(targetPosition);
                }
            });
        }
        
        // Side navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavDotClick(index);
            });
        });
        
        // Update active dot on scroll
        this.updateActiveDot();
        
        // Hide scroll indicator when scrolled
        this.initScrollIndicatorVisibility();
    }
    
    /**
     * Handle navigation dot clicks
     */
    handleNavDotClick(index) {
        const sections = ['hero', 'about', 'services', 'results', 'contact'];
        const targetSection = document.getElementById(sections[index]);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 0;
            let targetPosition;
            
            if (sections[index] === 'hero') {
                targetPosition = 0;
            } else {
                targetPosition = targetSection.offsetTop - headerHeight - 20;
            }
            
            this.smoothScrollTo(targetPosition);
        }
    }
    
    /**
     * Smooth scroll to position
     */
    smoothScrollTo(position) {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    }
    
    /**
     * Update active navigation dot based on scroll position
     */
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
                    
                    if (index !== -1 && this.navDots[index]) {
                        this.navDots.forEach(dot => dot.classList.remove('active'));
                        this.navDots[index].classList.add('active');
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
    }
    
    /**
     * Initialize scroll indicator visibility
     */
    initScrollIndicatorVisibility() {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const scrollIndicatorWrapper = document.querySelector('.scroll-indicator-wrapper');
            
            if (scrollIndicatorWrapper) {
                if (scrollY > 100) {
                    scrollIndicatorWrapper.style.opacity = '0';
                    scrollIndicatorWrapper.style.transform = 'translateX(-50%) translateY(20px)';
                } else {
                    scrollIndicatorWrapper.style.opacity = '1';
                    scrollIndicatorWrapper.style.transform = 'translateX(-50%) translateY(0)';
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    /**
     * Initialize counter animations for trust indicators
     */
    initCounterAnimations() {
        if (!this.trustNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 60; // 60 frames for smooth animation
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    // Add completion effect
                    counter.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                    }, 200);
                }
            };
            
            updateCounter();
        };
        
        // Intersection Observer for counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated) {
                    this.countersAnimated = true;
                    
                    // Stagger counter animations
                    this.trustNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 200);
                    });
                    
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const trustIndicators = document.querySelector('.trust-indicators-container');
        if (trustIndicators) {
            counterObserver.observe(trustIndicators);
        }
    }
    
    /**
     * Initialize magnetic hover effects (desktop only)
     */
    initMagneticEffects() {
        if (window.innerWidth < 992) return; // Desktop only
        
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const strength = parseInt(element.dataset.strength) || 10;
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const magnetX = x * (strength / 200);
                const magnetY = y * (strength / 200);
                
                element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    /**
     * Initialize video background effects
     */
    initVideoEffects() {
        const video = document.querySelector('.hero-video-bg');
        if (!video) return;
        
        // Ensure video plays
        video.addEventListener('loadeddata', () => {
            if (video.paused) {
                video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            }
        });
        
        // Handle video errors
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            // Optionally add fallback background
            this.hero.style.background = 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)';
        });
        
        // Optimize video performance
        video.addEventListener('loadstart', () => {
            video.playbackRate = 1.0;
        });
    }
    
    /**
     * Initialize accessibility features
     */
    initAccessibility() {
        // Add ARIA labels
        const buttons = this.hero.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
                const text = button.querySelector('.btn-text')?.textContent || button.textContent;
                if (text) {
                    button.setAttribute('aria-label', text.trim());
                }
            }
        });
        
        // Add reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Disable complex animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                .manhattan-hero-enhanced *, 
                .manhattan-hero-enhanced *::before, 
                .manhattan-hero-enhanced *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Focus management
        this.initFocusManagement();
    }
    
    /**
     * Initialize focus management for keyboard navigation
     */
    initFocusManagement() {
        const focusableElements = this.hero.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '3px solid rgba(255, 158, 24, 0.6)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
    
    /**
     * Track events for analytics
     */
    trackEvent(eventName, eventData = {}) {
        // Console logging for development
        console.log('Event tracked:', eventName, eventData);
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'hero_interaction',
                event_label: eventData.text || '',
                custom_parameter: eventData
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                event_name: eventName,
                content_category: 'hero_section',
                ...eventData
            });
        }
        
        // Custom analytics endpoint
        if (window.customAnalytics) {
            window.customAnalytics.track(eventName, eventData);
        }
    }
    
    /**
     * Cleanup method for performance
     */
    destroy() {
        // Destroy Typed.js instance
        if (this.typed) {
            this.typed.destroy();
            this.typed = null;
        }
        
        // Kill GSAP animations
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
        
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('*');
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        console.log('Hero section destroyed');
    }
    
    /**
     * Refresh/reinitialize components
     */
    refresh() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
}

/**
 * Doctor Section Interactive Elements
 */
class DoctorSectionController {
    constructor() {
        this.section = document.querySelector('.meet-doctor-section');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.bookWithDoctorBtn = document.querySelector('.book-with-doctor');
        this.learnMoreBtn = document.querySelector('.learn-more-btn');
        this.expertiseItems = document.querySelectorAll('.expertise-item');
        this.credentialItems = document.querySelectorAll('.credential-item');
        
        this.statsAnimated = false;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.initScrollAnimations();
        this.initButtonInteractions();
        this.initHoverEffects();
        this.initStatCounters();
        this.initMagneticEffects();
        this.initParallaxEffects();
        
        console.log('✨ Doctor section initialized');
    }
    
    initScrollAnimations() {
        // Intersection Observer for section visibility
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    this.isVisible = true;
                    this.triggerEntranceAnimations();
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        if (this.section) {
            sectionObserver.observe(this.section);
        }
        
        // Individual element animations
        this.initElementRevealAnimations();
    }
    
    initElementRevealAnimations() {
        const revealElements = [
            ...this.expertiseItems,
            ...this.credentialItems,
            '.credentials-badge',
            '.award-item',
            '.brand-item'
        ];
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-reveal');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(selector => {
            const elements = typeof selector === 'string' 
                ? document.querySelectorAll(selector)
                : [selector];
            
            elements.forEach(element => {
                if (element) {
                    elementObserver.observe(element);
                }
            });
        });
    }
    
    triggerEntranceAnimations() {
        // Animate doctor photo entrance
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer) {
            setTimeout(() => {
                imageContainer.style.transform = 'translateY(0)';
                imageContainer.style.opacity = '1';
            }, 200);
        }
        
        // Animate credentials badge
        const credentialsBadge = document.querySelector('.credentials-badge');
        if (credentialsBadge) {
            setTimeout(() => {
                credentialsBadge.style.transform = 'translateY(0) scale(1)';
                credentialsBadge.style.opacity = '1';
            }, 600);
        }
        
        // Animate awards
        const awardItems = document.querySelectorAll('.award-item');
        awardItems.forEach((award, index) => {
            setTimeout(() => {
                award.style.transform = 'translateY(0) scale(1)';
                award.style.opacity = '1';
            }, 800 + (index * 200));
        });
    }
    
    initButtonInteractions() {
        // Book with Doctor button
        if (this.bookWithDoctorBtn) {
            this.bookWithDoctorBtn.addEventListener('click', () => {
                this.openAppointmentModal();
                
                // Track specific doctor booking
                this.trackEvent('doctor_booking_clicked', {
                    doctor: 'Dr. Evia Alikaj Nano',
                    section: 'about'
                });
            });
            
            this.addAdvancedButtonEffects(this.bookWithDoctorBtn);
        }
        
        // Learn More button
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', () => {
                this.scrollToServices();
            });
            
            this.addAdvancedButtonEffects(this.learnMoreBtn);
        }
    }
    
    openAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Pre-fill with doctor preference if form has the option
            setTimeout(() => {
                const doctorSelect = modal.querySelector('select[name="doctor"]');
                if (doctorSelect) {
                    doctorSelect.value = 'dr-nano';
                }
                
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 300);
        }
    }
    
    scrollToServices() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 0;
            const targetPosition = servicesSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    addAdvancedButtonEffects(button) {
        if (!button) return;
        
        // Enhanced ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'advanced-ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.5;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                pointer-events: none;
                animation: advancedRipple 0.8s ease-out;
                z-index: 1;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 800);
        });
        
        // Hover particle effects
        button.addEventListener('mouseenter', () => {
            this.createHoverParticles(button);
        });
    }
    
    createHoverParticles(button) {
        const particles = button.querySelectorAll('.btn-particles span');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'btnParticle 1.2s ease-out';
            }, index * 100);
        });
        
        // Reset after animation
        setTimeout(() => {
            particles.forEach(particle => {
                particle.style.animation = '';
            });
        }, 1200);
    }
    
    initHoverEffects() {
        // Expertise items hover effects
        this.expertiseItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Add subtle scale and glow
                item.style.transform = 'translateY(-8px) scale(1.02)';
                
                // Stagger effect for neighboring items
                const neighbors = this.getNeighboringItems(item, index);
                neighbors.forEach((neighbor, i) => {
                    setTimeout(() => {
                        neighbor.style.transform = 'translateY(-3px) scale(1.01)';
                    }, i * 50);
                });
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                
                // Reset neighbors
                const neighbors = this.getNeighboringItems(item, index);
                neighbors.forEach(neighbor => {
                    neighbor.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
        
        // Credential items hover effects
        this.credentialItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-3px) scale(1.02)';
                
                // Add glow effect
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.textShadow = '0 0 10px rgba(255, 158, 24, 0.6)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.textShadow = '';
                }
            });
        });
        
        // Doctor photo advanced hover effects
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer) {
            imageContainer.addEventListener('mouseenter', () => {
                this.createPhotoHoverEffect();
            });
        }
    }
    
    getNeighboringItems(currentItem, currentIndex) {
        const neighbors = [];
        const totalItems = this.expertiseItems.length;
        
        // Get adjacent items based on grid layout
        if (currentIndex > 0) neighbors.push(this.expertiseItems[currentIndex - 1]);
        if (currentIndex < totalItems - 1) neighbors.push(this.expertiseItems[currentIndex + 1]);
        
        return neighbors.filter(item => item && item !== currentItem);
    }
    
    createPhotoHoverEffect() {
        // Create floating particles around photo
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'photo-hover-particle';
            
            const size = Math.random() * 8 + 4;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 158, 24, 0.6);
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                pointer-events: none;
                animation: floatParticle 3s ease-out forwards;
                z-index: 10;
            `;
            
            imageContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }
    
    initStatCounters() {
        if (!this.statNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 80; // Smooth 80-frame animation
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    
                    // Add completion effect
                    counter.style.transform = 'scale(1.15)';
                    counter.style.textShadow = '0 0 20px rgba(255, 158, 24, 0.5)';
                    
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.textShadow = '';
                    }, 300);
                }
            };
            
            updateCounter();
        };
        
        // Trigger counter animation when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.statsAnimated = true;
                    
                    // Stagger counter animations
                    this.statNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 200);
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
    
    initMagneticEffects() {
        if (window.innerWidth < 992) return; // Desktop only
        
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const strength = parseInt(element.dataset.strength) || 15;
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const magnetX = x * (strength / 200);
                const magnetY = y * (strength / 200);
                
                element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    initParallaxEffects() {
        if (window.innerWidth < 768) return; // Skip on mobile for performance
        
        const parallaxElements = [
            { element: '.credentials-badge', speed: 0.3 },
            { element: '.award-item', speed: 0.5 },
            { element: '.floating-accent', speed: 0.2 }
        ];
        
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const sectionTop = this.section?.offsetTop || 0;
            const sectionHeight = this.section?.offsetHeight || 0;
            
            // Only apply parallax when section is in view
            if (scrolled + window.innerHeight > sectionTop && 
                scrolled < sectionTop + sectionHeight) {
                
                parallaxElements.forEach(({ element, speed }) => {
                    const elements = document.querySelectorAll(element);
                    elements.forEach(el => {
                        const parallaxValue = (scrolled - sectionTop) * speed;
                        el.style.transform = `translateY(${parallaxValue}px)`;
                    });
                });
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    trackEvent(eventName, eventData = {}) {
        // Analytics tracking (replace with your analytics service)
        console.log('Event tracked:', eventName, eventData);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter: eventData
            });
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                event_name: eventName,
                ...eventData
            });
        }
    }
    
    // Cleanup method for performance
    destroy() {
        // Remove event listeners and clean up
        window.removeEventListener('scroll', this.handleScroll);
        
        // Clean up any ongoing animations
        this.statNumbers.forEach(counter => {
            counter.style.animation = '';
        });
    }
}

/**
 * Enhanced Modal System
 */
class EnhancedModals {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        this.initAppointmentModal();
        this.initVideoModal();
        this.initFormValidation();
        this.initKeyboardNavigation();
        
        console.log('✨ Enhanced modals initialized');
    }
    
    initAppointmentModal() {
        if (!this.appointmentModal) return;
        
        const closeBtn = this.appointmentModal.querySelector('.modal-close');
        const overlay = this.appointmentModal.querySelector('.modal-overlay');
        
        closeBtn?.addEventListener('click', () => {
            this.closeModal(this.appointmentModal);
        });
        
        overlay?.addEventListener('click', () => {
            this.closeModal(this.appointmentModal);
        });
        
        // Form submission
        const form = this.appointmentModal.querySelector('#appointmentForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
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
        
        closeBtn?.addEventListener('click', closeVideo);
        overlay?.addEventListener('click', closeVideo);
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.activeModal = null;
        
        // Return focus to trigger element
        const lastFocused = document.activeElement;
        if (lastFocused && lastFocused !== document.body) {
            lastFocused.blur();
        }
    }
    
    initFormValidation() {
        const inputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');
        
        inputs.forEach(input => {
            // Enhanced focus effects
            input.addEventListener('focus', () => {
                const group = input.closest('.form-group');
                group?.classList.add('focused');
                this.clearFieldError(input);
            });
            
            input.addEventListener('blur', () => {
                const group = input.closest('.form-group');
                group?.classList.remove('focused');
                this.validateField(input);
            });
            
            // Real-time validation
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity() && value !== '';
        const group = field.closest('.form-group');
        
        if (group) {
            group.classList.toggle('error', !isValid);
            group.classList.toggle('valid', isValid);
        }
        
        return isValid;
    }
    
    clearFieldError(field) {
        const group = field.closest('.form-group');
        if (group) {
            group.classList.remove('error');
        }
    }
    
    validateForm(form) {
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    handleFormSubmission(form) {
        if (!this.validateForm(form)) {
            this.showFormError('Please fill in all required fields correctly.');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn?.innerHTML;
        
        // Show loading state with enhanced animation
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>
                <span class="btn-text">Sending Request...</span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)';
        }
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
            }, 3500);
        }, 2500);
    }
    
    showFormError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateX(100%)';
            setTimeout(() => errorDiv.remove(), 300);
        }, 4000);
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 50px 20px;">
                <div class="success-animation" style="margin-bottom: 30px;">
                    <div class="success-icon" style="
                        width: 80px; 
                        height: 80px; 
                        margin: 0 auto 20px; 
                        background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: white; 
                        font-size: 2rem;
                        animation: successPulse 0.6s ease-out;
                    ">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                <h3 style="
                    color: #442C15; 
                    margin-bottom: 15px; 
                    font-family: 'Playfair Display', serif;
                    font-size: 1.75rem;
                    font-weight: 600;
                ">Thank You!</h3>
                <p style="
                    color: #6D6D6D; 
                    line-height: 1.6;
                    font-family: 'Inter', sans-serif;
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
        
        // Add success animation CSS
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
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Close modals with Escape
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modern-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }
}

/**
 * Main Application Class
 */
class EviaApp {
    constructor() {
        // State properties
        this.isLoading = true;
        this.scrolled = false;
        this.mobileMenuOpen = false;
        this.modalOpen = false;
        this.raf = null;
        this.scrollY = window.scrollY;
        this.resizeTimer = null;
        
        // Components
        this.preloader = null;
        this.heroSection = null;
        this.header = null;
        this.modals = null;
        this.doctorSection = null;
        
        // Initialize application
        this.init();
    }
    
    /**
     * Initialize application
     */
    init() {
        // Wait for DOM content to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    /**
     * Main application initialization
     */
    initApp() {
        try {
            console.log('🌿 Initializing Evia Aesthetics application...');
            
            // Detect browser and device capabilities
            this.detectCapabilities();
            
            // Initialize preloader first
            this.initPreloader();
            
            // Initialize header
            this.header = new EnhancedHeader();
            
            // Initialize modals
            this.modals = new EnhancedModals();
            
            // Add dynamic styles
            this.addDynamicStyles();
            
            // Bind global events
            this.bindEvents();
            
            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    /**
     * Initialize preloader
     */
    initPreloader() {
        // Create and initialize preloader
        this.preloader = new EviaModernPreloader({
            minDuration: 2000,
            exitDuration: 1200,
            loadingMessages: [
                'Welcome to Evia Aesthetics',
                'Preparing your experience',
                'Loading treatments',
                'Almost ready'
            ]
        });
        
        // Listen for preloader completion
        window.addEventListener('preloaderComplete', () => {
            this.onPreloaderComplete();
        });
    }
    
    /**
     * Handle preloader completion
     */
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize hero section after preloader (using new enhanced version)
        this.heroSection = new ProfessionalMedSpaHero();
        
        // Initialize doctor section after a slight delay
        setTimeout(() => {
            this.doctorSection = new DoctorSectionController();
        }, 1000);
        
        // Initialize AOS animations after preloader
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: this.prefersReducedMotion ? 0 : 800,
                easing: 'ease-out',
                once: true,
                offset: 50,
                delay: this.prefersReducedMotion ? 0 : 100,
                disable: this.isLowEndDevice
            });
        }
        
        // Trigger initial scroll check
        this.handleScroll();
    }
    
    /**
     * Detect browser capabilities for performance optimizations
     */
    detectCapabilities() {
        // Detect touch capability
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Detect reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Add relevant classes to the body
        if (this.isTouch) document.body.classList.add('touch-device');
        if (this.prefersReducedMotion) document.body.classList.add('reduced-motion');
        
        // Detect low-end devices
        this.isLowEndDevice = navigator.hardwareConcurrency <= 4;
        
        if (this.isLowEndDevice) {
            document.body.classList.add('low-end-device');
            console.log('Low-end device detected, optimizing animations');
        }
    }
    
    /**
     * Handle scroll events efficiently
     */
    handleScroll() {
        const shouldBeScrolled = this.scrollY > 50;
        
        if (this.scrolled !== shouldBeScrolled) {
            this.scrolled = shouldBeScrolled;
        }
    }
    
    /**
     * Handle initialization errors
     */
    handleInitError() {
        // Hide preloader even if there's an error
        document.body.classList.remove('loading');
        const preloader = document.getElementById('eviaPreloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality due to errors');
    }
    
    /**
     * Add dynamic styles
     */
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes btnParticle {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(0);
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--x), var(--y)) scale(1);
                }
            }
            
            @keyframes advancedRipple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-30px) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-60px) scale(0);
                    opacity: 0;
                }
            }
            
            @keyframes animate-reveal {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-reveal {
                animation: animate-reveal 0.8s ease-out forwards;
            }
            
            .form-group.focused input,
            .form-group.focused select,
            .form-group.focused textarea {
                border-color: #FF9E18;
                box-shadow: 0 0 20px rgba(255, 158, 24, 0.2);
                background: rgba(255, 255, 255, 0.95);
            }
            
            .form-group.valid input,
            .form-group.valid select,
            .form-group.valid textarea {
                border-color: #10B981;
                box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
            }
            
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #EF4444;
                box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
            }
            
            .typed-fade-out {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            .scroll-indicator-wrapper {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .trust-number,
            .stat-number {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Initial hidden state for animated elements */
            .credentials-badge,
            .award-item {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .expertise-item,
            .credential-item {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Enhanced hover states */
            .expertise-item:hover .expertise-icon {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(255, 158, 24, 0.3);
            }
            
            .credential-item:hover {
                box-shadow: 0 8px 25px rgba(255, 158, 24, 0.2);
            }
            
            .brand-item:hover {
                box-shadow: 0 5px 15px rgba(255, 158, 24, 0.3);
            }
            
            .button-ripple {
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Bind global event listeners
     */
    bindEvents() {
        // Handle resize events with debouncing
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                // Update AOS on resize if available
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
                
                // Refresh hero section if available
                if (this.heroSection && typeof this.heroSection.refresh === 'function') {
                    this.heroSection.refresh();
                }
            }, 250);
        });
        
        // Optimize page visibility handling
        document.addEventListener('visibilitychange', () => {
            // Pause animations when page is not visible
            if (document.hidden) {
                if (this.scrollAnimation) {
                    cancelAnimationFrame(this.scrollAnimation);
                    this.scrollAnimation = null;
                }
            }
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const eviaApp = new EviaApp();
    
    // Store globally for external access
    window.eviaApp = eviaApp;
});

// Global utility functions
window.eviaUtils = {
    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    smoothScrollTo: (targetId) => {
        const target = document.getElementById(targetId);
        if (target) {
            const headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};
