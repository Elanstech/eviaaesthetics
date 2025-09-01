// =================================================================
// MODERN ABOUT PAGE INTERACTIONS
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1200,
        easing: 'ease-out-cubic',
        once: true,
        offset: 120
    });

    // Core Functionality
    handlePreloader();
    initializeHeader();
    initializeMobileMenu();
    initializeFloatingButtons();
    
    // About Page Specific Features
    initializeHeroAnimations();
    initializeStoryCards();
    initializeSkillsShowcase();
    initializeTimelineAnimations();
    initializeAdvantageCards();
    initializeVideoPlayer();
    initializeMetricCounters();
    
    // Utility Features
    initializeSmoothScrolling();
    initializeParallaxEffects();
    initializePerformanceOptimizations();
});

// =================================================================
// PRELOADER MANAGEMENT
// =================================================================
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!preloader || !progressFill) return;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.classList.add('loaded');
            }, 500);
        }
    }, 100);
}

// =================================================================
// HEADER MANAGEMENT
// =================================================================
function initializeHeader() {
    const header = document.getElementById('luxuryHeader');
    const headerCTA = document.getElementById('luxuryHeaderCTA');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrolled = scrollTop > 50;
        
        header.classList.toggle('scrolled', scrolled);
        
        if (window.innerWidth <= 768) {
            const isScrollingDown = scrollTop > lastScrollTop && scrollTop > 200;
            header.classList.toggle('header-hidden', isScrollingDown);
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestHeaderUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
    
    if (headerCTA) {
        headerCTA.addEventListener('click', function() {
            window.location.href = 'contact.html';
        });
    }
}

// =================================================================
// MOBILE MENU MANAGEMENT
// =================================================================
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileClose = document.getElementById('mobileClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    
    if (!mobileToggle || !mobileMenu) return;
    
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach((link, index) => {
            link.style.transitionDelay = (index * 0.1) + 's';
            link.classList.add('animate-in');
        });
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
        
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.classList.remove('animate-in');
            link.style.transitionDelay = '';
        });
    }
    
    mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);
    
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 300);
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// =================================================================
// FLOATING ACTION BUTTONS
// =================================================================
function initializeFloatingButtons() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const contactFabBtn = document.getElementById('contactFabBtn');
    const contactBackdrop = document.getElementById('contactBackdrop');
    
    // Back to Top Button
    if (backToTopBtn) {
        let isVisible = false;
        
        function toggleBackToTop() {
            const scrolled = window.pageYOffset > 400;
            
            if (scrolled && !isVisible) {
                backToTopBtn.classList.add('visible');
                isVisible = true;
            } else if (!scrolled && isVisible) {
                backToTopBtn.classList.remove('visible');
                isVisible = false;
            }
        }
        
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Contact FAB
    if (contactFabBtn) {
        let isContactOpen = false;
        
        function toggleContactFab() {
            isContactOpen = !isContactOpen;
            contactFabBtn.classList.toggle('active', isContactOpen);
            if (contactBackdrop) {
                contactBackdrop.classList.toggle('active', isContactOpen);
            }
            document.body.style.overflow = isContactOpen ? 'hidden' : '';
        }
        
        function closeContactFab() {
            isContactOpen = false;
            contactFabBtn.classList.remove('active');
            if (contactBackdrop) {
                contactBackdrop.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
        
        const mainContactBtn = contactFabBtn.querySelector('.main-contact-btn');
        if (mainContactBtn) {
            mainContactBtn.addEventListener('click', toggleContactFab);
        }
        
        if (contactBackdrop) {
            contactBackdrop.addEventListener('click', closeContactFab);
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isContactOpen) {
                closeContactFab();
            }
        });
        
        const contactOptions = document.querySelectorAll('.contact-option');
        contactOptions.forEach(option => {
            option.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
}

// =================================================================
// HERO ANIMATIONS
// =================================================================
function initializeHeroAnimations() {
    // Animate hero badge on load
    const heroBadge = document.querySelector('.hero-badge-modern');
    if (heroBadge) {
        setTimeout(() => {
            heroBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                heroBadge.style.transform = 'scale(1)';
            }, 300);
        }, 1000);
    }
    
    // Enhanced button interactions
    const primaryBtn = document.querySelector('.primary-hero-btn');
    const secondaryBtn = document.querySelector('.secondary-hero-btn');
    
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    }
    
    if (secondaryBtn) {
        secondaryBtn.addEventListener('mouseenter', function() {
            const arrow = this.querySelector('i');
            if (arrow) {
                arrow.style.transform = 'translateX(5px)';
            }
        });
        
        secondaryBtn.addEventListener('mouseleave', function() {
            const arrow = this.querySelector('i');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    }
}

// =================================================================
// STORY CARDS INTERACTIONS
// =================================================================
function initializeStoryCards() {
    const storyCards = document.querySelectorAll('.story-card');
    
    storyCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Intersection observer for entrance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(card);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// =================================================================
// SKILLS SHOWCASE
// =================================================================
function initializeSkillsShowcase() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Intersection observer for skill animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    
                    // Animate progress bar
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        const progress = progressBar.getAttribute('data-progress');
                        progressBar.style.width = progress + '%';
                    }
                }, index * 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillItems.forEach(item => {
        observer.observe(item);
        
        // Enhanced hover interactions
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(10deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// =================================================================
// TIMELINE ANIMATIONS
// =================================================================
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    
                    // Animate timeline marker
                    const marker = entry.target.querySelector('.timeline-marker');
                    if (marker) {
                        marker.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            marker.style.transform = 'scale(1)';
                        }, 300);
                    }
                }, index * 400);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(item);
    });
}

