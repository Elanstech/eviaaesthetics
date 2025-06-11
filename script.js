/*
* Evia Aesthetics - Professional Website JavaScript
* Created for: Evia Aesthetics Medspa
* Version: 3.0 - Ultra-Modern Interactive Features
* Last Updated: 2025-06-11
*/

'use strict';

// ==============================
// EVIA AESTHETICS APP CLASS
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
            preloaderComplete: false
        };
        
        // Bind methods
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
        
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
        
        if (!preloader) return;

        const loadingSteps = [
            { progress: 0, text: 'Initializing...' },
            { progress: 20, text: 'Loading assets...' },
            { progress: 40, text: 'Preparing interface...' },
            { progress: 60, text: 'Optimizing experience...' },
            { progress: 80, text: 'Finalizing details...' },
            { progress: 100, text: 'Welcome to Evia!' }
        ];

        // Simulate loading with realistic timing
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
            
            // Wait before next step
            await this.delay(300 + Math.random() * 200);
        }

        // Additional delay for smooth transition
        await this.delay(800);

        // Hide preloader
        this.hidePreloader(preloader);
    }

    /**
     * Hide preloader with smooth animation
     */
    hidePreloader(preloader) {
        preloader.classList.add('fade-out');
        document.body.classList.remove('loading');
        
        setTimeout(() => {
            preloader.style.display = 'none';
            this.state.preloaderComplete = true;
            this.startHeroAnimations();
        }, 800);
    }

    // ==============================
    // NAVIGATION SYSTEM
    // ==============================
    
    /**
     * Initialize header and navigation
     */
    initNavigation() {
        const header = document.getElementById('siteHeader');
        if (!header) return;

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
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset > 50;
            
            if (scrolled !== this.state.scrolled) {
                this.state.scrolled = scrolled;
                header.classList.toggle('scrolled', scrolled);
                
                // Animate logo size change
                this.animateLogoTransition(scrolled);
            }
        }, { passive: true });
    }

    /**
     * Animate logo transition on scroll
     */
    animateLogoTransition(scrolled) {
        const logo = document.querySelector('.header-logo .logo');
        if (!logo || typeof gsap === 'undefined') return;

        gsap.to(logo, {
            scale: scrolled ? 0.85 : 1,
            duration: 0.3,
            ease: 'power2.out'
        });
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

            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);
                this.showDropdown(menu, arrow);
            });

            item.addEventListener('mouseleave', () => {
                hoverTimer = setTimeout(() => {
                    this.hideDropdown(menu, arrow);
                }, 150);
            });
        });

        // Active navigation highlighting
        this.initNavigationHighlighting();
    }

    /**
     * Show dropdown menu with animation
     */
    showDropdown(menu, arrow) {
        if (typeof gsap !== 'undefined') {
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
            menu.style.visibility = 'visible';
            menu.style.opacity = '1';
            menu.style.transform = 'translateX(-50%) translateY(0)';
        }
    }

    /**
     * Hide dropdown menu with animation
     */
    hideDropdown(menu, arrow) {
        if (typeof gsap !== 'undefined') {
            gsap.to(menu, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    menu.style.visibility = 'hidden';
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
            menu.style.opacity = '0';
            menu.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => {
                menu.style.visibility = 'hidden';
            }, 300);
        }
    }

    /**
     * Active navigation highlighting based on scroll position
     */
    initNavigationHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

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
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: targetPosition,
                ease: 'power2.inOut'
            });
        } else {
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
        
        if (!mobileToggle || !mobileMenu) return;

        // Toggle mobile menu
        mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu
        mobileClose?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Close on overlay click
        mobileOverlay?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Mobile dropdown functionality
        this.initMobileDropdowns();

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.mobileMenuOpen) {
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
        
        this.state.mobileMenuOpen = true;
        mobileToggle?.classList.add('active');
        mobileMenu?.classList.add('active');
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
        
        this.state.mobileMenuOpen = false;
        mobileToggle?.classList.remove('active');
        mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';

        // Animate menu items
        this.animateMobileMenuItems(false);
    }

    /**
     * Animate mobile menu items
     */
    animateMobileMenuItems(opening) {
        const menuItems = document.querySelectorAll('.mobile-nav-item');
        
        if (typeof gsap !== 'undefined' && menuItems.length > 0) {
            if (opening) {
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
    }

    /**
     * Initialize mobile dropdown functionality
     */
    initMobileDropdowns() {
        const dropdownItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('.mobile-nav-link');
            const dropdown = item.querySelector('.mobile-dropdown');
            const arrow = item.querySelector('.mobile-nav-arrow');
            
            if (!link || !dropdown) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const isActive = item.classList.contains('active');
                
                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                item.classList.toggle('active');
                
                // Animate arrow
                if (arrow && typeof gsap !== 'undefined') {
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
    }

    /**
     * Start hero animations after preloader
     */
    startHeroAnimations() {
        if (typeof gsap !== 'undefined') {
            this.animateHeroContent();
            this.animateHeroVisual();
        }
    }

    /**
     * Initialize video background with fallbacks
     */
    initVideoBackground() {
        const video = document.getElementById('heroVideo');
        if (!video) return;

        // Video event listeners
        video.addEventListener('loadstart', () => {
            console.log('📹 Video loading started');
        });

        video.addEventListener('canplay', () => {
            video.style.opacity = '1';
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
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        console.log('📹 Auto-play prevented');
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
        try {
            await video.play();
            console.log('📹 Video auto-play successful');
        } catch (error) {
            console.log('📹 Auto-play prevented, adding user interaction handler');
            this.addVideoPlayButton(video);
        }
    }

    /**
     * Handle video errors with graceful fallback
     */
    handleVideoError(video) {
        const videoContainer = video.closest('.video-container');
        if (videoContainer) {
            videoContainer.style.background = 'linear-gradient(135deg, var(--warm-bronze) 0%, var(--deep-bronze) 100%)';
        }
    }

    /**
     * Add play button for video if auto-play fails
     */
    addVideoPlayButton(video) {
        const videoContainer = video.closest('.video-container');
        if (!videoContainer || videoContainer.querySelector('.video-play-button')) return;

        const playButton = document.createElement('div');
        playButton.className = 'video-play-button';
        playButton.innerHTML = `
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
            <span>Click to play video</span>
        `;

        // Style the play button
        Object.assign(playButton.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10',
            textAlign: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });

        playButton.addEventListener('click', () => {
            video.play().then(() => {
                playButton.remove();
            }).catch(console.error);
        });

        videoContainer.appendChild(playButton);
    }

    /**
     * Animate hero content elements
     */
    animateHeroContent() {
        const trustBadge = document.querySelector('.trust-badge');
        const titleLines = document.querySelectorAll('.title-line');
        const subtitle = document.querySelector('.hero-subtitle');
        const pills = document.querySelectorAll('.pill');
        const ctaButtons = document.querySelectorAll('.hero-cta button');
        const socialProof = document.querySelector('.social-proof');

        const tl = gsap.timeline({ delay: 0.5 });

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
    }

    /**
     * Animate hero visual elements
     */
    animateHeroVisual() {
        const statsCard = document.querySelector('.stats-card');
        const floatingCards = document.querySelectorAll('.floating-card');

        if (statsCard) {
            gsap.from(statsCard, {
                x: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 1
            });
        }

        if (floatingCards.length > 0) {
            gsap.from(floatingCards, {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)',
                delay: 1.2
            });
        }
    }

    /**
     * Initialize hero interactions
     */
    initHeroInteractions() {
        // Primary CTA button
        const heroBookingBtn = document.getElementById('heroBookingBtn');
        const headerBookingBtn = document.getElementById('headerBookingBtn');
        const playVideoBtn = document.getElementById('playVideoBtn');

        // Booking button interactions
        [heroBookingBtn, headerBookingBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.openAppointmentModal();
                });

                // Add ripple effect
                btn.addEventListener('click', this.createRippleEffect.bind(this));
            }
        });

        // Play video button
        if (playVideoBtn) {
            playVideoBtn.addEventListener('click', () => {
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
                video.play();
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
        }
    }

    /**
     * Initialize counter animations
     */
    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        if (counters.length === 0) return;

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
    }

    /**
     * Animate counter with easing
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatCounterValue(target);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    /**
     * Format counter value with appropriate suffix
     */
    formatCounterValue(value) {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K+';
        } else if (value === 98) {
            return value + '%';
        } else {
            return value + '+';
        }
    }

    /**
     * Initialize parallax effects
     */
    initParallaxEffects() {
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
        if (typeof gsap === 'undefined') return;

        const floatingElements = document.querySelectorAll(
            '.shape, .gradient-orb, .floating-card, .particle'
        );

        floatingElements.forEach((element, index) => {
            // Random floating animation
            gsap.to(element, {
                y: (index % 2 === 0 ? 20 : -20) + Math.random() * 10,
                x: (index % 3 === 0 ? 15 : -15) + Math.random() * 8,
                rotation: (index % 2 === 0 ? 5 : -5) + Math.random() * 3,
                duration: 4 + Math.random() * 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: index * 0.2
            });
        });
    }

    /**
     * Initialize scroll indicator animation
     */
    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        // Animate scroll indicator
        if (typeof gsap !== 'undefined') {
            gsap.to(scrollIndicator, {
                y: 10,
                duration: 1.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
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

        if (!modal) return;

        // Close modal events
        closeBtn?.addEventListener('click', () => this.closeAppointmentModal());
        overlay?.addEventListener('click', () => this.closeAppointmentModal());

        // Form submission
        form?.addEventListener('submit', (e) => this.handleFormSubmission(e));

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

        // Animate modal opening
        if (typeof gsap !== 'undefined') {
            const modalContent = modal.querySelector('.modal-content');
            gsap.from(modalContent, {
                scale: 0.9,
                opacity: 0,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
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
                formGroup?.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                formGroup?.classList.remove('focused');
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
        const formGroup = field.closest('.form-group');
        const isValid = field.checkValidity();
        
        formGroup?.classList.toggle('valid', isValid);
        formGroup?.classList.toggle('invalid', !isValid);
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

        // Show loading state
        this.setFormSubmitState(submitBtn, 'loading');

        try {
            // Simulate API call
            await this.delay(2000);
            
            // Process form data (replace with actual API call)
            console.log('Form submitted:', data);
            
            // Show success state
            this.setFormSubmitState(submitBtn, 'success');
            this.showFormSuccessMessage(form);
            
            // Close modal after delay
            setTimeout(() => {
                this.closeAppointmentModal();
                this.resetForm(form);
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.setFormSubmitState(submitBtn, 'error');
        }
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
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Appointment Requested!</h3>
            <p>Thank you for your interest. We'll contact you within 24 hours to confirm your consultation.</p>
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
        // This would restore the original form HTML
        // For demo purposes, just reload the page or restore form fields
        setTimeout(() => {
            form.classList.remove('success');
            // In a real implementation, you'd restore the original form HTML
        }, 500);
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

        revealElements.forEach(element => observer.observe(element));
        this.observers.set('reveal', observer);
    }

    /**
     * Initialize parallax sections
     */
    initParallaxSections() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
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
            // Register plugins
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
            
            if (typeof TextPlugin !== 'undefined') {
                gsap.registerPlugin(TextPlugin);
            }

            console.log('✅ GSAP initialized');
        }
    }

    /**
     * Initialize AOS if available
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                mirror: false,
                offset: 120,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });

            console.log('✅ AOS initialized');
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

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
        this.observers.set('lazyImages', imageObserver);
    }

    /**
     * Initialize image optimization
     */
    initImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.add('error');
                console.warn('Image failed to load:', img.src);
            });
        });
    }

    /**
     * Optimize for device capabilities
     */
    optimizeForDevice() {
        const isLowEndDevice = this.detectLowEndDevice();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isLowEndDevice || prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
            console.log('🔧 Reduced motion enabled for better performance');
        }

        // Disable heavy animations on mobile
        if (window.innerWidth < 768) {
            document.documentElement.classList.add('mobile-optimized');
        }
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
        // Preload critical resources
        const criticalResources = [
            { href: 'logo1.png', as: 'image' },
            { href: 'spa-video.mp4', as: 'video' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
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
                        dropdown.classList.toggle('show');
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
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
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
            const text = element.textContent.trim();
            if (text) {
                element.setAttribute('aria-label', text);
            }
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
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        };
        
        mediaQuery.addListener(handleReducedMotion);
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
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Before unload
        window.addEventListener('beforeunload', this.cleanup.bind(this));
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        // Throttled scroll handling is already implemented in individual functions
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Refresh ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Refresh AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
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
            video?.pause();
        } else {
            // Page is visible, resume video if in viewport
            if (video && this.isElementInViewport(video)) {
                video.play().catch(() => {});
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
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Check if element is in viewport
     */
    isElementInViewport(element) {
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
        if (typeof performance !== 'undefined') {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log(`📊 Performance Metrics:
                DOM Ready: ${domReadyTime}ms
                Load Time: ${loadTime}ms
                Browser: ${navigator.userAgent}`);
        }
    }

    /**
     * Cleanup function
     */
    cleanup() {
        // Clear all observers
        this.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        // Clear all timers
        this.timers.forEach(timer => {
            clearTimeout(timer);
            clearInterval(timer);
        });
        
        // Kill GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('*');
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.killAll();
            }
        }
        
        console.log('🧹 Cleanup completed');
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
    }

    destroy() {
        this.cleanup();
    }
}

// ==============================
// INITIALIZE APPLICATION
// ==============================

// Create global instance
let eviaApp;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        eviaApp = new EviaAestheticsApp();
    });
} else {
    eviaApp = new EviaAestheticsApp();
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
    destroy: () => eviaApp?.destroy()
};

// ==============================
// DEVELOPER TOOLS
// ==============================

// Development helpers
if (typeof console !== 'undefined') {
    console.log(
        '%c🎨 Evia Aesthetics %c3.0 %cLoaded Successfully',
        'color: #F4A024; font-weight: bold; font-size: 16px;',
        'color: #FCF8F5; font-weight: bold; background: #5A3925; padding: 2px 6px; border-radius: 3px;',
        'color: #68b984; font-weight: normal;'
    );
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaAestheticsApp;
}
