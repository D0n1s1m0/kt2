// Валидация формы контактов
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;

            // Валидация имени
            if (name.value.trim().length < 2) {
                showError('nameError', 'Имя должно содержать минимум 2 символа');
                isValid = false;
            } else {
                hideError('nameError');
            }

            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError('emailError', 'Введите корректный email адрес');
                isValid = false;
            } else {
                hideError('emailError');
            }

            // Валидация сообщения
            if (message.value.trim().length < 10) {
                showError('messageError', 'Сообщение должно содержать минимум 10 символов');
                isValid = false;
            } else {
                hideError('messageError');
            }

            if (isValid) {
                // Здесь будет отправка формы
                alert('Сообщение успешно отправлено!');
                contactForm.reset();
            }
        });
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.style.display = 'none';
    }
});
