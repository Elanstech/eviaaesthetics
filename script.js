// ===== Enhanced Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        if (loadingProgress) {
            loadingProgress.style.width = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('loaded');
                }
            }, 800);
        }
    }, 150);
    
    // Fallback timeout to ensure preloader always disappears
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
        }
    }, 4000);
});

// ===== Modern Header Scroll Effects =====
const modernHeader = document.querySelector('.modern-header');
let lastScroll = 0;
let ticking = false;

function updateModernHeader() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 100) {
        modernHeader?.classList.add('scrolled');
    } else {
        modernHeader?.classList.remove('scrolled');
    }
    
    // Update active navigation link based on scroll position
    updateActiveNavLink();
    
    lastScroll = currentScroll;
    ticking = false;
}

// Update active navigation link based on current section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.pill-link');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateModernHeader);
        ticking = true;
    }
});

// ===== Mobile Floating Menu =====
const mobileFab = document.querySelector('.mobile-fab');
const mobileNav = document.querySelector('.floating-mobile-nav');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const body = document.body;

if (mobileFab && mobileNav) {
    // Toggle mobile menu
    mobileFab.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking overlay
    mobileOverlay?.addEventListener('click', () => {
        closeMobileMenu();
    });
    
    // Close menu when clicking menu items
    document.querySelectorAll('.floating-item').forEach(item => {
        item.addEventListener('click', () => {
            setTimeout(() => closeMobileMenu(), 200);
        });
    });
}

