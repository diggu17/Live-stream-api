const express =require('express');
const { signup, login } = require('../controller/userController.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); 
const {parsingDSL} = require('../DSL/interpreter.js');
const jwt = require('jsonwebtoken'); // import JWT library
const { WebSocketServer } = require('ws');
const http = require('http');

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("public"))); 

const uri = process.env.MONGODB_CONNECTION_URL;
const SECRET_KEY = "123456";

mongoose.connect(uri)
    .then(async () => {
        await console.log("Database connected successfully");
    })
    .catch(async (err) => {
        await console.error(`Error in connecting Database. Err: ${err}`);
        process.exit(1);
    });

// Endpoint to serve signup page
app.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public/signup.html"));
});

// Endpoint to handle signup POST request
app.post("/signup", async (req, res) => {
    const pros = await signup(req,res);
});

// Endpoint to serve login page
app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/login.html"));
});

// Endpoint to handle login POST request
app.post("/login", async (req, res) => {
    try {
        const token = await login(req, res);
        if (token) {
            res.send({ token }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Access denied. No token provided.' });
    }
};

app.get("/inside",authenticateJWT, (req, res) => {
    res.sendFile(path.resolve("public/query.html"));
});

// Endpoint to handle query submission
app.post("/submit-query",authenticateJWT, (req, res) => {
    const data = req.body;
    parsingDSL(data);
    // console.log(req.body);
    res.redirect('/inside');
});

// WebSocket server code (if needed)
/*
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        parsingDSL(data);
        // Optionally, send a response back to the client
        ws.send(JSON.stringify({ status: 'Query processed' }));
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
*/

module.exports = {server};