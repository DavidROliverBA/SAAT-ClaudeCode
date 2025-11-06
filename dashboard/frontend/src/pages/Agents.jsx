import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import axios from 'axios';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await axios.get('/api/agents');
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading agents...</p>
      </div>
    );
  }

  return (
    <div className="agents-page">
      <div className="page-header">
        <div>
          <h1>SAAT Agents</h1>
          <p className="page-description">
            11 specialized agents for architecture analysis
          </p>
        </div>
      </div>

      <div className="projects-grid">
        {agents.map(agent => (
          <Link
            key={agent.id}
            to={`/agents/${agent.id}`}
            className="project-card card card-hover"
          >
            <div className="project-header">
              <Cpu size={24} />
              <span className="badge badge-primary">{agent.category}</span>
            </div>
            <h3>{agent.name}</h3>
            <p className="project-description">{agent.description}</p>
            <div className="project-stats">
              <span>{agent.tools?.length || 0} tools</span>
              <span>{agent.model}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Agents;
