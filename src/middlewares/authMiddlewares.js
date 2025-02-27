import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// **General Authentication Middleware (For Any User)**
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store user info in request object

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// **Employer Authentication Middleware**
export const authenticateEmployer = async (req, res, next) => {
    try {
        await authenticateUser(req, res, async () => {
            const user = await User.findByPk(req.user.id);
            if (!user || user.user_type !== "Employer") {
                return res.status(403).json({ message: "Access denied: Employers only" });
            }
            next();
        });
    } catch (error) {
        console.error("Employer Authentication Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};