/* ========================================
   SERVICES PAGE - ENHANCED LUXURY EXPERIENCE
   Synchronized Videos & Soft Med Spa Interactions
   ======================================== */

class ServicesPageManager {
    constructor() {
        this.videos = [];
        this.syncedVideos = [];
        this.videoLoadPromises = [];
        this.currentCategory = null;
        this.isModalOpen = false;
        this.animationQueue = [];
        
        this.serviceData = this.initServiceData();
        this.init();
    }

    init() {
        this.cacheElements();
        this.initVideoSynchronization();
        this.bindEvents();
        this.initSoftAnimations();
        this.setupResponsiveHandling();
        this.initAccessibility();
        
        console.log('✨ Services Page - Enhanced Experience Initialized');
    }

    cacheElements() {
        // Video elements
        this.videoContainer = document.querySelector('.video-collage-container');
        this.videoPanels = document.querySelectorAll('.video-panel');
        this.syncedVideos = document.querySelectorAll('[data-sync-group="hero"]');
        this.mobileVideo = document.querySelector('.mobile-video-layout video');
        
        // Hero elements
        this.heroContent = document.querySelector('.services-hero-content');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.statCards = document.querySelectorAll('.stat-card');
        this.consultationCard = document.querySelector('.consultation-card');
        
        // Category elements
        this.categoryCards = document.querySelectorAll('.category-card');
        this.exploreButtons = document.querySelectorAll('.explore-btn');
        
        // Modal elements
        this.modal = document.getElementById('serviceDetailsModal');
        this.modalBackdrop = document.getElementById('modalBackdrop');
        this.modalClose = document.getElementById('modalClose');
        this.modalContent = document.getElementById('modalContent');
        this.modalCategoryName = document.getElementById('modalCategoryName');
        
        // Sections
        this.categoriesSection = document.getElementById('serviceCategories');
    }

