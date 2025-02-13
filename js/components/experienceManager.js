class ExperienceManager {
    constructor() {
        this.container = null;
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        // Ensure DOM is fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupExperienceManager());
        } else {
            this.setupExperienceManager();
        }
    }

    setupExperienceManager() {
        // Find the container, with fallback
        this.container = document.querySelector('.experience-entries');
        
        if (!this.container) {
            console.error('Experience entries container not found. Create a div with class "experience-entries".');
            return;
        }

        // Initial render
        this.renderExperiences(this.currentLang);

        // Language change event listener
        document.addEventListener('languageChanged', (e) => {
            if (e.detail.language !== this.currentLang) {
                this.currentLang = e.detail.language;
                this.updateExperiences(this.currentLang);
            }
        });
    }

	renderExperiences(lang) {
		try {
			// Clear previous content
			this.container.innerHTML = '';
			
			// Generate and insert HTML
			const experiencesHTML = this.generateExperienceHTML(lang);
			this.container.innerHTML = experiencesHTML;

			// Use new visibility-based animation
			requestAnimationFrame(() => {
				this.container.classList.add('visible');
				this.addHoverEffects();
			});
		} catch (error) {
			console.error('Error rendering experiences:', error);
		}
	}

	updateExperiences(lang) {
		try {
			// First fade out
			this.container.classList.add('fade-out');
			
			setTimeout(() => {
				// Update content while faded out
				const experiencesHTML = this.generateExperienceHTML(lang);
				this.container.innerHTML = experiencesHTML;
				
				// Remove fade out and let entry animations play
				this.container.classList.remove('fade-out');
				this.addHoverEffects();
			}, 300); // Matches the CSS transition duration
		} catch (error) {
			console.error('Error updating experiences:', error);
		}
	}

    generateExperienceHTML(lang) {
        // Validate language
        if (!lang || !experiences || !experiences[Object.keys(experiences)[0]].content[lang]) {
            console.error(`Invalid language or experiences data: ${lang}`);
            return '';
        }

        return Object.values(experiences).map(exp => {
            const content = exp.content[lang];
            const sectionTitle = translations[lang]?.sections?.technicalBackground || 'Technical Background';
            
            return `
                <article class="experience-entry" data-lang="${lang}">
                    <div class="experience-frame">
                        <div class="frame-line top"></div>
                        <div class="frame-line right"></div>
                        <div class="frame-line bottom"></div>
                        <div class="frame-line left"></div>
                    </div>
                    <header class="entry-header">
                        <h3 class="company-name">${content.company || 'Company Name'}</h3>
                        <div class="entry-meta">
                            <span class="position">${content.position || 'Position'}</span>
                            <span class="duration">${content.duration || 'Duration'}</span>
                        </div>
                    </header>
                    ${this.renderCategories(content.categories || [])}
                    <div class="tech-environment">
                        <h4>${sectionTitle}</h4>
                        <div class="tech-content">
                            ${this.renderTech(content.tech || {})}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    renderCategories(categories) {
        if (!categories || categories.length === 0) {
            return '<div class="categories-section"></div>';
        }

        return `
            <div class="categories-section">
                ${categories.map(cat => `
                    <div class="responsibility-group">
                        <h4>${cat.title || 'Responsibilities'}</h4>
                        <ul>
                            ${cat.achievements ? 
                                cat.achievements.map(ach => `<li>${ach}</li>`).join('') : 
                                '<li>No specific achievements listed</li>'
                            }
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTech(tech) {
        if (typeof tech === 'string') {
            return `<p>${tech}</p>`;
        } 
        
        if (typeof tech === 'object' && tech !== null) {
            return `
                <ul>
                    ${Object.entries(tech).map(([key, value]) => 
                        `<li><strong>${key}:</strong> ${value}</li>`
                    ).join('')}
                </ul>
            `;
        }
        
        return `<p>No technical information available</p>`;
    }

    addHoverEffects() {
        const entries = this.container.querySelectorAll('.experience-entry');
        
        entries.forEach(entry => {
            // Ensure only one set of event listeners
            entry.removeEventListener('mouseenter', this.handleMouseEnter);
            entry.removeEventListener('mouseleave', this.handleMouseLeave);

            // Bind event handlers to preserve 'this' context
            this.handleMouseEnter = () => {
                entry.classList.add('entry-hover');
            };

            this.handleMouseLeave = () => {
                entry.classList.remove('entry-hover');
            };

            // Add new event listeners
            entry.addEventListener('mouseenter', this.handleMouseEnter);
            entry.addEventListener('mouseleave', this.handleMouseLeave);
        });
    }
}

// Initialize the manager
document.addEventListener('DOMContentLoaded', () => {
    window.experienceManager = new ExperienceManager();
});
