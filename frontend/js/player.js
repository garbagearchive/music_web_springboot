// player.js

class MusicPlayer {
    constructor() {
        this.audio = null;
        this.currentSong = null;
        this.currentIndex = 0;
        this.queue = [];
        this.isPlaying = false;
        this.isPaused = false;
        this.volume = 0.5;
        this.duration = 0;
        this.currentTime = 0;
        this.isShuffled = false;
        this.repeatMode = 'none';
        this.originalQueue = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        try {
            this.audio = document.getElementById('audioPlayer') || this.createAudioElement();
            
            this.setupEventListeners();
            this.setupUIEventListeners();
            
            this.loadSettings();
            
            console.log('🎵 Music Player initialized successfully');
        } catch (error) {
            console.error('Failed to initialize music player:', error);
            this.handleError('Failed to initialize player');
        }
    }

    createAudioElement() {
        const audio = document.createElement('audio');
        audio.id = 'audioPlayer';
        audio.preload = 'metadata';
        document.body.appendChild(audio);
        return audio;
    }

    setupEventListeners() {
        if (!this.audio) return;

        this.audio.addEventListener('loadstart', () => this.handleLoadStart());
        this.audio.addEventListener('loadedmetadata', () => this.handleLoadedMetadata());
        this.audio.addEventListener('loadeddata', () => this.handleLoadedData());
        this.audio.addEventListener('canplay', () => this.handleCanPlay());
        this.audio.addEventListener('canplaythrough', () => this.handleCanPlayThrough());
        this.audio.addEventListener('play', () => this.handlePlay());
        this.audio.addEventListener('pause', () => this.handlePause());
        this.audio.addEventListener('ended', () => this.handleEnded());
        this.audio.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.audio.addEventListener('volumechange', () => this.handleVolumeChange());
        this.audio.addEventListener('error', (e) => this.handleAudioError(e));
        this.audio.addEventListener('stalled', () => this.handleStalled());
        this.audio.addEventListener('waiting', () => this.handleWaiting());
        this.audio.addEventListener('playing', () => this.handlePlaying());
    }

    setupUIEventListeners() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        const prevBtn = document.getElementById('previousBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSong());
        }

        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSong());
        }

        const shuffleBtn = document.getElementById('shuffleBtn');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }

        const repeatBtn = document.getElementById('repeatBtn');
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }

        const progressRange = document.getElementById('progressRange');
        if (progressRange) {
            progressRange.addEventListener('input', (e) => this.seek(e.target.value));
        }
    }

    handleLoadStart() {
        this.isLoading = true;
        this.updateLoadingState(true);
    }

    handleLoadedMetadata() {
        this.duration = this.audio.duration;
        this.updateProgressUI();
    }

    handleLoadedData() {
        // Ready to play
    }

    handleCanPlay() {
        this.isLoading = false;
        this.updateLoadingState(false);
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    handleCanPlayThrough() {
        // Fully loaded
    }

    handlePlay() {
        this.isPlaying = true;
        this.isPaused = false;
        this.updatePlayPauseButton();
    }

    handlePause() {
        this.isPlaying = false;
        this.isPaused = true;
        this.updatePlayPauseButton();
    }

    handleEnded() {
        this.nextSong();
    }

    handleTimeUpdate() {
        this.currentTime = this.audio.currentTime;
        this.updateProgressUI();
    }

    handleVolumeChange() {
        this.volume = this.audio.volume;
        this.saveSettings();
    }

    handleAudioError(e) {
        console.error('Audio error:', e);
        this.handleError('Failed to load song');
    }

    handleStalled() {
        this.handleError('Audio stalled');
    }

    handleWaiting() {
        this.isLoading = true;
        this.updateLoadingState(true);
    }

    handlePlaying() {
        this.isLoading = false;
        this.updateLoadingState(false);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.audio) {
            this.audio.play();
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    nextSong() {
        this.currentIndex = (this.currentIndex + 1) % this.queue.length;
        this.playSong(this.queue[this.currentIndex]);
    }

    previousSong() {
        this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
        this.playSong(this.queue[this.currentIndex]);
    }

    playSong(song) {
        this.currentSong = song;
        this.audio.src = song.url; // Assume song has url
        this.audio.play();
    }

    seek(time) {
        this.audio.currentTime = time;
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        // Shuffle logic
    }

    toggleRepeat() {
        // Repeat logic
    }

    updatePlayPauseButton() {
        // UI update
    }

    updateProgressUI() {
        // UI update
    }

    updateLoadingState(loading) {
        // UI update
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    handleKeyboard(event) {
        // Keyboard handling
    }

    handleError(message) {
        console.error('Player error:', message);
        Utils.showToast(message, 'error');
    }

    updatePlayHistory(song) {
        console.log('🕒 Adding to play history:', song.title);
    }

    loadSettings() {
        const volume = parseFloat(localStorage.getItem('player_volume') || '0.5');
        const shuffle = localStorage.getItem('player_shuffle') === 'true';
        const repeat = localStorage.getItem('player_repeat') || 'none';

        this.setVolume(volume);
        this.isShuffled = shuffle;
        this.repeatMode = repeat;
    }

    saveSettings() {
        localStorage.setItem('player_volume', this.volume.toString());
        localStorage.setItem('player_shuffle', this.isShuffled.toString());
        localStorage.setItem('player_repeat', this.repeatMode);
    }

    getCurrentSong() {
        return this.currentSong;
    }

    getQueue() {
        return [...this.queue];
    }

    isCurrentlyPlaying() {
        return this.isPlaying;
    }

    getPlayerState() {
        return {
            currentSong: this.currentSong,
            isPlaying: this.isPlaying,
            currentTime: this.currentTime,
            duration: this.duration,
            volume: this.volume,
            isShuffled: this.isShuffled,
            repeatMode: this.repeatMode,
            queue: this.queue
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
    console.log('🎵 Player ready');
});

window.MusicPlayer = MusicPlayer;