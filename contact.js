// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }
    
    // Initialize contact page functionality
    initializeContactPage();
    initializeFormEnhancements();
    initializeMapInteractions();
    initializeSmoothScrolling();
    initializeContactAnimations();
    
});

// Contact Page Initialization
function initializeContactPage() {
    console.log('Contact page initialized');
    
    // Add loading states to contact methods
    enhanceContactMethods();
    
    // Initialize business hours functionality
    initializeBusinessHours();
    
    // Setup form success handling
    setupFormSuccessHandling();
}

// Enhance Contact Methods
function enhanceContactMethods() {
    const contactMethods = document.querySelectorAll('.contact-method-card');
    
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', () => {
            addHoverEffect(method);
        });
        
        method.addEventListener('mouseleave', () => {
            removeHoverEffect(method);
        });
        
        // Add click tracking
        const link = method.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                trackContactMethod(link.getAttribute('href'));
                addClickEffect(method);
            });
        }
    });
}

function addHoverEffect(element) {
    const icon = element.querySelector('.method-icon');
    if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
}

function removeHoverEffect(element) {
    const icon = element.querySelector('.method-icon');
    if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
    }
}

function addClickEffect(element) {
    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
        element.style.transform = 'translateX(5px)';
    }, 150);
}

function trackContactMethod(href) {
    // Track which contact method was used
    if (href.includes('tel:')) {
        console.log('Phone contact initiated');
        // Add analytics tracking here
    } else if (href.includes('mailto:')) {
        console.log('Email contact initiated');
        // Add analytics tracking here
    } else if (href.includes('maps')) {
        console.log('Map directions requested');
        // Add analytics tracking here
    }
}

// Form Enhancements
function initializeFormEnhancements() {
    const formContainer = document.querySelector('.form-container');
    const elfsightContainer = document.querySelector('.elfsight-form-wrapper');
    
    if (!formContainer || !elfsightContainer) return;
    
    // Monitor form loading
    observeFormLoading();
    
    // Add form validation feedback
    setupFormValidation();
    
    // Handle form submission success
    handleFormSubmission();
}

function observeFormLoading() {
    const elfsightContainer = document.querySelector('.elfsight-form-wrapper');
    const formContainer = document.querySelector('.form-container');
    
    if (!elfsightContainer || !formContainer) return;
    
    // Show loading state while Elfsight loads
    formContainer.classList.add('loading');
    
    // Observer to detect when Elfsight form loads
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const elfsightWidget = elfsightContainer.querySelector('[data-elfsight-app-lazy]');
                if (elfsightWidget && elfsightWidget.children.length > 0) {
                    formContainer.classList.remove('loading');
                    
                    // Add custom styling to Elfsight form
                    setTimeout(() => {
                        styleElfsightForm();
                    }, 1000);
                    
                    observer.disconnect();
                }
            }
        });
    });
    
    observer.observe(elfsightContainer, {
        childList: true,
        subtree: true
    });
    
    // Fallback: Remove loading after 5 seconds
    setTimeout(() => {
        formContainer.classList.remove('loading');
    }, 5000);
}

function styleElfsightForm() {
    // Add custom styles to the Elfsight form to match our theme
    const style = document.createElement('style');
    style.textContent = `
        .elfsight-app [data-elfsight-app-lazy] input,
        .elfsight-app [data-elfsight-app-lazy] textarea,
        .elfsight-app [data-elfsight-app-lazy] select {
            border-radius: 12px !important;
            border: 2px solid rgba(255, 140, 0, 0.2) !important;
            transition: all 0.3s ease !important;
        }
        
        .elfsight-app [data-elfsight-app-lazy] input:focus,
        .elfsight-app [data-elfsight-app-lazy] textarea:focus,
        .elfsight-app [data-elfsight-app-lazy] select:focus {
            border-color: #FF8C00 !important;
            box-shadow: 0 0 20px rgba(255, 140, 0, 0.3) !important;
        }
        
        .elfsight-app [data-elfsight-app-lazy] button[type="submit"] {
            background: linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FF7A00 100%) !important;
            border: none !important;
            border-radius: 25px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
        }
        
        .elfsight-app [data-elfsight-app-lazy] button[type="submit"]:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4) !important;
        }
    `;
    
    document.head.appendChild(style);
}

