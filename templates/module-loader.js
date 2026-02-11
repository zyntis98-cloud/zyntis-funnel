// module-loader.js - Works with your fixed HTML
const WellnessRootedLoader = {
    config: {
        defaultTopic: 'stress-management'
    },

    content: {
        'stress-management': {
            hero: {
                headline: '7 Minutes to a Calmer Mind',
                subheadline: 'Evidence-based mindfulness techniques that fit your busy schedule',
                cta: 'Start Your Journey'
            },
            cta: {
                headline: 'Ready for More Peace?',
                description: 'Join thousands who\'ve found calm with this 7-minute practice',
                button_text: 'Learn About Mindfulness',
                affiliate_link: 'https://66758wz8452oer1zv4xl08swem.hop.clickbank.net?tid=zyntis_fb_main'
            },
            articles: [
                { title: 'Mindfulness Basics', content: 'Learn practical techniques for your wellness journey...', readTime: 3 },
                { title: 'Stress Science', content: 'Learn practical techniques for your wellness journey...', readTime: 4 },
                { title: 'Breathing Techniques', content: 'Learn practical techniques for your wellness journey...', readTime: 5 }
            ],
            disclaimer: {
                text: 'This is an educational resource about mindfulness techniques. Individual experiences may vary.',
                risk: 'low'
            }
        },
        'health-optimization': {
            hero: {
                headline: 'Optimize Your Morning Routine',
                subheadline: 'Simple habits that transform your energy and focus',
                cta: 'Discover the Method'
            },
            cta: {
                headline: 'Transform Your Morning Coffee',
                description: 'Discover why millions are adding this to their daily routine',
                button_text: 'See How It Works',
                affiliate_link: 'https://d8f50l6f175q3o48cke47dwu2s.hop.clickbank.net?tid=zyntis_fb_main'
            },
            articles: [
                { title: 'Morning Metabolism', content: 'Simple morning habits that support healthy metabolic function.', readTime: 3 },
                { title: 'Coffee Benefits', content: 'The surprising health benefits of your morning coffee.', readTime: 4 },
                { title: 'Healthy Routines', content: 'Small changes that compound into significant health improvements.', readTime: 5 }
            ],
            disclaimer: {
                text: 'This is an educational resource about health optimization. Individual results may vary.',
                risk: 'medium'
            }
        },
        'personal-growth': {
            hero: {
                headline: 'Unlock Your Abundance Mindset',
                subheadline: 'Breakthrough limiting beliefs in just minutes a day',
                cta: 'Begin Transformation'
            },
            cta: {
                headline: 'Rewrite Your Wealth Story',
                description: 'The 7-minute mindset shift that\'s changing lives',
                button_text: 'Explore the Program',
                affiliate_link: 'https://f14dfo0k43wockbujhj2itbyf3.hop.clickbank.net?tid=zyntis_fb_main'
            },
            articles: [
                { title: 'Abundance Mindset', content: 'Shift from scarcity to abundance with practical exercises.', readTime: 3 },
                { title: 'Goal Setting', content: 'A neuroscience-backed approach to achieving meaningful goals.', readTime: 4 },
                { title: 'Morning Success', content: 'How high-performers structure their first hour for success.', readTime: 5 }
            ],
            disclaimer: {
                text: 'This is an educational resource about personal growth. Individual experiences may vary.',
                risk: 'medium'
            }
        }
    },

    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        let topic = urlParams.get('topic') || 'stress-management';
        this.loadTopic(topic);
        this.setupNavigation();
    },

    loadTopic: function(topic) {
        const content = this.content[topic] || this.content['stress-management'];
        
        // Update hero
        const heroH1 = document.querySelector('#hero-section h1');
        const heroP = document.querySelector('#hero-section .hero-subheadline');
        const heroBtn = document.querySelector('#hero-section .cta-button');
        if (heroH1) heroH1.textContent = content.hero.headline;
        if (heroP) heroP.textContent = content.hero.subheadline;
        if (heroBtn) heroBtn.textContent = content.hero.cta;
        
        // Update CTA
        const ctaH2 = document.querySelector('#cta-section h2');
        const ctaP = document.querySelector('#cta-section p');
        const ctaLink = document.querySelector('#cta-section .affiliate-link');
        if (ctaH2) ctaH2.textContent = content.cta.headline;
        if (ctaP) ctaP.textContent = content.cta.description;
        if (ctaLink) {
            ctaLink.textContent = content.cta.button_text;
            ctaLink.href = content.cta.affiliate_link;
        }
        
        // Update articles
        const cards = document.querySelectorAll('.content-card');
        cards.forEach((card, i) => {
            if (content.articles[i]) {
                const h3 = card.querySelector('h3');
                const p = card.querySelector('p');
                const time = card.querySelector('.read-time');
                if (h3) h3.textContent = content.articles[i].title;
                if (p) p.textContent = content.articles[i].content;
                if (time) time.textContent = `${content.articles[i].readTime} min read`;
            }
        });
        
        // Update disclaimer
        const disclaimer = document.querySelector('#disclaimer-section .disclaimer-container p');
        if (disclaimer) disclaimer.textContent = content.disclaimer.text;
        
        this.setActiveButton(topic);
    },

    setupNavigation: function() {
        // Topic buttons
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const topic = btn.dataset.topic;
                window.location.href = `?topic=${topic}`;
            };
        });
        
        // Start Your Journey button - scroll to CTA
        const startBtn = document.querySelector('.hero-cta');
        if (startBtn) {
            startBtn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('cta-section').scrollIntoView({ behavior: 'smooth' });
            };
        }
    },

    setActiveButton: function(topic) {
        document.querySelectorAll('.topic-btn').forEach(btn => {
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
