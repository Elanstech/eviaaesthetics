/* ========================================
   EVI AESTHETICS - MODERN LUXURY JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ========================================
       1. PRELOADER
       ======================================== */
    const preloader = document.getElementById('preloader');
    const body = document.body;
    
    // Simulate loading time
    setTimeout(() => {
        preloader.classList.add('hide');
        body.style.overflow = 'visible';
        
        // Remove preloader from DOM after animation
        setTimeout(() => {
            preloader.remove();
        }, 800);
        
        // Start entrance animations
        startEntranceAnimations();
    }, 2500);
    
    /* ========================================
       2. HEADER SCROLL EFFECTS
       ======================================== */
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        // Add scrolled class
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    /* ========================================
       3. MOBILE MENU
       ======================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-list a');
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'visible';
    });
    
    // Close mobile menu
    mobileClose.addEventListener('click', closeMobileMenu);
    
    // Close on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = 'visible';
    }
    
    /* ========================================
       4. SMOOTH SCROLLING
       ======================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ========================================
       5. GSAP ANIMATIONS
       ======================================== */
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    function startEntranceAnimations() {
        // Hero elements already animated with CSS
        // Add any additional GSAP animations here
        
        // Parallax for video background
        gsap.to('.hero-video', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
        
        // Floating elements animation
        gsap.utils.toArray('.float-circle, .float-line').forEach((element, i) => {
            gsap.to(element, {
                y: 'random(-50, 50)',
                x: 'random(-30, 30)',
                duration: 'random(15, 25)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 2
            });
        });
    }
    
    /* ========================================
       6. INTERSECTION OBSERVER
       ======================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that need reveal animation
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    /* ========================================
       7. PHONE NUMBER FORMATTING
       ======================================== */
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks if analytics is set up
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call'
                });
            }
        });
    });
    
    /* ========================================
       8. FLOATING CALL BUTTON
       ======================================== */
    const floatingCall = document.getElementById('floatingCall');
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            floatingCall.style.transform = 'scale(1)';
        } else {
            floatingCall.style.transform = 'scale(0)';
        }
    });
    
    // Add click tracking
    floatingCall.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'Floating Call Button'
            });
        }
    });
    
    /* ========================================
       9. HOVER EFFECTS
       ======================================== */
    // Add magnetic effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.primary-cta, .call-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
    
    /* ========================================
       10. PERFORMANCE OPTIMIZATION
       ======================================== */
    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            // Handle scroll-based animations
        });
    });
    
    // Lazy load images
    const imageTargets = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);
    
    imageTargets.forEach(img => imageObserver.observe(img));
    
    /* ========================================
       11. RESIZE HANDLER
       ======================================== */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Update any size-dependent calculations
            ScrollTrigger.refresh();
        }, 250);
    });
    
    /* ========================================
       12. ACCESSIBILITY
       ======================================== */
    // Handle keyboard navigation
    const interactiveElements = document.querySelectorAll('a, button, [tabindex]');
    
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    /* ========================================
       13. FORM HANDLING (if needed later)
       ======================================== */
    function initializeForms() {
        const forms = document.querySelectorAll('.contact-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Add your form submission logic here
                console.log('Form submitted');
            });
        });
    }
    
    /* ========================================
       14. VIDEO OPTIMIZATION
       ======================================== */
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Pause video when not in viewport
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play();
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.25 });
        
        videoObserver.observe(heroVideo);
        
        // Reduce quality on mobile
        if (window.innerWidth <= 768) {
            heroVideo.setAttribute('poster', 'video-poster-mobile.jpg');
        }
    }
    
    /* ========================================
       15. ANALYTICS EVENTS
       ======================================== */
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
    
    // Track CTA clicks
    document.querySelectorAll('.primary-cta, .call-btn').forEach(cta => {
        cta.addEventListener('click', function() {
            const label = this.querySelector('.cta-text, .call-label')?.textContent || 'CTA Click';
            trackEvent('Engagement', 'click', label);
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            if (maxScroll > 25 && maxScroll <= 30) {
                trackEvent('Engagement', 'scroll', '25%');
            } else if (maxScroll > 50 && maxScroll <= 55) {
                trackEvent('Engagement', 'scroll', '50%');
            } else if (maxScroll > 75 && maxScroll <= 80) {
                trackEvent('Engagement', 'scroll', '75%');
            } else if (maxScroll > 90) {
                trackEvent('Engagement', 'scroll', '90%');
            }
        }
    });
    
    /* ========================================
       16. INITIALIZATION COMPLETE
       ======================================== */
    console.log('✨ Evi Aesthetics - Modern luxury website initialized');
    
    // Add loaded class to body
    body.classList.add('loaded');
});

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
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
    };
}

// Add custom styles for accessibility
const style = document.createElement('style');
style.textContent = `
    .skip-to-content {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--hermes-orange);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    }
    
    .skip-to-content:focus {
        top: 0;
    }
    
    .keyboard-focus {
        outline: 2px solid var(--hermes-orange);
        outline-offset: 2px;
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);
