// module-loader.js - Fixed Dynamic Content Engine
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
            articles: ['mindfulness-basics', 'stress-science', 'breathing-techniques']
        },
        'health-optimization': {
            hero: 'hero-health.json',
            cta: 'cta-java-burn.json',
            disclaimer: 'disclaimer-medium-risk.json',
            articles: ['morning-metabolism', 'coffee-benefits', 'healthy-routines']
        },
        'personal-growth': {
            hero: 'hero-growth.json',
            cta: 'cta-wealth-dna.json',
            disclaimer: 'disclaimer-medium-risk.json',
            articles: ['abundance-mindset', 'goal-setting', 'morning-success']
        }
    },

    // Initialize the loader
    init: function() {
        console.log('WellnessRooted: Initializing module loader...');
        
        // Get topic from URL or default
        const urlParams = new URLSearchParams(window.location.search);
        const topic = urlParams.get('topic') || this.config.defaultTopic;
        
        // Store preference
        localStorage.setItem(this.config.storageKey, topic);
        
        // Load modules for this topic
        this.loadModules(topic);
        
        // Setup navigation buttons
        this.setupNavigation();
        
        // Track topic view
        this.trackEvent('TopicView', { topic: topic });
    },

    // Load all modules for a topic
    loadModules: function(topic) {
        console.log(`Loading modules for: ${topic}`);
        
        // Show loading state
        this.showLoadingState();
        
        // Get module configuration
        const moduleConfig = this.moduleMap[topic] || this.moduleMap[this.config.defaultTopic];
        
        // Load each module
        Promise.all([
            this.fetchModule(moduleConfig.hero),
            this.fetchModule(moduleConfig.cta),
            this.fetchModule(moduleConfig.disclaimer)
        ]).then(([hero, cta, disclaimer]) => {
            // Render modules
            this.renderHero(hero);
            this.renderCTA(cta);
            this.renderDisclaimer(disclaimer);
            this.renderArticles(moduleConfig.articles);
            
            // Hide loading state
            this.hideLoadingState();
            
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

    // Render hero section
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

    // Render CTA section
    renderCTA: function(ctaData) {
        const ctaSection = document.getElementById('cta-section');
        if (ctaSection && ctaData) {
            ctaSection.innerHTML = `
                <div class="cta-container">
                    <h2>${ctaData.headline || 'Ready to learn more?'}</h2>
                    <p>${ctaData.description || ''}</p>
                    <a href="${ctaData.affiliate_link || '#'}" 
                       class="cta-button affiliate-link" 
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

    // Render articles
    renderArticles: function(articleIds) {
        const articlesGrid = document.getElementById('articles-grid');
        if (articlesGrid) {
            // Placeholder - would load actual markdown content
            articlesGrid.innerHTML = articleIds.map((id, index) => `
                <article class="content-card">
                    <h3>${this.formatArticleTitle(id)}</h3>
                    <p>Learn practical techniques for your wellness journey...</p>
                    <span class="read-time">${3 + index} min read</span>
                </article>
            `).join('');
        }
    },

    // Setup navigation buttons
    setupNavigation: function() {
        // Health Tips button
        const healthBtn = document.querySelector('button:contains("Health Tips")');
        if (healthBtn) {
            healthBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '?topic=health-optimization';
            });
        }
        
        // Personal Growth button
        const growthBtn = document.querySelector('button:contains("Personal Growth")');
        if (growthBtn) {
            growthBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '?topic=personal-growth';
            });
        }
        
        // Stress Relief button
        const stressBtn = document.querySelector('button:contains("Stress Relief")');
        if (stressBtn) {
            stressBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '?topic=stress-management';
            });
        }
        
        // Alternative: Add click listeners to all topic buttons by class
        document.querySelectorAll('.topic-btn, [data-topic]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.dataset.topic || 
                             e.target.innerText.toLowerCase().includes('health') ? 'health-optimization' :
                             e.target.innerText.toLowerCase().includes('personal') ? 'personal-growth' :
                             'stress-management';
                window.location.href = `?topic=${topic}`;
            });
        });
    },

    // Fallback content if modules fail to load
    loadFallbackContent: function(topic) {
        console.log('Loading fallback content for:', topic);
        
        const fallbackHero = {
            'stress-management': {
                headline: '7 Minutes to Peace',
                subheadline: 'Science-backed mindfulness techniques'
            },
            'health-optimization': {
                headline: 'Optimize Your Morning',
                subheadline: 'Simple routines for better days'
            },
            'personal-growth': {
                headline: 'Unlock Your Potential',
                subheadline: 'Daily habits for lasting success'
            }
        };
        
        this.renderHero({ headline: fallbackHero[topic]?.headline || 'WellnessRooted' });
        this.hideLoadingState();
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

    // Format article titles
    formatArticleTitle: function(id) {
        return id.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
