import express from "express";

const app = express();

app.get("/",(req,res)=>{
    console.log("Welcome to home page");
});

app.get("/signup",(req,res)=>{
    console.log("Welcome to signup page");
})

app.post("/signup",(req,res)=>{
    console.log("Signup Successful");
});

app.get("/login",(req,res)=>{
    console.log("Welcome to login page");
})

app.post("/login",()=>{
    console.log("Login successful");
});

export default app;