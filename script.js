/* ========================================
   EVI AESTHETICS - LUXURY JAVASCRIPT
   ========================================
   TABLE OF CONTENTS:
   
   1. GLOBAL VARIABLES & DOM ELEMENTS
   2. INITIALIZATION
   3. PRELOADER FUNCTIONALITY
   4. CUSTOM CURSOR
   5. NAVIGATION INTERACTIONS
   6. HERO ANIMATIONS
   7. SCROLL ANIMATIONS
   8. PARALLAX EFFECTS
   9. BUTTON INTERACTIONS
   10. MOBILE MENU
   11. SMOOTH SCROLLING
   12. RESIZE HANDLERS
   13. UTILITY FUNCTIONS
   14. EVENT LISTENERS
   ======================================== */

/* ========================================
   1. GLOBAL VARIABLES & DOM ELEMENTS
   ======================================== */
const DOM = {
    // Preloader
    preloader: document.getElementById('preloader'),
    
    // Cursor
    cursor: document.getElementById('cursor'),
    cursorFollower: document.getElementById('cursor-follower'),
    
    // Navigation
    header: document.getElementById('header'),
    navLinks: document.querySelectorAll('.nav-link'),
    menuToggle: document.getElementById('menuToggle'),
    navMenu: document.getElementById('navMenu'),
    
    // Hero
    heroSection: document.getElementById('hero'),
    heroTitle: document.querySelectorAll('.title-word'),
    heroTagline: document.querySelector('.hero-tagline'),
    floatingElements: document.querySelectorAll('.float-element'),
    
    // Buttons
    luxuryButtons: document.querySelectorAll('.luxury-btn'),
    floatingBookBtn: document.getElementById('floatingBookBtn'),
    backToTop: document.getElementById('backToTop'),
    
    // General
    body: document.body,
    html: document.documentElement
};

// Animation Timelines
let masterTimeline;
let heroTimeline;
let scrollTimeline;

// State Variables
let isLoading = true;
let isMobile = window.innerWidth <= 768;
let scrollPosition = 0;
let mousePosition = { x: 0, y: 0 };

/* ========================================
   2. INITIALIZATION
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializePreloader();
    initializeCursor();
    initializeNavigation();
    initializeScrollEffects();
    initializeButtonEffects();
    initializeMobileMenu();
    initializeParallax();
    
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // Set initial states
    gsap.set([DOM.heroTitle, DOM.heroTagline], { opacity: 0 });
});

/* ========================================
   3. PRELOADER FUNCTIONALITY
   ======================================== */
function initializePreloader() {
    // Minimum loading time for effect
    const minimumLoadTime = 2000;
    const startTime = Date.now();
    
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);
        
        setTimeout(() => {
            // Fade out preloader
            gsap.to(DOM.preloader, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    DOM.preloader.classList.add('loaded');
                    isLoading = false;
                    startHeroAnimation();
                    DOM.body.style.overflow = 'visible';
                }
            });
        }, remainingTime);
    });
}

/* ========================================
   4. CUSTOM CURSOR
   ======================================== */
function initializeCursor() {
    if (isMobile) return;
    
    // Hide default cursor
    DOM.body.style.cursor = 'none';
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
        
        // Immediate cursor position
        gsap.to(DOM.cursor, {
            x: mousePosition.x - 5,
            y: mousePosition.y - 5,
            duration: 0
        });
        
        // Delayed follower
        gsap.to(DOM.cursorFollower, {
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    // Cursor interactions
    const interactiveElements = [
        ...document.querySelectorAll('a'),
        ...document.querySelectorAll('button'),
        ...document.querySelectorAll('[data-cursor="hover"]')
    ];
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            DOM.body.classList.add('cursor-hover');
            DOM.cursorFollower.classList.add('active');
            
            // Get hover text if available
            const hoverText = element.getAttribute('data-cursor-text');
            if (hoverText) {
                DOM.cursorFollower.querySelector('.cursor-text').textContent = hoverText;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            DOM.body.classList.remove('cursor-hover');
            DOM.cursorFollower.classList.remove('active');
            DOM.cursorFollower.querySelector('.cursor-text').textContent = 'View';
        });
    });
    
    // Click animation
    document.addEventListener('mousedown', () => {
        DOM.body.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
        DOM.body.classList.remove('cursor-click');
    });
}

/* ========================================
   5. NAVIGATION INTERACTIONS
   ======================================== */
