// script.js - Мгновенные переходы между страницами

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
        
        console.log('🚀 Fast Navigation initialized - Instant transitions');
    }

    createLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'fast-nav-progress';
        document.body.appendChild(this.loadingIndicator);
    }

    setupEventListeners() {
        // Предзагрузка при наведении
        document.addEventListener('mouseover', this.handleLinkHover.bind(this));
        
        // Мгновенные переходы по клику
        document.addEventListener('click', this.handleLinkClick.bind(this));
        
        // Навигация браузера
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    handleLinkHover(e) {
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

    async preloadPage(url) {
        if (this.cache.has(url)) return;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const html = await response.text();
                this.cachePage(url, html);
            }
        } catch (error) {
            console.warn('Preload failed:', error);
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
            // Fallback к обычной навигации
            window.location.href = url;
        } finally {
            this.isNavigating = false;
            this.hideLoading();
        }
    }

    async loadPage(url, pushState = true) {
        // МИГНОВЕННАЯ СМЕНА - без анимаций
        
        // Загружаем контент
        let content, title;
        
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            content = cached.content;
            title = cached.title;
        } else {
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Network error');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            content = doc.querySelector('main')?.innerHTML || doc.body.innerHTML;
            title = doc.title;
            
            this.cachePage(url, html);
        }
        
        // МГНОВЕННОЕ обновление страницы
        this.updateContent(content, title);
        
        if (pushState) {
            window.history.pushState({}, '', url);
        }
        
        // Обновляем навигацию
        this.updateNavigation();
        
        // Инициализируем новую страницу
        this.initializePage();
        
        // Скроллим наверх мгновенно
        window.scrollTo(0, 0);
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
            const linkPath = new URL(link.href).pathname;
            link.classList.toggle('active', linkPath === currentPath);
        });
    }

    initializePage() {
        // Инициализируем специфичные для страницы компоненты
        this.initializePageComponents();
        
        // Переинициализируем общие компоненты
        this.reinitializeComponents();
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
        const filters = document.querySelector('.projects-filters');
        if (filters) {
            this.initializeProjectFilters();
        }
    }

    initializeDiary() {
        const form = document.getElementById('diaryForm');
        if (form) {
            this.initializeDiaryForm();
        }
    }

    initializeContacts() {
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
                    } else {
                        card.style.display = 'none';
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
        }, 500);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'success' ? 'notification-success' : ''}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 200);
        }, 2000);
    }

    reinitializeComponents() {
        this.initializeThemeSwitcher();
        this.initializeSmoothScroll();
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
                    
                    // Обновляем активную тему в панели
                    themePanel.querySelectorAll('.theme-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });
            
            // Устанавливаем активную тему в панели
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'orange';
            themePanel.querySelector(`.theme-option[data-theme="${currentTheme}"]`)?.classList.add('active');
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

    showLoading() {
        this.loadingIndicator.classList.add('loading');
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('loading');
    }

    preloadAll() {
        document.querySelectorAll('.header-nav a').forEach(link => {
            if (this.isPreloadable(link)) {
                this.preloadPage(link.href);
            }
        });
    }
}

// Инициализация приложения
class PortfolioApp {
    constructor() {
        this.fastNav = null;
        this.init();
    }

    init() {
        this.loadTheme();
        this.fastNav = new FastNavigation();
        this.initializeComponents();
        
        console.log('🎯 Portfolio App initialized - Instant mode');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'orange';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    initializeComponents() {
        this.initializeSakura();
        
        // Предзагрузка всех страниц сразу
        setTimeout(() => {
            this.fastNav.preloadAll();
        }, 100);
    }

    initializeSakura() {
        const container = document.querySelector('.sakura-container');
        if (!container) return;
        
        for (let i = 0; i < 15; i++) {
            const leaf = document.createElement('div');
            leaf.className = `sakura-leaf type-${Math.floor(Math.random() * 5) + 1}`;
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
