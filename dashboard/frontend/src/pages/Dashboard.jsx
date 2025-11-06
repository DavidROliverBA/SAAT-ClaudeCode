import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, Cpu, Activity, Plus, Github, FolderOpen } from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    analyses: 0,
    agents: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, agentsRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/agents')
      ]);

      const projects = projectsRes.data.projects || [];
      const agents = agentsRes.data.agents || [];

      let totalAnalyses = 0;
      projects.forEach(project => {
        totalAnalyses += (project.analyses || []).length;
      });

      setStats({
        projects: projects.length,
        analyses: totalAnalyses,
        agents: agents.length
      });

      setRecentProjects(projects.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-description">
            Solution Architects Analysis Toolkit - Analyze, visualize, and optimize your architecture
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Link to="/projects" className="stat-card card-hover">
          <div className="stat-icon projects">
            <Folder size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.projects}</div>
            <div className="stat-label">Projects</div>
          </div>
        </Link>

        <div className="stat-card">
          <div className="stat-icon analyses">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.analyses}</div>
            <div className="stat-label">Analyses</div>
          </div>
        </div>

        <Link to="/agents" className="stat-card card-hover">
          <div className="stat-icon agents">
            <Cpu size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.agents}</div>
            <div className="stat-label">Available Agents</div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/projects?action=new-local" className="action-card card card-hover">
            <FolderOpen size={32} />
            <h3>Analyze Local Project</h3>
            <p>Point to a local folder to analyze your codebase</p>
          </Link>

          <Link to="/projects?action=new-github" className="action-card card card-hover">
            <Github size={32} />
            <h3>Clone from GitHub</h3>
            <p>Analyze a GitHub repository</p>
          </Link>

          <Link to="/agents" className="action-card card card-hover">
            <Cpu size={32} />
            <h3>Browse Agents</h3>
            <p>Explore all 11 SAAT agents</p>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Projects</h2>
            <Link to="/projects" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="projects-grid">
            {recentProjects.map(project => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="project-card card card-hover"
              >
                <div className="project-header">
                  <Folder size={20} />
                  <span className={`badge badge-${project.type === 'github' ? 'primary' : 'success'}`}>
                    {project.type}
                  </span>
                </div>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description || 'No description'}</p>
                <div className="project-stats">
                  <span>{project.files?.length || 0} files</span>
                  <span>{(project.analyses || []).length} analyses</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {stats.projects === 0 && (
        <div className="section">
          <div className="getting-started card">
            <h2>🚀 Getting Started with SAAT</h2>
            <p>Welcome to the SAAT Dashboard! Here's how to get started:</p>
            <ol>
              <li>
                <strong>Add a project:</strong> Point to a local folder or clone a GitHub repository
              </li>
              <li>
                <strong>Select an agent:</strong> Choose from 11 specialized analysis agents
              </li>
              <li>
                <strong>Run analysis:</strong> Execute agents to analyze your architecture
              </li>
              <li>
                <strong>View results:</strong> Visualize findings, gaps, and recommendations
              </li>
            </ol>
            <div className="cta-buttons">
              <Link to="/projects?action=new-local" className="btn btn-primary">
                <Plus size={20} />
                Add Your First Project
              </Link>
              <Link to="/agents" className="btn btn-secondary">
                Browse Agents
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
