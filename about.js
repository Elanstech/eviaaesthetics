// =================================================================
// ABOUT PAGE LUXURY INTERACTIONS
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Preloader Management
    handlePreloader();
    
    // Header Management
    initializeHeader();
    
    // Mobile Menu Management
    initializeMobileMenu();
    
    // Floating Action Buttons
    initializeFloatingButtons();
    
    // About Page Specific Features
    initializeAboutFeatures();
    
    // Video Controls
    initializeVideoControls();
    
    // Smooth Scrolling
    initializeSmoothScrolling();
    
    // Performance Optimizations
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
    
    // Header scroll behavior
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrolled = scrollTop > 50;
        
        header.classList.toggle('scrolled', scrolled);
        
        // Auto-hide header on scroll down (mobile)
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
    
    // Header CTA button interactions
    if (headerCTA) {
        headerCTA.addEventListener('click', function() {
            // Scroll to contact section or redirect to contact page
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                window.location.href = 'contact.html';
            }
        });
        
        // Ripple effect for CTA button
        headerCTA.addEventListener('click', function(e) {
            const ripple = this.querySelector('.cta-ripple');
            if (ripple) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('animate');
                
                setTimeout(() => {
                    ripple.classList.remove('animate');
                }, 600);
            }
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
        
        // Animate menu items
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
        
        // Reset animations
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.classList.remove('animate-in');
            link.style.transitionDelay = '';
        });
    }
    
    // Event listeners
    mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);
    
    // Close on mobile nav link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 300);
        });
    });
    
    // Close on escape key
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
            const scrolled = window.pageYOffset > 300;
            
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
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isContactOpen) {
                closeContactFab();
            }
        });
        
        // Contact option click handlers
        const contactOptions = document.querySelectorAll('.contact-option');
        contactOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
}

// =================================================================
// ABOUT PAGE SPECIFIC FEATURES
// =================================================================
function initializeAboutFeatures() {
    // Hero signature animation
    animateHeroSignature();
    
    // Profile card interactions
    initializeProfileCards();
    
    // Specialization item animations
    initializeSpecializationAnimations();
    
    // Credentials timeline effect
    initializeCredentialsTimeline();
    
    // Achievement counters
    initializeAchievementCounters();
    
    // Clinic features hover effects
    initializeClinicFeatures();
    
    // Why choose reason cards
    initializeReasonCards();
}

function animateHeroSignature() {
    const signature = document.querySelector('.hero-credentials-badge');
    if (!signature) return;
    
    // Add entrance animation delay
    setTimeout(() => {
        signature.style.opacity = '0';
        signature.style.transform = 'translateY(20px) scale(0.9)';
        
        setTimeout(() => {
            signature.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            signature.style.opacity = '1';
            signature.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }, 1200);
}

function initializeProfileCards() {
    const profileCards = document.querySelectorAll('.expertise-card');
    
    profileCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.animationDelay = (index * 0.2) + 's';
        
        // Hover enhancements
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializeSpecializationAnimations() {
    const specializationItems = document.querySelectorAll('.specialization-item');
    
    specializationItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.spec-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.background = 'rgba(255, 140, 0, 0.2)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.spec-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.background = 'rgba(255, 140, 0, 0.1)';
            }
        });
    });
}

function initializeCredentialsTimeline() {
    const credentialItems = document.querySelectorAll('.credential-item');
    
    // Intersection Observer for timeline animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    credentialItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(item);
    });
}

function initializeAchievementCounters() {
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                achievementNumbers.forEach((numberEl, index) => {
                    const text = numberEl.textContent;
                    const hasNumber = /\d/.test(text);
                    
                    if (hasNumber) {
                        setTimeout(() => {
                            numberEl.style.transform = 'scale(1.2)';
                            numberEl.style.color = 'rgba(255, 140, 0, 1)';
                            
                            setTimeout(() => {
                                numberEl.style.transform = 'scale(1)';
                            }, 300);
                        }, index * 100);
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    const achievementsCard = document.querySelector('.achievements-card');
    if (achievementsCard) {
        observer.observe(achievementsCard);
    }
}

function initializeClinicFeatures() {
    const featureCards = document.querySelectorAll('.clinic-feature-card');
    
    featureCards.forEach((card, index) => {
        // Staggered entrance
        card.style.animationDelay = (index * 0.15) + 's';
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(5deg)';
                icon.style.boxShadow = '0 10px 30px rgba(255, 140, 0, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = '';
            }
        });
    });
}

function initializeReasonCards() {
    const reasonCards = document.querySelectorAll('.reason-card');
    
    reasonCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.animationDelay = (index * 0.1) + 's';
        
        // Number glow effect on hover
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.reason-number');
            const icon = this.querySelector('.reason-icon');
            
            if (number) {
                number.style.color = 'rgba(255, 140, 0, 0.4)';
                number.style.textShadow = '0 0 20px rgba(255, 140, 0, 0.5)';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(-5deg)';
                icon.style.boxShadow = '0 10px 30px rgba(255, 140, 0, 0.4)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.reason-number');
            const icon = this.querySelector('.reason-icon');
            
            if (number) {
                number.style.color = 'rgba(255, 255, 255, 0.1)';
                number.style.textShadow = '';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = '';
            }
        });
    });
}

