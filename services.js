/* ========================================
   SERVICES PAGE - INTERACTIVE FUNCTIONALITY
   Manhattan Luxury Medical Spa Experience
   ======================================== */

class ServicesPageManager {
    constructor() {
        this.activeCategory = null;
        this.isTransitioning = false;
        this.categoryCards = [];
        this.detailsPanels = [];
        this.videos = [];
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initAnimations();
        this.setupIntersectionObservers();
        this.initVideoBackground();
        
        console.log('🏛️ Services Page - Luxury Experience Activated');
    }

    cacheElements() {
        // Category elements
        this.categoryCards = document.querySelectorAll('.category-card');
        this.categoryExpandBtns = document.querySelectorAll('.category-expand-btn');
        this.detailsPanels = document.querySelectorAll('.service-details-panel');
        
        // Hero elements
        this.heroContent = document.querySelector('.services-hero-content');
        this.navigationGuide = document.querySelector('.services-navigation-guide');
        this.consultationNotice = document.querySelector('.consultation-notice');
        this.consultationBtn = document.querySelector('.consultation-btn');
        this.quickStats = document.querySelectorAll('.stat-item');
        this.scrollIndicator = document.querySelector('.services-scroll-indicator');
        
        // Video elements
        this.videos = document.querySelectorAll('.services-video-background video');
        this.videoContainer = document.querySelector('.video-collage-container');
        
        // CTA elements
        this.ctaBtns = document.querySelectorAll('.primary-cta-btn, .secondary-cta-btn');
    }

