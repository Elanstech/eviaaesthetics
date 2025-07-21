// Evia Aesthetics - Luxury Manhattan Med Spa JavaScript

'use strict';

// Global Application State
const LuxuryMedSpa = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    scrollY: 0,
    components: {},
    animations: {
        isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
};

/**
 * Luxury Preloader System
 */
class LuxuryPreloader {
    constructor() {
        this.element = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.isComplete = false;
        this.minDuration = 2000;
        this.maxDuration = 4000;
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        document.body.classList.add('loading', 'no-scroll');
        
        this.animateProgress();
        this.checkAssets();
        
        // Ensure minimum loading time for smooth experience
        setTimeout(() => {
            this.checkCompletion();
        }, this.minDuration);
        
        // Fallback timeout
        setTimeout(() => {
            if (!this.isComplete) {
                this.complete();
            }
        }, this.maxDuration);
    }
    
    animateProgress() {
        if (!this.progressFill) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            progress = Math.min(progress, 95);
            
            this.progressFill.style.width = `${progress}%`;
            
            if (progress >= 95 || this.isComplete) {
                clearInterval(interval);
                if (this.isComplete) {
                    this.progressFill.style.width = '100%';
                }
            }
        }, 200);
    }
    
    checkAssets() {
        const checkReady = () => {
            const images = Array.from(document.images);
            const videosLoaded = Array.from(document.querySelectorAll('video')).every(video => 
                video.readyState >= 3 || video.error
            );
            
            const imagesLoaded = images.every(img => img.complete);
            
            if (document.readyState === 'complete' && imagesLoaded && videosLoaded) {
                this.assetsReady = true;
                this.checkCompletion();
            } else {
                requestAnimationFrame(checkReady);
            }
        };
        
        checkReady();
    }
    
    checkCompletion() {
        const timePassed = Date.now() - this.startTime;
        
        if (this.assetsReady && timePassed >= this.minDuration && !this.isComplete) {
            this.complete();
        }
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        // Final progress animation
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
        }
        
        // Fade out preloader
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                this.element.classList.add('hidden');
                document.body.classList.remove('loading', 'no-scroll');
                document.body.classList.add('page-loaded');
                
                this.onComplete();
            }, 600);
        }, 300);
    }
    
    onComplete() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 50
            });
        }
        
        // Trigger loaded event
        window.dispatchEvent(new CustomEvent('pageLoaded'));
        LuxuryMedSpa.isLoaded = true;
        
        // Start hero animations
        if (LuxuryMedSpa.components.hero) {
            LuxuryMedSpa.components.hero.startAnimations();
        }
    }
}

/**
 * Luxury Header Controller
 */
class LuxuryHeader {
    constructor() {
        this.element = document.getElementById('header');
        this.progressLine = document.getElementById('progressLine');
        this.logoContainer = document.getElementById('logoContainer');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isScrolled = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.bindEvents();
        this.initDropdowns();
        this.updateScrollProgress();
    }
    