// =================================================================
// VIDEO CONTROLS
// =================================================================
function initializeVideoControls() {
    const video = document.querySelector('.directions-video');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (!video || !videoWrapper) return;
    
    // Custom video controls enhancement
    video.addEventListener('loadedmetadata', function() {
        // Video is ready
        console.log('Directions video loaded successfully');
    });
    
    // Video interaction effects
    video.addEventListener('play', function() {
        videoWrapper.classList.add('playing');
    });
    
    video.addEventListener('pause', function() {
        videoWrapper.classList.remove('playing');
    });
    
    // Video container hover effects
    videoWrapper.addEventListener('mouseenter', function() {
        const glow = this.querySelector('.video-glow');
        if (glow) {
            glow.style.opacity = '1';
        }
    });
    
    videoWrapper.addEventListener('mouseleave', function() {
        const glow = this.querySelector('.video-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
    });
}

// =================================================================
// SMOOTH SCROLLING
// =================================================================
function initializeSmoothScrolling() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed header
                
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
            // Scroll-based animations
            handleScrollAnimations();
            rafId = null;
        });
    }
    
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
}

function handleScrollAnimations() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax effects for orbs
    const orbs = document.querySelectorAll('.hero-orb, .clinic-orb, .choice-orb, .cta-orb');
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Profile card glow effects based on scroll
    const profileCard = document.querySelector('.profile-card-luxury');
    if (profileCard) {
        const rect = profileCard.getBoundingClientRect();
        const isInView = rect.top < windowHeight && rect.bottom > 0;
        
        if (isInView) {
            const glow = profileCard.querySelector('.profile-card-glow');
            if (glow) {
                glow.style.opacity = '0.5';
            }
        }
    }
}

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

// Scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        window.location.href = 'contact.html';
    }
}

// Add ripple effect to buttons
function addRippleEffect(button, e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    
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

// Enhanced button interactions
document.querySelectorAll('.primary-cta-btn, .secondary-cta-btn, .get-directions-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        addRippleEffect(this, e);
    });
});

// =================================================================
// INTERSECTION OBSERVER ENHANCEMENTS
// =================================================================

// Enhanced section visibility
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            
            // Trigger specific animations per section
            const sectionId = entry.target.id;
            
            switch(sectionId) {
                case 'doctorProfile':
                    animateProfileSection();
                    break;
                case 'clinicExperience':
                    animateClinicSection();
                    break;
                case 'directionsSection':
                    animateDirectionsSection();
                    break;
                case 'whyChoose':
                    animateWhyChooseSection();
                    break;
            }
        }
    });
}, { threshold: 0.2 });

// Observe all main sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

function animateProfileSection() {
    const profileCard = document.querySelector('.profile-card-luxury');
    if (profileCard) {
        setTimeout(() => {
            profileCard.style.transform = 'translateY(0)';
            profileCard.style.opacity = '1';
        }, 300);
    }
}

function animateClinicSection() {
    const featureCards = document.querySelectorAll('.clinic-feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, index * 150);
    });
}

function animateDirectionsSection() {
    const videoContainer = document.querySelector('.video-container-luxury');
    if (videoContainer) {
        setTimeout(() => {
            videoContainer.style.transform = 'scale(1)';
            videoContainer.style.opacity = '1';
        }, 200);
    }
}

function animateWhyChooseSection() {
    const reasonCards = document.querySelectorAll('.reason-card');
    reasonCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }, index * 100);
    });
}

// =================================================================
// ADVANCED INTERACTIONS
// =================================================================

// Add magnetic effect to CTA buttons
document.querySelectorAll('.primary-cta-btn, .secondary-cta-btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// =================================================================
// RESPONSIVE BEHAVIOR
// =================================================================
function handleResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // Adjust animations for mobile
    if (isMobile) {
        // Reduce motion for better mobile performance
        document.querySelectorAll('.floating-element').forEach(element => {
            element.style.animationDuration = '4s';
        });
        
        // Simplify hover effects on mobile
        document.querySelectorAll('.reason-card, .clinic-feature-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// Run responsive handler on load and resize
window.addEventListener('load', handleResponsiveFeatures);
window.addEventListener('resize', debounce(handleResponsiveFeatures, 250));

// Debounce utility
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
    // Graceful degradation for missing elements
});

// =================================================================
// ACCESSIBILITY ENHANCEMENTS
// =================================================================
document.addEventListener('keydown', function(e) {
    // Enhanced keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Focus management for modal-like interactions
function manageFocus(container) {
    const focusableElements = container.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

// Console log for successful initialization
console.log('✨ About page luxury features initialized successfully');
