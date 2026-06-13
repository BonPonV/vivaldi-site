// Логика квиза
export function initQuiz() {
    const quizStartBtn = document.getElementById('quizStartBtn');
    const quizModal = document.getElementById('quizModal');
    const quizCloseBtn = document.getElementById('quizCloseBtn');
    const quizProgressBar = document.getElementById('quizProgressBar');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizForm = document.getElementById('quizForm');
    const quizOrderBtn = document.getElementById('quizOrderBtn');
    const quizCalcBtn = document.getElementById('quizCalcBtn');

    if (!quizModal) return;

    let currentStep = 1;
    const totalQuizSteps = 6;
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

    quizOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const btn = e.target.closest('.quiz-option');
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
                    currentStep = 4;
                    updateQuizStep();
                }
            }, 300);
        });
    });

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

    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = quizForm.querySelector('input').value;
            
            console.log('Данные квиза:', { ...quizAnswers, phone });

            currentStep = 6;
            updateQuizStep();

            setTimeout(closeQuiz, 3000);
        });
    }
}