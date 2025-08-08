// Authentication module
class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.init();
  }

  init() {
    this.checkAuthStatus();
    this.bindEvents();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('adminToken');
    if (token) {
      this.isAuthenticated = true;
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  bindEvents() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication for demo - in production, use proper API
    if (username === 'admin' && password === 'admin123') {
      this.isAuthenticated = true;
      this.currentUser = { username: 'admin', role: 'admin' };
      localStorage.setItem('adminToken', 'demo-token-' + Date.now());
      this.showDashboard();
    } else {
      alert('Invalid credentials. Use admin/admin123');
    }
  }

  handleLogout() {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem('adminToken');
    this.showLogin();
  }

  showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
  }

  showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('username-display').textContent = this.currentUser?.username || 'Admin';
  }
}

// Initialize auth manager
const authManager = new AuthManager();
