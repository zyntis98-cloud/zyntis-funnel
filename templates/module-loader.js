// module-loader.js - ONLY FUNCTIONALITY FIXES, ZERO DESIGN CHANGES
// Your exact design preserved completely

const WellnessRootedLoader = {
    // Configuration
    config: {
        defaultTopic: 'stress-management',
        modulePath: '/content-library/modules/'
    },

    // Topic content - embedded directly to ensure it works
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
                {
                    title: 'Mindfulness Basics',
                    content: 'Learn practical techniques for your wellness journey...',
                    readTime: 3
                },
                {
                    title: 'Stress Science',
                    content: 'Learn practical techniques for your wellness journey...',
                    readTime: 4
                },
                {
                    title: 'Breathing Techniques',
                    content: 'Learn practical techniques for your wellness journey...',
                    readTime: 5
                }
            ]
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
                {
                    title: 'Morning Metabolism',
                    content: 'Simple morning habits that support healthy metabolic function.',
                    readTime: 3
                },
                {
                    title: 'Coffee Benefits',
                    content: 'The surprising health benefits of your morning coffee.',
                    readTime: 4
                },
                {
                    title: 'Healthy Routines',
                    content: 'Small changes that compound into significant health improvements.',
                    readTime: 5
                }
            ]
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
                {
                    title: 'Abundance Mindset',
                    content: 'Shift from scarcity to abundance with practical exercises.',
                    readTime: 3
                },
                {
                    title: 'Goal Setting',
                    content: 'A neuroscience-backed approach to achieving meaningful goals.',
                    readTime: 4
                },
                {
                    title: 'Morning Success',
                    content: 'How high-performers structure their first hour for success.',
                    readTime: 5
                }
            ]
        }
    },

    init: function() {
        // Get topic from URL
        const urlParams = new URLSearchParams(window.location.search);
        let topic = urlParams.get('topic') || 'stress-management';
        
        // Load content for this topic
        this.loadTopic(topic);
        
        // Make buttons work
        this.setupNavigation();
    },

    loadTopic: function(topic) {
        // Get content for this topic
        const content = this.content[topic] || this.content['stress-management'];
        
        // Update hero section
        this.updateHero(content.hero);
        
        // Update CTA section
        this.updateCTA(content.cta);
        
        // Update articles
        this.updateArticles(content.articles);
        
        // Update active button
        this.setActiveButton(topic);
    },

    updateHero: function(hero) {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            // Find the h1 and p elements inside hero
            const h1 = heroSection.querySelector('h1');
            const p = heroSection.querySelector('.hero-subheadline');
            const button = heroSection.querySelector('.cta-button');
            
            if (h1) h1.textContent = hero.headline;
            if (p) p.textContent = hero.subheadline;
            if (button) button.textContent = hero.cta;
        }
    },

    updateCTA: function(cta) {
        const ctaSection = document.getElementById('cta-section');
        if (ctaSection) {
            const h2 = ctaSection.querySelector('h2');
            const p = ctaSection.querySelector('p');
            const link = ctaSection.querySelector('.affiliate-link');
            
            if (h2) h2.textContent = cta.headline;
            if (p) p.textContent = cta.description;
            if (link) {
                link.textContent = cta.button_text;
                link.href = cta.affiliate_link;
            }
        }
    },

    updateArticles: function(articles) {
        const articlesGrid = document.getElementById('articles-grid');
        if (articlesGrid) {
            const cards = articlesGrid.querySelectorAll('.content-card');
            cards.forEach((card, index) => {
                if (articles[index]) {
                    const h3 = card.querySelector('h3');
                    const p = card.querySelector('p');
                    const readTime = card.querySelector('.read-time');
                    
                    if (h3) h3.textContent = articles[index].title;
                    if (p) p.textContent = articles[index].content;
                    if (readTime) readTime.textContent = `${articles[index].readTime} min read`;
                }
            });
        }
    },

    setupNavigation: function() {
        // Find all buttons by their exact text
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            const text = button.textContent.trim();
            
            if (text === 'Stress Relief') {
                button.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = '?topic=stress-management';
                };
            }
            else if (text === 'Health Tips') {
                button.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = '?topic=health-optimization';
                };
            }
            else if (text === 'Personal Growth') {
                button.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = '?topic=personal-growth';
                };
            }
        });
        
        // Fix "Start Your Journey" button
        setTimeout(() => {
            const startJourneyBtn = document.querySelector('.hero .cta-button');
            if (startJourneyBtn) {
                startJourneyBtn.onclick = (e) => {
                    e.preventDefault();
                    // Scroll to CTA section
                    document.getElementById('cta-section').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                };
            }
        }, 100);
    },

    setActiveButton: function(topic) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.remove('active');
            const text = button.textContent.trim();
            
            if (topic === 'stress-management' && text === 'Stress Relief') {
                button.classList.add('active');
            }
            else if (topic === 'health-optimization' && text === 'Health Tips') {
                button.classList.add('active');
            }
            else if (topic === 'personal-growth' && text === 'Personal Growth') {
                button.classList.add('active');
            }
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    WellnessRootedLoader.init();
});
