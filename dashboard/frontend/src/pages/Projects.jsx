import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Folder, Github, Plus, X, FolderOpen, Search } from 'lucide-react';
import axios from 'axios';
import { useWebSocket } from '../context/WebSocketContext';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectType, setNewProjectType] = useState('local');
  const [searchQuery, setSearchQuery] = useState('');
  const { messages } = useWebSocket();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    repoUrl: '',
    description: '',
    branch: 'main'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();

    // Check if we should open new project dialog
    const action = searchParams.get('action');
    if (action === 'new-local') {
      setShowNewProject(true);
      setNewProjectType('local');
    } else if (action === 'new-github') {
      setShowNewProject(true);
      setNewProjectType('github');
    }
  }, []);

  useEffect(() => {
    // Listen for WebSocket messages
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.type === 'clone_completed') {
      loadProjects();
      setShowNewProject(false);
      resetForm();
    }
  }, [messages]);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (newProjectType === 'local') {
        await axios.post('/api/projects/local', {
          name: formData.name,
          path: formData.path,
          description: formData.description
        });
        await loadProjects();
        setShowNewProject(false);
        resetForm();
      } else {
        await axios.post('/api/github/clone', {
          repoUrl: formData.repoUrl,
          name: formData.name,
          description: formData.description,
          branch: formData.branch
        });
        // Will be handled by WebSocket
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      path: '',
      repoUrl: '',
      description: '',
      branch: 'main'
    });
    setError('');
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="page-description">
            Manage your local and GitHub projects
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewProject(true)}
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-card card card-hover"
            >
              <div className="project-header">
                {project.type === 'github' ? (
                  <Github size={24} />
                ) : (
                  <Folder size={24} />
                )}
                <span className={`badge badge-${project.type === 'github' ? 'primary' : 'success'}`}>
                  {project.type}
                </span>
              </div>
              <h3>{project.name}</h3>
              <p className="project-description">
                {project.description || 'No description'}
              </p>
              <div className="project-meta">
                <div className="project-stats">
                  <span>{project.files?.length || 0} files</span>
                  <span>{(project.analyses || []).length} analyses</span>
                </div>
                {project.type === 'github' && project.git && (
                  <div className="project-branch">
                    <span className="branch-badge">{project.git.currentBranch}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <Folder size={64} />
          <h2>No projects found</h2>
          <p>
            {searchQuery
              ? 'Try a different search term'
              : 'Get started by adding your first project'}
          </p>
          {!searchQuery && (
            <button
              className="btn btn-primary"
              onClick={() => setShowNewProject(true)}
            >
              <Plus size={20} />
              Add Project
            </button>
          )}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProject && (
        <div className="modal-overlay" onClick={() => setShowNewProject(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Project</h2>
              <button
                className="close-button"
                onClick={() => setShowNewProject(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="project-type-tabs">
              <button
                className={`tab ${newProjectType === 'local' ? 'active' : ''}`}
                onClick={() => setNewProjectType('local')}
              >
                <FolderOpen size={20} />
                Local Folder
              </button>
              <button
                className={`tab ${newProjectType === 'github' ? 'active' : ''}`}
                onClick={() => setNewProjectType('github')}
              >
                <Github size={20} />
                GitHub Repository
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {newProjectType === 'local' ? (
                <>
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Project"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Folder Path *</label>
                    <input
                      type="text"
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      placeholder="/absolute/path/to/project"
                      required
                    />
                    <small>Enter the absolute path to your project folder</small>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional project description"
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>GitHub Repository URL *</label>
                    <input
                      type="url"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      placeholder="https://github.com/username/repository"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Auto-detected from repository"
                    />
                    <small>Leave blank to use repository name</small>
                  </div>

                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      placeholder="main"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional project description"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewProject(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
