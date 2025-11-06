import express from 'express';
import simpleGit from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { projects } from './projects.js';

const router = express.Router();

// Clone GitHub repository
router.post('/clone', async (req, res) => {
  try {
    const { repoUrl, name, description, branch } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'repoUrl is required' });
    }

    const logger = req.app.get('logger');
    const wss = req.app.get('wss');

    // Validate GitHub URL
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+(?:\.git)?$/;
    if (!githubRegex.test(repoUrl)) {
      return res.status(400).json({ error: 'Invalid GitHub repository URL' });
    }

    // Extract repo name from URL
    const repoName = name || repoUrl.split('/').pop().replace('.git', '');

    // Create workspace directory
    const workspaceDir = path.join(process.cwd(), 'workspace');
    await fs.mkdir(workspaceDir, { recursive: true });

    const projectId = uuidv4();
    const repoPath = path.join(workspaceDir, projectId);

    logger.info(`Cloning repository: ${repoUrl}`, { projectId, repoPath });

    // Send WebSocket update
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'clone_started',
          projectId,
          repoUrl,
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Clone repository
    const git = simpleGit();
    await git.clone(repoUrl, repoPath, branch ? ['--branch', branch] : []);

    logger.info(`Repository cloned successfully: ${projectId}`);

    // Get repository info
    const gitInfo = await simpleGit(repoPath);
    const remotes = await gitInfo.getRemotes(true);
    const branches = await gitInfo.branchLocal();
    const log = await gitInfo.log({ maxCount: 10 });

    // Scan repository files
    const files = await scanRepository(repoPath);

    // Create project
    const project = {
      id: projectId,
      name: repoName,
      description: description || `GitHub repository: ${repoUrl}`,
      type: 'github',
      path: repoPath,
      repoUrl,
      branch: branches.current,
      files,
      git: {
        remotes: remotes.map(r => ({ name: r.name, url: r.refs.fetch })),
        currentBranch: branches.current,
        branches: branches.all,
        latestCommit: log.latest
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analyses: []
    };

    projects.set(projectId, project);

    // Send completion update
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'clone_completed',
          projectId,
          project,
          timestamp: new Date().toISOString()
        }));
      }
    });

    res.status(201).json(project);
  } catch (error) {
    req.app.get('logger').error('Error cloning repository:', error);

    req.app.get('wss').clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'clone_failed',
          error: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    });

    res.status(500).json({ error: error.message });
  }
});

// Pull latest changes
router.post('/:projectId/pull', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.type !== 'github') {
      return res.status(400).json({ error: 'Project is not a GitHub repository' });
    }

    const logger = req.app.get('logger');
    logger.info(`Pulling latest changes: ${projectId}`);

    const git = simpleGit(project.path);
    const pullResult = await git.pull();

    // Update git info
    const log = await git.log({ maxCount: 10 });
    project.git.latestCommit = log.latest;
    project.updatedAt = new Date().toISOString();

    projects.set(projectId, project);

    res.json({
      success: true,
      summary: pullResult.summary,
      latestCommit: log.latest
    });
  } catch (error) {
    req.app.get('logger').error('Error pulling changes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Switch branch
router.post('/:projectId/checkout', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { branch } = req.body;

    if (!branch) {
      return res.status(400).json({ error: 'branch is required' });
    }

    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.type !== 'github') {
      return res.status(400).json({ error: 'Project is not a GitHub repository' });
    }

    const logger = req.app.get('logger');
    logger.info(`Checking out branch: ${branch}`, { projectId });

    const git = simpleGit(project.path);
    await git.checkout(branch);

    const branches = await git.branchLocal();
    project.branch = branches.current;
    project.git.currentBranch = branches.current;
    project.updatedAt = new Date().toISOString();

    projects.set(projectId, project);

    res.json({
      success: true,
      currentBranch: branches.current
    });
  } catch (error) {
    req.app.get('logger').error('Error checking out branch:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get commit history
router.get('/:projectId/commits', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50 } = req.query;

    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.type !== 'github') {
      return res.status(400).json({ error: 'Project is not a GitHub repository' });
    }

    const git = simpleGit(project.path);
    const log = await git.log({ maxCount: parseInt(limit) });

    res.json({
      commits: log.all,
      total: log.total
    });
  } catch (error) {
    req.app.get('logger').error('Error getting commits:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper: Scan repository files
async function scanRepository(repoPath, maxDepth = 5) {
  const files = [];

  async function scan(dir, depth = 0) {
    if (depth > maxDepth) return;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(repoPath, fullPath);

        // Skip .git, node_modules, etc.
        if (entry.name === '.git' || entry.name === 'node_modules' ||
            entry.name === '.next' || entry.name === 'dist' ||
            entry.name === 'build' || entry.name === 'target') {
          continue;
        }

        if (entry.isDirectory()) {
          await scan(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          const type = detectFileType(ext, entry.name);

          if (type) {
            files.push({
              path: relativePath,
              name: entry.name,
              type,
              size: (await fs.stat(fullPath)).size
            });
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      return;
    }
  }

  await scan(repoPath);
  return files;
}

// Helper: Detect file type
function detectFileType(ext, name) {
  // Architecture files
  if (name === 'architecture.json' || name === 'discovery.json' || name === 'requirements.json') {
    return 'architecture';
  }
  if (name.includes('characteristics') && ext === '.json') {
    return 'characteristics';
  }
  if (name.includes('analysis') && ext === '.json') {
    return 'analysis';
  }

  // Code files
  const codeExts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.cs', '.cpp', '.c', '.h', '.rs'];
  if (codeExts.includes(ext)) {
    return 'code';
  }

  // Config files
  const configFiles = ['package.json', 'pom.xml', 'requirements.txt', 'Cargo.toml', 'go.mod', 'composer.json'];
  if (configFiles.includes(name)) {
    return 'config';
  }

  // Documentation
  if (ext === '.md' || ext === '.txt') {
    return 'documentation';
  }

  // IaC
  if (ext === '.tf' || ext === '.yml' || ext === '.yaml' || name === 'Dockerfile') {
    return 'infrastructure';
  }

  return null;
}

export default router;
