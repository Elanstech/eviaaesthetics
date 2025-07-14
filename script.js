/**
 * Evia Aesthetics - Complete Manhattan Med Spa JavaScript
 * Sophisticated interactions with elevated user experience
 */

'use strict';

/**
 * Enhanced Manhattan Header System
 */
class ManhattanHeader {
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
        
        console.log('✨ Manhattan header initialized');
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
            
            // Hide/show header on scroll (with enhanced logic)
            if (currentScroll > lastScroll && currentScroll > 150) {
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
            const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.1
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
 * Ultra-Modern Manhattan Med Spa Preloader
 */
class ManhattanPreloader {
    constructor(options = {}) {
        this.options = {
            minDuration: 2500,       // Extended for sophistication
            maxDuration: 5000,       // Maximum time before force-hiding
            exitDuration: 1500,      // Longer exit animation
            loadingMessages: [
                'Welcome to Evia Aesthetics',
                'Preparing your luxury experience',
                'Loading premium treatments',
                'Almost ready for elegance'
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
    
    init() {
        console.log('✨ Initializing Manhattan preloader');
        
        // Add loading class to body
        document.body.classList.add('loading');
        
        // Start sophisticated progress animation
        this.animateProgress();
        
        // Rotate luxury loading messages
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
    
    animateProgress() {
        const duration = this.options.minDuration;
        const startTime = performance.now();
        
        // Sophisticated easing function
        const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        
        const updateProgress = (timestamp) => {
            if (!this.isLoading) return;
            
            const elapsed = timestamp - startTime;
            const targetProgress = Math.min(elapsed / duration, 0.95);
            
            // Apply sophisticated easing
            this.progress = easeOutExpo(targetProgress) * 95;
            
            // Update DOM with elegant animations
            if (this.progressLine) {
                this.progressLine.style.width = `${this.progress}%`;
            }
            
            if (this.progressPercentage) {
                this.progressPercentage.textContent = `${Math.round(this.progress)}%`;
            }
            
            if (targetProgress < 0.95) {
                this.raf = requestAnimationFrame(updateProgress);
            }
        };
        
        this.raf = requestAnimationFrame(updateProgress);
    }
    
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
            
            // Sophisticated fade transition
            this.loadingMessage.style.opacity = '0';
            this.loadingMessage.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                this.loadingMessage.textContent = loadingMessages[this.currentMessage];
                this.loadingMessage.style.opacity = '0.8';
                this.loadingMessage.style.transform = 'translateY(0)';
            }, 400);
            
        }, 3500);
    }
    
    checkPageLoaded() {
        if (document.readyState === 'complete') {
            const elapsedTime = performance.now() - this.startTime;
            
            // Ensure minimum display time for luxury experience
            if (elapsedTime < this.options.minDuration) {
                setTimeout(() => {
                    this.completePreloader();
                }, this.options.minDuration - elapsedTime);
            } else {
                this.completePreloader();
            }
        } else {
            setTimeout(() => this.checkPageLoaded(), 100);
        }
    }
    
    completePreloader() {
        if (!this.isLoading || !this.preloader) return;
        
        this.isLoading = false;
        
        // Clear animations
        if (this.raf) {
            cancelAnimationFrame(this.raf);
        }
        
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }
        
        // Complete progress with elegance
        if (this.progressLine) {
            this.progressLine.style.width = '100%';
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = '100%';
        }
        
        // Trigger sophisticated exit animation
        setTimeout(() => {
            this.preloader.classList.add('complete');
            
            // Remove preloader with staggered timing
            setTimeout(() => {
                this.preloader.classList.add('hidden');
                document.body.classList.remove('loading');
                
                // Dispatch completion event
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                
                console.log('✨ Manhattan preloader completed elegantly');
            }, this.options.exitDuration);
            
        }, 600);
    }
}

/**
 * Elevated Manhattan Hero Section Controller
 */
