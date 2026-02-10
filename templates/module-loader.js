/**
 * DYNAMIC MODULE LOADER
 * Fetches and displays content modules based on URL parameters
 */

class ModuleLoader {
    constructor() {
        this.baseUrl = 'https://offers.zyntis.com';
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
        const response = await fetch(`${this.contentPath}${moduleName}`);
        const data = await response.json();
        
        const heroSection = document.getElementById('dynamic-hero');
        heroSection.innerHTML = `
            <div class="container">
                <div class="hero-content">
                    <h1>${data.content.title}</h1>
                    <p class="subtitle">${data.content.subtitle}</p>
                    <div class="hero-image">
                        <img src="${data.content.image}" alt="${data.content.title}">
                    </div>
                    <button class="cta-button" style="background-color: ${data.content.cta_color}" 
                            onclick="this.trackHeroClick('${data.id}')">
                        ${data.content.cta_text}
                    </button>
                </div>
            </div>
        `;
    }
    
    async loadArticle() {
        // For now, load static article. Later, can be dynamic based on parameters
        const articleFile = `${this.currentTopic.replace('-', '_')}.md`;
        
        try {
            const response = await fetch(`/content-library/articles/${this.currentTopic}/${articleFile}`);
            const markdown = await response.text();
            
            // Convert markdown to HTML (simplified version)
            const htmlContent = this.markdownToHTML(markdown);
            document.getElementById('content-article').innerHTML = htmlContent;
            
            // Track article read
            this.trackArticleView(articleFile);
        } catch (error) {
            // Fallback to default article
            const fallbackResponse = await fetch('/content-library/articles/stress-management/mindfulness-beginners-guide.md');
            const markdown = await fallbackResponse.text();
            document.getElementById('content-article').innerHTML = this.markdownToHTML(markdown);
        }
    }
    
    async loadCTAModule() {
        const moduleName = this.moduleMap[this.currentTopic]?.cta || 'cta-mindfulness.json';
        const response = await fetch(`${this.contentPath}${moduleName}`);
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
                <a href="/?topic=${topic}" class="resource-link">
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
                <p><strong>Disclaimer:</strong> Content is for educational purposes only. Results may vary.</p>
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
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
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
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: offerId,
                content_category: 'affiliate_offer',
                module_id: moduleId
            });
        }
        
        // Also track in localStorage for retargeting
        localStorage.setItem('last_offer_interacted', JSON.stringify({
            offer: offerId,
            timestamp: new Date().toISOString(),
            module: moduleId
        }));
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
                            <a href="/?topic=stress-management">Stress Management</a>
                            <a href="/?topic=health-optimization">Health Optimization</a>
                            <a href="/?topic=personal-growth">Personal Growth</a>
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
