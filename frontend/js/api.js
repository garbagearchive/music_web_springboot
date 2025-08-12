// api.js

class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    async getSongs(filters = {}) {
        let endpoint = CONFIG.ENDPOINTS.SONGS;
        const params = new URLSearchParams();

        if (filters.searchTerm) {
            params.append('searchTerm', filters.searchTerm);
        }
        if (filters.genre) {
            params.append('genre', filters.genre);
        }
        if (filters.artist) {
            params.append('artist', filters.artist);
        }

        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }

        return this.request(endpoint);
    }

    async getSong(id) {
        return this.request(`${CONFIG.ENDPOINTS.SONGS}/${id}`);
    }

    async createSong(songData) {
        return this.request(CONFIG.ENDPOINTS.SONGS, {
            method: 'POST',
            body: JSON.stringify(songData)
        });
    }

    async updateSong(id, songData) {
        return this.request(`${CONFIG.ENDPOINTS.SONGS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(songData)
        });
    }

    async deleteSong(id) {
        return this.request(`${CONFIG.ENDPOINTS.SONGS}/${id}`, {
            method: 'DELETE'
        });
    }

    async getArtists() {
        return this.request(CONFIG.ENDPOINTS.ARTISTS);
    }

    async getArtist(id) {
        return this.request(`${CONFIG.ENDPOINTS.ARTISTS}/${id}`);
    }

    async createArtist(artistData) {
        return this.request(CONFIG.ENDPOINTS.ARTISTS, {
            method: 'POST',
            body: JSON.stringify(artistData)
        });
    }

    async updateArtist(id, artistData) {
        return this.request(`${CONFIG.ENDPOINTS.ARTISTS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(artistData)
        });
    }

    async deleteArtist(id) {
        return this.request(`${CONFIG.ENDPOINTS.ARTISTS}/${id}`, {
            method: 'DELETE'
        });
    }

    async getAlbums() {
        return this.request(CONFIG.ENDPOINTS.ALBUMS);
    }

    async getAlbum(id) {
        return this.request(`${CONFIG.ENDPOINTS.ALBUMS}/${id}`);
    }

    async getFavorites() {
        return this.request(CONFIG.ENDPOINTS.FAVORITES || '/favorites');
    }

    async getFavoritesByUser(userId) {
        return this.request(`${CONFIG.ENDPOINTS.FAVORITES || '/favorites'}/user/${userId}`);
    }

    async addToFavorites(userId, songId) {
        return this.request(CONFIG.ENDPOINTS.FAVORITES || '/favorites', {
            method: 'POST',
            body: JSON.stringify({ userId, songId })
        });
    }

    async addFavorite(favoriteData) {
        return this.request(CONFIG.ENDPOINTS.FAVORITES || '/favorites', {
            method: 'POST',
            body: JSON.stringify(favoriteData)
        });
    }

    async removeFromFavorites(userId, songId) {
        return this.request(`${CONFIG.ENDPOINTS.FAVORITES || '/favorites'}/${userId}/${songId}`, {
            method: 'DELETE'
        });
    }

    async removeFromFavoritesWithBody(userId, songId) {
        return this.request(CONFIG.ENDPOINTS.FAVORITES || '/favorites', {
            method: 'DELETE',
            body: JSON.stringify({ userId, songId })
        });
    }

    async getPlaylists() {
        return this.request(CONFIG.ENDPOINTS.PLAYLISTS || '/playlists');
    }

    async getPlaylist(id) {
        return this.request(`${CONFIG.ENDPOINTS.PLAYLISTS || '/playlists'}/${id}`);
    }

    async getSongsByPlaylist(playlistId) {
        return this.request(`${CONFIG.ENDPOINTS.PLAYLISTS || '/playlists'}/${playlistId}/songs`);
    }

    async createPlaylist(playlistData) {
        return this.request(CONFIG.ENDPOINTS.PLAYLISTS || '/playlists', {
            method: 'POST',
            body: JSON.stringify(playlistData)
        });
    }

    async updatePlaylist(id, playlistData) {
        return this.request(`${CONFIG.ENDPOINTS.PLAYLISTS || '/playlists'}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(playlistData)
        });
    }

    async deletePlaylist(id) {
        return this.request(`${CONFIG.ENDPOINTS.PLAYLISTS || '/playlists'}/${id}`, {
            method: 'DELETE'
        });
    }

    async isSongFavorited(userId, songId) {
        if (!userId || isNaN(userId)) {
            console.error('Invalid userId for isSongFavorited');
            return false;
        }
        try {
            const favorites = await this.getFavoritesByUser(userId);
            return favorites.some(fav => fav.song && fav.song.songID === songId);
        } catch (error) {
            console.error('Error checking if song is favorited:', error);
            return false;
        }
    }

    getUserFavorites(userId) {
        return this.getFavoritesByUser(userId);
    }

    async getPlaylistSongCount(playlistId) {
        try {
            const songs = await this.getSongsByPlaylist(playlistId);
            return songs.length;
        } catch (error) {
            console.error('Error getting playlist song count:', error);
            return 0;
        }
    }
}

window.apiService = new ApiService();
