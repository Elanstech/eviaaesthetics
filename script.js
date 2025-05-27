// ===== Enhanced Preloader with Progress =====
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    const progressRing = document.querySelector('.progress-ring-fill');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    let progress = 0;
    const circumference = 2 * Math.PI * 90; // 2πr
    
    // Set initial progress
    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = circumference;
    
    // Simulate loading with more realistic progress
    const updateProgress = () => {
        if (progress < 100) {
            // Accelerate progress as we get closer to completion
            const increment = progress < 50 ? Math.random() * 3 : 
                             progress < 80 ? Math.random() * 5 : 
                             Math.random() * 10;
            
            progress = Math.min(progress + increment, 100);
            
            // Update percentage text
            loadingPercentage.textContent = Math.floor(progress);
            
            // Update progress ring
            const offset = circumference - (progress / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
            
            requestAnimationFrame(updateProgress);
        } else {
            // Loading complete
            setTimeout(() => {
                preloader.classList.add('loaded');
                initializeAnimations();
                initializeVideo();
            }, 500);
        }
    };
    
    // Start loading animation
    updateProgress();
});

// ===== Video Background Initialization =====
function initializeVideo() {
    const video = document.querySelector('.hero-video');
    const videoContainer = document.querySelector('.hero-video-background');
    
    if (video) {
        // Ensure video starts playing
        video.play().catch(e => {
            console.log('Video autoplay was prevented:', e);
            // If autoplay fails, try to play on user interaction
            document.addEventListener('click', () => {
                video.play();
            }, { once: true });
        });
        
        // Handle video load events
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            videoContainer.style.opacity = '1';
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video failed to load:', e);
            // Hide video container if it fails to load
            videoContainer.style.display = 'none';
        });
        
        // Optimize video performance
        video.addEventListener('loadstart', () => {
            video.preload = 'metadata';
        });
        
        // Ensure video loops properly
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
        });
        
        // Pause video when page is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                video.play();
            }
        });
    }
}

// ===== Initialize AOS (Animate On Scroll) =====
function initializeAnimations() {
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: true,
        mirror: false,
        offset: 100
    });
}

// ===== GSAP Animations =====
gsap.registerPlugin(ScrollTrigger);

// Enhanced parallax for hero video
gsap.to('.hero-video', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Parallax for hero overlay
gsap.to('.hero-video-overlay', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// ===== Navigation Functionality =====
const navbar = document.querySelector('.navbar');
const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Enhanced scroll effect for navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
mobileMenuTrigger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileMenuTrigger.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', closeMobileMenu);

mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuTrigger.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Smooth Scrolling for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== Enhanced Number Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
const countingSpeed = 2000; // 2 seconds

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-count'));
    const increment = target / (countingSpeed / 16); // 60 FPS
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
            
            // Add plus sign for 5000+ and % for 100
            if (target === 5000) {
                element.textContent = '5,000+';
            } else if (target === 100) {
                element.textContent = '100%';
            } else {
                element.textContent = target.toLocaleString();
            }
        }
    };
    
    updateCounter();
};

// Observe stat numbers for animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(number => {
    statObserver.observe(number);
});

// ===== Vanilla Tilt for 3D Effects =====
VanillaTilt.init(document.querySelectorAll('.hero-image-wrapper'), {
    max: 15,
    speed: 400,
    glare: true,
    'max-glare': 0.3,
    gyroscope: true
});

VanillaTilt.init(document.querySelectorAll('.floating-card'), {
    max: 25,
    speed: 300,
    glare: true,
    'max-glare': 0.5
});

// ===== Enhanced Button Ripple Effect =====
const buttons = document.querySelectorAll('.hero-btn, .nav-cta-btn, .mobile-cta-btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ===== Magnetic Cursor Effect (Desktop Only) =====
if (window.innerWidth > 768) {
    const magneticElements = document.querySelectorAll('.nav-link, .hero-btn, .floating-card');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(element, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ===== Enhanced Text Scramble Effect for Hero Title =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to hero title on load
const titleElements = document.querySelectorAll('.title-gradient, .title-outline');
titleElements.forEach((element, index) => {
    setTimeout(() => {
        const scrambler = new TextScramble(element);
        scrambler.setText(element.textContent);
    }, 1000 + (index * 200));
});

// ===== Enhanced Performance Optimization =====
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

// Throttle function for resize events
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

// ===== Enhanced Lazy Loading Images =====
const images = document.querySelectorAll('img');
const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 50px 0px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
            observer.unobserve(img);
        }
    });
}, imageOptions);

images.forEach(img => {
    imageObserver.observe(img);
});

// ===== Page Visibility API Enhancement =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations and video when page is not visible
        gsap.globalTimeline.pause();
        const video = document.querySelector('.hero-video');
        if (video && !video.paused) {
            video.pause();
        }
    } else {
        // Resume animations and video when page becomes visible
        gsap.globalTimeline.resume();
        const video = document.querySelector('.hero-video');
        if (video && video.paused) {
            video.play();
        }
    }
});

// ===== Enhanced Mobile Touch Improvements =====
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch feedback with haptic feedback
    const touchElements = document.querySelectorAll('.hero-btn, .nav-link, .mobile-nav-link');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
            
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        });
    });
}

// ===== Enhanced Custom Cursor (Desktop Only) =====
if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const animateCursor = () => {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;
        
        cursorX += distX * 0.1;
        cursorY += distY * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Enhanced cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .hero-btn, .nav-link, .floating-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
}

// ===== Enhanced Error Handling =====
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    
    // Optional: Send error to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.toString(),
            fatal: false
        });
    }
});

// ===== Enhanced Performance Monitoring =====
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
            if (entry.entryType === 'layout-shift') {
                console.log('CLS:', entry.value);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
}

// ===== Service Worker Registration (for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== Intersection Observer for Enhanced Animations =====
const animatedElements = document.querySelectorAll('.hero-content, .floating-card, .about-content');
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(element => {
    animationObserver.observe(element);
});

// ===== Video Quality Optimization =====
function optimizeVideoQuality() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
        // Adjust video quality based on connection speed
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            video.style.display = 'none'; // Hide video on slow connections
        } else if (connection.effectiveType === '3g') {
            video.poster = 'hero-poster-low.jpg'; // Use lower quality poster
        }
    }
    
    // Preload based on viewport size
    if (window.innerWidth <= 768) {
        video.preload = 'none';
    }
}

// ===== Initialize Everything =====
window.addEventListener('load', () => {
    console.log('Evia Aesthetics - Modern Website Loaded Successfully');
    
    // Remove no-js class if present
    document.documentElement.classList.remove('no-js');
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
    
    // Optimize video quality
    optimizeVideoQuality();
    
    // Initialize additional features
    setTimeout(() => {
        // Preload critical assets
        const criticalImages = ['eviaherself.jpg', 'logo.png'];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, 2000);
});

// ===== Resize Handler =====
window.addEventListener('resize', throttle(() => {
    // Reinitialize cursor on desktop after resize
    if (window.innerWidth <= 1024) {
        const customCursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        if (customCursor) customCursor.remove();
        if (cursorDot) cursorDot.remove();
    }
}, 250));
