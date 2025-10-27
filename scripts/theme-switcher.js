// Система переключения тем
class ThemeSwitcher {
    constructor() {
        this.currentTheme = 'orange';
        this.themes = ['orange', 'dark', 'blue', 'green', 'purple'];
        this.init();
    }

    init() {
        this.loadTheme();
        this.createSwitcher();
        this.setupEventListeners();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        }
        this.applyTheme(this.currentTheme);
    }

    createSwitcher() {
        // Создаем переключатель темы
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.innerHTML = '<span class="theme-switcher-icon">🎨</span>';
        switcher.setAttribute('aria-label', 'Переключить тему');
        switcher.setAttribute('role', 'button');
        switcher.setAttribute('tabindex', '0');

        // Создаем панель выбора тем
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.setAttribute('aria-label', 'Выбор темы');

        // Добавляем варианты тем
        this.themes.forEach(theme => {
            const option = document.createElement('div');
            option.className = `theme-option theme-${theme} ${theme === this.currentTheme ? 'active' : ''}`;
            option.dataset.theme = theme;
            option.innerHTML = this.getThemeIcon(theme);
            option.setAttribute('aria-label', `Тема ${this.getThemeName(theme)}`);
            option.setAttribute('role', 'button');
            option.setAttribute('tabindex', '0');
            panel.appendChild(option);
        });

        document.body.appendChild(switcher);
        document.body.appendChild(panel);

        this.switcher = switcher;
        this.panel = panel;
    }

    getThemeIcon(theme) {
        const icons = {
            'orange': '🍊',
            'dark': '🌙',
            'blue': '💙',
            'green': '🌿',
            'purple': '💜'
        };
        return icons[theme] || '🎨';
    }

    getThemeName(theme) {
        const names = {
            'orange': 'Оранжевая',
            'dark': 'Тёмная',
            'blue': 'Синяя',
            'green': 'Зелёная',
            'purple': 'Фиолетовая'
        };
        return names[theme] || theme;
    }

    setupEventListeners() {
        // Клик по переключателю
        this.switcher.addEventListener('click', () => this.togglePanel());
        
        // Клик по варианту темы
        this.panel.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                this.hidePanel();
            });

            // Клавиатурная навигация
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const theme = option.dataset.theme;
                    this.switchTheme(theme);
                    this.hidePanel();
                }
            });
        });

        // Клик вне панели
        document.addEventListener('click', (e) => {
            if (!this.switcher.contains(e.target) && !this.panel.contains(e.target)) {
                this.hidePanel();
            }
        });

        // Клавиатурная навигация
        this.switcher.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.togglePanel();
            } else if (e.key === 'Escape') {
                this.hidePanel();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePanel();
            }
        });
    }

    togglePanel() {
        this.panel.classList.toggle('active');
        
        if (this.panel.classList.contains('active')) {
            this.panel.setAttribute('aria-hidden', 'false');
            // Фокус на первую тему
            const firstOption = this.panel.querySelector('.theme-option');
            if (firstOption) firstOption.focus();
        } else {
            this.panel.setAttribute('aria-hidden', 'true');
        }
    }

    hidePanel() {
        this.panel.classList.remove('active');
        this.panel.setAttribute('aria-hidden', 'true');
        this.switcher.focus();
    }

    switchTheme(theme) {
        if (!this.themes.includes(theme)) return;

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.updateActiveTheme();
        this.saveTheme(theme);
        
        // Анимация перехода
        this.animateThemeChange();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Обновляем градиенты фона для разных тем
        this.updateBackground(theme);
    }

    updateBackground(theme) {
        const body = document.body;
        const gradients = {
            'orange': 'linear-gradient(135deg, #ffecd2 0%, #ffb174 50%, #ff9a76 100%)',
            'dark': 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #000000 100%)',
            'blue': 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
            'green': 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
            'purple': 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #ce93d8 100%)'
        };
        
        body.style.background = gradients[theme] || gradients.orange;
    }

    updateActiveTheme() {
        this.panel.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    saveTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    animateThemeChange() {
        // Добавляем класс для анимации
        document.body.classList.add('theme-changing');
        
        // Убираем класс после анимации
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 300);
    }

    // Публичный метод для программного переключения темы
    setTheme(theme) {
        this.switchTheme(theme);
    }

    // Публичный метод для получения текущей темы
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// CSS для анимации смены темы
const themeStyles = `
    .theme-changing {
        transition: all 0.3s ease;
    }
    
    .theme-changing * {
        transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
