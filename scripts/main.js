// Базовые функции для сайта
document.addEventListener('DOMContentLoaded', function() {
    // Анимация прогресс-баров
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.skill-level, .progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    };

    // Инициализация анимаций
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
});
// Создание листьев сакуры
function createSakuraLeaves() {
    const container = document.querySelector('.sakura-container');
    if (!container) return;
    
    const leafCount = 350; // Количество листьев
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'sakura-leaf';
        container.appendChild(leaf);
    }
}

// Анимация прогресс-баров
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.skill-level, .progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
};

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', function() {
    createSakuraLeaves();
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
    const addBlobs = () => {
        const body = document.body;
        const blob1 = document.createElement('div');
        const blob2 = document.createElement('div');
        
        blob1.className = 'blob blob-1';
        blob2.className = 'blob blob-2';
        
        body.appendChild(blob1);
        body.appendChild(blob2);
    };

    addBlobs();
});
