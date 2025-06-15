/**
 * Evia Aesthetics - Main JavaScript
 * Includes premium hero section functionality and preloader
 */

'use strict';

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
 * Premium Hero Section
 * Advanced animations and interactive elements
 */
class PremiumHeroSection {
    constructor() {
        // Elements
        this.heroSection = document.querySelector('.hero-section');
        this.videoElement = document.getElementById('heroVideo');
        this.serviceCarousel = document.getElementById('serviceCarousel');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        this.featureCards = document.querySelectorAll('.feature-card');
        this.consultationBtn = document.getElementById('consultationBtn');
        this.watchVideoBtn = document.getElementById('watchVideoBtn');
        
        // State
        this.videoLoaded = false;
        this.currentServiceIndex = 0;
        this.serviceItems = this.serviceCarousel ? this.serviceCarousel.querySelectorAll('.service-item') : [];
        
        // Initialize
        if (this.heroSection) {
            this.init();
        }
    }
    
    /**
     * Initialize hero section
     */
    init() {
        console.log('✨ Initializing premium hero section');
        
        this.initVideoBackground();
        this.initServiceCarousel();
        this.initScrollIndicator();
        this.initFeatureCards();
        this.initButtonInteractions();
        
        // Initialize parallax if device supports it
        if (!this.isMobileDevice() && !this.prefersReducedMotion()) {
            this.initParallaxEffects();
        }
    }
    
