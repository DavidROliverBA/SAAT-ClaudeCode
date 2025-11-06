# SAAT Dashboard - Web Interface

A modern, real-time web dashboard for the Solution Architects Analysis Toolkit (SAAT).

![SAAT Dashboard](https://img.shields.io/badge/Status-Beta-yellow)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)

## 🎯 Features

### Project Management
- ✅ **Local Folder Analysis** - Point to any local project directory
- ✅ **GitHub Integration** - Clone and analyze GitHub repositories
- ✅ **Project Browser** - View all projects with search and filtering
- ✅ **File Detection** - Automatic detection of architecture files

### Agent Execution
- ✅ **11 SAAT Agents** - Run any SAAT agent from the UI
- ✅ **Real-time Progress** - WebSocket-based live updates
- ✅ **Agent Library** - Browse and learn about each agent
- ✅ **Configuration** - Customize agent parameters

### Results Visualization
- ✅ **Analysis Dashboard** - View analysis results
- ✅ **Statistics** - Track projects, analyses, and agents
- ✅ **History** - Access past analysis runs
- ⏳ **Charts & Graphs** - Visualize architecture scores (coming soon)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (backend)
- **npm** or **yarn**
- **SAAT agents** installed (`bash scripts/install.sh`)

### Installation

```bash
# Clone repository (if not already)
cd SAAT-ClaudeCode/dashboard

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Dashboard

#### Option 1: Development Mode (Recommended)

Open **two terminals**:

**Terminal 1 - Backend:**
```bash
cd dashboard/backend
cp .env.example .env
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd dashboard/frontend
npm run dev
```

Dashboard will be available at: **http://localhost:3000**

API server runs on: **http://localhost:3001**

#### Option 2: Production Build

```bash
# Build frontend
cd dashboard/frontend
npm run build

# Serve from backend (optional)
cd ../backend
npm start

# Or use a static server
npx serve frontend/dist
```

---

## 📁 Project Structure

```
dashboard/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── server.js       # Main server
│   │   └── routes/
│   │       ├── agents.js   # Agent management
│   │       ├── projects.js # Project management
│   │       ├── github.js   # GitHub integration
│   │       └── analysis.js # Analysis results
│   ├── workspace/          # Cloned repositories
│   ├── logs/               # Application logs
│   └── package.json
│
├── frontend/               # React web app
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx  # Main layout with sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Home page
│   │   │   ├── Projects.jsx     # Project management
│   │   │   ├── Agents.jsx       # Agent browser
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── WebSocketContext.jsx  # Real-time updates
│   │   ├── App.jsx         # Router setup
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── shared/                 # Shared types/utilities
```

---

## 🎨 User Interface

### Dashboard Page

The main dashboard shows:
- **Statistics**: Project count, analysis count, available agents
- **Quick Actions**: Add local project, clone from GitHub, browse agents
- **Recent Projects**: Last 5 projects worked on
- **Getting Started Guide**: For new users

### Projects Page

Manage all your projects:
- **Add Local Project**: Browse to folder containing code
- **Clone GitHub Repo**: Enter repository URL
- **Search**: Filter projects by name or description
- **Project Cards**: View files, analyses, branches (for GitHub)

### Agents Page

Browse all 11 SAAT agents:
- **saat-orchestrator**: AI architecture consultant
- **saat-discover**: Analyze existing codebases
- **saat-requirements**: Extract requirements
- **saat-generate**: Create C4 models
- **saat-validate**: Validate architecture
- **saat-analyze-characteristics**: Evaluate quality
- **saat-security**: Security audit
- **saat-document**: Generate docs
- **saat-terraform**: Generate infrastructure
- **saat-full-pipeline**: Run complete workflow
- **saat-help**: Interactive help

### Project Detail Page (Coming Soon)

For each project:
- View file tree
- See project metadata
- Run agents on this project
- View analysis history

---

## 🔌 API Reference

### Projects

```bash
# Get all projects
GET /api/projects

# Get project by ID
GET /api/projects/:projectId

# Create local project
POST /api/projects/local
Body: { name, path, description }

# Update project
PATCH /api/projects/:projectId
Body: { name?, description? }

# Delete project
DELETE /api/projects/:projectId

# Rescan project files
POST /api/projects/:projectId/scan
```

### GitHub

```bash
# Clone repository
POST /api/github/clone
Body: { repoUrl, name?, branch?, description? }

# Pull latest changes
POST /api/github/:projectId/pull

# Switch branch
POST /api/github/:projectId/checkout
Body: { branch }

# Get commits
GET /api/github/:projectId/commits?limit=50
```

### Agents

```bash
# Get all agents
GET /api/agents

# Get agent details
GET /api/agents/:agentId

# Execute agent
POST /api/agents/:agentId/execute
Body: { projectPath, prompt, config }
```

### Analysis

```bash
# Get project analyses
GET /api/analysis/project/:projectId

# Get specific analysis
GET /api/analysis/:analysisId

# Create analysis
POST /api/analysis
Body: { projectId, agentId, name?, config? }

# Update analysis
PATCH /api/analysis/:analysisId
Body: { status?, results?, error? }

# Delete analysis
DELETE /api/analysis/:analysisId
```

---

## 🔄 WebSocket Events

The dashboard uses WebSockets for real-time updates:

### Client → Server

```javascript
// Connect (automatic)
ws.send(JSON.stringify({
  type: 'subscribe',
  projectId: 'project-id'
}));
```

### Server → Client

```javascript
// Connection established
{
  type: 'connected',
  message: 'SAAT Dashboard connected'
}

// GitHub clone started
{
  type: 'clone_started',
  projectId: 'uuid',
  repoUrl: 'https://...',
  timestamp: '2025-11-06T...'
}

// Clone completed
{
  type: 'clone_completed',
  projectId: 'uuid',
  project: { ... },
  timestamp: '2025-11-06T...'
}

// Agent started
{
  type: 'agent_started',
  agentId: 'saat-discover',
  projectPath: '/path/to/project',
  timestamp: '2025-11-06T...'
}

// Agent progress
{
  type: 'agent_progress',
  agentId: 'saat-discover',
  step: 2,
  message: 'Analyzing project...',
  progress: 30,
  timestamp: '2025-11-06T...'
}

// Agent completed
{
  type: 'agent_completed',
  agentId: 'saat-discover',
  result: { ... },
  timestamp: '2025-11-06T...'
}
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```bash
# Server
PORT=3001
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Claude API (optional - for direct agent execution)
ANTHROPIC_API_KEY=your_api_key_here

# Workspace
WORKSPACE_DIR=./workspace

# Security
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Edit `frontend/vite.config.js` to customize:
- Port (default: 3000)
- Proxy settings
- Build options

---

## 🐳 Docker Deployment

### Build Docker Images

```bash
# Backend
cd dashboard/backend
docker build -t saat-dashboard-backend .

# Frontend
cd dashboard/frontend
docker build -t saat-dashboard-frontend .
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    image: saat-dashboard-backend
    ports:
      - "3001:3001"
    volumes:
      - ./workspace:/app/workspace
      - ../../agents:/app/agents:ro
    environment:
      - NODE_ENV=production
      - PORT=3001

  frontend:
    image: saat-dashboard-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

Run with: `docker-compose up`

---

## 🛠️ Development

### Adding New Features

1. **Backend Route**: Add to `backend/src/routes/`
2. **Frontend Page**: Add to `frontend/src/pages/`
3. **Update Router**: Add route in `frontend/src/App.jsx`

### Code Style

```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Backend won't start

**Problem**: `Error: Cannot find module 'express'`

**Solution**:
```bash
cd dashboard/backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't connect to backend

**Problem**: `Network Error` in browser console

**Solution**:
1. Check backend is running: `curl http://localhost:3001/health`
2. Verify proxy in `frontend/vite.config.js`
3. Check CORS settings in `backend/src/server.js`

### WebSocket disconnects frequently

**Problem**: `WebSocket disconnected` in console

**Solution**:
1. Check firewall settings
2. Ensure backend WebSocket server is running
3. Verify port 3001 is not blocked

### Cloning GitHub repo fails

**Problem**: `Authentication failed`

**Solution**:
- For private repos, use HTTPS with personal access token:
  ```
  https://username:token@github.com/user/repo.git
  ```
- Or set up SSH keys

---

## 📈 Roadmap

### Phase 4.1 (Current)
- ✅ Basic dashboard UI
- ✅ Project management
- ✅ Agent browser
- ⏳ Agent execution interface

### Phase 4.2 (Next)
- ⏳ Results visualization (charts, graphs)
- ⏳ Project detail page (file explorer, agent runner)
- ⏳ Analysis history with filtering
- ⏳ Export analysis results (JSON, PDF)

### Phase 4.3 (Future)
- ⏳ User authentication
- ⏳ Team collaboration
- ⏳ Analysis comparison
- ⏳ Custom agent configurations
- ⏳ Scheduled analysis runs

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Areas Needing Help

- **Results Visualization**: Charts for architecture scores
- **Agent Execution**: Better progress tracking
- **File Explorer**: Tree view for projects
- **Export**: PDF/HTML report generation
- **Tests**: Unit and integration tests

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

## 🔗 Links

- [SAAT Main Documentation](../../README.md)
- [SAAT Agents Guide](../../AGENTS_GUIDE.md)
- [Reference Projects](../../reference-projects/)
- [GitHub Repository](https://github.com/DavidROliverBA/SAAT-ClaudeCode)

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/DavidROliverBA/SAAT-ClaudeCode/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DavidROliverBA/SAAT-ClaudeCode/discussions)

---

**Built with ❤️ by the SAAT Team**
