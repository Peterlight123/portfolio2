/**
 * Peter Lightspeed Portfolio - Main Script
 * Handles animations, form validation, and interactive elements
 */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll) library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Show welcome message
    showWelcomeMessage();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
});

// ===== WELCOME MESSAGE =====
function showWelcomeMessage() {
    // Create a toast notification
    const toastHTML = `
        <div class="toast-container position-fixed top-0 end-0 p-3">
            <div id="welcomeToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-primary text-white">
                    <strong class="me-auto">Welcome!</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Welcome to Peter Lightspeed's Portfolio! Explore my services and get in touch.
                </div>
            </div>
        </div>
    `;
    
    // Add toast to body
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show toast if Bootstrap is available
    const toastElement = document.getElementById('welcomeToast');
    if (toastElement && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        toast.show();
    }
}

// ===== FORM HANDLING =====
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner-border');
    const statusDiv = document.getElementById('form-status');
    
    // Validate form
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    if (spinner) spinner.classList.remove('d-none');
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Submit form
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showFormStatus('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');
            form.reset();
            form.classList.remove('was-validated');
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showFormStatus('error', 'Sorry, there was an error sending your message. Please try again or contact me directly via email.');
    })
    .finally(() => {
        // Reset button state
        submitButton.disabled = false;
        if (spinner) spinner.classList.add('d-none');
        submitButton.innerHTML = 'Send Message';
    });
}

function showFormStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    
    statusDiv.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="bi ${iconClass} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success' && typeof bootstrap !== 'undefined') {
        setTimeout(() => {
            const alert = statusDiv.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip processing for dropdown toggles
            if (this.getAttribute('data-bs-toggle') === 'dropdown') return;
            
            // Skip if href is just "#"
            if (href === "#") return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80; // Account for fixed navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Add keyboard support for social buttons
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('social-btn') || e.target.classList.contains('social-icon')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== EXTERNAL LINK ANIMATIONS =====
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon) {
            const originalClass = icon.className;
            icon.className = 'bi bi-hourglass-split me-2';
            setTimeout(() => {
                icon.className = originalClass;
            }, 2000);
        }
    });
});

// ===== TESTIMONIAL CAROUSEL ENHANCEMENT =====
function enhanceTestimonialCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel && typeof bootstrap !== 'undefined') {
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                bootstrap.Carousel.getInstance(carousel).prev();
            } else if (e.key === 'ArrowRight') {
                bootstrap.Carousel.getInstance(carousel).next();
            }
        });
        
        // Add swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            if (touchEndX < touchStartX) {
                bootstrap.Carousel.getInstance(carousel).next();
            }
            if (touchEndX > touchStartX) {
                bootstrap.Carousel.getInstance(carousel).prev();
            }
        }
    }
}

// Call enhancement functions after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceTestimonialCarousel();
});
// Testimonial Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const submitButton = testimonialForm.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('testimonialFormStatus');
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
            
            // Handle file upload
            const photoInput = document.getElementById('testimonialPhoto');
            let formData = new FormData(testimonialForm);
            
            // Check if there's a file and it's valid
            if (photoInput.files.length > 0) {
                const file = photoInput.files[0];
                // Check file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    statusDiv.innerHTML = `
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            Photo exceeds maximum size of 2MB. Please choose a smaller file.
                        </div>
                    `;
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="bi bi-send me-1"></i> Submit Testimonial';
                    return;
                }
                formData.append('photo', file);
            }
            
            // Submit form
            fetch(testimonialForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    statusDiv.innerHTML = `
                        <div class="alert alert-success">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            Thank you for your testimonial! It will be reviewed and added to the site soon.
                        </div>
                    `;
                    testimonialForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                statusDiv.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Sorry, there was an error submitting your testimonial. Please try again or contact me directly.
                    </div>
                `;
            })
            .finally(() => {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="bi bi-send me-1"></i> Submit Testimonial';
            });
        });
    }
});
