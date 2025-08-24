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
/**
 * Peter Lightspeed Portfolio - Testimonials Section JavaScript
 * Handles testimonial carousel and form submission
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTestimonialCarousel();
    initTestimonialForm();
    initFormValidation();
});

/**
 * Testimonial Carousel Enhancement
 * Adds keyboard navigation, touch swipe support, and auto-pause on hover
 */
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    if (!carousel || typeof bootstrap === 'undefined') return;
    
    const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel, {
        interval: 6000,
        keyboard: true,
        pause: 'hover',
        wrap: true
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only respond to arrow keys if carousel is in viewport
        if (!isElementInViewport(carousel)) return;
        
        if (e.key === 'ArrowLeft') {
            carouselInstance.prev();
        } else if (e.key === 'ArrowRight') {
            carouselInstance.next();
        }
    });
    
    // Add swipe support for mobile with improved detection
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const horizontalDiff = touchEndX - touchStartX;
        const verticalDiff = touchEndY - touchStartY;
        
        // Only register as horizontal swipe if horizontal movement is greater than vertical
        // and exceeds the threshold
        if (Math.abs(horizontalDiff) > Math.abs(verticalDiff) && Math.abs(horizontalDiff) > swipeThreshold) {
            if (horizontalDiff < 0) {
                carouselInstance.next();
            } else {
                carouselInstance.prev();
            }
        }
    }
    
    // Add animation effects when slides change
    carousel.addEventListener('slide.bs.carousel', function(e) {
        const currentSlide = e.relatedTarget;
        
        // Add fade-in effect to the new slide
        setTimeout(() => {
            currentSlide.querySelectorAll('.testimonial-img-wrapper, .testimonial-content')
                .forEach(el => el.classList.add('animate__animated', 'animate__fadeIn'));
        }, 50);
    });
    
    // Update progress indicator
    let carouselItems = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    
    carousel.addEventListener('slid.bs.carousel', function(e) {
        currentIndex = [...carouselItems].indexOf(e.relatedTarget);
        updateProgressIndicator(currentIndex, carouselItems.length);
    });
    
    // Initialize progress indicator
    if (document.querySelector('.carousel-progress-bar')) {
        updateProgressIndicator(0, carouselItems.length);
    }
    
    // Add accessibility enhancements
    carousel.querySelectorAll('.carousel-item').forEach(item => {
        item.setAttribute('role', 'tabpanel');
        item.setAttribute('aria-roledescription', 'slide');
    });
}

/**
 * Updates the visual progress indicator for the carousel
 */
function updateProgressIndicator(currentIndex, totalItems) {
    const progressBar = document.querySelector('.carousel-progress-bar');
    if (!progressBar) return;
    
    const progressPercentage = ((currentIndex + 1) / totalItems) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
    progressBar.setAttribute('aria-valuetext', `Slide ${currentIndex + 1} of ${totalItems}`);
}

/**
 * Testimonial Form Initialization
 * Handles form submission with validation and feedback
 */
function initTestimonialForm() {
    const testimonialForm = document.getElementById('testimonialForm');
    if (!testimonialForm) return;
    
    testimonialForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Don't proceed if form is invalid
        if (!testimonialForm.checkValidity()) {
            testimonialForm.classList.add('was-validated');
            return;
        }
        
        const submitButton = testimonialForm.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('testimonialFormStatus') || 
                         createStatusDiv(testimonialForm);
        
        // Show loading state
        setButtonLoading(submitButton, true);
        
        // Process form data
        const formData = new FormData(testimonialForm);
        
        // Handle file upload
        const photoInput = document.getElementById('testimonialPhoto');
        if (photoInput && photoInput.files.length > 0) {
            const file = photoInput.files[0];
            
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showFormMessage(statusDiv, 'error', 
                    'Photo exceeds maximum size of 2MB. Please choose a smaller file.');
                setButtonLoading(submitButton, false);
                return;
            }
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                showFormMessage(statusDiv, 'error', 
                    'Please upload a valid image file (JPEG, PNG, GIF, or WebP).');
                setButtonLoading(submitButton, false);
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
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Success message
            showFormMessage(statusDiv, 'success', 
                'Thank you for your testimonial! It will be reviewed and added to the site soon.');
            testimonialForm.reset();
            testimonialForm.classList.remove('was-validated');
            
            // Scroll to status message
            statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showFormMessage(statusDiv, 'error', 
                'Sorry, there was an error submitting your testimonial. Please try again or contact me directly.');
        })
        .finally(() => {
            // Reset button state
            setButtonLoading(submitButton, false);
        });
    });
    
    // Add real-time character counter for testimonial message
    const messageField = document.getElementById('testimonialMessage');
    if (messageField) {
        const counterContainer = document.createElement('div');
        counterContainer.className = 'form-text text-end';
        counterContainer.id = 'charCounter';
        messageField.parentNode.appendChild(counterContainer);
        
        messageField.addEventListener('input', function() {
            const maxLength = 500; // Set your desired max length
            const currentLength = messageField.value.length;
            const remainingChars = maxLength - currentLength;
            
            counterContainer.textContent = `${currentLength}/${maxLength} characters`;
            
            if (remainingChars < 50) {
                counterContainer.classList.add('text-warning');
            } else {
                counterContainer.classList.remove('text-warning');
            }
            
            if (remainingChars < 0) {
                counterContainer.classList.add('text-danger');
                messageField.value = messageField.value.substring(0, maxLength);
                counterContainer.textContent = `${maxLength}/${maxLength} characters (maximum reached)`;
            } else {
                counterContainer.classList.remove('text-danger');
            }
        });
    }
}

/**
 * Form Validation Initialization
 * Sets up client-side validation for all forms
 */
function initFormValidation() {
    // Add validation styles to all forms with needs-validation class
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        // Add validation check on input change
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', function() {
                checkInputValidity(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid')) {
                    checkInputValidity(input);
                }
            });
        });
    });
}

/**
 * Check validity of a single input field
 */
function checkInputValidity(input) {
    if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
}

/**
 * Set button loading state
 */
function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || '<i class="bi bi-send me-1"></i> Submit Testimonial';
    }
}

/**
 * Show form message (success or error)
 */
function showFormMessage(container, type, message) {
    if (!container) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
    
    container.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="bi ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto-hide message after 8 seconds
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 8000);
}

/**
 * Create status div if it doesn't exist
 */
function createStatusDiv(form) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'testimonialFormStatus';
    statusDiv.className = 'mt-3';
    form.appendChild(statusDiv);
    return statusDiv;
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
// Newsletter signup with proper error handling
document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('newsletterEmail').value;
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Subscribing...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                source: 'portfolio_website',
                timestamp: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('🎉 Thank you for subscribing! Check your email for confirmation.', 'success');
            this.reset();
            
            // Optional: Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    'event_category': 'engagement',
                    'event_label': 'footer_newsletter'
                });
            }
        } else {
            throw new Error(data.error || 'Subscription failed');
        }
    } catch (error) {
        console.error('Newsletter signup error:', error);
        showNotification('Something went wrong. Please try again later.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
