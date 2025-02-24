class ContactManager {
    constructor() {
        this.container = document.querySelector('.contact-entries');
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        this.renderContacts(this.currentLang);
        document.addEventListener('languageChanged', (e) => {
            if (e.detail.language !== this.currentLang) {
                this.currentLang = e.detail.language;
                this.updateContacts(this.currentLang);
            }
        });
    }

    renderContacts(lang) {
        this.container.innerHTML = this.generateContactsHTML(lang);
        this.addHoverEffects();
    }

    updateContacts(lang) {
        try {
            this.container.classList.add('fade-out');
            
            setTimeout(() => {
                this.container.innerHTML = this.generateContactsHTML(lang);
                this.container.classList.remove('fade-out');
                this.addHoverEffects();
            }, 300);
        } catch (error) {
            console.error('Error updating contacts:', error);
        }
    }

    generateContactsHTML(lang) {
        const sectionTitle = translations[lang].sections.contact;
        
        return `
            <div class="contact-grid">
                <a href="https://www.linkedin.com/in/daniel-izmailov-clauzel/" 
                   class="contact-link linkedin" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    <div class="contact-frame">
                        <div class="frame-line top"></div>
                        <div class="frame-line right"></div>
                        <div class="frame-line bottom"></div>
                        <div class="frame-line left"></div>
                    </div>
                    <span class="contact-icon">📎</span>
                    <span class="contact-text">LinkedIn</span>
                </a>
                
                <a href="https://github.com/TeaHawk" 
                   class="contact-link github" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    <div class="contact-frame">
                        <div class="frame-line top"></div>
                        <div class="frame-line right"></div>
                        <div class="frame-line bottom"></div>
                        <div class="frame-line left"></div>
                    </div>
                    <span class="contact-icon">💻</span>
                    <span class="contact-text">GitHub</span>
                </a>
                
                <a href="mailto:clauzel.daniel@gmail.com" 
                   class="contact-link email">
                    <div class="contact-frame">
                        <div class="frame-line top"></div>
                        <div class="frame-line right"></div>
                        <div class="frame-line bottom"></div>
                        <div class="frame-line left"></div>
                    </div>
                    <span class="contact-icon">✉️</span>
                    <span class="contact-text">${translations[lang].contact.email}</span>
                </a>
                
                <a href="tel:+33648870320" 
                   class="contact-link phone">
                    <div class="contact-frame">
                        <div class="frame-line top"></div>
                        <div class="frame-line right"></div>
                        <div class="frame-line bottom"></div>
                        <div class="frame-line left"></div>
                    </div>
                    <span class="contact-icon">📱</span>
                    <span class="contact-text">${translations[lang].contact.phone}</span>
                </a>
            </div>
        `;
    }

    addHoverEffects() {
        const links = this.container.querySelectorAll('.contact-link');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.classList.add('hover');
            });
            
            link.addEventListener('mouseleave', () => {
                link.classList.remove('hover');
            });
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
});
