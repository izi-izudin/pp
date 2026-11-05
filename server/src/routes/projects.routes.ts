import { Router } from 'express';
import { db } from '../services/db.service.js';
import { triggerNotification } from '../services/whatsapp.service.js';

const router = Router();

// GET /api/projects
router.get('/', (_req, res) => {
  res.json({
    success: true,
    projects: db.getProjects()
  });
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, project });
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const name = req.body.name || req.body.title;
    const { category, description, progress, status, tasks, techStack } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Project name (or title) and category are required' });
    }

    const created = db.createProject({
      name,
      category,
      description: description || '',
      progress: progress || 0,
      status: status || 'Planning',
      tasks: tasks || [],
      techStack: techStack || ['React', 'TypeScript', 'Tailwind CSS']
    });

    if (created.status === 'Completed') {
      await triggerNotification('projectCompleted', {
        title: created.name,
        id: created.id,
        meta: `Category: ${created.category} | Tech: ${created.techStack.join(', ')}`
      });
    }

    res.json({ success: true, project: created });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// PUT /api/projects/:id
router.put('/:id', (req, res) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, project: updated });
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  const deleted = db.deleteProject(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, message: 'Project deleted successfully' });
});

// POST /api/projects/:id/tasks
router.post('/:id/tasks', (req, res) => {
  const { title, assignee } = req.body;
  if (!title) return res.status(400).json({ error: 'Task title is required' });

  const task = db.addTaskToProject(req.params.id, title, assignee);
  if (!task) return res.status(404).json({ error: 'Project not found' });
  const project = db.getProjectById(req.params.id);

  res.json({ success: true, task, project });
});

// PATCH /api/projects/:id/tasks/:taskId/toggle
router.patch('/:id/tasks/:taskId/toggle', (req, res) => {
  const task = db.toggleTask(req.params.id, req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const project = db.getProjectById(req.params.id);
  res.json({ success: true, task, project });
});

// DELETE /api/projects/:id/tasks/:taskId
router.delete('/:id/tasks/:taskId', (req, res) => {
  const deleted = db.deleteTask(req.params.id, req.params.taskId);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  const project = db.getProjectById(req.params.id);
  res.json({ success: true, message: 'Task deleted successfully', project });
});

export default router;
