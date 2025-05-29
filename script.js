/*
* Evia Aesthetics - Modern Website JavaScript
* Created by: Elanstech
* Version: 2.0 - Enhanced with Modern Hero Section
* Last Updated: 2025-05-29 14:36:00
*/

// ==============================
// Core Application Class
// ==============================
class EviaAestheticsApp {
    constructor() {
        this.isLoaded = false;
        this.animations = {};
        this.observers = {};
        
        this.init();
    }

    init() {
        // Wait for the DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Initialize all components in order
        this.initPreloader();
        this.initNavigation();
        this.initAnimations();
        this.initModernHero();
        this.initTestimonialSlider();
        this.initModalHandlers();
        this.initScrollEffects();
        this.initPerformanceOptimizations();
        
        // Mark as loaded
        this.isLoaded = true;
        
        // Log initialization
        console.log('🎨 Evia Aesthetics website initialized with modern features');
        this.logBrowserCapabilities();
    }

    /**
     * Handle preloader and page loading animations
     */
    initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;
        
        // Fade out preloader when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                    
                    // Start any animations that should run after page load
                    this.animateHeroElements();
                }, 600);
            }, 1500);
        });
        
        // Fallback to hide preloader if load event doesn't fire
        setTimeout(() => {
            if (preloader.style.opacity !== '0') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                    this.animateHeroElements();
                }, 600);
            }
        }, 5000);
    }

    /**
     * Initialize header, navigation, and mobile menu
     */
    initNavigation() {
        const header = document.querySelector('.site-header');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileDropdownItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
        const navDropdownItems = document.querySelectorAll('.nav-item.dropdown');
        
        if (!header) return;
        
        // Handle scroll effects on header
        const handleHeaderScroll = this.throttle(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        
        // Force initial check in case page is loaded scrolled down
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // Mobile menu toggle
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                const isActive = mobileToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                this.animateMobileToggle(mobileToggle, isActive);
            });
        }
        
        // Mobile dropdowns
        mobileDropdownItems.forEach(item => {
            const link = item.querySelector('a');
            const dropdown = item.querySelector('.mobile-dropdown');
            
            if (link && dropdown) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                    this.animateMobileDropdown(dropdown, item.classList.contains('active'));
                });
            }
        });
        
        // Desktop dropdowns
        navDropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const menu = item.querySelector('.dropdown-menu');
            const icon = link?.querySelector('i');
            
            if (!menu) return;
            
            item.addEventListener('mouseenter', () => {
                this.animateDesktopDropdown(menu, icon, true);
            });
            
            item.addEventListener('mouseleave', () => {
                this.animateDesktopDropdown(menu, icon, false);
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu?.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    animateMobileToggle(toggle, isActive) {
        const spans = toggle.querySelectorAll('span');
        if (typeof gsap !== 'undefined') {
            if (isActive) {
                gsap.to(spans[0], { rotation: 45, y: 9, duration: 0.3 });
                gsap.to(spans[1], { opacity: 0, duration: 0.3 });
                gsap.to(spans[2], { rotation: -45, y: -9, duration: 0.3 });
            } else {
                gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
            }
        }
    }

    animateMobileDropdown(dropdown, isOpen) {
        if (typeof gsap !== 'undefined') {
            if (isOpen) {
                dropdown.style.display = 'block';
                dropdown.style.height = '0';
                const height = dropdown.scrollHeight;
                gsap.to(dropdown, {
                    height: height,
                    opacity: 1,
                    duration: 0.3,
                    onComplete: () => dropdown.style.height = 'auto'
                });
            } else {
                gsap.to(dropdown, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        dropdown.style.display = 'none';
                        dropdown.style.height = 'auto';
                    }
                });
            }
        } else {
            dropdown.style.display = isOpen ? 'block' : 'none';
        }
    }

    animateDesktopDropdown(menu, icon, isEntering) {
        if (typeof gsap !== 'undefined') {
            if (isEntering) {
                gsap.to(menu, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                if (icon) {
                    gsap.to(icon, { rotation: 180, duration: 0.3, ease: 'power2.out' });
                }
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    visibility: 'hidden',
                    duration: 0.3,
                    ease: 'power2.in'
                });
                if (icon) {
                    gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.in' });
                }
            }
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            this.animateMobileToggle(mobileToggle, false);
        }
    }

    /**
     * Initialize GSAP and AOS animations
     */
    initAnimations() {
        // Initialize GSAP ScrollTrigger if available
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: false,
                mirror: false,
                offset: 50,
                delay: 0
            });
        }
        
        // Animate elements that come into view
        this.initScrollAnimations();
        
        // Initialize back to top button
        this.initBackToTop();
        
        // Add floating animations to decorative elements
        this.initFloatingElements();
        
        // Initialize image reveal animations
        this.initImageReveal();
    }

    initScrollAnimations() {
        const fadeInElements = document.querySelectorAll('.fade-in:not([data-aos])');
        
        if (typeof gsap !== 'undefined') {
            fadeInElements.forEach(element => {
                gsap.from(element, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        } else {
            // Fallback animation without GSAP
            this.observeElements(fadeInElements, (element) => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }
    }

    initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;
        
        const toggleButton = this.throttle(() => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        }, 100);
        
        window.addEventListener('scroll', toggleButton, { passive: true });
        
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Animate hero elements on page load
     */
    animateHeroElements() {
        // Ensure video plays
        const heroVideo = document.getElementById('hero-video') || document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.play().catch(error => {
                console.log('Auto-play was prevented:', error);
            });
        }
        
        // Trigger any additional hero animations
        this.triggerHeroAnimations();
    }

    triggerHeroAnimations() {
        // Animate hero content elements
        const heroElements = document.querySelectorAll('.hero-content > *');
        
        if (typeof gsap !== 'undefined' && heroElements.length > 0) {
            gsap.from(heroElements, {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 0.5
            });
        }
    }

    /**
     * Modern Hero Section JavaScript with Advanced Features
     */
    initModernHero() {
        // Initialize all modern features
        this.initVideoEnhancements();
        this.initCounterAnimations();
        this.initParallaxEffects();
        this.initMouseFollowEffects();
        this.initScrollIndicator();
        this.initButtonInteractions();
        this.initFloatingElements();
        this.initParticleSystem();
        
        console.log('🎬 Modern hero section initialized');
    }

    // Enhanced Video Handling
    initVideoEnhancements() {
        const heroVideos = document.querySelectorAll('#hero-video, .hero-video');
        
        heroVideos.forEach(heroVideo => {
            if (!heroVideo) return;
            
            // Preload and optimize video
            heroVideo.addEventListener('loadstart', () => {
                console.log('📹 Video loading started');
            });
            
            heroVideo.addEventListener('canplay', () => {
                heroVideo.style.opacity = '1';
                heroVideo.style.transition = 'opacity 2s ease';
                console.log('📹 Video ready to play');
            });
            
            // Auto-play with fallback
            this.playVideoWithFallback(heroVideo);
            
            // Performance optimization with Intersection Observer
            this.observeVideoPlayback(heroVideo);
        });
    }

    async playVideoWithFallback(video) {
        try {
            await video.play();
            console.log('📹 Video auto-play successful');
        } catch (error) {
            console.log('📹 Auto-play prevented, adding play button');
            this.addPlayButton(video);
        }
    }

    observeVideoPlayback(video) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.1 });
            
            const heroSection = document.querySelector('.hero-section, .modern-hero');
            if (heroSection) {
                observer.observe(heroSection);
            }
        }
    }

    // Animated Counter for Stats
    initCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-count]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                    this.formatCounterValue(element, target);
                }
            };

            updateCounter();
        };

        this.observeElements(counterElements, (element) => {
            if (!element.classList.contains('animated')) {
                element.classList.add('animated');
                setTimeout(() => animateCounter(element), 500);
            }
        }, { threshold: 0.7 });
    }

    formatCounterValue(element, target) {
        // Add formatting for different types of numbers
        if (target >= 1000) {
            element.textContent = (target / 1000).toFixed(target >= 1000 ? 1 : 0) + 'K+';
        } else if (target === 98) {
            element.textContent = target + '%';
        } else {
            element.textContent = target + '+';
        }
    }

    // Advanced Parallax Effects
    initParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section, .modern-hero');
            
            if (!heroSection) {
                ticking = false;
                return;
            }
            
            const heroHeight = heroSection.offsetHeight;
            const scrollPercent = Math.min(scrolled / heroHeight, 1);
            
            // Parallax for decorative elements
            this.updateParallaxElements(scrollPercent);
            
            // Fade out hero content
            this.updateHeroContentOpacity(scrollPercent);
            
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

    updateParallaxElements(scrollPercent) {
        // Update floating elements
        const floatingElements = document.querySelectorAll('.float-element, .element-1, .element-2, .element-3, .element-4');
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const translateY = scrollPercent * 100 * speed;
            const rotate = scrollPercent * 10 * (index % 2 === 0 ? 1 : -1);
            element.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
        });

        // Update traditional parallax elements
        const shapes = document.querySelectorAll('.shape');
        const orbs = document.querySelectorAll('.gradient-orb');
        const rays = document.querySelectorAll('.light-ray');
        
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const translateY = scrollPercent * 100 * speed;
            shape.style.transform = `translateY(${translateY}px) rotate(${15 + translateY * 0.1}deg)`;
        });
        
        orbs.forEach((orb, index) => {
            const speed = 0.05 + (index * 0.02);
            const translateY = scrollPercent * 50 * speed;
            orb.style.transform = `translateY(${translateY}px)`;
        });
        
        rays.forEach((ray, index) => {
            const speed = 0.15 + (index * 0.1);
            const translateY = scrollPercent * 80 * speed;
            ray.style.transform = `translateY(${translateY}px) rotate(${15 + translateY * 0.2}deg)`;
        });

        // Update particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = 0.2 + (index * 0.1);
            const translateY = scrollPercent * 50 * speed;
            particle.style.transform = `translateY(${translateY}px)`;
        });
    }

    updateHeroContentOpacity(scrollPercent) {
        const heroContent = document.querySelector('.hero-content-area, .hero-content');
        const statsPanel = document.querySelector('.stats-panel, .stats-card');
        
        if (heroContent) {
            const opacity = Math.max(0, 1 - scrollPercent * 1.5);
            heroContent.style.opacity = opacity;
        }
        
        if (statsPanel) {
            const translateY = scrollPercent * 30;
            const opacity = Math.max(0, 1 - scrollPercent * 1.2);
            statsPanel.style.transform = `translateY(${translateY}px)`;
            statsPanel.style.opacity = opacity;
        }
    }

    // Mouse Follow Effects
    initMouseFollowEffects() {
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            isMoving = true;
        });
        
        const animateMouseFollow = () => {
            if (isMoving) {
                this.updateMouseFollowElements(mouseX, mouseY);
                isMoving = false;
            }
            requestAnimationFrame(animateMouseFollow);
        };
        
        animateMouseFollow();
    }

    updateMouseFollowElements(mouseX, mouseY) {
        const orbs = document.querySelectorAll('.gradient-orb');
        const shapes = document.querySelectorAll('.shape, .float-element');
        const gradientMesh = document.querySelector('.gradient-mesh');
        
        orbs.forEach((orb, index) => {
            const speed = 0.02 + (index * 0.01);
            const translateX = mouseX * 20 * speed;
            const translateY = mouseY * 20 * speed;
            
            const currentTransform = orb.style.transform || '';
            if (currentTransform.includes('translateY')) {
                orb.style.transform = currentTransform.replace(
                    /translateY\([^)]*\)/,
                    `translateY(${translateY}px) translateX(${translateX}px)`
                );
            } else {
                orb.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
            }
        });
        
        shapes.forEach((shape, index) => {
            const speed = 0.01 + (index * 0.005);
            const rotateX = mouseY * 5 * speed;
            const rotateY = mouseX * 5 * speed;
            const currentTransform = shape.style.transform || '';
            
            shape.style.transform = currentTransform + ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Subtle gradient mesh movement
        if (gradientMesh) {
            const x = mouseX * 10;
            const y = mouseY * 10;
            gradientMesh.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    // Enhanced Scroll Indicator
    initScrollIndicator() {
        const scrollIndicators = document.querySelectorAll('.modern-scroll, .scroll-indicator');
        
        scrollIndicators.forEach(scrollIndicator => {
            if (!scrollIndicator) return;
            
            // Hide/show based on scroll position
            const updateIndicator = this.throttle(() => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.hero-section, .modern-hero');
                
                if (heroSection) {
                    const heroHeight = heroSection.offsetHeight;
                    const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.3)));
                    
                    scrollIndicator.style.opacity = opacity;
                    scrollIndicator.style.transform = `translateX(-50%) translateY(${scrolled * 0.1}px)`;
                }
            }, 16);
            
            window.addEventListener('scroll', updateIndicator, { passive: true });
            
            // Smooth scroll to next section
            scrollIndicator.addEventListener('click', () => {
                const heroSection = document.querySelector('.hero-section, .modern-hero');
                const nextSection = heroSection?.nextElementSibling;
                
                if (nextSection) {
                    nextSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Advanced Button Interactions
    initButtonInteractions() {
        const primaryButtons = document.querySelectorAll('.btn-primary-modern, .btn-primary-new');
        const secondaryButtons = document.querySelectorAll('.btn-secondary-modern, .btn-secondary-new');
        
        // Ripple effect for buttons
        [...primaryButtons, ...secondaryButtons].forEach(button => {
            button.addEventListener('click', (e) => this.createRippleEffect(e, button));
            this.addMagneticEffect(button);
        });
        
        // Add ripple animation CSS if not exists
        this.addRippleStyles();
    }

    createRippleEffect(e, button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    addMagneticEffect(button) {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
        
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) translateY(0)';
        });
    }

    addRippleStyles() {
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleEffect {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Particle System
    initParticleSystem() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Set initial random positions if not set
            if (!particle.style.top) {
                particle.style.top = Math.random() * 100 + '%';
                particle.style.left = Math.random() * 100 + '%';
            }
            
            // Add floating animation
            this.animateParticle(particle, index);
        });
    }

    animateParticle(particle, index) {
        if (typeof gsap !== 'undefined') {
            const duration = 15 + Math.random() * 10;
            const delay = index * 2;
            
            gsap.to(particle, {
                y: -100 - Math.random() * 100,
                x: (Math.random() - 0.5) * 200,
                opacity: 0.8,
                duration: duration,
                delay: delay,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }
    }

    // Play button fallback for video
    addPlayButton(video) {
        const videoContainer = video.closest('.video-background, .video-container');
        if (!videoContainer || videoContainer.querySelector('.video-play-overlay')) return;
        
        const playButton = document.createElement('div');
        playButton.className = 'video-play-overlay';
        playButton.innerHTML = `
            <div class="play-button">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="play-text">Click to play video</div>
        `;
        
        playButton.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            cursor: pointer;
            z-index: 10;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
        `;
        
        const playButtonElement = playButton.querySelector('.play-button');
        playButtonElement.style.cssText = `
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        `;
        
        const playText = playButton.querySelector('.play-text');
        playText.style.cssText = `
            font-size: 14px;
            font-weight: 500;
            opacity: 0.8;
        `;
        
        playButton.addEventListener('click', () => {
            video.play().then(() => {
                playButton.remove();
            }).catch(console.error);
        });
        
        playButton.addEventListener('mouseenter', () => {
            playButtonElement.style.transform = 'scale(1.1)';
            playButtonElement.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        playButton.addEventListener('mouseleave', () => {
            playButtonElement.style.transform = 'scale(1)';
            playButtonElement.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        videoContainer.appendChild(playButton);
    }

    /**
     * Initialize testimonial slider
     */
    initTestimonialSlider() {
        const testimonialSlider = document.querySelector('.testimonial-slider');
        
        if (testimonialSlider && typeof $ !== 'undefined' && $.fn.slick) {
            // Use Slick carousel if available
            $(testimonialSlider).slick({
                dots: true,
                arrows: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true,
                prevArrow: $('.testimonial-prev'),
                nextArrow: $('.testimonial-next'),
                appendDots: $('.testimonial-dots'),
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false
                        }
                    }
                ]
            });
        } else {
            // Fallback slider implementation
            this.initBasicSlider();
        }
    }

    initBasicSlider() {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        if (testimonialItems.length === 0) return;
        
        let currentIndex = 0;
        
        // Create dots
        dotsContainer.innerHTML = '';
        testimonialItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.showSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Show slide function
        this.showSlide = (index) => {
            testimonialItems.forEach((item, i) => {
                item.style.display = i === index ? 'block' : 'none';
            });
            
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        };
        
        // Initialize
        this.showSlide(0);
        
        // Button event listeners
        prevButton?.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? testimonialItems.length - 1 : currentIndex - 1;
            this.showSlide(newIndex);
        });
        
        nextButton?.addEventListener('click', () => {
            const newIndex = currentIndex === testimonialItems.length - 1 ? 0 : currentIndex + 1;
            this.showSlide(newIndex);
        });
    }

    /**
     * Initialize modal handlers
     */
    initModalHandlers() {
        const appointmentModal = document.getElementById('appointmentModal');
        const appointmentButtons = document.querySelectorAll('a[href="appointment.html"], .btn-appointment, .btn-primary-modern, .btn-primary-new');
        const closeButton = appointmentModal?.querySelector('.modal-close');
        const modalOverlay = appointmentModal?.querySelector('.modal-overlay');
        
        if (!appointmentModal) return;
        
        // Open modal when appointment buttons are clicked
        appointmentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.getAttribute('href') === 'appointment.html' || 
                    button.textContent.toLowerCase().includes('book') ||
                    button.textContent.toLowerCase().includes('appointment') ||
                    button.textContent.toLowerCase().includes('consultation')) {
                    e.preventDefault();
                    this.openModal(appointmentModal);
                }
            });
        });
        
        // Close modal handlers
        closeButton?.addEventListener('click', () => this.closeModal(appointmentModal));
        modalOverlay?.addEventListener('click', () => this.closeModal(appointmentModal));
        
        // Handle form submission
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => this.handleFormSubmission(e, appointmentModal));
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && appointmentModal.classList.contains('active')) {
                this.closeModal(appointmentModal);
            }
        });
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate modal opening if GSAP is available
        if (typeof gsap !== 'undefined') {
            const modalContent = modal.querySelector('.modal-content');
            gsap.from(modalContent, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleFormSubmission(e, modal) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        // Log form data (replace with actual API call)
        console.log('Form submitted:', formValues);
        
        // Show success message
        form.innerHTML = `
            <div class="form-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Appointment Requested!</h3>
                <p>Thank you for scheduling a consultation. We'll contact you shortly to confirm your appointment.</p>
            </div>
        `;
        
        // Close modal after delay
        setTimeout(() => {
            this.closeModal(modal);
            setTimeout(() => form.reset(), 500);
        }, 3000);
    }

    /**
     * Initialize scroll effects
     */
    initScrollEffects() {
        // Smooth scroll for anchor links
        this.initSmoothScroll();
        
        // Parallax effect for sections with background images
        this.initBackgroundParallax();
    }

    initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initBackgroundParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        if (parallaxElements.length === 0) return;
        
        const updateParallax = this.throttle(() => {
            parallaxElements.forEach(element => {
                const scrollPosition = window.pageYOffset;
                const elementTop = element.getBoundingClientRect().top + scrollPosition;
                const elementVisible = window.innerHeight;
                
                if (elementTop < scrollPosition + elementVisible && elementTop + element.offsetHeight > scrollPosition) {
                    const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
                    const yPos = (scrollPosition - elementTop) * speed;
                    element.style.backgroundPosition = `center ${yPos}px`;
                }
            });
        }, 16);
        
        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    /**
     * Initialize floating animations for decorative elements
     */
    initFloatingElements() {
        const floatingElements = document.querySelectorAll(
            '.floating-circle, .blur-shape, .soft-bubble, .floating-orb, .float-element'
        );
        
        if (typeof gsap !== 'undefined') {
            floatingElements.forEach((el, index) => {
                gsap.to(el, {
                    y: index % 2 === 0 ? 20 : -20,
                    x: index % 3 === 0 ? 15 : -15,
                    rotation: index % 2 === 0 ? 5 : -5,
                    duration: 5 + Math.random() * 5,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.2
                });
            });
        } else {
            // CSS-based fallback animation
            floatingElements.forEach((el, index) => {
                el.style.animation = `float ${5 + index}s ease-in-out infinite`;
                el.style.animationDelay = `${index * 0.2}s`;
            });
        }
        
        // Animate scroll indicators
        const scrollIndicators = document.querySelectorAll('.scroll-indicator:not(.modern-scroll)');
        if (typeof gsap !== 'undefined') {
            scrollIndicators.forEach(indicator => {
                gsap.to(indicator, {
                    y: 10,
                    duration: 1.5,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });
            });
        }
    }

    /**
     * Handle image reveal animations
     */
    initImageReveal() {
        const images = document.querySelectorAll('.reveal-image');
        
        images.forEach(img => {
            this.setupImageReveal(img);
        });
    }

    setupImageReveal(img) {
        // Create wrapper if not already wrapped
        if (!img.parentElement.classList.contains('image-reveal-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-reveal-wrapper');
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.classList.add('image-reveal-overlay');
            wrapper.appendChild(overlay);
        }
        
        if (typeof gsap !== 'undefined') {
            // Set initial state
            gsap.set(img.nextElementSibling, {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '#3c2415',
                transformOrigin: 'right'
            });
            
            // Create reveal animation
            ScrollTrigger.create({
                trigger: img.parentElement,
                start: 'top 75%',
                onEnter: () => {
                    gsap.to(img.nextElementSibling, {
                        scaleX: 0,
                        duration: 1,
                        ease: 'power3.inOut'
                    });
                    
                    gsap.from(img, {
                        scale: 1.1,
                        duration: 1.2,
                        delay: 0.2,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        } else {
            // Fallback without GSAP
            this.observeElements([img.parentElement], () => {
                const overlay = img.nextElementSibling;
                if (overlay) {
                    overlay.style.transition = 'transform 1s ease';
                    overlay.style.transform = 'scaleX(0)';
                }
            });
        }
    }

    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        // Lazy load non-critical elements
        this.initLazyLoading();
        
        // Optimize animations based on device capabilities
        this.optimizeForDevice();
        
        // Reduce motion for users who prefer it
        this.respectReducedMotion();
        
        // Initialize resize handler
        this.initResizeHandler();
    }

    initLazyLoading() {
        const lazyElements = document.querySelectorAll('.particle, .float-element, .shape, .gradient-orb');
        
        this.observeElements(lazyElements, (element) => {
            element.style.opacity = '1';
        });
    }

    optimizeForDevice() {
        // Reduce animations on low-performance devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-duration', '0.5s');
            console.log('🔧 Reduced animations for low-performance device');
        }
        
        // Disable parallax on mobile for better performance
        if (window.innerWidth < 768) {
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            parallaxElements.forEach(el => {
                el.style.backgroundAttachment = 'scroll';
            });
        }
    }

    respectReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
            console.log('♿ Reduced motion enabled for accessibility');
        }
    }

    initResizeHandler() {
        const handleResize = this.debounce(() => {
            // Recalculate hero height
            const hero = document.querySelector('.modern-hero, .hero-section');
            if (hero) {
                hero.style.height = `${window.innerHeight}px`;
            }
            
            // Refresh ScrollTrigger if available
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
    }

    /**
     * Utility Functions
     */
    
    // Generic element observer
    observeElements(elements, callback, options = {}) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, ...options });
            
            elements.forEach(element => observer.observe(element));
            this.observers.elements = observer;
        } else {
            // Fallback for browsers without Intersection Observer
            elements.forEach(callback);
        }
    }

    // Throttle function for performance
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

    // Debounce function for resize events
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

    // Browser capability logging
    logBrowserCapabilities() {
        const capabilities = {
            webGL: this.supportsWebGL(),
            intersectionObserver: 'IntersectionObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window,
            gsap: typeof gsap !== 'undefined',
            aos: typeof AOS !== 'undefined',
            modernBrowser: this.isModernBrowser()
        };
        
        console.log('🌐 Browser capabilities:', capabilities);
        return capabilities;
    }

    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    isModernBrowser() {
        return !!(
            window.Promise &&
            window.fetch &&
            window.Object.assign &&
            window.Array.from
        );
    }

    // Create staggered animation for multiple elements
    createStaggerAnimation(elements, options = {}) {
        const defaults = {
            staggerTime: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            y: 30,
            opacity: 0
        };
        
        const settings = { ...defaults, ...options };
        
        if (typeof gsap !== 'undefined') {
            gsap.from(elements, {
                opacity: settings.opacity,
                y: settings.y,
                stagger: settings.staggerTime,
                duration: settings.duration,
                ease: settings.ease,
                scrollTrigger: {
                    trigger: elements[0]?.parentElement,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        } else {
            // Fallback animation
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.transition = `opacity ${settings.duration}s ease, transform ${settings.duration}s ease`;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * (settings.staggerTime * 1000));
            });
        }
    }

    // Public API methods
    destroy() {
        // Clean up observers
        Object.values(this.observers).forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        // Clean up animations
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('*');
            ScrollTrigger?.killAll();
        }
        
        console.log('🧹 Evia Aesthetics app destroyed');
    }

    refresh() {
        // Refresh ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Refresh AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        console.log('🔄 Evia Aesthetics app refreshed');
    }
}

// ==============================
// GSAP Integration Enhancement
// ==============================
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Enhanced GSAP animations for modern hero
    document.addEventListener('DOMContentLoaded', function() {
        // Stagger animation for feature cards
        const featureCards = document.querySelectorAll('.feature-card, .pill, .tag');
        if (featureCards.length > 0) {
            gsap.from(featureCards, {
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 1
            });
        }
        
        // Enhanced parallax effect for decorative elements
        const decorativeElements = document.querySelectorAll('.gradient-orb, .shape, .float-element');
        if (decorativeElements.length > 0) {
            gsap.to(decorativeElements, {
                y: -100,
                scrollTrigger: {
                    trigger: '.hero-section, .modern-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
        
        // Stats card animation
        const statsCards = document.querySelectorAll('.stats-card, .stats-panel');
        statsCards.forEach(statsCard => {
            gsap.from(statsCard, {
                duration: 1,
                x: 100,
                opacity: 0,
                ease: 'power3.out',
                delay: 1.2,
                scrollTrigger: {
                    trigger: statsCard,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    });
}

// ==============================
// Initialize Application
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
// Global API & Legacy Support
// ==============================

// Export for global access and legacy compatibility
window.EviaAesthetics = {
    app: () => eviaApp,
    
    // Legacy function exports for backward compatibility
    initModernHero: () => eviaApp?.initModernHero(),
    initVideoEnhancements: () => eviaApp?.initVideoEnhancements(),
    initCounterAnimations: () => eviaApp?.initCounterAnimations(),
    initParallaxEffects: () => eviaApp?.initParallaxEffects(),
    initMouseFollowEffects: () => eviaApp?.initMouseFollowEffects(),
    createStaggerAnimation: (elements, options) => eviaApp?.createStaggerAnimation(elements, options),
    throttle: (func, limit) => eviaApp?.throttle(func, limit),
    
    // Utility functions
    refresh: () => eviaApp?.refresh(),
    destroy: () => eviaApp?.destroy()
};

// Legacy support for old function calls
window.initPreloader = () => eviaApp?.initPreloader();
window.initNavigation = () => eviaApp?.initNavigation();
window.initAnimations = () => eviaApp?.initAnimations();
window.initModernHero = () => eviaApp?.initModernHero();
window.animateHeroElements = () => eviaApp?.animateHeroElements();

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('evia-app-end');
    if (performance.getEntriesByName('evia-app-start').length > 0) {
        performance.measure('evia-app-init', 'evia-app-start', 'evia-app-end');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EviaAestheticsApp;
}

// Console styling for development
if (process?.env?.NODE_ENV === 'development') {
    console.log(
        '%c🎨 Evia Aesthetics %c2.0 %cLoaded Successfully',
        'color: #f39c12; font-weight: bold; font-size: 16px;',
        'color: #3c2415; font-weight: bold; background: #f39c12; padding: 2px 6px; border-radius: 3px;',
        'color: #68b984; font-weight: normal;'
    );
}
