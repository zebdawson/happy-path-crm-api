/**
 * Analytics Integration Script
 * Multi-Service Home Improvement Lead Generation System
 *
 * This script centralizes all analytics tracking including:
 * - Google Analytics 4
 * - Facebook Pixel
 * - Custom event tracking
 * - Conversion tracking
 * - User behavior tracking
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const ANALYTICS_CONFIG = {
    // Replace these with your actual IDs
    GA_MEASUREMENT_ID: 'GA_MEASUREMENT_ID', // e.g., 'G-XXXXXXXXXX'
    FB_PIXEL_ID: 'YOUR_PIXEL_ID',           // e.g., '1234567890'

    // Enable/disable different tracking methods
    enableGA: true,
    enableFB: true,
    enableConsoleLog: true, // For debugging

    // Services mapping
    services: {
        'Water Filtration': 'water',
        'Solar Installation': 'solar',
        'Landscaping': 'landscaping',
        'Home Security': 'security'
    }
};

// ============================================================================
// GOOGLE ANALYTICS 4 INTEGRATION
// ============================================================================

function initGoogleAnalytics() {
    if (!ANALYTICS_CONFIG.enableGA) return;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
        'send_page_view': true,
        'cookie_flags': 'SameSite=None;Secure'
    });

    logDebug('Google Analytics initialized');
}

// ============================================================================
// FACEBOOK PIXEL INTEGRATION
// ============================================================================

function initFacebookPixel() {
    if (!ANALYTICS_CONFIG.enableFB) return;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', ANALYTICS_CONFIG.FB_PIXEL_ID);
    fbq('track', 'PageView');

    logDebug('Facebook Pixel initialized');
}

// ============================================================================
// EVENT TRACKING FUNCTIONS
// ============================================================================

/**
 * Track page view
 */
function trackPageView(pagePath, pageTitle) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_path': pagePath || window.location.pathname,
            'page_title': pageTitle || document.title
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }

    logDebug('Page view tracked:', pagePath);
}

/**
 * Track form submission / lead
 */
function trackLead(service, value = 1) {
    const serviceSlug = ANALYTICS_CONFIG.services[service] || service;

    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            'event_category': 'Lead Generation',
            'event_label': service,
            'value': value
        });

        // Also track as conversion
        gtag('event', 'conversion', {
            'send_to': ANALYTICS_CONFIG.GA_MEASUREMENT_ID,
            'event_category': 'Lead',
            'event_label': service
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: service,
            content_category: 'Lead Form',
            value: value,
            currency: 'USD'
        });
    }

    logDebug('Lead tracked:', service);
}

/**
 * Track button/link clicks
 */
function trackClick(elementType, elementLabel, elementValue) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Engagement',
            'event_label': `${elementType}: ${elementLabel}`,
            'value': elementValue || 1
        });
    }

    logDebug('Click tracked:', elementType, elementLabel);
}

/**
 * Track calculator usage
 */
function trackCalculatorUse(calculatorType, inputValues) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculator_use', {
            'event_category': 'Tool Engagement',
            'event_label': calculatorType,
            'calculator_type': calculatorType,
            'input_values': JSON.stringify(inputValues)
        });
    }

    // Facebook Pixel - custom event
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', 'CalculatorUse', {
            calculator_type: calculatorType
        });
    }

    logDebug('Calculator use tracked:', calculatorType);
}

/**
 * Track video plays
 */
function trackVideoPlay(videoTitle, videoUrl) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_start', {
            'event_category': 'Video',
            'event_label': videoTitle,
            'video_url': videoUrl
        });
    }

    logDebug('Video play tracked:', videoTitle);
}

/**
 * Track resource downloads
 */
function trackDownload(resourceName, resourceType) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'file_download', {
            'event_category': 'Resource Download',
            'event_label': resourceName,
            'file_name': resourceName,
            'file_type': resourceType
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', 'ResourceDownload', {
            content_name: resourceName,
            content_type: resourceType
        });
    }

    logDebug('Download tracked:', resourceName);
}

/**
 * Track phone number clicks (click-to-call)
 */
function trackPhoneClick(phoneNumber, location) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
            'event_category': 'Contact',
            'event_label': `Phone: ${phoneNumber}`,
            'location': location
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
            content_name: 'Phone Click',
            phone_number: phoneNumber
        });
    }

    logDebug('Phone click tracked:', phoneNumber);
}

/**
 * Track scroll depth
 */
function trackScrollDepth(percentage) {
    // Only track at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    if (!milestones.includes(percentage)) return;

    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll', {
            'event_category': 'Engagement',
            'event_label': `${percentage}%`,
            'percent_scrolled': percentage
        });
    }

    logDebug('Scroll depth tracked:', percentage + '%');
}

/**
 * Track time on page
 */
function trackTimeOnPage() {
    const startTime = Date.now();

    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds

        // Only track if user spent more than 10 seconds
        if (timeSpent < 10) return;

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'event_category': 'Engagement',
                'name': 'time_on_page',
                'value': timeSpent
            });
        }
    });
}

// ============================================================================
// AUTO-TRACKING INITIALIZATION
// ============================================================================

function initAutoTracking() {
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            const location = this.closest('header') ? 'Header' : this.closest('footer') ? 'Footer' : 'Body';
            trackPhoneClick(phoneNumber, location);
        });
    });

    // Track CTA button clicks
    document.querySelectorAll('.cta-button, [class*="cta"]').forEach(button => {
        button.addEventListener('click', function() {
            const label = this.textContent.trim();
            trackClick('CTA Button', label);
        });
    });

    // Track resource downloads
    document.querySelectorAll('[onclick*="download"]').forEach(button => {
        button.addEventListener('click', function() {
            const resourceName = this.closest('.email-template, [class*="resource"]')
                ?.querySelector('h3')?.textContent || 'Unknown Resource';
            trackDownload(resourceName, 'PDF');
        });
    });

    // Track scroll depth
    let scrollTracked = {25: false, 50: false, 75: false, 100: false};

    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        [25, 50, 75, 100].forEach(milestone => {
            if (scrollPercent >= milestone && !scrollTracked[milestone]) {
                trackScrollDepth(milestone);
                scrollTracked[milestone] = true;
            }
        });
    });

    // Track time on page
    trackTimeOnPage();

    logDebug('Auto-tracking initialized');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function logDebug(...args) {
    if (ANALYTICS_CONFIG.enableConsoleLog) {
        console.log('[Analytics]', ...args);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tracking services
    initGoogleAnalytics();
    initFacebookPixel();

    // Set up automatic tracking
    initAutoTracking();

    // Track initial page view
    trackPageView();

    logDebug('Analytics system initialized');
});

// ============================================================================
// EXPORT FOR EXTERNAL USE
// ============================================================================

// Make functions available globally
window.analytics = {
    trackPageView,
    trackLead,
    trackClick,
    trackCalculatorUse,
    trackVideoPlay,
    trackDownload,
    trackPhoneClick,
    trackScrollDepth
};

// For debugging: log all tracking events to console
if (ANALYTICS_CONFIG.enableConsoleLog) {
    console.log('Analytics tracking enabled. Available functions:', Object.keys(window.analytics));
}
