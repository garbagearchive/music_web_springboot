// search.js

class SearchManager {
    constructor() {
        this.searchResults = [];
        this.searchFilters = {
            searchTerm: '',
            genre: '',
            artist: ''
        };

        this._debounceDelay = CONFIG.UI.DEBOUNCE_DELAY || 300;

        this.init = this.init.bind(this);
        this.setupSearchListeners = this.setupSearchListeners.bind(this);
        this.performSearch = this.performSearch.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
        this.clearSearchResults = this.clearSearchResults.bind(this);
        this.toggleSearchView = this.toggleSearchView.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.toggleSearchResultFavorite = this.toggleSearchResultFavorite.bind(this);

        this.init();
    }

    init() {
        this.setupSearchListeners();

        this.debouncedSearch = Utils.debounce(this.performSearch.bind(this), this._debounceDelay);
    }

    setupSearchListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchFilters.searchTerm = e.target.value.trim();
                this.debouncedSearch();
            });
        }

        const genreSelect = document.getElementById('genreFilter');
        if (genreSelect) {
            genreSelect.addEventListener('change', (e) => {
                this.searchFilters.genre = e.target.value;
                this.performSearch();
            });
        }

        const artistSelect = document.getElementById('artistFilter');
        if (artistSelect) {
            artistSelect.addEventListener('change', (e) => {
                this.searchFilters.artist = e.target.value;
                this.performSearch();
            });
        }

        const form = document.getElementById('searchForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }
    }

    async performSearch() {
        const searchResultsEl = document.getElementById('searchResults');
        if (!searchResultsEl) return;

        const hasFilters = this.searchFilters.searchTerm || this.searchFilters.genre || this.searchFilters.artist;
        if (!hasFilters) {
            searchResultsEl.innerHTML = this.getSearchPrompt();
            return;
        }

        searchResultsEl.innerHTML = '<p>Searching...</p>';

        try {
            let results = [];
            if (window.apiService && window.apiService.getSongs) {
                results = await window.apiService.getSongs(this.searchFilters);
            } else {
                results = await this.mockSearch(this.searchFilters);
            }

            this.searchResults = Array.isArray(results) ? results : [];
            this.displaySearchResults(this.searchResults);
        } catch (error) {
            console.error('Search error:', error);
            searchResultsEl.innerHTML = '<p>Error performing search. Please try again.</p>';
        }
    }

    async mockSearch(filters) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: 'Song 1', artist: { name: 'Artist 1' } },
                    { id: 2, title: 'Song 2', artist: { name: 'Artist 2' } }
                ]);
            }, 500);
        });
    }

    displaySearchResults(results) {
        const searchResultsEl = document.getElementById('searchResults');
        if (!searchResultsEl) return;

        searchResultsEl.innerHTML = '';

        if (results.length === 0) {
            searchResultsEl.innerHTML = '<p>No results found</p>';
            return;
        }

        const list = document.createElement('div');
        results.forEach(result => {
            const item = document.createElement('div');
            item.textContent = result.title;
            list.appendChild(item);
        });

        searchResultsEl.appendChild(list);
    }

    getSearchPrompt() {
        return `
            <div class="search-prompt">
                <i class="fas fa-search"></i>
                <h3>Search for music</h3>
                <p>Find your favorite songs, artists, and albums</p>
            </div>
        `;
    }

    focusSearchInput() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }

    clearSearchResults() {
        this.searchResults = [];
        const searchResultsEl = document.getElementById('searchResults');
        if (searchResultsEl) {
            searchResultsEl.innerHTML = this.getSearchPrompt();
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        const genreSelect = document.getElementById('genreFilter');
        if (genreSelect) genreSelect.value = '';
        const artistSelect = document.getElementById('artistFilter');
        if (artistSelect) artistSelect.value = '';

        this.searchFilters = { searchTerm: '', genre: '', artist: '' };
        this.clearSearchResults();
    }

    toggleSearchView(viewType) {
        const searchResultsEl = document.getElementById('searchResults');
        if (!searchResultsEl) return;
        searchResultsEl.classList.toggle('view-grid', viewType === 'grid');
        searchResultsEl.classList.toggle('view-list', viewType === 'list');
    }

    async toggleSearchResultFavorite(songId, songObj = null) {
        const song = songObj || (this.searchResults.find(s => (s.songID || s.id) == songId));
        if (!song) return;
        if (window.favoritesManager) {
            await window.favoritesManager.toggleFavorite(song.id);
        }
    }
}

window.searchManager = new SearchManager();