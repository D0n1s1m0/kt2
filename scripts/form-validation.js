// Оптимизированная валидация формы
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.fields = new Map();
        this.errors = new Set();
        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.init();
    }

    init() {
        // Кэширование полей формы
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            this.fields.set(field.name || field.id, field);
            
            // События валидации
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });

        // Обработка отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Дебаунс для полей с большим количеством ввода
        this.setupDebouncedValidation();
    }

    setupDebouncedValidation() {
        const debouncedValidate = this.debounce((field) => {
            this.validateField(field);
        }, 300);

        this.form.querySelectorAll('textarea, input[type="text"]').forEach(field => {
            field.addEventListener('input', () => debouncedValidate(field));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch(field.type) {
            case 'text':
                if (field.required && value.length < 2) {
                    isValid = false;
                    message = 'Минимум 2 символа';
                }
                break;
                
            case 'email':
                if (field.required && !this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Введите корректный email адрес';
                }
                break;
                
            case 'textarea':
                if (field.required && value.length < 10) {
                    isValid = false;
                    message = 'Сообщение должно содержать минимум 10 символов';
                }
                break;
        }

        // Дополнительная валидация по ID
        if (field.id === 'name' && value.length < 2) {
            isValid = false;
            message = 'Имя должно содержать минимум 2 символа';
        }

        if (!isValid) {
            this.showError(field, message);
            this.errors.add(field.name || field.id);
        } else {
            this.clearError(field);
            this.errors.delete(field.name || field.id);
        }

        this.updateSubmitButton();
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(field, message) {
        this.clearError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.id = `${field.id}Error`;
        
        field.parentNode.appendChild(errorElement);
        field.setAttribute('aria-invalid', 'true');
        field.style.borderColor = 'var(--orange-accent)';
    }

    clearError(field) {
        const existingError = document.getElementById(`${field.id}Error`);
        if (existingError) {
            existingError.remove();
        }
        field.removeAttribute('aria-invalid');
        field.style.borderColor = '';
    }

    updateSubmitButton() {
        if (this.submitButton) {
            const requiredFields = Array.from(this.fields.values())
                .filter(field => field.required);
                
            const allRequiredValid = requiredFields.every(field => {
                const value = field.value.trim();
                return value.length > 0 && !this.errors.has(field.name || field.id);
            });

            this.submitButton.disabled = !allRequiredValid;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Валидация всех полей перед отправкой
        let allValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showGeneralError('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        await this.submitForm();
    }

    async submitForm() {
        if (!this.submitButton) return;

        const originalText = this.submitButton.textContent;
        const originalHTML = this.submitButton.innerHTML;
        
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Отправка...';
        this.submitButton.classList.add('loading');

        try {
            // Сбор данных формы
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Имитация отправки на сервер
            await this.sendFormData(data);
            
            this.showSuccess('Сообщение успешно отправлено!');
            this.form.reset();
            this.errors.clear();
            this.updateSubmitButton();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showGeneralError('Ошибка отправки. Попробуйте еще раз.');
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.textContent = originalText;
            this.submitButton.innerHTML = originalHTML;
            this.submitButton.classList.remove('loading');
        }
    }

    async sendFormData(data) {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // В реальном приложении здесь будет fetch запрос
        console.log('Form data to be sent:', data);
        
        // Имитация успешной отправки
        return { success: true };
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showGeneralError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Удаление существующих сообщений
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Автоматическое скрытие сообщения
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

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

    // Публичный метод для ручной валидации
    validateForm() {
        let isValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    // Деструктор для очистки
    destroy() {
        this.form.removeEventListener('submit', this.handleSubmit);
        this.fields.forEach(field => {
            field.removeEventListener('blur', this.validateField);
            field.removeEventListener('input', this.clearError);
        });
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const diaryForm = document.getElementById('diaryForm');
    
    if (contactForm) {
        window.contactValidator = new FormValidator('contactForm');
    }
    
    if (diaryForm) {
        window.diaryValidator = new FormValidator('diaryForm');
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