function setupFormValidation() {
    // Enhanced form validation feedback
    const form = document.querySelector('.elfsight-form-wrapper form');
    if (!form) return;
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Clear previous validation
    clearFieldValidation(field);
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    } else if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
}

function clearValidationError(event) {
    const field = event.target;
    clearFieldValidation(field);
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.3)';
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 12px;
        margin-top: 4px;
        font-family: var(--font-inter);
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.style.borderColor = '#27ae60';
    field.style.boxShadow = '0 0 10px rgba(39, 174, 96, 0.3)';
}

function clearFieldValidation(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmission() {
    // Monitor for successful form submissions
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Look for success messages
                const successElements = document.querySelectorAll('[class*="success"], [class*="thank"]');
                successElements.forEach(element => {
                    if (element.textContent.toLowerCase().includes('success') || 
                        element.textContent.toLowerCase().includes('thank')) {
                        showFormSuccessAnimation();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function showFormSuccessAnimation() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.className = 'form-success-overlay';
    overlay.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">
                <i class="ri-check-line"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
            <button class="success-close-btn" onclick="closeSuccessModal()">Continue</button>
        </div>
    `;
    
    // Add styles
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const modal = overlay.querySelector('.success-modal');
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
        animation: successSlideIn 0.5s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#success-animations')) {
        const style = document.createElement('style');
        style.id = 'success-animations';
        style.textContent = `
            @keyframes successSlideIn {
                0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            
            .success-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #FF8C00, #FFA500);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 30px;
                color: white;
                animation: successIconPulse 1s ease-in-out;
            }
            
            @keyframes successIconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .success-close-btn {
                background: linear-gradient(135deg, #FF8C00, #FFA500);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
            }
            
            .success-close-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            closeSuccessModal();
        }
    }, 5000);
}

// Global function for closing success modal
window.closeSuccessModal = function() {
    const overlay = document.querySelector('.form-success-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
};

// Business Hours Enhancement
function initializeBusinessHours() {
    const hoursCard = document.querySelector('.hours-card');
    if (!hoursCard) return;
    
    // Highlight current day
    highlightCurrentDay();
    
    // Add hover effects to hours items
    const hoursItems = hoursCard.querySelectorAll('.hours-item');
    hoursItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(255, 140, 0, 0.1)';
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = '';
            item.style.transform = '';
        });
    });
}

function highlightCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];
    
    const hoursItems = document.querySelectorAll('.hours-item');
    hoursItems.forEach(item => {
        const dayElement = item.querySelector('.day');
        if (dayElement && dayElement.textContent.includes(currentDay)) {
            item.style.background = 'rgba(255, 140, 0, 0.1)';
            item.style.borderLeft = '3px solid #FF8C00';
            item.style.paddingLeft = '16px';
            
            // Add "Today" indicator
            const todayIndicator = document.createElement('span');
            todayIndicator.textContent = ' (Today)';
            todayIndicator.style.cssText = `
                color: #FF8C00;
                font-weight: 600;
                font-size: 12px;
            `;
            dayElement.appendChild(todayIndicator);
        }
    });
}

