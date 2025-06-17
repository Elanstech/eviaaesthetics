/**
 * Evia Aesthetics - Enhanced JavaScript
 * Professional medical spa with modern interactive elements
 */

'use strict';

/**
 * Enhanced Evia Preloader (KEEPING YOUR DESIGN)
 * Handles loading animation and elegant transition to main content
 */
class EviaEnhancedPreloader {
    constructor(options = {}) {
        // Default options
        this.options = {
            minDuration: 2000,       // Minimum display time
            maxDuration: 5000,       // Maximum time before force-hiding
            exitDuration: 1200,      // Exit animation duration
            loadingMessages: [
                'Welcome to Evia Aesthetics',
                'Preparing your experience',
                'Loading premium treatments',
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
        }
    }
    
    init() {
        console.log('✨ Initializing enhanced preloader');
        
        // Add loading class to body
        document.body.classList.add('loading');
        
        // Start progress animation
        this.animateProgress();
        
        // Rotate loading messages
        this.rotateMessages();
        
        // Check page load status
        this.checkPageLoaded();
        
        // Fallback timer
        setTimeout(() => {
            if (this.isLoading) {
                console.log('Preloader fallback triggered');
                this.completePreloader();
            }
        }, this.options.maxDuration);
    }
    
    animateProgress() {
        const duration = this.options.minDuration;
        const startTime = performance.now();
        
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        
        const updateProgress = (timestamp) => {
            if (!this.isLoading) return;
            
            const elapsed = timestamp - startTime;
            const targetProgress = Math.min(elapsed / duration, 0.9);
            
            this.progress = easeOutCubic(targetProgress) * 90;
            
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
            
            this.loadingMessage.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingMessage.textContent = loadingMessages[this.currentMessage];
                this.loadingMessage.style.opacity = '0.8';
            }, 300);
            
        }, 3000);
    }
    
    checkPageLoaded() {
        if (document.readyState === 'complete') {
            const elapsedTime = performance.now() - this.startTime;
            
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
        
        // Finish progress to 100%
        if (this.progressLine) {
            this.progressLine.style.width = '100%';
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = '100%';
        }
        
        // Trigger sliding panel animation
        setTimeout(() => {
            this.preloader.classList.add('complete');
            
            setTimeout(() => {
                this.preloader.classList.add('hidden');
                document.body.classList.remove('loading');
                
                // Dispatch completion event
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                
                console.log('✨ Enhanced preloader complete');
            }, this.options.exitDuration);
            
        }, 400);
    }
}

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
 * Enhanced Hero Section with Modern Interactions
 */
