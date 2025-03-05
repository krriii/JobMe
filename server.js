import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import session from 'express-session';
import { syncDatabase } from "./src/models/index.js";
import { fileURLToPath } from 'url';
import authRoutes from "./src/routes/authRoutes.js";
import employerRoutes from "./src/routes/employerRoutes.js";
import jobSeekerRoutes from "./src/routes/jobSeekerRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";

dotenv.config();

// Create an express server
const server = express();

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'src', 'views'));



// Middleware
server.use(express.json()); // To handle JSON requests
server.use(express.urlencoded({ extended: true })); // To handle form data
server.use(express.static(path.join(__dirname, "public"))); // Static files

// Configure sessions
server.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        //httpOnly: true, 
        secure: false } 
}));

// Sync Database
(async () => {
    try {
        await syncDatabase();
        console.log("Database synced successfully!");
    } catch (error) {
        console.error("Database sync failed:", error);
    }
})();

server.use("/api/auth", authRoutes);
server.use("/api/employers", employerRoutes);
server.use("/api/jobSeekers", jobSeekerRoutes);
server.use("/api/jobs", jobRoutes); // Ensure this line is present
server.use("/api/applications", applicationRoutes);

server.get("/", (req, res) => { 
    res.send("JobMe is running...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
