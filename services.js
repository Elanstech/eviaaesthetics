/* ========================================
   SERVICES PAGE - ENHANCED INTERACTIVE FUNCTIONALITY
   Optimized for Video Loading & Extended Hero Experience
   ======================================== */

class ServicesPageManager {
    constructor() {
        this.activeCategory = null;
        this.isTransitioning = false;
        this.categoryCards = [];
        this.detailsPanels = [];
        this.videos = [];
        this.videoLoadedCount = 0;
        this.totalVideos = 0;
        this.heroLoaded = false;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupVideoPreloading();
        this.bindEvents();
        this.initAnimations();
        this.setupIntersectionObservers();
        this.initVideoBackground();
        this.setupPanelCloseButtons();
        
        console.log('🏛️ Services Page - Enhanced Luxury Experience Activated');
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
        this.videoPanels = document.querySelectorAll('.video-panel');
        this.videoLoadingIndicators = document.querySelectorAll('.video-loading-indicator');
        
        // CTA elements
        this.ctaBtns = document.querySelectorAll('.primary-cta-btn, .secondary-cta-btn');
        
        // Close buttons
        this.panelCloseBtns = document.querySelectorAll('.panel-close-btn');
    }

    setupVideoPreloading() {
        this.totalVideos = this.videos.length;
        this.videoLoadedCount = 0;

        // Optimize video loading with intersection observer
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    videoObserver.unobserve(video);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        // Observe all videos
        this.videos.forEach(video => {
            video.setAttribute('data-loaded', 'false');
            videoObserver.observe(video);
        });
    }

    loadVideo(video) {
        const videoPanel = video.closest('.video-panel');
        const loadingIndicator = videoPanel?.querySelector('.video-loading-indicator');
        
        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '1';
        }

        video.addEventListener('loadeddata', () => {
            this.handleVideoLoaded(video, videoPanel, loadingIndicator);
        }, { once: true });

        video.addEventListener('canplaythrough', () => {
            this.handleVideoCanPlay(video, videoPanel, loadingIndicator);
        }, { once: true });

        video.addEventListener('error', () => {
            this.handleVideoError(video, videoPanel, loadingIndicator);
        }, { once: true });

