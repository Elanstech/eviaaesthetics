/*
* Evia Aesthetics - Modern Website JavaScript
* Created by: Elanstech
* Version: 2.0
* Last Updated: 2025-05-29
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initAnimations();
    initModernHero(); // New modern hero functionality
    initTestimonialSlider();
    initModalHandlers();
    initScrollEffects();
    
    // Log initialization
    console.log('Evia Aesthetics website initialized with modern features');
});

/**
 * Handle preloader and page loading animations
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    // Fade out preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
                
                // Start any animations that should run after page load
                animateHeroElements();
            }, 600);
        }, 1500); // Adjust timing based on your preference
    });
    
    // Fallback to hide preloader if load event doesn't fire
    setTimeout(function() {
        if (preloader.style.opacity !== '0') {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
                animateHeroElements();
            }, 600);
        }
    }, 5000);
}

/**
 * Initialize header, navigation, and mobile menu
 */
function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileDropdownItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
    const navDropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    // Handle scroll effects on header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Force initial check in case page is loaded scrolled down
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animate toggle bars
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                gsap.to(spans[0], {
                    rotation: 45,
                    y: 9,
                    duration: 0.3
                });
                gsap.to(spans[1], {
                    opacity: 0,
                    duration: 0.3
                });
                gsap.to(spans[2], {
                    rotation: -45,
                    y: -9,
                    duration: 0.3
                });
            } else {
                gsap.to(spans[0], {
                    rotation: 0,
                    y: 0,
                    duration: 0.3
                });
                gsap.to(spans[1], {
                    opacity: 1,
                    duration: 0.3
                });
                gsap.to(spans[2], {
                    rotation: 0,
                    y: 0,
                    duration: 0.3
                });
            }
        });
    }
    
    // Mobile dropdowns
    mobileDropdownItems.forEach(function(item) {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.mobile-dropdown');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            item.classList.toggle('active');
            
            // Toggle dropdown display with animation
            if (dropdown.style.display === 'block') {
                gsap.to(dropdown, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: function() {
                        dropdown.style.display = 'none';
                        dropdown.style.height = 'auto';
                    }
                });
            } else {
                dropdown.style.display = 'block';
                dropdown.style.height = '0';
                const height = dropdown.scrollHeight;
                gsap.to(dropdown, {
                    height: height,
                    opacity: 1,
                    duration: 0.3,
                    onComplete: function() {
                        dropdown.style.height = 'auto';
                    }
                });
            }
        });
    });
    
    // Desktop dropdowns
    navDropdownItems.forEach(function(item) {
        const link = item.querySelector('.nav-link');
        const menu = item.querySelector('.dropdown-menu');
        const icon = link.querySelector('i');
        
        // Add hover animations
        item.addEventListener('mouseenter', function() {
            gsap.to(menu, {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            if (icon) {
                gsap.to(icon, {
                    rotation: 180,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(menu, {
                opacity: 0,
                y: 10,
                visibility: 'hidden',
                duration: 0.3,
                ease: 'power2.in'
            });
            
            if (icon) {
                gsap.to(icon, {
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset toggle animation
            const spans = mobileToggle.querySelectorAll('span');
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });
}

/**
 * Initialize GSAP and AOS animations
 */
function initAnimations() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false,
        mirror: false,
        offset: 50,
        delay: 0
    });
    
    // Animate elements that come into view
    const fadeInElements = document.querySelectorAll('.fade-in:not([data-aos])');
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
    
    // Initialize back to top button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add floating animations to decorative elements
    initFloatingElements();
}

/**
 * Animate hero elements on page load
 */
function animateHeroElements() {
    // Additional animations can be added here if needed
    
    // Ensure video plays
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.log('Auto-play was prevented:', error);
            // Add a play button as fallback if needed
        });
    }
}

/**
 * Modern Hero Section JavaScript with Advanced Features
 */
function initModernHero() {
    // Initialize all modern features
    initVideoEnhancements();
    initCounterAnimations();
    initParallaxEffects();
    initMouseFollowEffects();
    initScrollIndicator();
    initButtonInteractions();
    
    console.log('Modern hero section initialized');
}

// Enhanced Video Handling
function initVideoEnhancements() {
    const heroVideo = document.getElementById('hero-video');
    
    if (heroVideo) {
        // Preload and optimize video
        heroVideo.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        heroVideo.addEventListener('canplay', () => {
            heroVideo.style.opacity = '1';
            heroVideo.style.transition = 'opacity 1s ease';
        });
        
        // Auto-play with fallback
        const playVideo = async () => {
            try {
                await heroVideo.play();
                console.log('Video auto-play successful');
            } catch (error) {
                console.log('Auto-play prevented, adding play button');
                addPlayButton();
            }
        };
        
        playVideo();
        
        // Performance optimization
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play();
                } else {
                    heroVideo.pause();
                }
            });
        });
        
        observer.observe(document.querySelector('.hero-section'));
    }
}

