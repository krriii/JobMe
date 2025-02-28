import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Import User model
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

      const token = jwt.sign(
        { id: newUser.user_id, user_type: newUser.user_type },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Generated token:", token); 


        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// **User Login**
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, user_type: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );


         res.status(200).json({ message: "Login successful", token });
        
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
