/**
 * Evia Aesthetics - Main JavaScript
 * Optimized for performance, smooth animations, and responsive behavior
 */

'use strict';

// Main application class
class EviaApp {
    constructor() {
        // State properties
        this.isLoading = true;
        this.videoLoaded = false;
        this.mobileMenuOpen = false;
        this.modalOpen = false;
        this.scrolled = false;
        this.raf = null; // Store requestAnimationFrame for cancellation
        this.scrollY = window.scrollY;
        this.resizeTimer = null;
        
        // DOM elements cached for performance
        this.preloader = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.loadingText = document.getElementById('loadingText');
        this.header = document.getElementById('header');
        this.heroVideo = document.getElementById('heroVideo');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.appointmentModal = document.getElementById('appointmentModal');
        this.menuToggle = document.getElementById('menuToggle');
        this.menuClose = document.getElementById('menuClose');
        this.modalClose = document.getElementById('modalClose');
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.heroSection = document.querySelector('.hero');
        
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
            
            // Initialize components
            this.initPreloader();
            this.initHeaderScroll();
            this.initParallaxVideo();
            this.initMobileMenu();
            this.initDropdowns();
            this.initModal();
            this.initScrollAnimations();
            this.initFormValidation();
            this.initScrollToElements();
            
            // Bind event listeners
            this.bindEvents();
            
            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitError();
        }
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
     * Initialize preloader with optimized loading simulation
     */
    initPreloader() {
        if (!this.preloader || !this.progressFill) return;
        
        const loadingSteps = [
            { progress: 15, text: 'Initializing experience...' },
            { progress: 35, text: 'Loading assets...' },
            { progress: 55, text: 'Preparing interface...' },
            { progress: 75, text: 'Optimizing content...' },
            { progress: 90, text: 'Finalizing details...' },
            { progress: 100, text: 'Welcome to Evia Aesthetics!' }
        ];
        
        let currentStep = 0;
        let startTime = performance.now();
        const totalDuration = 2000; // 2 seconds total loading time
        
        // Check if page is actually loaded
        const checkPageLoad = () => {
            if (document.readyState === 'complete') {
                if (currentStep < loadingSteps.length - 1) {
                    // Skip to last step if page is already loaded
                    currentStep = loadingSteps.length - 1;
                    updateProgress(loadingSteps[currentStep]);
                    setTimeout(() => this.hidePreloader(), 500);
                }
            }
        };
        
        // Update progress based on step
        const updateProgress = (step) => {
            this.progressFill.style.width = step.progress + '%';
            
            if (this.loadingText) {
                this.loadingText.textContent = step.text;
            }
        };
        
        // Use requestAnimationFrame for smoother progress animation
        const animateProgress = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            
            // Calculate current step based on progress
            const stepIndex = Math.min(
                Math.floor(progress * loadingSteps.length),
                loadingSteps.length - 1
            );
            
            if (stepIndex > currentStep) {
                currentStep = stepIndex;
                updateProgress(loadingSteps[currentStep]);
            }
            
            if (progress < 1) {
                this.raf = requestAnimationFrame(animateProgress);
            } else {
                setTimeout(() => this.hidePreloader(), 500);
            }
            
            // Check if page is actually loaded
            checkPageLoad();
        };
        
        // Start animation
        this.raf = requestAnimationFrame(animateProgress);
        