    bindEvents() {
        // Category card interactions
        this.categoryCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => this.handleCategoryHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCategoryHover(card, false));
            card.addEventListener('click', () => this.handleCategoryClick(card));
        });

        // Category expand button interactions
        this.categoryExpandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCategoryExpand(btn);
            });
        });

        // Service details panel close functionality
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeCategory) {
                this.hideServiceDetails();
            }
        });

        // Hero element interactions
        if (this.navigationGuide) {
            this.navigationGuide.addEventListener('mouseenter', () => {
                this.addNavigationGuideGlow();
            });
            this.navigationGuide.addEventListener('mouseleave', () => {
                this.removeNavigationGuideGlow();
            });
        }

        if (this.consultationNotice) {
            this.consultationNotice.addEventListener('mouseenter', () => {
                this.addConsultationGlow();
            });
            this.consultationNotice.addEventListener('mouseleave', () => {
                this.removeConsultationGlow();
            });
        }

        if (this.consultationBtn) {
            this.consultationBtn.addEventListener('click', () => {
                this.handleConsultationClick();
            });
        }

        // Quick stats hover effects
        this.quickStats.forEach(stat => {
            stat.addEventListener('mouseenter', () => this.animateStatHover(stat, true));
            stat.addEventListener('mouseleave', () => this.animateStatHover(stat, false));
        });

        // Scroll indicator interaction
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.scrollToServices();
            });
        }

        // CTA button interactions
        this.ctaBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => this.handleCtaHover(btn, true));
            btn.addEventListener('mouseleave', () => this.handleCtaHover(btn, false));
        });

        // Smooth scroll for anchor links
        this.setupSmoothScrolling();
        
        // Video management
        this.handleVideoPlayback();
    }

    initVideoBackground() {
        // Ensure videos play properly
        this.videos.forEach((video, index) => {
            video.muted = true;
            video.playsInline = true;
            video.autoplay = true;
            video.loop = true;
            
            // Handle video load and play
            video.addEventListener('loadeddata', () => {
                video.play().catch(e => console.log('Video autoplay prevented:', e));
            });
            
            // Add subtle loading animation
            video.style.opacity = '0';
            video.addEventListener('canplay', () => {
                setTimeout(() => {
                    video.style.transition = 'opacity 1s ease';
                    video.style.opacity = '1';
                }, index * 200);
            });
        });

        // Handle responsive video switching
        this.handleResponsiveVideo();
    }

    handleResponsiveVideo() {
        const mobileBreakpoint = 768;
        const desktopLayout = document.querySelector('.desktop-video-layout');
        const mobileLayout = document.querySelector('.mobile-video-layout');
        
        const checkVideoLayout = () => {
            if (window.innerWidth <= mobileBreakpoint) {
                if (desktopLayout) desktopLayout.style.display = 'none';
                if (mobileLayout) mobileLayout.style.display = 'block';
            } else {
                if (desktopLayout) desktopLayout.style.display = 'grid';
                if (mobileLayout) mobileLayout.style.display = 'none';
            }
        };

        checkVideoLayout();
        window.addEventListener('resize', checkVideoLayout);
    }

    handleVideoPlayback() {
        // Pause videos when page is not visible
        document.addEventListener('visibilitychange', () => {
            this.videos.forEach(video => {
                if (document.hidden) {
                    video.pause();
                } else {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            });
        });
    }

    addNavigationGuideGlow() {
        if (this.navigationGuide) {
            this.navigationGuide.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.15)';
            this.navigationGuide.style.borderColor = 'rgba(255, 140, 0, 0.3)';
            this.navigationGuide.style.transform = 'translateY(-4px)';
        }
    }

    removeNavigationGuideGlow() {
        if (this.navigationGuide) {
            this.navigationGuide.style.boxShadow = '';
            this.navigationGuide.style.borderColor = '';
            this.navigationGuide.style.transform = '';
        }
    }

    addConsultationGlow() {
        if (this.consultationNotice) {
            this.consultationNotice.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.2)';
            this.consultationNotice.style.borderColor = 'rgba(255, 140, 0, 0.4)';
            this.consultationNotice.style.transform = 'translateY(-4px)';
        }
    }

    removeConsultationGlow() {
        if (this.consultationNotice) {
            this.consultationNotice.style.boxShadow = '';
            this.consultationNotice.style.borderColor = '';
            this.consultationNotice.style.transform = '';
        }
    }

    handleConsultationClick() {
        // Add click animation to consultation button
        if (this.consultationBtn) {
            this.consultationBtn.style.transform = 'translateY(-1px) scale(0.98)';
            setTimeout(() => {
                this.consultationBtn.style.transform = '';
            }, 150);
        }

        // Add ripple effect
        this.addRippleEffect(this.consultationBtn);
        
        // Optional: Track consultation button clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'consultation_click', {
                'event_category': 'engagement',
                'event_label': 'hero_consultation_button'
            });
        }
    }

    animateStatHover(stat, isEntering) {
        const number = stat.querySelector('.stat-number');
        const label = stat.querySelector('.stat-label');

        if (isEntering) {
            stat.style.transform = 'translateY(-8px)';
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.color = 'var(--hermes-orange)';
            }
            if (label) {
                label.style.color = 'var(--text-primary)';
            }
        } else {
            stat.style.transform = '';
            if (number) {
                number.style.transform = '';
                number.style.color = '';
            }
            if (label) {
                label.style.color = '';
            }
        }
    }

    scrollToServices() {
        const servicesSection = document.querySelector('.service-categories-section');
        if (servicesSection) {
            // Add click animation to scroll indicator
            if (this.scrollIndicator) {
                this.scrollIndicator.style.transform = 'translateX(-50%) translateY(4px) scale(0.95)';
                setTimeout(() => {
                    this.scrollIndicator.style.transform = '';
                }, 200);
            }

            servicesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleCategoryHover(card, isEntering) {
        if (this.isTransitioning) return;

        const cornerOrnaments = card.querySelectorAll('.corner-ornament');
        const categoryNumber = card.querySelector('.category-number');
        const categoryBadges = card.querySelectorAll('.category-badges span');

        if (isEntering) {
            // Add luxury hover effects
            this.addRippleEffect(card);
            
            // Animate corner ornaments
            cornerOrnaments.forEach((ornament, index) => {
                setTimeout(() => {
                    ornament.style.opacity = '0.8';
                    ornament.style.transform = 'scale(1.1)';
                }, index * 50);
            });

            // Animate number badge
            if (categoryNumber) {
                categoryNumber.style.transform = 'scale(1.1) rotate(5deg)';
                categoryNumber.style.boxShadow = '0 10px 25px rgba(255, 140, 0, 0.3)';
            }

            // Animate category badges
            categoryBadges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'translateY(-2px) scale(1.05)';
                }, index * 100);
            });

        } else {
            // Reset hover effects
            cornerOrnaments.forEach(ornament => {
                ornament.style.opacity = '';
                ornament.style.transform = '';
            });

            if (categoryNumber) {
                categoryNumber.style.transform = '';
                categoryNumber.style.boxShadow = '';
            }

            categoryBadges.forEach(badge => {
                badge.style.transform = '';
            });
        }
    }

    handleCategoryClick(card) {
        if (this.isTransitioning) return;

        // Add click animation
        this.addClickAnimation(card);
        
        // Get category data
        const category = card.getAttribute('data-category');
        
        // Show service details after animation
        setTimeout(() => {
            this.showServiceDetails(category);
        }, 200);
    }

    handleCategoryExpand(btn) {
        if (this.isTransitioning) return;

        const category = btn.getAttribute('data-category');
        const icon = btn.querySelector('i');
        
        // Animate button
        btn.style.transform = 'translateY(-2px) scale(0.98)';
        icon.style.transform = 'translateY(4px) rotate(180deg)';
        
        setTimeout(() => {
            btn.style.transform = '';
            icon.style.transform = '';
            this.showServiceDetails(category);
        }, 200);
    }

    showServiceDetails(category) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Hide any active panels first
        if (this.activeCategory && this.activeCategory !== category) {
            this.hideServiceDetails(false);
        }

        const detailsPanel = document.getElementById(`${category}-details`);
        if (!detailsPanel) {
            this.isTransitioning = false;
            return;
        }

        // Show panel
        detailsPanel.style.display = 'block';
        
        // Smooth scroll to panel
        detailsPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Animate panel appearance
        setTimeout(() => {
            detailsPanel.classList.add('active');
            this.activeCategory = category;
            
            // Animate service items
            const serviceItems = detailsPanel.querySelectorAll('.service-item');
            serviceItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.6s ease-out';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                }, index * 100);
            });

            this.isTransitioning = false;
        }, 100);
    }

    hideServiceDetails(animate = true) {
        if (!this.activeCategory) return;

        const detailsPanel = document.getElementById(`${this.activeCategory}-details`);
        if (!detailsPanel) return;

        if (animate) {
            // Animate out
            detailsPanel.style.opacity = '0';
            detailsPanel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                detailsPanel.classList.remove('active');
                detailsPanel.style.display = 'none';
                detailsPanel.style.opacity = '';
                detailsPanel.style.transform = '';
                this.activeCategory = null;
            }, 300);
        } else {
            detailsPanel.classList.remove('active');
            detailsPanel.style.display = 'none';
            this.activeCategory = null;
        }
    }

    handleCtaHover(btn, isEntering) {
        const shimmer = btn.querySelector('.cta-shimmer');
        
        if (isEntering) {
            // Trigger shimmer effect
            if (shimmer) {
                shimmer.style.transition = 'all 0.8s ease';
                shimmer.style.left = '100%';
            }
            
            // Add glow effect
            btn.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.4)';
        } else {
            // Reset shimmer
            if (shimmer) {
                setTimeout(() => {
                    shimmer.style.transition = 'none';
                    shimmer.style.left = '-100%';
                }, 800);
            }
        }
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: luxuryRipple 1s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }

    addClickAnimation(element) {
        element.style.transform = 'translateY(-2px) scale(0.98)';
        element.style.transition = 'all 0.2s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }

    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Add highlight effect to target
                    target.style.transition = 'all 0.3s ease';
                    target.style.transform = 'scale(1.02)';
                    target.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.1)';
                    
                    setTimeout(() => {
                        target.style.transform = '';
                        target.style.boxShadow = '';
                    }, 1000);
                }
            });
        });
    }

    initAnimations() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }

        // Add entrance animations to hero elements
        this.animateHeroEntrance();
    }

    animateHeroEntrance() {
        if (!this.heroContent) return;

        const elements = this.heroContent.querySelectorAll('.services-hero-badge, .services-hero-title, .services-hero-subtitle, .services-navigation-guide, .consultation-notice, .services-quick-stats, .services-scroll-indicator');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate quick stats individually
        this.quickStats.forEach((stat, index) => {
            const number = stat.querySelector('.stat-number');
            if (number) {
                setTimeout(() => {
                    this.animateNumber(number);
                }, 1000 + (index * 200));
            }
        });
    }

    animateNumber(element) {
        const finalNumber = element.textContent;
        const isPrice = finalNumber.includes('

    handleCategoryHover(card, isEntering) {
        if (this.isTransitioning) return;

        const cornerOrnaments = card.querySelectorAll('.corner-ornament');
        const categoryNumber = card.querySelector('.category-number');
        const categoryBadges = card.querySelectorAll('.category-badges span');

        if (isEntering) {
            // Add luxury hover effects
            this.addRippleEffect(card);
            
            // Animate corner ornaments
            cornerOrnaments.forEach((ornament, index) => {
                setTimeout(() => {
                    ornament.style.opacity = '0.8';
                    ornament.style.transform = 'scale(1.1)';
                }, index * 50);
            });

            // Animate number badge
            if (categoryNumber) {
                categoryNumber.style.transform = 'scale(1.1) rotate(5deg)';
                categoryNumber.style.boxShadow = '0 10px 25px rgba(255, 140, 0, 0.3)';
            }

            // Animate category badges
            categoryBadges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'translateY(-2px) scale(1.05)';
                }, index * 100);
            });

        } else {
            // Reset hover effects
            cornerOrnaments.forEach(ornament => {
                ornament.style.opacity = '';
                ornament.style.transform = '';
            });

            if (categoryNumber) {
                categoryNumber.style.transform = '';
                categoryNumber.style.boxShadow = '';
            }

            categoryBadges.forEach(badge => {
                badge.style.transform = '';
            });
        }
    }

    handleCategoryClick(card) {
        if (this.isTransitioning) return;

        // Add click animation
        this.addClickAnimation(card);
        
        // Get category data
        const category = card.getAttribute('data-category');
        
        // Show service details after animation
        setTimeout(() => {
            this.showServiceDetails(category);
        }, 200);
    }

    handleCategoryExpand(btn) {
        if (this.isTransitioning) return;

        const category = btn.getAttribute('data-category');
        const icon = btn.querySelector('i');
        
        // Animate button
        btn.style.transform = 'translateY(-2px) scale(0.98)';
        icon.style.transform = 'translateY(4px) rotate(180deg)';
        
        setTimeout(() => {
            btn.style.transform = '';
            icon.style.transform = '';
            this.showServiceDetails(category);
        }, 200);
    }

    showServiceDetails(category) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Hide any active panels first
        if (this.activeCategory && this.activeCategory !== category) {
            this.hideServiceDetails(false);
        }

        const detailsPanel = document.getElementById(`${category}-details`);
        if (!detailsPanel) {
            this.isTransitioning = false;
            return;
        }

        // Show panel
        detailsPanel.style.display = 'block';
        
        // Smooth scroll to panel
        detailsPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Animate panel appearance
        setTimeout(() => {
            detailsPanel.classList.add('active');
            this.activeCategory = category;
            
            // Animate service items
            const serviceItems = detailsPanel.querySelectorAll('.service-item');
            serviceItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.6s ease-out';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                }, index * 100);
            });

            this.isTransitioning = false;
        }, 100);
    }

    hideServiceDetails(animate = true) {
        if (!this.activeCategory) return;

        const detailsPanel = document.getElementById(`${this.activeCategory}-details`);
        if (!detailsPanel) return;

        if (animate) {
            // Animate out
            detailsPanel.style.opacity = '0';
            detailsPanel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                detailsPanel.classList.remove('active');
                detailsPanel.style.display = 'none';
                detailsPanel.style.opacity = '';
                detailsPanel.style.transform = '';
                this.activeCategory = null;
            }, 300);
        } else {
            detailsPanel.classList.remove('active');
            detailsPanel.style.display = 'none';
            this.activeCategory = null;
        }
    }

    handleCtaHover(btn, isEntering) {
        const shimmer = btn.querySelector('.cta-shimmer');
        
        if (isEntering) {
            // Trigger shimmer effect
            if (shimmer) {
                shimmer.style.transition = 'all 0.8s ease';
                shimmer.style.left = '100%';
            }
            
            // Add glow effect
            btn.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.4)';
        } else {
            // Reset shimmer
            if (shimmer) {
                setTimeout(() => {
                    shimmer.style.transition = 'none';
                    shimmer.style.left = '-100%';
                }, 800);
            }
        }
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: luxuryRipple 1s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }

    addClickAnimation(element) {
        element.style.transform = 'translateY(-2px) scale(0.98)';
        element.style.transition = 'all 0.2s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }

    addConsultationGlow() {
        if (this.consultationNotice) {
            this.consultationNotice.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.15)';
            this.consultationNotice.style.borderColor = 'rgba(255, 140, 0, 0.3)';
        }
    }

    removeConsultationGlow() {
        if (this.consultationNotice) {
            this.consultationNotice.style.boxShadow = '';
            this.consultationNotice.style.borderColor = '';
        }
    }

    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Add highlight effect to target
                    target.style.transition = 'all 0.3s ease';
                    target.style.transform = 'scale(1.02)';
                    target.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.1)';
                    
                    setTimeout(() => {
                        target.style.transform = '';
                        target.style.boxShadow = '';
                    }, 1000);
                }
            });
        });
    }

    initAnimations() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }

        // Add entrance animations to hero elements
        this.animateHeroEntrance();
        
        // Add particle animations
        this.animateParticles();
    }

    animateHeroEntrance() {
        if (!this.heroContent) return;

        const elements = this.heroContent.querySelectorAll('.services-hero-badge, .services-hero-title, .services-hero-subtitle, .consultation-notice');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateParticles() {
        this.heroParticles.forEach((particle, index) => {
            const delay = index * 2000;
            const duration = 15000 + (index * 1000);
            
            particle.style.animationDelay = `-${delay}ms`;
            particle.style.animationDuration = `${duration}ms`;
        });
    }

    setupIntersectionObservers() {
        // Observe category cards for scroll animations
        const categoryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    this.animateCategoryEntrance(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        this.categoryCards.forEach(card => {
            categoryObserver.observe(card);
        });

        // Observe CTA section for final animations
        const ctaSection = document.querySelector('.services-cta-section');
        if (ctaSection) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCtaEntrance(entry.target);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '100px'
            });

            ctaObserver.observe(ctaSection);
        }
    }

    animateCategoryEntrance(card) {
        const elements = card.querySelectorAll('.category-image-container, .category-content, .category-badges span');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Add subtle glow effect
        setTimeout(() => {
            card.style.boxShadow = '0 15px 35px rgba(255, 140, 0, 0.08)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        }, 500);
    }

    animateCtaEntrance(ctaSection) {
        const elements = ctaSection.querySelectorAll('.cta-badge, .cta-title, .cta-subtitle, .cta-actions, .consultation-reminder');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// Enhanced Service Item Interactions
class ServiceItemManager {
    constructor() {
        this.serviceItems = [];
        this.init();
    }

    init() {
        this.serviceItems = document.querySelectorAll('.service-item');
        this.bindEvents();
    }

    bindEvents() {
        this.serviceItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.handleServiceHover(item, true));
            item.addEventListener('mouseleave', () => this.handleServiceHover(item, false));
            item.addEventListener('click', () => this.handleServiceClick(item));
        });
    }

    handleServiceHover(item, isEntering) {
        const serviceInfo = item.querySelector('.service-info');
        const servicePrice = item.querySelector('.service-price');

        if (isEntering) {
            item.style.background = 'rgba(255, 255, 255, 0.95)';
            item.style.borderColor = 'rgba(255, 140, 0, 0.3)';
            item.style.transform = 'translateX(12px) translateY(-2px)';
            item.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.15)';
            
            if (servicePrice) {
                servicePrice.style.transform = 'scale(1.05)';
                servicePrice.style.color = 'var(--hermes-orange)';
            }
        } else {
            item.style.background = '';
            item.style.borderColor = '';
            item.style.transform = '';
            item.style.boxShadow = '';
            
            if (servicePrice) {
                servicePrice.style.transform = '';
                servicePrice.style.color = '';
            }
        }
    }

    handleServiceClick(item) {
        // Add click feedback
        item.style.transform = 'translateX(8px) translateY(-1px) scale(0.98)';
        
        setTimeout(() => {
            item.style.transform = '';
        }, 150);

        // Add ripple effect
        this.addServiceRipple(item);
    }

    addServiceRipple(item) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: serviceRipple 0.8s ease-out;
            pointer-events: none;
            z-index: 5;
        `;

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }
}

// Floating Elements Manager
class FloatingElementsManager {
    constructor() {
        this.floatingElements = [];
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.startFloatingAnimation();
    }

    createFloatingElements() {
        const containers = document.querySelectorAll('.services-ambient-background, .services-cta-ambient');
        
        containers.forEach(container => {
            // Add subtle floating elements
            for (let i = 0; i < 3; i++) {
                const element = document.createElement('div');
                element.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: var(--hermes-orange);
                    border-radius: 50%;
                    opacity: 0.1;
                    animation: gentleFloat ${15 + i * 2}s ease-in-out infinite;
                    animation-delay: -${i * 3}s;
                    top: ${20 + i * 30}%;
                    left: ${15 + i * 25}%;
                `;
                
                container.appendChild(element);
                this.floatingElements.push(element);
            }
        });
    }

    startFloatingAnimation() {
        // Add CSS animation keyframes if not already added
        if (!document.querySelector('#floating-animations')) {
            const style = document.createElement('style');
            style.id = 'floating-animations';
            style.textContent = `
                @keyframes gentleFloat {
                    0%, 100% { transform: translate(0, 0); opacity: 0.1; }
                    25% { transform: translate(10px, -15px); opacity: 0.3; }
                    50% { transform: translate(-8px, -20px); opacity: 0.1; }
                    75% { transform: translate(12px, -5px); opacity: 0.2; }
                }

                @keyframes luxuryRipple {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }

                @keyframes serviceRipple {
                    0% { width: 0; height: 0; opacity: 1; }
                    100% { width: 100px; height: 100px; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const servicesManager = new ServicesPageManager();
    const serviceItemManager = new ServiceItemManager();
    const floatingElementsManager = new FloatingElementsManager();

    // Add global enhancements
    addGlobalEnhancements();

    console.log('✨ Services Page - All Systems Active');
});

// Global enhancements
function addGlobalEnhancements() {
    // Add smooth hover transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .category-card, .service-item, a');
    
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Add focus management for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add scroll-based header transparency
    let ticking = false;
    
    function updateHeader() {
        const header = document.querySelector('.luxury-floating-header');
        if (header) {
            const scrolled = window.scrollY;
            const opacity = Math.min(0.95, 0.7 + (scrolled / 300) * 0.25);
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Performance monitoring
    if (window.performance && window.performance.mark) {
        performance.mark('services-page-interactive');
        
        // Log performance metrics after page is fully interactive
        setTimeout(() => {
            const perfData = performance.getEntriesByType('measure');
            console.log('🔥 Services Page Performance:', perfData);
        }, 2000);
    }
}

// Export for potential external use
if (typeof window !== 'undefined') {
    window.ServicesPageManager = ServicesPageManager;
    window.ServiceItemManager = ServiceItemManager;
    window.FloatingElementsManager = FloatingElementsManager;
});
        const numValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        if (!numValue) return;

        let current = 0;
        const increment = Math.ceil(numValue / 30);
        const duration = 1000;
        const stepTime = duration / 30;

        element.textContent = isPrice ? '$0' : '0';

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                current = numValue;
                clearInterval(timer);
            }
            
            element.textContent = isPrice ? `${current}` : current;
        }, stepTime);
    }

    setupIntersectionObservers() {
        // Observe category cards for scroll animations
        const categoryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    this.animateCategoryEntrance(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        this.categoryCards.forEach(card => {
            categoryObserver.observe(card);
        });

        // Observe CTA section for final animations
        const ctaSection = document.querySelector('.services-cta-section');
        if (ctaSection) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCtaEntrance(entry.target);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '100px'
            });

            ctaObserver.observe(ctaSection);
        }
    }

    animateCategoryEntrance(card) {
        const elements = card.querySelectorAll('.category-image-container, .category-content, .category-badges span');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Add subtle glow effect
        setTimeout(() => {
            card.style.boxShadow = '0 15px 35px rgba(255, 140, 0, 0.08)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        }, 500);
    }

    animateCtaEntrance(ctaSection) {
        const elements = ctaSection.querySelectorAll('.cta-badge, .cta-title, .cta-subtitle, .cta-actions, .consultation-reminder');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// Enhanced Service Item Interactions
class ServiceItemManager {
    constructor() {
        this.serviceItems = [];
        this.init();
    }

    init() {
        this.serviceItems = document.querySelectorAll('.service-item');
        this.bindEvents();
    }

    bindEvents() {
        this.serviceItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.handleServiceHover(item, true));
            item.addEventListener('mouseleave', () => this.handleServiceHover(item, false));
            item.addEventListener('click', () => this.handleServiceClick(item));
        });
    }

    handleServiceHover(item, isEntering) {
        const serviceInfo = item.querySelector('.service-info');
        const servicePrice = item.querySelector('.service-price');

        if (isEntering) {
            item.style.background = 'rgba(255, 255, 255, 0.95)';
            item.style.borderColor = 'rgba(255, 140, 0, 0.3)';
            item.style.transform = 'translateX(12px) translateY(-2px)';
            item.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.15)';
            
            if (servicePrice) {
                servicePrice.style.transform = 'scale(1.05)';
                servicePrice.style.color = 'var(--hermes-orange)';
            }
        } else {
            item.style.background = '';
            item.style.borderColor = '';
            item.style.transform = '';
            item.style.boxShadow = '';
            
            if (servicePrice) {
                servicePrice.style.transform = '';
                servicePrice.style.color = '';
            }
        }
    }

    handleServiceClick(item) {
        // Add click feedback
        item.style.transform = 'translateX(8px) translateY(-1px) scale(0.98)';
        
        setTimeout(() => {
            item.style.transform = '';
        }, 150);

        // Add ripple effect
        this.addServiceRipple(item);
    }

    addServiceRipple(item) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: serviceRipple 0.8s ease-out;
            pointer-events: none;
            z-index: 5;
        `;

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const servicesManager = new ServicesPageManager();
    const serviceItemManager = new ServiceItemManager();

    // Add global enhancements
    addGlobalEnhancements();

    console.log('✨ Services Page - All Systems Active');
});

