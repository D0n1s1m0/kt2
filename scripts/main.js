// main.js - Полный файл JavaScript для сайта-портфолио

// Класс для управления плавными переходами между страницами
class PageTransition {
    constructor() {
        this.transitionElement = null;
        this.init();
    }

    init() {
        this.createTransitionElement();
        this.handleLinkClicks();
        this.handleBrowserNavigation();
        this.addPageLoadClass();
    }

    createTransitionElement() {
        this.transitionElement = document.createElement('div');
        this.transitionElement.className = 'page-transition';
        document.body.appendChild(this.transitionElement);
    }

    handleLinkClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (link && link.href && this.isInternalLink(link)) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });
    }

    handleBrowserNavigation() {
        window.addEventListener('popstate', () => {
            this.showPageTransition();
        });
    }

    isInternalLink(link) {
        return link.hostname === window.location.hostname && 
               !link.hash && 
               link.target !== '_blank' &&
               !link.download &&
               !link.href.includes('mailto:') &&
               !link.href.includes('tel:');
    }

    navigateTo(url) {
        this.showPageTransition();
        
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }

    showPageTransition() {
        if (this.transitionElement) {
            this.transitionElement.classList.add('active');
            
            setTimeout(() => {
                this.transitionElement.classList.remove('active');
            }, 800);
        }
    }

    addPageLoadClass() {
        document.body.classList.add('page-load');
        
        setTimeout(() => {
            document.body.classList.remove('page-load');
        }, 600);
    }
}

// Класс для управления темами
class ThemeManager {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.themePanel = null;
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeSwitcher();
        this.addSystemThemeListener();
    }

    getSavedTheme() {
        const saved = localStorage.getItem('theme');
        return saved || 'orange';
    }

    applyTheme(themeName) {
        // Добавляем плавный переход для темы
        document.documentElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', themeName);
            this.currentTheme = themeName;
            localStorage.setItem('theme', themeName);
            
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 500);
            
            this.updateActiveThemeButton();
            this.updateSakuraLeaves();
        }, 10);
    }

    createThemeSwitcher() {
        // Создаем кнопку переключения темы
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.setAttribute('aria-label', 'Переключить тему');
        themeSwitcher.innerHTML = '<div class="theme-switcher-icon">🎨</div>';
        
        // Создаем панель выбора темы
        this.themePanel = document.createElement('div');
        this.themePanel.className = 'theme-panel';
        this.themePanel.setAttribute('aria-label', 'Выбор темы оформления');
        
        const themes = [
            { name: 'orange', icon: '🍊', label: 'Оранжевая тема' },
            { name: 'beige', icon: '🟫', label: 'Бежевая тема' },
            { name: 'dark', icon: '🌙', label: 'Темная тема' },
            { name: 'green', icon: '🌿', label: 'Зеленая тема' },
            { name: 'blue', icon: '💙', label: 'Синяя тема' },
            { name: 'pink', icon: '🌸', label: 'Розовая тема' },
            { name: 'purple', icon: '☂️', label: 'Фиолетовая тема' }
        ];
        
        themes.forEach(theme => {
            const themeOption = document.createElement('button');
            themeOption.className = `theme-option theme-${theme.name}`;
            themeOption.setAttribute('data-theme', theme.name);
            themeOption.setAttribute('aria-label', theme.label);
            themeOption.setAttribute('title', theme.label);
            themeOption.innerHTML = theme.icon;
            themeOption.setAttribute('type', 'button');
            
            themeOption.addEventListener('click', () => {
                this.applyTheme(theme.name);
                this.hideThemePanel();
            });
            
            this.themePanel.appendChild(themeOption);
        });
        
        document.body.appendChild(themeSwitcher);
        document.body.appendChild(this.themePanel);
        
        // Обработчики событий
        themeSwitcher.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleThemePanel();
        });
        
        // Закрытие панели при клике вне ее
        document.addEventListener('click', (e) => {
            if (!this.themePanel.contains(e.target) && !themeSwitcher.contains(e.target)) {
                this.hideThemePanel();
            }
        });
        
        // Закрытие панели по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideThemePanel();
            }
        });
    }

    toggleThemePanel() {
        this.themePanel.classList.toggle('active');
        
        if (this.themePanel.classList.contains('active')) {
            // Фокусируем первую кнопку темы при открытии
            const firstThemeButton = this.themePanel.querySelector('.theme-option');
            if (firstThemeButton) {
                firstThemeButton.focus();
            }
        }
    }

    hideThemePanel() {
        this.themePanel.classList.remove('active');
    }

    updateActiveThemeButton() {
        const themeButtons = this.themePanel.querySelectorAll('.theme-option');
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-theme') === this.currentTheme) {
                button.classList.add('active');
                button.setAttribute('aria-current', 'true');
            } else {
                button.removeAttribute('aria-current');
            }
        });
    }

    updateSakuraLeaves() {
        const leaves = document.querySelectorAll('.sakura-leaf');
        leaves.forEach(leaf => {
            leaf.style.transition = 'background-color 0.5s ease';
        });
    }

    addSystemThemeListener() {
        // Автоматическое переключение темы при изменении системных настроек
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            if (!localStorage.getItem('theme')) {
                // Применяем системную тему только если пользователь не выбрал тему вручную
                this.applyTheme(e.matches ? 'dark' : 'orange');
            }
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
}

