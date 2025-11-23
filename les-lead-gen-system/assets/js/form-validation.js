/**
 * Form Validation & Enhancement Script
 * Multi-Service Home Improvement Lead Generation System
 *
 * Features:
 * - Real-time form validation
 * - Phone number formatting
 * - Email validation
 * - Required field checking
 * - Error message display
 * - Form submission tracking
 */

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-numeric characters
    const cleaned = input.value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    let formatted = '';
    if (cleaned.length > 0) {
        if (cleaned.length <= 3) {
            formatted = cleaned;
        } else if (cleaned.length <= 6) {
            formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
            formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    }

    input.value = formatted;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (US format)
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

// Show error message
function showError(input, message) {
    const formGroup = input.parentElement;
    let errorDiv = formGroup.querySelector('.error-message');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-600 text-sm mt-1';
        formGroup.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    input.classList.add('border-red-600');
    input.classList.remove('border-green-600');
}

// Clear error message
function clearError(input) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');

    if (errorDiv) {
        errorDiv.remove();
    }

    input.classList.remove('border-red-600');
    input.classList.add('border-green-600');
}

// Validate single field
function validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;

    // Check if required field is empty
    if (input.required && !value) {
        showError(input, 'This field is required');
        return false;
    }

    // Email validation
    if (type === 'email' && value) {
        if (!isValidEmail(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        if (!isValidPhone(value)) {
            showError(input, 'Please enter a valid 10-digit phone number');
            return false;
        }
    }

    // If all validations pass
    clearError(input);
    return true;
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="tel"]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

    // Add phone formatting to all tel inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });

        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Add email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Add required field validation
    const requiredInputs = document.querySelectorAll('input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Form submission handling
    const forms = document.querySelectorAll('form[id*="leadForm"], form[id*="Form"]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Validate form before submission
            if (!validateForm(this)) {
                e.preventDefault();

                // Scroll to first error
                const firstError = this.querySelector('.border-red-600');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }

                return false;
            }

            // Track form submission
            trackFormSubmission(this);

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Submitting... ⏳';
            }
        });
    });

});

// Track form submissions (integrate with analytics)
function trackFormSubmission(form) {
    const formId = form.id || 'unknown';
    const service = form.querySelector('input[name="service"]')?.value || 'unknown';

    console.log('Form submitted:', {
        formId: formId,
        service: service,
        timestamp: new Date().toISOString()
    });

    // Google Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'Lead Generation',
            'event_label': service,
            'value': 1
        });
    }

    // Facebook Pixel tracking (if available)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: service,
            content_category: 'Lead Form'
        });
    }
}

// Smooth scroll to form (for CTA buttons)
function scrollToForm() {
    const form = document.querySelector('#form, #leadForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Focus first input after scroll
        setTimeout(() => {
            const firstInput = form.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
}

// Add smooth scroll to all links with #form anchor
document.addEventListener('DOMContentLoaded', function() {
    const formLinks = document.querySelectorAll('a[href*="#form"]');
    formLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToForm();
        });
    });
});

// Auto-save form data to localStorage (optional - for better UX)
function enableFormAutoSave(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Load saved data on page load
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type !== 'hidden') {
                    input.value = data[key];
                }
            });
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }

    // Save data on input
    form.addEventListener('input', function() {
        const formData = {};
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.name && input.type !== 'hidden' && input.type !== 'password') {
                formData[input.name] = input.value;
            }
        });

        localStorage.setItem(`form_${formId}`, JSON.stringify(formData));
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem(`form_${formId}`);
    });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPhoneNumber,
        isValidEmail,
        isValidPhone,
        validateField,
        validateForm,
        scrollToForm
    };
}
