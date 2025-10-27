// Оптимизированный менеджер дневника
class DiaryManager {
    constructor() {
        this.entries = [];
        this.filters = new Set(['all']);
        this.currentPage = 1;
        this.entriesPerPage = 5;
        
        this.init();
    }

    init() {
        this.loadEntries();
        this.setupEventListeners();
        this.setupFilters();
        this.updateStats();
    }

    // Загрузка записей с кэшированием
    async loadEntries() {
        const cached = localStorage.getItem('diaryEntries');
        
        if (cached) {
            this.entries = JSON.parse(cached);
            this.renderEntries();
        } else {
            // Загрузка начальных данных
            this.entries = this.getInitialEntries();
            this.saveToStorage();
            this.renderEntries();
        }
    }

    getInitialEntries() {
        return [
            {
                id: 1,
                date: '2024-01-15',
                title: 'Завершил разработку интернет-магазина',
                description: 'Успешно завершил работу над крупным проектом - интернет-магазином с системой оплаты и личным кабинетом. Интегрировал Stripe для обработки платежей.',
                status: 'completed',
                tags: ['React', 'Node.js', 'MongoDB']
            },
            {
                id: 2,
                date: '2024-01-10',
                title: 'Работа над мобильным приложением',
                description: 'Начал разработку мобильного приложения для управления задачами. Сейчас работаю над оффлайн-режимом и синхронизацией данных.',
                status: 'in-progress',
                tags: ['React Native', 'Firebase']
            },
            {
                id: 3,
                date: '2024-01-05',
                title: 'Планирование нового проекта',
                description: 'Начал планирование системы аналитики для веб-приложений. Изучаю требования и технологии для реализации.',
                status: 'planned',
                tags: ['Analytics', 'Planning']
            }
        ];
    }

