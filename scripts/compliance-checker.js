/**
 * Compliance Checker for WellnessRooted
 * Ensures content meets Facebook/ClickBank guidelines
 */

class ComplianceChecker {
    static rules = {
        facebook: {
            banned: [
                'lose weight', 'burn fat', 'cure', 'guarantee', '#1', 'best',
                'doctor recommended', 'miracle', 'instant', '100%', 'scientifically proven'
            ],
            restricted: [
                'improve', 'boost', 'enhance', 'natural remedy', 'fast',
                'easy', 'simple', 'effortless'
            ],
            allowed: [
                'educational', 'informational', 'guide', 'tips',
                'strategies', 'methods', 'techniques'
            ]
        },
        tier: {
            low: ['mindfulness', 'meditation', 'breathing', 'stress relief', 'relaxation'],
            medium: ['energy', 'focus', 'wellness', 'routine', 'habits', 'lifestyle'],
            high: ['weight', 'metabolism', 'supplement', 'burn', 'diet', 'sugar']
        }
    };
    
    static scanContent(content, contentType = 'article') {
        const contentLower = content.toLowerCase();
        const warnings = [];
        const suggestions = [];
        
        // Check for banned phrases
        this.rules.facebook.banned.forEach(phrase => {
            if (contentLower.includes(phrase)) {
                warnings.push(`BANNED PHRASE: "${phrase}" - Consider removing or rephrasing`);
            }
        });
        
        // Check for restricted phrases
        this.rules.facebook.restricted.forEach(phrase => {
            const matches = contentLower.match(new RegExp(phrase, 'g'));
            if (matches && matches.length > 2) {
                warnings.push(`RESTRICTED PHRASE: "${phrase}" used ${matches.length} times - Use sparingly`);
            }
        });
        
        // Determine risk tier based on content
        const riskTier = this.determineRiskTier(contentLower);
        
        // Generate compliance report
        return {
            riskTier,
            warnings,
            suggestions: this.generateSuggestions(warnings, riskTier),
            passed: warnings.length === 0,
            disclaimer: this.generateDisclaimer(riskTier, contentType)
        };
    }
    
    static determineRiskTier(content) {
        let score = 0;
        
        this.rules.tier.low.forEach(word => {
            if (content.includes(word)) score += 1;
        });
        
        this.rules.tier.medium.forEach(word => {
            if (content.includes(word)) score += 2;
        });
        
        this.rules.tier.high.forEach(word => {
            if (content.includes(word)) score += 3;
        });
        
        if (score <= 3) return 'low';
        if (score <= 8) return 'medium';
        return 'high';
    }
    
    static generateSuggestions(warnings, riskTier) {
        const suggestions = [];
        
        if (riskTier === 'high') {
            suggestions.push('Consider adding stronger disclaimers');
            suggestions.push('Focus on educational value over product benefits');
        }
        
        if (warnings.length > 0) {
            suggestions.push('Review flagged phrases before publishing');
        }
        
        if (riskTier !== 'low') {
            suggestions.push('Test with small ad budget before scaling');
        }
        
        return suggestions;
    }
    
    static generateDisclaimer(riskTier, contentType) {
        const baseDisclaimer = 'This content is for informational and educational purposes only.';
        
        const tierDisclaimers = {
            low: 'Always consult with qualified professionals for personalized advice.',
            medium: 'Individual results may vary. Not medical advice.',
            high: 'These statements have not been evaluated by the FDA. This is not intended to diagnose, treat, cure, or prevent any disease.'
        };
        
        const typeDisclaimers = {
            article: 'We may receive compensation through affiliate links.',
            product: 'We are not the product creators. All product claims are from the manufacturer.',
            testimonial: 'Testimonials are individual experiences and results may vary.'
        };
        
        return `${baseDisclaimer} ${tierDisclaimers[riskTier]} ${typeDisclaimers[contentType] || ''}`;
    }
    
    // Auto-add disclaimer to page
    static autoAddDisclaimer(riskTier = 'medium') {
        const disclaimer = this.generateDisclaimer(riskTier, 'article');
        const disclaimerElement = document.getElementById('compliance-disclaimer');
        
        if (disclaimerElement) {
            disclaimerElement.innerHTML = `<p><strong>Disclaimer:</strong> ${disclaimer}</p>`;
        }
    }
}

// Auto-run on page load if in browser
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Auto-add disclaimer based on URL topic
        const params = new URLSearchParams(window.location.search);
        const topic = params.get('topic') || 'stress-management';
        
        let riskTier = 'medium';
        if (topic.includes('stress') || topic.includes('mindful')) riskTier = 'low';
        if (topic.includes('health') || topic.includes('optimization')) riskTier = 'medium';
        
        ComplianceChecker.autoAddDisclaimer(riskTier);
    });
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComplianceChecker;
}
