// Enhanced Coming Soon Page Interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth page entrance animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);

    // Enhanced button interactions
    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        ctaButton.addEventListener('click', function(e) {
            // Add click ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(37, 99, 235, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.offsetX - 10) + 'px';
            ripple.style.top = (e.offsetY - 10) + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Parallax effect for floating elements
    document.addEventListener('mousemove', function(e) {
        const floatElements = document.querySelectorAll('.float-element');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Dynamic progress animation
    setTimeout(() => {
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            let progress = 95;
            const targetProgress = 98;
            const interval = setInterval(() => {
                if (progress < targetProgress) {
                    progress += Math.random() * 0.5;
                    progressText.textContent = `${Math.floor(progress)}% Complete`;
                } else {
                    clearInterval(interval);
                    progressText.textContent = '98% Complete';
                }
            }, 2000);
        }
    }, 3000);

    // Logo pulse animation
    const logoPlaceholder = document.querySelector('.logo-placeholder');
    if (logoPlaceholder) {
        setInterval(() => {
            logoPlaceholder.style.transform = 'scale(1.05)';
            setTimeout(() => {
                logoPlaceholder.style.transform = 'scale(1)';
            }, 1000);
        }, 4000);
    }

    // Smooth scroll to top when needed
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            document.body.style.transform = `translateY(${window.scrollY * -0.1}px)`;
        }
    });

    // Add dynamic background gradient shift
    let gradientAngle = 135;
    setInterval(() => {
        gradientAngle += 0.5;
        document.documentElement.style.setProperty(
            '--gradient-primary', 
            `linear-gradient(${gradientAngle}deg, #667eea 0%, #764ba2 100%)`
        );
    }, 100);

    // Intersection Observer for enhanced animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.main-content > *');
    animatedElements.forEach(el => observer.observe(el));

    // Add subtle viewport-based animations
    window.addEventListener('resize', function() {
        const elements = document.querySelectorAll('.float-element');
        elements.forEach((el, index) => {
            const scale = Math.min(window.innerWidth / 1200, 1);
            el.style.transform = `scale(${scale})`;
        });
    });

    // Preload main page for faster transition
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'index.html';
    document.head.appendChild(link);

    // Add subtle typing effect to subtitle
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--accent-color)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    }
});

// Add ripple animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .logo-placeholder {
        transition: transform 1s ease-in-out;
    }
    
    .float-element {
        transition: transform 0.3s ease-out;
    }
`;
document.head.appendChild(style);
