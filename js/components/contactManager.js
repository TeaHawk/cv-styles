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
        // Access the contact info from translations
        const headerContact = translations[lang].header.contact;
        
        // Extract email and phone from the contact data
        const email = headerContact.email.split(' ')[1];
        const phone = headerContact.phone.split(' ')[1];
        
        let html = '<div class="contact-grid">';
        
        // Add social network contacts from contacts.js data file
        for (const [key, social] of Object.entries(contacts.social)) {
            html += `
                <a href="${social.url}" 
                   class="contact-entry" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   data-type="${key}"
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
                        <span class="contact-icon">${social.icon}</span>
                        <span class="contact-text" itemprop="sameAs">${social.name[lang]}</span>
                    </div>
                </a>
            `;
        }
        
        // Add direct contact methods (email, phone)
        const directContacts = contacts.direct;
        
        // Email with translation
        html += `
            <a href="mailto:${email}" 
               class="contact-entry" 
               data-type="email"
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
                    <span class="contact-icon">${directContacts.email.icon}</span>
                    <span class="contact-text" itemprop="email">${headerContact.email}</span>
                </div>
            </a>
        `;
        
        // Phone with translation
        html += `
            <a href="tel:${phone.replace(/ /g, '')}" 
               class="contact-entry" 
               data-type="phone"
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
                    <span class="contact-icon">${directContacts.phone.icon}</span>
                    <span class="contact-text" itemprop="telephone">${headerContact.phone}</span>
                </div>
            </a>
        `;
        
        html += '</div>';
        return html;
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
