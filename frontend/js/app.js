// app.js

class MusicStreamingApp {
    constructor(options = {}) {
        this.isInitialized = false;
        this.managers = {};
        this.currentUser = null;
        this.appState = {
            currentView: 'home',
            isLoading: false,
            notifications: []
        };
        if (typeof this.handleWindowResize !== 'function') {
            console.error('handleWindowResize not defined');
        } else {
            this._onResize = this.handleWindowResize.bind(this);
        }
        this.options = Object.assign({
            restoreDelay: 1000
        }, options);

        // Removed: this._onResize = this.handleWindowResize.bind(this);  // Redundant and causes crash if method undefined

        this._onBeforeUnload = () => this.saveAppState();
        this._onUserLogin = (e) => this._handleUserLogin(e);
        this._onUserLogout = () => this._handleUserLogout();
        this._onKeydown = (e) => this._handleKeydown(e);
        this._onError = (e) => this._globalErrorHandler(e);
        this._onRejection = (e) => this._globalRejectionHandler(e);

        this.init = this.init.bind(this);
        this.initializeAppState = this.initializeAppState.bind(this);
        this.loadInitialData = this.loadInitialData.bind(this);
        this.loadHomeContent = this.loadHomeContent.bind(this);
        this.setupGlobalEventListeners = this.setupGlobalEventListeners.bind(this);
        this.setupKeyboardShortcuts = this.setupKeyboardShortcuts.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.showAppLoading = this.showAppLoading.bind(this);
        this.hideAppLoading = this.hideAppLoading.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.showError = this.showError.bind(this);
        this.saveAppState = this.saveAppState.bind(this);
        this.restoreAppState = this.restoreAppState.bind(this);
        this.clearAppData = this.clearAppData.bind(this);
        this.destroy = this.destroy.bind(this);

        this.init();
    }

    async init() {
        try {
            this.showAppLoading();
            console.log('Initializing MusicStreamingApp...');

            this.managers.theme = window.themeManager || (window.themeManager = new ThemeManager());
            this.managers.player = window.player || (window.player = new MusicPlayer());
            this.managers.audioVisualizer = window.audioVisualizer || (window.audioVisualizer = new AudioVisualizer());
            this.managers.search = window.searchManager || (window.searchManager = new SearchManager());
            this.managers.ui = window.uiManager || (window.uiManager = new UIManager());
            this.managers.auth = window.authManager || (window.authManager = new AuthManager());
            this.managers.playlist = window.playlistManager || (window.playlistManager = new PlaylistManager());
            this.managers.favorites = window.favoritesManager || (window.favoritesManager = new FavoritesManager());
            this.managers.queue = window.queueManager || (window.queueManager = new QueueManager());

            // Added: Check if already connected before attempting to connect (prevents InvalidStateError)
            if (window.audioVisualizer && window.player && window.player.audio && !window.audioVisualizer.isConnected) {
                window.audioVisualizer.connectToAudioElement(window.player.audio);
                window.audioVisualizer.isConnected = true;  // Set flag to prevent future reconnections
            }

            this.setupGlobalEventListeners();
            this.setupKeyboardShortcuts();

            await this.initializeAppState();

            await this.loadInitialData();

            this.isInitialized = true;
            console.log('🎵 MusicStreamingApp initialized successfully');

            this.hideAppLoading();

        } catch (err) {
            console.error('App init error', err);
        }
    }

    setupGlobalEventListeners() {
        window.addEventListener('resize', this._onResize);
        window.addEventListener('beforeunload', this._onBeforeUnload);
        document.addEventListener('user-login', this._onUserLogin);
        document.addEventListener('user-logout', this._onUserLogout);
        document.addEventListener('keydown', this._onKeydown);
        window.addEventListener('error', this._onError);
        window.addEventListener('unhandledrejection', this._onRejection);
    }