    bindEvents() {
        // Optimized scroll handler
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Logo interactions
        if (this.logoContainer) {
            this.logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
        
        // Navigation clicks
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToSection(href);
                });
            }
        });
        
        // Header CTA
        const headerCTA = document.getElementById('headerCTA');
        if (headerCTA) {
            headerCTA.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modals) {
                    LuxuryMedSpa.components.modals.openAppointmentModal();
                }
            });
        }
    }
    
    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            let timeout;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 300);
            });
        });
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        const shouldBeScrolled = scrollY > this.scrollThreshold;
        
        // Update header state
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.element.classList.toggle('scrolled', this.isScrolled);
        }
        
        // Update progress
        this.updateScrollProgress();
        
        // Update active navigation
        this.updateActiveNav();
        
        this.lastScrollY = scrollY;
        LuxuryMedSpa.scrollY = scrollY;
    }
    
    updateScrollProgress() {
        if (!this.progressLine) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
        
        this.progressLine.style.width = `${Math.min(progress, 100)}%`;
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let activeSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const threshold = window.innerHeight * 0.3;
            
            if (rect.top <= threshold && rect.bottom >= threshold) {
                activeSection = section.getAttribute('id');
            }
        });
        
        if (activeSection) {
            this.setActiveNav(activeSection);
        }
    }
    
    setActiveNav(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    navigateToSection(target) {
        const element = document.querySelector(target);
        if (!element) return;
        
        const headerHeight = this.element.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        this.smoothScrollTo(targetPosition);
    }
    
    scrollToTop() {
        this.smoothScrollTo(0);
    }
    
    smoothScrollTo(position) {
        const startPosition = window.pageYOffset;
        const distance = position - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 800);
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeProgress = this.easeInOutCubic(progress);
            window.scrollTo(0, startPosition + (distance * easeProgress));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

/**
 * Mobile Menu Controller
 */
class MobileMenu {
    constructor() {
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileMenuOverlay');
        this.toggle = document.getElementById('mobileToggle');
        this.close = document.getElementById('mobileClose');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menu || !this.toggle) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        if (this.close) {
            this.close.addEventListener('click', () => this.closeMenu());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Mobile nav links
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMenu();
                    setTimeout(() => {
                        if (LuxuryMedSpa.components.header) {
                            LuxuryMedSpa.components.header.navigateToSection(href);
                        }
                    }, 300);
                });
            }
        });
        
        // Mobile booking button
        const mobileBookingBtn = document.getElementById('mobileBookingBtn');
        if (mobileBookingBtn) {
            mobileBookingBtn.addEventListener('click', () => {
                this.closeMenu();
                setTimeout(() => {
                    if (LuxuryMedSpa.components.modals) {
                        LuxuryMedSpa.components.modals.openAppointmentModal();
                    }
                }, 300);
            });
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        document.body.classList.add('no-scroll');
        
        this.toggle.classList.add('active');
        this.overlay.classList.add('active');
        this.menu.classList.add('active');
    }
    
    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        this.toggle.classList.remove('active');
        this.overlay.classList.remove('active');
        this.menu.classList.remove('active');
        
        document.body.classList.remove('no-scroll');
    }
}

/**
 * Hero Section Controller
 */
class HeroSection {
    constructor() {
        this.video = document.querySelector('.hero-video');
        this.videoContainer = document.querySelector('.hero-video-container');
        this.videoFallback = document.querySelector('.video-fallback');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.scrollIndicator = document.getElementById('scrollIndicator');
        
        this.statsAnimated = false;
        this.videoLoaded = false;
        
        this.init();
    }
    
    init() {
        this.initVideo();
        this.initButtons();
        this.initScrollIndicator();
        this.observeStats();
    }
    
    initVideo() {
        if (!this.video) return;
        
        // Video loading handling
        this.video.addEventListener('loadeddata', () => {
            this.videoLoaded = true;
            this.video.classList.add('loaded');
            if (this.videoFallback) {
                this.videoFallback.style.opacity = '0';
            }
        });
        
        this.video.addEventListener('error', () => {
            console.warn('Video loading failed, using fallback');
            if (this.videoFallback) {
                this.videoFallback.style.opacity = '1';
            }
        });
        
        // Ensure video plays
        const playVideo = () => {
            if (this.video.paused) {
                this.video.play().catch(() => {
                    // Silent fail - video will show poster
                });
            }
        };
        
        // Try to play on various events
        ['loadeddata', 'canplay', 'canplaythrough'].forEach(event => {
            this.video.addEventListener(event, playVideo);
        });
        
        // Intersection observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.video.paused) {
                    playVideo();
                } else if (!entry.isIntersecting && !this.video.paused) {
                    this.video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.video);
    }
    
    initButtons() {
        // Hero booking button
        const heroBooking = document.getElementById('heroBooking');
        if (heroBooking) {
            heroBooking.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modals) {
                    LuxuryMedSpa.components.modals.openAppointmentModal();
                }
            });
        }
        
        // Video play button
        const videoPlay = document.getElementById('videoPlay');
        if (videoPlay) {
            videoPlay.addEventListener('click', () => {
                if (LuxuryMedSpa.components.modals) {
                    LuxuryMedSpa.components.modals.openVideoModal();
                }
            });
        }
    }
    
    initScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        this.scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#services');
            if (aboutSection && LuxuryMedSpa.components.header) {
                LuxuryMedSpa.components.header.navigateToSection('#services');
            }
        });
        
        // Hide on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrollY / 300));
            this.scrollIndicator.style.opacity = opacity;
            this.scrollIndicator.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        }, { passive: true });
    }
    
    observeStats() {
        if (!this.statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.animateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsBar = document.querySelector('.hero-stats-bar');
        if (statsBar) {
            observer.observe(statsBar);
        }
    }
    
    animateStats() {
        if (this.statsAnimated) return;
        
        this.statsAnimated = true;
        
        this.statNumbers.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easeOutQuart(progress);
            const currentValue = Math.floor(easeProgress * target);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    startAnimations() {
        // Called after preloader completes
        if (!this.statsAnimated) {
            const statsBar = document.querySelector('.hero-stats-bar');
            if (statsBar) {
                statsBar.style.opacity = '1';
            }
        }
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

/**
 * Services Carousel
 */
class ServicesCarousel {
    constructor() {
        this.swiper = null;
        this.init();
    }
    
    init() {
        const swiperElement = document.querySelector('.services-swiper');
        if (!swiperElement || typeof Swiper === 'undefined') return;
        
        this.swiper = new Swiper('.services-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
        
        // Pause on hover
        const container = document.querySelector('.services-carousel');
        if (container) {
            container.addEventListener('mouseenter', () => {
                if (this.swiper.autoplay) {
                    this.swiper.autoplay.stop();
                }
            });
            
            container.addEventListener('mouseleave', () => {
                if (this.swiper.autoplay) {
                    this.swiper.autoplay.start();
                }
            });
        }
        
        // Service card buttons
        const serviceCTAs = document.querySelectorAll('.service-cta');
        serviceCTAs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (LuxuryMedSpa.components.modals) {
                    LuxuryMedSpa.components.modals.openAppointmentModal();
                }
            });
        });
    }
}

