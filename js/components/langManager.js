// langManager.js
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.init();
    }
    
    init() {
        this.updateContent(this.currentLang);
        this.updateActiveButton();
        
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.lang;
                if (newLang !== this.currentLang) {
                    this.currentLang = newLang;
                    localStorage.setItem('language', newLang);
                    this.updateContent(newLang);
                    this.updateActiveButton();
                }
            });
        });
    }
    
    updateContent(lang) {
        // Add sequence classes to elements
        const credentials = document.querySelector('.professional-identity');
        const identityDetails = credentials.querySelector('.identity-details');
        
        // Reset SVG animations for both logos
        const lightLogo = document.getElementById('logo-svg-light');
        const darkLogo = document.getElementById('logo-svg-dark');
        
        if (lightLogo) {
            const lightClone = lightLogo.cloneNode(true);
            lightLogo.parentNode.replaceChild(lightClone, lightLogo);
        }
        if (darkLogo) {
            const darkClone = darkLogo.cloneNode(true);
            darkLogo.parentNode.replaceChild(darkClone, darkLogo);
        }
        
        // Only animate identity details, not the whole credentials
        identityDetails.classList.add('fade-sequence', 'credentials');

        const sectionTitles = document.querySelectorAll('.section-title h2, .education-title h2');
        const contentContainers = document.querySelectorAll('.experience-entries, .education-entries');
        
        sectionTitles.forEach(title => title.classList.add('fade-sequence', 'section-title'));
        contentContainers.forEach(container => container.classList.add('fade-sequence', 'content'));
        
        // Trigger fade out
        const elements = document.querySelectorAll('.fade-sequence');
        elements.forEach(element => {
            element.style.animation = 'fadeOutUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        });
        
        // Update content after fadeOut
        setTimeout(() => {
            // Update translations
            const elementsToTranslate = document.querySelectorAll('[data-translate]');
            elementsToTranslate.forEach(element => {
                const key = element.dataset.translate;
                const translation = this.getTranslation(translations[lang], key);
                if (translation) {
                    element.textContent = translation;
                }
            });
            
            // Trigger cascading fade in
            elements.forEach(element => {
                element.style.animation = '';
                void element.offsetWidth; // Force reflow
                element.classList.add('animate');
            });
            
            // Dispatch language change event for other components
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));
        }, 400);
    }
    
    getTranslation(langData, key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], langData);
    }
    
    updateActiveButton() {
        this.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
});
