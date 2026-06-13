// Подключаем все модули
import { initSlider } from './slider.js';
import { initQuiz } from './quiz.js';
import { initMenu } from './menu.js';

// Инициализируем всё после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("connecting..");
    initSlider();
    initQuiz();
    initMenu();
});