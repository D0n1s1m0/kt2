// main.js - Полный JavaScript с быстрой навигацией

class FastNavigation {
    constructor() {
        this.cache = new Map();
        this.preloadQueue = new Set();
        this.isNavigating = false;
        this.init();
    }

    init() {
        this.createLoadingIndicator();
        this.setupEventListeners();
        this.preloadVisibleLinks();
        this.cacheCurrentPage();
        
        console.log('🚀 Fast Navigation initialized');
    }

    createLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'fast-nav-loading';
        document.body.appendChild(this.loadingIndicator);
    }

    setupEventListeners() {
        // Предзагрузка при наведении
        document.addEventListener('mouseover', this.handleLinkHover.bind(this));
        document.addEventListener('touchstart', this.handleLinkTouch.bind(this));
        
        // Быстрые переходы по клику
        document.addEventListener('click', this.handleLinkClick.bind(this));
        
        // Навигация браузера
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        // Предзагрузка при видимости ссылок
        this.setupIntersectionObserver();
    }

    handleLinkHover(e) {
        const link = e.target.closest('a');
        if (this.isPreloadable(link)) {
            this.schedulePreload(link.href);
        }
    }

    handleLinkTouch(e) {
        const link = e.target.closest('a');
        if (this.isPreloadable(link)) {
            this.preloadPage(link.href);
        }
    }

    handleLinkClick(e) {
        const link = e.target.closest('a');
        
        if (link && this.isPreloadable(link)) {
            e.preventDefault();
            this.navigate(link.href);
        }
    }

    handlePopState() {
        this.loadPage(window.location.href, false);
    }

    isPreloadable(link) {
        return link && 
               link.href &&
               link.hostname === window.location.hostname &&
               !link.hash &&
               link.target !== '_blank' &&
               !link.download &&
               !link.href.includes('mailto:') &&
               !link.href.includes('tel:');
    }

    schedulePreload(url) {
        if (!this.cache.has(url) && !this.preloadQueue.has(url)) {
            this.preloadQueue.add(url);
            setTimeout(() => {
                if (this.preloadQueue.has(url)) {
                    this.preloadPage(url);
                }
            }, 50);
        }
    }

    async preloadPage(url) {
        if (this.cache.has(url)) return;

        try {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            
            if (response.ok) {
                const html = await response.text();
                this.cachePage(url, html);
                this.preloadQueue.delete(url);
            }
        } catch (error) {
            console.warn('Preload failed:', error);
            this.preloadQueue.delete(url);
        }
    }

    cachePage(url, html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('main')?.innerHTML || doc.body.innerHTML;
        
        this.cache.set(url, {
            content: content,
            title: doc.title,
            timestamp: Date.now()
        });
        
        this.cleanupCache();
    }

    cleanupCache() {
        const MAX_CACHE_SIZE = 5;
        if (this.cache.size > MAX_CACHE_SIZE) {
            const oldest = [...this.cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
            this.cache.delete(oldest[0]);
        }
    }

    cacheCurrentPage() {
        this.cachePage(window.location.href, document.documentElement.outerHTML);
    }

    async navigate(url) {
        if (this.isNavigating) return;
        
        this.isNavigating = true;
        this.showLoading();
        
        try {
            await this.loadPage(url, true);
        } catch (error) {
            console.error('Navigation failed:', error);
            window.location.href = url;
        } finally {
            this.isNavigating = false;
            this.hideLoading();
        }
    }

    async loadPage(url, pushState = true) {
        // Показываем анимацию исчезновения
        this.fadeOutContent();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Загружаем контент
        let content, title;
        
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            content = cached.content;
            title = cached.title;
        } else {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            
            if (!response.ok) throw new Error('Network error');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            content = doc.querySelector('main')?.innerHTML || doc.body.innerHTML;
            title = doc.title;
            
            this.cachePage(url, html);
        }
        
        // Обновляем страницу
        this.updateContent(content, title);
        
        if (pushState) {
            window.history.pushState({}, '', url);
        }
        
        // Обновляем навигацию
        this.updateNavigation();
        
        // Инициализируем новую страницу
        this.initializePage();
        
        // Показываем анимацию появления
        this.fadeInContent();
        
        // Скроллим наверх
        window.scrollTo(0, 0);
    }

    fadeOutContent() {
        const main = document.querySelector('main');
        if (main) {
            main.style.opacity = '0';
            main.style.transform = 'translateY(10px)';
            main.style.transition = 'all 0.15s ease-out';
        }
    }

    fadeInContent() {
        const main = document.querySelector('main');
        if (main) {
            setTimeout(() => {
                main.style.opacity = '1';
                main.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    updateContent(content, title) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = content;
        }
        document.title = title;
    }

    updateNavigation() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.header-nav a').forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.toggle('active', linkPath === currentPath);
        });
    }

    initializePage() {
        // Инициализируем специфичные для страницы компоненты
        this.initializePageComponents();
        
        // Переинициализируем общие компоненты
        this.reinitializeComponents();
        
        // Триггерим событие смены страницы
        window.dispatchEvent(new CustomEvent('pagechanged'));
    }

    initializePageComponents() {
        const path = window.location.pathname;
        
        if (path.includes('projects')) {
            this.initializeProjects();
        } else if (path.includes('diary')) {
            this.initializeDiary();
        } else if (path.includes('contacts')) {
            this.initializeContacts();
        }
    }

    initializeProjects() {
        // Инициализация фильтров проектов
        const filters = document.querySelector('.projects-filters');
        if (filters) {
            this.initializeProjectFilters();
        }
    }

    initializeDiary() {
        // Инициализация формы дневника
        const form = document.getElementById('diaryForm');
        if (form) {
            this.initializeDiaryForm();
        }
    }

    initializeContacts() {
        // Инициализация формы контактов
        const form = document.getElementById('contactForm');
        if (form) {
            this.initializeContactForm();
        }
    }

    initializeProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    initializeDiaryForm() {
        const form = document.getElementById('diaryForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDiarySubmit(e);
            });
        }
    }

    initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e);
            });
        }
    }

    handleDiarySubmit(e) {
        const formData = new FormData(e.target);
        const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        
        entries.unshift({
            id: Date.now(),
            date: formData.get('entryDate'),
            title: formData.get('entryTitle'),
            description: formData.get('entryDescription'),
            status: formData.get('entryStatus')
        });
        
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        e.target.reset();
        
        this.showNotification('Запись добавлена!', 'success');
    }

    handleContactSubmit(e) {
        const formData = new FormData(e.target);
        
        // Имитация отправки
        setTimeout(() => {
            this.showNotification('Сообщение отправлено!', 'success');
            e.target.reset();
        }, 1000);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--accent-color);
            color: white;
            border-radius: var(--border-radius);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    reinitializeComponents() {
        // Переинициализация общих компонентов
        this.initializeThemeSwitcher();
        this.initializeSmoothScroll();
        this.initializeAnimations();
    }

    initializeThemeSwitcher() {
        const themeSwitcher = document.querySelector('.theme-switcher');
        const themePanel = document.querySelector('.theme-panel');
        
        if (themeSwitcher && themePanel) {
            themeSwitcher.addEventListener('click', (e) => {
                e.stopPropagation();
                themePanel.classList.toggle('active');
            });
            
            document.addEventListener('click', () => {
                themePanel.classList.remove('active');
            });
            
            themePanel.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', () => {
                    const theme = option.dataset.theme;
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                    themePanel.classList.remove('active');
                });
            });
        }
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    initializeAnimations() {
        // Инициализация анимаций при скролле
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        });
        
        document.querySelectorAll('.project-card, .skill').forEach(el => {
            observer.observe(el);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target.closest('a');
                    if (this.isPreloadable(link)) {
                        this.preloadPage(link.href);
                    }
                }
            });
        });
        
        document.querySelectorAll('.header-nav a, .project-card a').forEach(link => {
            observer.observe(link);
        });
    }

    showLoading() {
        this.loadingIndicator.classList.add('active');
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('active');
    }

    // Публичные методы
    preloadAll() {
        document.querySelectorAll('.header-nav a').forEach(link => {
            if (this.isPreloadable(link)) {
                this.preloadPage(link.href);
            }
        });
    }

    clearCache() {
        this.cache.clear();
        this.cacheCurrentPage();
    }
}

// Инициализация приложения
class PortfolioApp {
    constructor() {
        this.fastNav = null;
        this.init();
    }

    init() {
        // Загружаем сохраненную тему
        this.loadTheme();
        
        // Инициализируем быструю навигацию
        this.fastNav = new FastNavigation();
        
        // Инициализируем дополнительные компоненты
        this.initializeComponents();
        
        console.log('🎯 Portfolio App initialized');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'orange';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    initializeComponents() {
        // Инициализация сакуры
        this.initializeSakura();
        
        // Предзагрузка всех страниц через 2 секунды
        setTimeout(() => {
            this.fastNav.preloadAll();
        }, 2000);
    }

    initializeSakura() {
        const container = document.querySelector('.sakura-container');
        if (!container) return;
        
        for (let i = 0; i < 15; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'sakura-leaf';
            leaf.style.left = `${Math.random() * 100}%`;
            leaf.style.animationDuration = `${15 + Math.random() * 10}s`;
            leaf.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(leaf);
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PortfolioApp();
});

// Service Worker для оффлайн-работы (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
