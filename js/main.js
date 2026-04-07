// File loaded and components executed natively

function initComponentsLogic() {
    // Navbar elevation
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 44;
            nav.classList.toggle('elevated', isScrolled);
            document.body.classList.toggle('scrolled', isScrolled);
        });
    }

    // Mobile menu
    const ham = document.getElementById('hamburger');
    const mm = document.getElementById('mobileMenu');
    if (ham && mm) {
        ham.addEventListener('click', () => {
            const isOpen = mm.classList.toggle('open');
            ham.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        window.closeMm = function() { 
            mm.classList.remove('open');
            ham.classList.remove('open');
            document.body.style.overflow = '';
            
            // Reset accordions when menu closes
            document.querySelectorAll('.mobile-nav-group').forEach(g => g.classList.remove('active'));
        };

        // Close mobile menu on resize if switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                closeMm();
            }
        });

        // Handle Services Toggle separately for mobile
        const svcToggle = document.getElementById('mobileSvcToggle');
        if (svcToggle) {
            svcToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const group = svcToggle.closest('.mobile-nav-group');
                if (group) {
                    group.classList.toggle('active');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initComponentsLogic();
    
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

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                const duration = 2500; // 2.5 seconds
                const format = el.getAttribute('data-format') || 'int';
                
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    const currentVal = target * easeProgress;
                    
                    if (format === 'float') {
                        el.innerText = currentVal.toFixed(1);
                    } else {
                        el.innerText = Math.floor(currentVal).toLocaleString('en-US');
                    }
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        if (format === 'float') el.innerText = target.toFixed(1);
                        else el.innerText = target.toLocaleString('en-US');
                    }
                };
                
                window.requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });
    
    counters.forEach(counter => counterObserver.observe(counter));
});

// Global form submit logic for contact.html
window.handleSubmit = function() {
    const fnameEl = document.getElementById('fname');
    const femailEl = document.getElementById('femail');
    if (fnameEl && femailEl) {
        const name = fnameEl.value.trim();
        const email = femailEl.value.trim();
        if (!name || !email) {
            alert('Please fill in your name and email address.');
            return;
        }
        document.getElementById('formBody').style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.classList.add('visible');
    }
}
