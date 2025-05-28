// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic',
    mirror: false
});

// Initialize Splitting for text animations
Splitting();

// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('hidden');
        // Start animations after preloader
        initAnimations();
    }, 1500);
});

// Initialize all animations
function initAnimations() {
    heroAnimations();
    navbarAnimations();
    parallaxEffects();
    initTyped();
    smoothScrolling();
    buttonAnimations();
}

// Hero Animations with GSAP
function heroAnimations() {
    // Hero timeline
    const heroTl = gsap.timeline({ delay: 0.5 });
    
    // Logo animation
    heroTl.from('.hero-logo-wrapper', {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
    })
    
    // Title animations
    .from('.title-line-1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    
    // Trust indicators stagger
    .from('.trust-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.3')
    
    // Buttons animation
    .from('.hero-buttons > *', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    
    // Scroll indicator
    .from('.scroll-indicator-modern', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.3');
    
    // Floating circles continuous animation
    gsap.to('.floating-circle', {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        duration: 'random(15, 25)',
        repeat: -1,
        repeatRefresh: true,
        ease: 'none',
        stagger: {
            each: 5,
            from: 'random'
        }
    });
}

// Navbar scroll effects
function navbarAnimations() {
    const navbar = document.getElementById('mainNav');
    let lastScroll = 0;
    let ticking = false;
    
    function updateNavbar() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            gsap.to(navbar, {
                y: -100,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        } else {
            gsap.to(navbar, {
                y: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// Parallax Effects
function parallaxEffects() {
    // Hero content parallax
    gsap.to('.hero-content', {
        y: () => window.innerHeight * 0.5,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Video parallax
    gsap.to('.hero-video', {
        y: () => window.innerHeight * 0.3,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Logo rotation on scroll
    gsap.to('.hero-logo', {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });
}

// Typed.js initialization
function initTyped() {
    new Typed('#typed-text', {
        strings: [
            'Natural Beauty',
            'Medical Excellence',
            'Timeless Elegance',
            'Your Confidence'
        ],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
        smartBackspace: true
    });
}

// Smooth scrolling for anchor links
function smoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                
                gsap.to(window, {
                    scrollTo: {
                        y: targetPosition,
                        autoKill: false
                    },
                    duration: 1,
                    ease: 'power3.inOut'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });
}

// Button hover animations
function buttonAnimations() {
    // Primary button magnetic effect
    const primaryBtns = document.querySelectorAll('.btn-primary-glow');
    
    primaryBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
    
    // Play button pulse enhancement
    const playBtn = document.querySelector('.btn-play-video');
    if (playBtn) {
        playBtn.addEventListener('mouseenter', () => {
            gsap.to('.play-icon', {
                scale: 1.1,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        });
        
        playBtn.addEventListener('mouseleave', () => {
            gsap.to('.play-icon', {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
}

// Hamburger menu animation
const navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', function() {
    this.classList.toggle('active');
});

// Text reveal on scroll
gsap.utils.toArray('.section-title .title-word').forEach((word, i) => {
    gsap.from(word, {
        scrollTrigger: {
            trigger: word,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// Trust items counter animation
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Intersection Observer for fade animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
            });
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with fade class
document.querySelectorAll('.fade-in').forEach(el => {
    gsap.set(el, { opacity: 0, y: 50 });
    fadeObserver.observe(el);
});

// Mobile menu close on outside click
document.addEventListener('click', (e) => {
    const navbar = document.getElementById('mainNav');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navbarCollapse).hide();
        navbarToggler.classList.remove('active');
    }
});

// Video optimization for mobile
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && window.innerWidth < 768) {
    heroVideo.setAttribute('poster', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1920');
}

// Performance optimization - Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        AOS.refresh();
        ScrollTrigger.refresh();
    }, 250);
});

// Smooth page transitions
window.addEventListener('beforeunload', () => {
    gsap.to('body', {
        opacity: 0,
        duration: 0.3
    });
});

// Add custom cursor (optional elegant touch)
if (window.innerWidth > 991) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn-primary-glow, .btn-play-video');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });
}

// Add custom cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(212, 168, 87, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: border-color 0.3s ease;
        mix-blend-mode: difference;
    }
    
    .cursor-dot {
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--soft-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
    }
    
    .custom-cursor.cursor-hover {
        border-color: var(--soft-gold);
        background: rgba(212, 168, 87, 0.1);
    }
    
    @media (max-width: 991px) {
        .custom-cursor, .cursor-dot {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);

// Console styling
console.log(
    '%c eviaesthetics ',
    'background: linear-gradient(135deg, #D4A857 0%, #E4A853 100%); color: white; font-size: 24px; font-weight: bold; padding: 10px 30px; border-radius: 50px; font-family: "Playfair Display", serif;'
);
console.log('✨ Welcome to eviaesthetics - Where Science Meets Natural Beauty');

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization
    console.log('Website initialized successfully');
});