// Map Interactions
function initializeMapInteractions() {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapOverlay = document.querySelector('.map-overlay-info');
    
    if (!mapWrapper || !mapOverlay) return;
    
    // Add click-to-activate functionality
    let mapActivated = false;
    
    mapWrapper.addEventListener('click', () => {
        if (!mapActivated) {
            activateMap();
        }
    });
    
    function activateMap() {
        mapActivated = true;
        const iframe = mapWrapper.querySelector('iframe');
        if (iframe) {
            iframe.style.pointerEvents = 'auto';
            iframe.style.filter = 'grayscale(0%) brightness(1)';
        }
        
        // Update overlay
        const overlayContent = mapOverlay.querySelector('.overlay-content');
        if (overlayContent) {
            const activatedMsg = document.createElement('div');
            activatedMsg.textContent = 'Map activated - Click and drag to explore';
            activatedMsg.style.cssText = `
                background: #27ae60;
                color: white;
                padding: 8px;
                border-radius: 8px;
                font-size: 12px;
                margin-top: 10px;
                text-align: center;
            `;
            overlayContent.appendChild(activatedMsg);
            
            setTimeout(() => {
                activatedMsg.remove();
            }, 3000);
        }
    }
    
    // Add directions button enhancement
    const directionsBtn = document.querySelector('.directions-btn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', (e) => {
            // Add loading state
            const originalText = directionsBtn.innerHTML;
            directionsBtn.innerHTML = '<i class="ri-loader-4-line"></i> Opening Maps...';
            directionsBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                directionsBtn.innerHTML = originalText;
                directionsBtn.style.pointerEvents = 'auto';
            }, 2000);
        });
    }
}

// Smooth Scrolling Enhancements
function initializeSmoothScrolling() {
    // Enhance anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Add highlight effect to target
                highlightTarget(targetElement);
                
                // Smooth scroll with offset for header
                const headerHeight = document.querySelector('header').offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function highlightTarget(element) {
    // Add temporary highlight effect
    const originalBackground = element.style.background;
    element.style.background = 'rgba(255, 140, 0, 0.1)';
    element.style.transition = 'background 0.3s ease';
    
    setTimeout(() => {
        element.style.background = originalBackground;
    }, 2000);
}

// Contact Animations
function initializeContactAnimations() {
    // Add entrance animations to social links
    const socialLinks = document.querySelectorAll('.social-link-card');
    
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Add floating animation to contact badges
    initializeFloatingElements();
    
    // Add parallax effect to hero elements
    initializeParallaxEffect();
}

function initializeFloatingElements() {
    const badges = document.querySelectorAll('.contact-hero-badge, .location-badge, .cta-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-5px) scale(1.05)';
            badge.style.boxShadow = '0 15px 40px rgba(255, 140, 0, 0.3)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0) scale(1)';
            badge.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        });
    });
}

function initializeParallaxEffect() {
    const heroElements = document.querySelectorAll('.hero-element');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        heroElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            
            if (scrolled < windowHeight) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }, 16));
}

// Utility Functions
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
    }
}

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

// Setup form success handling
function setupFormSuccessHandling() {
    // Listen for form submission events
    document.addEventListener('submit', (e) => {
        if (e.target.closest('.elfsight-form-wrapper')) {
            // Add submission tracking
            console.log('Contact form submitted');
            
            // Show loading state
            showFormLoadingState();
        }
    });
}

function showFormLoadingState() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.classList.add('loading');
        
        // Remove loading state after reasonable time
        setTimeout(() => {
            formContainer.classList.remove('loading');
        }, 3000);
    }
}

// Initialize page visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause animations
        pauseAnimations();
    } else {
        // Page is visible - resume animations
        resumeAnimations();
    }
});

function pauseAnimations() {
    const animatedElements = document.querySelectorAll('.hero-element, .cta-element');
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
    });
}

function resumeAnimations() {
    const animatedElements = document.querySelectorAll('.hero-element, .cta-element');
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'running';
    });
}

// Export functions for global use
window.contactPageFunctions = {
    trackContactMethod,
    highlightTarget,
    showFormSuccessAnimation,
    closeSuccessModal
};

// Add error handling
window.addEventListener('error', (e) => {
    console.error('Contact page error:', e.error);
    
    // Remove any loading states on error
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.classList.remove('loading');
    });
});

// Initialize print functionality
window.addEventListener('beforeprint', () => {
    // Ensure all content is visible for printing
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(element => {
        element.setAttribute('data-was-hidden', 'true');
        element.style.display = 'block';
    });
});

window.addEventListener('afterprint', () => {
    // Restore hidden elements after printing
    const wasHiddenElements = document.querySelectorAll('[data-was-hidden]');
    wasHiddenElements.forEach(element => {
        element.style.display = 'none';
        element.removeAttribute('data-was-hidden');
    });
});

console.log('Contact page JavaScript loaded successfully');
