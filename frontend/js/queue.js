// queue.js

class QueueManager {
    constructor() {
        this.queue = [];
        this.originalQueue = [];
        this.currentIndex = -1;
        this.history = [];
        this.isShuffled = false;
        this.repeatMode = 'off';
        this.maxHistorySize = 50;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedQueue();
        console.log('🎵 Queue Manager initialized');
    }

    setupEventListeners() {
        document.addEventListener('song-ended', () => {
            this.handleSongEnd();
        });

        document.addEventListener('queue-updated', (e) => {
            this.saveQueue();
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.queue-item')) {
                const index = parseInt(e.target.closest('.queue-item').dataset.index);
                this.playFromQueue(index);
            }
        });
    }

    setQueue(songs, startIndex = 0) {
        this.queue = [...songs];
        this.originalQueue = [...songs];
        this.currentIndex = startIndex;
        this.history = [];
        
        if (this.isShuffled) {
            this.shuffleQueue(false);
        }
        
        this.updateUI();
        this.dispatchQueueEvent('queue-set', { 
            queue: this.queue, 
            currentIndex: this.currentIndex 
        });
    }

    addToQueue(song, position = 'end') {
        if (position === 'end') {
            this.queue.push(song);
            this.originalQueue.push(song);
        } else if (position === 'next') {
            const insertIndex = this.currentIndex + 1;
            this.queue.splice(insertIndex, 0, song);
            this.originalQueue.splice(insertIndex, 0, song);
        } else if (typeof position === 'number') {
            this.queue.splice(position, 0, song);
            this.originalQueue.splice(position, 0, song);
            if (position <= this.currentIndex) {
                this.currentIndex++;
            }
        }
        
        this.updateUI();
        this.dispatchQueueEvent('song-added', { song, position });
        this.showNotification(`Added "${song.title}" to queue`);
    }

    addMultipleToQueue(songs, position = 'end') {
        songs.forEach((song, index) => {
            if (position === 'end') {
                this.queue.push(song);
                this.originalQueue.push(song);
            } else if (position === 'next') {
                const insertIndex = this.currentIndex + 1 + index;
                this.queue.splice(insertIndex, 0, song);
                this.originalQueue.splice(insertIndex, 0, song);
            }
        });
        
        this.updateUI();
        this.dispatchQueueEvent('songs-added', { songs, position });
        this.showNotification(`Added ${songs.length} songs to queue`);
    }

    removeFromQueue(index) {
        if (index < 0 || index >= this.queue.length) return;
        
        const removedSong = this.queue.splice(index, 1)[0];
        const originalIndex = this.originalQueue.indexOf(removedSong);
        if (originalIndex !== -1) {
            this.originalQueue.splice(originalIndex, 1);
        }
        
        if (index < this.currentIndex) {
            this.currentIndex--;
        } else if (index === this.currentIndex) {
            if (this.currentIndex >= this.queue.length) {
                this.currentIndex = this.queue.length - 1;
            }
        }
        
        this.updateUI();
        this.dispatchQueueEvent('song-removed', { removedSong, index });
        this.showNotification(`Removed "${removedSong.title}" from queue`);
    }

    moveInQueue(fromIndex, toIndex) {
        if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= this.queue.length || toIndex < 0 || toIndex >= this.queue.length) return;
        
        const [song] = this.queue.splice(fromIndex, 1);
        this.queue.splice(toIndex, 0, song);
        
        if (this.isShuffled) {
            const originalFrom = this.originalQueue.indexOf(song);
            if (originalFrom !== -1) {
                this.originalQueue.splice(originalFrom, 1);
                this.originalQueue.splice(toIndex, 0, song);
            }
        }
        
        if (fromIndex === this.currentIndex) {
            this.currentIndex = toIndex;
        } else if (fromIndex < this.currentIndex && toIndex >= this.currentIndex) {
            this.currentIndex--;
        } else if (fromIndex > this.currentIndex && toIndex <= this.currentIndex) {
            this.currentIndex++;
        }
        
        this.updateUI();
        this.dispatchQueueEvent('queue-reordered', { fromIndex, toIndex });
    }

    clearQueue() {
        this.queue = [];
        this.originalQueue = [];
        this.currentIndex = -1;
        this.history = [];
        this.updateUI();
        this.dispatchQueueEvent('queue-cleared');
        this.showNotification('Queue cleared');
    }

    shuffleQueue() {
        if (this.isShuffled) return;
        
        this.isShuffled = true;
        this.originalQueue = [...this.queue];
        
        let currentSong = this.queue[this.currentIndex];
        this.queue.splice(this.currentIndex, 1);
        
        this.queue = Utils.shuffleArray(this.queue);
        this.queue.unshift(currentSong);
        this.currentIndex = 0;
        
        this.updateUI();
        this.dispatchQueueEvent('queue-shuffled');
        this.showNotification('Queue shuffled');
    }

    unshuffleQueue() {
        if (!this.isShuffled) return;
        
        this.isShuffled = false;
        this.queue = [...this.originalQueue];
        
        const currentSong = this.queue.findIndex(song => song.id === this.currentSong.id);
        if (currentSong !== -1) {
            this.currentIndex = currentSong;
        }
        
        this.updateUI();
        this.dispatchQueueEvent('queue-unshuffled');
        this.showNotification('Queue unshuffled');
    }

    toggleShuffle() {
        if (this.isShuffled) {
            this.unshuffleQueue();
        } else {
            this.shuffleQueue();
        }
    }

    setRepeatMode(mode) {
        if (['off', 'all', 'one'].includes(mode)) {
            this.repeatMode = mode;
            this.updateUI();
            this.dispatchQueueEvent('repeat-mode-changed', { mode });
            this.showNotification(`Repeat mode set to ${mode}`);
        }
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        this.setRepeatMode(nextMode);
    }

    playFromQueue(index) {
        if (index < 0 || index >= this.queue.length) return;
        
        this.addToHistory(this.currentIndex);
        this.currentIndex = index;
        window.player.playSong(this.queue[this.currentIndex]);
        this.updateUI();
        this.dispatchQueueEvent('queue-play-index', { index });
    }

    handleSongEnd() {
        this.addToHistory(this.currentIndex);
        
        switch (this.repeatMode) {
            case 'one':
                window.player.playSong(this.queue[this.currentIndex]);
                break;
            case 'all':
                this.currentIndex = (this.currentIndex + 1) % this.queue.length;
                window.player.playSong(this.queue[this.currentIndex]);
                break;
            default: // 'off'
                if (this.currentIndex < this.queue.length - 1) {
                    this.currentIndex++;
                    window.player.playSong(this.queue[this.currentIndex]);
                } else {
                    window.player.stop();
                }
                break;
        }
        
        this.updateUI();
    }

    addToHistory(index) {
        if (index >= 0 && index < this.queue.length) {
            this.history.push(this.queue[index]);
            if (this.history.length > this.maxHistorySize) {
                this.history.shift();
            }
        }
    }

    updateUI() {
        // Implementation for updating queue UI
    }

    saveQueue() {
        try {
            const queueData = {
                queue: this.queue,
                originalQueue: this.originalQueue,
                currentIndex: this.currentIndex,
                history: this.history.slice(-10),
                isShuffled: this.isShuffled,
                repeatMode: this.repeatMode,
                timestamp: Date.now()
            };
            
            localStorage.setItem('musicQueue', JSON.stringify(queueData));
        } catch (error) {
            console.error('Failed to save queue:', error);
        }
    }

    loadSavedQueue() {
        try {
            const savedQueue = localStorage.getItem('musicQueue');
            if (!savedQueue) return;
            
            const queueData = JSON.parse(savedQueue);
            
            const isRecent = Date.now() - queueData.timestamp < 24 * 60 * 60 * 1000;
            if (!isRecent) return;
            
            this.queue = queueData.queue || [];
            this.originalQueue = queueData.originalQueue || [...this.queue];
            this.currentIndex = queueData.currentIndex || -1;
            this.history = queueData.history || [];
            this.isShuffled = queueData.isShuffled || false;
            this.repeatMode = queueData.repeatMode || 'off';
            
            this.updateUI();
            console.log('📻 Restored saved queue with', this.queue.length, 'songs');
            
        } catch (error) {
            console.error('Failed to load saved queue:', error);
            localStorage.removeItem('musicQueue');
        }
    }

    searchQueue(query) {
        if (!query) return this.queue;
        
        const searchTerm = query.toLowerCase();
        return this.queue.filter((song, index) => {
            const matchesTitle = song.title.toLowerCase().includes(searchTerm);
            const matchesArtist = song.artist?.name?.toLowerCase().includes(searchTerm);
            const matchesAlbum = song.album?.title?.toLowerCase().includes(searchTerm);
            
            return matchesTitle || matchesArtist || matchesAlbum;
        }).map(song => ({
            ...song,
            queueIndex: this.queue.indexOf(song)
        }));
    }

    getQueueStats() {
        const totalDuration = this.queue.reduce((total, song) => total + (song.duration || 0), 0);
        const artists = new Set(this.queue.map(song => song.artist?.name).filter(Boolean));
        const albums = new Set(this.queue.map(song => song.album?.title).filter(Boolean));
        
        return {
            totalSongs: this.queue.length,
            totalDuration: totalDuration,
            totalDurationFormatted: Utils.formatDuration(totalDuration),
            uniqueArtists: artists.size,
            uniqueAlbums: albums.size,
            currentPosition: this.currentIndex + 1,
            remainingSongs: this.queue.length - this.currentIndex - 1
        };
    }

    dispatchQueueEvent(eventType, data = {}) {
        const event = new CustomEvent(eventType, {
            detail: { ...data, queueManager: this },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    showNotification(message, type = 'info') {
        Utils.showToast(message, type);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.queueManager = new QueueManager();
});