/**
 * Evia Aesthetics - Main JavaScript
 * Handles all interactive functionality for the medspa website
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
        
        // DOM elements
        this.preloader = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.loadingText = document.getElementById('loadingText');
        this.header = document.getElementById('header');
        this.heroVideo = document.getElementById('heroVideo');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.appointmentModal = document.getElementById('appointmentModal');
        
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
     * Initialize preloader with progress simulation
     */
    initPreloader() {
        if (!this.preloader || !this.progressFill) return;
        
        const loadingSteps = [
            { progress: 10, text: 'Initializing experience...' },
            { progress: 30, text: 'Loading assets...' },
            { progress: 50, text: 'Preparing interface...' },
            { progress: 70, text: 'Optimizing content...' },
            { progress: 90, text: 'Finalizing details...' },
            { progress: 100, text: 'Welcome to Evia Aesthetics!' }
        ];
        
        let currentStep = 0;
        
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            if (currentStep >= loadingSteps.length) {
                clearInterval(progressInterval);
                setTimeout(() => this.hidePreloader(), 500);
                return;
            }
            
            const step = loadingSteps[currentStep];
            this.progressFill.style.width = step.progress + '%';
            
            if (this.loadingText) {
                this.loadingText.textContent = step.text;
            }
            
            currentStep++;
        }, 500);
    }
    
    /**
     * Hide preloader and reveal site
     */
    hidePreloader() {
        if (!this.preloader) return;
        
        this.preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        this.isLoading = false;
        
        // Initialize AOS animations after preloader
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true,
                offset: 50,
                delay: 100
            });
        }
    }
    
    /**
     * Initialize header scroll effect
     */
    initHeaderScroll() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            const shouldBeScrolled = scrollPosition > 50;
            
            if (this.scrolled !== shouldBeScrolled) {
                this.scrolled = shouldBeScrolled;
                this.header.classList.toggle('scrolled', shouldBeScrolled);
            }
        }, { passive: true });
        
        // Initial check
        this.header.classList.toggle('scrolled', window.scrollY > 50);
    }
    
    /**
     * Initialize parallax video effect
     */
    initParallaxVideo() {
        const video = document.getElementById('heroVideo');
        const heroSection = document.querySelector('.hero');
        if (!video || !heroSection) return;

        // Initial scale for the parallax effect
        const initialScale = 1.05;
        
        // Handle video loading events
        video.addEventListener('loadeddata', () => {
            this.videoLoaded = true;
            console.log('📹 Hero video loaded successfully');
            
            // Apply initial parallax effect
            this.applyParallaxEffects({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
        });
        
        video.addEventListener('error', (e) => {
            console.error('❌ Error loading hero video:', e);
            heroSection.style.backgroundImage = 'var(--primary-gradient)';
        });
        
        // Pause video when not visible for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else if (this.videoLoaded) {
                video.play().catch(() => {});
            }
        });
        
        // Parallax effect on scroll
        const handleScroll = () => {
            if (!this.videoLoaded) return;
            
            const scrollTop = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            const scrollPercentage = Math.min(scrollTop / heroHeight, 1);
            
            // Parallax effect - move the video as user scrolls
            const translateY = scrollPercentage * 50; // 50px total movement
            const scale = initialScale - (scrollPercentage * 0.05); // Subtle scale change
            
            // Apply transformation
            video.style.transform = `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`;
            
            // Adjust overlay opacity for enhanced depth
            const overlay = document.querySelector('.video-overlay');
            if (overlay) {
                const baseOpacity = 0.5;
                const opacityChange = 0.3;
                overlay.style.opacity = baseOpacity + (scrollPercentage * opacityChange);
            }
        };

        // Apply throttled scroll handler
        window.addEventListener('scroll', this.throttle(handleScroll, 10), { passive: true });

        // Mouse movement parallax effect
        this.applyParallaxEffects = (e) => {
            if (!this.videoLoaded) return;
            
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Calculate mouse position as percentage (-0.05 to 0.05)
            const xPercentage = (clientX / innerWidth - 0.5) * 0.1;
            const yPercentage = (clientY / innerHeight - 0.5) * 0.1;
            
            // Apply subtle movement based on mouse position
            video.style.transform = `translate(calc(-50% + ${xPercentage * 30}px), calc(-50% + ${yPercentage * 30}px)) scale(${initialScale})`;
            
            // Move accents in opposite direction for enhanced depth
            const accentLines = document.querySelectorAll('.accent-line');
            const glowOrbs = document.querySelectorAll('.glow-orb');
            
            accentLines.forEach((line, index) => {
                const depth = 1 + (index * 0.5);
                line.style.transform = `translateX(${-xPercentage * 50 * depth}px) translateY(${-yPercentage * 50 * depth}px) rotate(${index === 0 ? -5 : 3}deg)`;
            });
            
            glowOrbs.forEach((orb, index) => {
                const depth = 1 + (index * 0.3);
                orb.style.transform = `translateX(${-xPercentage * 70 * depth}px) translateY(${-yPercentage * 70 * depth}px)`;
            });
        };

        heroSection.addEventListener('mousemove', this.throttle(this.applyParallaxEffects, 10));

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            if (!this.videoLoaded) return;
            
            video.style.transform = `translate(-50%, -50%) scale(${initialScale})`;
            
            const accentLines = document.querySelectorAll('.accent-line');
            const glowOrbs = document.querySelectorAll('.glow-orb');
            
            accentLines.forEach((line, index) => {
                line.style.transform = `rotate(${index === 0 ? -5 : 3}deg)`;
            });
            
            glowOrbs.forEach(orb => {
                orb.style.transform = '';
            });
        });
        
        // Initial call to set the correct state
        handleScroll();
    }
    
    /**
     * Initialize mobile menu functionality
     */
    initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuClose = document.getElementById('menuClose');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        if (menuClose) {
            menuClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-toggle')) {
                this.closeMobileMenu();
            }
        });
        
        // Mobile dropdown toggles
        const dropdownToggles = document.querySelectorAll('.mobile-nav-link.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const item = toggle.closest('.mobile-nav-item');
                if (item) {
                    item.classList.toggle('active');
                }
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
     * Open mobile menu
     */
    openMobileMenu() {
        if (!this.mobileMenu) return;
        
        const menuToggle = document.getElementById('menuToggle');
        
        this.mobileMenuOpen = true;
        this.mobileMenu.classList.add('active');
        
        if (menuToggle) {
            menuToggle.classList.add('active');
        }
        
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        if (!this.mobileMenu) return;
        
        const menuToggle = document.getElementById('menuToggle');
        
        this.mobileMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }
    
    /**
     * Initialize dropdown interactions
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
     * Initialize modal functionality
     */
    initModal() {
        const modalTriggers = document.querySelectorAll('#headerCta, #heroCta, #mobileCta');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.querySelector('.modal-overlay');
        
        if (!this.appointmentModal) return;
        
        modalTriggers.forEach(trigger => {
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            }
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOpen) {
                this.closeModal();
            }
        });
    }
    
    /**
     * Open appointment modal
     */
    openModal() {
        if (!this.appointmentModal) return;
        
        this.modalOpen = true;
        this.appointmentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input for accessibility
        setTimeout(() => {
            const firstInput = this.appointmentModal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
    
    /**
     * Close appointment modal
     */
    closeModal() {
        if (!this.appointmentModal) return;
        
        this.modalOpen = false;
        this.appointmentModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    /**
     * Initialize scroll animations (if AOS not available)
     */
    initScrollAnimations() {
        // Skip if AOS is available
        if (typeof AOS !== 'undefined') return;
        
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (!animatedElements.length) return;
        
        const animateElements = () => {
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isInViewport = (
                    rect.top <= window.innerHeight * 0.8 &&
                    rect.bottom >= 0
                );
                
                if (isInViewport && !element.classList.contains('aos-animate')) {
                    element.classList.add('aos-animate');
                }
            });
        };
        
        // Animate elements on scroll
        window.addEventListener('scroll', animateElements, { passive: true });
        
        // Initial check
        setTimeout(animateElements, 100);
    }
    
    /**
     * Initialize form validation
     */
    initFormValidation() {
        const form = document.getElementById('appointmentForm');
        
        if (!form) return;
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const isValid = this.validateForm(form);
            
            if (isValid) {
                this.submitForm(form);
            }
        });
        
        // Add validation on blur for each field
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
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
     * Validate single field
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
                
                errorMessage.textContent = field.validationMessage || 'This field is required';
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
     * Initialize smooth scroll to elements
     */
    initScrollToElements() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        // Scroll down button
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
                window.scrollTo({
                    top: heroHeight,
                    behavior: 'smooth'
                });
            });
        }
        
        // Anchor links
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
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
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
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
        // Handle resize events
        window.addEventListener('resize', this.debounce(() => {
            // Close mobile menu on larger screens
            if (window.innerWidth >= 768 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));
        
        // Update AOS on resize if available
        window.addEventListener('resize', this.debounce(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 500));
        
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
    }
    
    /**
     * Throttle function to limit frequent executions
     */
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
    
    /**
     * Debounce function to limit frequent executions
     */
    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const eviaApp = new EviaApp();
});
