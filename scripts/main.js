// Оптимизированная версия main.js
class PortfolioApp {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.createSakuraLeaves();
        this.setupSmoothScroll();
        this.setupProgressBars();
        this.setupLazyLoading();
        this.setupBlobElements();
    }

    // Оптимизированное создание листьев сакуры
    createSakuraLeaves() {
        const container = document.querySelector('.sakura-container');
        if (!container) return;

        const leafCount = 30; // Уменьшено для производительности
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'sakura-leaf';
            leaf.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-duration: ${20 + Math.random() * 15}s;
                animation-delay: ${Math.random() * 25}s;
            `;
            fragment.appendChild(leaf);
        }

        container.appendChild(fragment);
    }

    // Оптимизированная плавная прокрутка
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Оптимизированные прогресс-бары с Intersection Observer
    setupProgressBars() {
        const progressSections = document.querySelectorAll('.skills, .progress-card');
        if (!progressSections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '50px' 
        });

        progressSections.forEach(section => {
            observer.observe(section);
        });
    }

    animateProgressBars(container) {
        const progressBars = container.querySelectorAll('.skill-level, .progress-fill');
        
        progressBars.forEach(bar => {
            const finalWidth = bar.style.width || getComputedStyle(bar).width;
            bar.style.width = '0%';
            
            requestAnimationFrame(() => {
                bar.style.width = finalWidth;
            });
        });
    }

    // Ленивая загрузка изображений
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        const image = new Image();
        image.src = src;
        image.onload = () => {
            img.src = src;
            img.classList.remove('lazy');
        };
        image.onerror = () => {
            console.warn('Failed to load image:', src);
        };
    }

    // Создание blob элементов
    setupBlobElements() {
        const body = document.body;
        const blob1 = document.createElement('div');
        const blob2 = document.createElement('div');

        blob1.className = 'blob blob-1';
        blob2.className = 'blob blob-2';

        body.appendChild(blob1);
        body.appendChild(blob2);
    }

    // Утилита для debounce
    debounce(func, wait) {
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
}

// Инициализация при полной загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
} else {
    window.portfolioApp = new PortfolioApp();
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
