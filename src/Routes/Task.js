const express = require("express")
const router = express.Router()
const task = require('../controllers/tasks')

router.post('/',task.addTask);
router.get('/',task.getTasks);
router.patch("/:taskId",task.updateTask);
router.delete("/:taskId",task.deleteTask)

module.exports= router; 