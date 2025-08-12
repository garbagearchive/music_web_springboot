// favorites.js

class FavoritesManager {
    constructor() {
        this.favorites = new Map();
        this.isLoading = false;
        this.currentUserId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        console.log('🤍 Favorites Manager initialized');
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                const songId = parseInt(btn.dataset.songId);
                this.toggleFavorite(songId);
            }
        });

        document.addEventListener('user-login', (e) => {
            this.currentUserId = e.detail.user?.id;
            if (this.currentUserId) {
                this.loadUserFavorites(this.currentUserId);
            }
        });

        document.addEventListener('user-logout', () => {
            this.clearFavorites();
            this.currentUserId = null;
        });
    }

    async loadUserFavorites(userId) {
        if (!userId || !window.authManager.isAuthenticated()) return;

        try {
            this.isLoading = true;
            this.updateLoadingState();

            const favorites = await window.apiService.getUserFavorites(userId);
            this.favorites.clear();

            favorites.forEach(favorite => {
                this.favorites.set(favorite.song.songID, {
                    song: favorite.song,
                    favoritedAt: new Date(favorite.favoritedAt)
                });
            });

            this.updateUI();
            console.log(`❤️ Loaded ${favorites.length} favorites for user ${userId}`);

        } catch (error) {
            console.error('Failed to load user favorites:', error);
            this.showError('Failed to load your favorites');
        } finally {
            this.isLoading = false;
            this.updateLoadingState();
        }
    }

    async toggleFavorite(songId) {
        if (!this.currentUserId || !window.authManager.isAuthenticated()) {
            this.showError('Please log in to add favorites');
            return;
        }

        if (!songId) return;

        try {
            const isFavorite = this.isFavorite(songId);
            const btn = document.querySelector(`[data-song-id="${songId}"] .favorite-btn`);

            if (btn) {
                btn.disabled = true;
                btn.classList.add('loading');
            }

            if (isFavorite) {
                await this.removeFavorite(songId);
            } else {
                await this.addFavorite(songId);
            }

            this.updateFavoriteButton(songId);

        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            this.showError('Failed to update favorite');
        } finally {
            const btn = document.querySelector(`[data-song-id="${songId}"] .favorite-btn`);
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('loading');
            }
        }
    }

    async addFavorite(songId) {
        if (!this.currentUserId) return;

        try {
            const song = await window.apiService.getSong(songId);
            if (!song) {
                throw new Error('Song not found');
            }

            await window.apiService.addToFavorites(this.currentUserId, songId);

            this.favorites.set(songId, {
                song: song,
                favoritedAt: new Date()
            });

            this.updateUI();
            this.dispatchFavoriteEvent('favorite-added', { songId });
            this.showSuccess('Added to favorites');
        } catch (error) {
            console.error('Failed to add favorite:', error);
        }
    }

    async removeFavorite(songId) {
        if (!this.currentUserId) return;

        try {
            await window.apiService.removeFromFavorites(this.currentUserId, songId);

            this.favorites.delete(songId);

            this.updateUI();
            this.dispatchFavoriteEvent('favorite-removed', { songId });
            this.showSuccess('Removed from favorites');
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    }

    isFavorite(songId) {
        return this.favorites.has(songId);
    }

    getFavorites() {
        return Array.from(this.favorites.values()).sort((a, b) => b.favoritedAt - a.favoritedAt);
    }

    updateUI() {
        if (window.uiManager) {
            window.uiManager.updateFavoriteCounts();
        }
    }

    updateFavoriteButton(songId) {
        const btn = document.querySelector(`[data-song-id="${songId}"] .favorite-btn`);
        if (btn) {
            btn.classList.toggle('favorited', this.isFavorite(songId));
        }
    }

    updateLoadingState() {
        // Implementation as needed
    }

    dispatchFavoriteEvent(eventType, data) {
        document.dispatchEvent(new CustomEvent(eventType, { detail: data }));
    }

    showSuccess(message) {
        Utils.showToast(message, 'success');
    }

    showError(message) {
        Utils.showToast(message, 'error');
    }

    clearFavorites() {
        this.favorites.clear();
        this.updateUI();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
});