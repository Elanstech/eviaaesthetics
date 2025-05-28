// ===== ADVANCED BEAUTY HEADER JAVASCRIPT =====

// Global variables
let lastScrollTop = 0;
let isScrolling = false;
let headerHeight = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeParticleAnimations();
    initializeButtonEffects();
    initializeDropdownMenus();
    initializeSmoothScrolling();
    initializeLogoAnimations();
    initializeAdvancedEffects();
});

// ===== HEADER INITIALIZATION =====
function initializeHeader() {
    const header = document.getElementById('luxury-header');
    headerHeight = header.offsetHeight;
    
    // Set initial header state
    gsap.set(header, {
        background: 'transparent'
    });
    
    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    
    // Handle resize
    window.addEventListener('resize', debounce(function() {
        headerHeight = header.offsetHeight;
        handleResize();
    }, 250));
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const header = document.getElementById('luxury-header');
    const logo = document.getElementById('main-logo');
    const brandName = document.querySelector('.brand-name');
    const brandTagline = document.querySelector('.brand-tagline');
    
    // Create GSAP timeline for scroll animations
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: self => {
                if (self.progress > 0.05) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }
    });
    
    // Animate logo on scroll
    gsap.to(logo, {
        scale: 0.9,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "200px top",
            scrub: true
        }
    });
    
    // Animate brand text on scroll
    gsap.to([brandName, brandTagline], {
        opacity: 0.7,
        scale: 0.95,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "150px top",
            scrub: true
        }
    });
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.getElementById('luxury-header');
    
    // Header hide/show on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        // Scrolling down
        header.classList.add('hide');
        header.classList.remove('show');
    } else {
        // Scrolling up
        header.classList.remove('hide');
        header.classList.add('show');
    }
    
    // Update scroll state
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    isScrolling = false;
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Animate menu items
        if (mobileOverlay.classList.contains('active')) {
            animateMobileMenuIn();
        } else {
            animateMobileMenuOut();
        }
    });
    
    // Close menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            animateMobileMenuOut();
        });
    });
    
    // Close menu on overlay click
    mobileOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            mobileToggle.classList.remove('active');
            this.classList.remove('active');
            document.body.classList.remove('menu-open');
            animateMobileMenuOut();
        }
    });
}