/**
 * Results Gallery Filter
 */
class ResultsGallery {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.resultItems = document.querySelectorAll('.result-item');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        if (!this.filterBtns.length) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveFilter(filter);
                this.filterResults(filter);
            });
        });
    }
    
    setActiveFilter(filter) {
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.activeFilter = filter;
    }
    
    filterResults(filter) {
        this.resultItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = '';
                item.style.animation = 'fadeInScale 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

/**
 * Modal System
 */
class ModalSystem {
    constructor() {
        this.appointmentModal = document.getElementById('appointmentModal');
        this.videoModal = document.getElementById('videoModal');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        this.initAppointmentModal();
        this.initVideoModal();
        this.bindGlobalEvents();
    }
    
    initAppointmentModal() {
        if (!this.appointmentModal) return;
        
        const closeBtn = document.getElementById('modalClose');
        const overlay = this.appointmentModal.querySelector('.modal-overlay');
        const form = document.getElementById('appointmentForm');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(this.appointmentModal));
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal(this.appointmentModal));
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        }
    }
    
    initVideoModal() {
        if (!this.videoModal) return;
        
        const closeBtn = document.getElementById('videoModalClose');
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
    
    bindGlobalEvents() {
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
        
        // All buttons that should open appointment modal
        const appointmentTriggers = [
            'meetDoctor',
            'servicesBooking',
            'headerCTA'
        ];
        
        appointmentTriggers.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.openAppointmentModal());
            }
        });
    }
    
    openAppointmentModal() {
        this.openModal(this.appointmentModal);
    }
    
    openVideoModal() {
        if (!this.videoModal) return;
        
        const iframe = this.videoModal.querySelector('iframe');
        if (iframe) {
            // Replace with your actual video URL
            iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
        }
        
        this.openModal(this.videoModal);
    }
    
    openModal(modal) {
        if (!modal || this.activeModal) return;
        
        this.activeModal = modal;
        document.body.classList.add('no-scroll');
        modal.classList.add('active');
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        this.activeModal = null;
    }
    
    handleFormSubmit(form) {
        // Simple form validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            // Show success message
            form.innerHTML = `
                <div class="success-message" style="text-align: center; padding: 3rem;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 2rem;
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
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Thank You!</h3>
                    <p style="color: #6B7280; line-height: 1.6;">
                        Your consultation request has been received. 
                        Dr. Nano's team will contact you within 24 hours.
                    </p>
                </div>
            `;
            
            setTimeout(() => {
                this.closeModal(this.appointmentModal);
                // Reset form for next use
                location.reload();
            }, 3000);
        }, 1500);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#EF4444' : '#10B981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