        // Fallback timer in case animation fails
        setTimeout(() => {
            if (this.isLoading) {
                console.log('Preloader fallback triggered');
                if (this.raf) cancelAnimationFrame(this.raf);
                this.hidePreloader();
            }
        }, 4000);
    }
    
    /**
     * Hide preloader with smooth transition
     */
    hidePreloader() {
        if (!this.preloader || !this.isLoading) return;
        
        this.preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        this.isLoading = false;
        
        // Clean up
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
        
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
        
        // Fade in content
        document.querySelectorAll('.hero-content, .hero-badge, .hero-title, .hero-buttons').forEach(el => {
            el.style.opacity = '1';
        });
    }
    
    /**
     * Initialize optimized header scroll effect
     */
    initHeaderScroll() {
        if (!this.header) return;
        
        // Use passive scroll listener for better performance
        window.addEventListener('scroll', () => {
            // Store scroll position but don't process immediately
            this.scrollY = window.scrollY;
            
            // Use requestAnimationFrame to process scroll events efficiently
            if (!this.raf) {
                this.raf = requestAnimationFrame(() => {
                    this.handleScroll();
                    this.raf = null;
                });
            }
        }, { passive: true });
        
        // Initial check
        this.handleScroll();
    }
    
    /**
     * Handle scroll events efficiently
     */
    handleScroll() {
        const shouldBeScrolled = this.scrollY > 50;
        
        if (this.scrolled !== shouldBeScrolled) {
            this.scrolled = shouldBeScrolled;
            this.header.classList.toggle('scrolled', shouldBeScrolled);
        }
        
        // Update parallax effect on scroll if video is loaded
        if (this.videoLoaded && this.heroSection && this.heroVideo) {
            const heroHeight = this.heroSection.offsetHeight;
            const scrollPercentage = Math.min(this.scrollY / heroHeight, 1);
            
            // Parallax effect - move the video as user scrolls
            const translateY = scrollPercentage * 50; // 50px total movement
            const scale = 1.05 - (scrollPercentage * 0.05); // Subtle scale change
            
            // Apply transformation with will-change optimization
            this.heroVideo.style.transform = `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`;
        }
    }
    
    /**
     * Initialize parallax video effect with performance optimizations
     */
    initParallaxVideo() {
        if (!this.heroVideo || !this.heroSection) return;
        
        // Skip heavy effects on low-end devices
        const useHeavyEffects = !this.isLowEndDevice && !this.prefersReducedMotion;

        // Initial scale for the parallax effect
        const initialScale = 1.05;
        
        // Handle video loading events
        this.heroVideo.addEventListener('loadeddata', () => {
            this.videoLoaded = true;
            console.log('📹 Hero video loaded successfully');
            
            // Apply initial parallax effect
            if (useHeavyEffects) {
                this.applyParallaxEffects({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
            }
        });
        
        this.heroVideo.addEventListener('error', (e) => {
            console.error('❌ Error loading hero video:', e);
            this.heroSection.style.backgroundImage = 'var(--primary-gradient)';
        });
        
        // Pause video when not visible for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.heroVideo.pause();
            } else if (this.videoLoaded) {
                this.heroVideo.play().catch(() => {});
            }
        });
        
        // Skip mouse parallax on touch devices or reduced motion preference
        if (!useHeavyEffects) return;
        
        // Mouse movement parallax effect - optimized
        this.applyParallaxEffects = (e) => {
            if (!this.videoLoaded) return;
            
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Calculate mouse position as percentage (-0.05 to 0.05)
            const xPercentage = (clientX / innerWidth - 0.5) * 0.1;
            const yPercentage = (clientY / innerHeight - 0.5) * 0.1;
            
            // Apply subtle movement based on mouse position
            this.heroVideo.style.transform = `translate(calc(-50% + ${xPercentage * 30}px), calc(-50% + ${yPercentage * 30}px)) scale(${initialScale})`;
            
            // Move accents in opposite direction for enhanced depth
            const accentLines = document.querySelectorAll('.accent-line');
            const glowOrbs = document.querySelectorAll('.glow-orb');
            const accentShapes = document.querySelectorAll('.accent-shape');
            
            accentLines.forEach((line, index) => {
                const depth = 1 + (index * 0.5);
                line.style.transform = `translateX(${-xPercentage * 50 * depth}px) translateY(${-yPercentage * 50 * depth}px) rotate(${index === 0 ? -5 : 3}deg)`;
            });
            
            glowOrbs.forEach((orb, index) => {
                const depth = 1 + (index * 0.3);
                orb.style.transform = `translateX(${-xPercentage * 70 * depth}px) translateY(${-yPercentage * 70 * depth}px)`;
            });
            
            accentShapes.forEach((shape, index) => {
                const depth = 1.2 + (index * 0.4);
                shape.style.transform = `translateX(${-xPercentage * 60 * depth}px) translateY(${-yPercentage * 60 * depth}px) rotate(${index === 0 ? 45 : -45}deg)`;
            });
        };

        // Use throttled event listener for better performance
        this.heroSection.addEventListener('mousemove', this.throttle(this.applyParallaxEffects, 16), { passive: true });

        // Reset on mouse leave
        this.heroSection.addEventListener('mouseleave', () => {
            if (!this.videoLoaded) return;
            
            this.heroVideo.style.transform = `translate(-50%, -50%) scale(${initialScale})`;
            
            const accentLines = document.querySelectorAll('.accent-line');
            const glowOrbs = document.querySelectorAll('.glow-orb');
            const accentShapes = document.querySelectorAll('.accent-shape');
            
            accentLines.forEach((line, index) => {
                line.style.transform = `rotate(${index === 0 ? -5 : 3}deg)`;
            });
            
            glowOrbs.forEach(orb => {
                orb.style.transform = '';
            });
            
            accentShapes.forEach((shape, index) => {
                shape.style.transform = `rotate(${index === 0 ? 45 : -45}deg)`;
            });
        });
        
        // Initial call to set the correct state
        this.handleScroll();
    }
    
    /**
     * Initialize mobile menu functionality with improved performance
     */
    initMobileMenu() {
        if (!this.menuToggle || !this.menuClose || !this.mobileMenu) return;
        
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        this.menuClose.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMobileMenu();
        });
        
        // Close mobile menu when clicking outside - optimized event handling
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && 
                !e.target.closest('.mobile-menu') && 
                !e.target.closest('.menu-toggle')) {
                this.closeMobileMenu();
            }
        });
        
        // Mobile dropdown toggles - delegate events for better performance
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.addEventListener('click', (e) => {
                const toggle = e.target.closest('.mobile-nav-link.dropdown-toggle');
                if (toggle) {
                    e.preventDefault();
                    const item = toggle.closest('.mobile-nav-item');
                    if (item) {
                        item.classList.toggle('active');
                    }
                }
            });
        }
        
        // Handle navigation clicks to close mobile menu
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.dropdown-toggle), .mobile-dropdown-item');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }
    
    /**
     * Toggle mobile menu state
     */
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Open mobile menu with smooth animation
     */
    openMobileMenu() {
        if (!this.mobileMenu || !this.menuToggle) return;
        
        this.mobileMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        setTimeout(() => {
            const firstFocusable = this.mobileMenu.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }
    
    /**
     * Close mobile menu with smooth animation
     */
    closeMobileMenu() {
        if (!this.mobileMenu || !this.menuToggle) return;
        
        this.mobileMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        
        document.body.style.overflow = '';
        
        // Return focus to menu toggle
        this.menuToggle.focus();
    }
    
    /**
     * Initialize dropdown interactions with accessibility improvements
     */
    initDropdowns() {
        // Desktop dropdowns are handled with CSS hover
        // This is just for accessibility enhancements
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const menu = item.querySelector('.dropdown-menu');
            
            if (link && menu) {
                // Add ARIA attributes
                link.setAttribute('aria-expanded', 'false');
                link.setAttribute('aria-haspopup', 'true');
                
                // Handle keyboard access
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        link.setAttribute('aria-expanded', 'true');
                        menu.style.opacity = '1';
                        menu.style.visibility = 'visible';
                        menu.style.transform = 'translateX(-50%) translateY(0)';
                        
                        // Focus the first link in the dropdown
                        const firstLink = menu.querySelector('a');
                        if (firstLink) {
                            firstLink.focus();
                        }
                    }
                });
                
                // Close dropdown on escape
                menu.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        link.setAttribute('aria-expanded', 'false');
                        menu.style.opacity = '';
                        menu.style.visibility = '';
                        menu.style.transform = '';
                        link.focus();
                    }
                });
                
                // Handle focus leaving the dropdown
                menu.addEventListener('focusout', (e) => {
                    if (!menu.contains(e.relatedTarget)) {
                        link.setAttribute('aria-expanded', 'false');
                        menu.style.opacity = '';
                        menu.style.visibility = '';
                        menu.style.transform = '';
                    }
                });
            }
        });
    }
    
    /**
     * Initialize modal functionality with accessibility improvements
     */
    initModal() {
        const modalTriggers = document.querySelectorAll('#headerCta, #heroCta, #mobileCta');
        
        if (!this.appointmentModal) return;
        
        modalTriggers.forEach(trigger => {
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            }
        });
        
        if (this.modalClose) {
            this.modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOpen) {
                this.closeModal();
            }
        });
        
        // Handle form submission
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Basic validation
                const isValid = this.validateForm(form);
                
                if (isValid) {
                    this.submitForm(form);
                }
            });
        }
    }
    
    /**
     * Open appointment modal with smooth animation and accessibility
     */
    openModal() {
        if (!this.appointmentModal) return;
        
        this.modalOpen = true;
        this.appointmentModal.classList.add('active');
        this.appointmentModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Store element that had focus before opening modal
        this.lastFocusedElement = document.activeElement;
        
        // Focus first input for accessibility
        setTimeout(() => {
            const firstInput = this.appointmentModal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
    
    /**
     * Close appointment modal with smooth animation and accessibility
     */
    closeModal() {
        if (!this.appointmentModal) return;
        
        this.modalOpen = false;
        this.appointmentModal.classList.remove('active');
        this.appointmentModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to element that had focus before modal was opened
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }
    
    /**
     * Initialize scroll animations with performance optimizations
     */
    initScrollAnimations() {
        // Skip if AOS is available or if reduced motion is preferred
        if (typeof AOS !== 'undefined' || this.prefersReducedMotion) return;
        
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (!animatedElements.length) return;
        
        const animateElements = () => {
            animatedElements.forEach(element => {
                // Use IntersectionObserver if supported
                if ('IntersectionObserver' in window && !this.isLowEndDevice) {
                    if (!this.intersectionObserver) {
                        this.intersectionObserver = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting && !entry.target.classList.contains('aos-animate')) {
                                    entry.target.classList.add('aos-animate');
                                }
                            });
                        }, {
                            root: null,
                            threshold: 0.1,
                            rootMargin: '0px 0px -20% 0px'
                        });
                    }
                    
                    this.intersectionObserver.observe(element);
                } else {
                    // Fallback for browsers that don't support IntersectionObserver
                    const rect = element.getBoundingClientRect();
                    const isInViewport = (
                        rect.top <= window.innerHeight * 0.8 &&
                        rect.bottom >= 0
                    );
                    
                    if (isInViewport && !element.classList.contains('aos-animate')) {
                        element.classList.add('aos-animate');
                    }
                }
            });
        };
        
        // Animate elements on scroll with throttling
        window.addEventListener('scroll', this.throttle(animateElements, 100), { passive: true });
        
        // Initial check
        setTimeout(animateElements, 100);
    }
    
    /**
     * Initialize form validation with improved UX
     */
    initFormValidation() {
        const form = document.getElementById('appointmentForm');
        
        if (!form) return;
        
        // Add validation on blur for each field
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            // Clear error on focus
            field.addEventListener('focus', () => {
                const formGroup = field.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                    const errorMessage = formGroup.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
            
            // Validate on input after initial blur
            field.addEventListener('input', () => {
                const formGroup = field.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });
    }
    
    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (field.hasAttribute('required')) {
                const fieldIsValid = this.validateField(field);
                isValid = isValid && fieldIsValid;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate single field with improved error handling
     */
    validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '' && field.checkValidity();
        const formGroup = field.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.toggle('error', !isValid);
            
            // Create or update error message
            let errorMessage = formGroup.querySelector('.error-message');
            
            if (!isValid) {
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    formGroup.appendChild(errorMessage);
                }
                
                // Get appropriate error message
                let message = 'This field is required';
                
                if (value !== '') {
                    if (field.type === 'email' && !field.checkValidity()) {
                        message = 'Please enter a valid email address';
                    } else if (field.type === 'tel' && !field.checkValidity()) {
                        message = 'Please enter a valid phone number';
                    } else if (field.validationMessage) {
                        message = field.validationMessage;
                    }
                }
                
                errorMessage.textContent = message;
            } else if (errorMessage) {
                errorMessage.remove();
            }
        }
        
        return isValid;
    }
    
    /**
     * Submit form with animation
     */
    submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        }
        
        // Simulate form submission (replace with actual AJAX in production)
        setTimeout(() => {
            form.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h3>Thank You!</h3>
                    <p>Your appointment request has been received. We'll contact you shortly to confirm your consultation.</p>
                </div>
            `;
            
            // Close modal after delay
            setTimeout(() => {
                this.closeModal();
            }, 3000);
            
        }, 1500);
    }
    
    /**
     * Initialize smooth scroll to elements with performance optimizations
     */
    initScrollToElements() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        // Scroll down button
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const heroHeight = this.heroSection?.offsetHeight || window.innerHeight;
                
                if (this.prefersReducedMotion) {
                    window.scrollTo(0, heroHeight);
                } else {
                    this.smoothScrollTo(heroHeight, 600);
                }
            });
        }
        
        // Anchor links - delegate events for better performance
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]:not([href="#"])');
            if (link) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (this.mobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    // Get header height for offset
                    const headerHeight = this.header?.offsetHeight || 0;
                    
                    // Scroll to element
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    if (this.prefersReducedMotion) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        this.smoothScrollTo(targetPosition, 600);
                    }
                }
            }
        });
    }
    
    /**
     * Custom smooth scroll implementation for better performance
     */
    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        // Cancel any ongoing animation
        if (this.scrollAnimation) {
            cancelAnimationFrame(this.scrollAnimation);
        }
        
        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function - easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (timeElapsed < duration) {
                this.scrollAnimation = requestAnimationFrame(animateScroll);
            } else {
                this.scrollAnimation = null;
            }
        };
        
        this.scrollAnimation = requestAnimationFrame(animateScroll);
    }
    
    /**
     * Handle initialization errors
     */
    handleInitError() {
        // Hide preloader even if there's an error
        if (this.preloader) {
            this.preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
        
        console.warn('⚠️ Application initialized with limited functionality due to errors');
    }
    
    /**
     * Bind global event listeners
     */
    bindEvents() {
        // Handle resize events with debouncing
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                // Close mobile menu on larger screens
                if (window.innerWidth >= 768 && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Update AOS on resize if available
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 250);
        });
        
        // Handle video tour button
        const videoTourBtn = document.getElementById('videoTourBtn');
        if (videoTourBtn && this.heroVideo) {
            videoTourBtn.addEventListener('click', () => {
                if (this.heroVideo.paused) {
                    this.heroVideo.play().catch(err => console.error('Could not play video', err));
                    videoTourBtn.querySelector('span').textContent = 'Pause Tour';
                    videoTourBtn.querySelector('.btn-circle i').classList.remove('fa-play');
                    videoTourBtn.querySelector('.btn-circle i').classList.add('fa-pause');
                } else {
                    this.heroVideo.pause();
                    videoTourBtn.querySelector('span').textContent = 'Take a Virtual Tour';
                    videoTourBtn.querySelector('.btn-circle i').classList.remove('fa-pause');
                    videoTourBtn.querySelector('.btn-circle i').classList.add('fa-play');
                }
            });
        }
        
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
    
    /**
     * Throttle function to limit frequent executions
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     */
    throttle(func, limit) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }
    
    /**
     * Debounce function to limit frequent executions
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const eviaApp = new EviaApp();
});
