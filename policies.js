// Policies JavaScript - Enhanced user interactions and animations
class PolicyPageEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupHeaderEffects();
        this.setupInteractiveElements();
        this.setupKeyboardNavigation();
        this.setupProgressIndicator();
        this.setupCookiePreferences();
        this.setupSearchFunctionality();
    }

    // Scroll-based animations
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animations for child elements
                    const children = entry.target.querySelectorAll('.usage-item, .right-item, .term-item, .fee-item, .info-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.animation = `fadeInUp 0.6s ease-out both`;
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        });

        // Observe all policy sections
        document.querySelectorAll('.policy-section').forEach(section => {
            observer.observe(section);
        });
    }

    // Enhanced smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Dynamic header effects
    setupHeaderEffects() {
        const header = document.querySelector('.policy-header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove shadow based on scroll position
            if (currentScrollY > 10) {
                header.classList.add('scrolled');
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.classList.remove('scrolled');
                header.style.boxShadow = 'none';
            }

            // Hide/show header on scroll (optional)
            if (Math.abs(currentScrollY - lastScrollY) > 10) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                lastScrollY = currentScrollY;
            }
        });
    }

    // Interactive elements enhancement
    setupInteractiveElements() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.usage-item, .right-item, .term-item, .fee-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-8px) scale(1.02)';
                e.target.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            item.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Interactive policy links
        document.querySelectorAll('.policy-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px)';
                this.createRippleEffect(e);
            });

            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0)';
            });
        });

        // Back button enhancements
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.animatedPageTransition(() => {
                    window.location.href = backBtn.href;
                });
            });
        }
    }

    // Keyboard navigation support
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key to go back
            if (e.key === 'Escape') {
                const backBtn = document.querySelector('.back-btn');
                if (backBtn) {
                    backBtn.click();
                }
            }

            // Arrow keys for section navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const sections = document.querySelectorAll('.policy-section');
                const currentSection = this.getCurrentVisibleSection(sections);
                if (currentSection !== -1) {
                    const nextSection = e.key === 'ArrowDown' ? 
                        Math.min(currentSection + 1, sections.length - 1) :
                        Math.max(currentSection - 1, 0);
                    
                    sections[nextSection].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    // Reading progress indicator
    setupProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #e5a352, #d4913e);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }

    // Cookie preferences management
    setupCookiePreferences() {
        if (window.location.pathname.includes('cookie-policy')) {
            this.createCookiePreferenceManager();
        }
    }

    createCookiePreferenceManager() {
        const preferenceSection = document.createElement('div');
        preferenceSection.className = 'cookie-preferences-manager';
        preferenceSection.innerHTML = `
            <div class="preference-controls">
                <h3>Manage Your Cookie Preferences</h3>
                <div class="cookie-toggles">
                    <div class="cookie-toggle">
                        <label>
                            <input type="checkbox" checked disabled> Essential Cookies
                            <span class="toggle-slider essential"></span>
                        </label>
                    </div>
                    <div class="cookie-toggle">
                        <label>
                            <input type="checkbox" id="analytics-cookies"> Analytics Cookies
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="cookie-toggle">
                        <label>
                            <input type="checkbox" id="functional-cookies"> Functional Cookies
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <button class="save-preferences-btn">Save Preferences</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .cookie-preferences-manager {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 32px;
                border-radius: 20px;
                margin: 32px 0;
                border: 2px solid var(--accent-color);
            }
            
            .cookie-toggle {
                display: flex;
                align-items: center;
                margin: 16px 0;
                padding: 16px;
                background: white;
                border-radius: 12px;
                transition: all 0.3s ease;
            }
            
            .cookie-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .toggle-slider {
                width: 50px;
                height: 24px;
                background: #ccc;
                border-radius: 24px;
                position: relative;
                margin-left: 16px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .toggle-slider:before {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                top: 2px;
                left: 2px;
                transition: all 0.3s ease;
            }
            
            input[type="checkbox"]:checked + .toggle-slider {
                background: var(--accent-color);
            }
            
            input[type="checkbox"]:checked + .toggle-slider:before {
                transform: translateX(26px);
            }
            
            .toggle-slider.essential {
                background: var(--success-color) !important;
            }
            
            .save-preferences-btn {
                background: var(--gradient-accent);
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .save-preferences-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(229, 163, 82, 0.4);
            }
        `;
        document.head.appendChild(style);

        // Insert before the last section
        const sections = document.querySelectorAll('.policy-section');
        const lastSection = sections[sections.length - 1];
        lastSection.parentNode.insertBefore(preferenceSection, lastSection);

        // Add functionality
        document.querySelector('.save-preferences-btn').addEventListener('click', () => {
            const analytics = document.getElementById('analytics-cookies').checked;
            const functional = document.getElementById('functional-cookies').checked;
            
            // Store preferences
            const preferences = { analytics, functional };
            this.storeCookiePreferences(preferences);
            
            // Show confirmation
            this.showNotification('Cookie preferences saved successfully!', 'success');
        });
    }

    // Search functionality
    setupSearchFunctionality() {
        // Add search functionality if needed
        const searchContainer = document.createElement('div');
        searchContainer.className = 'policy-search';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" placeholder="Search within this policy..." class="search-input">
                <button class="search-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                </button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .policy-search {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            
            .policy-search.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .search-box {
                display: flex;
                background: white;
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .search-input {
                border: none;
                outline: none;
                padding: 12px 20px;
                width: 250px;
                font-size: 14px;
            }
            
            .search-btn {
                background: var(--accent-color);
                border: none;
                padding: 12px 16px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .search-btn:hover {
                background: var(--primary-color);
            }
        `;
        document.head.appendChild(style);

        // Show search on Ctrl/Cmd + F
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                searchContainer.classList.add('visible');
                searchContainer.querySelector('.search-input').focus();
            }
        });

        document.body.appendChild(searchContainer);
    }

    // Utility functions
    createRippleEffect(e) {
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(229, 163, 82, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        e.target.style.position = 'relative';
        e.target.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    animatedPageTransition(callback) {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            callback();
        }, 300);
    }

    getCurrentVisibleSection(sections) {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return i;
            }
        }
        return -1;
    }

    storeCookiePreferences(preferences) {
        // Store in sessionStorage instead of localStorage
        sessionStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--accent-color)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add ripple animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PolicyPageEnhancer();
});

// Add page visibility API for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Add print optimization
window.addEventListener('beforeprint', () => {
    // Hide interactive elements when printing
    document.querySelectorAll('.policy-search, .cookie-preferences-manager, .reading-progress').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    // Restore interactive elements after printing
    document.querySelectorAll('.policy-search, .cookie-preferences-manager, .reading-progress').forEach(el => {
        el.style.display = '';
    });
});

// Performance monitoring
if ('web-vitals' in window) {
    // Track Core Web Vitals if the library is available
    const trackVitals = (metric) => {
        console.log(`${metric.name}: ${metric.value}`);
    };
    
    getCLS(trackVitals);
    getFID(trackVitals);
    getLCP(trackVitals);
}

// Export for potential external use
window.PolicyPageEnhancer = PolicyPageEnhancer;