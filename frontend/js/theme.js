// theme.js

class ThemeManager {
    constructor() {
        this.themes = {
            dark: {
                name: 'Dark',
                icon: '🌙',
                colors: {
                    primary: '#1db954',
                    secondary: '#191414',
                    background: '#121212',
                    surface: '#181818',
                    text: '#ffffff',
                    textSecondary: '#b3b3b3',
                    accent: '#1ed760'
                }
            },
            light: {
                name: 'Light',
                icon: '☀️',
                colors: {
                    primary: '#1db954',
                    secondary: '#f6f6f6',
                    background: '#ffffff',
                    surface: '#f9f9f9',
                    text: '#000000',
                    textSecondary: '#737373',
                    accent: '#1ed760'
                }
            },
        };

        this.currentTheme = 'dark';
        this.customThemes = new Map();
        this.storageKey = 'selectedTheme';
        this.init = this.init.bind(this);
        this.loadSavedTheme = this.loadSavedTheme.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.applyTheme = this.applyTheme.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.toggleTheme = this.toggleTheme.bind(this);
        this.createThemeSelector = this.createThemeSelector.bind(this);
        this.addCustomTheme = this.addCustomTheme.bind(this);
        this.showThemeNotification = this.showThemeNotification.bind(this);
        this.showError = this.showError.bind(this);
        this.dispatchThemeEvent = this.dispatchThemeEvent.bind(this);

        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
        this.createThemeSelector();
        console.log('🎨 Theme Manager initialized (current:', this.currentTheme + ')');
    }

    loadSavedTheme() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved && (this.themes[saved] || this.customThemes.has(saved))) {
                this.setTheme(saved, { notify: false });
            } else {
                this.setTheme(this.currentTheme, { notify: false });
            }
        } catch (e) {
            this.setTheme(this.currentTheme, { notify: false });
        }
    }

    setTheme(themeName, opts = { notify: true }) {
        const theme = this.themes[themeName] || this.customThemes.get(themeName);
        if (!theme) {
            this.showError(`Theme "${themeName}" not found`);
            return;
        }

        this.currentTheme = themeName;
        this.applyTheme(theme.colors);

        document.documentElement.setAttribute('data-theme', themeName);

        localStorage.setItem(this.storageKey, themeName);

        if (opts.notify) {
            this.dispatchThemeEvent('theme:changed', { theme: themeName, colors: theme.colors });
            this.showThemeNotification(themeName);
        }
    }

    applyTheme(colors) {
        const root = document.documentElement;
        Object.keys(colors).forEach(key => {
            root.style.setProperty(`--${key}`, colors[key]);
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 't' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const keys = Object.keys(this.themes).concat(Array.from(this.customThemes.keys()));
        const idx = keys.indexOf(this.currentTheme);
        const next = keys[(idx + 1) % keys.length];
        this.setTheme(next);
    }

    createThemeSelector(containerId = 'themeSelectorContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        const fragment = document.createDocumentFragment();
        Object.entries(this.themes).forEach(([key, t]) => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.dataset.theme = key;
            btn.title = t.name;
            btn.innerHTML = `<span class="theme-icon">${t.icon || ''}</span><span class="theme-name">${t.name}</span>`;
            btn.addEventListener('click', () => this.setTheme(key));
            fragment.appendChild(btn);
        });

        this.customThemes.forEach((t, key) => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn custom';
            btn.dataset.theme = key;
            btn.title = t.name;
            btn.innerHTML = `<span class="theme-icon">${t.icon || ''}</span><span class="theme-name">${t.name}</span>`;
            btn.addEventListener('click', () => this.setTheme(key));
            fragment.appendChild(btn);
        });

        container.appendChild(fragment);
    }

    addCustomTheme(key, themeObj) {
        if (!key || !themeObj || !themeObj.colors) {
            this.showError('Invalid custom theme');
            return;
        }
        this.customThemes.set(key, themeObj);
        this.createThemeSelector();
    }

    showThemeNotification(themeName, customMessage = null) {
        const t = this.themes[themeName] || this.customThemes.get(themeName);
        const message = customMessage || (t ? `Switched to ${t.name} theme` : `Switched theme to ${themeName}`);
        Utils.showToast(message, 'info');
    }

    showError(message) {
        Utils.showToast(message, 'error');
    }

    dispatchThemeEvent(eventType, data) {
        const event = new CustomEvent(eventType, { detail: data, bubbles: true });
        document.dispatchEvent(event);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});