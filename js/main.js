// 1. Fungsi Menu Mobile (Toggle)
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// 2. Fungsi Animasi Scroll (Fade Up)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Menjalankan animasi pada semua section
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-up');
        observer.observe(section);
    });
});