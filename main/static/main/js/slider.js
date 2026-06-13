// Логика слайдера
export function initSlider() {
    console.log("connected.");
    const track = document.querySelector('.slider-track');
    
    if (!track) return;

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
            void track.offsetWidth;
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
            moveNext();
        } else if (diff < -50) {
            movePrev();
        }
        startAutoPlay();
    }, { passive: true });

    startAutoPlay();
}