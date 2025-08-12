// auth.js

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        const savedUser = Storage.get(CONFIG.STORAGE_KEYS.USER);
        if (savedUser) {
            this.currentUser = savedUser;
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('loginUsername').value;
                const password = document.getElementById('loginPassword').value;
                await this.login(username, password);
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('registerUsername').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                await this.register(username, email, password);
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.matches('#logoutBtn')) {
                this.logout();
            }
        });
    }

    async login(username, password) {
        try {
            const response = await window.apiService.request(CONFIG.ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            this.currentUser = response.user;
            Storage.set(CONFIG.STORAGE_KEYS.USER, this.currentUser);
            document.dispatchEvent(new CustomEvent('user-login', { detail: { user: this.currentUser } }));
            Utils.showToast('Login successful', 'success');
        } catch (error) {
            Utils.showToast('Login failed: ' + error.message, 'error');
        }
    }

    async register(username, email, password) {
        try {
            const response = await window.apiService.request(CONFIG.ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            this.currentUser = response.user;
            Storage.set(CONFIG.STORAGE_KEYS.USER, this.currentUser);
            document.dispatchEvent(new CustomEvent('user-login', { detail: { user: this.currentUser } }));
            Utils.showToast('Registration successful', 'success');
        } catch (error) {
            Utils.showToast('Registration failed: ' + error.message, 'error');
        }
    }
    
    logout() {
        this.currentUser = null;
        Storage.remove(CONFIG.STORAGE_KEYS.USER);
        document.dispatchEvent(new CustomEvent('user-logout'));
        Utils.showToast('Logged out', 'info');
    }

    getCurrentUserId() {
        return this.currentUser?.id;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    canEditPlaylist(playlist) {
        return this.currentUser && (playlist.user.id === this.currentUser.id || this.isAdmin());
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function handleForgotPassword() {
    // Implement forgot password logic here (e.g., show modal or API call)
    Utils.showToast('Forgot password functionality coming soon!', 'info');
}