// ui.js

class UIManager {
    constructor() {
        this.currentSection = 'home';
        this.currentTheme = CONFIG.DEFAULTS.THEME;
        this.contextMenuTarget = null;
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupContextMenu();
        this.setupSectionNavigation();
        this.loadInitialData();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    loadTheme() {
        const savedTheme = Storage.get(CONFIG.STORAGE_KEYS.THEME, CONFIG.DEFAULTS.THEME);
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        Storage.set(CONFIG.STORAGE_KEYS.THEME, theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        Utils.showToast(`Switched to ${newTheme} theme`, 'info');
    }

    setupSectionNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('onclick')?.match(/showSection\('(\w+)'\)/)?.[1];
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionName) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        const activeNavItem = document.querySelector(`.nav-item[onclick*="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        try {
            switch (sectionName) {
                case 'home':
                    await this.loadHomeData();
                    break;
                case 'search':
                    await this.loadSearchData();
                    break;
                case 'library':
                    await this.loadLibraryData();
                    break;
                case 'favorites':
                    await this.loadFavoritesData();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${sectionName} data:`, error);
            Utils.showToast(`Error loading ${sectionName} data`, 'error');
        }
    }

    async loadHomeData() {
        const recentlyPlayedGrid = document.getElementById('recentlyPlayedGrid');
        const artistsGrid = document.getElementById('artistsGrid');

        const songs = await apiService.getSongs();
        const recentSongs = songs.slice(0, 6);
        this.renderMusicGrid(recentlyPlayedGrid, recentSongs, 'song');

        const artists = await apiService.getArtists();
        this.renderMusicGrid(artistsGrid, artists.slice(0, 6), 'artist');
    }

    async loadSearchData() {
        // Implementation
    }

    async loadLibraryData() {
        // Implementation
    }

    async loadFavoritesData() {
        // Implementation
    }

    renderMusicGrid(container, items, type) {
        if (!container) return;
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<img src="${item.cover || 'placeholder'}" alt="${item.name || item.title}"> <h3>${item.name || item.title}</h3>`;
            container.appendChild(card);
        });
    }

    setupContextMenu() {
        // Implementation
    }

    showContextMenu(event, item, type) {
        // Implementation
    }

    async loadInitialData() {
        try {
            await this.loadHomeData();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    updateFavoriteCounts() {
        const count = window.favoritesManager.getFavorites().length;
        const favoritesCount = document.getElementById('favoritesCount');
        if (favoritesCount) {
            favoritesCount.textContent = `${count} song${count !== 1 ? 's' : ''}`;
        }
    }

    showLoading(container) {
        if (container) {
            container.innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    hideLoading() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            element.remove();
        });
    }

    handleResize() {
        // Implementation
    }
}

window.uiManager = new UIManager();