// Animated Counter for Stats
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / 100);
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Add formatting for large numbers
            if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(current >= 1000 ? 1 : 0) + 'K+';
            } else if (target === 98) {
                element.textContent = current + '%';
            } else {
                element.textContent = current + '+';
            }
        }, stepTime);
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.7 });
    
    counterElements.forEach(el => counterObserver.observe(el));
}

// Advanced Parallax Effects
function initParallaxEffects() {
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        const scrollPercent = Math.min(scrolled / heroHeight, 1);
        
        // Parallax for decorative elements
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
        
        // Fade out hero content
        const heroContent = document.querySelector('.hero-content-area');
        if (heroContent) {
            const opacity = Math.max(0, 1 - scrollPercent * 1.5);
            heroContent.style.opacity = opacity;
        }
        
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

// Mouse Follow Effects
function initMouseFollowEffects() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    const animateMouseFollow = () => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const shapes = document.querySelectorAll('.shape');
        
        orbs.forEach((orb, index) => {
            const speed = 0.02 + (index * 0.01);
            const currentTransform = orb.style.transform || '';
            const translateX = mouseX * 20 * speed;
            const translateY = mouseY * 20 * speed;
            
            // Preserve existing transforms and add mouse follow
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
            
            // Add subtle 3D rotation based on mouse position
            shape.style.transform = currentTransform + ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        requestAnimationFrame(animateMouseFollow);
    };
    
    animateMouseFollow();
}

// Enhanced Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.modern-scroll');
    
    if (scrollIndicator) {
        // Hide/show based on scroll position
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero-section').offsetHeight;
            const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.3)));
            
            scrollIndicator.style.opacity = opacity;
            scrollIndicator.style.transform = `translateX(-50%) translateY(${scrolled * 0.1}px)`;
        });
        
        // Smooth scroll to next section
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.hero-section').nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Advanced Button Interactions
function initButtonInteractions() {
    const primaryButtons = document.querySelectorAll('.btn-primary-modern');
    const secondaryButtons = document.querySelectorAll('.btn-secondary-modern');
    
    // Ripple effect for primary buttons
    primaryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
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
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Magnetic effect for buttons
    [...primaryButtons, ...secondaryButtons].forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
        
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-3px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) translateY(0)';
        });
    });
    
    // Add ripple animation CSS
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

// Play button fallback for video
function addPlayButton() {
    const videoContainer = document.querySelector('.video-background');
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
        const video = document.getElementById('hero-video');
        video.play();
        playButton.remove();
    });
    
    playButton.addEventListener('mouseenter', () => {
        playButtonElement.style.transform = 'scale(1.1)';
        playButtonElement.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    videoContainer.appendChild(playButton);
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider && typeof $.fn.slick !== 'undefined') {
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
        // Fallback if slick isn't loaded
        console.log('Slick carousel not available, implementing basic slider');
        
        // Get all testimonial items
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        const dotsContainer = document.querySelector('.testimonial-dots');
        
        if (testimonialItems.length > 0) {
            let currentIndex = 0;
            
            // Create dots
            testimonialItems.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    showSlide(index);
                });
                
                dotsContainer.appendChild(dot);
            });
            
            // Show only the current slide
            function showSlide(index) {
                // Hide all slides
                testimonialItems.forEach(item => {
                    item.style.display = 'none';
                });
                
                // Show current slide
                testimonialItems[index].style.display = 'block';
                
                // Update dots
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
                
                currentIndex = index;
            }
            
            // Initialize slider
            showSlide(0);
            
            // Add event listeners to buttons
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    let newIndex = currentIndex - 1;
                    if (newIndex < 0) newIndex = testimonialItems.length - 1;
                    showSlide(newIndex);
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    let newIndex = currentIndex + 1;
                    if (newIndex >= testimonialItems.length) newIndex = 0;
                    showSlide(newIndex);
                });
            }
        }
    }
}

/**
 * Initialize modal handlers
 */