class ElevatedManhattanHero {
    constructor() {
        this.hero = document.querySelector('.manhattan-hero-elevated');
        this.typedElement = document.getElementById('typingText');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.navDots = document.querySelectorAll('.side-nav-dot');
        this.primaryBtn = document.getElementById('heroBookBtn');
        this.videoBtn = document.getElementById('heroVideoBtn');
        this.trustNumbers = document.querySelectorAll('.trust-number');
        this.particlesCanvas = document.getElementById('heroParticles');
        this.threeDCanvas = document.getElementById('hero3DCanvas');
        
        this.typed = null;
        this.particleSystem = null;
        this.isAnimating = false;
        this.countersAnimated = false;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        this.isInitialized = true;
        console.log('✨ Elevated Manhattan Hero initialized');
    }
    
    initializeComponents() {
        this.initAOS();
        this.initTypedAnimation();
        this.initGSAPAnimations();
        this.initButtonInteractions();
        this.initScrollEffects();
        this.initCounterAnimations();
        this.initMagneticEffects();
        this.initVideoEffects();
        this.initAdvancedParticles();
        this.init3DElements();
        this.initAccessibility();
    }
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1400,
                easing: 'ease-out-cubic',
                once: true,
                offset: 60,
                delay: 120,
                disable: window.innerWidth < 768
            });
            
            setTimeout(() => {
                AOS.refresh();
            }, 800);
        }
    }
    
    initTypedAnimation() {
        if (!this.typedElement || typeof Typed === 'undefined') {
            console.warn('Typed.js not available or element not found');
            return;
        }
        
        const manhattanMedSpaServices = [
            'Luxury Botox & Premium Dermal Fillers',
            'Manhattan HydraFacial Excellence', 
            'Elite Body Contouring & CoolSculpting',
            'Medical-Grade Skincare Solutions',
            'Anti-Aging & Longevity Medicine',
            'Non-Invasive Aesthetic Procedures',
            'Professional Skin Rejuvenation',
            'Advanced Laser Treatments & IPL Therapy',
            'Precision Micro-needling & PRP',
            'Luxury Wellness & IV Therapy'
        ];
        
        const options = {
            strings: manhattanMedSpaServices,
            typeSpeed: 40,
            backSpeed: 25,
            backDelay: 3000,
            loop: true,
            showCursor: false,
            fadeOut: true,
            fadeOutDelay: 600,
            fadeOutClass: 'typed-fade-out',
            onStringTyped: (arrayPos) => {
                // Enhanced completion effect
                this.typedElement.style.textShadow = '0 0 25px rgba(255, 158, 24, 0.7)';
                this.typedElement.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.typedElement.style.textShadow = '0 2px 4px rgba(255, 158, 24, 0.3)';
                    this.typedElement.style.transform = 'scale(1)';
                }, 1500);
            },
            onBegin: () => {
                this.typedElement.style.opacity = '1';
            }
        };
        
        try {
            this.typed = new Typed(this.typedElement, options);
        } catch (error) {
            console.error('Error initializing Typed.js:', error);
        }
    }
    
    initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;
        
        try {
            gsap.registerPlugin(ScrollTrigger);
            
            // Enhanced parallax for video background
            if (window.innerWidth > 768) {
                gsap.to('.hero-video-bg', {
                    scale: 1.2,
                    scrollTrigger: {
                        trigger: this.hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                });
            }
            
            // Sophisticated content fade
            gsap.to('.hero-content', {
                y: 80,
                opacity: 0.4,
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });
            
            // Enhanced staggered animation for feature cards
            gsap.fromTo('.feature-card', 
                {
                    y: 50,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    stagger: 0.3,
                    ease: 'power3.out',
                    delay: 2
                }
            );
            
            // Floating elements animation
            gsap.to('.float-element', {
                y: -30,
                rotation: 360,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 1
            });
            
        } catch (error) {
            console.error('Error initializing GSAP:', error);
        }
    }
    
    initButtonInteractions() {
        // Enhanced primary CTA button
        if (this.primaryBtn) {
            this.primaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAppointmentModal();
                this.trackEvent('hero_cta_clicked', { type: 'primary', text: 'Book Your Consultation' });
            });
            
            this.addAdvancedButtonEffects(this.primaryBtn);
        }
        
        // Enhanced video button
        if (this.videoBtn) {
            this.videoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openVideoModal();
                this.trackEvent('hero_video_clicked', { type: 'secondary', text: 'Watch Our Story' });
            });
            
            this.addAdvancedButtonEffects(this.videoBtn);
        }
        
        // Header and mobile CTAs
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
    
    openAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Enhanced focus management
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 400);
            
            // Sophisticated modal opening animation
            const modalContainer = modal.querySelector('.modal-container');
            if (modalContainer) {
                modalContainer.style.transform = 'scale(0.7) translateY(50px)';
                modalContainer.style.opacity = '0';
                
                setTimeout(() => {
                    modalContainer.style.transform = 'scale(1) translateY(0)';
                    modalContainer.style.opacity = '1';
                }, 100);
            }
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
    
    addAdvancedButtonEffects(button) {
        if (!button) return;
        
        // Sophisticated ripple effect
        button.addEventListener('click', (e) => {
            this.createAdvancedRippleEffect(e, button);
        });
        
        // Enhanced particle effect on hover
        button.addEventListener('mouseenter', () => {
            this.createEnhancedParticleEffect(button);
        });
        
        // Magnetic attraction effect
        if (window.innerWidth > 768) {
            button.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, button);
            });
        }
        
        // Reset effects
        button.addEventListener('mouseleave', () => {
            this.resetButtonEffects(button);
        });
        
        // Enhanced keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.createAdvancedRippleEffect(e, button);
                button.click();
            }
        });
    }
    
    createAdvancedRippleEffect(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'advanced-button-ripple';
        
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
            animation: advancedRipple 0.8s ease-out;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    createEnhancedParticleEffect(button) {
        const particles = button.querySelectorAll('.btn-particles span');
        if (particles.length > 0) {
            particles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.style.animation = 'btnParticle 1.5s ease-out';
                    particle.style.background = `rgba(255, 158, 24, ${0.8 - index * 0.1})`;
                }, index * 100);
            });
        }
    }
    
    createMagneticEffect(event, button) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        const magnetStrength = 0.15;
        const magnetX = x * magnetStrength;
        const magnetY = y * magnetStrength;
        
        button.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
    }
    
    resetButtonEffects(button) {
        button.style.transform = 'translate(0, 0)';
        
        const particles = button.querySelectorAll('.btn-particles span');
        particles.forEach(particle => {
            particle.style.animation = '';
            particle.style.background = '';
        });
    }
    
    initScrollEffects() {
        // Enhanced scroll indicator
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
        
        // Enhanced side navigation
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavDotClick(index);
            });
            
            // Add hover tooltip effect
            dot.addEventListener('mouseenter', () => {
                const tooltip = dot.getAttribute('data-tooltip');
                if (tooltip) {
                    this.showTooltip(dot, tooltip);
                }
            });
            
            dot.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
        
        this.updateActiveDot();
        this.initScrollIndicatorVisibility();
    }
    
    handleNavDotClick(index) {
        const sections = ['hero', 'about', 'services', 'results', 'contact'];
        const targetSection = document.getElementById(sections[index]);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 0;
            let targetPosition;
            
            if (sections[index] === 'hero') {
                targetPosition = 0;
            } else {
                targetPosition = targetSection.offsetTop - headerHeight - 30;
            }
            
            this.smoothScrollTo(targetPosition);
        }
    }
    
    smoothScrollTo(position) {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    }
    
    showTooltip(element, text) {
        const existingTooltip = document.querySelector('.nav-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'nav-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(68, 44, 21, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
            transition: opacity 0.3s ease;
        `;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 10 + 'px';
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 50);
    }
    
    hideTooltip() {
        const tooltip = document.querySelector('.nav-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }
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
    
    initScrollIndicatorVisibility() {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const scrollIndicatorWrapper = document.querySelector('.scroll-indicator-wrapper');
            
            if (scrollIndicatorWrapper) {
                if (scrollY > 150) {
                    scrollIndicatorWrapper.style.opacity = '0';
                    scrollIndicatorWrapper.style.transform = 'translateX(-50%) translateY(30px)';
                } else {
                    scrollIndicatorWrapper.style.opacity = '1';
                    scrollIndicatorWrapper.style.transform = 'translateX(-50%) translateY(0)';
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    initCounterAnimations() {
        if (!this.trustNumbers.length) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 80; // Smoother animation
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    // Enhanced completion effect
                    counter.style.transform = 'scale(1.15)';
                    counter.style.textShadow = '0 0 30px rgba(255, 158, 24, 0.6)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.textShadow = '0 3px 6px rgba(255, 158, 24, 0.3)';
                    }, 300);
                }
            };
            
            updateCounter();
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated) {
                    this.countersAnimated = true;
                    
                    // Staggered counter animations
                    this.trustNumbers.forEach((counter, index) => {
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 300);
                    });
                    
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.6 });
        
        const trustIndicators = document.querySelector('.trust-indicators-container');
        if (trustIndicators) {
            counterObserver.observe(trustIndicators);
        }
    }
    
    initMagneticEffects() {
        if (window.innerWidth < 992) return;
        
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const strength = parseInt(element.dataset.strength) || 10;
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const magnetX = x * (strength / 250);
                const magnetY = y * (strength / 250);
                
                element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    initVideoEffects() {
        const video = document.querySelector('.hero-video-bg');
        if (!video) return;
        
        video.addEventListener('loadeddata', () => {
            if (video.paused) {
                video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            }
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            // Enhanced fallback background
            this.hero.style.background = 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 50%, #FFF8F0 100%)';
        });
        
        video.addEventListener('loadstart', () => {
            video.playbackRate = 1.0;
        });
    }
    
    initAdvancedParticles() {
        if (!this.particlesCanvas || window.innerWidth < 768) return;
        
        const canvas = this.particlesCanvas;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const createAdvancedParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 25000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    opacity: Math.random() * 0.6 + 0.2,
                    hue: Math.random() * 30 + 30 // Golden hues
                });
            }
        };
        
        const animateAdvancedParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Boundary wrapping
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = canvas.height;
                
                // Dynamic opacity based on mouse proximity
                const mouseX = window.mouseX || canvas.width / 2;
                const mouseY = window.mouseY || canvas.height / 2;
                const distance = Math.sqrt(
                    Math.pow(particle.x - mouseX, 2) + Math.pow(particle.y - mouseY, 2)
                );
                const maxDistance = 150;
                const proximityOpacity = distance < maxDistance ? 
                    (1 - distance / maxDistance) * 0.8 : particle.opacity;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${proximityOpacity})`;
                ctx.fill();
                
                // Connect nearby particles
                particles.slice(index + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `hsla(45, 70%, 60%, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animateAdvancedParticles);
        };
        
        // Mouse tracking for particle interaction
        window.addEventListener('mousemove', (e) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
        });
        
        resizeCanvas();
        createAdvancedParticles();
        animateAdvancedParticles();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            createAdvancedParticles();
        });
        
        this.particleSystem = {
            cleanup: () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        };
    }
    
    init3DElements() {
        if (!this.threeDCanvas || typeof THREE === 'undefined' || window.innerWidth < 992) return;
        
        try {
            // Create 3D scene for background elements
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: this.threeDCanvas, alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0); // Transparent background
            
            // Create floating geometric elements
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xff9e18, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.1 
            });
            
            const elements = [];
            for (let i = 0; i < 5; i++) {
                const element = new THREE.Mesh(geometry, material);
                element.position.x = (Math.random() - 0.5) * 20;
                element.position.y = (Math.random() - 0.5) * 20;
                element.position.z = (Math.random() - 0.5) * 20;
                element.rotation.x = Math.random() * Math.PI;
                element.rotation.y = Math.random() * Math.PI;
                scene.add(element);
                elements.push(element);
            }
            
            camera.position.z = 10;
            
            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                
                elements.forEach((element, index) => {
                    element.rotation.x += 0.005 * (index + 1);
                    element.rotation.y += 0.003 * (index + 1);
                    element.position.y = Math.sin(Date.now() * 0.001 + index) * 2;
                });
                
                renderer.render(scene, camera);
            };
            
            animate();
            
            // Handle resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
            
        } catch (error) {
            console.log('3D elements not initialized:', error);
        }
    }
    
    initAccessibility() {
        // Enhanced ARIA labels
        const buttons = this.hero.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
                const text = button.querySelector('.btn-text')?.textContent || button.textContent;
                if (text) {
                    button.setAttribute('aria-label', text.trim());
                }
            }
        });
        
        // Enhanced reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                .manhattan-hero-elevated *, 
                .manhattan-hero-elevated *::before, 
                .manhattan-hero-elevated *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                .float-element,
                .hero-particles-advanced {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Enhanced focus management
        this.initFocusManagement();
    }
    
    initFocusManagement() {
        const focusableElements = this.hero.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '3px solid rgba(255, 158, 24, 0.7)';
                element.style.outlineOffset = '3px';
                element.style.borderRadius = '8px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
    
    trackEvent(eventName, eventData = {}) {
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
    }
    
    destroy() {
        // Enhanced cleanup
        if (this.typed) {
            this.typed.destroy();
            this.typed = null;
        }
        
        if (this.particleSystem) {
            this.particleSystem.cleanup();
        }
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
        
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('*');
        }
        
        console.log('Elevated Hero section destroyed');
    }
    
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
 * Enhanced Doctor Section Controller
 */
class EnhancedDoctorSection {
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
        this.initAdvancedHoverEffects();
        this.initStatCounters();
        this.initMagneticEffects();
        this.initParallaxEffects();
        
        console.log('✨ Enhanced doctor section initialized');
    }
    
    initScrollAnimations() {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    this.isVisible = true;
                    this.triggerEntranceAnimations();
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '0px 0px -150px 0px'
        });
        
        if (this.section) {
            sectionObserver.observe(this.section);
        }
        
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
                    
                    // Add staggered animation effect
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -80px 0px'
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
        // Enhanced doctor photo entrance
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer) {
            setTimeout(() => {
                imageContainer.style.transform = 'translateY(0)';
                imageContainer.style.opacity = '1';
            }, 300);
        }
        
        // Enhanced credentials badge
        const credentialsBadge = document.querySelector('.credentials-badge');
        if (credentialsBadge) {
            setTimeout(() => {
                credentialsBadge.style.transform = 'translateY(0) scale(1)';
                credentialsBadge.style.opacity = '1';
            }, 800);
        }
        
        // Enhanced awards animation
        const awardItems = document.querySelectorAll('.award-item');
        awardItems.forEach((award, index) => {
            setTimeout(() => {
                award.style.transform = 'translateY(0) scale(1)';
                award.style.opacity = '1';
            }, 1000 + (index * 300));
        });
    }
    
    initButtonInteractions() {
        if (this.bookWithDoctorBtn) {
            this.bookWithDoctorBtn.addEventListener('click', () => {
                this.openAppointmentModal();
                
                this.trackEvent('doctor_booking_clicked', {
                    doctor: 'Dr. Evia Alikaj Nano',
                    section: 'about'
                });
            });
            
            this.addAdvancedButtonEffects(this.bookWithDoctorBtn);
        }
        
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
            
            setTimeout(() => {
                const doctorSelect = modal.querySelector('select[name="doctor"]');
                if (doctorSelect) {
                    doctorSelect.value = 'dr-nano';
                }
                
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 400);
        }
    }
    
    scrollToServices() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const headerHeight = document.querySelector('.luxury-header')?.offsetHeight || 0;
            const targetPosition = servicesSection.offsetTop - headerHeight - 30;
            
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
            ripple.className = 'enhanced-ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.8;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: enhancedRipple 1s ease-out;
                z-index: 1;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', () => {
            this.createAdvancedHoverParticles(button);
        });
    }
    
    createAdvancedHoverParticles(button) {
        const particles = button.querySelectorAll('.btn-particles span');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'btnParticle 1.5s ease-out';
                particle.style.background = `hsla(${30 + index * 10}, 70%, 60%, 0.8)`;
            }, index * 80);
        });
        
        setTimeout(() => {
            particles.forEach(particle => {
                particle.style.animation = '';
                particle.style.background = '';
            });
        }, 1500);
    }
    
    initAdvancedHoverEffects() {
        // Enhanced expertise items effects
        this.expertiseItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-12px) scale(1.03)';
                
                // Create ripple effect on icon
                const icon = item.querySelector('.expertise-icon');
                if (icon) {
                    this.createIconRipple(icon);
                }
                
                // Enhanced neighboring items effect
                const neighbors = this.getNeighboringItems(item, index);
                neighbors.forEach((neighbor, i) => {
                    setTimeout(() => {
                        neighbor.style.transform = 'translateY(-4px) scale(1.01)';
                    }, i * 80);
                });
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                
                const neighbors = this.getNeighboringItems(item, index);
                neighbors.forEach(neighbor => {
                    neighbor.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
        
        // Enhanced credential items effects
        this.credentialItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.03)';
                
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.textShadow = '0 0 15px rgba(255, 158, 24, 0.8)';
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.textShadow = '';
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
        
        // Enhanced doctor photo effects
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer) {
            imageContainer.addEventListener('mouseenter', () => {
                this.createAdvancedPhotoEffect();
            });
        }
    }
    
    createIconRipple(icon) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: iconRipple 0.8s ease-out;
            pointer-events: none;
        `;
        
        icon.style.position = 'relative';
        icon.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    createAdvancedPhotoEffect() {
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;
        
        // Create sophisticated floating elements
        for (let i = 0; i < 8; i++) {
            const element = document.createElement('div');
            element.className = 'photo-hover-element';
            
            const size = Math.random() * 12 + 6;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 2;
            
            element.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: hsla(${30 + Math.random() * 30}, 70%, 60%, 0.6);
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                pointer-events: none;
                animation: advancedFloatParticle 4s ease-out forwards;
                animation-delay: ${delay}s;
                z-index: 15;
            `;
            
            imageContainer.appendChild(element);
            
            setTimeout(() => element.remove(), 4000 + delay * 1000);
        }
    }
    
    getNeighboringItems(currentItem, currentIndex) {
        const neighbors = [];
        const totalItems = this.expertiseItems.length;
        
        if (currentIndex > 0) neighbors.push(this.expertiseItems[currentIndex - 1]);
        if (currentIndex < totalItems - 1) neighbors.push(this.expertiseItems[currentIndex + 1]);
        
        return neighbors.filter(item => item && item !== currentItem);
    }
    
    initStatCounters() {
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
                    
                    // Enhanced completion effect
                    counter.style.transform = 'scale(1.2)';
                    counter.style.textShadow = '0 0 30px rgba(255, 158, 24, 0.8)';
                    
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                        counter.style.textShadow = '0 3px 6px rgba(255, 158, 24, 0.3)';
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
                        }, index * 400);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.6 });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    initMagneticEffects() {
        if (window.innerWidth < 992) return;
        
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const strength = parseInt(element.dataset.strength) || 15;
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const magnetX = x * (strength / 250);
                const magnetY = y * (strength / 250);
                
                element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    initParallaxEffects() {
        if (window.innerWidth < 768) return;
        
        const parallaxElements = [
            { element: '.credentials-badge', speed: 0.4 },
            { element: '.award-item', speed: 0.6 },
            { element: '.floating-accent', speed: 0.3 }
        ];
        
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const sectionTop = this.section?.offsetTop || 0;
            const sectionHeight = this.section?.offsetHeight || 0;
            
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
        console.log('Event tracked:', eventName, eventData);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter: eventData
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                event_name: eventName,
                ...eventData
            });
        }
    }
    
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        
        this.statNumbers.forEach(counter => {
            counter.style.animation = '';
        });
    }
}

/**
 * Enhanced Modal System
 */
class EnhancedModalSystem {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        this.initAppointmentModal();
        this.initVideoModal();
        this.initEnhancedFormValidation();
        this.initKeyboardNavigation();
        
        console.log('✨ Enhanced modal system initialized');
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
        
        // Enhanced form submission
        const form = this.appointmentModal.querySelector('#appointmentForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEnhancedFormSubmission(form);
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
        
        // Enhanced focus return
        const lastFocused = document.activeElement;
        if (lastFocused && lastFocused !== document.body) {
            lastFocused.blur();
        }
    }
    
    initEnhancedFormValidation() {
        const inputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');
        
        inputs.forEach(input => {
            // Enhanced focus effects
            input.addEventListener('focus', () => {
                const group = input.closest('.form-group');
                group?.classList.add('focused');
                this.clearFieldError(input);
                
                // Add sophisticated focus animation
                input.style.boxShadow = '0 0 25px rgba(255, 158, 24, 0.3)';
            });
            
            input.addEventListener('blur', () => {
                const group = input.closest('.form-group');
                group?.classList.remove('focused');
                this.validateField(input);
                
                input.style.boxShadow = '';
            });
            
            // Real-time validation with debouncing
            let validationTimeout;
            input.addEventListener('input', () => {
                clearTimeout(validationTimeout);
                validationTimeout = setTimeout(() => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                }, 500);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = field.checkValidity() && value !== '';
        
        // Enhanced validation rules
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            isValid = phoneRegex.test(value.replace(/[^\d\+]/g, ''));
        }
        
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
    
    handleEnhancedFormSubmission(form) {
        if (!this.validateForm(form)) {
            this.showEnhancedFormError('Please fill in all required fields correctly.');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn?.innerHTML;
        
        // Enhanced loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <span class="btn-text">Sending Request...</span>
                </div>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #888 0%, #666 100%)';
        }
        
        // Enhanced form submission simulation
        setTimeout(() => {
            this.showEnhancedSuccessMessage(form);
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
            }, 4000);
        }, 3000);
    }
    
    showEnhancedFormError(message) {
        // Create sophisticated error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'enhanced-form-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            font-family: 'Inter', sans-serif;
            font-size: 0.9375rem;
            font-weight: 500;
            box-shadow: 0 15px 40px rgba(239, 68, 68, 0.4);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%) scale(0.8);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 350px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-exclamation" style="font-size: 12px;"></i>
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
        }, 5000);
    }
    
    showEnhancedSuccessMessage(form) {
        form.innerHTML = `
            <div class="enhanced-success-message" style="text-align: center; padding: 60px 30px;">
                <div class="success-animation" style="margin-bottom: 40px;">
                    <div class="success-icon" style="
                        width: 100px; 
                        height: 100px; 
                        margin: 0 auto 30px; 
                        background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: white; 
                        font-size: 2.5rem;
                        animation: enhancedSuccessPulse 0.8s ease-out;
                        box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
                    ">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                <h3 style="
                    color: #442C15; 
                    margin-bottom: 20px; 
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 600;
                ">Thank You!</h3>
                <p style="
                    color: #6D6D6D; 
                    line-height: 1.7;
                    font-family: 'Inter', sans-serif;
                    font-size: 1.125rem;
                    margin-bottom: 25px;
                ">Your consultation request has been received. Our team will contact you within 24 hours to schedule your appointment at our Manhattan location.</p>
                <div style="
                    font-size: 0.9375rem;
                    color: #9F9F9F;
                    font-style: italic;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                ">
                    <div style="width: 8px; height: 8px; background: #FF9E18; border-radius: 50%; animation: pulse 2s infinite;"></div>
                    This window will close automatically...
                </div>
            </div>
        `;
        
        // Add enhanced success animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes enhancedSuccessPulse {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Enhanced escape key handling
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modern-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
            
            // Enhanced tab navigation within modals
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.modern-modal.active');
                if (activeModal) {
                    this.handleTabNavigation(e, activeModal);
                }
            }
        });
    }
    
    handleTabNavigation(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
}

/**
 * Main Application Controller
 */
class EviaApplication {
    constructor() {
        this.isLoading = true;
        this.scrolled = false;
        this.mobileMenuOpen = false;
        this.modalOpen = false;
        this.raf = null;
        this.scrollY = window.scrollY;
        this.resizeTimer = null;
        
        // Component instances
        this.preloader = null;
        this.heroSection = null;
        this.header = null;
        this.modals = null;
        this.doctorSection = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }
    
    initApp() {
        try {
            console.log('🌿 Initializing Manhattan Evia Aesthetics application...');
            
            this.detectCapabilities();
            this.initPreloader();
            this.header = new ManhattanHeader();
            this.modals = new EnhancedModalSystem();
            this.addDynamicStyles();
            this.bindEvents();
            
            console.log('✅ Manhattan application initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    initPreloader() {
        this.preloader = new ManhattanPreloader({
            minDuration: 2800,
            exitDuration: 1500,
            loadingMessages: [
                'Welcome to Manhattan\'s Premier Med Spa',
                'Preparing your luxury experience',
                'Loading premium treatments',
                'Almost ready for elegance'
            ]
        });
        
        window.addEventListener('preloaderComplete', () => {
            this.onPreloaderComplete();
        });
    }
    
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize enhanced hero section
        this.heroSection = new ElevatedManhattanHero();
        
        // Initialize enhanced doctor section
        setTimeout(() => {
            this.doctorSection = new EnhancedDoctorSection();
        }, 1200);
        
        // Initialize enhanced AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: this.prefersReducedMotion ? 0 : 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 60,
                delay: this.prefersReducedMotion ? 0 : 150,
                disable: this.isLowEndDevice
            });
        }
        
        this.handleScroll();
    }
    
    detectCapabilities() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isLowEndDevice = navigator.hardwareConcurrency <= 4;
        
        if (this.isTouch) document.body.classList.add('touch-device');
        if (this.prefersReducedMotion) document.body.classList.add('reduced-motion');
        if (this.isLowEndDevice) document.body.classList.add('low-end-device');
        
        if (this.isLowEndDevice) {
            console.log('Low-end device detected, optimizing for performance');
        }
    }
    
    handleScroll() {
        const shouldBeScrolled = this.scrollY > 50;
        
        if (this.scrolled !== shouldBeScrolled) {
            this.scrolled = shouldBeScrolled;
        }
    }
    
    handleInitError() {
        document.body.classList.remove('loading');
        const preloader = document.getElementById('eviaPreloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
    
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes advancedRipple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            @keyframes enhancedRipple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            @keyframes iconRipple {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
            }
            
            @keyframes advancedFloatParticle {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-40px) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-80px) scale(0);
                    opacity: 0;
                }
            }
            
            .animate-reveal {
                animation: enhancedReveal 1s ease-out forwards;
            }
            
            @keyframes enhancedReveal {
                from {
                    opacity: 0;
                    transform: translateY(40px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .enhanced-hover-glow {
                box-shadow: 0 0 30px rgba(255, 158, 24, 0.4);
                transform: translateY(-8px) scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
                
                if (this.heroSection && typeof this.heroSection.refresh === 'function') {
                    this.heroSection.refresh();
                }
            }, 300);
        });
        
        document.addEventListener('visibilitychange', () => {
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
    const eviaApp = new EviaApplication();
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
            const targetPosition = target.offsetTop - headerHeight - 30;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};