        // Force load the video
        video.load();
    }

    handleVideoLoaded(video, videoPanel, loadingIndicator) {
        video.setAttribute('data-loaded', 'true');
        
        if (videoPanel) {
            videoPanel.classList.add('loaded');
        }
        
        // Hide loading indicator with delay
        if (loadingIndicator) {
            setTimeout(() => {
                loadingIndicator.style.opacity = '0';
            }, 500);
        }

        this.videoLoadedCount++;
        this.checkAllVideosLoaded();
    }

    handleVideoCanPlay(video, videoPanel, loadingIndicator) {
        // Start playing the video
        video.play().catch(e => {
            console.log('Video autoplay prevented:', e);
            // Add play button overlay if autoplay fails
            this.addPlayButton(video, videoPanel);
        });
        
        // Add entrance animation
        setTimeout(() => {
            video.style.transition = 'opacity 1s ease';
            video.style.opacity = '1';
        }, this.videoLoadedCount * 300);
    }

    handleVideoError(video, videoPanel, loadingIndicator) {
        console.warn('Video failed to load:', video.src);
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
        }
        
        // Show fallback image
        const fallbackImg = video.nextElementSibling;
        if (fallbackImg && fallbackImg.classList.contains('video-fallback')) {
            fallbackImg.style.display = 'block';
            fallbackImg.style.opacity = '1';
        }
        
        this.videoLoadedCount++;
        this.checkAllVideosLoaded();
    }

    addPlayButton(video, videoPanel) {
        const playBtn = document.createElement('div');
        playBtn.className = 'video-play-button';
        playBtn.innerHTML = '<i class="ri-play-fill"></i>';
        playBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: rgba(255, 140, 0, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 5;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        playBtn.addEventListener('click', () => {
            video.play();
            playBtn.remove();
        });

        videoPanel.appendChild(playBtn);
    }

    checkAllVideosLoaded() {
        if (this.videoLoadedCount >= this.totalVideos && !this.heroLoaded) {
            this.heroLoaded = true;
            this.heroContent.classList.add('loaded');
            this.initHeroAnimations();
        }
    }

    initVideoBackground() {
        // Enhanced video setup
        this.videos.forEach((video, index) => {
            video.muted = true;
            video.playsInline = true;
            video.loop = true;
            video.style.opacity = '0';
            
            // Set loading attribute for better UX
            video.setAttribute('loading', 'lazy');
            
            // Add video quality optimization
            video.addEventListener('loadstart', () => {
                console.log(`Loading video ${index + 1}/${this.totalVideos}`);
            });
        });

        // Handle responsive video switching
        this.handleResponsiveVideo();
        
        // Handle video playback states
        this.handleVideoPlayback();
        
        // Add video hover effects
        this.addVideoHoverEffects();
    }

    addVideoHoverEffects() {
        this.videoPanels.forEach(panel => {
            const video = panel.querySelector('video');
            
            panel.addEventListener('mouseenter', () => {
                if (video && video.paused) {
                    video.play().catch(e => console.log('Hover play failed:', e));
                }
                
                // Add hover glow effect
                panel.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.2)';
                panel.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            panel.addEventListener('mouseleave', () => {
                // Reset hover effects
                panel.style.boxShadow = '';
                panel.style.transform = '';
            });
        });
    }

    handleResponsiveVideo() {
        const mobileBreakpoint = 768;
        const desktopLayout = document.querySelector('.desktop-video-layout');
        const mobileLayout = document.querySelector('.mobile-video-layout');
        
        const checkVideoLayout = () => {
            if (window.innerWidth <= mobileBreakpoint) {
                if (desktopLayout) desktopLayout.style.display = 'none';
                if (mobileLayout) mobileLayout.style.display = 'flex';
            } else {
                if (desktopLayout) desktopLayout.style.display = 'flex';
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
                } else if (video.getAttribute('data-loaded') === 'true') {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            });
        });

        // Handle video buffering
        this.videos.forEach(video => {
            video.addEventListener('waiting', () => {
                const panel = video.closest('.video-panel');
                const indicator = panel?.querySelector('.video-loading-indicator');
                if (indicator) {
                    indicator.style.opacity = '0.5';
                }
            });

            video.addEventListener('playing', () => {
                const panel = video.closest('.video-panel');
                const indicator = panel?.querySelector('.video-loading-indicator');
                if (indicator) {
                    indicator.style.opacity = '0';
                }
            });
        });
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
            
            // Add enhanced hover effects
            btn.addEventListener('mouseenter', () => this.enhanceButtonHover(btn, true));
            btn.addEventListener('mouseleave', () => this.enhanceButtonHover(btn, false));
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

        // Enhanced quick stats interactions
        this.quickStats.forEach(stat => {
            stat.addEventListener('mouseenter', () => this.animateStatHover(stat, true));
            stat.addEventListener('mouseleave', () => this.animateStatHover(stat, false));
            stat.addEventListener('click', () => this.handleStatClick(stat));
        });

        // Enhanced scroll indicator interaction
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.scrollToServices();
            });
            
            this.scrollIndicator.addEventListener('mouseenter', () => {
                this.scrollIndicator.style.transform = 'translateX(-50%) translateY(-8px) scale(1.05)';
            });
            
            this.scrollIndicator.addEventListener('mouseleave', () => {
                this.scrollIndicator.style.transform = '';
            });
        }

        // CTA button interactions
        this.ctaBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => this.handleCtaHover(btn, true));
            btn.addEventListener('mouseleave', () => this.handleCtaHover(btn, false));
        });

        // Smooth scroll for anchor links
        this.setupSmoothScrolling();
    }

    setupPanelCloseButtons() {
        this.panelCloseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const panelId = btn.getAttribute('data-panel');
                const panel = document.getElementById(panelId);
                
                if (panel) {
                    // Add close animation
                    btn.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        btn.style.transform = '';
                        this.hideServiceDetails();
                    }, 150);
                }
            });
            
            // Add hover effects to close buttons
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.05)';
                btn.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.2)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
        });
    }

    enhanceButtonHover(btn, isEntering) {
        const btnGlow = btn.querySelector('.btn-glow');
        const btnIcon = btn.querySelector('.btn-icon');
        const btnDetails = btn.querySelector('.btn-details');

        if (isEntering) {
            // Add pulsing glow effect
            if (btnGlow) {
                btnGlow.style.opacity = '0.2';
            }
            
            // Animate icon
            if (btnIcon) {
                btnIcon.style.transform = 'translateY(-2px) scale(1.1)';
                btnIcon.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.3)';
            }
            
            // Highlight details
            if (btnDetails) {
                btnDetails.style.opacity = '1';
                btnDetails.style.transform = 'translateX(2px)';
            }
            
            // Add subtle shake animation
            btn.style.animation = 'buttonPulse 2s ease-in-out infinite';
            
        } else {
            // Reset effects
            if (btnGlow) {
                btnGlow.style.opacity = '';
            }
            
            if (btnIcon) {
                btnIcon.style.transform = '';
                btnIcon.style.boxShadow = '';
            }
            
            if (btnDetails) {
                btnDetails.style.opacity = '';
                btnDetails.style.transform = '';
            }
            
            btn.style.animation = '';
        }
    }

    handleStatClick(stat) {
        const statType = stat.getAttribute('data-stat');
        
        // Add click animation
        stat.style.transform = 'translateY(-4px) scale(0.95)';
        
        setTimeout(() => {
            stat.style.transform = '';
            
            // Scroll to relevant section based on stat type
            if (statType === 'services' || statType === 'categories') {
                this.scrollToServices();
            } else if (statType === 'starting') {
                // Scroll to most affordable service
                const botoxCard = document.querySelector('[data-category="botox-fillers"]');
                if (botoxCard) {
                    botoxCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.addHighlightEffect(botoxCard);
                }
            }
        }, 200);

        // Add ripple effect
        this.addRippleEffect(stat);
    }

    addHighlightEffect(element) {
        element.style.transition = 'all 0.6s ease';
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.3)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
        }, 2000);
    }

    initHeroAnimations() {
        if (!this.heroContent) return;

        // Hero content entrance
        this.heroContent.style.transition = 'all 1s ease-out';
        this.heroContent.style.opacity = '1';
        
        // Animate elements in sequence
        const elements = [
            this.heroContent.querySelector('.services-hero-badge'),
            this.heroContent.querySelector('.services-hero-title'),
            this.heroContent.querySelector('.services-hero-subtitle'),
            this.heroContent.querySelector('.services-quick-stats'),
            this.heroContent.querySelector('.services-navigation-guide'),
            this.heroContent.querySelector('.consultation-notice')
        ].filter(Boolean);

        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });

        // Animate quick stats numbers
        setTimeout(() => {
            this.animateStatsNumbers();
        }, 1500);
    }

    animateStatsNumbers() {
        this.quickStats.forEach((stat, index) => {
            const number = stat.querySelector('.stat-number');
            if (number) {
                setTimeout(() => {
                    this.animateNumber(number);
                }, index * 300);
            }
        });
    }

    animateNumber(element) {
        const finalText = element.textContent;
        const isPrice = finalText.includes('$');
        const numValue = parseInt(finalText.replace(/[^\d]/g, ''));
        
        if (!numValue) return;

        let current = 0;
        const increment = Math.ceil(numValue / 40);
        const duration = 1200;
        const stepTime = duration / 40;

        element.textContent = isPrice ? '$0' : '0';

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                current = numValue;
                clearInterval(timer);
            }
            
            element.textContent = isPrice ? `$${current}` : current;
            
            // Add subtle glow during animation
            element.style.textShadow = '0 0 20px rgba(255, 140, 0, 0.5)';
        }, stepTime);

        // Remove glow after animation
        setTimeout(() => {
            element.style.textShadow = '';
        }, duration + 500);
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
        
        // Track consultation button clicks
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
            stat.style.transform = 'translateY(-12px)';
            if (number) {
                number.style.transform = 'scale(1.15)';
                number.style.textShadow = '0 5px 15px rgba(255, 140, 0, 0.4)';
            }
            if (label) {
                label.style.color = 'var(--text-primary)';
                label.style.transform = 'translateY(-2px)';
            }
        } else {
            stat.style.transform = '';
            if (number) {
                number.style.transform = '';
                number.style.textShadow = '';
            }
            if (label) {
                label.style.color = '';
                label.style.transform = '';
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
        const expandBtn = card.querySelector('.category-expand-btn');

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

            // Enhance expand button
            if (expandBtn) {
                expandBtn.style.animation = 'buttonPulse 1.5s ease-in-out infinite';
            }

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

            if (expandBtn) {
                expandBtn.style.animation = '';
            }
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
        const icon = btn.querySelector('.btn-icon i');
        
        // Enhanced button animation
        btn.style.transform = 'translateY(-2px) scale(0.98)';
        if (icon) {
            icon.style.transform = 'translateY(4px) rotate(180deg)';
        }
        
        // Add loading state
        btn.style.opacity = '0.8';
        btn.style.cursor = 'wait';
        
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.opacity = '';
            btn.style.cursor = '';
            if (icon) {
                icon.style.transform = '';
            }
            this.showServiceDetails(category);
        }, 300);
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

        // Show panel with enhanced animation
        detailsPanel.style.display = 'block';
        
        // Smooth scroll to panel with offset
        setTimeout(() => {
            const yOffset = -100;
            const y = detailsPanel.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }, 100);

        // Enhanced panel appearance animation
        setTimeout(() => {
            detailsPanel.classList.add('active');
            this.activeCategory = category;
            
            // Animate details badge
            const badge = detailsPanel.querySelector('.details-badge');
            if (badge) {
                badge.style.transform = 'translateY(-10px) scale(1.05)';
                setTimeout(() => {
                    badge.style.transform = '';
                }, 500);
            }
            
            // Animate service items with stagger
            const serviceItems = detailsPanel.querySelectorAll('.service-item.enhanced');
            serviceItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-30px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                }, index * 150);
            });

            // Animate treatment guides
            const guides = detailsPanel.querySelectorAll('.guide-section');
            guides.forEach((guide, index) => {
                setTimeout(() => {
                    guide.style.opacity = '0';
                    guide.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        guide.style.transition = 'all 0.6s ease-out';
                        guide.style.opacity = '1';
                        guide.style.transform = 'translateY(0)';
                    });
                }, serviceItems.length * 150 + index * 200);
            });

            this.isTransitioning = false;
        }, 200);
    }

    hideServiceDetails(animate = true) {
        if (!this.activeCategory) return;

        const detailsPanel = document.getElementById(`${this.activeCategory}-details`);
        if (!detailsPanel) return;

        if (animate) {
            // Enhanced exit animation
            detailsPanel.style.opacity = '0';
            detailsPanel.style.transform = 'translateY(20px) scale(0.98)';
            
            setTimeout(() => {
                detailsPanel.classList.remove('active');
                detailsPanel.style.display = 'none';
                detailsPanel.style.opacity = '';
                detailsPanel.style.transform = '';
                this.activeCategory = null;
            }, 400);
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
            
            // Enhanced glow effect
            btn.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.4)';
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        } else {
            // Reset shimmer
            if (shimmer) {
                setTimeout(() => {
                    shimmer.style.transition = 'none';
                    shimmer.style.left = '-100%';
                }, 800);
            }
            
            btn.style.transform = '';
        }
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, transparent 70%);
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: luxuryRipple 1.2s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1200);
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
                    this.addHighlightEffect(target);
                }
            });
        });
    }

    initAnimations() {
        // Initialize AOS with enhanced settings
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                disable: 'mobile' // Disable on mobile for better performance
            });
        }

        // Add CSS animations
        this.addCustomAnimations();
    }

    addCustomAnimations() {
        if (!document.querySelector('#services-enhanced-animations')) {
            const style = document.createElement('style');
            style.id = 'services-enhanced-animations';
            style.textContent = `
                @keyframes luxuryRipple {
                    0% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(-50%, -50%) scale(2.5); 
                        opacity: 0; 
                    }
                }

                @keyframes buttonPulse {
                    0%, 100% { 
                        box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.4); 
                    }
                    50% { 
                        box-shadow: 0 0 0 8px rgba(255, 140, 0, 0); 
                    }
                }

                @keyframes serviceItemEntrance {
                    0% {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes heroContentFadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .keyboard-navigation *:focus {
                    outline: 3px solid var(--hermes-orange);
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupIntersectionObservers() {
        // Enhanced category cards observer
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

        // Enhanced CTA section observer
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

        // Video performance observer
        const videoPerformanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (entry.isIntersecting && video) {
                    // Ensure video plays when in view
                    if (video.getAttribute('data-loaded') === 'true' && video.paused) {
                        video.play().catch(e => console.log('Intersection play failed:', e));
                    }
                } else if (video) {
                    // Pause video when out of view for performance
                    video.pause();
                }
            });
        }, {
            threshold: 0.5
        });

        this.videoPanels.forEach(panel => {
            videoPerformanceObserver.observe(panel);
        });
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
        this.serviceItems = document.querySelectorAll('.service-item.enhanced');
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
        const serviceInfo = item.querySelector('.service-main-info');
        const servicePrice = item.querySelector('.service-price');
        const serviceBadges = item.querySelectorAll('.service-badges span');

        if (isEntering) {
            item.style.background = 'rgba(255, 255, 255, 0.95)';
            item.style.borderColor = 'rgba(255, 140, 0, 0.3)';
            item.style.transform = 'translateX(16px) translateY(-4px)';
            item.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.2)';
            
            if (servicePrice) {
                servicePrice.style.transform = 'scale(1.08)';
                servicePrice.style.textShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
            }

            // Animate service badges
            serviceBadges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'translateY(-2px) scale(1.05)';
                    badge.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.2)';
                }, index * 100);
            });
        } else {
            item.style.background = '';
            item.style.borderColor = '';
            item.style.transform = '';
            item.style.boxShadow = '';
            
            if (servicePrice) {
                servicePrice.style.transform = '';
                servicePrice.style.textShadow = '';
            }

            serviceBadges.forEach(badge => {
                badge.style.transform = '';
                badge.style.boxShadow = '';
            });
        }
    }

    handleServiceClick(item) {
        // Enhanced click feedback
        item.style.transform = 'translateX(12px) translateY(-2px) scale(0.97)';
        
        setTimeout(() => {
            item.style.transform = '';
        }, 200);

        // Add enhanced ripple effect
        this.addServiceRipple(item);
        
        // Optional: Trigger detailed information modal
        this.showServiceDetails(item);
    }

    showServiceDetails(item) {
        const serviceTitle = item.querySelector('h4').textContent;
        const serviceDescription = item.querySelector('p').textContent;
        
        // Create temporary detail overlay (can be enhanced further)
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid var(--hermes-orange);
            border-radius: 24px;
            padding: 32px;
            max-width: 500px;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <h4 style="color: var(--hermes-orange); margin-bottom: 16px;">${serviceTitle}</h4>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${serviceDescription}</p>
            <button onclick="this.parentElement.remove()" style="background: var(--hermes-orange); color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer;">Close</button>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        }, 5000);
    }

    addServiceRipple(item) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: serviceRipple 1s ease-out;
            pointer-events: none;
            z-index: 5;
        `;

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }
}

