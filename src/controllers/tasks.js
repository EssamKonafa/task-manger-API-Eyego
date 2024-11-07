const TaskModel = require("../models/task")

async function addTask(req, res) {
    const { userId, task } = req.body;
    if (!userId) return res.status(400).json({ message: "userID not found" })
    if (!task) return res.status(400).json({ message: "task not found" })
    try {
        const newTask = await TaskModel.create({ userId,task })
        return res.status(201).json(newTask)
    } catch (error) {
        console.error("error while adding task", error);
        return res.status(500).json({ message: "internal server error" })
    }
}

async function getTasks(req, res) {
    try {
        const tasks = await TaskModel.find();
        if (!tasks) return res.status(200).json([]);
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("error getting tasks", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

async function updateTask(req, res) {
    const { taskId } = req.params;
    const { updatedTask } = req.body;
    if (!taskId) return res.status(400).json({ message: "taskId not found" });
    if (!updatedTask) return res.status(400).json({ message: "updatedTask not found" });
    try {
        const task = await TaskModel.findByIdAndUpdate(taskId, { task: updatedTask }, { new: true });
        if (!task) return res.status(404).json({ message: "task not found" });
        return res.status(200).json(task);
    } catch (error) {
        console.error("error updating task", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

async function deleteTask(req, res) {
    const { taskId } = req.params;
    if (!taskId) return res.status(400).json({ message: "taskId not found" });
    try {
        const task = await TaskModel.findByIdAndDelete(taskId);
        if (!task) return res.status(404).json({ message: "task not found or already deleted" });
        return res.status(200).json({ message: "task deleted successfully" });
    } catch (error) {
        console.error("error deleting task", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

module.exports = { addTask, getTasks, updateTask, deleteTask };