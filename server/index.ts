import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "./db";
import { sendOTP } from "./mailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me_later";

/* Generates a 6-digit OTP */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ─── Endpoints ─── */

// 1. Request OTP
app.post("/api/auth/request-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const otp = generateOTP();
        // Expiration time: 5 minutes from now
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        // Store securely in DB
        const stmt = db.prepare("INSERT INTO otps (email, otp, expiresAt) VALUES (?, ?, ?)");
        stmt.run(email, otp, expiresAt);

        // Send email using real Gmail (via nodemailer)
        await sendOTP(email, otp);

        res.json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Failed to send OTP. Check email configuration." });
    }
});

// 2. Verify OTP & Issue Token
app.post("/api/auth/verify-otp", (req, res) => {
    const { email, otp, name } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    try {
        // Find the latest valid OTP for this email
        const stmt = db.prepare("SELECT * FROM otps WHERE email = ? AND otp = ? AND expiresAt > datetime('now', 'localtime') ORDER BY id DESC LIMIT 1");
        const record = stmt.get(email, otp);

        if (!record) {
            return res.status(401).json({ error: "Invalid or expired OTP." });
        }

        // Delete the used OTP and any older ones for this email
        db.prepare("DELETE FROM otps WHERE email = ?").run(email);

        // Check if user exists
        let userRow = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

        // If returning user, fine. If new user, they should provide a name (or we fallback)
        if (!userRow) {
            const newName = name && name.trim() ? name.trim() : "New Farmer";
            const insertUser = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
            const result = insertUser.run(newName, email);
            userRow = { id: result.lastInsertRowid, name: newName, email };
        }

        // Generate JWT
        const token = jwt.sign({ id: userRow.id, email: userRow.email, name: userRow.name }, JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "Authentication successful",
            token,
            user: { id: userRow.id, name: userRow.name, email: userRow.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Middleware to protect routes
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

// 3. Get / Update Profile
app.get("/api/user/profile", authenticateToken, (req: any, res: any) => {
    const user = db.prepare("SELECT id, name, email, createdAt FROM users WHERE id = ?").get(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

app.put("/api/user/profile", authenticateToken, (req: any, res: any) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, req.user.id);
    res.json({ message: "Profile updated successfully", user: { ...req.user, name } });
});

// 4. Deactivate Account
app.delete("/api/user/deactivate", authenticateToken, (req: any, res: any) => {
    // Real implementation: remove user entirely
    db.prepare("DELETE FROM users WHERE id = ?").run(req.user.id);
    res.json({ message: "Account deactivated and deleted." });
});

/* ─── Boot Server ─── */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 API Server running securely on http://localhost:${PORT}`);
});
