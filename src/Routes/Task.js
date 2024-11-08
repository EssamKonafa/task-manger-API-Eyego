const express = require("express");
const router = express.Router();
const task = require("../controllers/tasks");
const auth = require("../middlewares/auth");

router.post("/", task.addTask);

router.get("/", task.getTasks);

router.get("/:userId", task.getUserTasks);

router.patch("/:taskId/status", task.updateTaskStatus);

router.patch("/:taskId", task.updateTaskContent);

router.delete("/:taskId", task.deleteTask);

module.exports = router;