const express =require( "express");
const mongoose =require( "mongoose");
const dotenv =require ("dotenv"); dotenv.config();
const cors = require("cors");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "API documentation for the Task Manager application",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ["../src/routes/task.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express()

if (!process.env.PORT || !process.env.DATABASE_LINK) {
    throw new Error("Missing env variables!!");
}

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
}));

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);

//middlewares
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes
app.use("/task",taskRoutes);
app.use("/user",userRoutes);

//connecting to database
mongoose
    .connect(process.env.DATABASE_LINK)
    .then(() => console.log("connected to database"))
    .catch((error) => {
        console.error("Error connecting to database", error);
        process.exit(1);
    });

//not found middleware
app.use("*", (req, res, next) => {
    res.status(404).json({ message: " API not found " });
});

//handling middleware error
app.use(
    (err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: "there is something went wrong with your API" });
    }
);
