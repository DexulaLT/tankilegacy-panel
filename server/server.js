const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'tanki-admin-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Mock data
let players = [
  { id: 1, username: 'Player1', rank: 'Generalissimo', status: 'Online', lastSeen: '2 mins ago', score: 15000 },
  { id: 2, username: 'TankMaster', rank: 'Major', status: 'Online', lastSeen: '1 min ago', score: 12000 },
  { id: 3, username: 'SniperPro', rank: 'Captain', status: 'Offline', lastSeen: '2 hours ago', score: 8000 },
  { id: 4, username: 'BattleKing', rank: 'Colonel', status: 'Online', lastSeen: '30 secs ago', score: 13500 },
  { id: 5, username: 'Warrior99', rank: 'Lieutenant', status: 'Offline', lastSeen: '1 day ago', score: 5000 }
];

let servers = [
  { id: 1, name: 'Main Server', status: 'Online', players: 45, uptime: '99.9%', ip: '127.0.0.1', port: 8080 },
  { id: 2, name: 'Battle Server 1', status: 'Online', players: 23, uptime: '99.8%', ip: '127.0.0.1', port: 8081 },
  { id: 3, name: 'Battle Server 2', status: 'Online', players: 31, uptime: '99.7%', ip: '127.0.0.1', port: 8082 }
];

let battles = [
  { id: 'B001', map: 'Sandbox', players: '8/16', mode: 'DM', status: 'Active', duration: '12:34', startTime: Date.now() - 754000 },
  { id: 'B002', map: 'Monte', players: '12/16', mode: 'CTF', status: 'Active', duration: '08:45', startTime: Date.now() - 525000 },
  { id: 'B003', map: 'Rio', players: '6/16', mode: 'TDM', status: 'Active', duration: '15:22', startTime: Date.now() - 922000 }
];

let resources = [
  { id: 1, name: 'Hammer Weapon', type: 'Weapon', status: 'Active', version: '1.0', size: '2.5MB' },
  { id: 2, name: 'Isida Weapon', type: 'Weapon', status: 'Active', version: '1.0', size: '2.3MB' },
  { id: 3, name: 'Sandbox Map', type: 'Map', status: 'Active', version: '1.2', size: '15.7MB' },
  { id: 4, name: 'Monte Map', type: 'Map', status: 'Active', version: '1.1', size: '18.2MB' }
];

let settings = {
  serverName: 'Tanki Legacy Server',
  maxPlayers: 100,
  serverPort: 8080,
  enableAnticheat: true,
  enableLogging: true
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication for demo
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username, role: 'admin' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    onlinePlayers: players.filter(p => p.status === 'Online').length,
    activeServers: servers.filter(s => s.status === 'Online').length,
    activeBattles: battles.filter(b => b.status === 'Active').length,
    serverUptime: '99.8%',
    totalPlayers: players.length,
    totalServers: servers.length
  };
  res.json(stats);
});

// Players routes
app.get('/api/players', authenticateToken, (req, res) => {
  res.json(players);
});

app.get('/api/players/:id', authenticateToken, (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

app.post('/api/players', authenticateToken, (req, res) => {
  const newPlayer = {
    id: Math.max(...players.map(p => p.id)) + 1,
    ...req.body,
    lastSeen: 'Just now'
  };
  players.push(newPlayer);
  res.json(newPlayer);
});

app.put('/api/players/:id', authenticateToken, (req, res) => {
  const index = players.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    players[index] = { ...players[index], ...req.body };
    res.json(players[index]);
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

app.delete('/api/players/:id', authenticateToken, (req, res) => {
  const index = players.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    players.splice(index, 1);
    res.json({ message: 'Player deleted' });
  } else {
    res.status(404).json({ error: 'Player not found' });
  }
});

// Servers routes
app.get('/api/servers', authenticateToken, (req, res) => {
  res.json(servers);
});

app.get('/api/servers/:id', authenticateToken, (req, res) => {
  const server = servers.find(s => s.id === parseInt(req.params.id));
  if (server) {
    res.json(server);
  } else {
    res.status(404).json({ error: 'Server not found' });
  }
});

app.put('/api/servers/:id', authenticateToken, (req, res) => {
  const index = servers.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    servers[index] = { ...servers[index], ...req.body };
    res.json(servers[index]);
  } else {
    res.status(404).json({ error: 'Server not found' });
  }
});

// Battles routes
app.get('/api/battles', authenticateToken, (req, res) => {
  res.json(battles);
});

app.get('/api/battles/:id', authenticateToken, (req, res) => {
  const battle = battles.find(b => b.id === req.params.id);
  if (battle) {
    res.json(battle);
  } else {
    res.status(404).json({ error: 'Battle not found' });
  }
});

app.post('/api/battles', authenticateToken, (req, res) => {
  const newBattle = {
    id: `B${String(battles.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'Active',
    startTime: Date.now()
  };
  battles.push(newBattle);
  res.json(newBattle);
});

app.put('/api/battles/:id', authenticateToken, (req, res) => {
  const index = battles.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    battles[index] = { ...battles[index], ...req.body };
    res.json(battles[index]);
  } else {
    res.status(404).json({ error: 'Battle not found' });
  }
});

app.delete('/api/battles/:id', authenticateToken, (req, res) => {
  const index = battles.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    battles.splice(index, 1);
    res.json({ message: 'Battle ended' });
  } else {
    res.status(404).json({ error: 'Battle not found' });
  }
});

// Resources routes
app.get('/api/resources', authenticateToken, (req, res) => {
  res.json(resources);
});

app.get('/api/resources/:id', authenticateToken, (req, res) => {
  const resource = resources.find(r => r.id === parseInt(req.params.id));
  if (resource) {
    res.json(resource);
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

app.post('/api/resources', authenticateToken, (req, res) => {
  const newResource = {
    id: Math.max(...resources.map(r => r.id)) + 1,
    ...req.body
  };
  resources.push(newResource);
  res.json(newResource);
});

app.put('/api/resources/:id', authenticateToken, (req, res) => {
  const index = resources.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    resources[index] = { ...resources[index], ...req.body };
    res.json(resources[index]);
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Settings routes
app.get('/api/settings', authenticateToken, (req, res) => {
  res.json(settings);
});

app.put('/api/settings', authenticateToken, (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Activity log
app.get('/api/activity', authenticateToken, (req, res) => {
  const activities = [
    { id: 1, message: 'Player "TankMaster" joined battle B002', timestamp: Date.now() - 300000 },
    { id: 2, message: 'Server "Main Server" restarted successfully', timestamp: Date.now() - 600000 },
    { id: 3, message: 'New resource "Winter Map" added', timestamp: Date.now() - 900000 },
    { id: 4, message: 'Player "Player1" achieved new rank', timestamp: Date.now() - 1200000 }
  ];
  res.json(activities);
});

// Start server
app.listen(PORT, () => {
  console.log(`Tanki Admin Panel Server running on port ${PORT}`);
  console.log(`Access the admin panel at: http://localhost:${PORT}`);
});
