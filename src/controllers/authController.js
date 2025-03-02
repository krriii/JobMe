import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// **User Registration**
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, user_type } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            user_type,
        });

        console.log("New user created:", newUser.toJSON());

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// **User Login**
export const loginUser = async (email, password) => {
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return null;
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error in loginUser:", error);
        throw new Error("Internal Server Error");
    }
};

// **User Logout**
export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie('connect.sid'); // clear the session cookie
        res.status(200).json({ message: "Logged out successfully" });
    });
};
