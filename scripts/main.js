// Базовые функции для сайта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Создание листьев сакуры
    createSakuraLeaves();
    
    // Анимация прогресс-баров
    animateProgressBars();

    // Плавная прокрутка для якорей
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

    // Добавление декоративных blob элементов
    addBlobs();
});

// Создание листьев сакуры со случайными параметрами
function createSakuraLeaves() {
    const container = document.querySelector('.sakura-container');
    if (!container) return;
    
    const leafCount = 50;
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'sakura-leaf';
        
        // Случайная позиция по горизонтали
        const left = Math.random() * 100;
        
        // Случайная длительность анимации
        const duration = 15 + Math.random() * 20;
        
        // Случайная задержка начала анимации
        const delay = Math.random() * 20;
        
        // Случайное смещение по горизонтали во время падения
        const horizontalMove = (Math.random() - 0.5) * 100;
        
        leaf.style.left = `${left}%`;
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;
        
        // Добавляем случайное движение по горизонтали
        leaf.style.setProperty('--random-x', `${horizontalMove}vw`);
        
        container.appendChild(leaf);
    }
}

// Анимация прогресс-баров
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.skill-level, .progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}

// Добавление декоративных blob элементов
function addBlobs() {
    const body = document.body;
    const blob1 = document.createElement('div');
    const blob2 = document.createElement('div');
    const blob3 = document.createElement('div');
    
    blob1.className = 'blob blob-1';
    blob2.className = 'blob blob-2';
    blob3.className = 'blob blob-3';
    
    body.appendChild(blob1);
    body.appendChild(blob2);
    body.appendChild(blob3);
}

// Система смены тем
function initTheme() {
    // Создаем кнопку переключения темы
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = '<div class="theme-switcher-icon">🎨</div>';
    
    // Создаем панель выбора темы
    const themePanel = document.createElement('div');
    themePanel.className = 'theme-panel';
    
    const themes = [
        { name: 'orange', icon: '🍊', label: 'Оранжевая' },
        { name: 'beige', icon: '🟫', label: 'Бежевая' },
        { name: 'dark', icon: '🌙', label: 'Темная' },
        { name: 'green', icon: '🌿', label: 'Зеленая' },
        { name: 'blue', icon: '💙', label: 'Синяя' },
        { name: 'pink', icon: '🌸', label: 'Розовая' },
        { name: 'purple', icon: '☂️', label: 'Фиолетовая' }
    ];
    
    themes.forEach(theme => {
        const themeOption = document.createElement('div');
        themeOption.className = `theme-option theme-${theme.name}`;
        themeOption.setAttribute('data-theme', theme.name);
        themeOption.setAttribute('title', theme.label);
        themeOption.innerHTML = theme.icon;
        
        themeOption.addEventListener('click', () => {
            setTheme(theme.name);
            themePanel.classList.remove('active');
        });
        
        themePanel.appendChild(themeOption);
    });
    
    document.body.appendChild(themeSwitcher);
    document.body.appendChild(themePanel);
    
    // Обработчик клика по кнопке переключения темы
    themeSwitcher.addEventListener('click', () => {
        themePanel.classList.toggle('active');
    });
    
    // Закрытие панели при клике вне ее
    document.addEventListener('click', (e) => {
        if (!themeSwitcher.contains(e.target) && !themePanel.contains(e.target)) {
            themePanel.classList.remove('active');
        }
    });
    
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme') || 'orange';
    setTheme(savedTheme);
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    
    // Обновляем активную тему в панели
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === themeName) {
            option.classList.add('active');
        }
    });
    
    // Обновляем листья сакуры
    updateSakuraLeaves();
}

function updateSakuraLeaves() {
    const leaves = document.querySelectorAll('.sakura-leaf');
    leaves.forEach(leaf => {
        // Применяем новые цвета через CSS переменные
        // Цвета автоматически обновятся благодаря CSS переменным
    });
}
