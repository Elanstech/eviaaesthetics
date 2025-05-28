// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
});

// GSAP & ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll behavior
const navbar = document.getElementById('mainNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 400) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Service cards hover animations
const serviceCards = document.querySelectorAll('.service-card');
const servicesCircle = document.querySelector('.services-circle');

serviceCards.forEach((card, index) => {
    // Stop rotation on hover
    card.addEventListener('mouseenter', () => {
        servicesCircle.style.animationPlayState = 'paused';
        
        // Animate card
        gsap.to(card, {
            scale: 1.15,
            duration: 0.3,
            ease: 'back.out(1.7)',
            zIndex: 50
        });
        
        // Glow effect
        gsap.to(card.querySelector('.service-icon'), {
            boxShadow: '0 0 30px rgba(212, 168, 87, 0.5)',
            duration: 0.3
        });
        
        // Show service details (optional)
        showServicePreview(card.dataset.service);
    });
    
    card.addEventListener('mouseleave', () => {
        servicesCircle.style.animationPlayState = 'running';
        
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            zIndex: 1
        });
        
        gsap.to(card.querySelector('.service-icon'), {
            boxShadow: 'none',
            duration: 0.3
        });
    });
    
    // Click animation
    card.addEventListener('click', () => {
        // Ripple effect
        createRipple(card);
        
        // Bounce animation
        gsap.to(card, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        // Navigate to service detail (optional)
        setTimeout(() => {
            window.location.href = `#${card.dataset.service}`;
        }, 300);
    });
});

// Service preview function
function showServicePreview(service) {
    const previews = {
        botox: 'Smooth away wrinkles and fine lines',
        weight: 'Medical weight loss programs',
        iv: 'Boost energy and wellness',
        microneedling: 'Rejuvenate your skin naturally',
        prp: 'Harness your body\'s healing power',
        peels: 'Reveal fresh, glowing skin'
    };
    
    // You can implement a tooltip or preview popup here
}

// Ripple effect
function createRipple(element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    element.appendChild(ripple);
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    
    setTimeout(() => ripple.remove(), 600);
}

// Hero text animations
gsap.timeline({ delay: 0.5 })
    .from('.hero-title .title-line', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero-title .title-highlight', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.5')
    .from('.trust-badges .badge-item', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    }, '-=0.3')
    .from('.hero-buttons > *', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.3');

// Services circle entrance animation
gsap.timeline({
    scrollTrigger: {
        trigger: '.services-showcase',
        start: 'top 80%',
        once: true
    }
})
.from('.center-logo', {
    scale: 0,
    rotation: -180,
    duration: 1,
    ease: 'back.out(1.7)'
})
.from('.service-card', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.5)'
}, '-=0.5')
.from('.pulse-ring', {
    scale: 0,
    duration: 0.5,
    stagger: 0.2
}, '-=0.3');

// Parallax effects
gsap.to('.bubble', {
    y: -100,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            gsap.to(window, {
                scrollTo: targetPosition,
                duration: 1,
                ease: 'power3.inOut'
            });
            
            // Close mobile menu
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        }
    });
});

// Button hover effects
const primaryBtns = document.querySelectorAll('.btn-primary-hero');
primaryBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Trust badges hover
const badges = document.querySelectorAll('.badge-item');
badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        gsap.to(badge.querySelector('i'), {
            rotation: 360,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// Mobile optimizations
if (window.innerWidth <= 768) {
    // Reduce animations on mobile
    gsap.set('.services-circle', { animation: 'none' });
    gsap.set('.service-card', { animation: 'none' });
}

// Intersection Observer for fade animations
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(212, 168, 87, 0.3);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Performance optimization
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        AOS.refresh();
        ScrollTrigger.refresh();
    }, 250);
});

// Initialize on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Refresh animations
    setTimeout(() => {
        AOS.refresh();
        ScrollTrigger.refresh();
    }, 100);
});

// Console branding
console.log(
    '%c eviaesthetics ',
    'background: linear-gradient(135deg, #D4A857 0%, #E8D5A6 100%); color: white; font-size: 20px; font-weight: bold; padding: 10px 25px; border-radius: 25px; font-family: "Playfair Display", serif;'
);
console.log('✨ Welcome to eviaesthetics - Where Natural Beauty Meets Medical Excellence');