// Enhanced Floating Elements Manager
class FloatingElementsManager {
    constructor() {
        this.floatingElements = [];
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.startFloatingAnimation();
        this.addInteractiveParticles();
    }

    createFloatingElements() {
        const containers = document.querySelectorAll('.services-ambient-background, .services-cta-ambient');
        
        containers.forEach(container => {
            // Add subtle floating elements
            for (let i = 0; i < 5; i++) {
                const element = document.createElement('div');
                element.style.cssText = `
                    position: absolute;
                    width: ${2 + i}px;
                    height: ${2 + i}px;
                    background: var(--hermes-orange);
                    border-radius: 50%;
                    opacity: ${0.1 + i * 0.05};
                    animation: gentleFloat ${15 + i * 2}s ease-in-out infinite;
                    animation-delay: -${i * 3}s;
                    top: ${20 + i * 15}%;
                    left: ${15 + i * 20}%;
                `;
                
                container.appendChild(element);
                this.floatingElements.push(element);
            }
        });
    }

    addInteractiveParticles() {
        // Add particles that respond to mouse movement
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            this.updateParticlePositions(mouseX, mouseY);
        });
    }

    updateParticlePositions(mouseX, mouseY) {
        this.floatingElements.forEach((element, index) => {
            const speed = 0.1 + index * 0.02;
            const x = mouseX * 20 * speed;
            const y = mouseY * 15 * speed;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    startFloatingAnimation() {
        // Add CSS animation keyframes
        if (!document.querySelector('#floating-animations')) {
            const style = document.createElement('style');
            style.id = 'floating-animations';
            style.textContent = `
                @keyframes gentleFloat {
                    0%, 100% { 
                        transform: translate(0, 0) rotate(0deg); 
                        opacity: 0.1; 
                    }
                    25% { 
                        transform: translate(15px, -20px) rotate(90deg); 
                        opacity: 0.3; 
                    }
                    50% { 
                        transform: translate(-12px, -25px) rotate(180deg); 
                        opacity: 0.1; 
                    }
                    75% { 
                        transform: translate(18px, -8px) rotate(270deg); 
                        opacity: 0.2; 
                    }
                }

                @keyframes serviceRipple {
                    0% { 
                        width: 0; 
                        height: 0; 
                        opacity: 1; 
                    }
                    100% { 
                        width: 120px; 
                        height: 120px; 
                        opacity: 0; 
                    }
                }

                @keyframes particleFloat {
                    0%, 100% {
                        transform: translate(0, 0);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(30px, -40px);
                        opacity: 0.1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            videoLoadTime: 0,
            heroInteractiveTime: 0,
            categoryLoadTime: 0
        };
        
        this.init();
    }

    init() {
        if (window.performance) {
            performance.mark('services-page-start');
            this.monitorPerformance();
        }
    }

    monitorPerformance() {
        // Monitor video loading performance
        setTimeout(() => {
            performance.mark('videos-loaded');
            performance.measure('video-load-time', 'services-page-start', 'videos-loaded');
        }, 3000);

        // Monitor hero interactive time
        setTimeout(() => {
            performance.mark('hero-interactive');
            performance.measure('hero-interactive-time', 'services-page-start', 'hero-interactive');
        }, 1500);

        // Log performance data
        setTimeout(() => {
            const measures = performance.getEntriesByType('measure');
            measures.forEach(measure => {
                console.log(`📊 ${measure.name}: ${Math.round(measure.duration)}ms`);
            });
        }, 5000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const servicesManager = new ServicesPageManager();
    const serviceItemManager = new ServiceItemManager();
    const floatingElementsManager = new FloatingElementsManager();
    const performanceMonitor = new PerformanceMonitor();

    // Add global enhancements
    addGlobalEnhancements();

    console.log('✨ Services Page - All Enhanced Systems Active');
});

// Global enhancements
function addGlobalEnhancements() {
    // Add smooth hover transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .category-card, .service-item, a, .stat-item');
    
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Enhanced focus management for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Enhanced scroll-based header transparency
    let ticking = false;
    
    function updateHeader() {
        const header = document.querySelector('.luxury-floating-header');
        if (header) {
            const scrolled = window.scrollY;
            const opacity = Math.min(0.95, 0.7 + (scrolled / 300) * 0.25);
            const blur = Math.min(20, scrolled / 10);
            
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
            header.style.backdropFilter = `blur(${blur}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Enhanced error handling
    window.addEventListener('error', (e) => {
        console.warn('Services Page Error:', e.error);
        
        // Graceful degradation for video errors
        if (e.error && e.error.message && e.error.message.includes('video')) {
            console.log('Implementing video fallback...');
            // Additional fallback logic could go here
        }
    });

    // Page load performance tracking
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Remove any remaining loading states
            const loadingElements = document.querySelectorAll('.video-loading-indicator');
            loadingElements.forEach(el => {
                el.style.opacity = '0';
            });
            
            // Mark page as fully loaded
            document.body.classList.add('page-loaded');
            
            if (window.performance) {
                performance.mark('services-page-complete');
            }
        }, 1000);
    });

    // Enhanced mobile touch interactions
    if ('ontouchstart' in window) {
        // Add touch feedback for mobile devices
        const touchElements = document.querySelectorAll('.category-card, .service-item, .consultation-btn');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            }, { passive: true });
        });
    }

    // Memory management for long sessions
    let lastCleanup = Date.now();
    
    setInterval(() => {
        const now = Date.now();
        if (now - lastCleanup > 300000) { // 5 minutes
            // Clean up any orphaned elements
            const orphanedRipples = document.querySelectorAll('[style*="luxuryRipple"], [style*="serviceRipple"]');
            orphanedRipples.forEach(ripple => {
                if (ripple.parentElement) {
                    ripple.remove();
                }
            });
            
            lastCleanup = now;
        }
    }, 60000); // Check every minute

    // Enhanced accessibility features
    const accessibilityFeatures = {
        // High contrast mode detection
        checkHighContrast: () => {
            if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
                document.body.classList.add('high-contrast-mode');
            }
        },
        
        // Reduced motion preference
        checkReducedMotion: () => {
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.body.classList.add('reduced-motion');
                
                // Disable auto-playing videos
                const videos = document.querySelectorAll('video[autoplay]');
                videos.forEach(video => {
                    video.removeAttribute('autoplay');
                    video.pause();
                });
            }
        }
    };

    accessibilityFeatures.checkHighContrast();
    accessibilityFeatures.checkReducedMotion();

    // Service recommendation engine
    const serviceRecommendations = {
        init: () => {
            // Track user interactions for recommendations
            document.addEventListener('click', (e) => {
                const categoryCard = e.target.closest('.category-card');
                if (categoryCard) {
                    const category = categoryCard.getAttribute('data-category');
                    serviceRecommendations.trackInteraction(category);
                }
            });
        },
        
        trackInteraction: (category) => {
            // Simple interaction tracking (could be enhanced with analytics)
            const interactions = JSON.parse(localStorage.getItem('serviceInteractions') || '{}');
            interactions[category] = (interactions[category] || 0) + 1;
            localStorage.setItem('serviceInteractions', JSON.stringify(interactions));
        }
    };

    serviceRecommendations.init();
}

