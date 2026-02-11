// module-loader.js - Fixed Navigation & Content Loading
// DESIGN INTACT - Only functionality fixed

const WellnessRootedLoader = {
    // Configuration
    config: {
        pixelId: '1881631042720883',
        defaultTopic: 'stress-management',
        storageKey: 'wellnessrooted_topic_pref',
        modulePath: '/content-library/modules/'
    },

    // Module mapping
    moduleMap: {
        'stress-management': {
            hero: 'hero-stress.json',
            cta: 'cta-mindfulness.json',
            disclaimer: 'disclaimer-low-risk.json',
            articles: [
                {
                    id: 'mindfulness-basics',
                    title: 'Mindfulness Basics',
                    readTime: 3,
                    content: 'Discover the foundational practices of mindfulness and how just 3 minutes of daily awareness can rewire your brain for calm.'
                },
                {
                    id: 'stress-science',
                    title: 'Stress Science',
                    readTime: 4,
                    content: 'Learn how the stress response works and evidence-based techniques to activate your parasympathetic nervous system.'
                },
                {
                    id: 'breathing-techniques',
                    title: 'Breathing Techniques',
                    readTime: 5,
                    content: 'Four science-backed breathing patterns that reduce cortisol and bring your body back to balance in minutes.'
                }
            ]
        },
        'health-optimization': {
            hero: 'hero-health.json',
            cta: 'cta-java-burn.json',
            disclaimer: 'disclaimer-medium-risk.json',
            articles: [
                {
                    id: 'morning-metabolism',
                    title: 'Morning Metabolism',
                    readTime: 3,
                    content: 'Simple morning habits that support healthy metabolic function throughout your entire day.'
                },
                {
                    id: 'coffee-benefits',
                    title: 'Coffee Benefits',
                    readTime: 4,
                    content: 'The surprising health benefits of your morning coffee and how to optimize them.'
                },
                {
                    id: 'healthy-routines',
                    title: 'Healthy Routines',
                    readTime: 5,
                    content: 'Small, sustainable changes that compound into significant health improvements over time.'
                }
            ]
        },
        'personal-growth': {
            hero: 'hero-growth.json',
            cta: 'cta-wealth-dna.json',
            disclaimer: 'disclaimer-medium-risk.json',
            articles: [
                {
                    id: 'abundance-mindset',
                    title: 'Abundance Mindset',
                    readTime: 3,
                    content: 'Shift from scarcity to abundance with practical exercises that rewire limiting beliefs.'
                },
                {
                    id: 'goal-setting',
                    title: 'Goal Setting',
                    readTime: 4,
                    content: 'A neuroscience-backed approach to setting and achieving meaningful goals.'
                },
                {
                    id: 'morning-success',
                    title: 'Morning Success',
                    readTime: 5,
                    content: 'How high-performers structure their first hour for clarity, focus, and momentum.'
                }
            ]
        }
    },

    // Initialize the loader
    init: function() {
        console.log('WellnessRooted: Loading content...');
        
        // Get topic from URL or default
        const urlParams = new URLSearchParams(window.location.search);
        let topic = urlParams.get('topic') || this.config.defaultTopic;
        
        // Validate topic
        if (!this.moduleMap[topic]) {
            topic = this.config.defaultTopic;
        }
        
        // Store preference
        localStorage.setItem(this.config.storageKey, topic);
        
        // Load modules for this topic
        this.loadModules(topic);
        
        // Setup navigation buttons - CRITICAL FIX
        this.setupNavigation();
        
        // Track topic view
        this.trackEvent('TopicView', { topic: topic });
    },

    // Load all modules for a topic
    loadModules: function(topic) {
        console.log(`Loading: ${topic}`);
        
        // Show loading state
        this.showLoadingState();
        
        // Get module configuration
        const moduleConfig = this.moduleMap[topic] || this.moduleMap[this.config.defaultTopic];
        
        // Try to load JSON, use fallbacks if fails
        Promise.all([
            this.fetchModule(moduleConfig.hero).catch(() => this.getFallbackHero(topic)),
            this.fetchModule(moduleConfig.cta).catch(() => this.getFallbackCTA(topic)),
            this.fetchModule(moduleConfig.disclaimer).catch(() => this.getFallbackDisclaimer(topic))
        ]).then(([hero, cta, disclaimer]) => {
            // Render modules
            this.renderHero(hero);
            this.renderCTA(cta);
            this.renderDisclaimer(disclaimer);
            
            // Render articles WITH REAL CONTENT
            this.renderArticles(moduleConfig.articles);
            
            // Hide loading state
            this.hideLoadingState();
            
            // Update active button state
            this.updateActiveButton(topic);
            
            // Track successful load
            this.trackEvent('DynamicModulesLoaded', { topic: topic });
            
        }).catch(error => {
            console.error('Module loading failed:', error);
            this.loadFallbackContent(topic);
        });
    },

    // Fetch individual module
    fetchModule: async function(moduleFile) {
        const response = await fetch(`${this.config.modulePath}${moduleFile}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${moduleFile}`);
        }
        return response.json();
    },

    // Fallback heroes if JSON files don't exist yet
    getFallbackHero: function(topic) {
        const fallbacks = {
            'stress-management': {
                headline: '7 Minutes to a Calmer Mind',
                subheadline: 'Evidence-based mindfulness techniques that fit your busy schedule',
                cta: 'Start Your Journey'
            },
            'health-optimization': {
                headline: 'Optimize Your Morning Routine',
                subheadline: 'Simple habits that transform your energy and focus',
                cta: 'Discover the Method'
            },
            'personal-growth': {
                headline: 'Unlock Your Abundance Mindset',
                subheadline: 'Breakthrough limiting beliefs in just minutes a day',
                cta: 'Begin Transformation'
            }
        };
        return fallbacks[topic] || fallbacks['stress-management'];
    },

    getFallbackCTA: function(topic) {
        const fallbacks = {
            'stress-management': {
                headline: 'Ready for More Peace?',
                description: 'Join thousands who\'ve found calm with this 7-minute practice',
                button_text: 'Learn About Mindfulness',
                affiliate_link: 'https://66758wz8452oer1zv4xl08swem.hop.clickbank.net?tid=zyntis_fb_main',
                topic: 'stress-management'
            },
            'health-optimization': {
                headline: 'Transform Your Morning Coffee',
                description: 'Discover why millions are adding this to their daily routine',
                button_text: 'See How It Works',
                affiliate_link: 'https://d8f50l6f175q3o48cke47dwu2s.hop.clickbank.net?tid=zyntis_fb_main',
                topic: 'health-optimization'
            },
            'personal-growth': {
                headline: 'Rewrite Your Wealth Story',
                description: 'The 7-minute mindset shift that\'s changing lives',
                button_text: 'Explore the Program',
                affiliate_link: 'https://f14dfo0k43wockbujhj2itbyf3.hop.clickbank.net?tid=zyntis_fb_main',
                topic: 'personal-growth'
            }
        };
        return fallbacks[topic] || fallbacks['stress-management'];
    },

    getFallbackDisclaimer: function(topic) {
        return {
            risk_level: topic === 'stress-management' ? 'low' : 'medium',
            text: 'This is an educational resource. Individual experiences and results may vary.',
            links: [
                { url: '/privacy', text: 'Privacy' },
                { url: '/terms', text: 'Terms' }
            ]
        };
    },

    // Render hero section - PRESERVES YOUR DESIGN
    renderHero: function(heroData) {
        const heroSection = document.getElementById('hero-section');
        if (heroSection && heroData) {
            heroSection.innerHTML = `
                <div class="hero-content">
                    <h1>${heroData.headline || 'WellnessRooted'}</h1>
                    <p class="hero-subheadline">${heroData.subheadline || 'Your journey to better living starts here'}</p>
                    ${heroData.cta ? `<button class="cta-button hero-cta">${heroData.cta}</button>` : ''}
                </div>
            `;
        }
    },

    // Render CTA section - PRESERVES YOUR DESIGN
    renderCTA: function(ctaData) {
        const ctaSection = document.getElementById('cta-section');
        if (ctaSection && ctaData) {
            ctaSection.innerHTML = `
                <div class="cta-container">
                    <h2>${ctaData.headline || 'Ready to learn more?'}</h2>
                    <p>${ctaData.description || ''}</p>
                    <a href="${ctaData.affiliate_link || '#'}" 
                       class="affiliate-link" 
                       data-topic="${ctaData.topic || ''}"
                       target="_blank" 
                       rel="nofollow sponsored">
                        ${ctaData.button_text || 'Learn More'}
                    </a>
                </div>
            `;
            
            // Track CTA clicks
            this.trackCTAClicks();
        }
    },

    // Render disclaimer
    renderDisclaimer: function(disclaimerData) {
        const disclaimerSection = document.getElementById('disclaimer-section');
        if (disclaimerSection && disclaimerData) {
            disclaimerSection.innerHTML = `
                <div class="disclaimer-container disclaimer-${disclaimerData.risk_level || 'low'}">
                    <p>${disclaimerData.text || 'This is an educational resource. Results may vary.'}</p>
                    ${disclaimerData.links ? disclaimerData.links.map(link => 
                        `<a href="${link.url}">${link.text}</a>`
                    ).join(' • ') : ''}
                </div>
            `;
        }
    },

    // Render articles with REAL CONTENT - FIXED
    renderArticles: function(articles) {
        const articlesGrid = document.getElementById('articles-grid');
        if (articlesGrid) {
            articlesGrid.innerHTML = articles.map((article, index) => `
                <article class="content-card">
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                    <span class="read-time">${article.readTime} min read</span>
                </article>
            `).join('');
        }
    },

    // CRITICAL FIX: Navigation buttons setup
    setupNavigation: function() {
        console.log('Setting up navigation buttons...');
        
        // Method 1: Find buttons by their text content
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            const buttonText = button.innerText.trim();
            
            if (buttonText.includes('Stress Relief')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = '?topic=stress-management';
                });
                console.log('Stress Relief button hooked');
            }
            else if (buttonText.includes('Health Tips')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = '?topic=health-optimization';
                });
                console.log('Health Tips button hooked');
            }
            else if (buttonText.includes('Personal Growth')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = '?topic=personal-growth';
                });
                console.log('Personal Growth button hooked');
            }
        });
        
        // Method 2: Also try to find by class
        document.querySelectorAll('.topic-btn, [data-topic]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.innerText.toLowerCase();
                if (text.includes('health')) {
                    window.location.href = '?topic=health-optimization';
                } else if (text.includes('personal')) {
                    window.location.href = '?topic=personal-growth';
                } else if (text.includes('stress')) {
                    window.location.href = '?topic=stress-management';
                }
            });
        });
        
        // Method 3: Direct ID selectors if they exist
        const stressBtn = document.getElementById('btn-stress');
        if (stressBtn) {
            stressBtn.addEventListener('click', () => {
                window.location.href = '?topic=stress-management';
            });
        }
        
        const healthBtn = document.getElementById('btn-health');
        if (healthBtn) {
            healthBtn.addEventListener('click', () => {
                window.location.href = '?topic=health-optimization';
            });
        }
        
        const growthBtn = document.getElementById('btn-growth');
        if (growthBtn) {
            growthBtn.addEventListener('click', () => {
                window.location.href = '?topic=personal-growth';
            });
        }
    },

    // Update active button state
    updateActiveButton: function(topic) {
        document.querySelectorAll('.topic-btn, button').forEach(btn => {
            btn.classList.remove('active');
            const text = btn.innerText.toLowerCase();
            
            if (topic === 'stress-management' && text.includes('stress')) {
                btn.classList.add('active');
            } else if (topic === 'health-optimization' && text.includes('health')) {
                btn.classList.add('active');
            } else if (topic === 'personal-growth' && text.includes('personal')) {
                btn.classList.add('active');
            }
        });
    },

    // Loading state handlers
    showLoadingState: function() {
        const loader = document.getElementById('content-loader');
        if (loader) loader.style.display = 'flex';
    },

    hideLoadingState: function() {
        const loader = document.getElementById('content-loader');
        if (loader) loader.style.display = 'none';
    },

    // Fallback content
    loadFallbackContent: function(topic) {
        console.log('Loading fallback content...');
        const fallbackHero = this.getFallbackHero(topic);
        const fallbackCTA = this.getFallbackCTA(topic);
        const fallbackDisclaimer = this.getFallbackDisclaimer(topic);
        const moduleConfig = this.moduleMap[topic] || this.moduleMap[this.config.defaultTopic];
        
        this.renderHero(fallbackHero);
        this.renderCTA(fallbackCTA);
        this.renderDisclaimer(fallbackDisclaimer);
        this.renderArticles(moduleConfig.articles);
        this.hideLoadingState();
        this.updateActiveButton(topic);
    },

    // Track CTA clicks
    trackCTAClicks: function() {
        document.querySelectorAll('.affiliate-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackEvent('Lead', {
                    topic: e.target.dataset.topic || 'unknown',
                    cta_location: 'main'
                });
            });
        });
    },

    // Facebook Pixel tracking
    trackEvent: function(eventName, params = {}) {
        if (typeof fbq === 'function') {
            fbq('track', eventName, params);
        }
        console.log(`Tracked: ${eventName}`, params);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    WellnessRootedLoader.init();
});

// Also run immediately in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => WellnessRootedLoader.init(), 100);
}
