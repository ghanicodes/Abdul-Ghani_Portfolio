import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import Contact from "./model/Contact.js";
import Admin from "./model/Admin.js";
import Project from "./model/Project.js";
import { autoSeedProjects } from "./seedProjects.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(cors());
// Increase JSON payload size limit to support Base64 project image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Email Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NOTIFY_EMAIL,
        pass: process.env.NOTIFY_EMAIL_PASSWORD,
    },
});

// Helper: send email notification on new contact
const sendContactNotification = async ({ name, email, subject, message }) => {
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.NOTIFY_EMAIL}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: `New Contact: ${subject || 'No Subject'} — from ${name}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 24px 32px;">
                    <h2 style="color: #fff; margin: 0; font-size: 20px;">📩 New Contact Form Submission</h2>
                </div>
                <div style="padding: 28px 32px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 100px;">Name</td>
                            <td style="padding: 10px 0; color: #1e293b;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email</td>
                            <td style="padding: 10px 0; color: #1e293b;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Subject</td>
                            <td style="padding: 10px 0; color: #1e293b;">${subject || 'N/A'}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <p style="color: #64748b; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">MESSAGE</p>
                        <p style="color: #1e293b; margin: 0; line-height: 1.6;">${message}</p>
                    </div>
                </div>
                <div style="padding: 16px 32px; background: #f1f5f9; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Abdul Ghani — Portfolio Notification</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Notification email sent successfully.');
    } catch (error) {
        console.error('❌ Failed to send notification email:', error.message);
    }
};

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

        // Send email notification (non-blocking)
        sendContactNotification({ name, email, subject, message });

        res.status(201).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Server error, could not save message" });
    }
});

// ====================================================
// PROJECT API ENDPOINTS
// ====================================================

// Public: Get projects (supports category filter)
app.get('/api/projects', async (req, res) => {
    try {
        const { category } = req.query;
        let filter = { status: 'active' };

        if (category && (category.toLowerCase() === 'mern' || category.toLowerCase() === 'shopify')) {
            filter.category = category.toLowerCase();
        }

        const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Server error while fetching projects" });
    }
});

// Protected: Get all projects for Admin Management
app.get('/api/admin/projects', authenticate, async (req, res) => {
    try {
        const projects = await Project.find().sort({ category: 1, order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error("Error fetching admin projects:", error);
        res.status(500).json({ message: "Server error while fetching admin projects" });
    }
});

// Protected: Create a new project
app.post('/api/admin/projects', authenticate, async (req, res) => {
    try {
        const { title, img, desc, tags, live, github, category, isFeatured, order, status } = req.body;

        if (!title || !img || !desc || !category) {
            return res.status(400).json({ message: "Title, image, description, and category are required." });
        }

        let processedTags = tags;
        if (typeof tags === 'string') {
            processedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        const newProject = new Project({
            title,
            img,
            desc,
            tags: processedTags || [],
            live: live || '',
            github: github || '',
            category: category.toLowerCase(),
            isFeatured: isFeatured !== undefined ? isFeatured : true,
            order: order !== undefined ? Number(order) : 0,
            status: status || 'active'
        });

        await newProject.save();
        res.status(201).json({ message: "Project created successfully!", project: newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: error.message || "Server error while creating project" });
    }
});

// Protected: Update an existing project
app.put('/api/admin/projects/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, img, desc, tags, live, github, category, isFeatured, order, status } = req.body;

        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (title) existingProject.title = title;
        if (img) existingProject.img = img;
        if (desc) existingProject.desc = desc;
        if (tags !== undefined) {
            existingProject.tags = typeof tags === 'string'
                ? tags.split(',').map(t => t.trim()).filter(Boolean)
                : tags;
        }
        if (live !== undefined) existingProject.live = live;
        if (github !== undefined) existingProject.github = github;
        if (category) existingProject.category = category.toLowerCase();
        if (isFeatured !== undefined) existingProject.isFeatured = isFeatured;
        if (order !== undefined) existingProject.order = Number(order);
        if (status) existingProject.status = status;

        await existingProject.save();
        res.json({ message: "Project updated successfully!", project: existingProject });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: error.message || "Server error while updating project" });
    }
});

// Protected: Delete a project
app.delete('/api/admin/projects/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted successfully!" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Server error while deleting project" });
    }
});

const PORT = process.env.PORT || 5000;

connectDb().then(async () => {
    console.log("Database connected successfully");
    await autoSeedProjects();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log("Database connection failed", error);
    process.exit(1);
});