    setupEventListeners() {
        // Переключение формы
        const toggleBtn = document.getElementById('toggleFormBtn');
        const cancelBtn = document.getElementById('cancelFormBtn');
        const form = document.getElementById('addEntryForm');

        if (toggleBtn && form) {
            toggleBtn.addEventListener('click', () => this.toggleForm(form));
        }

        if (cancelBtn && form) {
            cancelBtn.addEventListener('click', () => this.hideForm(form));
        }

        // Обработка формы
        const diaryForm = document.getElementById('diaryForm');
        if (diaryForm) {
            diaryForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Экспорт данных
        const exportJSON = document.getElementById('exportJSON');
        const exportPDF = document.getElementById('exportPDF');
        const printDiary = document.getElementById('printDiary');

        if (exportJSON) exportJSON.addEventListener('click', () => this.exportJSON());
        if (exportPDF) exportPDF.addEventListener('click', () => this.exportPDF());
        if (printDiary) printDiary.addEventListener('click', () => this.printDiary());
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.diary-quick-nav .filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.applyFilter(filter, button);
            });
        });
    }

    applyFilter(filter, clickedButton) {
        // Обновление активной кнопки
        document.querySelectorAll('.diary-quick-nav .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedButton.classList.add('active');

        // Применение фильтра
        this.filters.clear();
        if (filter === 'all') {
            this.filters.add('all');
        } else {
            this.filters.add(filter);
        }

        this.renderEntries();
    }

    renderEntries() {
        const container = document.getElementById('entriesList');
        if (!container) return;

        // Фильтрация записей
        const filteredEntries = this.entries.filter(entry => {
            return this.filters.has('all') || this.filters.has(entry.status);
        });

        // Пагинация
        const startIndex = (this.currentPage - 1) * this.entriesPerPage;
        const paginatedEntries = filteredEntries.slice(startIndex, startIndex + this.entriesPerPage);

        // Рендеринг
        container.innerHTML = paginatedEntries.map(entry => this.renderEntry(entry)).join('');

        // Обновление пагинации
        this.updatePagination(filteredEntries.length);
    }

    renderEntry(entry) {
        const date = new Date(entry.date).toLocaleDateString('ru-RU');
        
        return `
            <div class="entry-item ${entry.status}" data-entry-id="${entry.id}">
                <div class="entry-date">${date}</div>
                <h3 class="entry-title">${entry.title}</h3>
                <p class="entry-description">${entry.description}</p>
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                </div>
                <span class="entry-status">${this.getStatusText(entry.status)}</span>
                <div class="entry-actions">
                    <button class="action-btn edit" onclick="diaryManager.editEntry(${entry.id})">✏️</button>
                    <button class="action-btn delete" onclick="diaryManager.deleteEntry(${entry.id})">🗑️</button>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'planned': 'Запланировано',
            'in-progress': 'В процессе',
            'completed': 'Завершено'
        };
        return statusMap[status] || status;
    }

    toggleForm(form) {
        form.classList.toggle('hidden');
    }

    hideForm(form) {
        form.classList.add('hidden');
        form.reset();
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const entry = {
            id: Date.now(), // Простой ID на основе времени
            date: formData.get('entryDate'),
            title: formData.get('entryTitle'),
            description: formData.get('entryDescription'),
            status: formData.get('entryStatus'),
            tags: this.extractTags(formData.get('entryDescription'))
        };

        // Валидация
        if (!this.validateEntry(entry)) {
            return;
        }

        // Добавление записи
        this.entries.unshift(entry);
        this.saveToStorage();
        this.renderEntries();
        
        // Сброс формы
        e.target.reset();
        this.hideForm(document.getElementById('addEntryForm'));
        
        // Обновление статистики
        this.updateStats();
    }

    validateEntry(entry) {
        if (!entry.date || !entry.title || !entry.description || !entry.status) {
            this.showMessage('Все поля обязательны для заполнения', 'error');
            return false;
        }

        if (entry.title.length < 5) {
            this.showMessage('Заголовок должен содержать минимум 5 символов', 'error');
            return false;
        }

        if (entry.description.length < 10) {
            this.showMessage('Описание должно содержать минимум 10 символов', 'error');
            return false;
        }

        return true;
    }

    extractTags(description) {
        // Простая логика извлечения тегов (можно улучшить)
        const words = description.split(' ');
        const techKeywords = ['React', 'JavaScript', 'Node', 'Vue', 'Angular', 'TypeScript', 'Python', 'Java'];
        
        return words.filter(word => 
            techKeywords.some(keyword => 
                word.toLowerCase().includes(keyword.toLowerCase())
            )
        ).slice(0, 3);
    }

    editEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        // Заполнение формы данными записи
        document.getElementById('entryDate').value = entry.date;
        document.getElementById('entryTitle').value = entry.title;
        document.getElementById('entryDescription').value = entry.description;
        document.getElementById('entryStatus').value = entry.status;

        // Показ формы
        const form = document.getElementById('addEntryForm');
        form.classList.remove('hidden');

        // Удаление старой записи
        this.deleteEntry(entryId, false);
    }

    deleteEntry(entryId, confirm = true) {
        if (confirm && !window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            return;
        }

        this.entries = this.entries.filter(entry => entry.id !== entryId);
        this.saveToStorage();
        this.renderEntries();
        this.updateStats();
    }

    updateStats() {
        const completed = this.entries.filter(entry => entry.status === 'completed').length;
        const inProgress = this.entries.filter(entry => entry.status === 'in-progress').length;
        const planned = this.entries.filter(entry => entry.status === 'planned').length;

        // Обновление DOM элементов
        const completedCount = document.getElementById('completedCount');
        if (completedCount) completedCount.textContent = completed;

        // Можно добавить обновление других статистик
    }

    updatePagination(totalEntries) {
        const totalPages = Math.ceil(totalEntries / this.entriesPerPage);
        const pagination = document.getElementById('pagination');
        
        if (pagination) {
            // Здесь можно реализовать пагинацию
        }
    }

    exportJSON() {
        const data = JSON.stringify(this.entries, null, 2);
        this.downloadFile(data, 'diary-entries.json', 'application/json');
    }

    exportPDF() {
        // Заглушка для экспорта в PDF
        this.showMessage('Экспорт в PDF будет реализован в будущем', 'info');
    }

    printDiary() {
        window.print();
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showMessage(message, type = 'info') {
        // Простая реализация показа сообщений
        alert(`${type.toUpperCase()}: ${message}`);
    }

    saveToStorage() {
        localStorage.setItem('diaryEntries', JSON.stringify(this.entries));
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.diaryManager = new DiaryManager();
});