    initServiceData() {
        return {
            'botox-fillers': {
                title: 'Botox & Fillers',
                subtitle: 'Precision injectables for natural enhancement and therapeutic treatments',
                icon: 'ri-syringe-line',
                services: [
                    {
                        name: 'Botox (Neurotoxin Injectables)',
                        duration: '30 minutes',
                        results: '3-7 days',
                        price: '$16/unit',
                        typical: '$300-600',
                        description: 'FDA-approved neurotoxin for wrinkle reduction, prevention, and muscle relaxation. Ideal for forehead lines, crow\'s feet, and frown lines.',
                        features: [
                            'Immediate consultation included',
                            'Precision mapping techniques',
                            'Natural-looking results guaranteed',
                            'Multiple injection sites available'
                        ]
                    },
                    {
                        name: 'Dermal Fillers',
                        duration: '45 minutes',
                        results: 'Immediate',
                        price: '$800/syringe',
                        typical: '$800-2400',
                        description: 'Premium hyaluronic acid fillers for volume restoration, lip enhancement, and facial contouring using multiple premium brands.',
                        features: [
                            'Multiple premium brands available',
                            'Completely reversible treatments',
                            'Artistic enhancement approach',
                            'Immediate visible results'
                        ]
                    },
                    {
                        name: 'Hyperhidrosis - Hands',
                        duration: '60 minutes',
                        results: '1-2 weeks',
                        price: '$1,000/hand',
                        typical: 'Both hands: $2,000',
                        description: 'Specialized excessive sweating treatment for hands using targeted neurotoxin injections. Results typically last 6-12 months.',
                        features: [
                            'Long-lasting 6-12 month results',
                            'Minimal discomfort during treatment',
                            'Return to normal activities immediately',
                            'Life-changing confidence boost'
                        ]
                    },
                    {
                        name: 'Hyperhidrosis - Underarms',
                        duration: '45 minutes',
                        results: '1-2 weeks',
                        price: '$750/arm',
                        typical: 'Both arms: $1,500',
                        description: 'Most popular hyperhidrosis treatment with excellent patient satisfaction for underarm excessive sweating.',
                        features: [
                            '6-12 month treatment duration',
                            'Quick recovery process',
                            'Life-changing results',
                            'High patient satisfaction rate'
                        ]
                    },
                    {
                        name: 'Hyperhidrosis - Head/Scalp',
                        duration: '90 minutes',
                        results: '1-2 weeks',
                        price: '$2,000',
                        typical: 'Complete treatment',
                        description: 'Complex specialized treatment for excessive head and scalp sweating requiring expert technique and precision mapping.',
                        features: [
                            'Expert-level specialized procedure',
                            'Comprehensive mapping technique',
                            'Specialized aftercare protocol',
                            'Dramatic improvement in quality of life'
                        ]
                    }
                ],
                precare: [
                    'Avoid alcohol 24 hours before treatment',
                    'Discontinue blood thinners if medically safe',
                    'Arrive with clean, makeup-free skin',
                    'Avoid aspirin for 1 week prior',
                    'Stay hydrated and eat light meal',
                    'List all medications and supplements'
                ],
                aftercare: [
                    'Avoid touching treated areas for 4-6 hours',
                    'No strenuous exercise for 24 hours',
                    'Stay upright for 4 hours post-treatment',
                    'Results visible in 3-7 days for Botox',
                    'Avoid heat and saunas for 24 hours',
                    'Schedule follow-up as recommended'
                ]
            },
            'weight-management': {
                title: 'Weight Management Program',
                subtitle: 'Comprehensive medical weight loss with ongoing support',
                icon: 'ri-heart-pulse-line',
                services: [
                    {
                        name: 'Personalized Weight Management Program',
                        duration: 'Ongoing',
                        results: 'Customized Timeline',
                        price: 'Inquire Within',
                        typical: 'Custom pricing based on individual needs',
                        description: 'Medically supervised comprehensive program with evaluation, personalized meal planning, exercise guidance, and regular monitoring.',
                        features: [
                            'Complete medical evaluation and lab work',
                            'Personalized nutrition and exercise plans',
                            'Regular monitoring and plan adjustments',
                            'Lifestyle modification coaching',
                            'Ongoing medical supervision',
                            'Support group access and resources'
                        ]
                    }
                ],
                precare: [
                    'Complete medical history review and physical exam',
                    'Comprehensive lab work evaluation (included)',
                    'Goal setting consultation with realistic timelines',
                    'Nutritional assessment and dietary analysis',
                    'Current medication review and interactions',
                    'Baseline measurements and body composition'
                ],
                aftercare: [
                    'Weekly check-ins during initial phase',
                    'Monthly monitoring appointments ongoing',
                    'Nutritional guidance and meal planning support',
                    'Exercise recommendations tailored to fitness level',
                    'Lifestyle modification coaching and behavioral support',
                    'Access to program resources and educational materials'
                ]
            },
            'iv-therapy': {
                title: 'IV Therapy & Wellness',
                subtitle: 'Premium intravenous hydration and vitamin therapy',
                icon: 'ri-drop-line',
                services: [
                    {
                        name: 'Standard IV Therapy',
                        duration: '45-60 minutes',
                        results: 'Immediate',
                        price: '$350',
                        typical: 'Single session',
                        description: 'Customized vitamin and mineral cocktails for hydration, energy boost, immune support, or recovery. Formulations tailored to your specific needs.',
                        features: [
                            'Custom vitamin formulations',
                            'Comfortable private treatment rooms',
                            'Immediate energy and hydration boost',
                            'Multiple formula options available'
                        ]
                    },
                    {
                        name: 'NAD+ IV Therapy',
                        duration: '2-3 hours',
                        results: 'Progressive',
                        price: '$600',
                        typical: 'Single infusion',
                        description: 'Advanced anti-aging cellular regeneration therapy promoting cellular repair, energy production, and cognitive enhancement.',
                        features: [
                            'Cellular regeneration support',
                            'Anti-aging benefits',
                            'Enhanced energy and mental clarity',
                            'Cutting-edge longevity therapy'
                        ]
                    },
                    {
                        name: 'Vitamin Injections',
                        duration: '15 minutes',
                        results: 'Immediate',
                        price: '$50/injection',
                        typical: 'Per vitamin type',
                        description: 'Targeted intramuscular vitamin supplementation including B12, B-complex, Vitamin D, and other essential nutrients.',
                        features: [
                            'Quick and convenient treatment',
                            'High absorption rate compared to oral',
                            'Various vitamin options available',
                            'Immediate bioavailability'
                        ]
                    }
                ],
                precare: [
                    'Stay well-hydrated before arrival (16-20oz water)',
                    'Eat light meal 2 hours prior to prevent lightheadedness',
                    'Wear comfortable clothing with easy arm access',
                    'List all current medications and supplements',
                    'Avoid excessive caffeine on treatment day',
                    'Bring entertainment for longer NAD+ sessions'
                ],
                aftercare: [
                    'Continue hydrating (additional 32oz water throughout day)',
                    'Avoid alcohol for 12 hours to maximize benefits',
                    'Light activity recommended, avoid intense exercise for 2 hours',
                    'Effects typically felt within hours, peak at 24-48 hours',
                    'Monitor injection site for any unusual reactions',
                    'Schedule follow-up sessions as recommended'
                ]
            },
            'microneedling': {
                title: 'Microneedling & Exosome Therapy',
                subtitle: 'Advanced collagen induction with cutting-edge enhancement',
                icon: 'ri-focus-3-line',
                services: [
                    {
                        name: 'SkinPen Microneedling',
                        duration: '60-90 minutes',
                        results: '2-4 weeks',
                        price: '$700/area',
                        typical: '3-session package: $1,890',
                        description: 'FDA-approved microneedling device creating controlled micro-injuries to stimulate natural collagen production. Package deals available.',
                        features: [
                            'FDA-approved SkinPen device',
                            'Adjustable needle depths for customization',
                            'Comprehensive series packages available',
                            'Proven collagen induction results'
                        ]
                    },
                    {
                        name: 'Exosome Therapy',
                        duration: 'Add-on service',
                        results: 'Enhanced healing',
                        price: '$600',
                        typical: 'Add-on or standalone',
                        description: 'Cutting-edge regenerative enhancement using exosomes to accelerate healing and maximize microneedling results.',
                        features: [
                            'Latest regenerative technology',
                            'Enhanced healing response',
                            'Superior results when combined with microneedling',
                            'Advanced cellular communication therapy'
                        ]
                    }
                ],
                precare: [
                    'Avoid retinoids and acids 5-7 days prior to treatment',
                    'No sun exposure or tanning 48 hours before appointment',
                    'Discontinue skincare acids (AHA, BHA, glycolic)',
                    'Arrive with clean, product-free skin',
                    'Avoid waxing or aggressive exfoliation for 1 week',
                    'Inform us of any active skin conditions'
                ],
                aftercare: [
                    'Gentle cleansing only for 72 hours (no harsh scrubbing)',
                    'SPF 30+ daily protection essential for 2 weeks minimum',
                    'Avoid makeup for 24 hours post-treatment',
                    'Healing typically complete in 3-5 days',
                    'Use only recommended gentle moisturizers',
                    'Schedule follow-up treatments 4-6 weeks apart'
                ]
            },
            'prp-therapy': {
                title: 'PRP & Regenerative Therapy',
                subtitle: 'Natural healing using your body\'s own regenerative factors',
                icon: 'ri-dna-line',
                services: [
                    {
                        name: 'PRP (Platelet-Rich Plasma)',
                        duration: '90 minutes',
                        results: '2-4 weeks',
                        price: '$800',
                        typical: 'Single session',
                        description: 'Advanced regenerative therapy using your own concentrated platelets to stimulate healing, collagen production, and tissue regeneration.',
                        features: [
                            'Uses your own blood platelets',
                            'Natural regenerative healing process',
                            'Multiple application areas available',
                            'No risk of allergic reactions'
                        ]
                    },
                    {
                        name: 'Profhilo Treatment',
                        duration: '45 minutes',
                        results: '4-6 weeks',
                        price: '$600',
                        typical: '2-session series recommended',
                        description: 'Revolutionary bio-remodeling therapy improving skin quality, hydration, and elasticity through specialized hyaluronic acid.',
                        features: [
                            'Revolutionary bio-remodeling technology',
                            'Significant improvement in skin quality',
                            'Natural hydration boost',
                            'Long-lasting skin enhancement'
                        ]
                    },
                    {
                        name: 'Salmon Sperm DNA Therapy',
                        duration: '60 minutes',
                        results: '3-4 weeks',
                        price: '$600',
                        typical: '3-session series optimal',
                        description: 'Innovative DNA repair and regeneration treatment using polynucleotides for cellular repair and skin quality enhancement.',
                        features: [
                            'Advanced DNA repair technology',
                            'Cellular regeneration support',
                            'Long-lasting skin improvements',
                            'Cutting-edge aesthetic innovation'
                        ]
                    }
                ],
                precare: [
                    'Avoid anti-inflammatory medications 1 week prior (if medically safe)',
                    'Stay well-hydrated leading up to treatment',
                    'Maintain healthy diet rich in nutrients',
                    'No blood thinners if medically safe',
                    'Avoid excessive alcohol consumption 48 hours prior',
                    'Get adequate sleep before treatment day'
                ],
                aftercare: [
                    'Avoid direct sun exposure for 48 hours minimum',
                    'Use gentle skincare routine for 1 week',
                    'No intense exercise for 24 hours post-treatment',
                    'Results develop progressively over 2-4 weeks',
                    'Apply SPF 30+ daily for optimal healing',
                    'Follow recommended treatment series for best results'
                ]
            },
            'chemical-peels': {
                title: 'Chemical Peels & Mesotherapy',
                subtitle: 'Professional skin resurfacing for radiant complexion',
                icon: 'ri-contrast-drop-line',
                services: [
                    {
                        name: 'Chemical Peel - Single Treatment',
                        duration: '60 minutes',
                        results: '1-2 weeks',
                        price: '$350',
                        typical: 'Single session',
                        description: 'Professional-grade chemical resurfacing customized to your skin type and concerns. Includes pre-treatment preparation and post-care kit.',
                        features: [
                            'Customized to your specific skin type',
                            'Professional-grade formulations',
                            'Comprehensive post-care kit included',
                            'Immediate improvement visible'
                        ]
                    },
                    {
                        name: 'Chemical Peel - Package of 3',
                        duration: '3 months total',
                        results: 'Progressive',
                        price: '$900',
                        typical: 'Save $150 vs individual',
                        description: 'Three-peel progressive series for optimal results. Must be completed within 3 months with 4-6 week intervals.',
                        features: [
                            '$150 savings versus individual treatments',
                            'Progressive improvement over time',
                            'Customized strength progression',
                            'Optimal results with series approach'
                        ]
                    },
                    {
                        name: 'Mesotherapy',
                        duration: '45 minutes',
                        results: '2-3 weeks',
                        price: '$400/area',
                        typical: 'Per treatment area',
                        description: 'Targeted micro-injection therapy delivering vitamins, minerals, and active ingredients directly to specific treatment areas.',
                        features: [
                            'Targeted delivery system',
                            'Customizable active formulations',
                            'Minimal downtime required',
                            'Localized improvement focus'
                        ]
                    }
                ],
                precare: [
                    'Avoid retinoids and strong acids 7 days prior',
                    'No waxing or aggressive exfoliation for 5 days',
                    'Sun avoidance for 2 weeks before treatment',
                    'Discontinue certain medications as advised',
                    'Arrive with completely clean, product-free skin',
                    'Avoid active breakouts in treatment area'
                ],
                aftercare: [
                    'Gentle cleansing only with mild, fragrance-free products',
                    'Strict sun protection (SPF 50+) for 2 weeks minimum',
                    'No picking or peeling of treated skin',
                    'Peeling process typically 3-7 days',
                    'Use only recommended moisturizers and serums',
                    'Avoid makeup for 24-48 hours as tolerated'
                ]
            }
        };
    }

