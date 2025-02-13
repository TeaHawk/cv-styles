class EducationManager {
    constructor() {
        this.container = document.querySelector('.education-entries');
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        this.renderEducation(this.currentLang);
        document.addEventListener('languageChanged', (e) => {
            if (e.detail.language !== this.currentLang) {
                this.currentLang = e.detail.language;
                this.updateEducation(this.currentLang);
            }
        });
    }

    renderEducation(lang) {
        this.container.innerHTML = this.generateEducationHTML(lang);
        this.container.style.animation = 'slideAndFade 0.7s ease-out forwards';
    }

	updateEducation(lang) {
		try {
			setTimeout(() => {
				this.container.innerHTML = this.generateEducationHTML(lang);
				// If you have hover effects for education, add them here
			}, 400);
		} catch (error) {
			console.error('Error updating education:', error);
		}
	}

    generateEducationHTML(lang) {
        return Object.values(educations).map(edu => {
            const content = edu.content[lang];
            const sectionTitle = translations[lang].sections.education;
            
            return `
                <article class="education-entry" itemscope itemtype="https://schema.org/EducationalOccupationalCredential">
                    <div class="education-frame">
                        <div class="frame-line top"></div>
                        <div class="frame-line right"></div>
                        <div class="frame-line bottom"></div>
                        <div class="frame-line left"></div>
                    </div>

                    <header class="education-header">
                        <h3 class="institution-name" itemprop="name">${content.institution}</h3>
                        <div class="degree-meta">
                            <span class="degree" itemprop="educationalCredentialAwarded">${content.degree}</span>
                            <span class="duration" itemprop="timeRequired">${content.duration}</span>
                        </div>
                    </header>

                    ${this.renderAchievements(content.achievements)}

                    <div class="academic-details">
                        <h4>${sectionTitle}</h4>
                        <div class="academic-content">
                            ${this.renderAcademicDetails(content.details)}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    renderAchievements(achievements) {
        if (!achievements || achievements.length === 0) return '';
        
        return `
            <div class="achievements-section">
                <ul>
                    ${achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    renderAcademicDetails(details) {
        if (typeof details === 'string') {
            return `<p>${details}</p>`;
        } else if (typeof details === 'object' && details !== null) {
            return `
                <ul>
                    ${Object.entries(details).map(([key, value]) => {
                        return `<li><strong>${key}:</strong> ${value}</li>`;
                    }).join('')}
                </ul>
            `;
        } else {
            return `<p>No additional details available</p>`;
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new EducationManager();
});
