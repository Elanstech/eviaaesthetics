// ===== Enhanced Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 800);
        }
    }, 150);
    
    // Fallback timeout to ensure preloader always disappears
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
        }
    }, 4000);
});

// ===== Header Scroll Effects =====
const header = document.querySelector('.header');
let lastScroll = 0;
let ticking = false;

function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show header based on scroll direction (only on larger screens)
    if (window.innerWidth > 768) {
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger lines
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            body.style.overflow = ''; // Restore scroll
        }
    });
}

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            body.style.overflow = ''; // Restore scroll
            
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const headerOffset = 120;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Enhanced Parallax Effects =====
let isParallaxEnabled = window.innerWidth >= 768;
const parallaxElements = {
    video: document.querySelector('.hero-video'),
    floatingElements: document.querySelectorAll('.float-element'),
    decorations: document.querySelectorAll('.decoration')
};

function updateParallax() {
    if (!isParallaxEnabled) return;
    
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
    const scrollPercent = scrolled / heroHeight;
    
    // Only apply parallax within hero section
    if (scrollPercent < 1) {
        // Video parallax with subtle movement
        if (parallaxElements.video) {
            const videoScale = 1.1 + (scrollPercent * 0.1);
            parallaxElements.video.style.transform = `translate(-50%, -50%) scale(${videoScale})`;
        }
        
        // Floating elements with different speeds
        parallaxElements.floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Decorations subtle movement
        parallaxElements.decorations.forEach((decoration, index) => {
            const speed = 0.08 * (index + 1);
            const yPos = scrolled * speed;
            decoration.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Throttled parallax updates for better performance
let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (!parallaxTicking && isParallaxEnabled) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
        setTimeout(() => { parallaxTicking = false; }, 16);
    }
});

// ===== Enhanced Button Effects =====
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    // Mouse follow effect for primary buttons
    if (button.classList.contains('btn-primary')) {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            button.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                rgba(255,255,255,0.3) 0%, 
                transparent 50%),
                linear-gradient(135deg, var(--soft-gold), var(--copper))
            `;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'linear-gradient(135deg, var(--soft-gold), var(--copper))';
        });
    }
    
    // Magnetic effect for both buttons
    button.addEventListener('mousemove', function(e) {
        if (window.innerWidth > 768) { // Only on desktop
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            
            const baseTransform = this.classList.contains('btn-primary') 
                ? 'translateY(-4px) scale(1.05)' 
                : 'translateY(-3px) scale(1.02)';
            
            this.style.transform = `translate(${x}px, ${y}px) ${baseTransform}`;
        }
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
    
    // Touch effects for mobile
    button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// ===== Enhanced Logo Animation =====
const headerLogo = document.querySelector('.header-logo');
if (headerLogo) {
    headerLogo.addEventListener('mouseenter', () => {
        headerLogo.style.transform = 'scale(1.08) rotate(2deg)';
        headerLogo.style.filter = 'drop-shadow(0 8px 25px rgba(212, 168, 87, 0.4))';
    });
    
    headerLogo.addEventListener('mouseleave', () => {
        headerLogo.style.transform = 'scale(1) rotate(0deg)';
        headerLogo.style.filter = 'drop-shadow(var(--shadow-soft))';
    });
    
    // Add click animation
    headerLogo.addEventListener('click', (e) => {
        e.preventDefault();
        headerLogo.style.transform = 'scale(1.15) rotate(5deg)';
        setTimeout(() => {
            headerLogo.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    });
}

// ===== Feature Icons Hover Effects =====
document.querySelectorAll('.feature').forEach(feature => {
    const icon = feature.querySelector('.feature-icon');
    
    feature.addEventListener('mouseenter', () => {
        if (icon) {
            icon.style.transform = 'translateY(-5px) scale(1.1)';
            icon.style.background = 'rgba(212, 168, 87, 0.15)';
        }
    });
    
    feature.addEventListener('mouseleave', () => {
        if (icon) {
            icon.style.transform = 'translateY(0) scale(1)';
            icon.style.background = 'var(--glass-effect)';
        }
    });
});

// ===== Video Optimization =====
const video = document.querySelector('.hero-video');
if (video) {
    // Optimize video playback
    video.addEventListener('loadeddata', () => {
        video.play().catch(e => console.log('Video autoplay prevented:', e));
    });
    
    // Intersection observer for video performance
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(e => console.log('Video play prevented:', e));
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.1
    });
    
    videoObserver.observe(video);
    
    // Reduce video effects on mobile for better performance
    if (window.innerWidth < 768) {
        video.style.filter = 'blur(4px) brightness(1.3) saturate(0.6)';
    }
}

// ===== Scroll Indicator Animation =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    // Hide scroll indicator when scrolling past hero
    window.addEventListener('scroll', () => {
        const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
        const scrolled = window.pageYOffset;
        
        if (scrolled > heroHeight * 0.8) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Special animations for different elements
            if (entry.target.classList.contains('feature')) {
                const icon = entry.target.querySelector('.feature-icon');
                if (icon) {
                    setTimeout(() => {
                        icon.style.transform = 'translateY(-8px) scale(1.1)';
                        setTimeout(() => {
                            icon.style.transform = 'translateY(0) scale(1)';
                        }, 300);
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

// Observe elements for animation on scroll
document.querySelectorAll('.feature, .hero-badge, .hero-title span').forEach(element => {
    observer.observe(element);
});

// ===== Performance Optimization =====
// Disable parallax on mobile and low-end devices
function checkPerformance() {
    const isLowEnd = navigator.hardwareConcurrency < 4 || 
                     window.innerWidth < 768 || 
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    isParallaxEnabled = !isLowEnd;
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--ease-smooth', 'none');
        document.documentElement.style.setProperty('--ease-bounce', 'none');
        isParallaxEnabled = false;
    }
}

// ===== Resize Handler =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update parallax state based on screen size
        checkPerformance();
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
            
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
        
        // Update video filter for mobile
        if (video) {
            if (window.innerWidth < 768) {
                video.style.filter = 'blur(4px) brightness(1.3) saturate(0.6)';
            } else {
                video.style.filter = 'blur(3px) brightness(1.2) saturate(0.7)';
            }
        }
    }, 250);
});

// ===== Enhanced Scroll Effects =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    document.body.classList.add('scrolling');
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 150);
});

// ===== Accessibility Improvements =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        body.style.overflow = '';
        
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
        
        // Focus the toggle button
        mobileToggle.focus();
    }
    
    // Handle Enter key on interactive elements
    if (e.key === 'Enter') {
        const target = e.target;
        if (target.classList.contains('mobile-toggle')) {
            target.click();
        }
    }
});

// Focus management for mobile menu
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            // Focus first nav link when menu opens
            setTimeout(() => {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) firstLink.focus();
            }, 300);
        }
    });
}

// Add keyboard navigation for nav links
document.querySelectorAll('.nav-link').forEach((link, index, links) => {
    link.addEventListener('keydown', (e) => {
        if (navMenu.classList.contains('active')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextLink = links[index + 1] || links[0];
                nextLink.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevLink = links[index - 1] || links[links.length - 1];
                prevLink.focus();
            }
        }
    });
});

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Check performance capabilities
    checkPerformance();
    
    // Initialize smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Log successful initialization
    console.log('Evia Aesthetics - Enhanced Website Loaded Successfully');
    
    // Initialize any additional features after DOM is ready
    setTimeout(() => {
        // Trigger initial animations if preloader didn't run
        if (!document.querySelector('.preloader.loaded')) {
            document.querySelector('.preloader')?.classList.add('loaded');
        }
    }, 100);
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.warn('Non-critical error caught:', e.error);
    // Continue execution - don't break the site for minor errors
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.warn('Promise rejection handled:', e.reason);
    e.preventDefault(); // Prevent the default handling
});

// ===== Page Visibility API for Performance =====
document.addEventListener('visibilitychange', () => {
    const elements = document.querySelectorAll('.float-element, .decoration');
    elements.forEach(element => {
        if (document.hidden) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
    
    // Pause/resume video based on visibility
    if (video) {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(e => console.log('Video play prevented:', e));
        }
    }
});

// ===== Touch Device Optimizations =====
if ('ontouchstart' in window) {
    // Add touch class for CSS targeting
    document.body.classList.add('touch-device');
    
    // Improve touch scrolling on iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Handle touch events for better mobile experience
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchStartY - touchY;
        
        // Add momentum to parallax on touch devices (if enabled)
        if (isParallaxEnabled && Math.abs(touchDiff) > 5) {
            requestAnimationFrame(updateParallax);
        }
    }, { passive: true });
}

// ===== Final Setup =====
// Ensure all images are loaded before removing preloader
let imagesLoaded = 0;
const images = document.querySelectorAll('img');
const totalImages = images.length;

if (totalImages > 0) {
    images.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.addEventListener('load', () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    // All images loaded - can safely remove preloader
                    setTimeout(() => {
                        const preloader = document.querySelector('.preloader');
                        if (preloader && !preloader.classList.contains('loaded')) {
                            preloader.classList.add('loaded');
                        }
                    }, 500);
                }
            });
            
            img.addEventListener('error', () => {
                imagesLoaded++;
                console.warn('Failed to load image:', img.src);
            });
        }
    });
    
    // Check if all images were already loaded
    if (imagesLoaded === totalImages) {
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader && !preloader.classList.contains('loaded')) {
                preloader.classList.add('loaded');
            }
        }, 1000);
    }
}
