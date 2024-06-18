import express from "express";
import { signup, login } from "../controller/userController.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path"; 
import parsingDSL from "../DSL/interpreter.js";

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("public"))); 

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
    res.sendFile(path.resolve("public/index.html")); 
});

app.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public/signup.html"));
});

app.post("/signup", signup);

app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/login.html"));
});

app.post("/login", async (req, res) => {
    await login(req, res);
    res.redirect("/inside");
});

app.get("/inside", (req, res) => {
    res.sendFile(path.resolve("public/query.html"));
});

app.post("/submit-query", (req, res) => {
    const data = req.body;
    parsingDSL(data);
    // console.log(req.body);
    res.redirect('/inside');
});

export default app;
