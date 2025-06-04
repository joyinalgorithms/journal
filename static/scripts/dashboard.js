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

    const stars = document.querySelectorAll('.star');
    const normX = cursorX / window.innerWidth;
    const normY = cursorY / window.innerHeight;

    stars.forEach((star, index) => {
        const speed = (index % 5 + 1) * 0.5;
        const x = (normX - 0.5) * speed;
        const y = (normY - 0.5) * speed;
        star.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animateCursor);
}
animateCursor();

const textInputs = document.querySelectorAll('input[type="text"], textarea');
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
        star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
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
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('sidebar-open');
});


const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.journal-entry').forEach(entry => {
        const title = entry.querySelector('.entry-title').textContent.toLowerCase();
        const preview = entry.querySelector('.entry-preview').textContent.toLowerCase();
        entry.style.display = (title.includes(searchTerm) || preview.includes(searchTerm)) ? 'block' : 'none';
    });
});

function resetFormFields() {
    const previewImg = document.getElementById('previewImg');
    const imagePreview = document.getElementById('imagePreview');
    const uploadArea = document.getElementById('uploadArea');
    const titleInput = document.querySelector('input[name="title"]');
    const contentInput = document.querySelector('textarea[name="content"]');
    const imageInput = document.querySelector('input[name="image"]');
    if (titleInput) {
        titleInput.value = '';
        titleInput.removeAttribute('readonly');
    }
    if (contentInput) {
        contentInput.value = '';
        contentInput.removeAttribute('readonly');
    }
    if (imageInput) {
        imageInput.value = '';
        imageInput.disabled = false;
    }
    if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
    }
    if (imagePreview) {
        imagePreview.style.display = 'none';
    }
    if (uploadArea) {
        uploadArea.style.display = 'block';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    createStars();
    setTimeout(() => {
        document.getElementById('bookContainer').style.display = 'none';
    }, 4000);

    const formElements = document.querySelectorAll('.title-input, .content-textarea');
    formElements.forEach(element => {
        element.addEventListener('focus', () => element.style.transform = 'scale(1.02)');
        element.addEventListener('blur', () => element.style.transform = 'scale(1)');
    });

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFileSelect(e.target.files[0]);
    });

    removeImageBtn.addEventListener('click', () => {
        fileInput.value = '';
        imagePreview.style.display = 'none';
        uploadArea.style.display = 'block';
    });

    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) return alert('Please select an image file.');
        if (file.size > 5 * 1024 * 1024) return alert('File size must be less than 5MB.');

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            imagePreview.style.display = 'block';
            uploadArea.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    const entries = document.querySelectorAll(".journal-entry");
    const titleInput = document.querySelector('input[name="title"]');
    const contentInput = document.querySelector('textarea[name="content"]');
    const imageInput = document.querySelector('input[name="image"]');

    entries.forEach(entry => {
        entry.addEventListener("click", function() {
            const title = this.getAttribute("data-title");
            const content = this.getAttribute("data-content");
            const imageSrc = this.getAttribute("data-image");

            if (titleInput) {
                titleInput.value = title;
                titleInput.setAttribute("readonly", true);
            }
            if (contentInput) {
                contentInput.value = content;
                contentInput.setAttribute("readonly", true);
            }
            if (imageInput) imageInput.disabled = true;

            if (imageSrc) {
                previewImg.src = imageSrc;
                previewImg.style.display = "block";
                imagePreview.style.display = "block";
                uploadArea.style.display = "none";
            } else {
                previewImg.src = "";
                previewImg.style.display = "none";
                imagePreview.style.display = "none";
                uploadArea.style.display = "block";
            }
        });
    });

    const newEntryBtn = document.getElementById("new-entry-btn");
    if (newEntryBtn) {
        newEntryBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetFormFields();
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-entry-btn')) {
            e.stopPropagation();
            const entryId = e.target.dataset.id;
            if (confirm("Are you sure you want to delete this entry?")) {
                fetch(`/delete_entry/${entryId}`, {
                        method: "POST"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            e.target.closest('.journal-entry').remove();
                            resetFormFields();
                        } else {
                            alert("Failed to delete entry.");
                        }
                    });
            }
        }
    });
});