// =================================================================
// ADVANTAGE CARDS
// =================================================================
function initializeAdvantageCards() {
    const advantageCards = document.querySelectorAll('.advantage-card');
    
    advantageCards.forEach((card, index) => {
        // Enhanced interactions
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.advantage-number');
            const icon = this.querySelector('.advantage-icon');
            
            if (number) {
                number.style.color = 'rgba(255, 140, 0, 0.4)';
                number.style.textShadow = '0 0 30px rgba(255, 140, 0, 0.5)';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(-10deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.advantage-number');
            const icon = this.querySelector('.advantage-icon');
            
            if (number) {
                number.style.color = 'rgba(255, 140, 0, 0.15)';
                number.style.textShadow = '';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Click interaction
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// =================================================================
// VIDEO PLAYER ENHANCEMENTS
// =================================================================
function initializeVideoPlayer() {
    const video = document.querySelector('.clinic-video');
    const playOverlay = document.querySelector('.video-play-overlay');
    const videoContainer = document.querySelector('.video-container-modern');
    
    if (!video || !videoContainer) return;
    
    video.addEventListener('play', function() {
        if (playOverlay) {
            playOverlay.style.opacity = '0';
        }
    });
    
    video.addEventListener('pause', function() {
        if (playOverlay) {
            playOverlay.style.opacity = '1';
        }
    });
    
    video.addEventListener('ended', function() {
        if (playOverlay) {
            playOverlay.style.opacity = '1';
        }
    });
    
    // Video container hover effects
    videoContainer.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    videoContainer.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// =================================================================
// METRIC COUNTERS
// =================================================================
function initializeMetricCounters() {
    const metricCards = document.querySelectorAll('.metric-card');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                
                metricCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'scale(1.1)';
                        
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                        }, 400);
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const heroMetrics = document.querySelector('.hero-metrics-grid');
    if (heroMetrics) {
        observer.observe(heroMetrics);
    }
    
    // Individual metric card interactions
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const glow = this.querySelector('.metric-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const glow = this.querySelector('.metric-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
        
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// =================================================================
// PARALLAX EFFECTS
// =================================================================
function initializeParallaxEffects() {
    const geometricShapes = document.querySelectorAll('.geometric-shape');
    const orbs = document.querySelectorAll('.orb');
    const hexagons = document.querySelectorAll('.hexagon');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Geometric shapes parallax
        geometricShapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${45 + (scrolled * 0.1)}deg)`;
        });
        
        // Orbs parallax
        orbs.forEach((orb, index) => {
            const speed = 0.2 + (index * 0.05);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Hexagons parallax
        hexagons.forEach((hex, index) => {
            const speed = 0.15 + (index * 0.03);
            hex.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking && window.innerWidth > 768) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// =================================================================
// SMOOTH SCROLLING
// =================================================================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =================================================================
// PERFORMANCE OPTIMIZATIONS
// =================================================================
function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src || img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize scroll performance
    let rafId = null;
    
    function optimizedScrollHandler() {
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            handleScrollAnimations();
            rafId = null;
        });
    }
    
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
}

function handleScrollAnimations() {
    const scrolled = window.pageYOffset;
    
    // Hero image parallax
    const heroImage = document.querySelector('.doctor-portrait');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    // Badge floating animation based on scroll
    const credential = document.querySelector('.credential-floating-badge');
    if (credential) {
        credential.style.transform = `translateY(${Math.sin(scrolled * 0.01) * 5}px)`;
    }
}

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

// Create ripple effect
function createRippleEffect(button, e) {
    const ripple = document.createElement('div');
    ripple.classList.add('btn-ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Magnetic effect for buttons
function addMagneticEffect(element) {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
}

// Apply magnetic effect to key buttons
document.querySelectorAll('.primary-hero-btn, .cta-primary-modern, .directions-btn').forEach(button => {
    addMagneticEffect(button);
});

// =================================================================
// SECTION VISIBILITY ANIMATIONS
// =================================================================
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            
            const sectionId = entry.target.id;
            
            switch(sectionId) {
                case 'storySection':
                    triggerStoryAnimations();
                    break;
                case 'expertiseSection':
                    triggerExpertiseAnimations();
                    break;
                case 'locationSection':
                    triggerLocationAnimations();
                    break;
                case 'whyChooseSection':
                    triggerChooseAnimations();
                    break;
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

function triggerStoryAnimations() {
    const gridLines = document.querySelectorAll('.grid-line');
    gridLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'scaleX(1)';
        }, index * 200);
    });
}

function triggerExpertiseAnimations() {
    const diagonalLines = document.querySelectorAll('.diagonal-line');
    diagonalLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0.8';
            line.style.transform = 'scaleX(1)';
        }, index * 150);
    });
}

function triggerLocationAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }, index * 100);
    });
}

function triggerChooseAnimations() {
    const hexagons = document.querySelectorAll('.hexagon');
    hexagons.forEach((hex, index) => {
        setTimeout(() => {
            hex.style.opacity = '1';
            hex.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// =================================================================
// RESPONSIVE BEHAVIOR
// =================================================================
function handleResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce animation complexity for mobile
        const geometricShapes = document.querySelectorAll('.geometric-shape');
        geometricShapes.forEach(shape => {
            shape.style.animationDuration = '8s';
        });
        
        // Simplify hover effects for touch devices
        const cards = document.querySelectorAll('.story-card, .advantage-card, .feature-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

window.addEventListener('load', handleResponsiveFeatures);
window.addEventListener('resize', debounce(handleResponsiveFeatures, 250));

// =================================================================
// ENHANCED INTERACTIONS
// =================================================================

// Feature card click effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add pulse effect
        this.style.animation = 'pulse-effect 0.6s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 600);
    });
});

// Story card sequential hover effect
let storyHoverTimeout;
document.querySelectorAll('.story-card').forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        clearTimeout(storyHoverTimeout);
        
        // Delay other cards' glow effect
        storyHoverTimeout = setTimeout(() => {
            document.querySelectorAll('.story-card').forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.opacity = '0.7';
                }
            });
        }, 200);
    });
    
    card.addEventListener('mouseleave', function() {
        clearTimeout(storyHoverTimeout);
        
        document.querySelectorAll('.story-card').forEach(otherCard => {
            otherCard.style.opacity = '1';
        });
    });
});

// =================================================================
// ADVANCED VISUAL EFFECTS
// =================================================================

// Sparkle effect trigger
function triggerSparkleEffect() {
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        setTimeout(() => {
            sparkle.style.opacity = '1';
            sparkle.style.transform = 'scale(1.5)';
            
            setTimeout(() => {
                sparkle.style.opacity = '0.8';
                sparkle.style.transform = 'scale(1)';
            }, 400);
        }, index * 500);
    });
}

// Trigger sparkles when hero image is in view
const heroImageFrame = document.querySelector('.image-frame-modern');
if (heroImageFrame) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(triggerSparkleEffect, 1000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(heroImageFrame);
}

// =================================================================
// UTILITY FUNCTIONS
// =================================================================
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

// =================================================================
// ERROR HANDLING
// =================================================================
window.addEventListener('error', function(e) {
    console.warn('About page error:', e.error);
});

// =================================================================
// ACCESSIBILITY ENHANCEMENTS
// =================================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Focus management
function manageFocusWithin(container) {
    const focusableElements = container.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse-effect {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .grid-line {
        opacity: 0;
        transform: scaleX(0);
        transition: all 0.8s ease;
    }
    
    .diagonal-line {
        opacity: 0;
        transform: scaleX(0);
        transition: all 0.8s ease;
    }
    
    .hexagon {
        opacity: 0;
        transform: scale(0);
        transition: all 0.6s ease;
    }
    
    .feature-card {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        transition: all 0.6s ease;
    }
`;
document.head.appendChild(style);

console.log('✨ Modern about page initialized successfully');
