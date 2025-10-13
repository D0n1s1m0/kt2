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