/**
 * Floating Booking Button
 */
class FloatingBooking {
    constructor() {
        this.button = document.querySelector('.floating-btn');
        this.container = document.getElementById('floatingBooking');
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        if (!this.button || !this.container) return;
        
        this.bindEvents();
        this.checkVisibility();
    }
    
    bindEvents() {
        this.button.addEventListener('click', () => {
            if (LuxuryMedSpa.components.modals) {
                LuxuryMedSpa.components.modals.openAppointmentModal();
            }
        });
        
        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            this.checkVisibility();
        }, { passive: true });
    }
    
    checkVisibility() {
        const scrollY = window.pageYOffset;
        const shouldShow = scrollY > 500;
        
        if (shouldShow && !this.isVisible) {
            this.show();
        } else if (!shouldShow && this.isVisible) {
            this.hide();
        }
    }
    
    show() {
        this.isVisible = true;
        this.container.style.display = 'block';
        setTimeout(() => {
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0)';
        }, 10);
    }
    
    hide() {
        this.isVisible = false;
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(20px)';
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 300);
    }
}

/**
 * Contact Form Handler
 */
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            let isValid = true;
            for (const [key, value] of Object.entries(data)) {
                if (!value.trim()) {
                    isValid = false;
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.classList.add('error');
                    }
                }
            }
            
            if (!isValid) {
                this.showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate submission
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.form.reset();
                this.showMessage('Thank you! We\'ll be in touch soon.', 'success');
            }, 1500);
        });
        
        // Remove error class on input
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }
    
    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#EF4444' : '#10B981'};
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: fadeInUp 0.3s ease-out;
        `;
        messageEl.textContent = message;
        
        this.form.style.position = 'relative';
        this.form.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

/**
 * Smooth Animations Observer
 */
class AnimationsObserver {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        // Observe all stat numbers
        const statNumbers = document.querySelectorAll('.stat-number-new, .stat-number');
        statNumbers.forEach(stat => {
            if (!stat.classList.contains('animated')) {
                this.observeElement(stat, () => {
                    this.animateNumber(stat);
                });
            }
        });
        
        // Observe other elements for entrance animations
        const elements = document.querySelectorAll('.bubble-card, .service-card, .offer-card');
        elements.forEach(el => {
            this.observeElement(el, () => {
                el.style.animation = 'fadeInUp 0.8s ease-out';
            });
        });
    }
    
    observeElement(element, callback) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(element);
    }
    
    animateNumber(element) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        
        const target = parseInt(element.dataset.count);
        if (!target) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * target);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

/**
 * Initialize Application
 */
class LuxuryMedSpaApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        // Initialize all components
        LuxuryMedSpa.components = {
            preloader: new LuxuryPreloader(),
            header: new LuxuryHeader(),
            mobileMenu: new MobileMenu(),
            hero: new HeroSection(),
            servicesCarousel: new ServicesCarousel(),
            resultsGallery: new ResultsGallery(),
            modals: new ModalSystem(),
            floatingBooking: new FloatingBooking(),
            contactForm: new ContactForm(),
            animations: new AnimationsObserver()
        };
        
        // Global event listeners
        this.bindGlobalEvents();
        
        console.log('✨ Luxury Med Spa Application Initialized');
    }
    
    bindGlobalEvents() {
        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                LuxuryMedSpa.isMobile = window.innerWidth <= 768;
            }, 250);
        });
        
        // Smooth anchor scrolling for any remaining links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target && target !== '#' && LuxuryMedSpa.components.header) {
                    LuxuryMedSpa.components.header.navigateToSection(target);
                }
            }
        });
        
        // Performance optimization - pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const videos = document.querySelectorAll('video');
            if (document.hidden) {
                videos.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                        video.dataset.wasPlaying = 'true';
                    }
                });
            } else {
                videos.forEach(video => {
                    if (video.dataset.wasPlaying === 'true') {
                        video.play().catch(() => {});
                        delete video.dataset.wasPlaying;
                    }
                });
            }
        });
        
        // Add loaded class for CSS animations
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }
}

// Initialize application
const app = new LuxuryMedSpaApp();

// Export for global access
window.LuxuryMedSpa = LuxuryMedSpa;
