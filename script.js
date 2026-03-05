// ===== МОБИЛЬНОЕ МЕНЮ =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню если открыто
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        }
    });
});

// ===== КНОПКА "НАВЕРХ" =====
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== ЦИКЛИЧЕСКИЙ СЛАЙДЕР ПРОЕКТОВ =====
function initSlider() {
    console.log('🚀 Инициализация циклического слайдера...');
    
    // Находим элементы
    const slider = document.getElementById('projectsSlider');
    const container = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.project-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    console.log('📊 Найдено слайдов:', slides.length);
    
    if (!container || slides.length === 0) {
        console.error('❌ Не найдены необходимые элементы для слайдера');
        return;
    }
    
    let currentIndex = 0;
    let isAnimating = false;
    let slidesPerView = getSlidesPerView();
    
    // Функция для определения сколько слайдов показывать
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1200) return 2;
        return 3;
    }
    
    // Функция обновления слайдера
    function updateSlider(direction = 'none', animate = true) {
        if (isAnimating) return;
        isAnimating = true;
        
        slidesPerView = getSlidesPerView();
        const totalSlides = slides.length;
        
        // Рассчитываем смещение
        const slideWidth = slides[0].offsetWidth;
        const gap = 30;
        const translateX = -currentIndex * (slideWidth + gap);
        
        // Применяем анимацию
        container.style.transition = animate ? 'transform 0.5s ease' : 'none';
        container.style.transform = `translateX(${translateX}px)`;
        
        console.log(`📊 Показан слайд ${currentIndex + 1} из ${totalSlides}, translateX: ${translateX}px`);
        
        // Сбрасываем флаг анимации
        if (animate) {
            setTimeout(() => {
                isAnimating = false;
                
                // Если дошли до конца и двигались вперед - мгновенно переходим к началу
                if (direction === 'next' && currentIndex >= totalSlides - slidesPerView + 1) {
                    container.style.transition = 'none';
                    currentIndex = 0;
                    container.style.transform = `translateX(0px)`;
                    setTimeout(() => {
                        container.style.transition = 'transform 0.5s ease';
                    }, 50);
                }
                
                // Если дошли до начала и двигались назад - мгновенно переходим к концу
                if (direction === 'prev' && currentIndex < 0) {
                    container.style.transition = 'none';
                    currentIndex = totalSlides - slidesPerView;
                    const finalTranslateX = -currentIndex * (slideWidth + gap);
                    container.style.transform = `translateX(${finalTranslateX}px)`;
                    setTimeout(() => {
                        container.style.transition = 'transform 0.5s ease';
                    }, 50);
                }
            }, 500);
        } else {
            isAnimating = false;
        }
    }
    
    // Кнопка "назад" - двигаем вправо
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            
            // Если ушли за начало - переходим к последнему слайду
            if (currentIndex < 0) {
                currentIndex = slides.length - slidesPerView;
            }
            
            updateSlider('prev');
        });
        console.log('✅ Кнопка "назад" подключена');
    }
    
    // Кнопка "вперед" - двигаем влево
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            
            // Если прошли все слайды - возвращаемся к первому
            if (currentIndex > slides.length - slidesPerView) {
                currentIndex = 0;
            }
            
            updateSlider('next');
        });
        console.log('✅ Кнопка "вперед" подключена');
    }
    
    // Автопрокрутка
    let autoSlideInterval;
    
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            
            // Если прошли все слайды - возвращаемся к первому
            if (currentIndex > slides.length - slidesPerView) {
                currentIndex = 0;
            }
            
            updateSlider('next');
        }, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    // Запускаем автопрокрутку
    startAutoSlide();
    console.log('✅ Автопрокрутка запущена');
    
    // Останавливаем при взаимодействии
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('mouseenter', stopAutoSlide);
        prevBtn.addEventListener('mouseleave', startAutoSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('mouseenter', stopAutoSlide);
        nextBtn.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', () => {
        slidesPerView = getSlidesPerView();
        // Корректируем индекс при изменении размера
        if (currentIndex > slides.length - slidesPerView) {
            currentIndex = Math.max(0, slides.length - slidesPerView);
        }
        updateSlider('none', false);
    });
    
    // Инициализация
    updateSlider('none', false);
    console.log('🎉 Циклический слайдер инициализирован!');
    console.log('🔄 Теперь слайды зациклены: после последнего будет первый');
}


// ===== ОБРАБОТКА ФОРМЫ =====
function initForm() {
    const requestForm = document.getElementById('requestForm');
    if (!requestForm) return;
    
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const agreement = document.getElementById('agreement');
        
        let isValid = true;
        
        // Проверка имени
        if (!name.value.trim()) {
            showError(name, 'Введите ваше имя');
            isValid = false;
        } else {
            clearError(name);
        }
        
        // Проверка телефона
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
            showError(phone, 'Введите корректный номер телефона');
            isValid = false;
        } else {
            clearError(phone);
        }
        
        // Проверка согласия
        if (!agreement.checked) {
            showError(agreement, 'Необходимо согласие с политикой конфиденциальности');
            isValid = false;
        } else {
            clearError(agreement);
        }
        
        if (!isValid) return;
        
        // Имитация отправки
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // В реальном проекте здесь будет fetch запрос на сервер
        setTimeout(() => {
            // Показываем сообщение об успехе
            showSuccessMessage();
            
            // Сбрасываем форму
            requestForm.reset();
            
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Функции для работы с ошибками
    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.closest('.form-checkbox');
        formGroup.classList.add('has-error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '8px';
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group') || input.closest('.form-checkbox');
        formGroup.classList.remove('has-error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function showSuccessMessage() {
        // Создаем элемент сообщения
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3>Спасибо за заявку!</h3>
                <p>Мы свяжемся с вами в течение часа в рабочее время.</p>
                <button class="btn btn-primary close-success">OK</button>
            </div>
        `;
        
        // Стили для сообщения
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s;
            }
            
            .success-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.3s;
            }
            
            .success-icon {
                width: 60px;
                height: 60px;
                background: #10b981;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: bold;
                margin: 0 auto 20px;
            }
            
            .success-content h3 {
                font-size: 24px;
                color: #111827;
                margin-bottom: 10px;
            }
            
            .success-content p {
                color: #6b7280;
                margin-bottom: 20px;
            }
            
            .close-success {
                padding: 12px 32px;
                font-size: 16px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(message);
        
        // Закрытие сообщения
        message.querySelector('.close-success').addEventListener('click', () => {
            message.remove();
            style.remove();
        });
        
        // Закрытие при клике вне сообщения
        message.addEventListener('click', (e) => {
            if (e.target === message) {
                message.remove();
                style.remove();
            }
        });
    }
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за секциями
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ===== ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ =====
function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏗️ ПрофТехМонтаж — сайт загружен!');
    
    initSlider();
    initForm();
    initScrollAnimations();
    updateCopyrightYear();
    
    // Добавляем класс для анимации после загрузки
    document.body.classList.add('loaded');
    
    console.log('✅ Все модули инициализированы');
});

