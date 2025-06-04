document.addEventListener('DOMContentLoaded', function() {
    const book = document.getElementById('book');
    const mainTitle = document.getElementById('mainTitle');
    const subtitle = document.getElementById('subtitle');
    const journalTitle = document.getElementById('journalTitle');
    const actionButtons = document.getElementById('actionButtons');

    setTimeout(() => {
        book.classList.add('opened');
    }, 1000);

    setTimeout(() => {
        mainTitle.classList.add('typewriter');
        mainTitle.style.opacity = '1';
    }, 3000);

    setTimeout(() => {
        subtitle.classList.add('typewriter-delay-1');
        subtitle.style.opacity = '1';
    }, 4000);

    setTimeout(() => {
        journalTitle.classList.add('typewriter-delay-2');
        journalTitle.style.opacity = '1';
    }, 5500);

    setTimeout(() => {
        actionButtons.classList.add('visible');
    }, 8000);

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#ffd700';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.animation = 'sparkle 2s ease-out forwards';

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    const style = document.createElement('style');
    style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
    document.head.appendChild(style);

    setTimeout(() => {
        setInterval(createSparkle, 3000);
    }, 4000);
});
