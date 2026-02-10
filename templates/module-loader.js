/**
 * DYNAMIC MODULE LOADER
 * Fetches and displays content modules based on URL parameters
 */

class ModuleLoader {
    constructor() {
        this.baseUrl = 'https://wellnessrooted.vercel.app';
        this.contentPath = '/content-library/modules/';
        this.currentTopic = this.getTopicFromURL();
        
        // Module mapping based on topic
        this.moduleMap = {
            'stress-management': {
                hero: 'hero-stress.json',
                cta: 'cta-mindfulness.json',
                disclaimer: 'disclaimer-low-risk.json'
            },
            'health-optimization': {
                hero: 'hero-health.json',
                cta: 'cta-java-burn.json',
                disclaimer: 'disclaimer-medium-risk.json'
            }
        };
        
        this.init();
    }
    
    getTopicFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('topic') || 'stress-management';
    }
    
    async init() {
        try {
            // Load all modules in parallel
            await Promise.all([
                this.loadHeroModule(),
                this.loadArticle(),
                this.loadCTAModule(),
                this.loadDisclaimer(),
                this.loadRelatedResources()
            ]);
            
            // Track successful load
            this.trackPageLoad();
        } catch (error) {
            console.error('Error loading modules:', error);
            this.showErrorState();
        }
    }
    
    async loadHeroModule() {
        const moduleName = this.moduleMap[this.currentTopic]?.hero || 'hero-stress.json';
        
        try {
            const response = await fetch(`${this.contentPath}${moduleName}`);
            if (!response.ok) throw new Error('Hero module not found');
            
            const data = await response.json();
            
            const heroSection = document.getElementById('dynamic-hero');
            heroSection.innerHTML = `
                <div class="container">
                    <div class="hero-content">
                        <h1>${data.content.title}</h1>
                        <p class="subtitle">${data.content.subtitle}</p>
                        <div class="hero-image">
                            <img src="${data.content.image}" alt="${data.content.title}" loading="lazy">
                        </div>
                        <button class="cta-button" style="background-color: ${data.content.cta_color}" 
                                onclick="ModuleLoader.trackHeroClick('${data.id}')">
                            ${data.content.cta_text}
                        </button>
                    </div>
                </div>
            `;
        } catch (error) {
            // Fallback hero
            const heroSection = document.getElementById('dynamic-hero');
            heroSection.innerHTML = `
                <div class="container">
                    <div class="hero-content">
                        <h1>Welcome to WellnessRooted</h1>
                        <p class="subtitle">Your guide to mindful living and holistic wellness</p>
                        <div class="hero-image">
                            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop" alt="Mindfulness" loading="lazy">
                        </div>
                        <button class="cta-button" style="background-color: #4CAF50" 
                                onclick="window.location.href='/?topic=stress-management'">
                            Explore Wellness Topics
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    async loadArticle() {
        // For now, load static article. Later, can be dynamic based on parameters
        const articleFile = `${this.currentTopic.replace('-', '_')}.md`;
        
        try {
            const response = await fetch(`/content-library/articles/${this.currentTopic}/${articleFile}`);
            if (!response.ok) throw new Error('Article not found');
            
            const markdown = await response.text();
            
            // Convert markdown to HTML (simplified version)
            const htmlContent = this.markdownToHTML(markdown);
            document.getElementById('content-article').innerHTML = htmlContent;
            
            // Track article read
            this.trackArticleView(articleFile);
        } catch (error) {
            // Fallback to default article
            try {
                const fallbackResponse = await fetch('/content-library/articles/stress-management/mindfulness-beginners-guide.md');
                const markdown = await fallbackResponse.text();
                document.getElementById('content-article').innerHTML = this.markdownToHTML(markdown);
            } catch (e) {
                // Ultimate fallback
                document.getElementById('content-article').innerHTML = `
                    <h2>Welcome to WellnessRooted</h2>
                    <p>Discover evidence-based wellness strategies and mindful living techniques.</p>
                    <p>Our content library is being prepared with valuable resources on:</p>
                    <ul>
                        <li>Stress management and mindfulness</li>
                        <li>Health optimization strategies</li>
                        <li>Personal growth and development</li>
                    </ul>
                    <p>Please check back soon for more comprehensive articles and resources.</p>
                `;
            }
        }
    }
    
    async loadCTAModule() {
        const moduleName = this.moduleMap[this.currentTopic]?.cta || 'cta-mindfulness.json';
        
        try {
            const response = await fetch(`${this.contentPath}${moduleName}`);
            if (!response.ok) throw new Error('CTA module not found');
            
            const data = await response.json();
            
            const ctaSection = document.getElementById('dynamic-cta');
            ctaSection.innerHTML = `
                <div class="container">
                    <div class="cta-box ${data.compliance}-risk">
                        <h3>${data.content.heading}</h3>
                        <p>${data.content.description}</p>
                        
                        <div class="cta-actions">
                            <a href="${data.affiliate_link}" 
                               class="primary-cta"
                               onclick="ModuleLoader.trackCTAClick('${data.offer}', '${data.id}')"
                               target="_blank" rel="noopener noreferrer">
                                ${data.content.button_text} <i class="fas fa-arrow-right"></i>
                            </a>
                            
                            <button class="secondary-cta" onclick="ModuleLoader.showMoreInfo()">
                                Learn More About This Topic
                            </button>
                        </div>
                        
                        <p class="cta-disclaimer"><small>${data.content.disclaimer}</small></p>
                    </div>
                </div>
            `;
        } catch (error) {
            // Fallback CTA
            const ctaSection = document.getElementById('dynamic-cta');
            ctaSection.innerHTML = `
                <div class="container">
                    <div class="cta-box low-risk">
                        <h3>Continue Your Wellness Journey</h3>
                        <p>Explore our growing library of wellness resources and educational content.</p>
                        
                        <div class="cta-actions">
                            <a href="/?topic=stress-management" class="primary-cta">
                                Browse All Topics <i class="fas fa-book-open"></i>
                            </a>
                        </div>
                        
                        <p class="cta-disclaimer"><small>Note: This is an educational resource. We may recommend products through affiliate links.</small></p>
                    </div>
                </div>
            `;
        }
    }
    
    async loadRelatedResources() {
        // Load related topics based on current topic
        const relatedTopics = {
            'stress-management': ['health-optimization', 'personal-growth'],
            'health-optimization': ['stress-management', 'personal-growth'],
            'personal-growth': ['stress-management', 'health-optimization']
        };
        
        const topics = relatedTopics[this.currentTopic] || ['stress-management', 'health-optimization'];
        const resourceGrid = document.getElementById('resource-grid');
        
        resourceGrid.innerHTML = topics.map(topic => `
            <div class="resource-card" data-topic="${topic}">
                <h4>${this.formatTopicName(topic)}</h4>
                <p>Explore resources about ${topic.replace('-', ' ')}</p>
                <a href="/?topic=${topic}" class="resource-link" onclick="ModuleLoader.trackTopicClick('${topic}')">
                    View Resources <i class="fas fa-book-open"></i>
                </a>
            </div>
        `).join('');
    }
    
    async loadDisclaimer() {
        const moduleName = this.moduleMap[this.currentTopic]?.disclaimer || 'disclaimer-low-risk.json';
        
        try {
            const response = await fetch(`${this.contentPath}${moduleName}`);
            const data = await response.json();
            document.getElementById('compliance-disclaimer').innerHTML = `<p><strong>${data.title}:</strong> ${data.content}</p>`;
        } catch (error) {
            // Default disclaimer
            document.getElementById('compliance-disclaimer').innerHTML = `
                <p><strong>Educational Resource Disclaimer:</strong> This content is for informational purposes only. We are not medical professionals. Always consult with qualified professionals for medical advice. Some links may be affiliate links.</p>
            `;
        }
    }
    
    markdownToHTML(markdown) {
        // Simple markdown converter
        return markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" loading="lazy">')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    }
    
    formatTopicName(topic) {
        return topic.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    trackPageLoad() {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'DynamicModulesLoaded', {
                topic: this.currentTopic,
                modules_loaded: Object.keys(this.moduleMap[this.currentTopic] || {}).length,
                load_time: performance.now()
            });
        }
    }
    
    trackArticleView(articleId) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'ArticleView', {
                article_id: articleId,
                topic: this.currentTopic,
                read_time_start: new Date().toISOString()
            });
        }
    }
    
    static trackCTAClick(offerId, moduleId) {
        // Use the global function from Pixel code if available
        if (typeof trackCTAClick === 'function') {
            trackCTAClick(offerId, moduleId);
        } else if (typeof fbq !== 'undefined') {
            // Fallback to direct tracking
            fbq('track', 'Lead', {
                content_name: offerId,
                content_category: 'affiliate_offer',
                content_type: 'product',
                module_id: moduleId
            });
            
            fbq('track', 'InitiateCheckout', {
                content_name: offerId,
                num_items: 1
            });
        }
        
        // Also track in localStorage for retargeting
        localStorage.setItem('last_offer_interacted', JSON.stringify({
            offer: offerId,
            timestamp: new Date().toISOString(),
            module: moduleId
        }));
    }
    
    static trackHeroClick(moduleId) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'HeroClick', {
                module_id: moduleId,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    static trackTopicClick(topic) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'TopicNavigation', {
                from_topic: this.currentTopic,
                to_topic: topic,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    static showMoreInfo() {
        alert('More educational resources are being added daily. Check back soon for comprehensive guides on each wellness topic.');
        
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'InfoRequest', {
                topic: this.currentTopic,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    showErrorState() {
        const hero = document.getElementById('dynamic-hero');
        if (hero) {
            hero.innerHTML = `
                <div class="container">
                    <div class="error-state">
                        <h2>Welcome to WellnessRooted</h2>
                        <p>We're experiencing technical difficulties loading specialized content.</p>
                        <p>Explore our main topics:</p>
                        <div class="error-links">
                            <a href="/?topic=stress-management" onclick="ModuleLoader.trackTopicClick('stress-management')">Stress Management</a>
                            <a href="/?topic=health-optimization" onclick="ModuleLoader.trackTopicClick('health-optimization')">Health Optimization</a>
                            <a href="/?topic=personal-growth" onclick="ModuleLoader.trackTopicClick('personal-growth')">Personal Growth</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ModuleLoader = new ModuleLoader();
});
