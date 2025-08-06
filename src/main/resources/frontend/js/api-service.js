// API Service Class
        class ApiService {
            constructor() {
                this.baseURL = 'http://localhost:9188/api';
                this.currentUser = null;
            }

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
                    return { success: false, message: 'Login failed - Please check if the backend is running' };
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
                    return { success: false, message: 'Registration failed - Please check if the backend is running' };
                }
            }

            // Songs
            async getAllSongs() {
                return await this.makeRequest('/songs');
            }

            async getAllArtists() {
                return await this.makeRequest('/artists');
            }

            async getAllPlaylists() {
                return await this.makeRequest('/playlists');
            }

            async createPlaylist(playlistData) {
                return await this.makeRequest('/playlists', {
                    method: 'POST',
                    body: JSON.stringify(playlistData)
                });
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

            async getUserFavorites(userId) {
                return await this.makeRequest(`/user-favorites/user/${userId}`);
            }

            async addToFavorites(userId, songId) {
                return await this.makeRequest('/user-favorites', {
                    method: 'POST',
                    body: JSON.stringify({
                        user: {
                            id: userId
                        },
                        song: {
                            songID: songId
                        }
                    })
                });
            }

            async removeFromFavorites(userId, songId) {
                return await this.makeRequest(`/user-favorites/user/${userId}/song/${songId}`, {
                    method: 'DELETE'
                });
            }

            async searchSongs(query) {
                const allSongs = await this.getAllSongs();
                const lowerQuery = query.toLowerCase();
                return allSongs.filter(song =>
                    song.title?.toLowerCase().includes(lowerQuery) ||
                    song.artist?.artistName?.toLowerCase().includes(lowerQuery) ||
                    song.album?.title?.toLowerCase().includes(lowerQuery)
                );
            }

            transformSongData(backendSong) {
                return {
                    id: backendSong.songID,
                    title: backendSong.title || 'Unknown Title',
                    artist: backendSong.artist?.artistName || 'Unknown Artist',
                    album: backendSong.album?.title || 'Unknown Album',
                    duration: backendSong.duration || 0,
                    audioUrl: backendSong.audioFile || '#', // Lấy đường dẫn từ H2 Database
                    artistId: backendSong.artist?.artistID,
                    albumId: backendSong.album?.albumID,
                    genreId: backendSong.genre?.genreID,
                    releaseDate: backendSong.releaseDate
                };
            }

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
        }

        // Global variables
        const apiService = new ApiService();
        let currentTrack = null;
        let currentTrackIndex = 0;
        let isPlaying = false;
        let isShuffled = false;
        let repeatMode = 0;
        let volume = 0.7;
        let isMuted = false;
        let currentPlaylist = [];
        let allSongs = [];
        let userPlaylists = [];
        let favoritesTracks = new Set();
        let currentSection = 'home';
        let isLoggedIn = false;
        let isRegistering = false;

        // --- Bổ sung đối tượng Audio để phát nhạc thực tế ---
        const audio = new Audio();
        audio.volume = volume;
        // Bắt đầu với volume mặc định
        document.getElementById('volumeFill').style.width = `${volume * 100}%`;

        // Authentication functions (giữ nguyên)
        async function handleAuth(event) {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const authBtn = document.getElementById('authBtn');
            const messageDiv = document.getElementById('authMessage');
            if (!username || !password || (isRegistering && !email)) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            authBtn.disabled = true;
            authBtn.innerHTML = '<div class="loading"></div>';
            try {
                let result;
                if (isRegistering) {
                    result = await apiService.register(username, email, password);
                    if (result.success) {
                        showMessage(result.message, 'success');
                        setTimeout(() => {
                            toggleAuthMode();
                        }, 1500);
                    } else {
                        showMessage(result.message, 'error');
                    }
                } else {
                    result = await apiService.login(username, password);
                    if (result.success) {
                        showMessage('Login successful!', 'success');
                        setTimeout(() => {
                            showMainApp();
                        }, 1000);
                    } else {
                        showMessage(result.message, 'error');
                    }
                }
            } catch (error) {
                showMessage('Connection error. Please check if the backend is running.', 'error');
            }
            authBtn.disabled = false;
            authBtn.textContent = isRegistering ? 'Register' : 'Login';
        }

        function toggleAuthMode() {
            isRegistering = !isRegistering;
            const emailField = document.getElementById('email');
            const authBtn = document.getElementById('authBtn');
            const toggleText = document.getElementById('toggleAuth');
            const messageDiv = document.getElementById('authMessage');
            if (isRegistering) {
                emailField.style.display = 'block';
                emailField.required = true;
                authBtn.textContent = 'Register';
                toggleText.textContent = 'Already have an account? Login';
            } else {
                emailField.style.display = 'none';
                emailField.required = false;
                authBtn.textContent = 'Login';
                toggleText.textContent = "Don't have an account? Register";
            }
            messageDiv.innerHTML = '';
            document.getElementById('authForm').reset();
        }

        function showMessage(message, type) {
            const messageDiv = document.getElementById('authMessage');
            messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
            messageDiv.textContent = message;
        }

        function showMainApp() {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'grid';
            const user = apiService.getCurrentUser();
            document.getElementById('currentUsername').textContent = user ? user.username : 'User';
            initializeApp();
        }

        function logout() {
            apiService.logout();
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('mainApp').style.display = 'none';
            document.getElementById('authForm').reset();
            isRegistering = false;
            toggleAuthMode();
        }

        // Main app initialization (giữ nguyên)
        async function initializeApp() {
            try {
                // Load all songs
                const songs = await apiService.getAllSongs();
                allSongs = songs.map(song => apiService.transformSongData(song));
                currentPlaylist = [...allSongs];
                displayTracks(allSongs, 'trackList');
                // Load user playlists
                await loadUserPlaylists();
                // Setup search
                setupSearch();
                // Load favorites (you'll need to implement user ID management)
                // await loadFavorites();
            } catch (error) {
                console.error('Failed to initialize app:', error);
                document.getElementById('trackList').innerHTML = '<p>Failed to load songs. Please check if the backend is running.</p>';
            }
        }

        async function loadUserPlaylists() {
            try {
                const playlists = await apiService.getAllPlaylists();
                userPlaylists = playlists;
                updatePlaylistSidebar();
            } catch (error) {
                console.error('Failed to load playlists:', error);
            }
        }

        function updatePlaylistSidebar() {
            const container = document.getElementById('playlistContainer');
            container.innerHTML = '';
            userPlaylists.forEach(playlist => {
                const playlistItem = document.createElement('div');
                playlistItem.className = 'playlist-item';
                playlistItem.textContent = playlist.name;
                playlistItem.onclick = () => showPlaylist(playlist.playlistID);
                container.appendChild(playlistItem);
            });
        }

        function displayTracks(tracks, containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';

            if (tracks.length === 0) {
                container.innerHTML = '<p>No songs found.</p>';
                return;
            }

            tracks.forEach((track, index) => {
                const trackElement = document.createElement('div');
                trackElement.className = 'track-item';
                trackElement.dataset.trackId = track.id;
                const isFavorite = favoritesTracks.has(track.id);
                const isCurrentTrack = currentTrack && currentTrack.id === track.id;
                if (isCurrentTrack) {
                    trackElement.classList.add('playing');
                }
                trackElement.innerHTML = `
                    <span class="track-number">${index + 1}</span>
                    <div class="track-info">
                        <div class="track-cover">♪</div>
                        <div class="track-details">
                            <h4>${track.title}</h4>
                            <p>${track.artist}</p>
                        </div>
                    </div>
                    <div class="track-album">${track.album}</div>
                    <div class="track-duration">${formatTime(track.duration)}</div>
                    <div class="track-actions">
                        <button class="action-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${track.id})" title="Like">❤️</button>
                        <button class="action-btn" onclick="addToPlaylist(${track.id})" title="Add to playlist">➕</button>
                    </div>
                `;
                trackElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('action-btn')) {
                        playTrack(track, index);
                    }
                });
                container.appendChild(trackElement);
            });
        }

        // Music player functions
        function playTrack(track, index) {
            currentTrack = track;
            currentTrackIndex = index;
            // --- Thay đổi lớn: Gán nguồn âm thanh và bắt đầu phát ---
            if (track.audioUrl && track.audioUrl !== '#') {
                audio.src = track.audioUrl;
                audio.play();
                isPlaying = true;
            } else {
                console.error("Audio URL is not available for this track.");
                // Có thể thêm logic để hiển thị thông báo lỗi trên UI
                isPlaying = false;
            }
            updateCurrentTrackDisplay();
            updatePlayPauseButton();
            updateTrackHighlight();
            document.querySelector('.now-playing').classList.add('playing');
            console.log(`Playing: ${track.title} by ${track.artist}`);
        }

        function togglePlayPause() {
            if (!currentTrack) {
                if (currentPlaylist.length > 0) {
                    playTrack(currentPlaylist[0], 0);
                }
                return;
            }
            isPlaying = !isPlaying;
            updatePlayPauseButton();
            if (isPlaying) {
                audio.play(); // Thêm lệnh này
                document.querySelector('.now-playing').classList.add('playing');
            } else {
                audio.pause(); // Thêm lệnh này
                document.querySelector('.now-playing').classList.remove('playing');
            }
        }

        function nextTrack() {
            if (!currentPlaylist.length) return;
            if (isShuffled) {
                currentTrackIndex = Math.floor(Math.random() * currentPlaylist.length);
            } else {
                currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
            }
            playTrack(currentPlaylist[currentTrackIndex], currentTrackIndex);
        }

        function previousTrack() {
            if (!currentPlaylist.length) return;
            if (isShuffled) {
                currentTrackIndex = Math.floor(Math.random() * currentPlaylist.length);
            } else {
                currentTrackIndex = currentTrackIndex > 0 ?
                    currentTrackIndex - 1 : currentPlaylist.length - 1;
            }
            playTrack(currentPlaylist[currentTrackIndex], currentTrackIndex);
        }

        function toggleShuffle() {
            isShuffled = !isShuffled;
            document.getElementById('shuffleBtn').classList.toggle('active', isShuffled);
        }

        function toggleRepeat() {
            repeatMode = (repeatMode + 1) % 3;
            const repeatBtn = document.getElementById('repeatBtn');
            repeatBtn.classList.toggle('active', repeatMode > 0);
            repeatBtn.innerHTML = repeatMode === 2 ? '🔂' : '🔁';
        }

        async function toggleFavorite(trackId) {
            // This would need proper user ID management
            const user = apiService.getCurrentUser();
            if (!user) return;

            try {
                if (favoritesTracks.has(trackId)) {
                    favoritesTracks.delete(trackId);
                    // await apiService.removeFromFavorites(userId, trackId);
                } else {
                    favoritesTracks.add(trackId);
                    // await apiService.addToFavorites(userId, trackId);
                }
                updateFavoriteButtons();
            } catch (error) {
                console.error('Failed to toggle favorite:', error);
            }
        }

        async function addToPlaylist(trackId) {
            const modal = document.getElementById('playlistModal');
            modal.style.display = 'block';
            modal.dataset.trackId = trackId;
            const playlistList = document.getElementById('playlistList');
            playlistList.innerHTML = '';
            userPlaylists.forEach(playlist => {
                const playlistOption = document.createElement('div');
                playlistOption.className = 'playlist-option';
                playlistOption.innerHTML = `
                    <strong>${playlist.name}</strong>
                    <p>Playlist</p>
                `;
                playlistOption.addEventListener('click', async () => {
                    try {
                        await apiService.addSongToPlaylist(playlist.playlistID, trackId);
                        closeModal();
                        console.log('Song added to playlist');
                    } catch (error) {
                        console.error('Failed to add song to playlist:', error);
                    }
                });
                playlistList.appendChild(playlistOption);
            });
        }

        async function createNewPlaylist() {
            const name = prompt('Enter playlist name:');
            if (name) {
                try {
                    const user = apiService.getCurrentUser();
                    await apiService.createPlaylist({
                        name: name,
                        user: {
                            id: 1
                        } // You'll need proper user ID management
                    });
                    await loadUserPlaylists();
                } catch (error) {
                    console.error('Failed to create playlist:', error);
                }
            }
        }

        function closeModal() {
            document.getElementById('playlistModal').style.display = 'none';
        }

        // Search functionality (giữ nguyên)
        function setupSearch() {
            const searchInput = document.getElementById('searchInput');
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(async () => {
                    const query = e.target.value.toLowerCase().trim();
                    if (query) {
                        try {
                            const results = await apiService.searchSongs(query);
                            const transformedResults = results.map(song => apiService.transformSongData(song));
                            displayTracks(transformedResults, 'searchResults');
                            if (currentSection !== 'search') {
                                switchSection('search');
                            }
                        } catch (error) {
                            console.error('Search failed:', error);
                        }
                    }
                }, 300);
            });
        }

        // Navigation (giữ nguyên)
        function switchSection(sectionName) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(`${sectionName}-section`).style.display = 'block';
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
            currentSection = sectionName;
            switch (sectionName) {
                case 'home':
                    currentPlaylist = [...allSongs];
                    displayTracks(currentPlaylist, 'trackList');
                    break;
                case 'favorites':
                    const favoritesArray = allSongs.filter(track => favoritesTracks.has(track.id));
                    displayTracks(favoritesArray, 'favoriteTracks');
                    break;
                case 'library':
                    displayTracks(allSongs, 'libraryTracks');
                    break;
            }
        }

        // Theme toggle (giữ nguyên)
        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.querySelector('.theme-toggle');
            if (body.dataset.theme === 'light') {
                body.dataset.theme = 'dark';
                themeToggle.textContent = '🌙';
            } else {
                body.dataset.theme = 'light';
                themeToggle.textContent = '☀️';
            }
        }

        // Volume controls
        function setVolume(event) {
            const volumeBar = event.currentTarget;
            const rect = volumeBar.getBoundingClientRect();
            const percentage = (event.clientX - rect.left) / rect.width;
            volume = Math.max(0, Math.min(1, percentage));
            // --- Thay đổi: Set volume cho đối tượng Audio ---
            audio.volume = volume;
            document.getElementById('volumeFill').style.width = `${volume * 100}%`;
            const volumeBtn = document.querySelector('.volume-btn');
            if (volume === 0) {
                isMuted = true;
                volumeBtn.textContent = '🔇';
            } else {
                isMuted = false;
                volumeBtn.textContent = '🔊';
            }
        }

        function toggleMute() {
            isMuted = !isMuted;
            const volumeBtn = document.querySelector('.volume-btn');
            const volumeFill = document.getElementById('volumeFill');
            if (isMuted) {
                audio.muted = true; // Thêm lệnh này
                volumeBtn.textContent = '🔇';
                volumeFill.style.width = '0%';
            } else {
                audio.muted = false; // Thêm lệnh này
                volumeBtn.textContent = '🔊';
                volumeFill.style.width = `${volume * 100}%`;
            }
        }

        function seekTo(event) {
            if (!currentTrack) return;
            const progressBar = event.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const percentage = (event.clientX - rect.left) / rect.width;
            // --- Thay đổi: Seek đối tượng Audio ---
            audio.currentTime = audio.duration * percentage;
        }

        function goBack() {
            // --- Thay đổi: Seek lùi 10 giây ---
            if (audio.currentTime > 10) {
                audio.currentTime -= 10;
            } else {
                audio.currentTime = 0;
            }
        }

        function goForward() {
            // --- Thay đổi: Seek tiến 10 giây ---
            if (audio.currentTime + 10 < audio.duration) {
                audio.currentTime += 10;
            } else {
                audio.currentTime = audio.duration;
            }
        }

        // Utility functions (có thay đổi)
        function formatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function updateCurrentTrackDisplay() {
            if (currentTrack) {
                document.getElementById('currentTrackTitle').textContent = currentTrack.title;
                document.getElementById('currentTrackArtist').textContent = currentTrack.artist;
                document.getElementById('totalTime').textContent = formatTime(audio.duration);
                document.getElementById('currentTime').textContent = '0:00';
                document.getElementById('progressFill').style.width = '0%';
            }
        }

        function updatePlayPauseButton() {
            const playPauseBtn = document.getElementById('playPauseBtn');
            playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
        }

        function updateTrackHighlight() {
            document.querySelectorAll('.track-item').forEach(item => {
                item.classList.remove('playing');
            });
            if (currentTrack) {
                const trackElement = document.querySelector(`[data-track-id="${currentTrack.id}"]`);
                if (trackElement) {
                    trackElement.classList.add('playing');
                }
            }
        }

        function updateFavoriteButtons() {
            document.querySelectorAll('.track-item').forEach(item => {
                const trackId = parseInt(item.dataset.trackId);
                const favoriteBtn = item.querySelector('.action-btn[title="Like"]');
                if (favoriteBtn) {
                    favoriteBtn.classList.toggle('active', favoritesTracks.has(trackId));
                }
            });
        }

        // Xử lý khi bài hát kết thúc
        audio.addEventListener('ended', () => {
            handleTrackEnd();
        });

        // Cập nhật thanh tiến trình và thời gian
        audio.addEventListener('timeupdate', () => {
            if (isNaN(audio.duration)) return;
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const progress = (currentTime / duration) * 100;
            document.getElementById('progressFill').style.width = `${progress}%`;
            document.getElementById('currentTime').textContent = formatTime(currentTime);
        });

        // Cập nhật tổng thời gian khi metadata được tải
        audio.addEventListener('loadedmetadata', () => {
            document.getElementById('totalTime').textContent = formatTime(audio.duration);
        });

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Check if user is already logged in
            const user = apiService.getCurrentUser();
            if (user) {
                showMainApp();
            }

            // Auth form event listener
            document.getElementById('authForm').addEventListener('submit', handleAuth);

            // Toggle auth mode
            document.getElementById('toggleAuth').addEventListener('click', toggleAuthMode);

            // Navigation event listeners
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.dataset.section;
                    switchSection(section);
                });
            });

            // Modal close on outside click
            document.getElementById('playlistModal').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            });
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT') return;

                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        togglePlayPause();
                        break;
                    case 'ArrowRight':
                        if (e.shiftKey) {
                            nextTrack();
                        } else {
                            goForward(); // Thêm phím tắt tua nhanh
                        }
                        break;
                    case 'ArrowLeft':
                        if (e.shiftKey) {
                            previousTrack();
                        } else {
                            goBack(); // Thêm phím tắt tua lùi
                        }
                        break;
                    case 'KeyS':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            toggleShuffle();
                        }
                        break;
                    case 'KeyR':
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            toggleRepeat();
                        }
                        break;
                }
            });
        });
        // Additional utility functions for playlist management
        async function showPlaylist(playlistId) {
            try {
                // Giả định rằng API trả về tất cả bài hát và bạn sẽ lọc ra sau
                const allSongsFromApi = await apiService.getAllSongs();
                const playlistSongs = allSongsFromApi.filter(song =>
                    song.playlists.some(p => p.playlistID === playlistId)
                );

                const transformedSongs = playlistSongs.map(song => apiService.transformSongData(song));
                currentPlaylist = transformedSongs;
                displayTracks(currentPlaylist, 'trackList');
                const playlist = userPlaylists.find(p => p.playlistID === playlistId);
                if (playlist) {
                    document.querySelector('.section-title').textContent = `Playlist: ${playlist.name}`;
                }
            } catch (error) {
                console.error('Failed to load playlist:', error);
            }
        }

        async function createNewPlaylistFromModal() {
            const name = prompt('Enter playlist name:');
            if (name) {
                try {
                    const user = apiService.getCurrentUser();
                    const newPlaylist = await apiService.createPlaylist({
                        name: name,
                        user: {
                            id: 1
                        } // You'll need proper user ID management
                    });
                    const trackId = document.getElementById('playlistModal').dataset.trackId;
                    if (trackId) {
                        await apiService.addSongToPlaylist(newPlaylist.playlistID, parseInt(trackId));
                    }
                    await loadUserPlaylists();
                    closeModal();
                } catch (error) {
                    console.error('Failed to create playlist and add song:', error);
                }
            }
        }

        // Hàm handleTrackEnd giữ nguyên, vì nó vẫn xử lý logic chuyển bài
        function handleTrackEnd() {
            switch (repeatMode) {
                case 0: // No repeat
                    if (currentTrackIndex < currentPlaylist.length - 1) {
                        nextTrack();
                    } else {
                        isPlaying = false;
                        updatePlayPauseButton();
                        document.querySelector('.now-playing').classList.remove('playing');
                    }
                    break;
                case 1: // Repeat all
                    nextTrack();
                    break;
                case 2: // Repeat one
                    playTrack(currentTrack, currentTrackIndex);
                    break;
            }
        }