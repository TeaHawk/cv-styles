class SkillsManager {
    constructor() {
        this.container = document.querySelector('.skills-entries');
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        // Ensure DOM is loaded
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

        // Initial render
        this.renderSkills(this.currentLang);

        // Language change listener
        document.addEventListener('languageChanged', (e) => {
            if (e.detail.language !== this.currentLang) {
                this.currentLang = e.detail.language;
                this.updateSkills(this.currentLang);
            }
        });
    }

    renderSkills(lang) {
        try {
            this.container.innerHTML = '';
            const skillsHTML = this.generateSkillsHTML(lang);
            this.container.innerHTML = skillsHTML;

            requestAnimationFrame(() => {
                this.container.classList.add('visible');
                this.initializeProgressBars();
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
                this.initializeProgressBars();
                this.addHoverEffects();
            }, 300);
        } catch (error) {
            console.error('Error updating skills:', error);
        }
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
                    ${this.generateSkillsGridHTML(category.skills)}
                </div>
            </div>
        `).join('');
    }

    generateSkillsGridHTML(skills) {
        return skills.map(skill => `
            <div class="skill-item" data-level="${skill.level}">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <div class="skill-progress">
                    <div class="progress-bar" style="width: ${skill.level}%"></div>
                </div>
                <div class="skill-tags">
                    ${skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    initializeProgressBars() {
        const progressBars = this.container.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const level = bar.parentElement.parentElement.dataset.level;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, 100);
        });
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
