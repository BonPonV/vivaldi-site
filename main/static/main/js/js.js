document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ЛОГИКА СЛАЙДЕРА (Бесконечный + Свайп)
    // ==========================================
    const track = document.querySelector('.slider-track');
    
    if (track) {
        const prevBtn = document.querySelector('.slide-arrow.prev');
        const nextBtn = document.querySelector('.slide-arrow.next');
        let isAnimating = false;
        let autoPlayInterval;
        const transitionDuration = 500;

        function moveNext() {
            if (isAnimating) return;
            isAnimating = true;
            track.style.transition = `transform ${transitionDuration}ms ease-in-out`;
            track.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                track.style.transition = 'none';
                track.appendChild(track.firstElementChild);
                track.style.transform = 'translateX(0)';
                void track.offsetWidth; // Форсируем перерисовку
                track.style.transition = `transform ${transitionDuration}ms ease-in-out`;
                isAnimating = false;
            }, transitionDuration);
        }

        function movePrev() {
            if (isAnimating) return;
            isAnimating = true;
            track.style.transition = 'none';
            track.prepend(track.lastElementChild);
            track.style.transform = 'translateX(-100%)';
            void track.offsetWidth;
            
            track.style.transition = `transform ${transitionDuration}ms ease-in-out`;
            track.style.transform = 'translateX(0)';
            
            setTimeout(() => { isAnimating = false; }, transitionDuration);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(moveNext, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => { stopAutoPlay(); moveNext(); startAutoPlay(); });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { stopAutoPlay(); movePrev(); startAutoPlay(); });
        }

        // Свайп для мобильных устройств
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (diff > 50) {
                moveNext(); // Свайп влево -> следующий слайд
            } else if (diff < -50) {
                movePrev(); // Свайп вправо -> предыдущий слайд
            }
            startAutoPlay();
        }, { passive: true });

        startAutoPlay();
    }

    // ==========================================
    // 2. ЛОГИКА КВИЗА (Исправленная)
    // ==========================================
    const quizStartBtn = document.getElementById('quizStartBtn');
    const quizModal = document.getElementById('quizModal');
    const quizCloseBtn = document.getElementById('quizCloseBtn');
    const quizProgressBar = document.getElementById('quizProgressBar');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizForm = document.getElementById('quizForm');
    const quizOrderBtn = document.getElementById('quizOrderBtn');
    const quizCalcBtn = document.getElementById('quizCalcBtn');

    if (quizModal) {
        let currentStep = 1;
        const totalQuizSteps = 6; // 1,2,3 (вопросы), 4 (результаты), 5 (форма), 6 (успех)
        const quizAnswers = {};

        function updateQuizStep() {
            quizSteps.forEach(step => {
                step.classList.remove('active');
                if (parseInt(step.dataset.step) === currentStep) {
                    step.classList.add('active');
                }
            });
            const progress = Math.min((currentStep / totalQuizSteps) * 100, 100);
            if (quizProgressBar) {
                quizProgressBar.style.width = `${progress}%`;
            }
        }

        function openQuiz() {
            quizModal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeQuiz() {
            quizModal.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(() => {
                currentStep = 1;
                updateQuizStep();
                document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                if (quizForm) quizForm.reset();
            }, 400);
        }

        if (quizStartBtn) quizStartBtn.addEventListener('click', openQuiz);
        if (quizCloseBtn) quizCloseBtn.addEventListener('click', closeQuiz);

        // Обработка кликов по вариантам ответов (только для шагов 1, 2, 3)
        quizOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const btn = e.target.closest('.quiz-option'); // Защита от клика по иконке внутри кнопки
                if (!btn) return;

                const value = btn.dataset.value;
                const step = btn.closest('.quiz-step').dataset.step;
                quizAnswers[`step${step}`] = value;

                btn.classList.add('selected');

                setTimeout(() => {
                    if (currentStep < 3) {
                        currentStep++;
                        updateQuizStep();
                    } else if (currentStep === 3) {
                        currentStep = 4; // Переход к результатам
                        updateQuizStep();
                    }
                }, 300);
            });
        });

        // Кнопки на шаге результатов (шаг 4) ведут на форму (шаг 5)
        if (quizOrderBtn) {
            quizOrderBtn.addEventListener('click', () => {
                currentStep = 5;
                updateQuizStep();
            });
        }

        if (quizCalcBtn) {
            quizCalcBtn.addEventListener('click', () => {
                currentStep = 5;
                updateQuizStep();
            });
        }

        // Отправка формы (шаг 5) ведет к успеху (шаг 6)
        if (quizForm) {
            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const phone = quizForm.querySelector('input').value;
                
                // Здесь можно добавить отправку данных на сервер (fetch/axios)
                console.log('Данные квиза:', { ...quizAnswers, phone });

                currentStep = 6;
                updateQuizStep();

                setTimeout(closeQuiz, 3000); // Закрыть через 3 секунды после успеха
            });
        }
    }

    // ==========================================
    // 3. ЛОГИКА МОБИЛЬНОГО МЕНЮ
    // ==========================================
    const burgerBtn = document.querySelector('.burger-btn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuCloseBtn = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-nav a');

    if (menuOverlay) {
        function toggleMenu() {
            const isOpen = menuOverlay.classList.toggle('is-open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
        if (menuCloseBtn) menuCloseBtn.addEventListener('click', toggleMenu);
        
        // Закрывать меню при клике на любую ссылку внутри него
        menuLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }
});