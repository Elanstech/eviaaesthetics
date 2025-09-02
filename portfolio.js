// Portfolio Page JavaScript

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
    
    // Initialize portfolio functionality
    initializePortfolio();
    initializeComparisonSliders();
    initializeFilterSystem();
    initializeLoadMore();
    
});

// Portfolio Initialization
function initializePortfolio() {
    console.log('Portfolio initialized');
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Before/After Comparison Sliders
function initializeComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const container = slider.closest('.comparison-container');
        const afterImage = container.querySelector('.after-image');
        let isDragging = false;
        
        // Initial position
        updateSliderPosition(slider, afterImage, 50);
        
        // Mouse events
        slider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events for mobile
        slider.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
        
        // Keyboard support
        slider.addEventListener('keydown', handleKeyboard);
        slider.setAttribute('tabindex', '0');
        slider.setAttribute('role', 'slider');
        slider.setAttribute('aria-valuemin', '0');
        slider.setAttribute('aria-valuemax', '100');
        slider.setAttribute('aria-valuenow', '50');
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            slider.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            const containerRect = container.getBoundingClientRect();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const percentage = ((clientX - containerRect.left) / containerRect.width) * 100;
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            
            updateSliderPosition(slider, afterImage, clampedPercentage);
        }
        
        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            slider.style.cursor = 'grab';
            document.body.style.userSelect = '';
        }
        
        function handleKeyboard(e) {
            const currentValue = parseFloat(slider.getAttribute('aria-valuenow'));
            let newValue = currentValue;
            
            switch(e.key) {
                case 'ArrowLeft':
                    newValue = Math.max(0, currentValue - 5);
                    break;
                case 'ArrowRight':
                    newValue = Math.min(100, currentValue + 5);
                    break;
                case 'Home':
                    newValue = 0;
                    break;
                case 'End':
                    newValue = 100;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            updateSliderPosition(slider, afterImage, newValue);
        }
        
        // Auto-demo on hover (optional)
        let autoDemo;
        container.addEventListener('mouseenter', () => {
            if (!isDragging) {
                autoDemo = setTimeout(() => {
                    animateSlider(slider, afterImage);
                }, 1000);
            }
        });
        
        container.addEventListener('mouseleave', () => {
            clearTimeout(autoDemo);
        });
    });
}

function updateSliderPosition(slider, afterImage, percentage) {
    const container = slider.closest('.comparison-container');
    const containerRect = container.getBoundingClientRect();
    
    // Update slider position
    slider.style.left = `${percentage}%`;
    
    // Update clip path for after image
    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    
    // Update aria-valuenow
    slider.setAttribute('aria-valuenow', percentage.toFixed(0));
    
    // Store position data
    slider.setAttribute('data-position', percentage);
}

function animateSlider(slider, afterImage) {
    const startPos = parseFloat(slider.getAttribute('data-position'));
    const endPos = startPos < 50 ? 80 : 20;
    const duration = 2000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentPos = startPos + (endPos - startPos) * easedProgress;
        updateSliderPosition(slider, afterImage, currentPos);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Return to original position
            setTimeout(() => {
                const returnStart = performance.now();
                function returnAnimate(currentTime) {
                    const elapsed = currentTime - returnStart;
                    const progress = Math.min(elapsed / 1000, 1);
                    const easedProgress = progress < 0.5 
                        ? 2 * progress * progress 
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    
                    const currentPos = endPos + (startPos - endPos) * easedProgress;
                    updateSliderPosition(slider, afterImage, currentPos);
                    
                    if (progress < 1) {
                        requestAnimationFrame(returnAnimate);
                    }
                }
                requestAnimationFrame(returnAnimate);
            }, 500);
        }
    }
    
    requestAnimationFrame(animate);
}

// Filter System
function initializeFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            filterPortfolioItems(portfolioItems, filter);
            
            // Add ripple effect
            createRippleEffect(button);
        });
    });
}

function filterPortfolioItems(items, filter) {
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            item.classList.remove('hidden');
            // Stagger animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        }
    });
    
    // Update visible count
    const visibleCount = document.querySelectorAll('.portfolio-item:not(.hidden)').length;
    console.log(`Showing ${visibleCount} items for filter: ${filter}`);
}

