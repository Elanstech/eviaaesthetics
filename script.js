// ===== Enhanced Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const heroVideo = document.querySelector('.hero-video');
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
                // Start hero animations after preloader
                initializeHeroAnimations();
            }, 800);
        }
    }, 150);
    
    // Fallback timeout
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            initializeHeroAnimations();
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
    
    // Hide/show header based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
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

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger lines
    const spans = mobileToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const headerOffset = 100;
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
let isParallaxEnabled = true;
const parallaxElements = {
    video: document.querySelector('.hero-video'),
    floatingElements: document.querySelectorAll('.float-element'),
    decorations: document.querySelectorAll('.decoration'),
    badge: document.querySelector('.floating-badge'),
    cards: document.querySelectorAll('.stats-card')
};

function updateParallax() {
    if (!isParallaxEnabled) return;
    
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const scrollPercent = scrolled / heroHeight;
    
    // Video parallax with subtle movement
    if (parallaxElements.video) {
        const videoMove = scrolled * 0.3;
        parallaxElements.video.style.transform = `translate(-50%, -50%) scale(${1.1 + scrollPercent * 0.1})`;
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
    
    // Badge floating effect
    if (parallaxElements.badge) {
        const badgeMove = Math.sin(scrolled * 0.01) * 5;
        parallaxElements.badge.style.transform = `translateY(${badgeMove}px)`;
    }
    
    // Stats cards gentle movement
    parallaxElements.cards.forEach((card, index) => {
        const speed = 0.05 * (index + 1);
        const yPos = scrolled * speed;
        card.style.transform = `translateY(${yPos}px)`;
    });
}

// Throttled parallax updates
let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
        setTimeout(() => { parallaxTicking = false; }, 16);
    }
});

// ===== Hero Animations Initialization =====
function initializeHeroAnimations() {
    // Stagger animation for hero elements
    const heroElements = [
        '.hero-badge',
        '.title-accent',
        '.title-main', 
        '.title-sub',
        '.hero-description',
        '.hero-actions',
        '.hero-features'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
    
    // Animate doctor image with delay
    setTimeout(() => {
        const doctorImage = document.querySelector('.doctor-image');
        if (doctorImage) {
            doctorImage.style.opacity = '1';
            doctorImage.style.transform = 'scale(1)';
        }
    }, 1000);
}

// ===== Interactive Button Effects =====
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    // Mouse follow effect for primary buttons
    if (button.classList.contains('btn-primary')) {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            button.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                rgba(255,255,255,0.2) 0%, 
                transparent 50%),
                linear-gradient(135deg, var(--soft-gold), var(--copper))
            `;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'linear-gradient(135deg, var(--soft-gold), var(--copper))';
        });
    }
    
    // Magnetic effect
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
        
        this.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// ===== Logo Hover Animation =====
const headerLogo = document.querySelector('.header-logo');
if (headerLogo) {
    headerLogo.addEventListener('mouseenter', () => {
        headerLogo.style.transform = 'scale(1.05) rotate(2deg)';
        headerLogo.style.filter = 'drop-shadow(0 8px 20px rgba(212, 168, 87, 0.3))';
    });
    
    headerLogo.addEventListener('mouseleave', () => {
        headerLogo.style.transform = 'scale(1) rotate(0deg)';
        headerLogo.style.filter = 'drop-shadow(0 4px 20px rgba(75, 46, 27, 0.08))';
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
            
            // Special handling for different elements
            if (entry.target.classList.contains('feature')) {
                const icon = entry.target.querySelector('.feature-icon');
                setTimeout(() => {
                    icon.style.transform = 'translateY(-5px) scale(1.1)';
                    setTimeout(() => {
                        icon.style.transform = 'translateY(0) scale(1)';
                    }, 300);
                }, 200);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature, .stats-card, .floating-badge').forEach(element => {
    observer.observe(element);
});

// ===== Advanced Mouse Cursor Effect =====
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

// Add cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--soft-gold), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        transition: transform 0.15s ease-out;
        filter: blur(8px);
        mix-blend-mode: multiply;
    }
    
    .custom-cursor.hover {
        transform: scale(2);
        opacity: 0.4;
    }
    
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
document.querySelectorAll('a, button, .clickable').forEach(element => {
    element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== Video Optimization =====
const video = document.querySelector('.hero-video');
if (video) {
    // Optimize video playback
    video.addEventListener('loadeddata', () => {
        video.play().catch(e => console.log('Video autoplay prevented:', e));
    });
    
    // Pause video when not in view for performance
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(e => console.log('Video play prevented:', e));
            } else {
                video.pause();
            }
        });
    });
    
    videoObserver.observe(video);
    
    // Reduce video quality on mobile
    if (window.innerWidth < 768) {
        video.style.filter = 'blur(4px) brightness(1.3) saturate(0.6)';
    }
}

// ===== Performance Optimization =====
// Disable parallax on mobile for better performance
if (window.innerWidth < 768) {
    isParallaxEnabled = false;
}

// Pause animations when page is not visible
document.addEventListener('visibilitychange', () => {
    const elements = document.querySelectorAll('.float-element, .decoration');
    elements.forEach(element => {
        if (document.hidden) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
});

// ===== Resize Handler =====
window.addEventListener('resize', () => {
    // Update parallax state based on screen size
    isParallaxEnabled = window.innerWidth >= 768;
    
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
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

// Add scroll classes for styling
const scrollStyles = document.createElement('style');
scrollStyles.textContent = `
    body.scrolling .floating-badge {
        animation-play-state: paused;
    }
    
    body.scrolling .stats-card {
        animation-play-state: paused;
    }
`;
document.head.appendChild(scrollStyles);

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Initialize scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }, 2000);
    }
    
    console.log('Evia Aesthetics - Enhanced Website Loaded Successfully');
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.log('Error caught:', e.error);
});

// ===== Accessibility Improvements =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
});

// Focus management for mobile menu
mobileToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
    }
});
