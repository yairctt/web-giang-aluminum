async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        if (headerRes.ok) {
            const headerHtml = await headerRes.text();
            document.getElementById('header-root').innerHTML = headerHtml;
        }

        const footerRes = await fetch('components/footer.html');
        if (footerRes.ok) {
            const footerHtml = await footerRes.text();
            document.getElementById('footer-root').innerHTML = footerHtml;
        }

        initComponentsLogic();
    } catch (e) {
        console.error("Error loading components", e);
    }
}

function initComponentsLogic() {
    // Navbar elevation
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('elevated', window.scrollY > 44);
        });
    }

    // Mobile menu
    const ham = document.getElementById('hamburger');
    const mm = document.getElementById('mobileMenu');
    if (ham && mm) {
        ham.addEventListener('click', () => {
            mm.classList.toggle('open');
            ham.classList.toggle('open');
        });
        window.closeMm = function() { 
            mm.classList.remove('open');
            ham.classList.remove('open');
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // If header/footer roots exist, load the components
    if (document.getElementById('header-root') || document.getElementById('footer-root')) {
        loadComponents();
    } else {
        // Fallback for pages that might not use the loader yet
        initComponentsLogic();
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
});
