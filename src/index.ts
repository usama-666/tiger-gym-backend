// src/index.js
const express = require("express");
// import express from "express";
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cors = require("cors");
import { Request, Response } from "express";
// import dotenv from "dotenv";

// import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Body parsing middleware
app.use(express.json()); // To parse JSON requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded requests

//cors

app.use(
    cors({
        origin: ["http://localhost:5174", process.env.CLIENT_URL],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // Allow sending cookies
    })
);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is Running");
});

interface Person {
    name: string;
    age: number;
    greet?: (person: Person) => string; // You can also omit this if it's not used.
}

function greet(person: Person): string {
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

type MailProps = {
    name: string;
    email: string;
    number: string;
    message: string;
};
// Send the email
app.post("/api/send-mail", async (req: Request, res: Response) => {
    const { name, email, number, message }: MailProps = req.body;
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

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.error("❌ Error:", error.message);
        } else {
            console.log("✅ Email sent:", info.response);
        }
    });

    res.status(200).json({ message: "Email Sent Successfully" });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
