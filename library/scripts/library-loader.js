// scripts/library-loader.js
// WellnessRooted Library Content Loader
// Consumes JSON modules from /content-library/modules/
// DESIGN PRESERVATION: This file ONLY affects the library page, NOT landing page

const WellnessLibrary = {
    // List all topics in order they should appear
    topics: [
        'stress-management',
        'health-optimization', 
        'personal-growth'
    ],
    
    // Display names for topics (matches JSON)
    topicDisplayNames: {
        'stress-management': 'Stress Relief',
        'health-optimization': 'Health Tips',
        'personal-growth': 'Personal Growth'
    },
    
    // Main function to load and display all content
    async loadAllContent() {
        const container = document.getElementById('library-content');
        if (!container) return;
        
        try {
            let html = '';
            
            // Loop through each topic
            for (const topic of this.topics) {
                try {
                    // Fetch JSON module
                    const response = await fetch(`/content-library/modules/${topic}.json`);
                    
                    if (!response.ok) {
                        console.warn(`Failed to load ${topic}, skipping`);
                        continue;
                    }
                    
                    const data = await response.json();
                    
                    // Generate HTML for this topic section
                    html += `
                        <section class="topic-section">
                            <h2 class="topic-title">${this.topicDisplayNames[topic] || data.displayName}</h2>
                            <div class="article-grid">
                                ${data.articles.map(article => `
                                    <article class="article-card">
                                        <h3>${article.title}</h3>
                                        <div class="article-meta">
                                            <span class="read-time">${article.readTime} min read</span>
                                        </div>
                                        <p class="article-description">${article.description || 'Learn practical techniques for your wellness journey...'}</p>
                                        <a href="/?topic=${topic}&article=${article.id}" class="read-more">
                                            Read Article →
                                        </a>
                                    </article>
                                `).join('')}
                            </div>
                        </section>
                    `;
                    
                } catch (topicError) {
                    console.error(`Error loading ${topic}:`, topicError);
                    // Continue to next topic even if one fails
                    continue;
                }
            }
            
            // If no content was loaded, show error
            if (!html) {
                throw new Error('No content could be loaded');
            }
            
            container.innerHTML = html;
            
            // Track successful library view
            if (typeof fbq === 'function') {
                fbq('track', 'ViewContent', { 
                    content_type: 'library',
                    content_ids: this.topics
                });
            }
            
        } catch (error) {
            console.error('Library loader error:', error);
            container.innerHTML = `
                <div class="error-state">
                    <h2>Library Temporarily Unavailable</h2>
                    <p>We're having trouble loading our wellness library right now.</p>
                    <p style="margin-top: 1.5rem;">
                        <a href="/">← Return to WellnessRooted Home</a>
                    </p>
                </div>
            `;
        }
    },
    
    // Initialize on page load
    init() {
        // Check if we're on library page
        if (window.location.pathname.includes('/library/') || 
            window.location.pathname === '/library' || 
            window.location.pathname.endsWith('/library')) {
            this.loadAllContent();
        }
    }
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WellnessLibrary.init());
} else {
    WellnessLibrary.init();
}
