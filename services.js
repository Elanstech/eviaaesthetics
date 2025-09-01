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
                            <h4><i class="ri-arrow-right-line"></i> Before Treatment</h4>
                            <ul class="care-list">
                                <li>Avoid alcohol 24 hours before</li>
                                <li>No blood thinners (if medically safe)</li>
                                <li>Arrive with clean skin</li>
                                <li>Avoid aspirin for 1 week</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> After Treatment</h4>
                            <ul class="care-list">
                                <li>Don't touch treated areas for 4-6 hours</li>
                                <li>No exercise for 24 hours</li>
                                <li>Stay upright for 4 hours</li>
                                <li>Avoid heat/saunas for 24 hours</li>
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
                            <h4><i class="ri-arrow-right-line"></i> Program Preparation</h4>
                            <ul class="care-list">
                                <li>Complete medical history review</li>
                                <li>Comprehensive lab work</li>
                                <li>Goal setting consultation</li>
                                <li>Nutritional assessment</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> Ongoing Support</h4>
                            <ul class="care-list">
                                <li>Weekly check-ins initially</li>
                                <li>Monthly monitoring appointments</li>
                                <li>Nutritional guidance</li>
                                <li>Exercise recommendations</li>
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
                            <h4><i class="ri-arrow-right-line"></i> Before Treatment</h4>
                            <ul class="care-list">
                                <li>Stay well-hydrated (16-20oz water)</li>
                                <li>Eat light meal 2 hours prior</li>
                                <li>Wear comfortable clothing</li>
                                <li>List all medications</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> After Treatment</h4>
                            <ul class="care-list">
                                <li>Continue hydrating (32oz more water)</li>
                                <li>Avoid alcohol for 12 hours</li>
                                <li>Light activity only for 2 hours</li>
                                <li>Effects peak at 24-48 hours</li>
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
                            <h4><i class="ri-arrow-right-line"></i> Before Treatment</h4>
                            <ul class="care-list">
                                <li>Avoid retinoids 5-7 days prior</li>
                                <li>No sun exposure 48 hours before</li>
                                <li>Clean, product-free skin</li>
                                <li>No waxing for 1 week</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> After Treatment</h4>
                            <ul class="care-list">
                                <li>Gentle cleansing for 72 hours</li>
                                <li>SPF 30+ for 2 weeks minimum</li>
                                <li>No makeup for 24 hours</li>
                                <li>Healing complete in 3-5 days</li>
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
                            <h4><i class="ri-arrow-right-line"></i> Before Treatment</h4>
                            <ul class="care-list">
                                <li>No anti-inflammatory meds 1 week prior</li>
                                <li>Stay well-hydrated</li>
                                <li>Healthy diet rich in nutrients</li>
                                <li>Adequate sleep before treatment</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> After Treatment</h4>
                            <ul class="care-list">
                                <li>Avoid sun exposure for 48 hours</li>
                                <li>Gentle skincare for 1 week</li>
                                <li>No intense exercise for 24 hours</li>
                                <li>Results develop over 2-4 weeks</li>
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
                            <h4><i class="ri-arrow-right-line"></i> Before Treatment</h4>
                            <ul class="care-list">
                                <li>Avoid retinoids 7 days prior</li>
                                <li>No waxing for 5 days</li>
                                <li>Sun avoidance for 2 weeks</li>
                                <li>Clean, product-free skin</li>
                            </ul>
                        </div>
                        
                        <div class="care-section">
                            <h4><i class="ri-arrow-left-line"></i> After Treatment</h4>
                            <ul class="care-list">
                                <li>Gentle cleansing only</li>
                                <li>SPF 50+ for 2 weeks</li>
                                <li>No picking or peeling</li>
                                <li>Avoid makeup 24-48 hours</li>
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
