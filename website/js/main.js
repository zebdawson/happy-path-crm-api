// VoiceCapture AI - Main JavaScript

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('VoiceCapture AI - Website Loaded');

    // Initialize all features
    initScrollAnimations();
    initFormValidation();
    initLazyLoading();
    initSmoothScroll();
    initBackToTop();
    initExitIntent();
    initAnalyticsTracking();
});

// =====================================
// SCROLL ANIMATIONS
// =====================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// =====================================
// FORM VALIDATION
// =====================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'This field is required');
                } else {
                    clearFieldError(field);
                }

                // Email validation
                if (field.type === 'email' && field.value) {
                    if (!isValidEmail(field.value)) {
                        isValid = false;
                        showFieldError(field, 'Please enter a valid email');
                    }
                }

                // Phone validation
                if (field.type === 'tel' && field.value) {
                    if (!isValidPhone(field.value)) {
                        isValid = false;
                        showFieldError(field, 'Please enter a valid phone number');
                    }
                }
            });

            if (isValid) {
                submitForm(form);
            }
        });
    });
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    let errorEl = field.nextElementSibling;

    if (!errorEl || !errorEl.classList.contains('field-error')) {
        errorEl = document.createElement('div');
        errorEl.className = 'field-error text-red-500 text-sm mt-1';
        field.parentNode.insertBefore(errorEl, field.nextSibling);
    }

    errorEl.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('field-error')) {
        errorEl.remove();
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function submitForm(form) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Submitting...';

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Check for honeypot (spam protection)
    if (data._honeypot) {
        console.log('Spam detected');
        return;
    }

    // Submit to your backend/webhook
    fetch(form.action || '/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Success
        showSuccessMessage('Thank you! We\'ll be in touch soon.');
        form.reset();

        // Track conversion
        trackEvent('form_submit', {
            form_name: form.id || 'unknown',
            form_location: window.location.pathname
        });

        // Redirect if specified
        if (form.dataset.redirect) {
            setTimeout(() => {
                window.location.href = form.dataset.redirect;
            }, 1500);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Something went wrong. Please try again or call us directly.');
    })
    .finally(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalBtnText;
    });
}

// =====================================
// LAZY LOADING IMAGES
// =====================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
        });
    }
}

// =====================================
// SMOOTH SCROLL
// =====================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// =====================================
// BACK TO TOP BUTTON
// =====================================
function initBackToTop() {
    // Create button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Click handler
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =====================================
// EXIT INTENT POPUP
// =====================================
function initExitIntent() {
    let exitIntentShown = false;

    // Check if already shown in this session
    if (sessionStorage.getItem('exitIntentShown')) {
        return;
    }

    document.addEventListener('mouseleave', function(e) {
        if (e.clientY < 0 && !exitIntentShown) {
            exitIntentShown = true;
            sessionStorage.setItem('exitIntentShown', 'true');
            showExitIntentPopup();
        }
    });
}

function showExitIntentPopup() {
    // Only show on certain pages
    const currentPage = window.location.pathname;
    if (currentPage.includes('/demo') || currentPage.includes('/thank-you')) {
        return;
    }

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'exit-popup';
    popup.innerHTML = `
        <div class="exit-popup-content">
            <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onclick="this.closest('.exit-popup').remove()">&times;</button>
            <div class="text-center">
                <div class="text-5xl mb-4">⏰</div>
                <h3 class="text-2xl font-bold mb-4">Wait! Before You Go...</h3>
                <p class="text-lg text-gray-600 mb-6">Call <strong>(555) 123-4567</strong> right now and talk to our AI receptionist.</p>
                <p class="text-gray-600 mb-8">Try to stump it. Seriously.</p>
                <div class="flex gap-4 justify-center">
                    <a href="tel:+1-555-123-4567" class="bg-brand-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        📞 Call Now
                    </a>
                    <a href="/website/demo.html" class="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                        Book Demo
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Track event
    trackEvent('exit_intent_shown', {
        page: window.location.pathname
    });

    // Close on background click
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.remove();
        }
    });
}

// =====================================
// ANALYTICS TRACKING
// =====================================
function initAnalyticsTracking() {
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                phone_number: this.getAttribute('href'),
                location: this.closest('section')?.id || 'unknown'
            });
        });
    });

    // Track CTA clicks
    document.querySelectorAll('a[href*="demo"], a[href*="calculator"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('cta_click', {
                cta_text: this.textContent.trim(),
                cta_url: this.getAttribute('href'),
                location: this.closest('section')?.id || 'unknown'
            });
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (scrollPercent >= 25 && scrollPercent < 30) {
                trackEvent('scroll_depth', { depth: '25%' });
            } else if (scrollPercent >= 50 && scrollPercent < 55) {
                trackEvent('scroll_depth', { depth: '50%' });
            } else if (scrollPercent >= 75 && scrollPercent < 80) {
                trackEvent('scroll_depth', { depth: '75%' });
            } else if (scrollPercent >= 90) {
                trackEvent('scroll_depth', { depth: '100%' });
            }
        }
    }, 500));
}

function trackEvent(eventName, eventData = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, eventData);
    }

    // Console log for debugging
    console.log('Event tracked:', eventName, eventData);
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'error-message';
    messageEl.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// =====================================
// ROI CALCULATOR
// =====================================
function calculateROI(callsPerDay, missedPercent, avgSale, industry) {
    // Industry-specific booking rates
    const bookingRates = {
        'auto': 0.45,
        'medspa': 0.60,
        'hvac': 0.55,
        'dental': 0.70,
        'legal': 0.40,
        'home-services': 0.50,
        'default': 0.50
    };

    const bookingRate = bookingRates[industry] || bookingRates['default'];

    // Calculate monthly numbers
    const monthlyMissedCalls = Math.round(callsPerDay * 30 * (missedPercent / 100));
    const estimatedBookings = Math.round(monthlyMissedCalls * bookingRate);
    const lostRevenue = Math.round(estimatedBookings * avgSale);
    const annualLoss = lostRevenue * 12;

    // Calculate ROI with VoiceCapture AI
    const serviceCost = 497; // Professional plan
    const recoveredRevenue = lostRevenue;
    const netProfit = recoveredRevenue - serviceCost;
    const roi = Math.round(recoveredRevenue / serviceCost);
    const paybackDays = Math.round((serviceCost / recoveredRevenue) * 30);

    return {
        monthlyMissedCalls,
        estimatedBookings,
        lostRevenue,
        annualLoss,
        serviceCost,
        recoveredRevenue,
        netProfit,
        roi,
        paybackDays
    };
}

// =====================================
// COUNTDOWN TIMER
// =====================================
function initCountdownTimer(endDate, elementId) {
    const countdownEl = document.getElementById(elementId);
    if (!countdownEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            countdownEl.innerHTML = 'EXPIRED';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `
            <span class="countdown-digit">${days.toString().padStart(2, '0')}</span>d
            <span class="countdown-digit">${hours.toString().padStart(2, '0')}</span>h
            <span class="countdown-digit">${minutes.toString().padStart(2, '0')}</span>m
            <span class="countdown-digit">${seconds.toString().padStart(2, '0')}</span>s
        `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =====================================
// EXPORT FUNCTIONS
// =====================================
window.VoiceCaptureAI = {
    calculateROI,
    trackEvent,
    showSuccessMessage,
    showErrorMessage,
    initCountdownTimer
};
