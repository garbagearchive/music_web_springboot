// API Service for connecting to Spring Boot backend
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:9188/api';
        this.currentUser = null;
    }

    // Helper method for making API calls
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    // Authentication
    async login(username, password) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            if (response === 'Login successful!') {
                this.currentUser = { username };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                return { success: true, message: response };
            }
            
            return { success: false, message: response };
        } catch (error) {
            return { success: false, message: 'Login failed' };
        }
    }

    async register(username, email, password) {
        try {
            const response = await this.makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            
            return { success: response === 'User registered successfully!', message: response };
        } catch (error) {
            return { success: false, message: 'Registration failed' };
        }
    }

    // Songs
    async getAllSongs() {
        return await this.makeRequest('/songs');
    }

    async getSongById(id) {
        return await this.makeRequest(`/songs/${id}`);
    }

    async createSong(songData) {
        return await this.makeRequest('/songs', {
            method: 'POST',
            body: JSON.stringify(songData)
        });
    }

    async updateSong(id, songData) {
        return await this.makeRequest(`/songs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(songData)
        });
    }

    async deleteSong(id) {
        return await this.makeRequest(`/songs/${id}`, {
            method: 'DELETE'
        });
    }

    // Artists
    async getAllArtists() {
        return await this.makeRequest('/artists');
    }

    async getArtistById(id) {
        return await this.makeRequest(`/artists/${id}`);
    }

    async createArtist(artistData) {
        return await this.makeRequest('/artists', {
            method: 'POST',
            body: JSON.stringify(artistData)
        });
    }

    // Albums
    async getAllAlbums() {
        return await this.makeRequest('/albums');
    }

    async getAlbumById(id) {
        return await this.makeRequest(`/albums/${id}`);
    }

    // Genres
    async getAllGenres() {
        return await this.makeRequest('/genres');
    }

    // Playlists
    async getAllPlaylists() {
        return await this.makeRequest('/playlists');
    }

    async getPlaylistById(id) {
        return await this.makeRequest(`/playlists/${id}`);
    }

    async createPlaylist(playlistData) {
        return await this.makeRequest('/playlists', {
            method: 'POST',
            body: JSON.stringify(playlistData)
        });
    }

    async updatePlaylist(id, playlistData) {
        return await this.makeRequest(`/playlists/${id}`, {
            method: 'PUT',
            body: JSON.stringify(playlistData)
        });
    }

    async deletePlaylist(id) {
        return await this.makeRequest(`/playlists/${id}`, {
            method: 'DELETE'
        });
    }

    // Playlist Songs
    async getPlaylistSongs(playlistId) {
        return await this.makeRequest(`/playlist-songs/playlist/${playlistId}`);
    }

    async addSongToPlaylist(playlistId, songId) {
        return await this.makeRequest('/playlist-songs', {
            method: 'POST',
            body: JSON.stringify({
                playlistID: playlistId,
                songID: songId
            })
        });
    }

    async removeSongFromPlaylist(playlistId, songId) {
        return await this.makeRequest(`/playlist-songs/playlist/${playlistId}/song/${songId}`, {
            method: 'DELETE'
        });
    }

    // User Favorites
    async getUserFavorites(userId) {
        return await this.makeRequest(`/user-favorites/user/${userId}`);
    }

    async addToFavorites(userId, songId) {
        return await this.makeRequest('/user-favorites', {
            method: 'POST',
            body: JSON.stringify({
                user: { id: userId },
                song: { songID: songId }
            })
        });
    }

    async removeFromFavorites(userId, songId) {
        return await this.makeRequest(`/user-favorites/user/${userId}/song/${songId}`, {
            method: 'DELETE'
        });
    }

    // Play History
    async addToPlayHistory(userId, songId) {
        return await this.makeRequest('/play-history', {
            method: 'POST',
            body: JSON.stringify({
                user: { id: userId },
                song: { songID: songId }
            })
        });
    }

    // Lyrics
    async getSongLyrics(songId) {
        return await this.makeRequest(`/lyrics/song/${songId}`);
    }

    async getSyncedLyrics(songId) {
        return await this.makeRequest(`/synced-lyrics/song/${songId}`);
    }

    // Search functionality
    async searchSongs(query) {
        // Since your backend doesn't have a specific search endpoint,
        // we'll get all songs and filter on the frontend
        const allSongs = await this.getAllSongs();
        const lowerQuery = query.toLowerCase();
        
        return allSongs.filter(song => 
            song.title?.toLowerCase().includes(lowerQuery) ||
            song.artist?.artistName?.toLowerCase().includes(lowerQuery) ||
            song.album?.title?.toLowerCase().includes(lowerQuery)
        );
    }

    // Utility methods
    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Transform backend data to frontend format
    transformSongData(backendSong) {
        return {
            id: backendSong.songID,
            title: backendSong.title || 'Unknown Title',
            artist: backendSong.artist?.artistName || 'Unknown Artist',
            album: backendSong.album?.title || 'Unknown Album',
            duration: backendSong.duration || 0,
            audioUrl: backendSong.audioFile || '#',
            artistId: backendSong.artist?.artistID,
            albumId: backendSong.album?.albumID,
            genreId: backendSong.genre?.genreID,
            releaseDate: backendSong.releaseDate
        };
    }

    transformPlaylistData(backendPlaylist) {
        return {
            id: backendPlaylist.playlistID,
            name: backendPlaylist.name,
            userId: backendPlaylist.user?.id,
            createdAt: backendPlaylist.createAt,
            tracks: [] // Will be populated separately
        };
    }
}

// Create global instance
const apiService = new ApiService();