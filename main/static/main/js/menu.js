// Логика меню
export function initMenu() {
    const burgerBtn = document.querySelector('.burger-btn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuCloseBtn = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-nav a');

    if (!menuOverlay) return;

    function toggleMenu() {
        const isOpen = menuOverlay.classList.toggle('is-open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', toggleMenu);
    
    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}