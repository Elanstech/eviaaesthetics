// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const heroVideo = document.querySelector('.hero-video');
    
    // Wait for video to be ready
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1500);
        });
        
        // Fallback if video doesn't load
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 3000);
    } else {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1500);
    }
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
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

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Parallax Effect for Hero Section =====
const heroBackground = document.querySelector('.hero-background');
const heroVideo = document.querySelector('.hero-video');
const floatingElements = document.querySelectorAll('.float-circle');
const heroTitle = document.querySelector('.hero-title');
const heroVisual = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    // Parallax for background
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
    
    // Parallax for video
    if (heroVideo) {
        heroVideo.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0003})`;
    }
    
    // Parallax for floating elements
    floatingElements.forEach((element, index) => {
        const speed = 0.2 * (index + 1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Fade out hero content on scroll
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 2);
        heroTitle.style.opacity = opacity;
        heroVisual.style.opacity = opacity;
    }
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-item').forEach(item => {
    observer.observe(item);
});

// ===== Dynamic Glow Effect on Mouse Move =====
const ctaButtons = document.querySelectorAll('.cta-button.primary');

ctaButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = button.querySelector('.button-glow');
        if (glow) {
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        }
    });
});

// ===== Logo Animation on Hover =====
const logo = document.querySelector('.logo');
let isAnimating = false;

logo.addEventListener('mouseenter', () => {
    if (!isAnimating) {
        isAnimating = true;
        const logoE1 = document.querySelector('.logo-e1');
        const logoE2 = document.querySelector('.logo-e2');
        
        // Add a subtle rotation animation
        logoE1.style.animation = 'logoSpin 0.6s ease-in-out';
        logoE2.style.animation = 'logoSpin 0.6s ease-in-out reverse';
        
        setTimeout(() => {
            logoE1.style.animation = '';
            logoE2.style.animation = '';
            isAnimating = false;
        }, 600);
    }
});

// Define the logo spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes logoSpin {
        0% { transform: translateX(-4px) rotate(0deg); }
        50% { transform: translateX(-8px) rotate(180deg); }
        100% { transform: translateX(-4px) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== Typing Effect for Hero Title =====
const titleLines = document.querySelectorAll('.hero-title span');
let currentLine = 0;

function typewriterEffect() {
    if (currentLine < titleLines.length) {
        const line = titleLines[currentLine];
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                line.textContent += text[charIndex];
                charIndex++;
            } else {
                clearInterval(typeInterval);
                currentLine++;
                setTimeout(typewriterEffect, 200);
            }
        }, 50);
    }
}

// Start typing effect after preloader
setTimeout(typewriterEffect, 2000);

// ===== Smooth Reveal Animation =====
const revealElements = document.querySelectorAll('.hero-description, .hero-cta, .hero-features');

revealElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 2500 + (index * 200));
});

// ===== Mouse Follower for Premium Feel =====
const mouseFollower = document.createElement('div');
mouseFollower.className = 'mouse-follower';
document.body.appendChild(mouseFollower);

// Add styles for mouse follower
const mouseFollowerStyles = `
    .mouse-follower {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--soft-gold), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.5;
        transition: transform 0.1s ease-out;
        filter: blur(5px);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mouseFollowerStyles;
document.head.appendChild(styleSheet);

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;
    
    followerX += dx * 0.1;
    followerY += dy * 0.1;
    
    mouseFollower.style.left = followerX - 10 + 'px';
    mouseFollower.style.top = followerY - 10 + 'px';
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// ===== Magnetic Effect for CTA Buttons =====
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

// ===== Performance Optimization =====
let ticking = false;

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateElements);
        ticking = true;
    }
}

function updateElements() {
    ticking = false;
}

// ===== Page Visibility API =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.float-circle').forEach(circle => {
            circle.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('.float-circle').forEach(circle => {
            circle.style.animationPlayState = 'running';
        });
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Video optimization
    const video = document.querySelector('.hero-video');
    if (video) {
        // Ensure video plays on mobile
        video.play().catch(e => {
            console.log('Video autoplay prevented:', e);
        });
        
        // Reduce video quality on mobile for performance
        if (window.innerWidth < 768) {
            video.playbackRate = 0.8; // Slightly slower for smoother mobile experience
        }
    }
    
    // Initialize any third-party libraries here
    console.log('Evia Aesthetics - Website Initialized');
});
