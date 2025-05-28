/*
* Evia Aesthetics - Modern Website JavaScript
* Created by: [Your Name]
* Version: 1.0
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initAnimations();
    initTestimonialSlider();
    initModalHandlers();
    initScrollEffects();
    
    // Log initialization
    console.log('Evia Aesthetics website initialized');
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
    const floatingElements = document.querySelectorAll('.floating-circle, .blur-shape');
    
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
    
    // Animate scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            y: 10,
            duration: 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }
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
