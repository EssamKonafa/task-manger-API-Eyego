const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); dotenv.config();
const cors = require("cors");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/task", taskRoutes);
app.use("/user", userRoutes);

// Connect to Database
mongoose
    .connect(process.env.DATABASE_LINK || "mongodb://localhost:27017/taskManger")
    .then(() => console.log("Connected to database"))
    .catch((error) => {
        console.error("Error connecting to database", error);
        process.exit(1);
    });

// Error handling middleware for not found routes
app.use("*", (req, res, next) => {
    res.status(404).json({ message: "API not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "There is something wrong with your API" });
});

// Start server
app.listen(process.env.PORT || 4000, () =>
    console.log(`Listening on port ${process.env.PORT || 4000}`)
);