    /* ========================================
       VIDEO SYNCHRONIZATION SYSTEM
       ======================================== */
    
    async initVideoSynchronization() {
        try {
            console.log('🎬 Initializing synchronized video system...');
            
            // Load all videos simultaneously
            const loadPromises = Array.from(this.syncedVideos).map(video => this.loadVideo(video));
            await Promise.all(loadPromises);
            
            // Start synchronized playback
            this.startSynchronizedPlayback();
            
            // Initialize mobile video separately
            if (this.mobileVideo) {
                this.initMobileVideo();
            }
            
            // Show hero content when videos are ready
            this.revealHeroContent();
            
        } catch (error) {
            console.warn('Video sync error:', error);
            this.handleVideoFallback();
        }
    }

    loadVideo(video) {
        return new Promise((resolve) => {
            const panel = video.closest('.video-panel');
            const loadingOverlay = panel?.querySelector('.video-loading-overlay');
            
            // Set video properties
            video.muted = true;
            video.playsInline = true;
            video.loop = false; // We'll handle looping manually for sync
            
            const onLoaded = () => {
                console.log('✅ Video loaded:', video.src);
                
                if (panel) {
                    panel.classList.add('loaded');
                }
                
                // Hide loading overlay with soft transition
                if (loadingOverlay) {
                    setTimeout(() => {
                        loadingOverlay.style.opacity = '0';
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                        }, 600);
                    }, 300);
                }
                
                resolve(video);
            };

            const onError = () => {
                console.warn('❌ Video failed to load:', video.src);
                this.handleVideoError(video, panel);
                resolve(video); // Resolve anyway to not block other videos
            };

            if (video.readyState >= 3) {
                onLoaded();
            } else {
                video.addEventListener('canplaythrough', onLoaded, { once: true });
                video.addEventListener('error', onError, { once: true });
                video.load();
            }
        });
    }

    startSynchronizedPlayback() {
        if (this.syncedVideos.length === 0) return;
        
        console.log('🎯 Starting synchronized video playback...');
        
        // Find the longest video duration
        let maxDuration = 0;
        this.syncedVideos.forEach(video => {
            if (video.duration > maxDuration) {
                maxDuration = video.duration;
            }
        });
        
        // Start all videos at the same time
        this.syncedVideos.forEach(video => {
            video.currentTime = 0;
            video.play().catch(e => {
                console.log('Autoplay prevented for video:', e);
                this.addPlayButton(video);
            });
        });
        
        // Set up restart synchronization
        this.setupVideoRestart(maxDuration);
        
        // Handle sync loss recovery
        this.monitorVideoSync();
    }

    setupVideoRestart(duration) {
        setInterval(() => {
            // Restart all videos simultaneously
            this.syncedVideos.forEach(video => {
                if (video.readyState >= 3) {
                    video.currentTime = 0;
                    video.play().catch(e => console.log('Restart play failed:', e));
                }
            });
            
            console.log('🔄 Videos restarted synchronously');
        }, (duration + 0.5) * 1000); // Small buffer for smooth restart
    }

    monitorVideoSync() {
        // Check sync every few seconds and correct if needed
        setInterval(() => {
            if (this.syncedVideos.length < 2) return;
            
            const times = Array.from(this.syncedVideos).map(v => v.currentTime);
            const maxTime = Math.max(...times);
            const minTime = Math.min(...times);
            
            // If videos are more than 0.5 seconds out of sync, correct them
            if (maxTime - minTime > 0.5) {
                console.log('⚠️ Video sync drift detected, correcting...');
                const targetTime = times[0]; // Use first video as reference
                
                this.syncedVideos.forEach((video, index) => {
                    if (index > 0 && Math.abs(video.currentTime - targetTime) > 0.3) {
                        video.currentTime = targetTime;
                    }
                });
            }
        }, 3000);
    }

    addPlayButton(video) {
        const panel = video.closest('.video-panel');
        if (!panel || panel.querySelector('.video-play-btn')) return;
        
        const playBtn = document.createElement('div');
        playBtn.className = 'video-play-btn';
        playBtn.innerHTML = '<i class="ri-play-fill"></i>';
        playBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: rgba(255, 140, 0, 0.95);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 20px rgba(255, 140, 0, 0.3);
        `;

        playBtn.addEventListener('click', () => {
            // Start all videos when one play button is clicked
            this.startSynchronizedPlayback();
            playBtn.remove();
        });

        playBtn.addEventListener('mouseenter', () => {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1.1)';
            playBtn.style.boxShadow = '0 12px 30px rgba(255, 140, 0, 0.4)';
        });

        playBtn.addEventListener('mouseleave', () => {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
            playBtn.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.3)';
        });

        panel.appendChild(playBtn);
    }

    initMobileVideo() {
        if (!this.mobileVideo) return;
        
        this.mobileVideo.muted = true;
        this.mobileVideo.playsInline = true;
        this.mobileVideo.loop = true;
        
        this.mobileVideo.addEventListener('canplaythrough', () => {
            this.mobileVideo.play().catch(e => {
                console.log('Mobile video autoplay prevented:', e);
                this.addPlayButton(this.mobileVideo);
            });
        }, { once: true });
        
        this.mobileVideo.load();
    }

    handleVideoError(video, panel) {
        console.warn('Video error handled for:', video.src);
        
        if (panel) {
            panel.style.background = 'linear-gradient(135deg, #f8f6f3 0%, #f0ebe3 100%)';
            panel.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--text-secondary);
                    font-family: var(--font-inter);
                    font-size: 14px;
                    text-align: center;
                    padding: 20px;
                ">
                    <i class="ri-image-line" style="font-size: 32px; color: #ff8c00; margin-bottom: 12px;"></i>
                    <span>Treatment Showcase</span>
                </div>
            `;
        }
    }

    handleVideoFallback() {
        console.log('🔄 Implementing video fallback...');
        
        this.videoPanels.forEach(panel => {
            panel.style.background = 'linear-gradient(135deg, #f8f6f3 0%, #f0ebe3 100%)';
            panel.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--text-secondary);
                    font-family: var(--font-inter);
                    font-size: 14px;
                    text-align: center;
                    padding: 20px;
                ">
                    <i class="ri-heart-3-line" style="font-size: 32px; color: #ff8c00; margin-bottom: 12px;"></i>
                    <span>Luxury Treatments</span>
                </div>
            `;
        });
        
        this.revealHeroContent();
    }

    /* ========================================
       SOFT ANIMATION SYSTEM
       ======================================== */
    
    revealHeroContent() {
        console.log('🌟 Revealing hero content...');
        
        if (this.heroContent) {
            this.heroContent.classList.add('loaded');
            
            // Animate stats with soft counting
            setTimeout(() => {
                this.animateStats();
            }, 800);
        }
    }

    animateStats() {
        this.statCards.forEach((card, index) => {
            setTimeout(() => {
                this.animateStatCard(card);
            }, index * 200);
        });
    }

    animateStatCard(card) {
        const number = card.querySelector('.stat-number');
        if (!number) return;
        
        const finalText = number.textContent;
        const hasSymbol = finalText.includes('$') || finalText.includes('+');
        const numValue = parseInt(finalText.replace(/[^\d]/g, ''));
        
        if (!numValue) return;

        let current = 0;
        const increment = Math.ceil(numValue / 30);
        const duration = 1500;
        const stepTime = duration / 30;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                current = numValue;
                clearInterval(timer);
            }
            
            if (hasSymbol) {
                if (finalText.includes('$')) {
                    number.textContent = `$${current}`;
                } else if (finalText.includes('+')) {
                    number.textContent = `${current}+`;
                }
            } else {
                number.textContent = current;
            }
        }, stepTime);

        // Add soft glow during animation
        number.style.textShadow = '0 0 20px rgba(255, 140, 0, 0.5)';
        setTimeout(() => {
            number.style.textShadow = '';
        }, duration + 500);
    }

    initSoftAnimations() {
        // Add intersection observer for soft reveals
        const softRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.addSoftReveal(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        // Observe category cards
        this.categoryCards.forEach(card => {
            softRevealObserver.observe(card);
        });

        // Observe CTA section
        const ctaSection = document.querySelector('.services-cta-section .cta-content');
        if (ctaSection) {
            softRevealObserver.observe(ctaSection);
        }
    }

    addSoftReveal(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    /* ========================================
       EVENT HANDLING & INTERACTIONS
       ======================================== */
    
    bindEvents() {
        // Category card interactions
        this.categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
        });

        // Explore button interactions
        this.exploreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleExploreClick(btn);
            });
        });

        // Scroll indicator
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.smoothScrollToCategories();
            });
        }

        // Modal interactions
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.closeModal());
        }

        // Escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });

        // Stat card interactions
        this.statCards.forEach(card => {
            card.addEventListener('click', () => this.handleStatClick(card));
        });

        // Consultation card interaction
        if (this.consultationCard) {
            this.consultationCard.addEventListener('mouseenter', () => {
                this.addSoftGlow(this.consultationCard);
            });
            this.consultationCard.addEventListener('mouseleave', () => {
                this.removeSoftGlow(this.consultationCard);
            });
        }

        // Responsive video handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Page visibility for video performance
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    handleCardHover(card, isEntering) {
        const glow = card.querySelector('.card-glow');
        const number = card.querySelector('.category-number');
        const badge = card.querySelector('.category-badge span');
        const exploreBtn = card.querySelector('.explore-btn');

        if (isEntering) {
            // Add soft glow effects
            if (glow) {
                glow.style.opacity = '0.8';
            }
            
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.2)';
            }
            
            if (badge) {
                badge.style.transform = 'translateY(-2px)';
            }
            
            if (exploreBtn) {
                exploreBtn.style.animation = 'gentleScale 2s ease-in-out infinite';
            }
            
            // Add soft entrance animation
            this.addSoftRipple(card);
            
        } else {
            // Reset effects softly
            if (glow) {
                glow.style.opacity = '';
            }
            
            if (number) {
                number.style.transform = '';
                number.style.boxShadow = '';
            }
            
            if (badge) {
                badge.style.transform = '';
            }
            
            if (exploreBtn) {
                exploreBtn.style.animation = '';
            }
        }
    }

    handleExploreClick(btn) {
        const category = btn.getAttribute('data-category');
        
        // Add click animation
        btn.classList.add('clicked');
        btn.style.transform = 'translateY(-1px) scale(0.98)';
        
        setTimeout(() => {
            btn.style.transform = '';
            btn.classList.remove('clicked');
            this.openServiceModal(category);
        }, 200);
        
        // Add soft feedback
        this.addSoftRipple(btn);
    }

    smoothScrollToCategories() {
        // Add click animation to scroll indicator
        this.scrollIndicator.style.transform = 'translateX(-50%) translateY(2px) scale(0.95)';
        
        setTimeout(() => {
            this.scrollIndicator.style.transform = '';
            
            if (this.categoriesSection) {
                this.categoriesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 200);
    }

    handleStatClick(card) {
        // Add soft click animation
        card.style.transform = 'translateY(-2px) scale(0.97)';
        
        setTimeout(() => {
            card.style.transform = '';
            this.smoothScrollToCategories();
        }, 200);
        
        this.addSoftRipple(card);
    }

    /* ========================================
       ENHANCED MODAL SYSTEM
       ======================================== */
    
    openServiceModal(category) {
        const categoryData = this.serviceData[category];
        if (!categoryData) return;
        
        console.log('📋 Opening service modal for:', category);
        
        this.currentCategory = category;
        this.isModalOpen = true;
        
        // Update modal content
        this.updateModalContent(categoryData);
        
        // Show modal with soft animation
        this.modal.style.display = 'flex';
        this.modal.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add soft entrance animation to content
        setTimeout(() => {
            this.animateModalContent();
        }, 400);
    }

    updateModalContent(categoryData) {
        // Update modal header
        if (this.modalCategoryName) {
            this.modalCategoryName.textContent = categoryData.title;
        }
        
        // Update modal badge icon
        const badgeIcon = this.modal.querySelector('.modal-badge i');
        if (badgeIcon) {
            badgeIcon.className = categoryData.icon;
        }
        
        // Generate modal content
        const content = this.generateModalContent(categoryData);
        this.modalContent.innerHTML = content;
    }

    generateModalContent(data) {
        return `
            <div class="service-overview">
                <h3>${data.title}</h3>
                <p>${data.subtitle}</p>
            </div>
            
            <div class="services-list">
                <h4 style="font-family: var(--font-playfair); font-size: 24px; color: var(--text-primary); margin-bottom: 24px; text-align: center;">
                    <i class="${data.icon}" style="color: #ff8c00; margin-right: 12px;"></i>
                    Available Services
                </h4>
                
                ${data.services.map(service => `
                    <div class="service-item">
                        <div class="service-header">
                            <h4>${service.name}</h4>
                            <div class="service-badges">
                                <span>⏱️ ${service.duration}</span>
                                <span>📈 ${service.results}</span>
                            </div>
                        </div>
                        <p class="service-description">${service.description}</p>
                        <div class="service-features" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin: 16px 0;">
                            ${service.features.map(feature => `
                                <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary);">
                                    <i class="ri-check-line" style="color: #ff8c00; font-size: 14px;"></i>
                                    <span>${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
                            <div class="service-price">${service.price}</div>
                            <div style="font-size: 12px; color: var(--text-muted); font-style: italic;">${service.typical}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="care-instructions">
                <div class="care-section">
                    <h4>
                        <i class="ri-arrow-right-line"></i>
                        Pre-Treatment Care
                    </h4>
                    <ul class="care-list">
                        ${data.precare.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="care-section">
                    <h4>
                        <i class="ri-arrow-left-line"></i>
                        Post-Treatment Care
                    </h4>
                    <ul class="care-list">
                        ${data.aftercare.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255, 140, 0, 0.15);">
                <a href="tel:+12016394983" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, #ff8c00, #ff6b35);
                    color: white;
                    border: none;
                    border-radius: 18px;
                    padding: 16px 32px;
                    font-family: var(--font-inter);
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 20px rgba(255, 140, 0, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 30px rgba(255, 140, 0, 0.4)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 8px 20px rgba(255, 140, 0, 0.3)'">
                    <span>Book Consultation</span>
                    <i class="ri-phone-line"></i>
                </a>
                <div style="margin-top: 16px; font-size: 13px; color: var(--text-secondary); font-style: italic;">
                    <i class="ri-information-line" style="color: #ff8c00; margin-right: 8px;"></i>
                    $200 consultation fee credited towards your first service
                </div>
            </div>
        `;
    }

    animateModalContent() {
        const items = this.modalContent.querySelectorAll('.service-item, .care-section');
        
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    closeModal() {
        if (!this.isModalOpen) return;
        
        console.log('❌ Closing service modal...');
        
        this.modal.classList.remove('active');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.isModalOpen = false;
            this.currentCategory = null;
            document.body.style.overflow = '';
        }, 400);
    }

    /* ========================================
       SOFT VISUAL EFFECTS
       ======================================== */
    
    addSoftRipple(element) {
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
            animation: softRipple 1.2s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1200);
    }

    addSoftGlow(element) {
        element.style.boxShadow = '0 15px 35px rgba(255, 140, 0, 0.12)';
        element.style.borderColor = 'rgba(255, 140, 0, 0.25)';
        element.style.transform = 'translateY(-3px)';
    }

    removeSoftGlow(element) {
        element.style.boxShadow = '';
        element.style.borderColor = '';
        element.style.transform = '';
    }

    /* ========================================
       RESPONSIVE & PERFORMANCE HANDLING
       ======================================== */
    
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Handle video layout switching
        const desktopLayout = document.querySelector('.desktop-video-layout');
        const mobileLayout = document.querySelector('.mobile-video-layout');
        
        if (isMobile) {
            if (desktopLayout) desktopLayout.style.display = 'none';
            if (mobileLayout) mobileLayout.style.display = 'flex';
        } else {
            if (desktopLayout) desktopLayout.style.display = 'flex';
            if (mobileLayout) mobileLayout.style.display = 'none';
        }
        
        // Adjust modal size
        if (this.isModalOpen && this.modal) {
            const modalContainer = this.modal.querySelector('.modal-container');
            if (modalContainer) {
                if (isMobile) {
                    modalContainer.style.width = '95vw';
                    modalContainer.style.height = '95vh';
                } else {
                    modalContainer.style.width = '900px';
                    modalContainer.style.height = 'auto';
                }
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause all videos when page is hidden
            this.syncedVideos.forEach(video => video.pause());
            if (this.mobileVideo) this.mobileVideo.pause();
        } else {
            // Resume synchronized playback when page is visible
            setTimeout(() => {
                this.startSynchronizedPlayback();
                if (this.mobileVideo && this.mobileVideo.readyState >= 3) {
                    this.mobileVideo.play().catch(e => console.log('Resume play failed:', e));
                }
            }, 500);
        }
    }

    setupResponsiveHandling() {
        // Initial responsive setup
        this.handleResize();
        
        // Optimize for touch devices
        if ('ontouchstart' in window) {
            this.setupTouchInteractions();
        }
    }

    setupTouchInteractions() {
        const touchElements = [
            ...this.categoryCards,
            ...this.exploreButtons,
            ...this.statCards
        ];
        
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

    initAccessibility() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add ARIA labels
        this.exploreButtons.forEach(btn => {
            const category = btn.getAttribute('data-category');
            btn.setAttribute('aria-label', `Explore ${category.replace('-', ' ')} services`);
        });

        // Add modal accessibility
        if (this.modal) {
            this.modal.setAttribute('role', 'dialog');
            this.modal.setAttribute('aria-modal', 'true');
            this.modal.setAttribute('aria-labelledby', 'modalCategoryName');
        }
    }

    /* ========================================
       UTILITY METHODS
       ======================================== */
    
    addCustomStyles() {
        if (document.querySelector('#services-enhanced-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'services-enhanced-styles';
        style.textContent = `
            @keyframes softRipple {
                0% { 
                    width: 0; 
                    height: 0; 
                    opacity: 0.8; 
                }
                50% { 
                    opacity: 0.4; 
                }
                100% { 
                    width: 120px; 
                    height: 120px; 
                    opacity: 0; 
                }
            }
            
            @keyframes gentleScale {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            @keyframes softGlow {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(255, 140, 0, 0.1); 
                }
                50% { 
                    box-shadow: 0 0 30px rgba(255, 140, 0, 0.2); 
                }
            }
            
            .page-loaded {
                --animation-ready: 1;
            }
            
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    // Performance optimization
    optimizePerformance() {
        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }, { passive: true });
    }

    handleScroll() {
        const scrolled = window.scrollY;
        
        // Update header transparency
        const header = document.querySelector('.luxury-floating-header');
        if (header) {
            const opacity = Math.min(0.95, 0.8 + (scrolled / 500) * 0.15);
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
        }
        
        // Show/hide scroll indicator
        if (this.scrollIndicator) {
            const heroHeight = document.querySelector('.services-hero-section')?.offsetHeight || 0;
            const shouldShow = scrolled < heroHeight - 200;
            
            this.scrollIndicator.style.opacity = shouldShow ? '1' : '0';
        }
    }

    // Cleanup method
    cleanup() {
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Clear any intervals
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // Reset video states
        this.syncedVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        console.log('🧹 Services page cleanup completed');
    }
}

// Enhanced Performance Monitor
class ServicesPerformanceMonitor {
    constructor() {
        this.metrics = {
            videoLoadTime: 0,
            heroRenderTime: 0,
            modalOpenTime: 0
        };
        this.init();
    }

    init() {
        if (!window.performance) return;
        
        performance.mark('services-init-start');
        this.monitorVideoLoading();
        this.monitorHeroRendering();
        this.monitorModalPerformance();
    }

    monitorVideoLoading() {
        const videos = document.querySelectorAll('[data-sync-group="hero"]');
        let loadedCount = 0;
        
        videos.forEach(video => {
            video.addEventListener('canplaythrough', () => {
                loadedCount++;
                if (loadedCount === videos.length) {
                    performance.mark('videos-loaded');
                    performance.measure('video-load-time', 'services-init-start', 'videos-loaded');
                    
                    const measure = performance.getEntriesByName('video-load-time')[0];
                    console.log(`📊 Videos loaded in: ${Math.round(measure.duration)}ms`);
                }
            }, { once: true });
        });
    }

    monitorHeroRendering() {
        const heroContent = document.querySelector('.services-hero-content');
        if (heroContent) {
            const observer = new MutationObserver(() => {
                if (heroContent.classList.contains('loaded')) {
                    performance.mark('hero-rendered');
                    performance.measure('hero-render-time', 'services-init-start', 'hero-rendered');
                    
                    const measure = performance.getEntriesByName('hero-render-time')[0];
                    console.log(`🏛️ Hero rendered in: ${Math.round(measure.duration)}ms`);
                    
                    observer.disconnect();
                }
            });
            
            observer.observe(heroContent, { attributes: true, attributeFilter: ['class'] });
        }
    }

    monitorModalPerformance() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.explore-btn')) {
                performance.mark('modal-open-start');
                
                setTimeout(() => {
                    const modal = document.getElementById('serviceDetailsModal');
                    if (modal && modal.classList.contains('active')) {
                        performance.mark('modal-open-end');
                        performance.measure('modal-open-time', 'modal-open-start', 'modal-open-end');
                        
                        const measure = performance.getEntriesByName('modal-open-time')[0];
                        console.log(`📋 Modal opened in: ${Math.round(measure.duration)}ms`);
                    }
                }, 500);
            }
        });
    }
}

