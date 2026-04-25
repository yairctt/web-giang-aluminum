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
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    revealEls.forEach(el => ro.observe(el));

    // Filter buttons (visual only)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // File Upload UI Logic
    const photoUpload = document.getElementById('photoUpload');
    const fileNameDisplay = document.getElementById('fileName');
    const wrapper = document.querySelector('.file-upload-premium');

    if (photoUpload && wrapper) {
        photoUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                fileNameDisplay.textContent = `Attached: ${fileName}`;
                fileNameDisplay.classList.add('visible');
                wrapper.style.borderColor = 'var(--gold)';
                wrapper.style.background = 'rgba(201, 163, 62, 0.05)';
            } else {
                fileNameDisplay.classList.remove('visible');
                wrapper.style.borderColor = '';
                wrapper.style.background = '';
            }
        });

        // Drag and Drop effects
        wrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            wrapper.classList.add('dragover');
        });
        wrapper.addEventListener('dragleave', () => wrapper.classList.remove('dragover'));
        wrapper.addEventListener('drop', () => wrapper.classList.remove('dragover'));
    }

    // Form submit (Real API Request)
    const contactForm = document.getElementById('contactForm');
    const formBtn = document.getElementById('formBtn');
    
    if (contactForm && formBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI Loading state
            const originalText = formBtn.innerHTML;
            formBtn.disabled = true;
            formBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            formBtn.style.opacity = '0.7';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('/api/send', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    formBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> &nbsp;Message Sent — We\'ll be in touch within 24h';
                    formBtn.style.background = '#3a6b3a';
                    formBtn.style.color = '#fff';
                    contactForm.reset();
                    if(fileNameDisplay) fileNameDisplay.classList.remove('visible');
                    if(wrapper) {
                        wrapper.style.borderColor = '';
                        wrapper.style.background = '';
                    }
                    
                    const successEl = document.getElementById('formSuccess');
                    if(successEl) {
                        contactForm.style.display = 'none';
                        successEl.classList.add('visible');
                        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    const err = await response.json();
                    throw new Error(err.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Submission error:', error);
                formBtn.innerHTML = '<i class="bi bi-x-circle-fill"></i> &nbsp;Error sending message. Please try again or call us.';
                formBtn.style.background = '#d9534f';
                formBtn.style.color = '#fff';
            } finally {
                // Reset button after delay
                setTimeout(() => {
                    formBtn.disabled = false;
                    formBtn.innerHTML = originalText;
                    formBtn.style.background = '';
                    formBtn.style.color = '';
                    formBtn.style.opacity = '1';
                }, 5000);
            }
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
    
    // --- Reviews Carousel Dots Logic ---
    const carousel = document.querySelector('.homestars-carousel');
    const dots = document.querySelectorAll('.dot');

    if (carousel && dots.length > 0) {
        carousel.addEventListener('scroll', () => {
            const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });

        // Make dots clickable
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                carousel.scrollTo({
                    left: carousel.offsetWidth * i,
                    behavior: 'smooth'
                });
            });
        });

        // Make arrows clickable
        const prevBtn = document.getElementById('prevReview');
        const nextBtn = document.getElementById('nextReview');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
                carousel.scrollTo({
                    left: carousel.offsetWidth * (index - 1),
                    behavior: 'smooth'
                });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
                carousel.scrollTo({
                    left: carousel.offsetWidth * (index + 1),
                    behavior: 'smooth'
                });
            });
        }
    }

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

// Portfolio Grid Filtering Logic
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                        // Small timeout to allow display:block to apply before animating opacity/transform if needed
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        // Wait for transition to finish before hiding
                        setTimeout(() => {
                            if (!item.classList.contains('hidden') && btn.classList.contains('active')) {
                                item.classList.add('hidden');
                            }
                        }, 400); // Matches the CSS transition duration
                    }
                });
            });
        });
    }

    // Image Modal (Lightbox) Logic
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModalBtn = document.getElementById('closeModal');

    if (modal && modalImg && closeModalBtn) {
        // Open modal when clicking a portfolio item
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.querySelector('.portfolio-cat');
                
                if (img) {
                    modal.classList.add('show');
                    modalImg.src = img.src;
                    
                    if (caption) {
                        modalCaption.textContent = caption.textContent;
                    } else {
                        modalCaption.textContent = '';
                    }
                    
                    // Prevent body scroll
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('show');
            // Re-enable body scroll
            document.body.style.overflow = '';
            // Small delay to clear src so it doesn't flash when opening next time
            setTimeout(() => {
                if(!modal.classList.contains('show')) {
                    modalImg.src = '';
                }
            }, 300);
        };

        // Close on X click
        closeModalBtn.addEventListener('click', closeModal);

        // Close on clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
    // --- Gallery Pagination Logic (3-Step Max-Height) ---
    const portfolioWrapper = document.getElementById('portfolioWrapper');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const viewMoreContainer = document.getElementById('viewMoreContainer');
    let currentStep = 1;

    if (portfolioWrapper && viewMoreBtn && portfolioItems.length > 0) {
        // Define steps based on screen size
        const getStepIndices = () => {
            const isMobile = window.innerWidth < 768;
            return {
                step1: isMobile ? 20 : 32, 
                step2: isMobile ? 48 : 64
            };
        };

        // Function to calculate height based on item index
        const setGalleryHeight = (itemIndex, isResize = false) => {
            const visibleItems = Array.from(portfolioItems).filter(item => !item.classList.contains('hidden'));
            const targetItem = visibleItems[Math.min(itemIndex - 1, visibleItems.length - 1)];
            
            if (targetItem) {
                const itemOffsetTop = targetItem.offsetTop;
                const itemHeight = targetItem.offsetHeight;
                
                if (itemOffsetTop > 0) {
                    const height = itemOffsetTop + itemHeight - 60;
                    
                    // Disable transition for resize adjustments to avoid jumpy feeling
                    if (isResize) portfolioWrapper.style.transition = 'none';
                    portfolioWrapper.style.maxHeight = height + 'px';
                    if (isResize) {
                        // Re-enable transition after a brief moment
                        setTimeout(() => {
                            portfolioWrapper.style.transition = '';
                        }, 50);
                    }
                }
            }
        };

        // Initial Setup
        const initPagination = () => {
            const indices = getStepIndices();
            setGalleryHeight(indices.step1);
        };

        setTimeout(initPagination, 400);
        window.addEventListener('load', initPagination);

        viewMoreBtn.addEventListener('click', () => {
            const updatedIndices = getStepIndices();
            if (currentStep === 1) {
                setGalleryHeight(updatedIndices.step2);
                currentStep = 2;
                setTimeout(() => {
                    window.scrollBy({ top: 400, behavior: 'smooth' });
                }, 150);
            } else {
                portfolioWrapper.classList.remove('has-more');
                portfolioWrapper.classList.add('show-all');
                portfolioWrapper.style.maxHeight = 'none';
                if (viewMoreContainer) viewMoreContainer.style.display = 'none';
            }
        });

        // Re-calculate on resize ONLY if width changed (prevents jump on mobile scroll)
        let resizeTimer;
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;

            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (portfolioWrapper.classList.contains('show-all')) return;
                const resizeIndices = getStepIndices();
                if (currentStep === 1) setGalleryHeight(resizeIndices.step1, true);
                else if (currentStep === 2) setGalleryHeight(resizeIndices.step2, true);
            }, 250);
        });
    }
});
    }
});