function createRippleEffect(button) {
    const ripple = document.createElement('div');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        margin-left: ${-size/2}px;
        margin-top: ${-size/2}px;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not already present
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Load More Functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!loadMoreBtn) return;
    
    let loadedCount = 6; // Initial number of items to show
    const itemsPerLoad = 3;
    
    // Hide extra items initially
    hideExtraItems();
    
    loadMoreBtn.addEventListener('click', () => {
        loadMoreItems();
        addButtonAnimation(loadMoreBtn);
    });
    
    function hideExtraItems() {
        const allItems = portfolioGrid.querySelectorAll('.portfolio-item');
        allItems.forEach((item, index) => {
            if (index >= loadedCount) {
                item.style.display = 'none';
            }
        });
        
        updateLoadMoreButton();
    }
    
    function loadMoreItems() {
        const allItems = portfolioGrid.querySelectorAll('.portfolio-item');
        const hiddenItems = Array.from(allItems).filter(item => 
            item.style.display === 'none'
        );
        
        // Show next batch of items
        hiddenItems.slice(0, itemsPerLoad).forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                // Trigger animation
                requestAnimationFrame(() => {
                    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            }, index * 150);
        });
        
        loadedCount += itemsPerLoad;
        
        // Update button state
        setTimeout(() => {
            updateLoadMoreButton();
        }, 500);
    }
    
    function updateLoadMoreButton() {
        const allItems = portfolioGrid.querySelectorAll('.portfolio-item');
        const hiddenItems = Array.from(allItems).filter(item => 
            item.style.display === 'none'
        );
        
        if (hiddenItems.length === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.querySelector('span').textContent = 
                `Load ${Math.min(itemsPerLoad, hiddenItems.length)} More`;
        }
    }
}

function addButtonAnimation(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.15s ease';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        observer.observe(item);
    });
}

// Performance optimization: Debounced resize handler
function initializeResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate slider positions on resize
            document.querySelectorAll('.comparison-slider').forEach(slider => {
                const afterImage = slider.closest('.comparison-container')
                    .querySelector('.after-image');
                const currentPosition = parseFloat(slider.getAttribute('data-position'));
                updateSliderPosition(slider, afterImage, currentPosition);
            });
        }, 250);
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Portfolio-specific utility functions
function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio-gallery');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openFullscreenComparison(portfolioItem) {
    // Create fullscreen modal for better comparison viewing
    const modal = document.createElement('div');
    modal.className = 'fullscreen-comparison-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeFullscreenModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeFullscreenModal()">
                <i class="ri-close-line"></i>
            </button>
            <div class="fullscreen-comparison">
                ${portfolioItem.querySelector('.portfolio-comparison').innerHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Reinitialize slider for fullscreen
    initializeComparisonSliders();
}

function closeFullscreenModal() {
    const modal = document.querySelector('.fullscreen-comparison-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Add modal styles
const modalStyles = `
    .fullscreen-comparison-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
    }
    
    .modal-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 100px rgba(0, 0, 0, 0.5);
    }
    
    .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1001;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        color: #333;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: white;
        transform: scale(1.1);
    }
    
    .fullscreen-comparison {
        width: 80vw;
        height: 60vh;
        min-width: 600px;
        min-height: 400px;
    }
    
    @media (max-width: 768px) {
        .fullscreen-comparison {
            width: 95vw;
            height: 50vh;
            min-width: 300px;
            min-height: 250px;
        }
    }
`;

// Inject modal styles
if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = modalStyles;
    document.head.appendChild(style);
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeResizeHandler();
    initializeLazyLoading();
    
    // Add click handlers for fullscreen viewing
    document.querySelectorAll('.portfolio-comparison').forEach(comparison => {
        comparison.addEventListener('dblclick', () => {
            openFullscreenComparison(comparison.closest('.portfolio-item'));
        });
    });
});

// Export functions for global use
window.portfolioFunctions = {
    scrollToPortfolio,
    openFullscreenComparison,
    closeFullscreenModal,
    filterPortfolioItems
};
