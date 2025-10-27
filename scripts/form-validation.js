// Улучшенная валидация форм с поддержкой доступности
class AccessibleFormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.fields = new Map();
        this.errors = new Set();
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        // Кэширование полей формы
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            this.fields.set(field.name || field.id, field);
            
            // События валидации с улучшенной доступностью
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.handleInput(field));
            field.addEventListener('invalid', (e) => this.handleInvalid(e));
        });

        // Обработка отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Инициализация ARIA-атрибутов
        this.initAriaAttributes();
    }

    initAriaAttributes() {
        this.fields.forEach(field => {
            if (field.required) {
                field.setAttribute('aria-required', 'true');
            }
            
            if (field.type === 'email') {
                field.setAttribute('aria-describedby', `${field.id}-hint`);
            }
        });
    }

    handleInput(field) {
        this.clearError(field);
        
        // Динамическое обновление ARIA-атрибутов
        if (field.value.trim().length > 0) {
            field.removeAttribute('aria-invalid');
        }
    }

    handleInvalid(e) {
        e.preventDefault();
        const field = e.target;
        this.validateField(field);
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Сбрасываем состояние ошибки
        field.setAttribute('aria-invalid', 'false');
        this.clearError(field);

        // Валидация в зависимости от типа поля
        switch(field.type) {
            case 'text':
                if (field.required && value.length < 2) {
                    isValid = false;
                    message = 'Имя должно содержать минимум 2 символа';
                }
                break;
                
            case 'email':
                if (field.required && !this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Введите корректный email адрес';
                } else if (field.required && value.length === 0) {
                    isValid = false;
                    message = 'Email обязателен для заполнения';
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
        if (field.id === 'name' && field.required && value.length < 2) {
            isValid = false;
            message = 'Имя должно содержать минимум 2 символа';
        }

        if (!isValid) {
            this.showError(field, message);
            this.errors.add(field.name || field.id);
            
            // Обновляем live region для скринридеров
            if (window.accessibilityUtils) {
                window.accessibilityUtils.updateLiveRegion(`Ошибка в поле ${field.labels[0]?.textContent}: ${message}`, 'error');
            }
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
        
        // Обновляем ARIA-атрибуты
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id}Error`);
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.id = `${field.id}Error`;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = 'var(--orange-accent)';
        
        // Фокусируемся на поле с ошибкой
        if (!this.isSubmitting) {
            field.focus();
        }
    }

    clearError(field) {
        const existingError = document.getElementById(`${field.id}Error`);
        if (existingError) {
            existingError.remove();
        }
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
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

            this.submitButton.disabled = !allRequiredValid || this.isSubmitting;
            this.submitButton.setAttribute('aria-disabled', this.submitButton.disabled);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Валидация всех полей перед отправкой
        let allValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            // Фокусируемся на первом поле с ошибкой
            const firstErrorField = Array.from(this.fields.values())
                .find(field => this.errors.has(field.name || field.id));
            if (firstErrorField) {
                firstErrorField.focus();
            }
            
            if (window.accessibilityUtils) {
                window.accessibilityUtils.updateLiveRegion('В форме есть ошибки. Пожалуйста, исправьте их перед отправкой.', 'error');
            }
            return;
        }

        await this.submitForm();
    }

    async submitForm() {
        if (!this.submitButton) return;

        this.isSubmitting = true;
        this.updateSubmitButton();
        
        const originalText = this.submitButton.querySelector('.button-text').textContent;
        
        this.submitButton.classList.add('loading');
        this.submitButton.setAttribute('aria-busy', 'true');

        try {
            // Сохраняем элемент с фокусом для возврата
            if (window.accessibilityUtils) {
                window.accessibilityUtils.setLastFocused(document.activeElement);
            }

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
            this.showError('Ошибка отправки. Попробуйте еще раз.');
            
            if (window.accessibilityUtils) {
                window.accessibilityUtils.updateLiveRegion('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
            }
        } finally {
            this.isSubmitting = false;
            this.submitButton.classList.remove('loading');
            this.submitButton.removeAttribute('aria-busy');
            this.updateSubmitButton();
        }
    }

    async sendFormData(data) {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        // В реальном приложении здесь будет fetch запрос
        console.log('Form data to be sent:', data);
        
        // Имитация успешной отправки
        return { success: true };
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
        
        if (window.accessibilityUtils) {
            window.accessibilityUtils.updateLiveRegion(message, 'success');
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Удаление существующих сообщений
        const existingMessage = document.getElementById('success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.getElementById('success-message');
        if (messageElement) {
            const messageText = messageElement.querySelector('.message-text');
            messageText.textContent = message;
            
            messageElement.className = `status-message ${type}-message`;
            messageElement.setAttribute('aria-hidden', 'false');
            messageElement.setAttribute('role', 'alert');
            
            // Автоматическое скрытие сообщения
            setTimeout(() => {
                messageElement.setAttribute('aria-hidden', 'true');
            }, 5000);
        }
    }

    // Публичный метод для программной валидации
    validateForm() {
        let isValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    // Публичный метод для сброса формы
    resetForm() {
        this.form.reset();
        this.errors.clear();
        this.fields.forEach(field => this.clearError(field));
        this.updateSubmitButton();
    }

    // Деструктор для очистки
    destroy() {
        this.form.removeEventListener('submit', this.handleSubmit);
        this.fields.forEach(field => {
            field.removeEventListener('blur', this.validateField);
            field.removeEventListener('input', this.handleInput);
            field.removeEventListener('invalid', this.handleInvalid);
        });
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        window.contactValidator = new AccessibleFormValidator('contactForm');
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibleFormValidator;
}
