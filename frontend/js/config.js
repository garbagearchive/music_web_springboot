// config.js

const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:9188/api',

    STORAGE_KEYS: {
        USER: 'music_app_user',
        THEME: 'music_app_theme',
        VOLUME: 'music_app_volume',
        QUEUE: 'music_app_queue',
        CURRENT_SONG: 'music_app_current_song',
        SHUFFLE: 'music_app_shuffle',
        REPEAT: 'music_app_repeat',
        FAVORITES: 'music_app_favorites'
    },

    DEFAULTS: {
        VOLUME: 0.5,
        THEME: 'dark',
        REPEAT_MODE: 'none',
        SHUFFLE: false
    },

    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            FORGOT_PASSWORD: '/auth/forgot-password'
        },
        SONGS: '/songs',
        ARTISTS: '/artists',
        ALBUMS: '/albums',
        GENRES: '/genres',
        PLAYLISTS: '/playlists',
        PLAYLIST_SONGS: '/playlist-songs',
        FAVORITES: '/favorites',
        USER_FAVORITES: '/user-favorites',
        PLAY_HISTORY: '/play-history',
        LYRICS: '/lyrics',
        SYNCED_LYRICS: '/synced-lyrics',
        USERS: '/users',
        ADMIN: {
            USERS: '/admin/users',
            STATS: '/admin/stats',
            LOGS: '/admin/logs'
        }
    },

    UI: {
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        SEARCH_MIN_LENGTH: 1
    },

    AUDIO: {
        CROSSFADE_DURATION: 3000,
        SEEK_STEP: 10,
        VOLUME_STEP: 0.1
    },

    CORS: {
        ALLOWED_ORIGINS: [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://127.0.0.1:3000',
            'http://localhost:3000'
        ]
    },

    ADMIN: {
        ROLE: 'admin',
        FEATURES: ['manage_users', 'view_stats', 'edit_content']
    }
};

const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error getting ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            if (value === undefined) {
                this.remove(key); // Avoid storing undefined
                return true;
            }
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} in localStorage:`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

const checkCORS = async () => {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/health`, {
            method: 'GET',
            mode: 'cors'
        });
        console.log('✅ CORS is working properly');
        return true;
    } catch (error) {
        console.error('❌ CORS Error:', error.message);
        console.log('💡 Make sure your backend server allows requests from:', window.location.origin);
        return false;
    }
};

window.CONFIG = CONFIG;
window.Storage = Storage;
window.checkCORS = checkCORS;