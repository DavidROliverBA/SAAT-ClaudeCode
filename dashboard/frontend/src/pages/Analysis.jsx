import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import axios from 'axios';
import './Analysis.css';

const Analysis = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [analysisId]);

  const loadAnalysis = async () => {
    try {
      const response = await axios.get(`/api/analysis/${analysisId}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!analysis) return;

    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.name.replace(/[^a-z0-9]/gi, '-')}.json`;
    link.click();
  };

  const handleExportMarkdown = () => {
    if (!analysis || !analysis.results) return;

    let markdown = `# ${analysis.name}\n\n`;
    markdown += `**Agent**: ${analysis.agentId}\n`;
    markdown += `**Date**: ${new Date(analysis.createdAt).toLocaleString()}\n`;
    markdown += `**Status**: ${analysis.status}\n\n`;

    if (analysis.results.summary) {
      markdown += `## Summary\n\n${analysis.results.summary}\n\n`;
    }

    if (analysis.results.details) {
      markdown += `## Details\n\n\`\`\`json\n${JSON.stringify(analysis.results.details, null, 2)}\n\`\`\`\n`;
    }

    const dataBlob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.name.replace(/[^a-z0-9]/gi, '-')}.md`;
    link.click();
  };

  const renderResults = () => {
    if (!analysis.results) return null;

    const results = analysis.results;

    // Architecture characteristics analysis
    if (results.overallScore !== undefined) {
      return (
        <div className="results-content">
          <div className="score-card card">
            <div className="score-header">
              <h2>Overall Architecture Score</h2>
              <div className={`score-value score-${getScoreLevel(results.overallScore)}`}>
                {results.overallScore}/100
              </div>
            </div>
            <div className="score-bar">
              <div
                className={`score-fill score-${getScoreLevel(results.overallScore)}`}
                style={{ width: `${results.overallScore}%` }}
              />
            </div>
          </div>

          {results.summary && (
            <div className="summary-card card">
              <h3>Summary</h3>
              <div className="summary-stats">
                <div className="stat-item stat-success">
                  <CheckCircle size={20} />
                  <span>{results.summary.met || 0} Met</span>
                </div>
                <div className="stat-item stat-warning">
                  <AlertTriangle size={20} />
                  <span>{results.summary.partial || 0} Partial</span>
                </div>
                <div className="stat-item stat-error">
                  <XCircle size={20} />
                  <span>{results.summary.notMet || 0} Not Met</span>
                </div>
              </div>
            </div>
          )}

          {results.topRecommendations && (
            <div className="recommendations-card card">
              <h3>Top Recommendations</h3>
              <div className="recommendations-list">
                {results.topRecommendations.slice(0, 5).map((rec, i) => (
                  <div key={i} className="recommendation-item">
                    <div className="recommendation-header">
                      <span className="recommendation-number">{i + 1}</span>
                      <h4>{rec.title}</h4>
                      <span className={`badge badge-${getSeverityColor(rec.severity)}`}>
                        {rec.severity}
                      </span>
                    </div>
                    <p className="recommendation-description">{rec.description}</p>
                    <div className="recommendation-footer">
                      <span className="effort">Effort: {rec.effort}</span>
                      <span className="characteristic">{rec.characteristic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Security analysis
    if (results.securityScore !== undefined) {
      return (
        <div className="results-content">
          <div className="score-card card">
            <div className="score-header">
              <h2>Security Score</h2>
              <div className={`score-value score-${getScoreLevel(results.securityScore)}`}>
                {results.securityScore}/100
              </div>
            </div>
          </div>

          {results.findings && (
            <div className="findings-card card">
              <h3>Security Findings</h3>
              <div className="findings-stats">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
                  const count = results.findings.filter(f => f.severity === severity).length;
                  return (
                    <div key={severity} className={`stat-item stat-${severity.toLowerCase()}`}>
                      <span className="count">{count}</span>
                      <span>{severity}</span>
                    </div>
                  );
                })}
              </div>

              <div className="findings-list">
                {results.findings.slice(0, 10).map((finding, i) => (
                  <div key={i} className="finding-item">
                    <div className="finding-header">
                      <span className={`badge badge-${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                      <h4>{finding.title}</h4>
                      {finding.cvssScore && (
                        <span className="cvss">CVSS: {finding.cvssScore}</span>
                      )}
                    </div>
                    <p>{finding.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Validation results
    if (results.validationResults) {
      return (
        <div className="results-content">
          <div className="validation-summary card">
            <h3>Validation Summary</h3>
            <div className="validation-stats">
              <div className="stat-item stat-error">
                <XCircle size={20} />
                <span>{results.summary?.errors || 0} Errors</span>
              </div>
              <div className="stat-item stat-warning">
                <AlertTriangle size={20} />
                <span>{results.summary?.warnings || 0} Warnings</span>
              </div>
              <div className="stat-item stat-info">
                <Info size={20} />
                <span>{results.summary?.info || 0} Info</span>
              </div>
            </div>
          </div>

          {results.compliance && (
            <div className="compliance-card card">
              <h3>Compliance Check: {results.compliance.framework}</h3>
              <div className="compliance-result">
                <div className={`compliance-status ${results.compliance.passed ? 'passed' : 'failed'}`}>
                  {results.compliance.passed ? 'PASSED' : 'FAILED'}
                </div>
                <div className="compliance-score">
                  Score: {results.compliance.score}%
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Generic results
    return (
      <div className="results-content">
        <div className="generic-results card">
          <h3>Analysis Results</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      </div>
    );
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'error',
      critical: 'error',
      HIGH: 'warning',
      high: 'warning',
      MEDIUM: 'warning',
      medium: 'warning',
      LOW: 'secondary',
      low: 'secondary'
    };
    return colors[severity] || 'secondary';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading analysis...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="error-container">
        <h2>Analysis not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/projects')}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{analysis.name}</h1>
            <p className="page-description">
              {analysis.agentId} · {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExportMarkdown}>
            <FileText size={16} />
            Export MD
          </button>
          <button className="btn btn-primary" onClick={handleExportJSON}>
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="analysis-info card">
        <div className="info-grid">
          <div className="info-item">
            <label>Status</label>
            <span className={`badge badge-${getStatusColor(analysis.status)}`}>
              {analysis.status}
            </span>
          </div>
          <div className="info-item">
            <label>Agent</label>
            <span>{analysis.agentId}</span>
          </div>
          <div className="info-item">
            <label>Created</label>
            <span>{new Date(analysis.createdAt).toLocaleString()}</span>
          </div>
          {analysis.completedAt && (
            <div className="info-item">
              <label>Completed</label>
              <span>{new Date(analysis.completedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {analysis.results ? (
        renderResults()
      ) : (
        <div className="no-results card">
          <Info size={48} />
          <h3>No Results Available</h3>
          <p>This analysis is still pending or did not generate results.</p>
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

export default Analysis;