    /**
     * Initialize video background
     */
    initVideoBackground() {
        if (!this.videoElement) return;
        
        // Set initial state
        this.videoElement.style.opacity = '0';
        
        // Fade in video when loaded
        this.videoElement.addEventListener('loadeddata', () => {
            this.videoLoaded = true;
            console.log('📹 Hero video loaded successfully');
            
            // Fade in video
            this.videoElement.style.opacity = '1';
            
            // Apply subtle zoom effect after loading
            setTimeout(() => {
                this.videoElement.style.transform = 'translate(-50%, -50%) scale(1.05)';
            }, 1000);
        });
        
        // Error handling
        this.videoElement.addEventListener('error', (e) => {
            console.error('❌ Error loading hero video:', e);
            
            // Apply fallback background
            if (this.heroSection) {
                this.heroSection.style.backgroundImage = 'linear-gradient(135deg, #442C15 0%, #6D4824 100%)';
            }
        });
        
        // Pause video when not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.videoElement.pause();
            } else if (this.videoLoaded) {
                this.videoElement.play().catch(() => {});
            }
        });
    }
    
    /**
     * Initialize service carousel
     */
    initServiceCarousel() {
        if (!this.serviceCarousel || this.serviceItems.length === 0) return;
        
        // Set initial active item
        this.serviceItems[0].classList.add('active');
        
        // Update carousel width based on the longest item
        this.updateCarouselWidth();
        
        // Rotate services at regular intervals
        setInterval(() => {
            // Set current item to inactive
            this.serviceItems[this.currentServiceIndex].classList.remove('active');
            this.serviceItems[this.currentServiceIndex].classList.add('inactive');
            
            // Update index
            this.currentServiceIndex = (this.currentServiceIndex + 1) % this.serviceItems.length;
            
            // Remove inactive class from new current after animation
            setTimeout(() => {
                this.serviceItems.forEach((item, index) => {
                    if (index !== this.currentServiceIndex) {
                        item.classList.remove('inactive');
                    }
                });
            }, 600);
            
            // Set new current item to active
            this.serviceItems[this.currentServiceIndex].classList.add('active');
            
        }, 3000);
    }
    
    /**
     * Update carousel width based on the longest item
     */
    updateCarouselWidth() {
        let maxWidth = 0;
        
        // Create a temporary element to measure text width
        const tempElement = document.createElement('span');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.fontSize = '1.1rem';
        tempElement.style.fontWeight = '600';
        tempElement.style.fontFamily = 'Inter, sans-serif';
        document.body.appendChild(tempElement);
        
        // Find the longest text
        this.serviceItems.forEach(item => {
            tempElement.textContent = item.textContent;
            const width = tempElement.offsetWidth;
            maxWidth = Math.max(maxWidth, width);
        });
        
        // Clean up
        document.body.removeChild(tempElement);
        
        // Set carousel width with some padding
        this.serviceCarousel.style.width = `${maxWidth + 20}px`;
    }
    
    /**
     * Initialize scroll indicator
     */
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const heroHeight = this.heroSection.offsetHeight;
            
            // Smooth scroll to the section below the hero
            window.scrollTo({
                top: heroHeight - 50,
                behavior: 'smooth'
            });
        });
        
        // Hide scroll indicator when scrolled down
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > 100) {
                this.scrollIndicator.style.opacity = '0';
                this.scrollIndicator.style.pointerEvents = 'none';
            } else {
                this.scrollIndicator.style.opacity = '1';
                this.scrollIndicator.style.pointerEvents = 'auto';
            }
        }, { passive: true });
    }
    
    /**
     * Initialize feature cards
     */
    initFeatureCards() {
        if (!this.featureCards.length) return;
        
        this.featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateX(-10px)';
                card.style.background = 'rgba(255, 255, 255, 0.15)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateX(0)';
                card.style.background = 'rgba(255, 255, 255, 0.1)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
        });
    }
    
    /**
     * Initialize button interactions
     */
    initButtonInteractions() {
        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', () => {
                // Open appointment modal if exists
                const appointmentModal = document.getElementById('appointmentModal');
                if (appointmentModal) {
                    appointmentModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        
        if (this.watchVideoBtn) {
            this.watchVideoBtn.addEventListener('click', () => {
                this.createVideoModal('https://www.youtube.com/embed/YOUR_VIDEO_ID');
            });
        }
    }
    
    /**
     * Create and open a video modal
     */
    createVideoModal(videoUrl) {
        // Check if modal already exists
        let modalContainer = document.querySelector('.video-modal');
        
        if (!modalContainer) {
            // Create modal container
            modalContainer = document.createElement('div');
            modalContainer.className = 'video-modal';
            
            // Create modal content
            modalContainer.innerHTML = `
                <div class="video-modal-overlay"></div>
                <div class="video-modal-content">
                    <button class="video-modal-close">&times;</button>
                    <div class="video-wrapper">
                        <iframe src="${videoUrl}?autoplay=1" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            
            // Add modal to body
            document.body.appendChild(modalContainer);
            
            // Set up close button
            const closeButton = modalContainer.querySelector('.video-modal-close');
            const overlay = modalContainer.querySelector('.video-modal-overlay');
            
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.closeVideoModal(modalContainer);
                });
            }
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.closeVideoModal(modalContainer);
                });
            }
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
                    this.closeVideoModal(modalContainer);
                }
            });
        }
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        setTimeout(() => {
            modalContainer.classList.add('active');
        }, 10);
    }
    
    /**
     * Close video modal
     */
    closeVideoModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        // Remove modal after animation
        setTimeout(() => {
            if (modal.parentNode) {
                // Get iframe source to stop video
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    const iframeSrc = iframe.src;
                    iframe.src = iframeSrc; // Reset iframe to stop video
                }
                
                // Remove modal from DOM
                modal.parentNode.removeChild(modal);
            }
        }, 400);
    }
    
    /**
     * Initialize parallax effects
     */
    initParallaxEffects() {
        if (!this.heroSection || !this.videoLoaded) return;
        
        const handleParallax = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Calculate mouse position percentage from center
            const xPercent = (clientX / innerWidth - 0.5) * 2; // -1 to 1
            const yPercent = (clientY / innerHeight - 0.5) * 2; // -1 to 1
            
            // Apply subtle parallax to video
            if (this.videoElement) {
                const moveX = xPercent * 10; // max 10px movement
                const moveY = yPercent * 10; // max 10px movement
                this.videoElement.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(1.05)`;
            }
            
            // Apply parallax to shapes
            const shapes = document.querySelectorAll('.elegant-shape');
            shapes.forEach((shape, i) => {
                const factor = i === 0 ? 1.5 : 2.5;
                shape.style.transform = `translate(${xPercent * 20 * factor}px, ${yPercent * 20 * factor}px)`;
            });
            
            // Apply parallax to glows
            const glows = document.querySelectorAll('.light-glow');
            glows.forEach((glow, i) => {
                const factor = i === 0 ? 3 : 2;
                glow.style.transform = `translate(${-xPercent * 30 * factor}px, ${-yPercent * 30 * factor}px)`;
            });
        };
        
        // Throttled event listener for better performance
        let lastCallTime = 0;
        const throttleTime = 16; // approximately 60fps
        
        this.heroSection.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastCallTime >= throttleTime) {
                lastCallTime = now;
                handleParallax(e);
            }
        }, { passive: true });
        
        // Reset on mouse leave
        this.heroSection.addEventListener('mouseleave', () => {
            if (this.videoElement) {
                this.videoElement.style.transform = 'translate(-50%, -50%) scale(1.05)';
            }
            
            const shapes = document.querySelectorAll('.elegant-shape');
            shapes.forEach(shape => {
                shape.style.transform = '';
            });
            
            const glows = document.querySelectorAll('.light-glow');
            glows.forEach(glow => {
                glow.style.transform = '';
            });
        });
    }
    
    /**
     * Check if current device is mobile
     */
    isMobileDevice() {
        return (window.innerWidth < 768) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    }
    
    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        this.raf = null; // Store requestAnimationFrame for cancellation
        this.scrollY = window.scrollY;
        this.resizeTimer = null;
        
        // DOM elements cached for performance
        this.header = document.getElementById('header');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.appointmentModal = document.getElementById('appointmentModal');
        this.menuToggle = document.getElementById('menuToggle');
        this.menuClose = document.getElementById('menuClose');
        this.modalClose = document.getElementById('modalClose');
        this.modalOverlay = document.querySelector('.modal-overlay');
        
        // Components
        this.preloader = null;
        this.heroSection = null;
        
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
            
            // Initialize components
            this.initHeaderScroll();
            this.initMobileMenu();
            this.initDropdowns();
            this.initModal();
            this.initScrollAnimations();
            this.initFormValidation();
            this.initScrollToElements();
            
            // Bind event listeners
            this.bindEvents();
            
            // Initialize hero section
            this.initHeroSection();
            
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
     * Initialize hero section
     */
    initHeroSection() {
        // Create and initialize premium hero section
        this.heroSection = new PremiumHeroSection();
    }
    
    /**
     * Handle preloader completion
     */
    onPreloaderComplete() {
        this.isLoading = false;
        
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
            this.header?.classList.toggle('scrolled', shouldBeScrolled);
        }
    }
    
    /**
     * Initialize mobile menu functionality
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
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && 
                !e.target.closest('.mobile-menu') && 
                !e.target.closest('.menu-toggle')) {
                this.closeMobileMenu();
            }
        });
        
        // Mobile dropdown toggles
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
        const modalTriggers = document.querySelectorAll('#headerCta, #heroCta, #mobileCta, #consultationBtn');
        
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
        document.body.classList.remove('loading');
        const preloader = document.getElementById('eviaPreloader');
        if (preloader) {
            preloader.classList.add('hidden');
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
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const eviaApp = new EviaApp();
});