// Soft Animation Engine
class SoftAnimationEngine {
    constructor() {
        this.animationQueue = [];
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.addSoftAnimationStyles();
        this.setupIntersectionObserver();
    }

    addSoftAnimationStyles() {
        if (document.querySelector('#soft-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'soft-animations';
        style.textContent = `
            .soft-reveal {
                opacity: 0;
                transform: translateY(30px);
                transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .soft-reveal.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            
            .soft-scale {
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .soft-scale:hover {
                transform: translateY(-4px) scale(1.02);
            }
            
            .cream-glow {
                transition: all 0.4s ease;
            }
            
            .cream-glow:hover {
                box-shadow: 0 12px 30px rgba(255, 140, 0, 0.12);
            }
        `;
        
        document.head.appendChild(style);
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        // Apply to category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.add('soft-reveal');
            observer.observe(card);
        });

        // Apply to CTA content
        const ctaContent = document.querySelector('.cta-content');
        if (ctaContent) {
            ctaContent.classList.add('soft-reveal');
            observer.observe(ctaContent);
        }
    }

    revealElement(element) {
        element.classList.add('revealed');
        
        // Add soft entrance effect
        const children = element.querySelectorAll('.category-title, .category-description, .explore-btn');
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                child.style.transition = 'all 0.6s ease-out';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// Enhanced User Experience Manager
class UserExperienceManager {
    constructor() {
        this.interactions = [];
        this.preferences = this.loadPreferences();
        this.init();
    }

    init() {
        this.trackInteractions();
        this.setupFeedbackSystem();
        this.optimizeForDevice();
    }

    trackInteractions() {
        // Track user behavior for optimization
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-category]');
            if (target) {
                this.recordInteraction('category_click', target.getAttribute('data-category'));
            }
        });

