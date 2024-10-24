"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.js
const express = require("express");
// import express from "express";
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cors = require("cors");
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
// Body parsing middleware
app.use(express.json()); // To parse JSON requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded requests
//cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow sending cookies
}));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server is Running");
});
function greet(person) {
    const str = `Hello ${person.name}, your age is ${person.age}`;
    return str;
}
const result = greet({ name: "John", age: 123 });
// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASWORD,
    },
});
// Send the email
app.post("/api/send-mail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, number, message } = req.body;
    console.log(name, email, number, message);
    if (!email || !number || !message || !name) {
        return res.status(400).json({ message: "All field Required" });
    }
    // Email options
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: `Welcome from TIGER GYM`,
        text: `
        👋 Hello ${name} 🚀,
        
        This Email is to infrom you that Tiger GYM will shortly contact you on Whattsapp if you have any query, 
        Below is Your Number  and Message 
        
        Phone Number : ${number},
        Message : ${message}

        
        You can reply to this Mail 📧💻


        Kind Regards
        Tiger Gym Team`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Error:", error.message);
            return res
                .status(200)
                .json({ error: error, message: "Email Sent Successfully" });
        }
        else {
            console.log("✅ Email sent:", info.response);
            return res.status(200).json({
                data: info.respons,
                message: "Email Sent Successfully",
            });
        }
    });
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
