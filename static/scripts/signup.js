const penCursor = document.getElementById('penCursor');
let mouseX = 0,
    mouseY = 0;
let cursorX = 0,
    cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    penCursor.style.left = cursorX + 'px';
    penCursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
textInputs.forEach(input => {
    input.addEventListener('focus', () => penCursor.classList.add('writing'));
    input.addEventListener('blur', () => penCursor.classList.remove('writing'));
});

function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }

    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.top = Math.random() * 50 + '%';
        starsContainer.appendChild(shootingStar);

        setTimeout(() => {
            shootingStar.remove();
        }, 4000);
    }, 3000);
}

document.addEventListener('mousemove', (e) => {
    const stars = document.querySelectorAll('.star');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    stars.forEach((star, index) => {
        const speed = (index % 5 + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        star.style.transform = `translate(${x}px, ${y}px)`;
    });
});

const avatarOptions = document.querySelectorAll('.avatar-option');
const profileImageInput = document.getElementById('profile_image');

avatarOptions.forEach(option => {
    option.addEventListener('click', () => {
        avatarOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        profileImageInput.value = option.dataset.avatar;
    });
});

createStars();
