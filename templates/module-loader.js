// module-loader.js - Simple version that preserves your exact design
const WellnessRootedLoader = {
    content: {
        'stress-management': {
            title: 'Latest in Wellness',
            articles: [
                { title: 'Mindfulness Basics', readTime: 3 },
                { title: 'Stress Science', readTime: 4 },
                { title: 'Breathing Techniques', readTime: 5 }
            ],
            cta: {
                headline: 'Ready for More Peace?',
                description: 'Join thousands who\'ve found calm with this 7-minute practice',
                button: 'Learn About Mindfulness',
                link: 'https://66758wz8452oer1zv4xl08swem.hop.clickbank.net?tid=zyntis_fb_main'
            }
        },
        'health-optimization': {
            title: 'Latest in Wellness',
            articles: [
                { title: 'Morning Metabolism', readTime: 3 },
                { title: 'Coffee Benefits', readTime: 4 },
                { title: 'Healthy Routines', readTime: 5 }
            ],
            cta: {
                headline: 'Transform Your Morning Coffee',
                description: 'Discover why millions are adding this to their daily routine',
                button: 'See How It Works',
                link: 'https://d8f50l6f175q3o48cke47dwu2s.hop.clickbank.net?tid=zyntis_fb_main'
            }
        },
        'personal-growth': {
            title: 'Latest in Wellness',
            articles: [
                { title: 'Abundance Mindset', readTime: 3 },
                { title: 'Goal Setting', readTime: 4 },
                { title: 'Morning Success', readTime: 5 }
            ],
            cta: {
                headline: 'Rewrite Your Wealth Story',
                description: 'The 7-minute mindset shift that\'s changing lives',
                button: 'Explore the Program',
                link: 'https://f14dfo0k43wockbujhj2itbyf3.hop.clickbank.net?tid=zyntis_fb_main'
            }
        }
    },

    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        let topic = urlParams.get('topic') || 'stress-management';
        this.loadTopic(topic);
        this.setupButtons();
    },

    loadTopic: function(topic) {
        const data = this.content[topic] || this.content['stress-management'];
        
        // Update article titles and read times only
        const cards = document.querySelectorAll('.content-card');
        cards.forEach((card, index) => {
            if (data.articles[index]) {
                const h3 = card.querySelector('h3');
                const readTime = card.querySelector('span');
                if (h3) h3.textContent = data.articles[index].title;
                if (readTime) readTime.textContent = data.articles[index].readTime + ' min read';
                // IMPORTANT: Keep paragraph text exactly as in screenshot
                // No changes to "Learn practical techniques for your wellness journey..."
            }
        });

        // Update CTA section
        const ctaH2 = document.querySelector('#cta-section h2');
        const ctaP = document.querySelector('#cta-section p');
        const ctaLink = document.querySelector('#cta-section a');
        
        if (ctaH2) ctaH2.textContent = data.cta.headline;
        if (ctaP) ctaP.textContent = data.cta.description;
        if (ctaLink) {
            ctaLink.textContent = data.cta.button;
            ctaLink.href = data.cta.link;
        }
        
        this.setActiveButton(topic);
    },

    setupButtons: function() {
        document.querySelectorAll('[data-topic]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const topic = btn.dataset.topic;
                window.location.href = '?topic=' + topic;
            };
        });
    },

    setActiveButton: function(topic) {
        document.querySelectorAll('[data-topic]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.topic === topic) {
                btn.classList.add('active');
            }
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    WellnessRootedLoader.init();
});
