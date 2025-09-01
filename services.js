/* ========================================
   SERVICES PAGE - SIMPLIFIED & STABLE
   Fixed crashes, mobile videos, soft animations
   ======================================== */

class ServicesPageManager {
    constructor() {
        this.videos = [];
        this.heroVideos = [];
        this.mobileVideos = [];
        this.isModalOpen = false;
        this.loadedVideos = 0;
        this.totalVideos = 0;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.initVideos();
        this.bindEvents();
        this.initAnimations();
        this.detectDeviceCapability();
        
        console.log('Services Page Manager Initialized');
    }

    cacheElements() {
        // Video elements
        this.heroVideos = document.querySelectorAll('[data-sync-group="hero"]');
        this.mobileVideos = document.querySelectorAll('[data-sync-group="mobile"]');
        this.videoPanels = document.querySelectorAll('.video-panel');
        this.desktopLayout = document.getElementById('desktopVideoLayout');
        this.mobileLayout = document.getElementById('mobileVideoLayout');
        this.ultraMobileLayout = document.getElementById('ultraMobileLayout');
        
        // Hero elements
        this.heroContent = document.querySelector('.services-hero-content');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.statCards = document.querySelectorAll('.stat-card');
        
        // Category elements
        this.categoryCards = document.querySelectorAll('.category-card');
        this.exploreButtons = document.querySelectorAll('.explore-btn');
        this.categoriesSection = document.getElementById('serviceCategories');
        
        // Modal elements
        this.modal = document.getElementById('serviceDetailsModal');
        this.modalBackdrop = document.getElementById('modalBackdrop');
        this.modalClose = document.getElementById('modalClose');
        this.modalContent = document.getElementById('modalContent');
        this.modalCategoryName = document.getElementById('modalCategoryName');
    }

    detectDeviceCapability() {
        const isMobile = window.innerWidth <= 768;
        const isWeakDevice = navigator.hardwareConcurrency <= 2 || 
                           (navigator.connection && navigator.connection.effectiveType === 'slow-2g');
        
        if (isMobile) {
            if (isWeakDevice) {
                // Use single video for weak devices
                this.mobileLayout.style.display = 'none';
                this.ultraMobileLayout.style.display = 'flex';
                this.desktopLayout.style.display = 'none';
            } else {
                // Use 3 videos for mobile
                this.mobileLayout.style.display = 'flex';
                this.ultraMobileLayout.style.display = 'none';
                this.desktopLayout.style.display = 'none';
            }
        } else {
            // Desktop layout
            this.desktopLayout.style.display = 'flex';
            this.mobileLayout.style.display = 'none';
            this.ultraMobileLayout.style.display = 'none';
        }
    }

    initVideos() {
        const allVideos = document.querySelectorAll('.video-panel video');
        this.totalVideos = allVideos.length;
        
        allVideos.forEach((video, index) => {
            this.setupVideo(video, index);
        });
        
        // Start synchronized playback for active layout
        setTimeout(() => {
            this.startSyncedPlayback();
        }, 1000);
    }

    setupVideo(video, index) {
        video.muted = true;
        video.playsInline = true;
        video.loop = false; // Manual loop for sync
        
        const panel = video.closest('.video-panel');
        const loadingOverlay = panel?.querySelector('.video-loading-overlay');
        
        video.addEventListener('loadeddata', () => {
            this.handleVideoLoaded(video, panel, loadingOverlay);
        });
        
        video.addEventListener('error', () => {
            this.handleVideoError(video, panel, loadingOverlay);
        });
        
        video.load();
    }

