const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = '#ffd700';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.opacity = '0.7';
    particle.style.zIndex = '1';

    const side = Math.floor(Math.random() * 4);

    if (side === 0) {
        particle.style.top = '0';
        particle.style.left = Math.random() * window.innerWidth + 'px';
    } else if (side === 1) {
        particle.style.right = '0';
        particle.style.top = Math.random() * window.innerHeight + 'px';
    } else if (side === 2) {
        particle.style.bottom = '0';
        particle.style.left = Math.random() * window.innerWidth + 'px';
    } else {
        particle.style.left = '0';
        particle.style.top = Math.random() * window.innerHeight + 'px';
    }

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;
    const distance = 100 + Math.random() * 100;
    let opacity = 0.7;

    let posX = parseFloat(particle.style.left || 0);
    let posY = parseFloat(particle.style.top || 0);

    if (particle.style.right) {
        posX = window.innerWidth;
    }
    if (particle.style.bottom) {
        posY = window.innerHeight;
    }

    function animate() {
        posX += Math.cos(angle) * speed;
        posY += Math.sin(angle) * speed;
        opacity -= 0.005;

        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }

    requestAnimationFrame(animate);
}

setInterval(createParticle, 300);
