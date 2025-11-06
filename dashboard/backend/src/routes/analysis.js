import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { projects } from './projects.js';

const router = express.Router();

// Get all analyses for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      analyses: project.analyses || [],
      total: (project.analyses || []).length
    });
  } catch (error) {
    req.app.get('logger').error('Error getting analyses:', error);
    res.status(500).json({ error: 'Failed to get analyses' });
  }
});

// Get specific analysis
router.get('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;

    // Find analysis across all projects
    for (const project of projects.values()) {
      const analysis = (project.analyses || []).find(a => a.id === analysisId);
      if (analysis) {
        return res.json(analysis);
      }
    }

    res.status(404).json({ error: 'Analysis not found' });
  } catch (error) {
    req.app.get('logger').error('Error getting analysis:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

// Create new analysis
router.post('/', async (req, res) => {
  try {
    const { projectId, agentId, name, config } = req.body;

    if (!projectId || !agentId) {
      return res.status(400).json({ error: 'projectId and agentId are required' });
    }

    const project = projects.get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const analysis = {
      id: uuidv4(),
      projectId,
      agentId,
      name: name || `${agentId} - ${new Date().toLocaleString()}`,
      status: 'pending',
      config: config || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      results: null,
      error: null
    };

    if (!project.analyses) {
      project.analyses = [];
    }

    project.analyses.push(analysis);
    projects.set(projectId, project);

    req.app.get('logger').info(`Created analysis: ${analysis.id}`, { projectId, agentId });

    res.status(201).json(analysis);
  } catch (error) {
    req.app.get('logger').error('Error creating analysis:', error);
    res.status(500).json({ error: 'Failed to create analysis' });
  }
});

// Update analysis status
router.patch('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const updates = req.body;

    // Find and update analysis
    for (const project of projects.values()) {
      const analysisIndex = (project.analyses || []).findIndex(a => a.id === analysisId);
      if (analysisIndex !== -1) {
        const analysis = project.analyses[analysisIndex];

        project.analyses[analysisIndex] = {
          ...analysis,
          ...updates,
          id: analysis.id,
          projectId: analysis.projectId,
          createdAt: analysis.createdAt,
          updatedAt: new Date().toISOString()
        };

        projects.set(project.id, project);

        return res.json(project.analyses[analysisIndex]);
      }
    }

    res.status(404).json({ error: 'Analysis not found' });
  } catch (error) {
    req.app.get('logger').error('Error updating analysis:', error);
    res.status(500).json({ error: 'Failed to update analysis' });
  }
});

// Delete analysis
router.delete('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;

    // Find and delete analysis
    for (const project of projects.values()) {
      const analysisIndex = (project.analyses || []).findIndex(a => a.id === analysisId);
      if (analysisIndex !== -1) {
        project.analyses.splice(analysisIndex, 1);
        projects.set(project.id, project);

        req.app.get('logger').info(`Deleted analysis: ${analysisId}`);

        return res.json({ success: true, message: 'Analysis deleted' });
      }
    }

    res.status(404).json({ error: 'Analysis not found' });
  } catch (error) {
    req.app.get('logger').error('Error deleting analysis:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

// Get analysis summary statistics
router.get('/project/:projectId/summary', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const analyses = project.analyses || [];

    const summary = {
      total: analyses.length,
      byStatus: {
        pending: analyses.filter(a => a.status === 'pending').length,
        running: analyses.filter(a => a.status === 'running').length,
        completed: analyses.filter(a => a.status === 'completed').length,
        failed: analyses.filter(a => a.status === 'failed').length
      },
      byAgent: {},
      latestAnalysis: analyses[analyses.length - 1] || null
    };

    // Count by agent
    analyses.forEach(analysis => {
      if (!summary.byAgent[analysis.agentId]) {
        summary.byAgent[analysis.agentId] = 0;
      }
      summary.byAgent[analysis.agentId]++;
    });

    res.json(summary);
  } catch (error) {
    req.app.get('logger').error('Error getting analysis summary:', error);
    res.status(500).json({ error: 'Failed to get analysis summary' });
  }
});

export default router;
