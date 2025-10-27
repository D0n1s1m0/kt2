// Оптимизированная фильтрация проектов
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = Array.from(document.querySelectorAll('.project-card'));
        this.activeFilter = 'all';
        
        this.init();
    }

    init() {
        if (!this.filterButtons.length) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFilter(button);
            });
        });

        // Предварительная обработка данных для быстрой фильтрации
        this.categories = new Map();
        this.projectCards.forEach(card => {
            const category = card.dataset.category;
            if (!this.categories.has(category)) {
                this.categories.set(category, []);
            }
            this.categories.get(category).push(card);
        });
    }

    handleFilter(button) {
        const filterValue = button.dataset.filter;
        if (this.activeFilter === filterValue) return;

        this.activeFilter = filterValue;
        
        // Обновление активной кнопки
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Применение фильтра
        this.applyFilter(filterValue);
    }

    applyFilter(filterValue) {
        const isAll = filterValue === 'all';
        
        // Быстрая фильтрация с использованием requestAnimationFrame
        requestAnimationFrame(() => {
            this.projectCards.forEach(card => {
                const category = card.dataset.category;
                const isVisible = isAll || category === filterValue;
                
                if (isVisible) {
                    card.style.display = 'block';
                    // Небольшая задержка для плавного появления
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    // Скрытие после завершения анимации
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    }

    // Метод для программного изменения фильтра
    setFilter(filterValue) {
        const button = Array.from(this.filterButtons).find(btn => 
            btn.dataset.filter === filterValue
        );
        if (button) {
            this.handleFilter(button);
        }
    }

    // Деструктор для очистки
    destroy() {
        this.filterButtons.forEach(button => {
            button.removeEventListener('click', this.handleFilter);
        });
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.filter-btn')) {
        window.projectFilter = new ProjectFilter();
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectFilter;
}
