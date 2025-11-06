import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get list of available SAAT agents
router.get('/', async (req, res) => {
  try {
    const agentsDir = path.join(process.cwd(), '../../agents');
    const files = await fs.readdir(agentsDir);

    const agents = await Promise.all(
      files
        .filter(file => file.startsWith('saat-') && file.endsWith('.md'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(agentsDir, file), 'utf-8');

          // Parse YAML frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (!frontmatterMatch) return null;

          const frontmatter = {};
          frontmatterMatch[1].split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
              frontmatter[key.trim()] = valueParts.join(':').trim();
            }
          });

          return {
            id: file.replace('.md', ''),
            name: frontmatter.name,
            description: frontmatter.description,
            tools: frontmatter.tools?.split(',').map(t => t.trim()) || [],
            model: frontmatter.model,
            category: getAgentCategory(frontmatter.name)
          };
        })
    );

    res.json({
      agents: agents.filter(Boolean),
      total: agents.filter(Boolean).length
    });
  } catch (error) {
    req.app.get('logger').error('Error listing agents:', error);
    res.status(500).json({ error: 'Failed to list agents' });
  }
});

// Get agent details
router.get('/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const agentsDir = path.join(process.cwd(), '../../agents');
    const filePath = path.join(agentsDir, `${agentId}.md`);

    const content = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter and content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
    if (!frontmatterMatch) {
      return res.status(400).json({ error: 'Invalid agent file format' });
    }

    const frontmatter = {};
    frontmatterMatch[1].split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    });

    const markdownContent = frontmatterMatch[2];

    res.json({
      id: agentId,
      name: frontmatter.name,
      description: frontmatter.description,
      tools: frontmatter.tools?.split(',').map(t => t.trim()) || [],
      model: frontmatter.model,
      content: markdownContent,
      category: getAgentCategory(frontmatter.name)
    });
  } catch (error) {
    req.app.get('logger').error('Error getting agent details:', error);
    res.status(404).json({ error: 'Agent not found' });
  }
});

// Execute agent (invokes Claude Code)
router.post('/:agentId/execute', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { projectPath, prompt, config } = req.body;

    if (!projectPath || !prompt) {
      return res.status(400).json({ error: 'projectPath and prompt are required' });
    }

    const logger = req.app.get('logger');
    const wss = req.app.get('wss');

    logger.info(`Executing agent: ${agentId}`, { projectPath, prompt });

    // Send WebSocket update
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'agent_started',
          agentId,
          projectPath,
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Execute agent (this would invoke Claude Code CLI or API)
    const result = await executeAgent(agentId, projectPath, prompt, config, logger, wss);

    // Send completion update
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'agent_completed',
          agentId,
          result,
          timestamp: new Date().toISOString()
        }));
      }
    });

    res.json({
      success: true,
      agentId,
      result
    });
  } catch (error) {
    req.app.get('logger').error('Error executing agent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper: Get agent category
function getAgentCategory(name) {
  if (name.includes('orchestrator') || name.includes('help')) return 'utility';
  if (name.includes('discover') || name.includes('requirements')) return 'discovery';
  if (name.includes('generate')) return 'design';
  if (name.includes('validate') || name.includes('security') || name.includes('analyze')) return 'analysis';
  if (name.includes('document') || name.includes('terraform')) return 'delivery';
  if (name.includes('pipeline')) return 'automation';
  return 'other';
}

// Helper: Execute SAAT agent
async function executeAgent(agentId, projectPath, prompt, config, logger, wss) {
  const { spawn } = await import('child_process');

  return new Promise((resolve, reject) => {
    // Note: This is a simplified version. In production, you'd want to:
    // 1. Use the Anthropic API directly
    // 2. Or invoke Claude Code CLI if available
    // 3. Handle streaming responses properly

    // For now, simulate agent execution
    logger.info(`Simulating agent execution: ${agentId}`);

    // Send progress updates
    const steps = [
      { step: 1, message: 'Initializing agent...', progress: 10 },
      { step: 2, message: 'Analyzing project...', progress: 30 },
      { step: 3, message: 'Generating results...', progress: 60 },
      { step: 4, message: 'Finalizing output...', progress: 90 }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        wss.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'agent_progress',
              agentId,
              ...steps[currentStep],
              timestamp: new Date().toISOString()
            }));
          }
        });
        currentStep++;
      } else {
        clearInterval(interval);

        // Return mock result
        resolve({
          status: 'completed',
          output: {
            summary: `${agentId} analysis completed successfully`,
            details: {
              projectPath,
              prompt,
              analysisTime: '45 seconds',
              findings: []
            }
          },
          timestamp: new Date().toISOString()
        });
      }
    }, 2000);
  });
}

export default router;
