// Main application module
class AdminApp {
  constructor() {
    this.currentSection = 'overview';
    this.data = {
      players: [],
      servers: [],
      battles: [],
      resources: []
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadInitialData();
    this.startRealTimeUpdates();
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
      item.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });

    // Search functionality
    document.getElementById('player-search')?.addEventListener('input', (e) => {
      this.filterPlayers(e.target.value);
    });

    // Settings save
    document.querySelector('[onclick="saveSettings()"]')?.addEventListener('click', () => {
      this.saveSettings();
    });
  }

  switchSection(section) {
    // Update active menu item
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(`${section}-section`).classList.remove('hidden');

    // Update section title
    const titles = {
      overview: 'Dashboard Overview',
      players: 'Player Management',
      servers: 'Server Management',
      resources: 'Resource Management',
      battles: 'Battle Management',
      settings: 'Server Settings'
    };
    document.getElementById('section-title').textContent = titles[section];

    this.currentSection = section;
    this.loadSectionData(section);
  }

  async loadInitialData() {
    // Simulate loading data
    this.data.players = await this.fetchPlayers();
    this.data.servers = await this.fetchServers();
    this.data.battles = await this.fetchBattles();
    this.data.resources = await this.fetchResources();
    
    this.updateDashboard();
    this.renderPlayersTable();
    this.renderServersGrid();
    this.renderBattlesTable();
    this.renderResourcesGrid();
  }

  async fetchPlayers() {
    // Mock data - replace with actual API calls
    return [
      { id: 1, username: 'Player1', rank: 'Generalissimo', status: 'Online', lastSeen: '2 mins ago' },
      { id: 2, username: 'TankMaster', rank: 'Major', status: 'Online', lastSeen: '1 min ago' },
      { id: 3, username: 'SniperPro', rank: 'Captain', status: 'Offline', lastSeen: '2 hours ago' },
      { id: 4, username: 'BattleKing', rank: 'Colonel', status: 'Online', lastSeen: '30 secs ago' },
      { id: 5, username: 'Warrior99', rank: 'Lieutenant', status: 'Offline', lastSeen: '1 day ago' }
    ];
  }

  async fetchServers() {
    return [
      { id: 1, name: 'Main Server', status: 'Online', players: 45, uptime: '99.9%' },
      { id: 2, name: 'Battle Server 1', status: 'Online', players: 23, uptime: '99.8%' },
      { id: 3, name: 'Battle Server 2', status: 'Online', players: 31, uptime: '99.7%' }
    ];
  }

  async fetchBattles() {
    return [
      { id: 'B001', map: 'Sandbox', players: '8/16', mode: 'DM', status: 'Active', duration: '12:34' },
      { id: 'B002', map: 'Monte', players: '12/16', mode: 'CTF', status: 'Active', duration: '08:45' },
      { id: 'B003', map: 'Rio', players: '6/16', mode: 'TDM', status: 'Active', duration: '15:22' }
    ];
  }

  async fetchResources() {
    return [
      { id: 1, name: 'Hammer Weapon', type: 'Weapon', status: 'Active', version: '1.0' },
      { id: 2, name: 'Isida Weapon', type: 'Weapon', status: 'Active', version: '1.0' },
      { id: 3, name: 'Sandbox Map', type: 'Map', status: 'Active', version: '1.2' }
    ];
  }

  updateDashboard() {
    // Update stats
    document.getElementById('online-players').textContent = this.data.players.filter(p => p.status === 'Online').length;
    document.getElementById('active-servers').textContent = this.data.servers.filter(s => s.status === 'Online').length;
    document.getElementById('active-battles').textContent = this.data.battles.filter(b => b.status === 'Active').length;
    document.getElementById('server-uptime').textContent = '99.8%';

    // Update activity log
    const activityLog = document.getElementById('activity-log');
    if (activityLog) {
      activityLog.innerHTML = `
        <div>Player 'TankMaster' joined battle B002</div>
        <div>Server 'Main Server' restarted successfully</div>
        <div>New resource 'Winter Map' added</div>
        <div>Player 'Player1' achieved new rank</div>
      `;
    }
  }

  renderPlayersTable() {
    const tbody = document.getElementById('players-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.data.players.map(player => `
      <tr>
        <td>${player.id}</td>
        <td>${player.username}</td>
        <td>${player.rank}</td>
        <td><span class="status ${player.status.toLowerCase()}">${player.status}</span></td>
        <td>${player.lastSeen}</td>
        <td>
          <button onclick="viewPlayer(${player.id})" class="btn-action">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="editPlayer(${player.id})" class="btn-action">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deletePlayer(${player.id})" class="btn-action btn-danger">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderServersGrid() {
    const container = document.getElementById('servers-grid');
    if (!container) return;

    container.innerHTML = this.data.servers.map(server => `
      <div class="server-card">
        <h3>${server.name}</h3>
        <p>Status: <span class="status ${server.status.toLowerCase()}">${server.status}</span></p>
        <p>Players: ${server.players}</p>
        <p>Uptime: ${server.uptime}</p>
        <button onclick="manageServer(${server.id})" class="btn-primary">Manage</button>
      </div>
    `).join('');
  }

  renderBattlesTable() {
    const tbody = document.getElementById('battles-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.data.battles.map(battle => `
      <tr>
        <td>${battle.id}</td>
        <td>${battle.map}</td>
        <td>${battle.players}</td>
        <td>${battle.mode}</td>
        <td><span class="status ${battle.status.toLowerCase()}">${battle.status}</span></td>
        <td>${battle.duration}</td>
        <td>
          <button onclick="viewBattle('${battle.id}')" class="btn-action">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="endBattle('${battle.id}')" class="btn-action btn-danger">
            <i class="fas fa-stop"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderResourcesGrid() {
    const container = document.getElementById('resources-list');
    if (!container) return;

    container.innerHTML = this.data.resources.map(resource => `
      <div class="resource-card">
        <h3>${resource.name}</h3>
        <p>Type: ${resource.type}</p>
        <p>Status: <span class="status ${resource.status.toLowerCase()}">${resource.status}</span></p>
        <p>Version: ${resource.version}</p>
        <button onclick="editResource(${resource.id})" class="btn-primary">Edit</button>
      </div>
    `).join('');
  }

  filterPlayers(searchTerm) {
    const filtered = this.data.players.filter(player => 
      player.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('players-tbody');
    if (tbody) {
      tbody.innerHTML = filtered.map(player => `
        <tr>
          <td>${player.id}</td>
          <td>${player.username}</td>
          <td>${player.rank}</td>
          <td><span class="status ${player.status.toLowerCase()}">${player.status}</span></td>
          <td>${player.lastSeen}</td>
          <td>
            <button onclick="viewPlayer(${player.id})" class="btn-action">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="editPlayer(${player.id})" class="btn-action">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deletePlayer(${player.id})" class="btn-action btn-danger">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  saveSettings() {
    const settings = {
      serverName: document.getElementById('server-name').value,
      maxPlayers: document.getElementById('max-players').value,
      serverPort: document.getElementById('server-port').value,
      enableAnticheat: document.getElementById('enable-anticheat').checked,
      enableLogging: document.getElementById('enable-logging').checked
    };

    // Save settings (in production, send to server)
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  }

  startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateDashboard();
    }, 5000);
  }

  loadSectionData(section) {
    // Load specific data for each section
    switch(section) {
      case 'players':
        this.renderPlayersTable();
        break;
      case 'servers':
        this.renderServersGrid();
        break;
      case 'battles':
        this.renderBattlesTable();
        break;
      case 'resources':
        this.renderResourcesGrid();
        break;
    }
  }
}

// Global functions for button clicks
function viewPlayer(id) {
  alert(`Viewing player ${id}`);
}

function editPlayer(id) {
  alert(`Editing player ${id}`);
}

function deletePlayer(id) {
  if (confirm(`Are you sure you want to delete player ${id}?`)) {
    alert(`Player ${id} deleted`);
  }
}

function viewBattle(id) {
  alert(`Viewing battle ${id}`);
}

function endBattle(id) {
  if (confirm(`Are you sure you want to end battle ${id}?`)) {
    alert(`Battle ${id} ended`);
  }
}

function manageServer(id) {
  alert(`Managing server ${id}`);
}

function editResource(id) {
  alert(`Editing resource ${id}`);
}

function refreshServers() {
  adminApp.loadSectionData('servers');
}

function loadResources() {
  adminApp.loadSectionData('resources');
}

function loadBattles() {
  adminApp.loadSectionData('battles');
}

// Initialize app
const adminApp = new AdminApp();

// Switch to overview section by default
document.addEventListener('DOMContentLoaded', () => {
  if (authManager.isAuthenticated) {
    adminApp.switchSection('overview');
  }
});
