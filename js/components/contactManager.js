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
            
            // Generate and insert HTML
            const contactsHTML = this.generateContactsHTML(lang);
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
                const contactsHTML = this.generateContactsHTML(lang);
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

    generateContactsHTML(lang) {
        // Start with the arch container and SVG path
        let html = `
            <div class="contact-arch">
                <div class="arch-path">
                    <svg viewBox="0 0 300 200" preserveAspectRatio="none">
                        <path d="M60,50 Q150,150 240,50" />
                    </svg>
                </div>
        `;
        
        // Generate left arch entry (LinkedIn)
        const leftContact = contacts.arch.left.linkedin;
        html += this.generateContactEntry(leftContact, lang, 0);
        
        // Generate right arch entry (Email)
        const rightContact = contacts.arch.right.email;
        html += this.generateContactEntry(rightContact, lang, 1);
        
        // Generate center arch entry (GitHub)
        const centerContact = contacts.arch.center.github;
        html += this.generateContactEntry(centerContact, lang, 2);
        
        // Generate bottom entry (Phone)
        const bottomContact = contacts.arch.bottom.phone;
        html += this.generateContactEntry(bottomContact, lang, 3);
        
        // Close the arch container
        html += '</div>';
        
        return html;
    }
    
    generateContactEntry(contact, lang, index) {
        // Determine URL - some contacts have dynamic URLs based on language
        let url = typeof contact.url === 'function' ? contact.url(lang) : contact.url;
        
        // Determine display text - some contacts have dynamic text based on language
        let displayText = typeof contact.text === 'function' ? contact.text(lang) : contact.name[lang];
        
        return `
            <a href="${url}" 
               class="contact-entry" 
               data-position="${contact.position}"
               data-index="${index}"
               ${contact.position !== 'bottom' && contact.position !== 'center' ? 'target="_blank" rel="noopener noreferrer"' : ''}
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