// Класс для управления фильтрами проектов
class ProjectsFilter {
    constructor() {
        this.filterButtons = null;
        this.projectCards = null;
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        if (this.filterButtons.length > 0) {
            this.setupEventListeners();
            this.setInitialFilter();
        }
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setActiveFilter(filter);
                this.filterProjects(filter);
            });
        });
    }

    setInitialFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        if (activeButton) {
            this.activeFilter = activeButton.getAttribute('data-filter') || 'all';
        }
    }

    setActiveFilter(filter) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-filter') === filter) {
                button.classList.add('active');
            }
        });
        this.activeFilter = filter;
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                this.showProject(card);
            } else {
                this.hideProject(card);
            }
        });
    }

    showProject(card) {
        card.style.display = 'block';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }

    hideProject(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }
}

// Класс для управления анимацией листьев сакуры
class SakuraAnimation {
    constructor() {
        this.container = null;
        this.leafCount = 25;
        this.init();
    }

    init() {
        this.createContainer();
        this.generateLeaves();
        this.startAnimation();
    }

    createContainer() {
        this.container = document.querySelector('.sakura-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'sakura-container';
            document.body.appendChild(this.container);
        }
    }

    generateLeaves() {
        // Очищаем существующие листья
        this.container.innerHTML = '';
        
        for (let i = 0; i < this.leafCount; i++) {
            const leaf = this.createLeaf(i);
            this.container.appendChild(leaf);
        }
    }

    createLeaf(index) {
        const leaf = document.createElement('div');
        const leafType = (index % 5) + 1;
        
        leaf.className = `sakura-leaf type-${leafType}`;
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDelay = `${Math.random() * 20}s`;
        
        // Добавляем небольшую случайную задержку для разнообразия
        leaf.style.animationDelay = `${Math.random() * 15}s`;
        
        return leaf;
    }

    startAnimation() {
        // Анимация запускается автоматически через CSS
        // Этот метод можно использовать для перезапуска анимации при необходимости
    }

    updateLeavesForTheme() {
        // Метод для обновления листьев при смене темы
        this.generateLeaves();
    }
}

// Класс для управления анимацией прогресс-баров
class ProgressBarAnimation {
    constructor() {
        this.progressBars = null;
        this.init();
    }

    init() {
        this.progressBars = document.querySelectorAll('.skill-level, .progress-fill');
        this.animateOnScroll();
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        this.progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    animateProgressBar(bar) {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 300);
    }
}

// Класс для управления формой обратной связи
class ContactForm {
    constructor() {
        this.form = null;
        this.init();
    }

    init() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.setupValidation();
            this.setupSubmission();
        }
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + 'Error');
        
        // Очищаем предыдущие ошибки
        this.clearError(field);
        
        // Проверка обязательных полей
        if (field.hasAttribute('required') && !value) {
            this.showError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        // Специфические проверки
        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showError(field, 'Введите корректный email адрес');
                    return false;
                }
                break;
                
            case 'text':
                if (field.id === 'name' && value.length < 2) {
                    this.showError(field, 'Имя должно содержать минимум 2 символа');
                    return false;
                }
                break;
                
            case 'textarea':
                if (field.id === 'message' && value.length < 10) {
                    this.showError(field, 'Сообщение должно содержать минимум 10 символов');
                    return false;
                }
                break;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Показываем состояние загрузки
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;
        
        try {
            // Имитация отправки формы (замените на реальный endpoint)
            await this.simulateApiCall(formData);
            
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            this.showErrorMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        } finally {
            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async simulateApiCall(formData) {
        // Имитация задержки сети
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% шанс успешной отправки для демонстрации
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    showSuccessMessage() {
        this.showMessage('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(text, type) {
        // Создаем элемент сообщения
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = text;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            messageElement.style.background = 'var(--accent-color)';
        } else {
            messageElement.style.background = '#e74c3c';
        }
        
        document.body.appendChild(messageElement);
        
        // Анимация появления
        setTimeout(() => {
            messageElement.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            messageElement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 5000);
    }
}

// Класс для управления дневником обучения
class StudyDiary {
    constructor() {
        this.form = null;
        this.entriesList = null;
        this.init();
    }

    init() {
        this.form = document.getElementById('diaryForm');
        this.entriesList = document.querySelector('.entries-list');
        
        if (this.form) {
            this.setupForm();
            this.loadEntries();
        }
    }

    setupForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEntry();
        });
        
        // Устанавливаем сегодняшнюю дату по умолчанию
        const dateInput = document.getElementById('entryDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    addEntry() {
        const formData = {
            date: document.getElementById('entryDate').value,
            title: document.getElementById('entryTitle').value,
            description: document.getElementById('entryDescription').value,
            status: document.getElementById('entryStatus').value
        };
        
        if (this.validateEntry(formData)) {
            this.saveEntry(formData);
            this.renderEntry(formData);
            this.form.reset();
            
            // Сбрасываем дату на сегодняшнюю
            document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
        }
    }

    validateEntry(data) {
        if (!data.date || !data.title || !data.status) {
            alert('Пожалуйста, заполните все обязательные поля');
            return false;
        }
        return true;
    }

    saveEntry(entry) {
        const entries = this.getEntries();
        entries.unshift({
            ...entry,
            id: Date.now().toString()
        });
        localStorage.setItem('studyDiaryEntries', JSON.stringify(entries));
    }

    getEntries() {
        const entries = localStorage.getItem('studyDiaryEntries');
        return entries ? JSON.parse(entries) : [];
    }

    renderEntry(entry) {
        const entryElement = document.createElement('article');
        entryElement.className = `entry-item ${entry.status}`;
        entryElement.innerHTML = `
            <div class="entry-date">${this.formatDate(entry.date)}</div>
            <h3 class="entry-title">${this.escapeHtml(entry.title)}</h3>
            <p class="entry-description">${this.escapeHtml(entry.description)}</p>
            <span class="entry-status">${this.getStatusText(entry.status)}</span>
        `;
        
        if (this.entriesList) {
            this.entriesList.insertBefore(entryElement, this.entriesList.firstChild);
        }
    }

    loadEntries() {
        const entries = this.getEntries();
        entries.forEach(entry => this.renderEntry(entry));
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    getStatusText(status) {
        const statusMap = {
            'planned': '📅 Запланировано',
            'in-progress': '⏳ В процессе',
            'completed': '✓ Завершено'
        };
        return statusMap[status] || status;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Класс для управления плавной прокруткой
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnchorLinks();
        this.setupScrollAnimations();
    }

    setupAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });
    }

    scrollToElement(element) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Наблюдаем за элементами, которые должны анимироваться при скролле
        document.querySelectorAll('.project-card, .skill, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }
}