        // Track scroll behavior
        let scrollEndTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                this.recordInteraction('scroll_depth', Math.round(scrollPercent));
            }, 150);
        }, { passive: true });
    }

    recordInteraction(type, data) {
        this.interactions.push({
            type,
            data,
            timestamp: Date.now()
        });
        
        // Keep only recent interactions
        if (this.interactions.length > 50) {
            this.interactions = this.interactions.slice(-25);
        }
    }

    setupFeedbackSystem() {
        // Subtle feedback for user actions
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .explore-btn, .consultation-btn');
            if (button) {
                this.provideSoftFeedback(button);
            }
        });
    }

    provideSoftFeedback(element) {
        // Add gentle haptic-like feedback
        element.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 100);
        
        // Visual feedback
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 4px;
            height: 4px;
            background: #ff8c00;
            border-radius: 50%;
            animation: feedbackPulse 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        `;
        
        element.style.position = 'relative';
        element.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 600);
    }

    optimizeForDevice() {
        const deviceInfo = {
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isLowPower: navigator.hardwareConcurrency <= 2,
            hasSlowConnection: navigator.connection && navigator.connection.effectiveType === 'slow-2g'
        };

        if (deviceInfo.isLowPower || deviceInfo.hasSlowConnection) {
            this.enableLowPowerMode();
        }

        if (deviceInfo.isMobile) {
            this.optimizeForMobile();
        }
    }

    enableLowPowerMode() {
        console.log('🔋 Low power mode enabled');
        
        // Reduce animation complexity
        document.body.classList.add('low-power-mode');
        
        // Simplify video loading
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.setAttribute('preload', 'none');
        });
    }

    optimizeForMobile() {
        console.log('📱 Mobile optimizations applied');
        
        // Touch-friendly interactions
        const interactiveElements = document.querySelectorAll('.category-card, .explore-btn, .stat-card');
        interactiveElements.forEach(element => {
            element.style.minHeight = '44px'; // Touch target size
        });
    }

    loadPreferences() {
        try {
            return JSON.parse(localStorage.getItem('services-preferences') || '{}');
        } catch {
            return {};
        }
    }

    savePreferences() {
        try {
            localStorage.setItem('services-preferences', JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('Could not save preferences:', e);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core systems
    const servicesManager = new ServicesPageManager();
    const performanceMonitor = new ServicesPerformanceMonitor();
    const animationEngine = new SoftAnimationEngine();
    const uxManager = new UserExperienceManager();
    
    // Add performance monitoring styles
    servicesManager.addCustomStyles();
    servicesManager.optimizePerformance();
    
    // Global error handling
    window.addEventListener('error', (e) => {
        console.warn('Services page error:', e.error);
        
        // Graceful degradation
        if (e.error && e.error.message.includes('video')) {
            servicesManager.handleVideoFallback();
        }
    });
    
    // Page unload cleanup
    window.addEventListener('beforeunload', () => {
        servicesManager.cleanup();
    });
    
    console.log('🚀 Services Page - All Enhanced Systems Active');
    
    // Mark page as fully loaded after a delay
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        performance.mark('services-page-complete');
    }, 2000);
});

// CSS Animation Keyframes Addition
const additionalStyles = `
    @keyframes feedbackPulse {
        0% { 
            transform: translate(-50%, -50%) scale(0); 
            opacity: 1; 
        }
        100% { 
            transform: translate(-50%, -50%) scale(3); 
            opacity: 0; 
        }
    }
`;

// Add to document head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
