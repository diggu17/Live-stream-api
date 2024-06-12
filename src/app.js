import express from "express";
import signup from "../controller/userController.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGODB_CONNECTION_URL;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error(`Error in connecting Database. Err: ${err}`);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.send("<h1>Welcome to home page</h1>");
});

app.get("/signup", (req, res) => {
    res.send("<h1>Welcome to Signup page</h1>");
});

app.post("/signup", signup);

app.get("/login", (req, res) => {
    res.send("<h1>Welcome to Login page</h1>");
});

// app.post("/login", login);

export default app;