function initializeNavigation() {
    // Scroll-based header styling
    let lastScrollY = 0;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // Hide/show on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            gsap.to(DOM.header, {
                y: -100,
                duration: 0.3,
                ease: "power2.inOut"
            });
        } else {
            gsap.to(DOM.header, {
                y: 0,
                duration: 0.3,
                ease: "power2.inOut"
            });
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Navigation link animations
    DOM.navLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link.querySelector('span'), {
                y: -2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link.querySelector('span'), {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

/* ========================================
   6. HERO ANIMATIONS
   ======================================== */
function startHeroAnimation() {
    heroTimeline = gsap.timeline();
    
    // Animate hero elements in sequence
    heroTimeline
        .to('.hero-inner', {
            opacity: 1,
            duration: 0,
        })
        .from('.tagline-word', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        })
        .from('.title-word', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.4")
        .from('.hero-description', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .from('.hero-cta-wrapper', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4")
        .from('.scroll-indicator', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4")
        .from('.social-links', {
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .from('.hero-contact-info', {
            x: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.8");
    
    // Continuous animations
    animateFloatingElements();
    animateLuxuryEmphasis();
}

function animateFloatingElements() {
    DOM.floatingElements.forEach((element, index) => {
        gsap.to(element, {
            y: "random(-30, 30)",
            x: "random(-30, 30)",
            rotation: "random(-15, 15)",
            duration: "random(20, 30)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 2
        });
    });
}

function animateLuxuryEmphasis() {
    // Shimmer effect on luxury text
    const luxuryText = document.querySelector('.luxury-emphasis');
    if (luxuryText) {
        gsap.to(luxuryText, {
            backgroundPosition: "200% center",
            duration: 3,
            repeat: -1,
            ease: "linear"
        });
    }
}

/* ========================================
   7. SCROLL ANIMATIONS
   ======================================== */
function initializeScrollEffects() {
    // Reveal animations for sections
    gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.from(section, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Parallax scrolling for hero
    gsap.to('.hero-video-wrapper', {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
    
    // Floating button visibility
    ScrollTrigger.create({
        start: "top -100",
        onUpdate: (self) => {
            if (self.direction === 1 && self.progress > 0.1) {
                DOM.floatingBookBtn.classList.add('visible');
            } else if (self.direction === -1 && self.progress < 0.1) {
                DOM.floatingBookBtn.classList.remove('visible');
            }
        }
    });
    
    // Back to top visibility
    ScrollTrigger.create({
        start: "top -300",
        onUpdate: (self) => {
            if (self.progress > 0.2) {
                DOM.backToTop.classList.add('visible');
            } else {
                DOM.backToTop.classList.remove('visible');
            }
        }
    });
}

/* ========================================
   8. PARALLAX EFFECTS
   ======================================== */
function initializeParallax() {
    if (isMobile) return;
    
    // Mouse parallax for floating elements
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;
        
        DOM.floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            gsap.to(element, {
                x: moveX * speed * 20,
                y: moveY * speed * 20,
                duration: 1,
                ease: "power2.out"
            });
        });
    });
}

/* ========================================
   9. BUTTON INTERACTIONS
   ======================================== */
function initializeButtonEffects() {
    // Luxury button hover effects
    DOM.luxuryButtons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Ripple effect from mouse position
            const ripple = document.createElement('div');
            ripple.classList.add('button-ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            
            gsap.to(ripple, {
                width: rect.width * 2,
                height: rect.width * 2,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });
    });
    
    // Floating book button interaction
    DOM.floatingBookBtn.addEventListener('click', () => {
        // Create booking modal or redirect
        gsap.to(DOM.floatingBookBtn, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    });
    
    // Back to top smooth scroll
    DOM.backToTop.addEventListener('click', () => {
        gsap.to(window, {
            scrollTo: 0,
            duration: 1.5,
            ease: "power3.inOut"
        });
    });
}

/* ========================================
   10. MOBILE MENU
   ======================================== */
function initializeMobileMenu() {
    DOM.menuToggle.addEventListener('click', () => {
        DOM.menuToggle.classList.toggle('active');
        DOM.navMenu.classList.toggle('active');
        DOM.body.classList.toggle('menu-open');
        
        // Animate menu items
        if (DOM.navMenu.classList.contains('active')) {
            gsap.from('.nav-list .nav-item', {
                x: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out"
            });
        }
    });
    
    // Close menu on link click
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            DOM.menuToggle.classList.remove('active');
            DOM.navMenu.classList.remove('active');
            DOM.body.classList.remove('menu-open');
        });
    });
}

/* ========================================
   11. SMOOTH SCROLLING
   ======================================== */
function initializeSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                gsap.to(window, {
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    duration: 1.2,
                    ease: "power3.inOut"
                });
            }
        });
    });
}

/* ========================================
   12. RESIZE HANDLERS
   ======================================== */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        isMobile = window.innerWidth <= 768;
        
        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
        
        // Reinitialize certain features based on screen size
        if (isMobile) {
            DOM.body.style.cursor = 'auto';
            DOM.cursor.style.display = 'none';
            DOM.cursorFollower.style.display = 'none';
        } else {
            DOM.body.style.cursor = 'none';
            DOM.cursor.style.display = 'block';
            DOM.cursorFollower.style.display = 'block';
        }
    }, 250);
});

/* ========================================
   13. UTILITY FUNCTIONS
   ======================================== */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

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

/* ========================================
   14. PERFORMANCE OPTIMIZATION
   ======================================== */
// Optimize scroll events
let isScrolling = false;
let scrollTimeout;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            // Perform scroll-based calculations here
            scrollPosition = window.scrollY;
            isScrolling = false;
        });
        isScrolling = true;
    }
    
    // Clear timeout
    clearTimeout(scrollTimeout);
    
    // Set a timeout to run after scrolling ends
    scrollTimeout = setTimeout(() => {
        // Perform actions after scroll ends
    }, 150);
});

// Initialize smooth scroll
initializeSmoothScroll();

// Add custom styles for button ripple
const style = document.createElement('style');
style.textContent = `
    .button-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Log initialization complete
console.log('Evi Aesthetics luxury website initialized successfully! ✨');
