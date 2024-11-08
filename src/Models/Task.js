const { Schema, Types, model } = require("mongoose");

const taskSchema = new Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: Types.ObjectId, ref: "User" },
    userName: { type: String },
},
    { timestamps: true }
)

const TaskModel = model("Task", taskSchema);
module.exports = TaskModel;