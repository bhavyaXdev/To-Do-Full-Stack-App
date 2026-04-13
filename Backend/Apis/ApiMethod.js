import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all tasks for the logged-in user
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST a new task
router.post('/tasks', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task content is required' });
  }

  try {
    const task = new Task({ text, userId: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Creation error:', error);
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// PUT update a task (only owner can update)
router.put('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { text, completed, status } = req.body;

  try {
    const updates = {};
    if (text !== undefined) updates.text = text;
    if (completed !== undefined) updates.completed = completed;
    if (status !== undefined) updates.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },  // ensures ownership
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task (only owner can delete)
router.delete('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