function initModalHandlers() {
    const appointmentModal = document.getElementById('appointmentModal');
    const appointmentButtons = document.querySelectorAll('a[href="appointment.html"]');
    const closeButton = appointmentModal ? appointmentModal.querySelector('.modal-close') : null;
    const modalOverlay = appointmentModal ? appointmentModal.querySelector('.modal-overlay') : null;
    
    // Open modal when appointment buttons are clicked
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (appointmentModal) {
                appointmentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            appointmentModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when overlay is clicked
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            appointmentModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Here you would typically send the form data to your server
            // For now, we'll just log it and show a success message
            console.log('Form submitted:', formValues);
            
            // Show success message
            appointmentForm.innerHTML = `
                <div class="form-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Appointment Requested!</h3>
                    <p>Thank you for scheduling a consultation. We'll contact you shortly to confirm your appointment.</p>
                </div>
            `;
            
            // Close modal after a delay
            setTimeout(function() {
                appointmentModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset form after it's hidden
                setTimeout(function() {
                    appointmentForm.reset();
                }, 500);
            }, 3000);
        });
    }
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for sections with background images
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            parallaxElements.forEach(element => {
                const scrollPosition = window.pageYOffset;
                const elementTop = element.getBoundingClientRect().top + scrollPosition;
                const elementVisible = window.innerHeight;
                
                if (elementTop < scrollPosition + elementVisible && elementTop + element.offsetHeight > scrollPosition) {
                    const speed = element.getAttribute('data-speed') || 0.5;
                    const yPos = (scrollPosition - elementTop) * speed;
                    element.style.backgroundPosition = `center ${yPos}px`;
                }
            });
        });
    }
}

/**
 * Initialize floating animations for decorative elements
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-circle, .blur-shape, .soft-bubble, .floating-orb');
    
    floatingElements.forEach((el, index) => {
        // Create random but smooth floating animation
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
    
    // Animate scroll indicator (both old and new versions)
    const scrollIndicators = document.querySelectorAll('.scroll-indicator, .modern-scroll');
    scrollIndicators.forEach(scrollIndicator => {
        if (scrollIndicator && !scrollIndicator.classList.contains('modern-scroll')) {
            gsap.to(scrollIndicator, {
                y: 10,
                duration: 1.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }
    });
}

/**
 * Handle image reveal animations
 */
function initImageReveal() {
    const images = document.querySelectorAll('.reveal-image');
    
    images.forEach(img => {
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
    });
}

/**
 * Create staggered animation for multiple elements
 */
function createStaggerAnimation(elements, staggerTime = 0.1) {
    gsap.from(elements, {
        opacity: 0,
        y: 30,
        stagger: staggerTime,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: elements[0].parentElement,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

// GSAP Integration for Modern Hero (Enhanced)
if (typeof gsap !== 'undefined') {
    // Enhanced animations with GSAP for modern hero
    gsap.registerPlugin(ScrollTrigger);
    
    // Wait for DOM and then initialize GSAP animations
    document.addEventListener('DOMContentLoaded', function() {
        // Stagger animation for feature cards (both old and new)
        const featureCards = document.querySelectorAll('.feature-card, .pill');
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
        
        // Enhanced parallax effect with GSAP for modern decorative elements
        const modernOrbs = document.querySelectorAll('.gradient-orb, .shape');
        if (modernOrbs.length > 0) {
            gsap.to(modernOrbs, {
                y: -100,
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
        
        // Stats card animation
        const statsCard = document.querySelector('.stats-card');
        if (statsCard) {
            gsap.from(statsCard, {
                duration: 1,
                x: 100,
                opacity: 0,
                ease: 'power3.out',
                delay: 1.2
            });
        }
    });
}

// Utility function for throttling scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(function() {
    // Any additional scroll handling can go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Modern browser feature detection
const supportsWebGL = () => {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
        return false;
    }
};

const supportsIntersectionObserver = 'IntersectionObserver' in window;
const supportsRequestAnimationFrame = 'requestAnimationFrame' in window;

// Log browser capabilities
console.log('Browser capabilities:', {
    webGL: supportsWebGL(),
    intersectionObserver: supportsIntersectionObserver,
    requestAnimationFrame: supportsRequestAnimationFrame,
    gsap: typeof gsap !== 'undefined',
    aos: typeof AOS !== 'undefined'
});

// Export functions for external use if needed
window.EviaAesthetics = {
    initModernHero,
    initVideoEnhancements,
    initCounterAnimations,
    initParallaxEffects,
    initMouseFollowEffects,
    createStaggerAnimation,
    throttle
};
