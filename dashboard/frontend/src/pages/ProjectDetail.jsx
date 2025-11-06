import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Play,
  Github,
  RefreshCw,
  Trash2,
  FileText,
  Code
} from 'lucide-react';
import axios from 'axios';
import { useWebSocket } from '../context/WebSocketContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [executing, setExecuting] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const { messages } = useWebSocket();

  useEffect(() => {
    loadProject();
    loadAgents();
  }, [projectId]);

  useEffect(() => {
    // Listen for agent completion
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.type === 'agent_completed') {
      setExecuting(false);
      loadProject(); // Reload to show new analysis
    }
  }, [messages]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await axios.get('/api/agents');
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const handleRunAgent = async () => {
    if (!selectedAgent || !agentPrompt) return;

    setExecuting(true);
    try {
      // Create analysis record
      const analysisResponse = await axios.post('/api/analysis', {
        projectId,
        agentId: selectedAgent,
        name: `${selectedAgent} - ${new Date().toLocaleString()}`
      });

      // Execute agent
      await axios.post(`/api/agents/${selectedAgent}/execute`, {
        projectPath: project.path,
        prompt: agentPrompt,
        config: {}
      });

      // Update analysis status
      await axios.patch(`/api/analysis/${analysisResponse.data.id}`, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error executing agent:', error);
      setExecuting(false);
    }
  };

  const handleRescan = async () => {
    try {
      await axios.post(`/api/projects/${projectId}/scan`);
      await loadProject();
    } catch (error) {
      console.error('Error rescanning project:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`/api/projects/${projectId}`);
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = () => {
    if (!project?.files) return null;

    const fileTree = {};
    project.files.forEach(file => {
      const parts = file.path.split('/');
      let current = fileTree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          if (!current._files) current._files = [];
          current._files.push(file);
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      });
    });

    const renderTree = (tree, level = 0, parentPath = '') => {
      return Object.entries(tree).map(([name, value]) => {
        if (name === '_files') {
          return value.map(file => (
            <div key={file.path} className="file-item" style={{ paddingLeft: `${(level + 1) * 20}px` }}>
              <File size={16} />
              <span>{file.name}</span>
              <span className={`badge badge-${getFileTypeColor(file.type)}`}>{file.type}</span>
            </div>
          ));
        }

        const folderPath = parentPath ? `${parentPath}/${name}` : name;
        const isExpanded = expandedFolders.has(folderPath);

        return (
          <div key={folderPath}>
            <div
              className="folder-item"
              style={{ paddingLeft: `${level * 20}px` }}
              onClick={() => toggleFolder(folderPath)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} />
              <span>{name}</span>
            </div>
            {isExpanded && renderTree(value, level + 1, folderPath)}
          </div>
        );
      });
    };

    return renderTree(fileTree);
  };

  const getFileTypeColor = (type) => {
    const colors = {
      architecture: 'primary',
      characteristics: 'primary',
      code: 'success',
      config: 'warning',
      documentation: 'secondary',
      infrastructure: 'warning'
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2>Project not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/projects')}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/projects')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{project.name}</h1>
            <p className="page-description">{project.description || 'No description'}</p>
          </div>
        </div>
        <div className="header-actions">
          {project.type === 'github' && (
            <button className="btn btn-secondary" onClick={handleRescan}>
              <RefreshCw size={16} />
              Rescan
            </button>
          )}
          <button className="btn btn-error" onClick={handleDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="project-info card">
        <div className="info-grid">
          <div className="info-item">
            <label>Type</label>
            <span className={`badge badge-${project.type === 'github' ? 'primary' : 'success'}`}>
              {project.type}
            </span>
          </div>
          <div className="info-item">
            <label>Path</label>
            <code>{project.path}</code>
          </div>
          {project.type === 'github' && (
            <>
              <div className="info-item">
                <label>Repository</label>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  {project.repoUrl}
                </a>
              </div>
              <div className="info-item">
                <label>Branch</label>
                <span className="branch-badge">{project.branch}</span>
              </div>
            </>
          )}
          <div className="info-item">
            <label>Files</label>
            <span>{project.files?.length || 0} files</span>
          </div>
          <div className="info-item">
            <label>Analyses</label>
            <span>{(project.analyses || []).length} runs</span>
          </div>
        </div>
      </div>

      <div className="project-content">
        {/* File Explorer */}
        <div className="file-explorer card">
          <div className="card-header">
            <h3>Files</h3>
            <span className="file-count">{project.files?.length || 0} files</span>
          </div>
          <div className="file-tree">
            {project.files && project.files.length > 0 ? (
              renderFileTree()
            ) : (
              <div className="empty-state">
                <Folder size={48} />
                <p>No files detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Runner */}
        <div className="agent-runner card">
          <div className="card-header">
            <h3>Run Agent</h3>
            <Play size={20} />
          </div>

          <div className="agent-form">
            <div className="form-group">
              <label>Select Agent</label>
              <select
                value={selectedAgent || ''}
                onChange={(e) => setSelectedAgent(e.target.value)}
                disabled={executing}
              >
                <option value="">Choose an agent...</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedAgent && (
              <>
                <div className="agent-description">
                  {agents.find(a => a.id === selectedAgent)?.description}
                </div>

                <div className="form-group">
                  <label>Prompt</label>
                  <textarea
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    placeholder="Enter your prompt for the agent..."
                    rows={4}
                    disabled={executing}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleRunAgent}
                  disabled={executing || !agentPrompt}
                >
                  {executing ? (
                    <>
                      <div className="spinner-small" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Run Agent
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Analysis History */}
      {project.analyses && project.analyses.length > 0 && (
        <div className="analysis-history card">
          <div className="card-header">
            <h3>Analysis History</h3>
            <span className="count">{project.analyses.length} analyses</span>
          </div>
          <div className="analysis-list">
            {project.analyses.map(analysis => (
              <div key={analysis.id} className="analysis-item">
                <div className="analysis-info">
                  <div className="analysis-name">{analysis.name}</div>
                  <div className="analysis-meta">
                    <span className={`badge badge-${getStatusColor(analysis.status)}`}>
                      {analysis.status}
                    </span>
                    <span className="analysis-date">
                      {new Date(analysis.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {analysis.results && (
                  <button
                    className="btn-icon"
                    onClick={() => navigate(`/analysis/${analysis.id}`)}
                  >
                    <FileText size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    completed: 'success',
    running: 'warning',
    pending: 'secondary',
    failed: 'error'
  };
  return colors[status] || 'secondary';
};

export default ProjectDetail;
