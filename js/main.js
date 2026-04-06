// Navbar elevation
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('elevated', window.scrollY > 44);
});

// Mobile menu
const ham = document.getElementById('hamburger');
const mm = document.getElementById('mobileMenu');
ham.addEventListener('click', () => {
    mm.classList.toggle('open');
    ham.classList.toggle('open');
});
function closeMm() { 
    mm.classList.remove('open');
    ham.classList.remove('open');
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-left');
const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            ro.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => ro.observe(el));

// Filter buttons (visual only)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Form submit
const formBtn = document.getElementById('formBtn');
if (formBtn) {
    formBtn.addEventListener('click', e => {
        e.preventDefault();
        formBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> &nbsp;Message Sent — We\'ll be in touch within 24h';
        formBtn.style.background = '#3a6b3a';
        formBtn.style.color = '#fff';
        setTimeout(() => {
            formBtn.innerHTML = 'Send Request — Get Free Estimate &nbsp;<i class="bi bi-arrow-right"></i>';
            formBtn.style.background = '';
            formBtn.style.color = '';
        }, 4500);
    });
}
