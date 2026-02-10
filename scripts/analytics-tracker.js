/**
 * Analytics Tracker for WellnessRooted
 * Tracks user engagement and segments audiences
 */

class AnalyticsTracker {
    constructor() {
        this.engagementEvents = [];
        this.currentTopic = this.getTopicFromURL();
        this.init();
    }
    
    getTopicFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('topic') || 'stress-management';
    }
    
    init() {
        // Track page view with topic
        this.trackPageView();
        
        // Set up engagement tracking
        this.setupEngagementTracking();
        
        // Track time on page
        this.trackTimeOnPage();
    }
    
    trackPageView() {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'TopicPageView', {
                topic: this.currentTopic,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        }
        
        // Store in localStorage for retargeting
        this.storeUserInterest();
    }
    
    storeUserInterest() {
        try {
            const interests = JSON.parse(localStorage.getItem('wellness_interests') || '[]');
            if (!interests.includes(this.currentTopic)) {
                interests.push(this.currentTopic);
                localStorage.setItem('wellness_interests', JSON.stringify(interests));
            }
            
            // Also store last visit
            localStorage.setItem('last_visit', new Date().toISOString());
        } catch (e) {
            console.warn('Could not store analytics in localStorage:', e);
        }
    }
    
    setupEngagementTracking() {
        // Track scroll depth
        let scrollTracked = false;
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
            
            if (scrollDepth > 0.75 && !scrollTracked) {
                this.trackEngagement('scroll_75');
                scrollTracked = true;
            }
        });
        
        // Track CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="clickbank.net"], .cta-button, .primary-cta')) {
                this.trackEngagement('cta_click', {
                    element: e.target.textContent.trim().substring(0, 50),
                    href: e.target.href || ''
                });
            }
        });
    }
    
    trackEngagement(eventType, additionalData = {}) {
        const eventData = {
            event_type: eventType,
            topic: this.currentTopic,
            timestamp: new Date().toISOString(),
            ...additionalData
        };
        
        this.engagementEvents.push(eventData);
        
        // Send to Facebook Pixel if available
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'ContentEngagement', eventData);
        }
        
        // Update localStorage
        this.updateEngagementStorage(eventData);
    }
    
    updateEngagementStorage(eventData) {
        try {
            const engagements = JSON.parse(localStorage.getItem('wellness_engagements') || '[]');
            engagements.push(eventData);
            localStorage.setItem('wellness_engagements', JSON.stringify(engagements.slice(-20))); // Keep last 20
        } catch (e) {
            console.warn('Could not update engagement storage:', e);
        }
    }
    
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            if (timeSpent > 10) { // Only track if spent more than 10 seconds
                this.trackEngagement('time_on_page', {
                    seconds: timeSpent
                });
            }
        });
    }
    
    // Public method to track custom events
    static track(eventName, data = {}) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, {
                ...data,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.WellnessAnalytics = new AnalyticsTracker();
    
    // Make tracker globally available
    console.log('WellnessRooted Analytics initialized');
});