// Video Quality Manager
class VideoQualityManager {
    constructor() {
        this.connectionSpeed = 'unknown';
        this.init();
    }

    init() {
        this.detectConnectionSpeed();
        this.optimizeVideoQuality();
    }

    detectConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.connectionSpeed = connection.effectiveType;
            
            // Adjust video quality based on connection
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.setLowQualityMode();
            }
        }
    }

    setLowQualityMode() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Reduce video quality for slow connections
            video.setAttribute('preload', 'none');
            
            // Add lower quality source if available
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                if (source.src.includes('.mp4')) {
                    // Could add logic for lower quality versions
                    console.log('Low quality mode enabled for:', source.src);
                }
            });
        });
    }

    optimizeVideoQuality() {
        // Add video optimization based on device capabilities
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Optimize for mobile devices
            if (window.innerWidth <= 768) {
                video.setAttribute('preload', 'metadata');
            }
            
            // Add error recovery
            video.addEventListener('stalled', () => {
                console.log('Video stalled, attempting recovery...');
                setTimeout(() => {
                    video.load();
                }, 2000);
            });
        });
    }
}

// Enhanced UI Feedback Manager
class UIFeedbackManager {
    constructor() {
        this.feedbackQueue = [];
        this.init();
    }

    init() {
        this.setupGlobalFeedback();
        this.createFeedbackContainer();
    }