    handleVideoLoaded(video, panel, loadingOverlay) {
        this.loadedVideos++;
        
        if (panel) {
            panel.classList.add('loaded');
        }
        
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 600);
        }
        
        video.style.opacity = '1';
        
        // Check if all videos are loaded
        if (this.loadedVideos >= this.getActiveVideoCount()) {
            this.showHeroContent();
        }
    }

    handleVideoError(video, panel, loadingOverlay) {
        console.warn('Video failed to load:', video.src);
        
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        if (panel) {
            panel.style.background = 'linear-gradient(135deg, #f8f6f3 0%, #f0ebe3 100%)';
            panel.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff8c00;">
                    <i class="ri-image-line" style="font-size: 24px;"></i>
                </div>
            `;
        }
        
        this.loadedVideos++;
        if (this.loadedVideos >= this.getActiveVideoCount()) {
            this.showHeroContent();
        }
    }

    getActiveVideoCount() {
        if (window.innerWidth <= 768) {
            const isWeakDevice = navigator.hardwareConcurrency <= 2;
            return isWeakDevice ? 1 : 3; // 1 for weak devices, 3 for normal mobile
        }
        return 3; // Desktop
    }

    startSyncedPlayback() {
        const activeVideos = this.getActiveVideos();
        
        // Start all videos at the same time
        activeVideos.forEach(video => {
            video.currentTime = 0;
            video.play().catch(e => {
                console.log('Autoplay prevented:', e);
                this.addPlayButton(video);
            });
        });
        
        // Set up synchronized restart
        if (activeVideos.length > 0 && activeVideos[0].duration) {
            const duration = activeVideos[0].duration;
            setInterval(() => {
                activeVideos.forEach(video => {
                    if (video.readyState >= 3) {
                        video.currentTime = 0;
                        video.play().catch(e => console.log('Sync restart failed:', e));
                    }
                });
            }, (duration + 0.2) * 1000);
        }
    }

    getActiveVideos() {
        if (window.innerWidth <= 768) {
            const isWeakDevice = navigator.hardwareConcurrency <= 2;
            if (isWeakDevice) {
                return [document.querySelector('.ultra-mobile-layout video')].filter(Boolean);
            } else {
                return Array.from(this.mobileVideos);
            }
        }
        return Array.from(this.heroVideos);
    }

    addPlayButton(video) {
        const panel = video.closest('.video-panel');
        if (!panel || panel.querySelector('.play-btn')) return;
        
        const playBtn = document.createElement('div');
        playBtn.className = 'play-btn';
        playBtn.innerHTML = '<i class="ri-play-fill"></i>';
        playBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: rgba(255, 140, 0, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
        `;

        playBtn.addEventListener('click', () => {
            this.startSyncedPlayback();
            playBtn.remove();
        });

        panel.appendChild(playBtn);
    }

    showHeroContent() {
        if (this.heroContent) {
            this.heroContent.classList.add('loaded');
            this.animateStats();
        }
    }

    animateStats() {
        this.statCards.forEach((card, index) => {
            setTimeout(() => {
                const number = card.querySelector('.stat-number');
                if (number) {
                    this.countUpNumber(number);
                }
            }, index * 300);
        });
    }

    countUpNumber(element) {
        const finalText = element.textContent;
        const numValue = parseInt(finalText.replace(/[^\d]/g, ''));
        if (!numValue) return;

        let current = 0;
        const increment = Math.ceil(numValue / 20);
        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                current = numValue;
                clearInterval(timer);
            }
            
            if (finalText.includes('$')) {
                element.textContent = `$${current}`;
            } else if (finalText.includes('+')) {
                element.textContent = `${current}+`;
            } else {
                element.textContent = current;
            }
        }, 60);
    }

    bindEvents() {
        // Scroll indicator
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.scrollToCategories();
            });
        }

        // Category cards hover
        this.categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCardHover(card);
            });
            card.addEventListener('mouseleave', () => {
                this.removeCardHover(card);
            });
        });

        // Explore buttons - SIMPLIFIED to prevent crashes
        this.exploreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleExploreClick(btn);
            });
        });

        // Modal close
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });

        // Stat cards
        this.statCards.forEach(card => {
            card.addEventListener('click', () => {
                this.scrollToCategories();
            });
        });

        // Responsive handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleExploreClick(btn) {
        try {
            const category = btn.getAttribute('data-category');
            if (!category) return;
            
            // Simple animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
                this.openSimpleModal(category);
            }, 150);
            
        } catch (error) {
            console.error('Explore button error:', error);
            // Fallback - just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    openSimpleModal(category) {
        try {
            if (this.isModalOpen) return;
            
            this.isModalOpen = true;
            
            // Update modal content based on category
            const content = this.getServiceContent(category);
            
            if (this.modalCategoryName) {
                this.modalCategoryName.textContent = content.title;
            }
            
            if (this.modalContent) {
                this.modalContent.innerHTML = content.html;
            }
            
            // Show modal
            if (this.modal) {
                this.modal.style.display = 'flex';
                setTimeout(() => {
                    this.modal.classList.add('active');
                }, 10);
                
                document.body.style.overflow = 'hidden';
            }
            
        } catch (error) {
            console.error('Modal open error:', error);
            this.isModalOpen = false;
        }
    }

    getServiceContent(category) {
        const serviceInfo = {
            'botox-fillers': {
                title: 'Botox & Fillers',
                html: `
                    <div class="service-overview">
                        <h3>Precision Injectable Treatments</h3>
                        <p>Expert neurotoxin and filler treatments with precision and artistry for natural-looking results.</p>
                    </div>
                    
                    <div class="services-list">
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Botox (Neurotoxin)</h4>
                                <div class="service-price">$16<small>/unit</small></div>
                            </div>
                            <p>FDA-approved neurotoxin for wrinkles and hyperhidrosis. Duration: 30 mins. Results: 3-7 days.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Dermal Fillers</h4>
                                <div class="service-price">$800<small>/syringe</small></div>
                            </div>
                            <p>Premium hyaluronic acid fillers for volume and contouring. Duration: 45 mins. Results: Immediate.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Hyperhidrosis Treatment</h4>
                                <div class="service-price">$750-$2000</div>
                            </div>
                            <p>Specialized excessive sweating treatment for hands, underarms, or head/scalp areas.</p>
                        </div>
                    </div>
                    
                    <div class="care-instructions">
                        <div class="care-section">
                            <h4><i class="ri-arrow-right-line"></i> Pre-Treatment Care</h4>
                            <ul class="care-list">
                                <li>Avoid alcohol 24 hours before treatment</li>
                                <li>Discontinue blood thinners if medically safe (consult your physician)</li>
                                <li>Arrive with clean, makeup-free skin</li>
                                <li>Inform us of any medications, supplements, or medical conditions</li>
                                <li>Avoid aspirin and anti-inflammatory medications for 1 week</li>
                                <li>Stay hydrated and eat a light meal before your appointment</li>
                                <li>Avoid waxing or threading in treatment areas for 48 hours</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Post-Treatment Care</h4>
                            <ul class="care-list">
                                <li>Avoid touching treated areas for 4-6 hours</li>
                                <li>No strenuous exercise for 24 hours</li>
                                <li>Stay upright for 4 hours post-treatment</li>
                                <li>Results visible in 3-7 days for Botox, immediate for fillers</li>
                                <li>Avoid saunas, hot yoga, and excessive heat for 24 hours</li>
                                <li>Apply ice if swelling occurs (10 minutes on, 10 minutes off)</li>
                                <li>Schedule follow-up appointment as recommended</li>
                                <li>Contact office immediately if unusual symptoms occur</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="tel:+12016394983" class="modal-cta-btn">
                            <span>Book Consultation</span>
                            <i class="ri-phone-line"></i>
                        </a>
                    </div>
                `
            },
            'weight-management': {
                title: 'Weight Management',
                html: `
                    <div class="service-overview">
                        <h3>Medical Weight Loss Program</h3>
                        <p>Comprehensive medically supervised weight management with personalized plans and ongoing support.</p>
                    </div>
                    
                    <div class="services-list">
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Complete Weight Management Program</h4>
                                <div class="service-price">Inquire Within</div>
                            </div>
                            <p>Personalized program with medical evaluation, nutrition planning, exercise guidance, and regular monitoring.</p>
                        </div>
                    </div>
                    
                    <div class="care-instructions">
                        <div class="care-section">
                            <h4><i class="ri-arrow-right-line"></i> Pre-Program Preparation</h4>
                            <ul class="care-list">
                                <li>Complete medical history review and physical examination</li>
                                <li>Comprehensive lab work evaluation (included in program)</li>
                                <li>Goal setting consultation with realistic timelines</li>
                                <li>Nutritional assessment and current dietary analysis</li>
                                <li>Current medication review and potential interactions</li>
                                <li>Baseline measurements and body composition analysis</li>
                                <li>Discuss any previous weight loss attempts and challenges</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Program Support & Monitoring</h4>
                            <ul class="care-list">
                                <li>Weekly check-ins during initial 4-week phase</li>
                                <li>Monthly monitoring appointments for ongoing support</li>
                                <li>Nutritional guidance and personalized meal planning</li>
                                <li>Exercise recommendations tailored to your fitness level</li>
                                <li>Lifestyle modification coaching and behavioral support</li>
                                <li>Access to program resources and educational materials</li>
                                <li>24/7 support line for questions and concerns</li>
                                <li>Regular lab work monitoring as needed</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="tel:+12016394983" class="modal-cta-btn">
                            <span>Schedule Consultation</span>
                            <i class="ri-phone-line"></i>
                        </a>
                    </div>
                `
            },
            'iv-therapy': {
                title: 'IV Therapy & Wellness',
                html: `
                    <div class="service-overview">
                        <h3>Premium Wellness Therapies</h3>
                        <p>Intravenous hydration and vitamin therapy for optimal wellness and cellular regeneration.</p>
                    </div>
                    
                    <div class="services-list">
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Standard IV Therapy</h4>
                                <div class="service-price">$350</div>
                            </div>
                            <p>Custom vitamin cocktails for hydration and energy. Duration: 45-60 mins. Results: Immediate.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>NAD+ IV Therapy</h4>
                                <div class="service-price">$600</div>
                            </div>
                            <p>Advanced anti-aging cellular therapy. Duration: 2-3 hours. Results: Progressive.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Vitamin Injections</h4>
                                <div class="service-price">$50<small>/injection</small></div>
                            </div>
                            <p>Targeted vitamin supplementation. Duration: 15 mins. Results: Immediate.</p>
                        </div>
                    </div>
                    
                    <div class="care-instructions">
                        <div class="care-section">
                            <h4><i class="ri-arrow-right-line"></i> Pre-Treatment Preparation</h4>
                            <ul class="care-list">
                                <li>Stay well-hydrated before arrival (drink 16-20oz water)</li>
                                <li>Eat a light meal 2 hours prior to prevent lightheadedness</li>
                                <li>Wear comfortable clothing with easy arm access</li>
                                <li>List all current medications and supplements</li>
                                <li>Avoid excessive caffeine on treatment day</li>
                                <li>Bring entertainment for longer NAD+ sessions (2-3 hours)</li>
                                <li>Get adequate sleep the night before treatment</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Post-Treatment Care</h4>
                            <ul class="care-list">
                                <li>Continue hydrating throughout day (additional 32oz water)</li>
                                <li>Avoid alcohol for 12 hours to maximize benefits</li>
                                <li>Light activity recommended, avoid intense exercise for 2 hours</li>
                                <li>Effects typically felt within hours and peak at 24-48 hours</li>
                                <li>Monitor injection site for any unusual reactions</li>
                                <li>Schedule follow-up sessions as recommended</li>
                                <li>Maintain healthy diet to support vitamin absorption</li>
                                <li>Rest and allow your body to process the nutrients</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="tel:+12016394983" class="modal-cta-btn">
                            <span>Book Therapy</span>
                            <i class="ri-phone-line"></i>
                        </a>
                    </div>
                `
            },
            'microneedling': {
                title: 'Microneedling & Exosome Therapy',
                html: `
                    <div class="service-overview">
                        <h3>Advanced Skin Rejuvenation</h3>
                        <p>FDA-approved SkinPen technology with optional exosome enhancement for superior results.</p>
                    </div>
                    
                    <div class="services-list">
                        <div class="service-item">
                            <div class="service-header">
                                <h4>SkinPen Microneedling</h4>
                                <div class="service-price">$700<small>/area</small></div>
                            </div>
                            <p>FDA-approved device for collagen induction. Duration: 60-90 mins. Results: 2-4 weeks.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Exosome Therapy</h4>
                                <div class="service-price">$600</div>
                            </div>
                            <p>Cutting-edge regenerative enhancement. Can be standalone or add-on to microneedling.</p>
                        </div>
                    </div>
                    
                    <div class="care-instructions">
                        <div class="care-section">
                            <h4><i class="ri-arrow-right-line"></i> Pre-Treatment Preparation</h4>
                            <ul class="care-list">
                                <li>Avoid retinoids and strong acids 5-7 days prior to treatment</li>
                                <li>No sun exposure or tanning 48 hours before appointment</li>
                                <li>Discontinue skincare acids (AHA, BHA, glycolic) for 1 week</li>
                                <li>Arrive with clean, product-free skin (gentle cleanser only)</li>
                                <li>Avoid waxing or aggressive exfoliation for 1 week</li>
                                <li>Inform us of any active skin conditions or infections</li>
                                <li>Avoid blood-thinning medications if medically safe</li>
                                <li>Stay well-hydrated and maintain healthy skin barrier</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Post-Treatment Care</h4>
                            <ul class="care-list">
                                <li>Gentle cleansing only for 72 hours (no harsh scrubbing)</li>
                                <li>SPF 30+ daily protection essential for 2 weeks minimum</li>
                                <li>Avoid makeup for 24 hours post-treatment</li>
                                <li>Healing typically complete in 3-5 days</li>
                                <li>Use only recommended gentle, fragrance-free moisturizers</li>
                                <li>Avoid retinoids and acids for 1 week post-treatment</li>
                                <li>No swimming, saunas, or excessive sweating for 48 hours</li>
                                <li>Schedule follow-up treatments 4-6 weeks apart for optimal results</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="tel:+12016394983" class="modal-cta-btn">
                            <span>Book Treatment</span>
                            <i class="ri-phone-line"></i>
                        </a>
                    </div>
                `
            },
            'prp-therapy': {
                title: 'PRP & Regenerative Therapy',
                html: `
                    <div class="service-overview">
                        <h3>Natural Regenerative Medicine</h3>
                        <p>Using your body's own healing factors for skin rejuvenation and tissue repair.</p>
                    </div>
                    
                    <div class="services-list">
                        <div class="service-item">
                            <div class="service-header">
                                <h4>PRP (Platelet-Rich Plasma)</h4>
                                <div class="service-price">$800</div>
                            </div>
                            <p>Natural regenerative therapy using your platelets. Duration: 90 mins. Results: 2-4 weeks.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Profhilo Treatment</h4>
                                <div class="service-price">$600</div>
                            </div>
                            <p>Bio-remodeling therapy for skin quality. Duration: 45 mins. Results: 4-6 weeks.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Salmon Sperm DNA Therapy</h4>
                                <div class="service-price">$600</div>
                            </div>
                            <p>Innovative DNA repair treatment. Duration: 60 mins. Results: 3-4 weeks.</p>
                        </div>
                    </div>
                    
                    <div class="care-instructions">
                        <div class="care-section">
                            <h4><i class="ri-arrow-right-line"></i> Pre-Treatment Preparation</h4>
                            <ul class="care-list">
                                <li>Avoid anti-inflammatory medications 1 week prior (if medically safe)</li>
                                <li>Stay well-hydrated leading up to treatment</li>
                                <li>Maintain healthy diet rich in nutrients and antioxidants</li>
                                <li>No blood thinners if medically safe (consult your physician)</li>
                                <li>Avoid excessive alcohol consumption 48 hours prior</li>
                                <li>Get adequate sleep before treatment day</li>
                                <li>Discontinue supplements that affect blood clotting</li>
                                <li>Arrive well-rested and properly nourished</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Post-Treatment Care</h4>
                            <ul class="care-list">
                                <li>Avoid direct sun exposure for 48 hours minimum</li>
                                <li>Use gentle skincare routine for 1 week</li>
                                <li>No intense exercise for 24 hours post-treatment</li>
                                <li>Results develop progressively over 2-4 weeks</li>
                                <li>Apply SPF 30+ daily for optimal healing</li>
                                <li>Avoid saunas, steam rooms for 48 hours</li>
                                <li>Follow recommended treatment series for best results</li>
                                <li>Stay hydrated to support natural healing process</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="tel:+12016394983" class="modal-cta-btn">
                            <span>Book Treatment</span>
                            <i class="ri-phone-line"></i>
                        </a>
                    </div>
                `
            },
            'chemical-peels': {
                title: 'Chemical Peels & Mesotherapy',
                html: `
                    <div class="service-overview">
                        <h3>Professional Skin Resurfacing</h3>
                        <p>Medical-grade peeling treatments for skin renewal and radiant complexion.</p>
                    </div>
                    
                    <div class="services-list">
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Chemical Peel - Single</h4>
                                <div class="service-price">$350</div>
                            </div>
                            <p>Professional resurfacing treatment. Duration: 60 mins. Results: 1-2 weeks.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Chemical Peel - Package of 3</h4>
                                <div class="service-price">$900</div>
                            </div>
                            <p>Three-peel series for optimal results. Save $150 vs individual treatments.</p>
                        </div>
                        
                        <div class="service-item">
                            <div class="service-header">
                                <h4>Mesotherapy</h4>
                                <div class="service-price">$400<small>/area</small></div>
                            </div>
                            <p>Targeted micro-injection therapy. Duration: 45 mins. Results: 2-3 weeks.</p>
                        </div>
                    </div>
                    
                    <div class="care-instructions">
                        <div class="care-section">
                            <h4><i class="ri-arrow-right-line"></i> Pre-Treatment Preparation</h4>
                            <ul class="care-list">
                                <li>Avoid retinoids and strong acids 7 days prior to treatment</li>
                                <li>No waxing or aggressive exfoliation for 5 days before</li>
                                <li>Sun avoidance for 2 weeks before treatment</li>
                                <li>Discontinue certain medications as advised by our team</li>
                                <li>Arrive with completely clean, product-free skin</li>
                                <li>Avoid active breakouts in treatment area</li>
                                <li>No recent cosmetic procedures in treatment area</li>
                                <li>Inform us of any skin sensitivities or allergies</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Post-Treatment Care</h4>
                            <ul class="care-list">
                                <li>Gentle cleansing only with mild, fragrance-free products</li>
                                <li>Strict sun protection (SPF 50+) for 2 weeks minimum</li>
                                <li>No picking or peeling of treated skin - let it shed naturally</li>
                                <li>Peeling process typically occurs 3-7 days post-treatment</li>
                                <li>Use only recommended moisturizers and serums</li>
                                <li>Avoid makeup for 24-48 hours as tolerated</li>
                                <li>No retinoids or acids for 1-2 weeks post-treatment</li>
                                <li>Schedule follow-up treatments 4-6 weeks apart</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="tel:+12016394983" class="modal-cta-btn">
                            <span>Book Treatment</span>
                            <i class="ri-phone-line"></i>
                        </a>
                    </div>
                `
            }
        };
        
        return serviceInfo[category] || {
            title: 'Service Information',
            html: '<p>Service details coming soon. Please call for more information.</p>'
        };
    }

    closeModal() {
        try {
            if (!this.isModalOpen) return;
            
            if (this.modal) {
                this.modal.classList.remove('active');
                
                setTimeout(() => {
                    this.modal.style.display = 'none';
                    this.isModalOpen = false;
                    document.body.style.overflow = '';
                }, 300);
            }
        } catch (error) {
            console.error('Modal close error:', error);
            // Force close
            this.isModalOpen = false;
            document.body.style.overflow = '';
        }
    }

    scrollToCategories() {
        if (this.categoriesSection) {
            this.categoriesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    addCardHover(card) {
        const glow = card.querySelector('.card-glow');
        const number = card.querySelector('.category-number');
        
        if (glow) {
            glow.style.opacity = '0.6';
        }
        
        if (number) {
            number.style.transform = 'scale(1.1)';
        }
    }

    removeCardHover(card) {
        const glow = card.querySelector('.card-glow');
        const number = card.querySelector('.category-number');
        
        if (glow) {
            glow.style.opacity = '';
        }
        
        if (number) {
            number.style.transform = '';
        }
    }

    handleResize() {
        this.detectDeviceCapability();
    }

    initAnimations() {
        // Simple intersection observer for reveals
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        // Observe category cards
        this.categoryCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.8s ease';
            observer.observe(card);
        });
    }
}

// Simplified initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        const servicesManager = new ServicesPageManager();
        
        // Add modal CTA button styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .modal-cta-btn {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                background: linear-gradient(135deg, #ff8c00, #ff6b35);
                color: white;
                border: none;
                border-radius: 16px;
                padding: 16px 32px;
                font-family: var(--font-inter);
                font-size: 16px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                box-shadow: 0 8px 20px rgba(255, 140, 0, 0.3);
            }
            
            .modal-cta-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 30px rgba(255, 140, 0, 0.4);
            }
        `;
        document.head.appendChild(modalStyles);
        
        console.log('Services Page Loaded Successfully');
        
    } catch (error) {
        console.error('Services page initialization error:', error);
    }
});
