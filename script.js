/*
* Evia Aesthetics - Complete Interactive System
* Modern Soft Design with Advanced Functionality
* Version: 4.0 - Cinematic Luxury Experience
* Last Updated: 2025-06-11
*/

'use strict';

// ==============================
// EVIA AESTHETICS APPLICATION CLASS
// ==============================
class EviaAestheticsApp {
    constructor() {
        this.isLoaded = false;
        this.animations = new Map();
        this.observers = new Map();
        this.timers = new Map();
        this.state = {
            mobileMenuOpen: false,
            modalOpen: false,
            scrolled: false,
            preloaderComplete: false,
            videoLoaded: false,
            librariesLoaded: {
                gsap: false,
                aos: false,
                three: false
            }
        };
        
        // Bind methods to maintain context
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    /**
     * Main initialization sequence
     */
    async initializeApp() {
        try {
            console.log('🎨 Initializing Evia Aesthetics App...');
            
            // Check for external libraries first
            this.checkExternalLibraries();

            // Initialize components in sequence
            await this.initPreloader();
            this.initNavigation();
            this.initMobileMenu();
            this.initHeroSection();
            this.initModals();
            this.initScrollEffects();
            this.initAnimationLibraries();
            this.initPerformanceOptimizations();
            this.initAccessibility();
            this.bindEventListeners();
            
            // Mark as loaded
            this.isLoaded = true;
            
            console.log('✅ Evia Aesthetics App initialized successfully');
            this.logPerformanceMetrics();
            
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Check if external libraries are loaded
     */
    checkExternalLibraries() {
        // Check for GSAP
        if (typeof gsap !== 'undefined') {
            this.state.librariesLoaded.gsap = true;
            console.log('✅ GSAP library detected');
        } else {
            console.warn('⚠️ GSAP library not detected - using fallbacks');
        }

        // Check for AOS
        if (typeof AOS !== 'undefined') {
            this.state.librariesLoaded.aos = true;
            console.log('✅ AOS library detected');
        } else {
            console.warn('⚠️ AOS library not detected - using fallbacks');
        }

        // Check for Three.js
        if (typeof THREE !== 'undefined') {
            this.state.librariesLoaded.three = true;
            console.log('✅ Three.js library detected');
        } else {
            console.warn('⚠️ Three.js library not detected - using fallbacks');
        }
    }

    /**
     * Handle initialization errors gracefully
     */
    handleInitializationError(error) {
        // Hide preloader even if there's an error
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
        }
        
        // Show a user-friendly message in console
        console.warn('🔄 App initialized with limited functionality due to error:', error.message);

        // Enable basic functionality despite the error
        this.enableBasicFunctionality();
    }

    /**
     * Enable basic functionality if full initialization fails
     */
    enableBasicFunctionality() {
        // Basic navigation
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobileClose');

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        if (mobileClose && mobileMenu) {
            mobileClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Basic modal functionality
        const modalOpeners = document.querySelectorAll('[id$="BookingBtn"]');
        const appointmentModal = document.getElementById('appointmentModal');
        const modalClose = document.getElementById('modalClose');

        if (appointmentModal) {
            modalOpeners.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        appointmentModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });
                }
            });

            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    appointmentModal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        }
    }

    // ==============================
    // PRELOADER SYSTEM
    // ==============================
    
    /**
     * Advanced preloader with progress tracking
     */
    async initPreloader() {
        const preloader = document.getElementById('preloader');
        const progressFill = document.getElementById('progressFill');
        const loadingText = document.getElementById('loadingText');
        const preloaderLogo = document.getElementById('preloaderLogo');
        
        if (!preloader) {
            console.warn('⚠️ Preloader element not found');
            return Promise.resolve();
        }

        // Fix logo source if using a placeholder
        if (preloaderLogo && preloaderLogo.src.includes('placeholder-logo.png')) {
            preloaderLogo.src = 'https://placehold.co/200x100/DAA520/FFF?text=Evia+Aesthetics';
        }

        const loadingSteps = [
            { progress: 0, text: 'Initializing experience...' },
            { progress: 20, text: 'Loading assets...' },
            { progress: 40, text: 'Preparing interface...' },
            { progress: 60, text: 'Optimizing performance...' },
            { progress: 80, text: 'Finalizing details...' },
            { progress: 100, text: 'Welcome to Evia!' }
        ];

        return new Promise(async (resolve) => {
            try {
                // Ensure minimum preloader display time for better UX
                const startTime = performance.now();
                const minPreloaderTime = 2000; // 2 seconds minimum
                
                // Simulate realistic loading with proper timing
                for (let i = 0; i < loadingSteps.length; i++) {
                    const step = loadingSteps[i];
                    
                    // Update progress bar
                    if (progressFill) {
                        progressFill.style.width = `${step.progress}%`;
                    }
                    
                    // Update loading text
                    if (loadingText) {
                        loadingText.textContent = step.text;
                    }
                    
                    // Wait before next step with realistic timing
                    await this.delay(300 + Math.random() * 200);
                }

                // Calculate remaining time to meet minimum display time
                const elapsedTime = performance.now() - startTime;
                const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);
                
                // Additional delay for smooth transition
                await this.delay(remainingTime);

                // Hide preloader
                this.hidePreloader(preloader);
                resolve();
                
            } catch (error) {
                console.error('Error in preloader:', error);
                this.hidePreloader(preloader);
                resolve();
            }
        });
    }

    /**
     * Hide preloader with smooth animation
     */
    hidePreloader(preloader) {
        if (!preloader) return;
        
        preloader.classList.add('fade-out');
        
        // Use transition event when possible, with setTimeout as backup
        const transitionEndHandler = () => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            this.state.preloaderComplete = true;
            
            // Start hero animations after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.startHeroAnimations();
            }, 200);
            
            preloader.removeEventListener('transitionend', transitionEndHandler);
        };
        
        preloader.addEventListener('transitionend', transitionEndHandler);
        
        // Backup timeout in case transition event doesn't fire
        const hideTimer = setTimeout(() => {
            if (preloader.style.display !== 'none') {
                transitionEndHandler();
            }
        }, 1000);
        
        this.timers.set('preloader', hideTimer);
    }

    // ==============================
    // NAVIGATION SYSTEM
    // ==============================
    
    /**
     * Initialize header and navigation
     */
    initNavigation() {
        const header = document.getElementById('siteHeader');
        if (!header) {
            console.warn('⚠️ Header element not found');
            return;
        }

        // Scroll detection
        this.initScrollDetection(header);
        
        // Navigation interactions
        this.initNavigationInteractions();
        
        // Smooth scrolling for anchor links
        this.initSmoothScrolling();
    }

    /**
     * Header scroll effects
     */
    initScrollDetection(header) {
        const scrollHandler = () => {
            const scrolled = window.pageYOffset > 50;
            
            if (scrolled !== this.state.scrolled) {
                this.state.scrolled = scrolled;
                header.classList.toggle('scrolled', scrolled);
                
                // Animate logo size change
                this.animateLogoTransition(scrolled);
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Initial check
        scrollHandler();
    }

    /**
     * Animate logo transition on scroll
     */
    animateLogoTransition(scrolled) {
        const logo = document.querySelector('.header-logo .logo');
        if (!logo) return;

        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            gsap.to(logo, {
                scale: scrolled ? 0.9 : 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            // Fallback CSS transition
            logo.style.transform = `scale(${scrolled ? 0.9 : 1})`;
        }
    }

    /**
     * Navigation hover and click interactions
     */
    initNavigationInteractions() {
        // Dropdown hovers
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        
        dropdownItems.forEach(item => {
            const menu = item.querySelector('.dropdown-menu');
            const arrow = item.querySelector('.nav-arrow');
            
            if (!menu) return;

            let hoverTimer;

            // Mouse enter
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);
                this.showDropdown(menu, arrow);
            });

            // Mouse leave
            item.addEventListener('mouseleave', () => {
                hoverTimer = setTimeout(() => {
                    this.hideDropdown(menu, arrow);
                }, 150);
                this.timers.set(`dropdown-${item.dataset?.id || Math.random()}`, hoverTimer);
            });

            // Keyboard support
            const navLink = item.querySelector('.nav-link');
            if (navLink) {
                navLink.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const isVisible = menu.style.visibility === 'visible';
                        if (isVisible) {
                            this.hideDropdown(menu, arrow);
                        } else {
                            this.showDropdown(menu, arrow);
                        }
                    }
                });
            }
        });

        // Active navigation highlighting
        this.initNavigationHighlighting();
    }

    /**
     * Show dropdown menu with animation
     */
    showDropdown(menu, arrow) {
        if (!menu) return;

        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            gsap.set(menu, { visibility: 'visible' });
            gsap.to(menu, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            if (arrow) {
                gsap.to(arrow, {
                    rotation: 180,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        } else {
            // Fallback CSS animations
            menu.style.visibility = 'visible';
            menu.style.opacity = '1';
            menu.style.transform = 'translateX(-50%) translateY(0)';
            
            if (arrow) {
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }

    /**
     * Hide dropdown menu with animation
     */
    hideDropdown(menu, arrow) {
        if (!menu) return;

        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            gsap.to(menu, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    if (menu) menu.style.visibility = 'hidden';
                }
            });
            
            if (arrow) {
                gsap.to(arrow, {
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            }
        } else {
            // Fallback CSS animations
            menu.style.opacity = '0';
            menu.style.transform = 'translateX(-50%) translateY(10px)';
            
            const hideTimer = setTimeout(() => {
                if (menu) menu.style.visibility = 'hidden';
            }, 300);
            this.timers.set('dropdown-hide', hideTimer);
            
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }

    /**
     * Active navigation highlighting based on scroll position
     */
    initNavigationHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        // Use Intersection Observer when supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.updateActiveNavigation(id, navLinks);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-100px 0px -50% 0px'
            });

            sections.forEach(section => observer.observe(section));
            this.observers.set('navigation', observer);
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            window.addEventListener('scroll', this.throttle(() => {
                let currentSection = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (window.pageYOffset >= sectionTop - 200 && 
                        window.pageYOffset < sectionTop + sectionHeight - 200) {
                        currentSection = section.getAttribute('id');
                    }
                });
                this.updateActiveNavigation(currentSection, navLinks);
            }, 100));
        }
    }

    /**
     * Update active navigation item
     */
    updateActiveNavigation(activeId, navLinks) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${activeId}`;
            const navItem = link.closest('.nav-item');
            
            if (navItem) {
                navItem.classList.toggle('active', isActive);
            }
        });
    }

    /**
     * Smooth scrolling for navigation links
     */
    initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    /**
     * Smooth scroll to target element
     */
    smoothScrollTo(target) {
        if (!target) return;

        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined' && gsap.plugins?.ScrollToPlugin) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: targetPosition,
                ease: 'power2.inOut'
            });
        } else {
            // Fallback smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ==============================
    // MOBILE MENU SYSTEM
    // ==============================
    
    /**
     * Initialize mobile menu functionality
     */
    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobileClose');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!mobileToggle || !mobileMenu) {
            console.warn('⚠️ Mobile menu elements not found');
            return;
        }

        // Toggle mobile menu
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Close mobile menu
        if (mobileClose) {
            mobileClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }

        // Close on overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Mobile dropdown functionality
        this.initMobileDropdowns();

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.state.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Toggle mobile menu state
     */
    toggleMobileMenu() {
        if (this.state.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu with animation
     */
    openMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenu) return;

        this.state.mobileMenuOpen = true;
        if (mobileToggle) mobileToggle.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate menu items
        this.animateMobileMenuItems(true);
    }

    /**
     * Close mobile menu with animation
     */
    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenu) return;

        this.state.mobileMenuOpen = false;
        if (mobileToggle) mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Animate menu items
        this.animateMobileMenuItems(false);
    }

    /**
     * Animate mobile menu items
     */
    animateMobileMenuItems(opening) {
        const menuItems = document.querySelectorAll('.mobile-nav-item');
        
        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined' && menuItems.length > 0 && opening) {
            gsap.from(menuItems, {
                x: 50,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }
    }

    /**
     * Initialize mobile dropdown functionality
     */
    initMobileDropdowns() {
        const dropdownItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.mobile-nav-link');
            const dropdown = item.querySelector('.mobile-dropdown');
            const arrow = item.querySelector('.mobile-nav-arrow i');
            
            if (!link || !dropdown) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const isActive = item.classList.contains('active');
                
                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherArrow = otherItem.querySelector('.mobile-nav-arrow i');
                        if (otherArrow && this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
                            gsap.to(otherArrow, {
                                rotation: 0,
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        }
                    }
                });
                
                // Toggle current dropdown
                item.classList.toggle('active');
                
                // Animate arrow
                if (arrow && this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
                    gsap.to(arrow, {
                        rotation: item.classList.contains('active') ? 90 : 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // ==============================
    // HERO SECTION SYSTEM
    // ==============================
    
    /**
     * Initialize hero section functionality
     */
    initHeroSection() {
        this.initVideoBackground();
        this.initHeroInteractions();
        this.initCounterAnimations();
        this.initParallaxEffects();
        this.initFloatingElements();
        this.initScrollIndicator();
        
        // Check and fix any missing images
        this.checkAndFixHeroImages();
    }

    /**
     * Check and fix hero section images
     */
    checkAndFixHeroImages() {
        // Fix header logo
        const headerLogo = document.getElementById('headerLogo');
        if (headerLogo && headerLogo.src.includes('placeholder-logo.png')) {
            headerLogo.src = 'https://placehold.co/200x100/DAA520/FFF?text=Evia+Aesthetics';
            headerLogo.setAttribute('data-fixed', 'true');
        }
        
        // Fix mobile logo
        const mobileLogo = document.querySelector('.mobile-logo img');
        if (mobileLogo && mobileLogo.src.includes('placeholder-logo.png')) {
            mobileLogo.src = 'https://placehold.co/200x100/DAA520/FFF?text=Evia';
            mobileLogo.setAttribute('data-fixed', 'true');
        }
    }

    /**
     * Start hero animations after preloader
     */
    startHeroAnimations() {
        // Check if the preloader is complete and libraries are loaded
        if (this.state.preloaderComplete) {
            if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
                // Small delay to ensure preloader is fully hidden
                setTimeout(() => {
                    this.animateHeroContent();
                    this.animateHeroVisual();
                }, 400);
            } else {
                // Apply simple CSS animations as fallback
                this.applyFallbackHeroAnimations();
            }
        }
    }

    /**
     * Apply fallback CSS animations for hero section
     */
    applyFallbackHeroAnimations() {
        const heroElements = [
            '.trust-badge', '.hero-title', '.hero-subtitle',
            '.feature-pills', '.hero-cta', '.social-proof',
            '.stats-card', '.floating-card'
        ];
        
        heroElements.forEach((selector, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                // Staggered animation
                setTimeout(() => {
                    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 200 + (index * 150));
            });
        });
    }

    /**
     * Initialize video background with fallbacks
     */
    initVideoBackground() {
        const video = document.getElementById('heroVideo');
        if (!video) {
            console.warn('⚠️ Hero video element not found');
            return;
        }

        // Set a fallback image in case video fails
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.backgroundImage = "url('https://placehold.co/1920x1080/654321/FFF?text=Evia+Aesthetics+Background')";
            heroSection.style.backgroundSize = "cover";
            heroSection.style.backgroundPosition = "center";
        }

        // Video event listeners
        video.addEventListener('loadstart', () => {
            console.log('📹 Video loading started');
        });

        video.addEventListener('canplay', () => {
            video.style.opacity = '1';
            video.classList.add('loaded');
            this.state.videoLoaded = true;
            
            // Hide background image once video is loaded
            if (heroSection) {
                heroSection.style.backgroundImage = "none";
            }
            
            console.log('📹 Video ready to play');
        });

        video.addEventListener('error', (e) => {
            console.warn('📹 Video error:', e);
            this.handleVideoError(video);
        });

        // Intersection observer for video playback
        this.observeVideoPlayback(video);

        // Auto-play with fallback
        this.playVideoWithFallback(video);
    }

    /**
     * Handle video playback with intersection observer
     */
    observeVideoPlayback(video) {
        if (!video || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.state.videoLoaded) {
                    video.play().catch((error) => {
                        console.log('📹 Auto-play prevented:', error);
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            observer.observe(heroSection);
            this.observers.set('video', observer);
        }
    }

    /**
     * Play video with auto-play fallback
     */
    async playVideoWithFallback(video) {
        if (!video) return;

        try {
            await video.play();
            console.log('📹 Video auto-play successful');
        } catch (error) {
            console.log('📹 Auto-play prevented, user interaction required');
            this.addVideoPlayButton(video);
        }
    }

    /**
     * Handle video errors with graceful fallback
     */
    handleVideoError(video) {
        const videoContainer = video?.closest('.video-container');
        const heroSection = document.querySelector('.hero-section');
        
        if (videoContainer) {
            videoContainer.style.background = 'linear-gradient(135deg, var(--warm-bronze) 0%, var(--deep-bronze) 100%)';
            console.log('📹 Video fallback: Using gradient background');
        }
        
        // Ensure hero still looks good
        if (heroSection) {
            heroSection.style.backgroundImage = "url('https://placehold.co/1920x1080/654321/FFF?text=Evia+Aesthetics+Background')";
            heroSection.style.backgroundSize = "cover";
            heroSection.style.backgroundPosition = "center";
        }
    }

    /**
     * Add play button for video if auto-play fails
     */
    addVideoPlayButton(video) {
        const videoContainer = video?.closest('.video-container');
        if (!videoContainer || videoContainer.querySelector('.video-play-button')) return;

        const playButton = document.createElement('div');
        playButton.className = 'video-play-button';
        playButton.innerHTML = `
            <div class="play-button" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                background: var(--primary-gradient);
                border-radius: 50%;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: var(--shadow-lg);
            ">
                <i class="fas fa-play" style="font-size: 24px; color: white; margin-left: 4px;"></i>
            </div>
            <span style="color: white; font-weight: 500;">Click to play video</span>
        `;

        // Style the play button container
        Object.assign(playButton.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });

        playButton.addEventListener('click', () => {
            video.play().then(() => {
                playButton.remove();
            }).catch(console.error);
        });

        // Hover effect
        const playBtn = playButton.querySelector('.play-button');
        playButton.addEventListener('mouseenter', () => {
            if (playBtn) playBtn.style.transform = 'scale(1.1)';
        });
        playButton.addEventListener('mouseleave', () => {
            if (playBtn) playBtn.style.transform = 'scale(1)';
        });

        videoContainer.appendChild(playButton);
    }

    /**
     * Animate hero content elements
     */
    animateHeroContent() {
        if (!this.state.librariesLoaded.gsap || typeof gsap === 'undefined') {
            this.applyFallbackHeroAnimations();
            return;
        }

        const trustBadge = document.querySelector('.trust-badge');
        const titleLines = document.querySelectorAll('.title-line');
        const subtitle = document.querySelector('.hero-subtitle');
        const pills = document.querySelectorAll('.pill');
        const ctaButtons = document.querySelectorAll('.hero-cta button');
        const socialProof = document.querySelector('.social-proof');

        const tl = gsap.timeline({ delay: 0.3 });

        if (trustBadge) {
            tl.from(trustBadge, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        if (titleLines.length > 0) {
            tl.from(titleLines, {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.4');
        }

        if (subtitle) {
            tl.from(subtitle, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6');
        }

        if (pills.length > 0) {
            tl.from(pills, {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4');
        }

        if (ctaButtons.length > 0) {
            tl.from(ctaButtons, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.4');
        }

        if (socialProof) {
            tl.from(socialProof, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6');
        }

        // Store timeline for cleanup
        this.animations.set('heroContent', tl);
    }

    /**
     * Animate hero visual elements
     */
    animateHeroVisual() {
        if (!this.state.librariesLoaded.gsap || typeof gsap === 'undefined') {
            return; // Fallback is handled in applyFallbackHeroAnimations
        }

        const statsCard = document.querySelector('.stats-card');
        const floatingCards = document.querySelectorAll('.floating-card');

        if (statsCard) {
            const statsAnimation = gsap.from(statsCard, {
                x: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.8
            });
            this.animations.set('statsCard', statsAnimation);
        }

        if (floatingCards.length > 0) {
            const cardsAnimation = gsap.from(floatingCards, {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)',
                delay: 1
            });
            this.animations.set('floatingCards', cardsAnimation);
        }
    }

    /**
     * Initialize hero interactions
     */
    initHeroInteractions() {
        // Primary CTA buttons
        const heroBookingBtn = document.getElementById('heroBookingBtn');
        const headerBookingBtn = document.getElementById('headerBookingBtn');
        const playVideoBtn = document.getElementById('playVideoBtn');
        const mobileBookingBtn = document.querySelector('.btn-mobile-appointment');

        // Booking button interactions
        [heroBookingBtn, headerBookingBtn, mobileBookingBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openAppointmentModal();
                    // Add ripple effect
                    this.createRippleEffect(e);
                });
            }
        });

        // Play video button
        if (playVideoBtn) {
            playVideoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleVideoPlayback();
            });
        }

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        }
    }

    /**
     * Handle video playback button
     */
    handleVideoPlayback() {
        const video = document.getElementById('heroVideo');
        if (video) {
            if (video.paused) {
                video.play().catch(console.error);
            } else {
                video.pause();
            }
        }
    }

    /**
     * Scroll to next section after hero
     */
    scrollToNextSection() {
        const heroSection = document.querySelector('.hero-section');
        const nextSection = heroSection?.nextElementSibling;
        
        if (nextSection) {
            this.smoothScrollTo(nextSection);
        } else {
            // If no next section, scroll down by one viewport
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Initialize counter animations
     */
    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        if (counters.length === 0) return;

        // Use IntersectionObserver for better performance when supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animated');
                        this.animateCounter(entry.target);
                    }
                });
            }, { threshold: 0.7 });

            counters.forEach(counter => observer.observe(counter));
            this.observers.set('counters', observer);
        } else {
            // Fallback for browsers without IntersectionObserver
            const checkVisibility = this.throttle(() => {
                counters.forEach(counter => {
                    if (this.isElementInViewport(counter) && !counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        this.animateCounter(counter);
                    }
                });
            }, 100);
            
            window.addEventListener('scroll', checkVisibility, { passive: true });
            // Initial check
            checkVisibility();
        }
    }

    /**
     * Animate counter with easing
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        if (isNaN(target)) return;
        
        const duration = 2000;
        const startTime = performance.now();
        let currentFrame;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                currentFrame = requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatCounterValue(target);
                cancelAnimationFrame(currentFrame);
            }
        };

        currentFrame = requestAnimationFrame(updateCounter);
    }

    /**
     * Format counter value with appropriate suffix
     */
    formatCounterValue(value) {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K+';
        } else if (value >= 95) {
            return value + '%';
        } else {
            return value + '+';
        }
    }

    /**
     * Initialize parallax effects
     */
    initParallaxEffects() {
        // Skip parallax effects on mobile devices for performance
        if (window.innerWidth < 768 || !('requestAnimationFrame' in window)) {
            return;
        }

        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            
            if (!heroSection) {
                ticking = false;
                return;
            }
            
            const heroHeight = heroSection.offsetHeight;
            const scrollPercent = Math.min(scrolled / heroHeight, 1);
            
            // Update parallax elements
            this.updateParallaxElements(scrollPercent);
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }

    /**
     * Update parallax elements based on scroll
     */
    updateParallaxElements(scrollPercent) {
        // Only run parallax on larger screens for performance
        if (window.innerWidth < 768) return;

        // Floating shapes
        const shapes = document.querySelectorAll('.shape');
        const orbs = document.querySelectorAll('.gradient-orb');
        const particles = document.querySelectorAll('.particle-system .particle');

        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const translateY = scrollPercent * 100 * speed;
            const rotate = scrollPercent * 10 * (index % 2 === 0 ? 1 : -1);
            shape.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
        });

        orbs.forEach((orb, index) => {
            const speed = 0.05 + (index * 0.02);
            const translateY = scrollPercent * 50 * speed;
            orb.style.transform = `translateY(${translateY}px)`;
        });

        particles.forEach((particle, index) => {
            const speed = 0.2 + (index * 0.1);
            const translateY = scrollPercent * 50 * speed;
            particle.style.transform = `translateY(${translateY}px)`;
        });

        // Hero content fade
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroContent) {
            const opacity = Math.max(0, 1 - scrollPercent * 1.5);
            heroContent.style.opacity = opacity;
        }
        
        if (heroVisual) {
            const translateY = scrollPercent * 30;
            const opacity = Math.max(0, 1 - scrollPercent * 1.2);
            heroVisual.style.transform = `translateY(${translateY}px)`;
            heroVisual.style.opacity = opacity;
        }
    }

    /**
     * Initialize floating elements animation
     */
    initFloatingElements() {
        // Skip on mobile for performance
        if (window.innerWidth < 768) {
            return;
        }
        
        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            const floatingElements = document.querySelectorAll(
                '.shape, .gradient-orb, .floating-card, .particle'
            );

            floatingElements.forEach((element, index) => {
                // Random floating animation
                const floatAnimation = gsap.to(element, {
                    y: (index % 2 === 0 ? 20 : -20) + Math.random() * 10,
                    x: (index % 3 === 0 ? 15 : -15) + Math.random() * 8,
                    rotation: (index % 2 === 0 ? 5 : -5) + Math.random() * 3,
                    duration: 4 + Math.random() * 4,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.2
                });
                
                this.animations.set(`float-${index}`, floatAnimation);
            });
        } else {
            // Fallback CSS animations
            this.applyFallbackFloatingAnimations();
        }
    }
    
    /**
     * Apply fallback floating animations using CSS
     */
    applyFallbackFloatingAnimations() {
        const floatingElements = document.querySelectorAll(
            '.shape, .gradient-orb, .floating-card, .particle'
        );
        
        floatingElements.forEach((element, index) => {
            // Apply random animation duration and delay with CSS
            const duration = 4 + Math.random() * 4;
            const delay = index * 0.2;
            const direction = index % 2 === 0 ? 'alternate' : 'alternate-reverse';
            
            element.style.animation = `float ${duration}s ${direction} infinite ease-in-out`;
            element.style.animationDelay = `${delay}s`;
        });
        
        // Inject required keyframes if they don't exist
        if (!document.getElementById('floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = `
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0); }
                    50% { transform: translate(10px, -15px) rotate(3deg); }
                    100% { transform: translate(0, 0) rotate(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Initialize scroll indicator animation
     */
    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        // Animate scroll indicator
        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            const scrollAnimation = gsap.to(scrollIndicator, {
                y: 10,
                duration: 1.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
            this.animations.set('scrollIndicator', scrollAnimation);
        } else {
            // Fallback CSS animation
            scrollIndicator.style.animation = 'scrollBounce 1.5s infinite ease-in-out alternate';
            
            // Add keyframes if needed
            if (!document.getElementById('scroll-indicator-keyframes')) {
                const style = document.createElement('style');
                style.id = 'scroll-indicator-keyframes';
                style.textContent = `
                    @keyframes scrollBounce {
                        from { transform: translateY(0); }
                        to { transform: translateY(10px); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Hide scroll indicator when scrolled
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero-section')?.offsetHeight || 0;
            const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.3)));
            
            scrollIndicator.style.opacity = opacity;
        }, { passive: true });
    }

    // ==============================
    // MODAL SYSTEM
    // ==============================
    
    /**
     * Initialize modal functionality
     */
    initModals() {
        this.initAppointmentModal();
    }

    /**
     * Initialize appointment modal
     */
    initAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        const closeBtn = document.getElementById('modalClose');
        const overlay = document.querySelector('.modal-overlay');
        const form = document.getElementById('appointmentForm');

        if (!modal) {
            console.warn('⚠️ Appointment modal not found');
            return;
        }

        // Close modal events
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeAppointmentModal();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeAppointmentModal();
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.modalOpen) {
                this.closeAppointmentModal();
            }
        });

        // Form field interactions
        this.initFormInteractions(form);
    }

    /**
     * Open appointment modal
     */
    openAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (!modal) return;

        this.state.modalOpen = true;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }

        // Animate modal opening
        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                gsap.from(modalContent, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            }
        }
    }

    /**
     * Close appointment modal
     */
    closeAppointmentModal() {
        const modal = document.getElementById('appointmentModal');
        if (!modal) return;

        this.state.modalOpen = false;
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form if needed
        const form = document.getElementById('appointmentForm');
        if (form && !form.classList.contains('success')) {
            form.reset();
            this.resetFormStates(form);
        }
    }

    /**
     * Reset form states
     */
    resetFormStates(form) {
        if (!form) return;

        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('focused', 'valid', 'invalid');
        });

        const submitBtn = form.querySelector('.form-submit');
        if (submitBtn) {
            submitBtn.classList.remove('loading', 'success', 'error');
        }
        
        // Remove any error messages
        const errorMessage = form.querySelector('.form-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Initialize form interactions
     */
    initFormInteractions(form) {
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Focus effects
            input.addEventListener('focus', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) formGroup.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) formGroup.classList.remove('focused');
                
                // Validate on blur
                this.validateFormField(input);
            });

            // Validation on input
            input.addEventListener('input', () => {
                this.validateFormField(input);
            });
        });
    }

    /**
     * Validate individual form field
     */
    validateFormField(field) {
        if (!field) return;

        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const isValid = field.checkValidity() && field.value.trim() !== '';
        
        formGroup.classList.toggle('valid', isValid);
        formGroup.classList.toggle('invalid', !isValid && field.value.trim() !== '');
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.form-submit');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            this.validateFormField(input);
            if (!input.checkValidity() || input.value.trim() === '') {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormError('Please fill in all required fields correctly.');
            return;
        }

        // Show loading state
        this.setFormSubmitState(submitBtn, 'loading');

        try {
            // Simulate API call
            await this.delay(1500);
            
            // Process form data (replace with actual API call)
            console.log('Form submitted:', data);
            
            // Show success state
            this.setFormSubmitState(submitBtn, 'success');
            this.showFormSuccessMessage(form);
            
            // Close modal after delay
            const closeTimer = setTimeout(() => {
                this.closeAppointmentModal();
                this.resetForm(form);
            }, 3000);
            this.timers.set('form-close', closeTimer);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.setFormSubmitState(submitBtn, 'error');
            this.showFormError('An error occurred. Please try again.');
        }
    }

    /**
     * Show form error message
     */
    showFormError(message) {
        // Remove any existing error messages first
        const existingError = document.querySelector('.form-error-message');
        if (existingError) existingError.remove();
        
        // Create new error message
        let errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            color: #dc3545;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 12px;
            border-radius: 8px;
            margin: 16px 0;
            font-size: 14px;
            text-align: center;
        `;
        errorDiv.textContent = message;
        
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }

        // Remove error after delay
        const errorTimer = setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) errorDiv.remove();
        }, 5000);
        this.timers.set('form-error', errorTimer);
    }

    /**
     * Set form submit button state
     */
    setFormSubmitState(button, state) {
        if (!button) return;

        // Remove all state classes
        button.classList.remove('loading', 'success', 'error');
        
        // Add new state class
        if (state !== 'normal') {
            button.classList.add(state);
        }
    }

    /**
     * Show form success message
     */
    showFormSuccessMessage(form) {
        if (!form) return;

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="success-icon" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                background: var(--primary-gradient);
                border-radius: 50%;
                margin: 0 auto 24px;
                color: white;
                font-size: 24px;
            ">
                <i class="fas fa-check"></i>
            </div>
            <h3 style="
                font-family: var(--font-display);
                font-size: 24px;
                color: var(--warm-bronze);
                margin-bottom: 16px;
                text-align: center;
            ">Appointment Requested!</h3>
            <p style="
                text-align: center;
                color: var(--muted-brown);
                line-height: 1.6;
            ">Thank you for your interest. We'll contact you within 24 hours to confirm your consultation.</p>
        `;

        // Replace form content
        form.innerHTML = '';
        form.appendChild(successMessage);
        form.classList.add('success');
    }

    /**
     * Reset form to initial state
     */
    resetForm(form) {
        if (!form) return;

        form.classList.remove('success');
        form.reset();
        
        // In a real implementation, you'd restore the original form HTML
        // For demonstration purposes, we'll just reload the page after a short delay
        const resetTimer = setTimeout(() => {
            // location.reload();
            // Instead of reloading, we'll just clear the form fields
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('focused', 'valid', 'invalid');
            });
        }, 500);
        this.timers.set('form-reset', resetTimer);
    }

    // ==============================
    // SCROLL EFFECTS SYSTEM
    // ==============================
    
    /**
     * Initialize scroll-based effects
     */
    initScrollEffects() {
        this.initRevealAnimations();
        this.initParallaxSections();
    }

    /**
     * Initialize reveal animations on scroll
     */
    initRevealAnimations() {
        const revealElements = document.querySelectorAll('[data-aos]');
        
        if (revealElements.length === 0) return;

        if (this.state.librariesLoaded.aos && typeof AOS !== 'undefined') {
            // AOS library is available
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                mirror: false,
                offset: 120,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
            
            // Refresh AOS on window resize
            window.addEventListener('resize', this.debounce(() => {
                AOS.refresh();
            }, 250));
            
        } else {
            // Fallback using Intersection Observer
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('aos-animate');
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                revealElements.forEach(element => {
                    // Set initial opacity to 0
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    observer.observe(element);
                });
                
                this.observers.set('reveal', observer);
            } else {
                // If Intersection Observer is not supported, make elements visible
                revealElements.forEach(element => {
                    element.classList.add('aos-animate');
                });
            }
        }
    }

    /**
     * Initialize parallax sections
     */
    initParallaxSections() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0 || window.innerWidth < 768) return;

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16), { passive: true });
    }

    // ==============================
    // ANIMATION LIBRARIES
    // ==============================
    
    /**
     * Initialize external animation libraries
     */
    initAnimationLibraries() {
        this.initGSAP();
        this.initAOS();
    }

    /**
     * Initialize GSAP if available
     */
    initGSAP() {
        if (typeof gsap !== 'undefined') {
            // Register plugins if available
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                console.log('✅ GSAP ScrollTrigger initialized');
            }
            
            if (typeof TextPlugin !== 'undefined') {
                gsap.registerPlugin(TextPlugin);
                console.log('✅ GSAP TextPlugin initialized');
            }

            this.state.librariesLoaded.gsap = true;
        } else {
            console.warn('⚠️ GSAP not loaded - using CSS fallbacks');
            this.state.librariesLoaded.gsap = false;
        }
    }

    /**
     * Initialize AOS if available
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            // AOS is initialized in the initRevealAnimations method
            this.state.librariesLoaded.aos = true;
            console.log('✅ AOS ready to initialize');
        } else {
            console.warn('⚠️ AOS not loaded - using CSS fallbacks');
            this.state.librariesLoaded.aos = false;
        }
    }

    // ==============================
    // PERFORMANCE OPTIMIZATIONS
    // ==============================
    
    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        this.initLazyLoading();
        this.initImageOptimization();
        this.optimizeForDevice();
        this.initCriticalResourceHints();
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;

        // Use Intersection Observer for better performance when supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
            this.observers.set('lazyImages', imageObserver);
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            });
        }
    }

    /**
     * Initialize image optimization
     */
    initImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Handle placeholder images
            if (img.src.includes('placeholder-logo.png') && !img.getAttribute('data-fixed')) {
                img.src = 'https://placehold.co/200x100/DAA520/FFF?text=Evia+Aesthetics';
                img.setAttribute('data-fixed', 'true');
            }
            
            // Add loading class and event handlers
            if (!img.classList.contains('loaded')) {
                img.classList.add('loading');
                
                img.addEventListener('load', () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });
                
                img.addEventListener('error', () => {
                    img.classList.remove('loading');
                    img.classList.add('error');
                    console.warn('Image failed to load:', img.src);
                    
                    // Set fallback image for broken links
                    if (!img.src.includes('placehold.co')) {
                        img.src = 'https://placehold.co/200x100/DAA520/FFF?text=Image+Not+Found';
                    }
                });
            }
        });
    }

    /**
     * Optimize for device capabilities
     */
    optimizeForDevice() {
        const isLowEndDevice = this.detectLowEndDevice();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isLowEndDevice || prefersReducedMotion || window.innerWidth < 768) {
            document.documentElement.classList.add('reduced-motion');
            
            // Disable heavy animations
            this.disableHeavyAnimations();
            
            console.log('🔧 Reduced motion enabled for better performance');
        }
    }

    /**
     * Disable heavy animations for performance
     */
    disableHeavyAnimations() {
        const heavyElements = document.querySelectorAll('.floating-shapes, .particle-system, .gradient-orb');
        heavyElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    /**
     * Detect low-end device
     */
    detectLowEndDevice() {
        // Check for low-end device indicators
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const connection = navigator.connection;
        
        const isLowEnd = cores < 4 || memory < 4 || 
                        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'));
        
        return isLowEnd;
    }

    /**
     * Initialize critical resource hints
     */
    initCriticalResourceHints() {
        // Critical CSS should be inlined in the head
        // Add preconnect for performance
        const criticalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ];
        
        criticalDomains.forEach(domain => {
            if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                document.head.appendChild(link);
            }
        });
    }

    // ==============================
    // ACCESSIBILITY FEATURES
    // ==============================
    
    /**
     * Initialize accessibility features
     */
    initAccessibility() {
        this.initKeyboardNavigation();
        this.initFocusManagement();
        this.initARIAEnhancements();
        this.initReducedMotionSupport();
    }

    /**
     * Initialize keyboard navigation
     */
    initKeyboardNavigation() {
        // Tab navigation for dropdowns
        const dropdownTriggers = document.querySelectorAll('.nav-item.dropdown .nav-link');
        
        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const dropdown = trigger.nextElementSibling;
                    if (dropdown) {
                        const isVisible = dropdown.style.visibility === 'visible';
                        if (isVisible) {
                            this.hideDropdown(dropdown, trigger.querySelector('.nav-arrow'));
                        } else {
                            this.showDropdown(dropdown, trigger.querySelector('.nav-arrow'));
                        }
                    }
                }
            });
        });
    }

    /**
     * Initialize focus management
     */
    initFocusManagement() {
        // Focus trap for modals
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(e, modal);
                }
            });
        });
    }

    /**
     * Trap focus within element
     */
    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable?.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable?.focus();
                e.preventDefault();
            }
        }
    }

    /**
     * Initialize ARIA enhancements
     */
    initARIAEnhancements() {
        // Add ARIA labels to interactive elements
        const interactiveElements = document.querySelectorAll('button:not([aria-label])');
        
        interactiveElements.forEach(element => {
            const text = element.textContent?.trim();
            if (text) {
                element.setAttribute('aria-label', text);
            }
        });

        // Add ARIA expanded to dropdown triggers
        const dropdownTriggers = document.querySelectorAll('.nav-item.dropdown .nav-link');
        dropdownTriggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-haspopup', 'true');
        });
    }

    /**
     * Initialize reduced motion support
     */
    initReducedMotionSupport() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (e) => {
            if (e.matches) {
                document.documentElement.classList.add('reduced-motion');
                this.disableHeavyAnimations();
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        };
        
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleReducedMotion);
        } else if (mediaQuery.addListener) {
            // For older browsers
            mediaQuery.addListener(handleReducedMotion);
        }
        
        handleReducedMotion(mediaQuery);
    }

    // ==============================
    // EVENT LISTENERS
    // ==============================
    
    /**
     * Bind global event listeners
     */
    bindEventListeners() {
        // Scroll events
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Resize events
        window.addEventListener('resize', this.handleResize);
        
        // Visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Before unload
        window.addEventListener('beforeunload', () => this.cleanup());

        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        // Don't break the app on errors
        return false; // Allow default error handling to continue
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        // Throttled scroll handling is already implemented in individual functions
        // This method exists for potential future scroll-based features
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Refresh ScrollTrigger if available
        if (this.state.librariesLoaded.gsap && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Refresh AOS if available
        if (this.state.librariesLoaded.aos && typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Close mobile menu on desktop
        if (window.innerWidth >= 768 && this.state.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update mobile optimization
        this.optimizeForDevice();
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        const video = document.getElementById('heroVideo');
        
        if (document.hidden) {
            // Page is hidden, pause video
            if (video && !video.paused) {
                video.pause();
            }
            
            // Pause any GSAP animations for performance
            if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
                gsap.globalTimeline.pause();
            }
        } else {
            // Page is visible, resume video if in viewport
            if (video && this.isElementInViewport(video) && this.state.videoLoaded) {
                video.play().catch(() => {});
            }
            
            // Resume GSAP animations
            if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
                gsap.globalTimeline.play();
            }
        }
    }

    // ==============================
    // UTILITY FUNCTIONS
    // ==============================
    
    /**
     * Create ripple effect on click
     */
    createRippleEffect(e) {
        const button = e.currentTarget;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Ensure button has relative positioning
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        
        button.appendChild(ripple);
        
        const removeTimer = setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
        this.timers.set(`ripple-${Date.now()}`, removeTimer);
    }

    /**
     * Check if element is in viewport
     */
    isElementInViewport(element) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Throttle function
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
     * Debounce function
     */
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

    /**
     * Delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Log performance metrics
     */
    logPerformanceMetrics() {
        if (typeof performance !== 'undefined' && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log(`📊 Performance Metrics:
                DOM Ready: ${domReadyTime}ms
                Load Time: ${loadTime}ms
                User Agent: ${navigator.userAgent.slice(0, 50)}...`);
        }
    }

    /**
     * Cleanup function
     */
    cleanup() {
        console.log('🧹 Cleaning up Evia Aesthetics App...');

        // Clear all observers
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        this.observers.clear();
        
        // Clear all timers
        this.timers.forEach(timer => {
            clearTimeout(timer);
            clearInterval(timer);
        });
        this.timers.clear();
        
        // Kill GSAP animations
        if (this.state.librariesLoaded.gsap && typeof gsap !== 'undefined') {
            this.animations.forEach(animation => {
                if (animation && typeof animation.kill === 'function') {
                    animation.kill();
                }
            });
            
            gsap.killTweensOf('*');
            
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.killAll();
            }
        }
        this.animations.clear();
        
        // Reset body styles
        document.body.style.overflow = '';
        
        console.log('✅ Cleanup completed');
    }

    // ==============================
    // PUBLIC API
    // ==============================
    
    /**
     * Public methods for external access
     */
    openModal() {
        this.openAppointmentModal();
    }

    closeModal() {
        this.closeAppointmentModal();
    }

    refresh() {
        this.handleResize();
        return this;
    }

    destroy() {
        this.cleanup();
        return null;
    }

    getState() {
        return { ...this.state };
    }
}

// ==============================
// INITIALIZE APPLICATION
// ==============================

// Create global instance
let eviaApp;

// Initialize when DOM is ready
try {
    // Add critical CSS keyframes for animations that might be used before full CSS is loaded
    const addCriticalKeyframes = () => {
        if (!document.getElementById('critical-keyframes')) {
            const style = document.createElement('style');
            style.id = 'critical-keyframes';
            style.textContent = `
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(4); opacity: 0; }
                }
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0); }
                    50% { transform: translate(10px, -15px) rotate(3deg); }
                    100% { transform: translate(0, 0) rotate(0); }
                }
                @keyframes scrollBounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(10px); }
                }
                @keyframes progressFill {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes progressShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes logoGlow {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
                }
                @keyframes logoReveal {
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes textFade {
                    to { opacity: 1; }
                }
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(10px, -10px); }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Add critical keyframes immediately
    addCriticalKeyframes();

    // Initialize the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            eviaApp = new EviaAestheticsApp();
        });
    } else {
        eviaApp = new EviaAestheticsApp();
    }
} catch (error) {
    console.error('Failed to initialize Evia Aesthetics App:', error);
    // Set a basic error handler at the global level
    window.addEventListener('DOMContentLoaded', () => {
        document.body.classList.remove('loading');
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
    });
}

// ==============================
// GLOBAL API
// ==============================

// Export for global access
window.EviaAesthetics = {
    app: () => eviaApp,
    openModal: () => eviaApp?.openModal(),
    closeModal: () => eviaApp?.closeModal(),
    refresh: () => eviaApp?.refresh(),
    destroy: () => eviaApp?.destroy(),
    getState: () => eviaApp?.getState()
};

        