// Класс для управления декоративными элементами
class DecorativeElements {
    constructor() {
        this.init();
    }

    init() {
        this.addBlobs();
        this.addParticles();
    }

    addBlobs() {
        const blobs = [
            { className: 'blob blob-1', size: '400px' },
            { className: 'blob blob-2', size: '500px' },
            { className: 'blob blob-3', size: '300px' }
        ];

        blobs.forEach(blob => {
            const element = document.createElement('div');
            element.className = blob.className;
            element.style.width = blob.size;
            element.style.height = blob.size;
            document.body.appendChild(element);
        });
    }

    addParticles() {
        // Можно добавить дополнительные декоративные элементы при необходимости
    }
}

// Главный класс приложения
class PortfolioApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Инициализируем все модули
        this.modules.pageTransition = new PageTransition();
        this.modules.themeManager = new ThemeManager();
        this.modules.sakuraAnimation = new SakuraAnimation();
        this.modules.smoothScroll = new SmoothScroll();
        this.modules.decorativeElements = new DecorativeElements();
        
        // Инициализируем модули для конкретных страниц
        this.initPageSpecificModules();
        
        // Устанавливаем глобальные обработчики
        this.setupGlobalHandlers();
        
        console.log('Portfolio App initialized successfully!');
    }

    initPageSpecificModules() {
        // Проекты - фильтрация
        if (document.querySelector('.projects-filters')) {
            this.modules.projectsFilter = new ProjectsFilter();
        }
        
        // Контакты - форма
        if (document.getElementById('contactForm')) {
            this.modules.contactForm = new ContactForm();
        }
        
        // Дневник - управление записями
        if (document.getElementById('diaryForm')) {
            this.modules.studyDiary = new StudyDiary();
        }
        
        // Навыки - анимация прогресс-баров
        if (document.querySelector('.skill-level')) {
            this.modules.progressBarAnimation = new ProgressBarAnimation();
        }
    }

    setupGlobalHandlers() {
        // Обработчик для обновления активной ссылки в навигации
        this.updateActiveNavLink();
        
        // Обработчик для ленивой загрузки изображений
        this.setupLazyLoading();
        
        // Обработчик для улучшения производительности
        this.setupPerformanceOptimizations();
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.header-nav a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupPerformanceOptimizations() {
        // Предзагрузка критических ресурсов
        this.preloadCriticalResources();
        
        // Оптимизация для мобильных устройств
        this.optimizeForMobile();
    }

    preloadCriticalResources() {
        // Можно добавить предзагрузку важных ресурсов
    }

    optimizeForMobile() {
        // Оптимизации для мобильных устройств
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }
}

// Инициализация приложения когда DOM полностью загружен
document.addEventListener('DOMContentLoaded', function() {
    // Создаем экземпляр приложения
    window.portfolioApp = new PortfolioApp();
    
    // Добавляем глобальные обработчики ошибок
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });
});

// Service Worker для оффлайн-работы (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Экспортируем классы для использования в других модулях (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PortfolioApp,
        ThemeManager,
        PageTransition,
        ProjectsFilter,
        SakuraAnimation,
        ContactForm,
        StudyDiary
    };
}
