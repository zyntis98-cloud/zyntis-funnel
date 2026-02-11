// module-loader.js - JSON-first with embedded fallback
// DESIGN PRESERVATION MODE: ACTIVE
// DO NOT MODIFY any layout/styling elements

const WellnessRootedLoader = {
    // Embedded fallback content - preserved for redundancy
    fallbackContent: {
        'stress-management': {
            cta: {
                headline: 'Ready for More Peace?',
                description: 'Join thousands who\'ve found calm with this 7-minute practice',
                buttonText: 'Learn About Mindfulness',
                affiliateLink: 'https://66758wz8452oer1zv4xl08swem.hop.clickbank.net?tid=zyntis_fb_main'
            },
            articles: [
                { title: 'Mindfulness Basics', readTime: 3 },
                { title: 'Stress Science', readTime: 4 },
                { title: 'Breathing Techniques', readTime: 5 }
            ]
        },
        'health-optimization': {
            cta: {
                headline: 'Ready to Transform Your Health?',
                description: 'Discover how morning rituals can optimize your metabolism',
                buttonText: 'Learn About Java Burn',
                affiliateLink: 'https://d8f50l6f175q3o48cke47dwu2s.hop.clickbank.net?tid=zyntis_fb_main'
            },
            articles: [
                { title: 'Morning Metabolism', readTime: 3 },
                { title: 'Coffee Benefits', readTime: 4 },
                { title: 'Healthy Routines', readTime: 5 }
            ]
        },
        'personal-growth': {
            cta: {
                headline: 'Ready to Unlock Your Potential?',
                description: 'Join thousands who\'ve transformed their mindset',
                buttonText: 'Learn About Wealth DNA',
                affiliateLink: 'https://f14dfo0k43wockbujhj2itbyf3.hop.clickbank.net?tid=zyntis_fb_main'
            },
            articles: [
                { title: 'Abundance Mindset', readTime: 3 },
                { title: 'Goal Setting', readTime: 4 },
                { title: 'Morning Success', readTime: 5 }
            ]
        }
    },

    // Load content from JSON with fallback
    async loadTopicContent(topic) {
        try {
            // Attempt to fetch JSON module
            const response = await fetch(`/content-library/modules/${topic}.json`);
            if (!response.ok) throw new Error('JSON not found');
            
            const data = await response.json();
            
            // Return first 3 articles for display (design preservation)
            return {
                cta: data.cta,
                articles: data.articles.slice(0, 3)
            };
        } catch (error) {
            console.log(`JSON load failed for ${topic}, using fallback`);
            return this.fallbackContent[topic] || this.fallbackContent['stress-management'];
        }
    },

    // Update page content - PRESERVES ALL DESIGN ELEMENTS
    async updateContent(topic) {
        const content = await this.loadTopicContent(topic);
        
        // Update article titles (ONLY these change)
        const articleTitles = document.querySelectorAll('.article-card h3, .card h3');
        if (articleTitles.length >= 3) {
            articleTitles[0].textContent = content.articles[0]?.title || 'Mindfulness Basics';
            articleTitles[1].textContent = content.articles[1]?.title || 'Stress Science';
            articleTitles[2].textContent = content.articles[2]?.title || 'Breathing Techniques';
        }

        // Update read times (ONLY numbers change)
        const readTimes = document.querySelectorAll('.read-time, .card p:contains("min read")');
        if (readTimes.length >= 3) {
            for (let i = 0; i < 3; i++) {
                const timeElement = readTimes[i];
                if (timeElement) {
                    timeElement.innerHTML = `${content.articles[i]?.readTime || i+3} min read`;
                }
            }
        }

        // Update CTA section (text and links)
        const ctaHeadline = document.querySelector('.cta-section h2, .cta-headline');
        if (ctaHeadline) ctaHeadline.textContent = content.cta.headline;

        const ctaDescription = document.querySelector('.cta-section p, .cta-description');
        if (ctaDescription) ctaDescription.textContent = content.cta.description;

        const ctaButton = document.querySelector('.cta-button, .cta-section .button');
        if (ctaButton) {
            ctaButton.textContent = content.cta.buttonText;
            ctaButton.href = content.cta.affiliateLink;
        }

        // Track pixel event
        if (typeof fbq === 'function') {
            fbq('track', 'TopicView', { topic: topic });
        }
    },

    // Initialize button listeners
    init() {
        const buttons = document.querySelectorAll('.topic-btn, [data-topic]');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const topic = btn.dataset.topic || 
                             btn.textContent.toLowerCase().includes('stress') ? 'stress-management' :
                             btn.textContent.toLowerCase().includes('health') ? 'health-optimization' :
                             'personal-growth';
                
                // Update URL
                const url = new URL(window.location);
                url.searchParams.set('topic', topic);
                window.history.pushState({}, '', url);
                
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load content
                this.updateContent(topic);
            });
        });

        // Check URL on load
        const urlParams = new URLSearchParams(window.location.search);
        const topic = urlParams.get('topic') || 'stress-management';
        
        // Set active button
        const activeBtn = Array.from(buttons).find(btn => {
            return btn.dataset.topic === topic ||
                   (btn.textContent.toLowerCase().includes('stress') && topic === 'stress-management') ||
                   (btn.textContent.toLowerCase().includes('health') && topic === 'health-optimization') ||
                   (btn.textContent.toLowerCase().includes('personal') && topic === 'personal-growth');
        });
        
        if (activeBtn) {
            buttons.forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
        }
        
        this.updateContent(topic);
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WellnessRootedLoader.init());
} else {
    WellnessRootedLoader.init();
}
