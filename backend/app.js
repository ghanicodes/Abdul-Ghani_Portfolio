import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import Contact from "./model/Contact.js";
import Admin from "./model/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'default_secret');
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY || 'default_secret', { expiresIn: '1d' });
        res.json({ token, admin: { id: admin._id, username: admin.username, email: admin.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get all contacts (Protected)
app.get('/api/admin/contacts', authenticate, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// API route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email and message are required" });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        res.status(201).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Server error, could not save message" });
    }
});

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log("Database connection failed", error);
    // Don't exit process in case db takes time, but standard is:
    process.exit(1);
});