/*
* Evia Aesthetics - Main JavaScript
* Author: [Your Name]
* Version: 1.0.1
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initAnimations();
    initScrollEffects();
    enhanceDropdowns(); // Added dropdown enhancement function call
    addHoverEffects();
    initFloatingElements();
    
    // Additional initialization if needed
    console.log('Evia Aesthetics website initialized');
});

/**
 * Initialize the preloader
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Animate elements once preloader is gone
            animateHeroElements();
        }, 800);
    });
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileItems = document.querySelectorAll('.mobile-item');
    
    // Handle scroll effects on header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
            mobileNav.classList.toggle('active');
        });
    }
    
    // Mobile submenu toggle
    mobileItems.forEach(item => {
        const hasSubmenu = item.querySelector('.mobile-submenu');
        if (hasSubmenu) {
            const link = item.querySelector('.mobile-link');
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('submenu-open');
                const submenu = item.querySelector('.mobile-submenu');
                
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            document.body.classList.remove('menu-open');
            mobileNav.classList.remove('active');
        }
    });

    // Explicitly add dropdown functionality for desktop
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    dropdownItems.forEach(item => {
        const menu = item.querySelector('.dropdown-menu');
        const link = item.querySelector('.nav-link');
        
        // Ensure proper dropdown display
        if (menu && link) {
            // Mouse enter event
            item.addEventListener('mouseenter', function() {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            });
            
            // Mouse leave event
            item.addEventListener('mouseleave', function() {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(10px)';
            });
        }
    });
}

/**
 * Initialize animations with GSAP
 */
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false,
        mirror: false,
        offset: 50
    });
    
    // Animate elements that come into view
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        gsap.from(element, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    const smoothScroll = new SmoothScroll('a[href*="#"]', {
        speed: 800,
        speedAsDuration: true,
        easing: 'easeInOutCubic',
        offset: 100
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
        });
    }
}

/**
 * Animate hero elements on page load
 */
function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle && heroSubtitle && heroButtons) {
        const heroTl = gsap.timeline();
        
        heroTl.from(heroTitle, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        })
        .from(heroSubtitle, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5")
        .from(heroButtons.children, {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.5");
    }
}

/**
 * Additional helper functions
 */

// Function to add soft hover effects to elements
function addHoverEffects() {
    const hoverElements = document.querySelectorAll('.hover-effect');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -5,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        element.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Function to handle form validations
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// Add soft reveal animations for images
function initImageReveal() {
    const images = document.querySelectorAll('.img-reveal');
    
    images.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('img-reveal-wrapper');
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        const overlay = document.createElement('div');
        overlay.classList.add('img-reveal-overlay');
        wrapper.appendChild(overlay);
        
        gsap.set(overlay, { width: '100%', height: '100%', top: 0, left: 0 });
        
        ScrollTrigger.create({
            trigger: wrapper,
            start: 'top 70%',
            onEnter: () => {
                gsap.to(overlay, {
                    width: 0,
                    duration: 1,
                    ease: 'power3.inOut'
                });
                gsap.from(img, {
                    scale: 1.1,
                    duration: 1.2,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    });
}

// Create staggered animation for multiple elements
function createStaggerAnimation(elements, staggerTime = 0.1) {
    gsap.from(elements, {
        opacity: 0,
        y: 30,
        stagger: staggerTime,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: elements[0].parentElement,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
}

// Initialize floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach((el, index) => {
        // Create random but smooth floating animation
        const randomY = 5 + Math.random() * 10;
        const randomDuration = 2 + Math.random() * 3;
        const randomDelay = Math.random() * 1;
        
        gsap.to(el, {
            y: randomY,
            duration: randomDuration,
            delay: randomDelay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// Enhance dropdown menu functionality
function enhanceDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const menu = item.querySelector('.dropdown-menu');
        const link = item.querySelector('.nav-link');
        
        // Add indicator to dropdown links
        if (link) {
            const indicator = document.createElement('span');
            indicator.classList.add('dropdown-indicator');
            indicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
            link.appendChild(indicator);
            
            // Animate indicator on hover
            item.addEventListener('mouseenter', () => {
                gsap.to(indicator, {
                    rotation: 180,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(indicator, {
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
        
        // Enhance dropdown menu animation
        if (menu) {
            const menuItems = menu.querySelectorAll('.dropdown-item');
            
            item.addEventListener('mouseenter', () => {
                gsap.to(menuItems, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.set(menuItems, {
                    clearProps: "all"
                });
            });
        }
    });
}