class EnhancedHero {
    constructor() {
        this.hero = document.querySelector('.manhattan-hero-enhanced');
        this.typedElement = document.getElementById('typingText');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.navDots = document.querySelectorAll('.side-nav-dot');
        this.primaryBtn = document.getElementById('heroBookBtn');
        this.videoBtn = document.getElementById('heroVideoBtn');
        
        this.typed = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.initAOS();
        this.initTypedAnimation();
        this.initGSAPAnimations();
        this.initInteractions();
        this.initScrollEffects();
        this.initParticleSystem();
        this.initCounterAnimations();
        this.initTiltEffects();
        
        console.log('✨ Enhanced hero initialized');
    }
    
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
        }
    }
    
    initTypedAnimation() {
        if (!this.typedElement || typeof Typed === 'undefined') return;
        
        const options = {
            strings: [
                'Advanced Botox & Fillers',
                'Luxury Facial Treatments',
                'Body Contouring & Sculpting',
                'Medical-Grade Skincare',
                'Longevity & Wellness Medicine',
                'Non-Invasive Procedures',
                'Skin Rejuvenation Therapy'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2500,
            loop: true,
            showCursor: false,
            fadeOut: true,
            fadeOutDelay: 500,
            fadeOutClass: 'typed-fade-out'
        };
        
        this.typed = new Typed(this.typedElement, options);
    }
    
    initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Floating elements animation
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            
            gsap.to(element, {
                y: 'random(-30, 30)',
                x: 'random(-20, 20)',
                rotation: 'random(-5, 5)',
                duration: 'random(15, 25)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 2
            });
        });
        
        // Scroll-triggered animations
        gsap.to('.hero-content', {
            y: 100,
            opacity: 0.3,
            scrollTrigger: {
                trigger: this.hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
                pin: false
            }
        });
        
        // Video background parallax
        if (window.innerWidth > 768) {
            gsap.to('.hero-video-bg', {
                scale: 1.3,
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }
    
    initInteractions() {
        // Primary CTA button
        if (this.primaryBtn) {
            this.primaryBtn.addEventListener('click', () => {
                const modal = document.getElementById('appointmentModal');
                modal?.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            this.addAdvancedButtonEffects(this.primaryBtn);
        }
        
        // Video button
        if (this.videoBtn) {
            this.videoBtn.addEventListener('click', () => {
                const modal = document.getElementById('videoModal');
                if (modal) {
                    modal.classList.add('active');
                    const iframe = modal.querySelector('iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
                    }
                }
            });
            
            this.addAdvancedButtonEffects(this.videoBtn);
        }
        
        // Header CTA buttons
        const headerCTA = document.querySelector('.header-cta');
        const mobileCTA = document.querySelector('.mobile-cta');
        
        [headerCTA, mobileCTA].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const modal = document.getElementById('appointmentModal');
                    modal?.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
        });
    }
    
    addAdvancedButtonEffects(button) {
        if (!button) return;
        
        // Ripple effect on click
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'button-ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Particle effect on hover
        button.addEventListener('mouseenter', () => {
            const particles = button.querySelectorAll('.btn-particles span');
            particles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.style.animation = 'btnParticle 1s ease-out';
                }, index * 100);
            });
        });
    }
    
    initScrollEffects() {
        // Scroll indicator
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const nextSection = this.hero?.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
        
        // Side navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const sections = ['hero', 'services', 'about', 'results', 'contact'];
                const targetSection = document.getElementById(sections[index]);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Update active dot on scroll
        this.updateActiveDot();
    }
    
    updateActiveDot() {
        const sections = ['hero', 'services', 'about', 'results', 'contact'];
        
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const index = sections.indexOf(id);
                    
                    if (index !== -1) {
                        this.navDots.forEach(dot => dot.classList.remove('active'));
                        if (this.navDots[index]) {
                            this.navDots[index].classList.add('active');
                        }
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
    
    initParticleSystem() {
        const canvas = document.getElementById('heroParticles');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let mouse = { x: 0, y: 0 };
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        
        const createParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 1,
                    speedY: (Math.random() - 0.5) * 1,
                    opacity: Math.random() * 0.8 + 0.2,
                    color: Math.random() > 0.5 ? 'rgba(255, 158, 24, ' : 'rgba(255, 255, 255, '
                });
            }
        };
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Move particles
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Mouse interaction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x -= dx * force * 0.02;
                    particle.y -= dy * force * 0.02;
                }
                
                // Boundary wrapping
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = canvas.height;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + particle.opacity + ')';
                ctx.fill();
                
                // Connect nearby particles
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(255, 158, 24, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animateParticles);
        };
        
        // Mouse tracking
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        resizeCanvas();
        createParticles();
        animateParticles();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }
    
    initCounterAnimations() {
        const counters = document.querySelectorAll('.trust-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        // Intersection Observer for counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    initTiltEffects() {
        if (typeof VanillaTilt !== 'undefined') {
            const tiltElements = document.querySelectorAll('[data-tilt]');
            VanillaTilt.init(tiltElements, {
                max: 15,
                speed: 1000,
                glare: true,
                'max-glare': 0.2,
                perspective: 1000,
                scale: 1.02
            });
        }
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
    }
    
    initFormValidation() {
        const inputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');
        
        inputs.forEach(input => {
            // Focus effects
            input.addEventListener('focus', () => {
                const group = input.closest('.form-group');
                group?.classList.add('focused');
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
        const originalText = submitBtn?.innerHTML;
        
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span class="btn-text">Sending...</span>
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
    
    showFormError(message) {
        // Implementation for showing error messages
        console.error('Form error:', message);
    }
    
    showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 40px;">
                <div class="success-icon" style="width: 80px; height: 80px; margin: 0 auto 20px; background: var(--luxury-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="color: var(--evia-brown); margin-bottom: 15px; font-family: var(--font-display);">Thank You!</h3>
                <p style="color: var(--text-secondary); line-height: 1.6;">Your appointment request has been received. We'll contact you shortly to confirm your consultation.</p>
            </div>
        `;
    }
}

/**
 * Enhanced Interactive Elements
 */
class EnhancedInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.initSmoothScrolling();
        this.initRippleEffects();
        this.initParallaxElements();
        this.initKeyboardNavigation();
        
        console.log('✨ Enhanced interactions initialized');
    }
    
    initSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const header = document.querySelector('.luxury-header');
                    const headerHeight = header?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    initRippleEffects() {
        const rippleElements = document.querySelectorAll('.modern-btn, .action-btn, .social-link');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }
    
    createRipple(e, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    initParallaxElements() {
        if (window.innerWidth < 768) return; // Skip on mobile
        
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrolled;
                const elementHeight = rect.height;
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const parallaxValue = (scrolled - elementTop) * speed;
                    element.style.transform = `translateY(${parallaxValue}px)`;
                }
            });
        };
        
        window.addEventListener('scroll', updateParallax, { passive: true });
    }
    
    initKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Close modals with Escape
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modern-modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                const searchOverlay = document.querySelector('.search-overlay.active');
                if (searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            }
        });
    }
}

/**
 * Main Application Class
 */
class EviaEnhancedApp {
    constructor() {
        this.isLoading = true;
        this.components = {};
        
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
            console.log('🌿 Initializing Enhanced Evia Aesthetics...');
            
            // Initialize preloader first
            this.components.preloader = new EviaEnhancedPreloader();
            
            // Listen for preloader completion
            window.addEventListener('preloaderComplete', () => {
                this.onPreloaderComplete();
            });
            
            // Initialize non-blocking components
            this.initializeComponents();
            
            console.log('✅ Enhanced application initialized');
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
    }
    
    initializeComponents() {
        // Initialize header
        this.components.header = new EnhancedHeader();
        
        // Initialize modals
        this.components.modals = new EnhancedModals();
        
        // Initialize interactions
        this.components.interactions = new EnhancedInteractions();
        
        // Add CSS for dynamic animations
        this.addDynamicStyles();
    }
    
    onPreloaderComplete() {
        this.isLoading = false;
        
        // Initialize hero section after preloader
        this.components.hero = new EnhancedHero();
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true,
                offset: 50,
                delay: 100,
                disable: window.innerWidth < 768
            });
        }
        
        // Initialize any scroll-dependent features
        this.initScrollFeatures();
    }
    
    initScrollFeatures() {
        // Add any features that depend on scroll
        const sections = document.querySelectorAll('section');
        
        const revealSections = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            revealSections.observe(section);
        });
    }
    
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
            
            .form-group.focused input,
            .form-group.focused select,
            .form-group.focused textarea {
                border-color: var(--evia-orange);
                box-shadow: 0 0 20px rgba(255, 158, 24, 0.2);
            }
            
            .form-group.valid input,
            .form-group.valid select,
            .form-group.valid textarea {
                border-color: var(--success);
            }
            
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: var(--error);
            }
            
            section {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease-out;
            }
            
            section.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            
            .typed-fade-out {
                opacity: 0;
                transition: opacity 0.5s;
            }
        `;
        document.head.appendChild(style);
    }
    
    handleInitError() {
        // Graceful degradation
        document.body.classList.remove('loading');
        const preloader = document.getElementById('eviaPreloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        
        console.warn('⚠️ Application initialized with limited functionality');
    }
}

// Initialize the enhanced application
document.addEventListener('DOMContentLoaded', () => {
    const app = new EviaEnhancedApp();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaEnhancedApp;
}
