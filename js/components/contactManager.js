class ContactManager {
    constructor() {
        this.container = document.querySelector('.contact-entries');
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        // Ensure DOM is fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupContactManager());
        } else {
            this.setupContactManager();
        }
    }

    setupContactManager() {
        // Find the container, with fallback
        if (!this.container) {
            console.error('Contact entries container not found. Create a div with class "contact-entries".');
            return;
        }

        // Set Eagle design by default
        this.container.classList.add('eagle-design');

        // Initial render
        this.renderContacts(this.currentLang);

        // Language change event listener
        document.addEventListener('languageChanged', (e) => {
            if (e.detail.language !== this.currentLang) {
                this.currentLang = e.detail.language;
                this.updateContacts(this.currentLang);
            }
        });
    }

    renderContacts(lang) {
        try {
            // Clear previous content
            this.container.innerHTML = '';
            
            // Generate and insert HTML for Eagle design
            const contactsHTML = this.generateEagleContactsHTML(lang);
                
            this.container.innerHTML = contactsHTML;

            // Add animations with sequential delays
            const entries = this.container.querySelectorAll('.contact-entry');
            entries.forEach((entry, index) => {
                entry.style.setProperty('--index', index);
            });

            // Add hover effects
            this.addHoverEffects();
            
            // Set visible class after a brief delay to allow animation setup
            setTimeout(() => {
                this.container.classList.add('visible');
            }, 100);
        } catch (error) {
            console.error('Error rendering contacts:', error);
        }
    }

    updateContacts(lang) {
        try {
            // First fade out
            this.container.classList.add('fade-out');
            this.container.classList.remove('visible');
            
            setTimeout(() => {
                // Update content while faded out
                const contactsHTML = this.generateEagleContactsHTML(lang);
                    
                this.container.innerHTML = contactsHTML;
                
                // Add sequential animations
                const entries = this.container.querySelectorAll('.contact-entry');
                entries.forEach((entry, index) => {
                    entry.style.setProperty('--index', index);
                });
                
                // Remove fade out and add hover effects
                this.container.classList.remove('fade-out');
                this.addHoverEffects();
                
                // Set visible class after a brief delay
                setTimeout(() => {
                    this.container.classList.add('visible');
                }, 100);
            }, 300); // Matches the CSS transition duration
        } catch (error) {
            console.error('Error updating contacts:', error);
        }
    }

    generateEagleContactsHTML(lang) {
        let html = `
            <div class="eagle-spine"></div>
            <div class="wing-line left"></div>
            <div class="wing-line right"></div>
        `;
        
        // GitHub at center position
        const githubContact = contacts.arch.center.github;
        html += this.generateContactEntry(githubContact, lang, 0, 'eagle-position-center');
        
        // LinkedIn at left wing position
        const linkedinContact = contacts.arch.left.linkedin;
        html += this.generateContactEntry(linkedinContact, lang, 1, 'eagle-position-left');
        
        // Email at right wing position
        const emailContact = contacts.arch.right.email;
        html += this.generateContactEntry(emailContact, lang, 2, 'eagle-position-right');
        
        // Phone at bottom center position
        const phoneContact = contacts.arch.bottom.phone;
        html += this.generateContactEntry(phoneContact, lang, 3, 'eagle-position-bottom-center');
        
        return html;
    }
    
    generateContactEntry(contact, lang, index, positionClass) {
        // Determine URL - some contacts have dynamic URLs based on language
        let url = typeof contact.url === 'function' ? contact.url(lang) : contact.url;
        
        // Determine display text - some contacts have dynamic text based on language
        let displayText = typeof contact.text === 'function' ? contact.text(lang) : contact.name[lang];
        
        return `
            <a href="${url}" 
               class="contact-entry ${positionClass}" 
               data-index="${index}"
               ${positionClass !== 'eagle-position-bottom-center' ? 'target="_blank" rel="noopener noreferrer"' : ''}
               itemscope 
               itemtype="http://schema.org/Person">
                <div class="contact-frame">
                    <div class="frame-line top"></div>
                    <div class="frame-line right"></div>
                    <div class="frame-line bottom"></div>
                    <div class="frame-line left"></div>
                    <div class="frame-corner tl"></div>
                    <div class="frame-corner tr"></div>
                    <div class="frame-corner bl"></div>
                    <div class="frame-corner br"></div>
                </div>
                <div class="contact-content">
                    <span class="contact-icon">${contact.icon}</span>
                    <span class="contact-text">${displayText}</span>
                </div>
            </a>
        `;
    }

    addHoverEffects() {
        const entries = this.container.querySelectorAll('.contact-entry');
        
        entries.forEach(entry => {
            // Remove existing event listeners to avoid duplicates
            entry.removeEventListener('mouseenter', this.handleMouseEnter);
            entry.removeEventListener('mouseleave', this.handleMouseLeave);

            // Add new event listeners
            entry.addEventListener('mouseenter', () => {
                entry.classList.add('entry-hover');
            });

            entry.addEventListener('mouseleave', () => {
                entry.classList.remove('entry-hover');
            });
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});
