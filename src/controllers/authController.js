import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";
import JobSeeker from "../models/jobSeeker.js";
import Employer from "../models/employer.js";  // Import the Employer model
 import sequelize from "../config/database.js"; // Import sequelize

dotenv.config();

// **User Registration**
// export const registerUser = async (req, res) => {
//     try {
//         const { name, email, password, user_type } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // Hash password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             user_type,
//         });

//         console.log("New user created:", newUser.toJSON());


//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error("Error in registerUser:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

export const registerUser = async (req, res) => {
    const t = await sequelize.transaction(); // Start a transaction
    try {
        const { name, email, password, user_type, company_name, industry, location, website, skills, experience, portfolio_link } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user within the transaction
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            user_type,
        }, { transaction: t });

        console.log("New user created:", newUser.toJSON());

        if (user_type === "Employer") {
            await Employer.create({
                employer_id: newUser.user_id, // Use newUser.user_id as the foreign key
                company_name,
                industry,
                location,
                website
            }, { transaction: t });
        } else if (user_type === "Job Seeker") {
            await JobSeeker.create({
                job_seeker_id: newUser.user_id, // Use newUser.user_id as the foreign key
                skills,
                experience,
                portfolio_link
            }, { transaction: t });
        }

        await t.commit(); // Commit the transaction
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        await t.rollback(); // Rollback the transaction if any error occurred
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message }); // Include error message for debugging

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

