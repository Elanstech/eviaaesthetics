// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeTypingEffect();
    initializeScrollEffects();
    initializeServiceCards();
    initializeFloatingElements();
});

// ===== ANIMATION INITIALIZATION =====
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 100
    });

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial hero animations
    gsap.timeline()
        .from('.hero-title .title-line', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            stagger: 0.3,
            ease: "back.out(1.7)"
        })
        .from('.hero-description', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.5")
        .from('.hero-cta', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)"
        }, "-=0.3");
}

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const services = [
        'Expert Medical Care',
        'Botox & Fillers',
        'Weight Loss Solutions',
        'IV Therapy',
        'Microneedling',
        'PRP Treatments',
        'Chemical Peels',
        'Aesthetic Excellence'
    ];

    // Initialize typing effect
    const typed = new Typed('.typing-text', {
        strings: services,
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        startDelay: 1000,
        loop: true,
        showCursor: false
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Parallax effect for hero video
    gsap.to('.hero-video', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Parallax effect for floating elements
    gsap.to('.float-element', {
        yPercent: -100,
        rotation: 360,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Services cards stagger animation
    gsap.fromTo('.service-card', 
        {
            y: 100,
            opacity: 0,
            scale: 0.8
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.services-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        // Hide scroll indicator when scrolling
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                gsap.to(scrollIndicator, {
                    opacity: 0,
                    duration: 0.3
                });
            } else {
                gsap.to(scrollIndicator, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }
}

// ===== SERVICE CARDS INTERACTIONS =====
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                rotationY: 5,
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.to(this.querySelector('.service-icon'), {
                scale: 1.2,
                rotation: 15,
                duration: 0.3,
                ease: "back.out(1.7)"
            });

            gsap.to(this.querySelector('.service-glow'), {
                opacity: 1,
                duration: 0.5
            });
        });

        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.to(this.querySelector('.service-icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.to(this.querySelector('.service-glow'), {
                opacity: 0,
                duration: 0.3
            });
        });

        // Click effect
        card.addEventListener('click', function() {
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out",
                onComplete: function() {
                    gsap.to(card, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    });
                }
            });

            // Add ripple effect
            createRippleEffect(this, event);
        });
    });
}

// ===== FLOATING ELEMENTS ANIMATION =====
function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
        gsap.to(element, {
            y: "random(-20, 20)",
            x: "random(-15, 15)",
            rotation: "random(-10, 10)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.5
        });

        // Opacity animation
        gsap.to(element, {
            opacity: "random(0.2, 0.6)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.3
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Create ripple effect on click
function createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = 60;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(212, 168, 87, 0.6) 0%, transparent 70%);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        z-index: 10;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: function() {
            ripple.remove();
        }
    });
}

// Logo size adjustment functions
function adjustLogoSize(size) {
    const logo = document.getElementById('logo');
    const sizes = {
        small: 40,
        medium: 50,
        large: 60,
        xl: 70
    };

    if (logo && sizes[size]) {
        gsap.to(logo, {
            width: sizes[size],
            height: sizes[size],
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Intersection Observer for advanced animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .hero-text');
    animateElements.forEach(el => observer.observe(el));
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for scroll events
function debounce(func, wait) {
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const scrollY = window.scrollY;
    
    // Update header state
    const header = document.getElementById('header');
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== BUTTON INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-consultation');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out",
                onComplete: function() {
                    gsap.to(button, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    });
                }
            });

            // Add booking functionality here
            console.log('Booking consultation clicked');
        });
    });
});

// ===== MOUSE CURSOR EFFECTS =====
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        // Create custom cursor if it doesn't exist
        const customCursor = document.createElement('div');
        customCursor.className = 'custom-cursor';
        customCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(212, 168, 87, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(customCursor);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    if (cursorElement) {
        cursorElement.style.left = e.clientX + 'px';
        cursorElement.style.top = e.clientY + 'px';
    }
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', function() {
    // Hide loading screen if it exists
    const loader = document.querySelector('.loader');
    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                loader.style.display = 'none';
            }
        });
    }

    // Start hero animations
    gsap.from('.hero-video', {
        scale: 1.1,
        duration: 2,
        ease: "power2.out"
    });
});

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
window.MedSpaAnimations = {
    adjustLogoSize: adjustLogoSize,
    createRippleEffect: createRippleEffect
};