function animateMobileMenuIn() {
    const menuItems = document.querySelectorAll('.mobile-nav-item');
    const logo = document.querySelector('.mobile-logo');
    const cta = document.querySelector('.mobile-cta');
    const social = document.querySelector('.mobile-social');
    
    gsap.timeline()
        .from(logo, {
            duration: 0.6,
            y: -50,
            opacity: 0,
            ease: "back.out(1.7)"
        })
        .from(menuItems, {
            duration: 0.5,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3")
        .from([cta, social], {
            duration: 0.5,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.2");
}

function animateMobileMenuOut() {
    const menuContent = document.querySelector('.mobile-menu-content');
    
    gsap.to(menuContent, {
        duration: 0.3,
        y: -20,
        opacity: 0,
        ease: "power2.in"
    });
}

// ===== PARTICLE ANIMATIONS =====
function initializeParticleAnimations() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Random floating animation
        gsap.to(particle, {
            x: `random(-50, 50)`,
            y: `random(-30, 30)`,
            rotation: `random(0, 360)`,
            duration: `random(4, 8)`,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.5
        });
        
        // Opacity animation
        gsap.to(particle, {
            opacity: `random(0.2, 0.8)`,
            duration: `random(2, 4)`,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.3
        });
        
        // Mouse interaction
        particle.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.5,
                opacity: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        particle.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                opacity: 0.6,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Add dynamic particles
    createDynamicParticles();
}

function createDynamicParticles() {
    const particleContainer = document.querySelector('.beauty-particles');
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * window.innerWidth;
        const colors = ['#D4A857', '#E8B4A0', '#C07F51', '#EFD9C1'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            top: 100vh;
            left: ${startX}px;
            pointer-events: none;
            opacity: 0.6;
        `;
        
        particleContainer.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            y: -window.innerHeight - 100,
            x: `random(-100, 100)`,
            rotation: 360,
            opacity: 0,
            duration: `random(8, 15)`,
            ease: "none",
            onComplete: () => {
                particle.remove();
            }
        });
        
    }, 3000);
}

// ===== BUTTON EFFECTS =====
function initializeButtonEffects() {
    const premiumBtn = document.querySelector('.premium-btn');
    const secondaryBtn = document.querySelector('.secondary-btn');
    const mobileBtn = document.querySelector('.mobile-btn-consultation');
    
    // Premium button effects
    if (premiumBtn) {
        premiumBtn.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.btn-bg'), {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Animate particles
            const particles = this.querySelectorAll('.btn-particle');
            particles.forEach((particle, index) => {
                gsap.to(particle, {
                    opacity: 1,
                    scale: 1.5,
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "back.out(1.7)"
                });
            });
        });
        
        premiumBtn.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.btn-bg'), {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            const particles = this.querySelectorAll('.btn-particle');
            gsap.to(particles, {
                opacity: 0,
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        premiumBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createButtonRipple(this, e);
            // Add your booking logic here
            console.log('Premium consultation booking clicked');
        });
    }
    
    // Secondary button effects
    if (secondaryBtn) {
        secondaryBtn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        secondaryBtn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        secondaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your call logic here
            console.log('Call button clicked');
        });
    }
    
    // Mobile button effects
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createButtonRipple(this, e);
            // Add your booking logic here
            console.log('Mobile consultation booking clicked');
        });
    }
}

function createButtonRipple(button, event) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = 60;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        z-index: 100;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            ripple.remove();
        }
    });
}

// ===== DROPDOWN MENUS =====
function initializeDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const links = dropdown.querySelectorAll('.dropdown-link');
        
        dropdown.addEventListener('mouseenter', function() {
            gsap.to(menu, {
                opacity: 1,
                visibility: 'visible',
                y: 0,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
            
            gsap.from(links, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.out",
                delay: 0.1
            });
        });
        
        dropdown.addEventListener('mouseleave', function() {
            gsap.to(menu, {
                opacity: 0,
                visibility: 'hidden',
                y: 20,
                duration: 0.2,
                ease: "power2.in"
            });
        });
        
        // Add hover effects to dropdown links
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    x: 10,
                    scale: 1.02,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            link.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    x: 0,
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    gsap.to(window, {
                        scrollTo: {
                            y: targetPosition,
                            autoKill: false
                        },
                        duration: 1,
                        ease: "power2.inOut"
                    });
                }
            }
        });
    });
}

// ===== LOGO ANIMATIONS =====
function initializeLogoAnimations() {
    const logoWrapper = document.querySelector('.logo-wrapper');
    const logo = document.querySelector('.main-logo');
    const brandName = document.querySelector('.brand-name');
    
    // Logo hover effects
    logoWrapper.addEventListener('mouseenter', function() {
        gsap.timeline()
            .to(logo, {
                scale: 1.15,
                rotation: 10,
                duration: 0.4,
                ease: "back.out(1.7)"
            })
            .to(brandName, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            }, "-=0.2");
    });
    
    logoWrapper.addEventListener('mouseleave', function() {
        gsap.timeline()
            .to(logo, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(brandName, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            }, "-=0.2");
    });
    
    // Logo click animation
    logoWrapper.addEventListener('click', function() {
        gsap.timeline()
            .to(logo, {
                scale: 0.9,
                duration: 0.1,
                ease: "power2.out"
            })
            .to(logo, {
                scale: 1.1,
                rotation: 360,
                duration: 0.5,
                ease: "back.out(1.7)"
            })
            .to(logo, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
    });
}

// ===== ADVANCED EFFECTS =====
function initializeAdvancedEffects() {
    // Social link hover effects
    const socialLinks = document.querySelectorAll('.social-link, .mobile-social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.2,
                rotation: 15,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Navigation link hover effects
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.link-text'), {
                y: -2,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.link-text'), {
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });
    
    // Header glow effect on scroll
    window.addEventListener('scroll', debounce(function() {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        const header = document.querySelector('.luxury-header');
        
        if (scrollPercent > 0.1) {
            header.style.boxShadow = `0 20px 60px rgba(212, 168, 87, ${0.15 + scrollPercent * 0.1})`;
        }
    }, 16));
    
    // Mouse cursor effects
    initializeCustomCursor();
}

// ===== CUSTOM CURSOR =====
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(212, 168, 87, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "none"
        });
    });
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .social-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            gsap.to(cursor, {
                scale: 2,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        element.addEventListener('mouseleave', function() {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });
}

// ===== UTILITY FUNCTIONS =====
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

function handleResize() {
    const header = document.getElementById('luxury-header');
    headerHeight = header.offsetHeight;
    
    // Recalculate particle positions
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        
        gsap.set(particle, {
            x: randomX,
            y: randomY
        });
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
    // Use passive event listeners where possible
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', function() {}, { passive: true });
    
    // Lazy load non-critical animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Initialize animations for visible elements
                entry.target.classList.add('animate-in');
            }
        });
    });
    
    // Observe elements for lazy animation
    document.querySelectorAll('.animate-lazy').forEach(el => {
        observer.observe(el);
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            const mobileToggle = document.getElementById('mobile-toggle');
            const mobileOverlay = document.getElementById('mobile-overlay');
            
            if (mobileOverlay.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
                animateMobileMenuOut();
            }
        }
    });
    
    // Focus management
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #D4A857';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// ===== INITIALIZATION COMPLETE =====
document.addEventListener('DOMContentLoaded', function() {
    optimizePerformance();
    initializeAccessibility();
    
    // Add loading animation
    gsap.from('.luxury-header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2
    });
    
    console.log('Advanced Beauty Header initialized successfully!');
});

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
window.BeautyHeader = {
    adjustLogoSize: function(size) {
        const logo = document.getElementById('main-logo');
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
    },
    
    showNotification: function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#D4A857' : '#C07F51'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            z-index: 10001;
            font-family: var(--font-modern);
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        gsap.from(notification, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
        
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => notification.remove()
            });
        }, 3000);
    }
};