    createFeedbackContainer() {
        const container = document.createElement('div');
        container.id = 'ui-feedback-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            background: ${type === 'success' ? 'var(--hermes-orange)' : 'rgba(255, 255, 255, 0.95)'};
            color: ${type === 'success' ? 'white' : 'var(--text-primary)'};
            border: 1px solid rgba(255, 140, 0, 0.3);
            border-radius: 12px;
            padding: 12px 20px;
            margin-bottom: 8px;
            font-family: var(--font-inter);
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(20px);
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        feedback.textContent = message;
        feedback.addEventListener('click', () => feedback.remove());
        
        const container = document.getElementById('ui-feedback-container');
        container.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateX(100px)';
            setTimeout(() => feedback.remove(), 300);
        }, 4000);
    }

    setupGlobalFeedback() {
        // Add feedback for various interactions
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-category]');
            if (target) {
                const category = target.getAttribute('data-category');
                const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                this.showFeedback(`Loading ${categoryName} details...`, 'info');
            }
        });
    }
}

// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.activeAnimations = new Set();
        this.init();
    }

    init() {
        this.setupAnimationOptimization();
        this.addAdvancedTransitions();
    }

    setupAnimationOptimization() {
        // Use Intersection Observer for performance
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    element.classList.add('in-viewport');
                    this.enableAnimations(element);
                } else {
                    element.classList.remove('in-viewport');
                    this.disableAnimations(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.category-card, .service-item, .cta-badge');
        animatedElements.forEach(el => animationObserver.observe(el));
    }

    enableAnimations(element) {
        element.style.willChange = 'transform, opacity';
        this.activeAnimations.add(element);
    }

    disableAnimations(element) {
        element.style.willChange = 'auto';
        this.activeAnimations.delete(element);
    }

    addAdvancedTransitions() {
        // Add magnetic effect to interactive elements
        const magneticElements = document.querySelectorAll('.category-expand-btn, .consultation-btn, .primary-cta-btn');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
}

// Initialize enhanced systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core managers
    const servicesManager = new ServicesPageManager();
    const serviceItemManager = new ServiceItemManager();
    const floatingElementsManager = new FloatingElementsManager();
    const videoQualityManager = new VideoQualityManager();
    const uiFeedbackManager = new UIFeedbackManager();
    const animationController = new AnimationController();

    // Add global enhancements
    addGlobalEnhancements();

    console.log('🚀 Services Page - Enhanced Experience Fully Loaded');
});

// Export for potential external use
if (typeof window !== 'undefined') {
    window.ServicesPageManager = ServicesPageManager;
    window.ServiceItemManager = ServiceItemManager;
    window.FloatingElementsManager = FloatingElementsManager;
    window.VideoQualityManager = VideoQualityManager;
    window.UIFeedbackManager = UIFeedbackManager;
    window.AnimationController = AnimationController;
}