// Global enhancements
function addGlobalEnhancements() {
    // Add smooth hover transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .category-card, .service-item, a');
    
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Add focus management for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add scroll-based header transparency
    let ticking = false;
    
    function updateHeader() {
        const header = document.querySelector('.luxury-floating-header');
        if (header) {
            const scrolled = window.scrollY;
            const opacity = Math.min(0.95, 0.7 + (scrolled / 300) * 0.25);
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Performance monitoring
    if (window.performance && window.performance.mark) {
        performance.mark('services-page-interactive');
        
        // Log performance metrics after page is fully interactive
        setTimeout(() => {
            const perfData = performance.getEntriesByType('measure');
            console.log('🔥 Services Page Performance:', perfData);
        }, 2000);
    }

    // Add CSS animations if not already added
    if (!document.querySelector('#services-animations')) {
        const style = document.createElement('style');
        style.id = 'services-animations';
        style.textContent = `
            @keyframes luxuryRipple {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }

            @keyframes serviceRipple {
                0% { width: 0; height: 0; opacity: 1; }
                100% { width: 100px; height: 100px; opacity: 0; }
            }

            .keyboard-navigation *:focus {
                outline: 3px solid var(--hermes-orange);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for potential external use
if (typeof window !== 'undefined') {
    window.ServicesPageManager = ServicesPageManager;
    window.ServiceItemManager = ServiceItemManager;
}

    handleCategoryHover(card, isEntering) {
        if (this.isTransitioning) return;

        const cornerOrnaments = card.querySelectorAll('.corner-ornament');
        const categoryNumber = card.querySelector('.category-number');
        const categoryBadges = card.querySelectorAll('.category-badges span');

        if (isEntering) {
            // Add luxury hover effects
            this.addRippleEffect(card);
            
            // Animate corner ornaments
            cornerOrnaments.forEach((ornament, index) => {
                setTimeout(() => {
                    ornament.style.opacity = '0.8';
                    ornament.style.transform = 'scale(1.1)';
                }, index * 50);
            });

            // Animate number badge
            if (categoryNumber) {
                categoryNumber.style.transform = 'scale(1.1) rotate(5deg)';
                categoryNumber.style.boxShadow = '0 10px 25px rgba(255, 140, 0, 0.3)';
            }

            // Animate category badges
            categoryBadges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'translateY(-2px) scale(1.05)';
                }, index * 100);
            });

        } else {
            // Reset hover effects
            cornerOrnaments.forEach(ornament => {
                ornament.style.opacity = '';
                ornament.style.transform = '';
            });

            if (categoryNumber) {
                categoryNumber.style.transform = '';
                categoryNumber.style.boxShadow = '';
            }

            categoryBadges.forEach(badge => {
                badge.style.transform = '';
            });
        }
    }

    handleCategoryClick(card) {
        if (this.isTransitioning) return;

        // Add click animation
        this.addClickAnimation(card);
        
        // Get category data
        const category = card.getAttribute('data-category');
        
        // Show service details after animation
        setTimeout(() => {
            this.showServiceDetails(category);
        }, 200);
    }

    handleCategoryExpand(btn) {
        if (this.isTransitioning) return;

        const category = btn.getAttribute('data-category');
        const icon = btn.querySelector('i');
        
        // Animate button
        btn.style.transform = 'translateY(-2px) scale(0.98)';
        icon.style.transform = 'translateY(4px) rotate(180deg)';
        
        setTimeout(() => {
            btn.style.transform = '';
            icon.style.transform = '';
            this.showServiceDetails(category);
        }, 200);
    }

    showServiceDetails(category) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Hide any active panels first
        if (this.activeCategory && this.activeCategory !== category) {
            this.hideServiceDetails(false);
        }

        const detailsPanel = document.getElementById(`${category}-details`);
        if (!detailsPanel) {
            this.isTransitioning = false;
            return;
        }

        // Show panel
        detailsPanel.style.display = 'block';
        
        // Smooth scroll to panel
        detailsPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Animate panel appearance
        setTimeout(() => {
            detailsPanel.classList.add('active');
            this.activeCategory = category;
            
            // Animate service items
            const serviceItems = detailsPanel.querySelectorAll('.service-item');
            serviceItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.6s ease-out';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                }, index * 100);
            });

            this.isTransitioning = false;
        }, 100);
    }

    hideServiceDetails(animate = true) {
        if (!this.activeCategory) return;

        const detailsPanel = document.getElementById(`${this.activeCategory}-details`);
        if (!detailsPanel) return;

        if (animate) {
            // Animate out
            detailsPanel.style.opacity = '0';
            detailsPanel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                detailsPanel.classList.remove('active');
                detailsPanel.style.display = 'none';
                detailsPanel.style.opacity = '';
                detailsPanel.style.transform = '';
                this.activeCategory = null;
            }, 300);
        } else {
            detailsPanel.classList.remove('active');
            detailsPanel.style.display = 'none';
            this.activeCategory = null;
        }
    }

    handleCtaHover(btn, isEntering) {
        const shimmer = btn.querySelector('.cta-shimmer');
        
        if (isEntering) {
            // Trigger shimmer effect
            if (shimmer) {
                shimmer.style.transition = 'all 0.8s ease';
                shimmer.style.left = '100%';
            }
            
            // Add glow effect
            btn.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.4)';
        } else {
            // Reset shimmer
            if (shimmer) {
                setTimeout(() => {
                    shimmer.style.transition = 'none';
                    shimmer.style.left = '-100%';
                }, 800);
            }
        }
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: luxuryRipple 1s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }

    addClickAnimation(element) {
        element.style.transform = 'translateY(-2px) scale(0.98)';
        element.style.transition = 'all 0.2s ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }

    addConsultationGlow() {
        if (this.consultationNotice) {
            this.consultationNotice.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.15)';
            this.consultationNotice.style.borderColor = 'rgba(255, 140, 0, 0.3)';
        }
    }

    removeConsultationGlow() {
        if (this.consultationNotice) {
            this.consultationNotice.style.boxShadow = '';
            this.consultationNotice.style.borderColor = '';
        }
    }

    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Add highlight effect to target
                    target.style.transition = 'all 0.3s ease';
                    target.style.transform = 'scale(1.02)';
                    target.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.1)';
                    
                    setTimeout(() => {
                        target.style.transform = '';
                        target.style.boxShadow = '';
                    }, 1000);
                }
            });
        });
    }

    initAnimations() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50
            });
        }

        // Add entrance animations to hero elements
        this.animateHeroEntrance();
        
        // Add particle animations
        this.animateParticles();
    }

    animateHeroEntrance() {
        if (!this.heroContent) return;

        const elements = this.heroContent.querySelectorAll('.services-hero-badge, .services-hero-title, .services-hero-subtitle, .consultation-notice');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateParticles() {
        this.heroParticles.forEach((particle, index) => {
            const delay = index * 2000;
            const duration = 15000 + (index * 1000);
            
            particle.style.animationDelay = `-${delay}ms`;
            particle.style.animationDuration = `${duration}ms`;
        });
    }

    setupIntersectionObservers() {
        // Observe category cards for scroll animations
        const categoryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    this.animateCategoryEntrance(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        this.categoryCards.forEach(card => {
            categoryObserver.observe(card);
        });

        // Observe CTA section for final animations
        const ctaSection = document.querySelector('.services-cta-section');
        if (ctaSection) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCtaEntrance(entry.target);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '100px'
            });

            ctaObserver.observe(ctaSection);
        }
    }

    animateCategoryEntrance(card) {
        const elements = card.querySelectorAll('.category-image-container, .category-content, .category-badges span');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Add subtle glow effect
        setTimeout(() => {
            card.style.boxShadow = '0 15px 35px rgba(255, 140, 0, 0.08)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        }, 500);
    }

    animateCtaEntrance(ctaSection) {
        const elements = ctaSection.querySelectorAll('.cta-badge, .cta-title, .cta-subtitle, .cta-actions, .consultation-reminder');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// Enhanced Service Item Interactions
class ServiceItemManager {
    constructor() {
        this.serviceItems = [];
        this.init();
    }

    init() {
        this.serviceItems = document.querySelectorAll('.service-item');
        this.bindEvents();
    }

    bindEvents() {
        this.serviceItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.handleServiceHover(item, true));
            item.addEventListener('mouseleave', () => this.handleServiceHover(item, false));
            item.addEventListener('click', () => this.handleServiceClick(item));
        });
    }

    handleServiceHover(item, isEntering) {
        const serviceInfo = item.querySelector('.service-info');
        const servicePrice = item.querySelector('.service-price');

        if (isEntering) {
            item.style.background = 'rgba(255, 255, 255, 0.95)';
            item.style.borderColor = 'rgba(255, 140, 0, 0.3)';
            item.style.transform = 'translateX(12px) translateY(-2px)';
            item.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.15)';
            
            if (servicePrice) {
                servicePrice.style.transform = 'scale(1.05)';
                servicePrice.style.color = 'var(--hermes-orange)';
            }
        } else {
            item.style.background = '';
            item.style.borderColor = '';
            item.style.transform = '';
            item.style.boxShadow = '';
            
            if (servicePrice) {
                servicePrice.style.transform = '';
                servicePrice.style.color = '';
            }
        }
    }

    handleServiceClick(item) {
        // Add click feedback
        item.style.transform = 'translateX(8px) translateY(-1px) scale(0.98)';
        
        setTimeout(() => {
            item.style.transform = '';
        }, 150);

        // Add ripple effect
        this.addServiceRipple(item);
    }

    addServiceRipple(item) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: serviceRipple 0.8s ease-out;
            pointer-events: none;
            z-index: 5;
        `;

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }
}

// Floating Elements Manager
class FloatingElementsManager {
    constructor() {
        this.floatingElements = [];
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.startFloatingAnimation();
    }

    createFloatingElements() {
        const containers = document.querySelectorAll('.services-ambient-background, .services-cta-ambient');
        
        containers.forEach(container => {
            // Add subtle floating elements
            for (let i = 0; i < 3; i++) {
                const element = document.createElement('div');
                element.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: var(--hermes-orange);
                    border-radius: 50%;
                    opacity: 0.1;
                    animation: gentleFloat ${15 + i * 2}s ease-in-out infinite;
                    animation-delay: -${i * 3}s;
                    top: ${20 + i * 30}%;
                    left: ${15 + i * 25}%;
                `;
                
                container.appendChild(element);
                this.floatingElements.push(element);
            }
        });
    }

    startFloatingAnimation() {
        // Add CSS animation keyframes if not already added
        if (!document.querySelector('#floating-animations')) {
            const style = document.createElement('style');
            style.id = 'floating-animations';
            style.textContent = `
                @keyframes gentleFloat {
                    0%, 100% { transform: translate(0, 0); opacity: 0.1; }
                    25% { transform: translate(10px, -15px); opacity: 0.3; }
                    50% { transform: translate(-8px, -20px); opacity: 0.1; }
                    75% { transform: translate(12px, -5px); opacity: 0.2; }
                }

                @keyframes luxuryRipple {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }

                @keyframes serviceRipple {
                    0% { width: 0; height: 0; opacity: 1; }
                    100% { width: 100px; height: 100px; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const servicesManager = new ServicesPageManager();
    const serviceItemManager = new ServiceItemManager();
    const floatingElementsManager = new FloatingElementsManager();

    // Add global enhancements
    addGlobalEnhancements();

    console.log('✨ Services Page - All Systems Active');
});

// Global enhancements
function addGlobalEnhancements() {
    // Add smooth hover transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .category-card, .service-item, a');
    
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Add focus management for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add scroll-based header transparency
    let ticking = false;
    
    function updateHeader() {
        const header = document.querySelector('.luxury-floating-header');
        if (header) {
            const scrolled = window.scrollY;
            const opacity = Math.min(0.95, 0.7 + (scrolled / 300) * 0.25);
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Performance monitoring
    if (window.performance && window.performance.mark) {
        performance.mark('services-page-interactive');
        
        // Log performance metrics after page is fully interactive
        setTimeout(() => {
            const perfData = performance.getEntriesByType('measure');
            console.log('🔥 Services Page Performance:', perfData);
        }, 2000);
    }
}

// Export for potential external use
if (typeof window !== 'undefined') {
    window.ServicesPageManager = ServicesPageManager;
    window.ServiceItemManager = ServiceItemManager;
    window.FloatingElementsManager = FloatingElementsManager;
}