    async initializeAppState() {
        // Load theme
        if (this.managers.theme) {
            this.managers.theme.loadSavedTheme();
        }

        // Load user
        if (this.managers.auth) {
            const savedUser = Storage.get(CONFIG.STORAGE_KEYS.USER);
            if (savedUser) {
                this.setUser(savedUser);
            }
        }

        // Load queue
        if (this.managers.queue) {
            this.managers.queue.loadSavedQueue();
        }
    }

    async loadInitialData() {
        try {
            await this.loadHomeContent();
            if (this.managers.playlist) {
                await this.managers.playlist.loadUserPlaylists();
            }
            if (this.managers.favorites && this.currentUser) {
                await this.managers.favorites.loadUserFavorites(this.currentUser.id);
            }
        } catch (e) {
            console.error('loadInitialData error', e);
        }
    }

    async loadHomeContent() {
        try {
            if (window.apiService && window.apiService.getSongs) {
                const songs = await window.apiService.getSongs();
                // Display songs using UI manager
                if (this.managers.ui) {
                    this.managers.ui.renderMusicGrid(document.getElementById('recentlyPlayedGrid'), songs.slice(0, 6), 'song');
                }
            }
        } catch (e) {
            console.error('loadHomeContent error', e);
        }
    }

    setupKeyboardShortcuts() {
        // Implementation as needed
    }

    // Added: Missing method definition
    handleWindowResize() {
        // Implementation as needed (e.g., adjust UI layouts, canvas sizes for visualizer, etc.)
    }

    _handleUserLogin(e) {
        this.setUser(e.detail.user);
        this.loadInitialData();
        if (this.managers.ui) {
            this.managers.ui.showSection('home');
        }
        if (this.currentUser.role === CONFIG.ADMIN.ROLE) {
            this.loadAdminFeatures();
        }
    }

    _handleUserLogout() {
        this.currentUser = null;
        this.clearAppData();
        if (this.managers.ui) {
            this.managers.ui.showSection('auth');
        }
    }

    _handleKeydown(e) {
        // Implementation as needed
    }

    _globalErrorHandler(e) {
        console.error('Global error:', e);
        this.showError('An unexpected error occurred');
    }

    _globalRejectionHandler(e) {
        console.error('Unhandled rejection:', e.reason);
        this.showError('An unexpected error occurred');
    }

    showAppLoading() {
        // Implementation as needed
    }

    hideAppLoading() {
        // Implementation as needed
    }

    showNotification(message, type) {
        Utils.showToast(message, type);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    saveAppState() {
        // Implementation as needed
    }

    restoreAppState() {
        // Implementation as needed
    }

    clearAppData() {
        if (this.managers.playlist) this.managers.playlist.userPlaylists = [];
        if (this.managers.favorites) this.managers.favorites.clearFavorites();
        if (this.managers.player) this.managers.player.stop();
        if (this.managers.search) this.managers.search.clearSearchResults();
    }

    destroy() {
        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('beforeunload', this._onBeforeUnload);
        document.removeEventListener('user-login', this._onUserLogin);
        document.removeEventListener('user-logout', this._onUserLogout);
        document.removeEventListener('keydown', this._onKeydown);
        window.removeEventListener('error', this._onError);
        window.removeEventListener('unhandledrejection', this._onRejection);

        if (this.managers.player) this.managers.player.stop();
        if (this.managers.audioVisualizer) this.managers.audioVisualizer.stop();

        this.isInitialized = false;
    }

    setUser(userData) {
        this.currentUser = userData;
        Storage.set(CONFIG.STORAGE_KEYS.USER, userData);
    }

    loadAdminFeatures() {
        console.log('Loading admin features');
        // Add admin UI or endpoints calls here
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Added: Destroy existing app instance before creating a new one (helps with dev reloads/HMR)
    if (window.musicApp) {
        window.musicApp.destroy();
    }
    window.musicApp = new MusicStreamingApp();
});