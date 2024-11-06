const express =require( "express");
const mongoose =require( "mongoose");
const dotenv =require ("dotenv");
dotenv.config();

const app = express()

if (!process.env.PORT || !process.env.DATABASE_LINK) {
    throw new Error("Missing env variables!!");
}

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);

//connecting to database
mongoose
    .connect(process.env.DATABASE_LINK)
    .then(() => console.log("connected to database"))
    .catch((err) => {
        console.error("Error connecting to the database", err);
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
