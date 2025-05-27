// ===== Clean Minimalistic Preloader =====
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    let progress = 0;
    
    // Clean progress simulation
    const updateProgress = () => {
        if (progress < 100) {
            // Smooth, realistic progression
            const increment = progress < 50 ? Math.random() * 3 + 1 : 
                             progress < 80 ? Math.random() * 2 + 0.5 : 
                             Math.random() * 1 + 0.3;
            
            progress = Math.min(progress + increment, 100);
            
            // Update display
            const displayProgress = Math.floor(progress);
            loadingPercentage.textContent = displayProgress;
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            
            requestAnimationFrame(updateProgress);
        } else {
            // Complete loading
            setTimeout(() => {
                preloader.classList.add('loaded');
                
                // Initialize website after preloader
                setTimeout(() => {
                    initializeWebsite();
                }, 300);
            }, 500);
        }
    };
    
    // Start loading after a brief delay
    setTimeout(() => {
        updateProgress();
    }, 800);
});

// ===== Initialize Website Features =====
function initializeWebsite() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }
    
    // Initialize video
    initializeVideo();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize other features
    initializeCounters();
    initializeScrollEffects();
    initializeButtonEffects();
    initializeTiltEffects();
}

// ===== Video Background =====
function initializeVideo() {
    const video = document.querySelector('.hero-video');
    const videoContainer = document.querySelector('.hero-video-background');
    
    if (video) {
        video.play().catch(e => {
            console.log('Video autoplay prevented:', e);
            // Try to play on user interaction
            document.addEventListener('click', () => {
                video.play();
            }, { once: true });
        });
        
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            if (videoContainer) {
                videoContainer.style.opacity = '1';
            }
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video failed to load:', e);
            if (videoContainer) {
                videoContainer.style.display = 'none';
            }
        });
        
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
        });
        
        // Pause video when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                video.play();
            }
        });
    }
}

// ===== Navigation =====
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Scroll effect for navbar
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
    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuTrigger.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuTrigger.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Smooth scrolling for navigation links
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
    
    // Active navigation link
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
}

// ===== Counter Animation =====
function initializeCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const countingSpeed = 2000;
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const increment = target / (countingSpeed / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                
                // Add formatting for specific numbers
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
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
        statObserver.observe(number);
    });
}

// ===== Scroll Effects with GSAP =====
function initializeScrollEffects() {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero video parallax
        gsap.to('.hero-video', {
            yPercent: -25,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });
        
        // Hero overlay parallax
        gsap.to('.hero-video-overlay', {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        // Floating cards animation
        gsap.utils.toArray('.floating-card').forEach((card, i) => {
            gsap.fromTo(card, {
                y: 50,
                opacity: 0,
                scale: 0.9
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                delay: i * 0.2
            });
        });
        
        // Magnetic effect for interactive elements
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
    }
}

// ===== Button Ripple Effects =====
function initializeButtonEffects() {
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
}

// ===== 3D Tilt Effects =====
function initializeTiltEffects() {
    if (typeof VanillaTilt !== 'undefined') {
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
    }
}

// ===== Text Scramble Effect =====
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

// Apply scramble effect to hero title
setTimeout(() => {
    const titleElements = document.querySelectorAll('.title-gradient, .title-outline');
    titleElements.forEach((element, index) => {
        setTimeout(() => {
            const scrambler = new TextScramble(element);
            scrambler.setText(element.textContent);
        }, index * 200);
    });
}, 2000);

// ===== Mobile Touch Improvements =====
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
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

// ===== Performance Utilities =====
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

// ===== Lazy Loading Images =====
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

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// ===== Page Load Complete =====
window.addEventListener('load', () => {
    console.log('Evia Aesthetics - Loaded Successfully ✨');
    
    // Remove no-js class if present
    document.documentElement.classList.remove('no-js');
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
    
    // Preload critical assets
    setTimeout(() => {
        const criticalImages = ['eviaherself.jpg', 'logo.png'];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, 2000);
});

// ===== Resize Handler =====
window.addEventListener('resize', throttle(() => {
    // Handle responsive changes
    console.log('Window resized');
}, 250));
