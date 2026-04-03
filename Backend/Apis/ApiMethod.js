import express from 'express';
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all tasks (from User document)
router.get("/tasks", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Sort tasks by date (latest first)
    const tasks = user.tasks.sort((a, b) => b.createdAt - a.createdAt);
    res.json(tasks);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST a new task (pushing to User document)
router.post("/tasks", auth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Task content is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newTask = { text };
    user.tasks.unshift(newTask); // Push to start of array
    await user.save();
    
    // Send back the first task (the new one)
    res.status(201).json(user.tasks[0]);
  } catch (error) {
    console.error("Creation error:", error);
    res.status(500).json({ error: "Failed to save task" });
  }
});

// PUT update a task (editing User subdocument)
router.put("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const task = user.tasks.id(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    
    await user.save();
    res.json(task);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE a task (pulling from User document)
router.delete("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const task = user.tasks.id(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Use pull to remove the subdocument
    user.tasks.pull(id);
    await user.save();
    
    res.status(204).send();
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
