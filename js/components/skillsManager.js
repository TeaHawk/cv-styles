class SkillsManager {
    constructor() {
        this.container = document.querySelector('.skills-entries');
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSkillsManager());
        } else {
            this.setupSkillsManager();
        }
    }

    setupSkillsManager() {
        if (!this.container) {
            console.error('Skills entries container not found');
            return;
        }

        this.renderSkills(this.currentLang);
        document.addEventListener('languageChanged', (e) => {
            if (e.detail.language !== this.currentLang) {
                this.currentLang = e.detail.language;
                this.updateSkills(this.currentLang);
            }
        });
    }

    getProficiencyLevel(percentage) {
        if (percentage >= 90) return 'expert';
        if (percentage >= 80) return 'advanced';
        if (percentage >= 70) return 'proficient';
        return 'working';
    }

    getProficiencyDots(percentage) {
        const level = this.getProficiencyLevel(percentage);
        const dots = {
            'expert': 4,
            'advanced': 3,
            'proficient': 2,
            'working': 1
        }[level];

        return Array(4).fill().map((_, i) => 
            `<span class="proficiency-dot ${i < dots ? 'filled' : ''}"></span>`
        ).join('');
    }

    getProficiencyText(percentage, lang) {
        const level = this.getProficiencyLevel(percentage);
        return translations[lang].skills.proficiency[level];
    }

    generateSkillsGridHTML(skills, lang) {
        return skills.map(skill => `
            <div class="skill-item" data-level="${skill.level}">
                <span class="skill-name">${skill.name}</span>
                <div class="proficiency-wrapper">
                    <div class="proficiency-indicator">
                        ${this.getProficiencyDots(skill.level)}
                    </div>
                    <span class="proficiency-text">${this.getProficiencyText(skill.level, lang)}</span>
                </div>
                <div class="skill-tags">
                    ${skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    generateSkillsHTML(lang) {
        const workflowData = skills.workflow[lang];
        
        return workflowData.map(category => `
            <div class="skills-category">
                <div class="category-frame">
                    <div class="frame-line top"></div>
                    <div class="frame-line right"></div>
                    <div class="frame-line bottom"></div>
                    <div class="frame-line left"></div>
                </div>
                
                <h3 class="category-title">${category.category}</h3>
                
                <div class="skills-grid">
                    ${this.generateSkillsGridHTML(category.skills, lang)}
                </div>
            </div>
        `).join('');
    }

    renderSkills(lang) {
        try {
            this.container.innerHTML = '';
            const skillsHTML = this.generateSkillsHTML(lang);
            this.container.innerHTML = skillsHTML;

            requestAnimationFrame(() => {
                this.container.classList.add('visible');
                this.addHoverEffects();
            });
        } catch (error) {
            console.error('Error rendering skills:', error);
        }
    }

    updateSkills(lang) {
        try {
            this.container.classList.add('fade-out');
            
            setTimeout(() => {
                const skillsHTML = this.generateSkillsHTML(lang);
                this.container.innerHTML = skillsHTML;
                
                this.container.classList.remove('fade-out');
                this.addHoverEffects();
            }, 300);
        } catch (error) {
            console.error('Error updating skills:', error);
        }
    }

    addHoverEffects() {
        const skillItems = this.container.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('skill-hover');
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('skill-hover');
            });
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new SkillsManager();
});