function toggleMobileMenu() {
    const isActive = mobileNav.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    mobileNav.classList.add('active');
    mobileFab.classList.add('active');
    body.style.overflow = 'hidden';
    
    // Add haptic feedback on supported devices
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileFab.classList.remove('active');
    body.style.overflow = '';
}

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
document.querySelectorAll('.btn-primary, .btn-secondary, .modern-cta-btn').forEach(button => {
    // Mouse follow effect for gradient buttons
    if (button.classList.contains('btn-primary') || button.classList.contains('modern-cta-btn')) {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            const gradient = button.classList.contains('modern-cta-btn') 
                ? 'linear-gradient(135deg, var(--soft-gold), var(--copper))'
                : 'linear-gradient(135deg, var(--soft-gold), var(--copper))';
            
            button.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                rgba(255,255,255,0.3) 0%, 
                transparent 50%),
                ${gradient}
            `;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'linear-gradient(135deg, var(--soft-gold), var(--copper))';
        });
    }
    
    // Enhanced magnetic effect
    button.addEventListener('mousemove', function(e) {
        if (window.innerWidth > 768) { // Only on desktop
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            
            let baseTransform = '';
            if (this.classList.contains('btn-primary')) {
                baseTransform = 'translateY(-4px) scale(1.05)';
            } else if (this.classList.contains('modern-cta-btn')) {
                baseTransform = 'translateY(-3px) scale(1.05)';
            } else {
                baseTransform = 'translateY(-3px) scale(1.02)';
            }
            
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
const modernLogo = document.querySelector('.modern-logo');
const fabLogo = document.querySelector('.fab-logo-img');

[modernLogo, fabLogo].forEach(logo => {
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.1) rotate(3deg)';
            if (logo === modernLogo) {
                logo.style.filter = 'drop-shadow(0 4px 15px rgba(212, 168, 87, 0.4))';
            }
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
            if (logo === modernLogo) {
                logo.style.filter = 'drop-shadow(0 2px 8px rgba(212, 168, 87, 0.2))';
            }
        });
        
        // Add click animation
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            logo.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                logo.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        });
    }
});

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

// ===== Floating Items Animation =====
document.querySelectorAll('.floating-item').forEach((item, index) => {
    // Add staggered hover effects
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.15) rotate(5deg)';
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(212, 168, 87, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        item.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Add click animation
    item.addEventListener('click', () => {
        item.style.transform = 'scale(0.9) rotate(-5deg)';
        setTimeout(() => {
            item.style.transform = 'scale(1) rotate(0deg)';
        }, 150);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    });
});

// Add ripple animation keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

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
        
        // Disable complex animations
        document.querySelectorAll('[class*="animation"], [class*="animate"]').forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// ===== Advanced Touch Gestures for Mobile Menu =====
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchDuration = Date.now() - touchStartTime;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Detect swipe gestures on mobile
    if (window.innerWidth <= 768 && distance > 50 && touchDuration < 300) {
        // Swipe up from bottom right corner to open menu
        if (touchStartX > window.innerWidth * 0.8 && 
            touchStartY > window.innerHeight * 0.8 && 
            deltaY < -50) {
            openMobileMenu();
        }
        
        // Swipe down to close menu
        if (mobileNav?.classList.contains('active') && deltaY > 50) {
            closeMobileMenu();
        }
    }
}, { passive: true });

// ===== Resize Handler =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update parallax state based on screen size
        checkPerformance();
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && mobileNav?.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Update video filter for mobile
        if (video) {
            if (window.innerWidth < 768) {
                video.style.filter = 'blur(4px) brightness(1.3) saturate(0.6)';
            } else {
                video.style.filter = 'blur(3px) brightness(1.2) saturate(0.7)';
            }
        }
        
        // Update header active states
        updateActiveNavLink();
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
    if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
        closeMobileMenu();
        mobileFab?.focus();
    }
    
    // Handle Enter key on interactive elements
    if (e.key === 'Enter') {
        const target = e.target;
        if (target === mobileFab) {
            toggleMobileMenu();
        }
    }
    
    // Tab navigation for floating menu items
    if (e.key === 'Tab' && mobileNav?.classList.contains('active')) {
        const floatingItems = document.querySelectorAll('.floating-item');
        const currentIndex = Array.from(floatingItems).indexOf(e.target);
        
        if (e.shiftKey) {
            // Shift+Tab (backwards)
            if (currentIndex <= 0) {
                e.preventDefault();
                floatingItems[floatingItems.length - 1].focus();
            }
        } else {
            // Tab (forwards)
            if (currentIndex >= floatingItems.length - 1) {
                e.preventDefault();
                floatingItems[0].focus();
            }
        }
    }
});

// Focus management for mobile FAB
if (mobileFab) {
    mobileFab.setAttribute('tabindex', '0');
    mobileFab.setAttribute('role', 'button');
    mobileFab.setAttribute('aria-label', 'Open navigation menu');
    
    mobileFab.addEventListener('focus', () => {
        mobileFab.style.outline = '3px solid var(--soft-gold)';
        mobileFab.style.outlineOffset = '4px';
    });
    
    mobileFab.addEventListener('blur', () => {
        mobileFab.style.outline = 'none';
    });
}

// Make floating items focusable
document.querySelectorAll('.floating-item').forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'menuitem');
    
    item.addEventListener('focus', () => {
        item.style.outline = '2px solid var(--soft-gold)';
        item.style.outlineOffset = '2px';
    });
    
    item.addEventListener('blur', () => {
        item.style.outline = 'none';
    });
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
    
    // Add touch feedback to interactive elements
    document.querySelectorAll('.floating-item, .pill-link, .modern-cta-btn').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = (this.style.transform || '') + ' scale(0.95)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = this.style.transform.replace(' scale(0.95)', '');
        }, { passive: true });
    });
}

// ===== Modern Header Pill Links Interaction =====
document.querySelectorAll('.pill-link').forEach(link => {
    // Enhanced hover effect
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
    
    // Click animation
    link.addEventListener('click', () => {
        link.style.transform = 'translateY(0) scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'translateY(-1px) scale(1)';
        }, 150);
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
    
    // Set initial active nav link
    updateActiveNavLink();
    
    // Initialize header scroll state
    updateModernHeader();
    
    // Add modern interactions to CTA buttons
    document.querySelectorAll('.modern-cta-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ctaRipple 0.6s ease-out forwards;
                pointer-events: none;
            `;
            
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Log successful initialization
    console.log('Evia Aesthetics - Modern Enhanced Website Loaded Successfully');
    
    // Initialize any additional features after DOM is ready
    setTimeout(() => {
        // Trigger initial animations if preloader didn't run
        if (!document.querySelector('.preloader.loaded')) {
            document.querySelector('.preloader')?.classList.add('loaded');
        }
    }, 100);
});

// Add CTA ripple animation
const ctaRippleStyle = document.createElement('style');
ctaRippleStyle.textContent = `
    @keyframes ctaRipple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(ctaRippleStyle);

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

// ===== Final Performance Monitoring =====
// Monitor frame rate for smooth animations
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Disable heavy animations if performance is poor
        if (fps < 30) {
            isParallaxEnabled = false;
            document.body.classList.add('low-performance');
        }
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(monitorPerformance);
}

// Start performance monitoring after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        monitorPerformance();
    }, 2000);
});

// ===== Enhanced Accessibility Features =====
// Add screen reader announcements for menu state changes
const announcer = document.createElement('div');
announcer.setAttribute('aria-live', 'polite');
announcer.setAttribute('aria-atomic', 'true');
announcer.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
`;
document.body.appendChild(announcer);

function announce(message) {
    announcer.textContent = message;
    setTimeout(() => {
        announcer.textContent = '';
    }, 1000);
}

// Update menu toggle to announce state changes
const originalToggleMobileMenu = toggleMobileMenu;
toggleMobileMenu = function() {
    const wasActive = mobileNav.classList.contains('active');
    originalToggleMobileMenu();
    
    if (wasActive) {
        announce('Navigation menu closed');
    } else {
        announce('Navigation menu opened');
    }
};
