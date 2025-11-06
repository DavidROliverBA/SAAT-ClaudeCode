import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory project store (in production, use a database)
const projects = new Map();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projectList = Array.from(projects.values());
    res.json({
      projects: projectList,
      total: projectList.length
    });
  } catch (error) {
    req.app.get('logger').error('Error listing projects:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// Get project by ID
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    req.app.get('logger').error('Error getting project:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Create new project from local folder
router.post('/local', async (req, res) => {
  try {
    const { name, path: folderPath, description } = req.body;

    if (!name || !folderPath) {
      return res.status(400).json({ error: 'name and path are required' });
    }

    // Verify folder exists
    try {
      const stats = await fs.stat(folderPath);
      if (!stats.isDirectory()) {
        return res.status(400).json({ error: 'Path is not a directory' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Folder does not exist' });
    }

    // Scan folder for relevant files
    const files = await scanFolder(folderPath);

    const project = {
      id: uuidv4(),
      name,
      description: description || '',
      type: 'local',
      path: folderPath,
      files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analyses: []
    };

    projects.set(project.id, project);

    req.app.get('logger').info(`Created local project: ${project.id}`, { name, folderPath });

    res.status(201).json(project);
  } catch (error) {
    req.app.get('logger').error('Error creating local project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create project from GitHub repo (handled in github.js)
router.post('/github', async (req, res) => {
  res.status(501).json({ error: 'Use /api/github/clone endpoint instead' });
});

// Update project
router.patch('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    const project = projects.get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = {
      ...project,
      ...updates,
      id: project.id, // Prevent ID change
      createdAt: project.createdAt, // Prevent timestamp change
      updatedAt: new Date().toISOString()
    };

    projects.set(projectId, updatedProject);

    res.json(updatedProject);
  } catch (error) {
    req.app.get('logger').error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projects.has(projectId)) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projects.delete(projectId);

    req.app.get('logger').info(`Deleted project: ${projectId}`);

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    req.app.get('logger').error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Scan project folder
router.post('/:projectId/scan', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projects.get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Rescan folder
    const files = await scanFolder(project.path);

    project.files = files;
    project.updatedAt = new Date().toISOString();

    projects.set(projectId, project);

    res.json({
      success: true,
      files,
      total: files.length
    });
  } catch (error) {
    req.app.get('logger').error('Error scanning project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper: Scan folder for relevant files
async function scanFolder(folderPath, maxDepth = 3) {
  const files = [];

  async function scan(dir, depth = 0) {
    if (depth > maxDepth) return;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(folderPath, fullPath);

        // Skip node_modules, .git, etc.
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }

        if (entry.isDirectory()) {
          await scan(fullPath, depth + 1);
        } else if (entry.isFile()) {
          // Detect file type
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

  await scan(folderPath);
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

  // Code files
  const codeExts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.cs'];
  if (codeExts.includes(ext)) {
    return 'code';
  }

  // Config files
  if (name === 'package.json' || name === 'pom.xml' || name === 'requirements.txt' || name === 'Cargo.toml') {
    return 'config';
  }

  // Documentation
  if (ext === '.md') {
    return 'documentation';
  }

  // IaC
  if (ext === '.tf' || ext === '.yml' || ext === '.yaml') {
    return 'infrastructure';
  }

  return null;
}

export default router;
export { projects };
