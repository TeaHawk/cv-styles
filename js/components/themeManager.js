class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        if (this.currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        }
        this.updateIcon();

        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }


	toggleTheme() {
		this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
		document.body.setAttribute('data-theme', this.currentTheme);
		localStorage.setItem('theme', this.currentTheme);
		this.updateIcon();
		
		// Reset SVG animations
		const lightLogo = document.getElementById('logo-svg-light');
		const darkLogo = document.getElementById('logo-svg-dark');
		
		// Clone and replace both SVGs to reset animations
		if (lightLogo) {
			const lightClone = lightLogo.cloneNode(true);
			lightLogo.parentNode.replaceChild(lightClone, lightLogo);
		}
		if (darkLogo) {
			const darkClone = darkLogo.cloneNode(true);
			darkLogo.parentNode.replaceChild(darkClone, darkLogo);
		}
	}

    updateIcon() {
        const icon = this.themeToggle.querySelector('span');
        icon.textContent = this.currentTheme === 'dark' ? '🌒' : '🌞';
    }
}
