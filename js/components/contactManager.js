class ContactManager {
    constructor() {
        this.container = document.querySelector('.contact-entries');
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.currentDesign = localStorage.getItem('contactDesign') || 'eagle';
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

        // Add design toggle buttons
        this.addDesignToggle();

        // Set initial design
        this.container.classList.add(`${this.currentDesign}-design`);

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

    addDesignToggle() {
        // Create toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'design-toggle';
        
        // Create Eagle button
        const eagleBtn = document.createElement('button');
        eagleBtn.className = `toggle-btn ${this.currentDesign === 'eagle' ? 'active' : ''}`;
        eagleBtn.textContent = 'Eagle';
        eagleBtn.addEventListener('click', () => this.changeDesign('eagle'));
        
        // Create Ziggurat button
        const zigguratBtn = document.createElement('button');
        zigguratBtn.className = `toggle-btn ${this.currentDesign === 'ziggurat' ? 'active' : ''}`;
        zigguratBtn.textContent = 'Ziggurat';
        zigguratBtn.addEventListener('click', () => this.changeDesign('ziggurat'));
        
        // Append buttons to container
        toggleContainer.appendChild(eagleBtn);
        toggleContainer.appendChild(zigguratBtn);
        
        // Append toggle container to parent
        this.container.parentNode.appendChild(toggleContainer);
    }

    changeDesign(design) {
        // Skip if same design
        if (design === this.currentDesign) return;
        
        // Update current design
        this.currentDesign = design;
        localStorage.setItem('contactDesign', design);
        
        // Update UI
        this.container.classList.remove('eagle-design', 'ziggurat-design');
        this.container.classList.add(`${design}-design`);
        
        // Update toggle buttons
        const buttons = document.querySelectorAll('.toggle-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === design) {
                btn.classList.add('active');
            }
        });
        
        // Re-render contacts with new design
        this.updateContacts(this.currentLang);
    }

    renderContacts(lang) {
        try {
            // Clear previous content
            this.container.innerHTML = '';
            
            // Generate and insert HTML based on current design
            const contactsHTML = this.currentDesign === 'eagle' 
                ? this.generateEagleContactsHTML(lang)
                : this.generateZigguratContactsHTML(lang);
                
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
                const contactsHTML = this.currentDesign === 'eagle' 
                    ? this.generateEagleContactsHTML(lang)
                    : this.generateZigguratContactsHTML(lang);
                    
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
    
    generateZigguratContactsHTML(lang) {
        let html = '';
        
        // First layer (top) - GitHub
        html += `<div class="ziggurat-layer">
            <div class="ziggurat-decor"></div>
            ${this.generateContactEntry(contacts.arch.center.github, lang, 0, 'ziggurat-position-top')}
        </div>`;
        
        // Second layer - LinkedIn and Email
        html += `<div class="ziggurat-layer">
            <div class="ziggurat-decor"></div>
            ${this.generateContactEntry(contacts.arch.left.linkedin, lang, 1, 'ziggurat-position-middle-left')}
            ${this.generateContactEntry(contacts.arch.right.email, lang, 2, 'ziggurat-position-middle-right')}
        </div>`;
        
        // Bottom layer - Phone
        html += `<div class="ziggurat-layer">
            <div class="ziggurat-decor"></div>
            ${this.generateContactEntry(contacts.arch.bottom.phone, lang, 3, 'ziggurat-position-bottom')}
        </div>`;
        
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
               ${positionClass !== 'eagle-position-bottom-center' && positionClass !== 'ziggurat-position-bottom' ? 'target="_blank" rel="noopener noreferrer"' : ''}
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
