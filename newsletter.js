// Enhanced Newsletter signup with Formspree
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            const submitBtn = document.getElementById('newsletterBtn');
            const messageDiv = document.getElementById('newsletterMessage');
            const originalBtnText = submitBtn.innerHTML;
            
            // Validate email
            if (!isValidEmail(email)) {
                showNewsletterMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Subscribing...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                const response = await fetch('https://formspree.io/f/meoljzde', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNewsletterMessage('🎉 Thank you for subscribing! You\'ll receive a confirmation email shortly.', 'success');
                    this.reset();
                    
                    // Optional: Track conversion for analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'newsletter_signup', {
                            'event_category': 'engagement',
                            'event_label': 'footer_newsletter'
                        });
                    }
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        throw new Error(data.errors.map(error => error.message).join(', '));
                    } else {
                        throw new Error('Subscription failed');
                    }
                }
            } catch (error) {
                console.error('Newsletter signup error:', error);
                showNewsletterMessage('Something went wrong. Please try again later.', 'error');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Newsletter message display function
function showNewsletterMessage(message, type = 'info') {
    const messageDiv = document.getElementById('newsletterMessage');
    
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} mt-2`;
    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Alternative: Show notifications as toast (optional enhancement)
function showToastNotification(message, type = 'info') {
    // Remove existing notifications
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
    `;
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'error' ? 'exclamation-triangle-fill' : 'info-circle-fill'} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}
