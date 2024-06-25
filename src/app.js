const express = require('express');
const { signup, login, addingQ, updateQ, deleteQ} = require('../controller/userController.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); 
const { parsingDSL } = require('../DSL/interpreter.js');
const { WebSocketServer } = require('ws');
const http = require('http');
const {authenticateJWT} =require('./jwt.js');
const User = require('../model/user.js'); 

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("public")));
app.use(['/inside', '/run-query','/addQ','/updateQ','/deleteQ'], authenticateJWT);

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
app.post("/signup", signup);

// Endpoint to serve login page
app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/login.html"));
});

// Endpoint to handle login POST request
app.post("/login", login);

app.post('/addQ',addingQ);

app.post('/updateQ',updateQ);

app.post('/deleteQ',deleteQ);

app.get("/inside", (req, res) => {
    res.sendFile(path.resolve("public/query.html"));
});

// Endpoint to handle query submission
app.post("/run-query", async (req, res) => {
    const token = req.headers.authorization;
    const parts = token.split('.');
    const encodedPayload = parts[1];
    const decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf-8');
    const payloadObj = JSON.parse(decodedPayload);
    let query;
    try {
        const currentUser = await User.findOne({ email: payloadObj.email });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        query= currentUser.queries;
    } catch (error) {
        console.error('Error during getting Queries:', error); // Log the error
        res.status(500).json({ message: "Something went wrong" });
    }
    const result=[];
    query.forEach((obj)=>{
        const data ={
            query :obj.queryText,
            string : obj.queryString
        }
        const tresult=parsingDSL(data)
        console.log(`Interpretation result from query ${obj.id}:`, tresult);
        result.push(tresult);
    })

    // console.log(result);
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

module.exports = { server,app };
